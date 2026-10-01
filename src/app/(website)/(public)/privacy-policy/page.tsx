import React from 'react';
import { Metadata } from 'next';
import { AudimentPrivacyClient } from '@/components/legal/AudimentPrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | Audiment',
  description: 'How Audiment collects, uses, and protects personal information on audiment.in.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://audiment.in/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return <AudimentPrivacyClient />;
}
