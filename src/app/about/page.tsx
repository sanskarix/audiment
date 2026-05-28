import Link from 'next/link'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/modem-animated-footer'

export const metadata = {
  title: 'About Audiment | Audit Management for Multi-Location Businesses',
  description: 'Audiment is audit management software for multi-location businesses. Run audits across every location with proof, tracking, and corrective actions.',
  alternates: { canonical: 'https://audiment.in/about' }
}

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Audiment",
    "url": "https://audiment.in",
    "logo": "https://audiment.in/icon.svg",
    "email": "hello@audiment.com",
    "sameAs": [
      "https://www.linkedin.com/company/audiment",
      "https://twitter.com/audiment"
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-32 pb-20 border-b border-border text-center bg-muted/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-balance text-heading">
            About Audiment
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Audit management software for multi-location businesses.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="prose prose-lg dark:prose-invert">
          <h2>Why multi-location operations break as they scale</h2>
          <p>
            When you had one or two locations, you could see everything yourself. At 20 or 200, you can&apos;t. Standards drift, managers self-report, issues stay hidden, and problems surface too late.
          </p>

          <h2>Why self-reporting fails in distributed teams</h2>
          <p>
            A completed checklist doesn&apos;t prove a standard was actually met. Without photo evidence and tracked follow-through, reports can look healthy while quality is slipping. This isn&apos;t a motivation problem – it&apos;s a system problem.
          </p>

          <h2>What Audiment is built to do</h2>
          <p>
            Audiment helps you run audits across every location with proof, tracking, and accountability.
          </p>
          <ul>
            <li><strong>Proof-based audits:</strong> Critical checks require photo or video evidence before they can be marked complete.</li>
            <li><strong>Issue tracking:</strong> Failed standards become tracked issues so you can see what&apos;s broken and where.</li>
            <li><strong>Corrective actions:</strong> Every failure becomes an assigned task with a deadline and proof of closure.</li>
            <li><strong>Trend detection:</strong> See which locations keep scoring low and where the same issues keep recurring.</li>
            <li><strong>Offline audits:</strong> Audits run offline and sync automatically when the device reconnects.</li>
          </ul>
          <p>
            For deeper context, see <Link href="/operational-drift" className="text-primary hover:underline">operational drift</Link>, <Link href="/platform/proof-based-audits" className="text-primary hover:underline">proof-based audits</Link>, and <Link href="/platform/corrective-actions" className="text-primary hover:underline">corrective actions</Link>.
          </p>

          <h2>Who it is for</h2>
          <p>
            Audiment is built for founders and operations teams who run multi-location businesses and need to know what&apos;s actually happening on the ground.
          </p>
          <p>
            The strongest fit is businesses with 10–500+ locations that can&apos;t rely on paper checklists and WhatsApp threads to maintain standards.
          </p>

          <h2>Industries served</h2>
          <ul>
            <li>Quick service restaurants (QSR) and restaurant chains</li>
            <li>Retail chains and multi-store operations</li>
            <li>Hotels and hospitality groups</li>
            <li>Franchise networks</li>
            <li>Food safety and FSSAI compliance</li>
            <li>Manufacturing and production facilities</li>
          </ul>

          <h2>Built by Asellus LLP</h2>
          <p>
            Audiment is developed by Asellus LLP. The platform runs in any mobile browser with no app download required.
          </p>

          <h2>Get in touch</h2>
          <p>
            For inquiries, demos, or partnership discussions:<br />
            <strong>Email:</strong> <a href="mailto:hello@audiment.com" className="text-primary hover:underline">hello@audiment.com</a>
          </p>
        </div>

      </section>

      <Footer
        brandName="Audiment"
        navLinks={[
          { label: "Features", href: "/#features" },
          { label: "How it works", href: "/#how-it-works" },
          { label: "Use cases", href: "/#use-cases" },
          { label: "Blog", href: "/blog" },
          { label: "Contact", href: "/#contact" },
          { label: "Privacy policy", href: "/privacy-policy" },
          { label: "Cookie policy", href: "/cookie-policy" },
          { label: "Terms of service", href: "/terms-of-service" },
        ]}
      />

      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  )
}
