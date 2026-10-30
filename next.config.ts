import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(self), microphone=(self), geolocation=(self)'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseapp.com https://*.googleapis.com https://app.cal.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://app.cal.com",
      "font-src 'self' https://fonts.gstatic.com https://api.fontshare.com https://app.cal.com",
      "img-src 'self' data: blob: https://res.cloudinary.com https://*.googleapis.com https://*.googleusercontent.com https://firebasestorage.googleapis.com https://app.cal.com https://*.cal.com https://www.googletagmanager.com https://*.google-analytics.com",
      "connect-src 'self' https://api.cloudinary.com https://*.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net wss://*.firebaseio.com https://app.cal.com https://*.cal.com https://www.googletagmanager.com https://*.google-analytics.com https://analytics.google.com",
      "frame-src 'self' https://*.firebaseapp.com https://app.cal.com https://*.cal.com https://www.googletagmanager.com",
      "media-src 'self' blob:;",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
];

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "html.tailus.io",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-icons', 'recharts', '@tabler/icons-react', 'date-fns'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return [
      // www → non-www canonical redirect (fixes all www.audiment.in GSC issues)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.audiment.in' }],
        destination: 'https://audiment.in/:path*',
        permanent: true,
      },
      // /blogs alias redirect
      {
        source: '/blogs',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blogs/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      // Existing path redirects
      {
        source: '/solutions/restaurant-operations',
        destination: '/solutions/restaurant-audit-software',
        permanent: true,
      },
      {
        source: '/solutions/retail-operations',
        destination: '/solutions/retail-audit-software',
        permanent: true,
      },
      {
        source: '/solutions/franchise-operations',
        destination: '/solutions/franchise-audit-software',
        permanent: true,
      },
      {
        source: '/solutions/fssai-compliance-software',
        destination: '/solutions/food-safety-audit-software',
        permanent: true,
      },
      {
        source: '/use-cases/mobile-audit-app',
        destination: '/use-cases/audit-checklist-software',
        permanent: true,
      },
      {
        source: '/blog/what-is-operational-audit',
        destination: '/blog/what-is-operational-auditing',
        permanent: true,
      },
      {
        source: '/franchise-compliance-software',
        destination: '/blog/franchise-compliance-software',
        permanent: true,
      },
      {
        source: '/franchise-operations-software',
        destination: '/blog/franchise-operations-software',
        permanent: true,
      },
      {
        source: '/franchise-audit-checklists',
        destination: '/blog/franchise-audit-checklists',
        permanent: true,
      },
      {
        source: '/franchise-compliance',
        destination: '/blog/franchise-compliance',
        permanent: true,
      },
      {
        source: '/franchise-standards',
        destination: '/blog/franchise-standards',
        permanent: true,
      },
      {
        source: '/franchise-marketing-compliance',
        destination: '/blog/franchise-marketing-compliance',
        permanent: true,
      },
      // 404 URL fixes & legacy alias redirects
      {
        source: '/blog/pre-audit-readiness-how-to-prepare-for-an-audit',
        destination: '/blog/iso-9001-auditing-audit-readiness',
        permanent: true,
      },
      {
        source: '/solutions/compliance',
        destination: '/use-cases/multi-location-compliance',
        permanent: true,
      },
      {
        source: '/blog/what-is-a-compliance-audit',
        destination: '/blog/how-to-perform-a-compliance-audit',
        permanent: true,
      },
      {
        source: '/compare/audiment-vs-safetyculture-iauditor',
        destination: '/compare/audiment-vs-safetyculture',
        permanent: true,
      },
      {
        source: '/use-cases/field-audit-app',
        destination: '/use-cases/audit-checklist-software',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
