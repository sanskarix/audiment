import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getCallerInfo, unauthorized } from '@/lib/auth-server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_PHOTO_SIZE = 1024 * 1024; // 1 MB
const MAX_FREE_PHOTOS_PER_MONTH = 150;

// POST: Upload a file – any authenticated user (auditor, manager, admin)
export async function POST(request: Request) {
  // ── Security: verify caller is authenticated ───────────────────────────────
  const caller = await getCallerInfo(request);
  if (!caller) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const resourceType = (formData.get('type') as string) || 'auto';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();

    // ── 1. Enforce 1MB size limit for non-video files ─────────────────────────
    if (bytes.byteLength > MAX_PHOTO_SIZE && resourceType !== 'video') {
      return NextResponse.json(
        { error: 'File size exceeds the 1MB limit. Please capture using the in-app camera.' },
        { status: 413 }
      );
    }

    // ── 2. Free Plan Guardrails ──────────────────────────────────────────────
    const isFreePlan = (caller.plan || 'free').toLowerCase() === 'free';
    const currentYYYYMM = new Date().toISOString().slice(0, 7).replace('-', '');
    const usageRef = adminDb.collection('usage').doc(`${caller.organizationId}_${currentYYYYMM}`);

    if (isFreePlan) {
      // Free accounts cannot upload video sweeps (Flashmob is Pro/Enterprise only)
      if (resourceType === 'video') {
        return NextResponse.json(
          {
            error: 'Flashmob video verification is an Audiment Pro feature.',
            code: 'FEATURE_PAID',
          },
          { status: 403 }
        );
      }

      // Check monthly photo quota (150 photos/mo)
      const usageSnap = await usageRef.get();
      const photosUploaded = usageSnap.exists ? Number(usageSnap.data()?.photosUploaded || 0) : 0;

      if (photosUploaded >= MAX_FREE_PHOTOS_PER_MONTH) {
        return NextResponse.json(
          {
            error: `Monthly quota of ${MAX_FREE_PHOTOS_PER_MONTH} photos reached for this Free workspace.`,
            code: 'LIMIT_PHOTOS',
          },
          { status: 403 }
        );
      }
    }

    const buffer = Buffer.from(bytes);

    // ── 3. Upload to Cloudinary using a Promisified stream ───────────────────
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'audits',
          resource_type: resourceType as any,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      const { Readable } = require('stream');
      const readableTrack = new Readable({
        read() {
          this.push(buffer);
          this.push(null);
        },
      });
      readableTrack.pipe(uploadStream);
    });

    // ── 4. Increment usage counter for free accounts ─────────────────────────
    if (isFreePlan && resourceType !== 'video') {
      await usageRef.set(
        {
          organizationId: caller.organizationId,
          month: currentYYYYMM,
          photosUploaded: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    return NextResponse.json(
      {
        // @ts-ignore
        url: uploadResult.secure_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
