import React from 'react';
import { Metadata } from 'next';
import { AudimentTermsClient } from '@/components/legal/AudimentTermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service | Audiment',
  description: 'Terms and conditions governing your use of Audiment and audiment.in.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://audiment.in/terms-of-service' },
};

export default function TermsOfServicePage() {
  return <AudimentTermsClient />;
}
