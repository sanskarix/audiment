import { Metadata } from 'next';
import { GoogleAnalyticsTag } from '@/components/GoogleAnalyticsTag';
import { DashboardAnalyticsTracker } from '@/components/DashboardAnalyticsTracker';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoogleAnalyticsTag consentDefaultStrategy="afterInteractive" />
      <DashboardAnalyticsTracker />
      {children}
    </>
  );
}
