import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Audiment'
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
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: 'white', fontSize: 120, fontWeight: 'bold' }}>Audiment</div>
      </div>
    ),
    {
      ...size,
    }
  )
}
