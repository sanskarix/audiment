"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useConsent } from "@/components/ConsentProvider";
import { isPublicAnalyticsRoute } from "@/lib/dataLayer";

const GTM_ID = "GTM-TGWKM9RM";

export function PublicGtm() {
  const pathname = usePathname();
  const { consent, hasDecision } = useConsent();

  // 1. Route Restriction: Must be a public website route
  if (!isPublicAnalyticsRoute(pathname)) {
    return null;
  }

  // 2. BASIC Consent Mode: GTM must NOT load before a consent decision has been made
  if (!hasDecision) {
    return null;
  }

  // 3. BASIC Consent Mode: GTM loads ONLY if analytics or marketing consent is granted
  const isConsentGranted = consent.analytics || consent.marketing;
  if (!isConsentGranted) {
    return null;
  }

  return (
    <Script
      id="gtm-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `,
      }}
    />
  );
}
