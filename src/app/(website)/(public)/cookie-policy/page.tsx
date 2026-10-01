import React from 'react';
import { Metadata } from 'next';
import { AudimentCookieClient } from '@/components/legal/AudimentCookieClient';

export const metadata: Metadata = {
  title: 'Cookie Policy | Audiment',
  description: 'How Audiment uses cookies and tracking technologies on audiment.in.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://audiment.in/cookie-policy' },
};

export default function CookiePolicyPage() {
  return <AudimentCookieClient />;
}
