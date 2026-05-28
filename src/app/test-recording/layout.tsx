import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Recording | Audiment',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestRecordingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
