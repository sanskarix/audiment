import { ConsentProvider } from "@/components/ConsentProvider";
import { ConsentBanner } from "@/components/ConsentBanner";
import { GoogleAnalyticsTag } from "@/components/GoogleAnalyticsTag";
import { PublicGtm } from "@/components/PublicGtm";
import { PublicPageviewTracker } from "@/components/PublicPageviewTracker";

/**
 * Enables GA4, GTM, Consent Mode v2, and pageview tracking exclusively for /signup
 * without exposing analytics or cookie banners on /dashboard/* or /login.
 */
export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConsentProvider>
      <GoogleAnalyticsTag consentDefaultStrategy="afterInteractive" />
      <PublicGtm />
      <PublicPageviewTracker />
      {children}
      <ConsentBanner />
    </ConsentProvider>
  );
}
