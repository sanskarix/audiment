import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extracts the Cloudinary public_id from a Cloudinary secure_url.
 * Example URL:
 * https://res.cloudinary.com/demo/image/upload/v1234567890/audits/sample.jpg
 * -> audits/sample
 */
function extractPublicId(url: string): string | null {
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const pathWithVersion = parts[1];
    // Remove version prefix if present (e.g., v1234567890/)
    const withoutVersion = pathWithVersion.replace(/^v\d+\//, '');
    // Remove file extension
    const dotIndex = withoutVersion.lastIndexOf('.');
    return dotIndex !== -1 ? withoutVersion.substring(0, dotIndex) : withoutVersion;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  // Validate Vercel Cron or external caller secret
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Database uninitialized' }, { status: 500 });
    }

    // 1. Get all free organization IDs
    const freeOrgsSnap = await adminDb
      .collection('organizations')
      .where('plan', '==', 'free')
      .get();

    if (freeOrgsSnap.empty) {
      return NextResponse.json({ success: true, message: 'No free organizations found.' });
    }

    const freeOrgIds = new Set(freeOrgsSnap.docs.map((doc) => doc.id));

    // 2. Compute 30 days ago threshold
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgoTimestamp = Timestamp.fromDate(thirtyDaysAgo);

    // 3. Find audit responses older than 30 days that still have an active photoUrl
    // Querying in batches to keep reads & memory light
    const responsesSnap = await adminDb
      .collection('auditResponses')
      .where('createdAt', '<', thirtyDaysAgoTimestamp)
      .limit(100)
      .get();

    let deletedPhotosCount = 0;

    for (const doc of responsesSnap.docs) {
      const data = doc.data();
      const orgId = data.organizationId;
      const photoUrl = data.photoUrl;

      // Only purge media for Free Plan tenants
      if (orgId && freeOrgIds.has(orgId) && photoUrl && typeof photoUrl === 'string') {
        const publicId = extractPublicId(photoUrl);

        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (destroyErr) {
            console.error(`[media-cleanup] Failed to destroy Cloudinary asset ${publicId}:`, destroyErr);
          }
        }

        // Update document: set photoUrl to null, mark as expired
        await doc.ref.update({
          photoUrl: null,
          photoExpired: true,
          photoDeletedAt: FieldValue.serverTimestamp(),
        });

        deletedPhotosCount++;
      }
    }

    return NextResponse.json({
      success: true,
      deletedPhotosCount,
      evaluatedResponsesCount: responsesSnap.size,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[media-cleanup] Error running media retention cleanup:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

