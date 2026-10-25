import Script from 'next/script';
import { buildPageMeta } from '@/lib/seo';
import { AudimentAboutClient } from '@/components/about/AudimentAboutClient';

export const metadata = buildPageMeta({
  title: 'About Audiment | Audit Management Software for Multi-Location Businesses',
  description: 'Audiment is audit management software built for multi-location businesses. Learn about our mission, who we serve, and how proof-based audits help distributed teams maintain standards.',
  path: '/about',
  keywords: ['about Audiment', 'audit management company', 'multi-location audit software', 'Asellus LLP', 'proof-based audit software India'],
});

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://audiment.in/about/#aboutpage",
  "name": "About Audiment",
  "url": "https://audiment.in/about",
  "description": "Audiment is audit management software built by Asellus LLP for multi-location businesses. Proof-based audits, issue tracking, and corrective actions maintain quality consistency across distributed operations.",
  "isPartOf": {
    "@id": "https://audiment.in/#website"
  },
  "about": {
    "@id": "https://audiment.in/#organization"
  },
  "publisher": {
    "@id": "https://audiment.in/#organization"
  }
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <AudimentAboutClient />
    </>
  );
}
