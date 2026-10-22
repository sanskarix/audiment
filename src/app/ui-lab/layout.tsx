import type { Metadata } from 'next';
import '@/styles/app.css';

export const metadata: Metadata = {
  title: 'Audiment UI Lab — Visual Inventory',
  robots: {
    index: false,
    follow: false,
  },
};

export default function UiLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-full font-sans antialiased bg-[#FBFBFA] dark:bg-[#121212]">
        {children}
      </body>
    </html>
  );
}
