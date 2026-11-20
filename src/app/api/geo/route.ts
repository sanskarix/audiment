import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const headerList = await headers();
    const country =
      headerList.get('x-vercel-ip-country') ||
      headerList.get('cf-ipcountry') ||
      null;

    return NextResponse.json({ country });
  } catch {
    return NextResponse.json({ country: null });
  }
}
