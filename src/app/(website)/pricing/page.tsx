import { buildPageMeta } from '@/lib/seo';
import PricingClient from '@/components/website/PricingClient';

export const metadata = buildPageMeta({
  title: 'Pricing | Audiment — Multi-Location Audit Software',
  description:
    'Transparent audit management software pricing: Free forever for 1 location (3 auditors, 25 audits/mo) or custom Pro pricing per location with unlimited users, 48-hour CAPA SLAs, and zero per-seat fees.',
  path: '/pricing',
  keywords: [
    'audiment pricing',
    'audit management software pricing',
    'free audit software',
    'multi-location audit software cost',
    'audit software per location pricing',
    'audit management free tier limits',
    'safetyculture alternative pricing',
  ],
});

const pricingStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://audiment.in/pricing/#webpage',
      url: 'https://audiment.in/pricing',
      name: 'Audiment Pricing — Free & Pro Tiers for Multi-Location Operations',
      description:
        'Official pricing guide for Audiment audit software. Free tier for 1 location (3 auditors, 25 audits/month) and Pro plan with custom flat per-location pricing, unlimited frontline users, and automated 48-hour CAPA SLAs.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://audiment.in/#website',
        name: 'Audiment',
        url: 'https://audiment.in',
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://audiment.in',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Pricing',
            item: 'https://audiment.in/pricing',
          },
        ],
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://audiment.in/#software',
      name: 'Audiment',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android (PWA)',
      description:
        'Audit management and operational compliance software built for multi-location businesses. Features mandatory live photo evidence, GPS verification, automated 48-hour corrective action SLAs, and flat per-location pricing.',
      publisher: {
        '@type': 'Organization',
        '@id': 'https://audiment.in/#organization',
        name: 'Audiment',
        url: 'https://audiment.in',
      },
      offers: [
        {
          '@type': 'Offer',
          '@id': 'https://audiment.in/pricing/#offer-free',
          name: 'Audiment Free Plan',
          category: 'Free Tier',
          price: '0',
          priceCurrency: 'INR',
          priceValidUntil: '2028-12-31',
          availability: 'https://schema.org/InStock',
          url: 'https://audiment.in/pricing',
          description:
            'Free forever plan for 1 location. Includes 1 location, up to 3 auditors, 25 audits per month, 3 custom audit templates, live in-app photo & video proof, and GPS submission verification. No credit card required.',
          eligibleQuantity: {
            '@type': 'QuantitativeValue',
            value: 1,
            unitText: 'Location',
          },
          itemOffered: {
            '@type': 'Service',
            name: 'Audiment Single-Location Free Inspection Tier',
          },
        },
        {
          '@type': 'Offer',
          '@id': 'https://audiment.in/pricing/#offer-pro',
          name: 'Audiment Pro Plan',
          category: 'Paid Tier / Enterprise',
          priceCurrency: 'INR',
          price: 'Contact for Quote',
          availability: 'https://schema.org/InStock',
          url: 'https://audiment.in/pricing',
          description:
            'Unlimited paid tier for multi-location businesses. Flat per-location monthly pricing with volume tiers. Includes unlimited locations, unlimited auditors (zero per-seat charges), unlimited monthly audits, automated 48-hour SLA CAPAs, multi-branch rollups, trend detection, surprise audits, FSSAI blueprints, branded PDF reports, and RBAC.',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            priceType: 'https://schema.org/Subscription',
            unitText: 'Location / Month',
            description:
              'Custom flat rate per location per month based on total location volume with unlimited users.',
          },
          itemOffered: {
            '@type': 'Service',
            name: 'Audiment Multi-Location Operational Accountability Platform',
          },
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://audiment.in/pricing/#faq',
      isPartOf: {
        '@id': 'https://audiment.in/pricing/#webpage',
      },
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can I use Audiment for free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Audiment Free is completely free forever with no credit card required. It is designed for single-location operations to run proof-based audits, capture photo evidence, and verify standards with up to 3 auditors and 25 audits per month.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is the Paid plan priced?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Paid plan is priced on a flat rate per location per month, with volume discounts applied as your network scales. You get unlimited users, auditors, audits, and templates across all your branches with no per-seat fees.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Audiment charge per user or per location?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Audiment charges per location, not per user. You can invite all your branch managers, assistant managers, field inspectors, and HQ leadership without paying extra per-seat fees.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens when our business grows beyond 1 location?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When you are ready to expand to multiple locations, you can upgrade to the Paid plan with a quick call. All your existing templates, audit histories, and photo proof transfer seamlessly with zero downtime.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is included in "Get a quote"?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A 20-minute operational walkthrough with our team. We review your branch count, team structure, and compliance checklists, and deliver a tailored proposal within the same business day.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are there any hidden setup fees or storage surcharges?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. There are no setup fees, no onboarding surcharges, and no media storage overage charges. High-resolution photo and video evidence storage is included in your plan.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does Audiment pricing compare to SafetyCulture (iAuditor)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SafetyCulture charges $19 to $29 per user per month. For a 30-location brand with 3 users per store, SafetyCulture can cost $2,000 to $3,500+ every month. Audiment charges a predictable rate per location with unlimited users, typically reducing software spend by 50% to 70%.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can we test the Paid plan across our team before committing?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You can start immediately on the Free plan for 1 location. For multi-unit businesses evaluating the Paid plan, our team provides an assisted trial across selected branches during your onboarding walkthrough.',
          },
        },
      ],
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingStructuredData) }}
      />
      <PricingClient />
    </>
  );
}
