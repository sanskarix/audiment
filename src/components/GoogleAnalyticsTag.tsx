import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/dataLayer";

interface GoogleAnalyticsTagProps {
  /**
   * Use "beforeInteractive" in root layouts (e.g., (website)/layout.tsx) and
   * "afterInteractive" in nested route layouts (e.g., (app)/signup/layout.tsx).
   */
  consentDefaultStrategy?: "beforeInteractive" | "afterInteractive";
}

/**
 * Loads Google Consent Mode v2 defaults and the GA4 gtag.js snippet.
 * Guards prevent duplicate consent defaults or duplicate gtag('config') calls.
 */
export function GoogleAnalyticsTag({
  consentDefaultStrategy = "afterInteractive",
}: GoogleAnalyticsTagProps) {
  return (
    <>
      <Script id="google-consent-defaults" strategy={consentDefaultStrategy}>
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){dataLayer.push(arguments);};
          if (!window.__audimentConsentDefaultSet) {
            window.__audimentConsentDefaultSet = true;
            window.gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          }
        `}
      </Script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){dataLayer.push(arguments);};
          if (!window.__audimentGaConfigured) {
            window.__audimentGaConfigured = true;
            window.gtag('js', new Date());
            window.gtag('config', '${GA_MEASUREMENT_ID}');
          }
        `}
      </Script>
      <Script
        id="google-analytics-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
    </>
  );
}
