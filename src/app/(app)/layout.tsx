import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "@/styles/app.css";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { AppProviders } from "@/components/AppProviders";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Audiment App',
    default: 'Audiment App',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-full flex flex-col typography-scope" suppressHydrationWarning>
        <Script id="silence-abort-error" strategy="beforeInteractive">
          {`
            (function() {
              const originalError = console.error;
              console.error = function(...args) {
                const msg = args.join(' ');
                if (
                  msg.includes('AbortError') || 
                  msg.includes('signal is aborted') || 
                  msg.includes('signal was aborted') ||
                  msg.includes('The user aborted a request')
                ) {
                  return;
                }
                originalError.apply(console, args);
              };
            })();
          `}
        </Script>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
