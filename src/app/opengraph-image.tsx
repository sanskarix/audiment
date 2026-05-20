import { ImageResponse } from 'next/og'

export const alt = 'Audiment - Audit Management Software'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#fafafa',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '16px solid #10b981', // emerald-500
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: '#171717', fontSize: 130, fontWeight: '800', letterSpacing: '-0.05em' }}>
            Audiment
          </div>
          <div style={{ color: '#525252', fontSize: 40, marginTop: 20, fontWeight: '500', textAlign: 'center', padding: '0 80px' }}>
            Audit Management Software for Multi-Location Businesses
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
