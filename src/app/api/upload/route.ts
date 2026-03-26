import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using a Promisified stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'audits',
          resource_type: 'auto',
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
        }
      });
      readableTrack.pipe(uploadStream);
    });

    return NextResponse.json({ 
      // @ts-ignore
      url: uploadResult.secure_url 
    }, { status: 200 });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
