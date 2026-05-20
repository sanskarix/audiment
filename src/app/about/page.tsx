import Link from 'next/link'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/modem-animated-footer'

export const metadata = {
  title: 'About Audiment | Operational Control Across Multi-Location Businesses',
  description: 'Audiment is audit and inspection software for multi-location businesses. We help operations teams stay on top of quality and compliance across locations through proof-based audits and corrective actions.',
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
            Audit and inspection software for multi-location businesses.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="prose prose-lg dark:prose-invert">
          <h2>Why multi-location operations break as they scale</h2>
          <p>
            Multi-location businesses lose operational control as they scale. Standards drift between locations, managers self-report, issue visibility weakens, and failures surface too late.
          </p>
          <p>
            The pattern is predictable: what worked at 1 or 2 locations breaks at 20 or 200. Operational consistency becomes harder to maintain, quality weakens, and compliance becomes reactive.
          </p>

          <h2>Why self-reporting fails in distributed teams</h2>
          <p>
            Self-reporting creates blind spots. A completed checklist does not prove a standard was actually met. Without evidence and follow-through, reports can look healthy while operational drift is increasing.
          </p>
          <p>
            This is not a motivation problem. It is a system problem. Teams need a way to verify execution quality and close issues consistently across locations.
          </p>

          <h2>What Audiment is built to do</h2>
          <p>
            Audiment helps multi-location businesses stay on top of quality and compliance across locations. It is audit and inspection software built around proof-based operational systems.
          </p>
          <ul>
            <li><strong>Proof-based audits:</strong> Critical checks require evidence, so reported completion reflects real execution.</li>
            <li><strong>Issue visibility:</strong> Teams can see failed standards and recurring risk patterns across locations.</li>
            <li><strong>Corrective actions:</strong> Failures become owned tasks with deadlines and proof of closure.</li>
            <li><strong>Operational patterns:</strong> Trend signals highlight where consistency is weakening before escalation.</li>
            <li><strong>Offline continuity:</strong> Audits continue offline and sync automatically once the device reconnects.</li>
          </ul>
          <p>
            For deeper context, see <Link href="/operational-drift" className="text-primary hover:underline">operational drift</Link>, <Link href="/platform/proof-based-audits" className="text-primary hover:underline">proof-based audits</Link>, and <Link href="/platform/corrective-actions" className="text-primary hover:underline">corrective actions</Link>.
          </p>

          <h2>Who it is for</h2>
          <p>
            Audiment is designed for operations teams managing distributed execution across restaurants, retail chains, hotel groups, franchise networks, healthcare sites, and manufacturing facilities.
          </p>
          <p>
            The strongest fit is businesses with 10-500+ locations that need operational consistency, accountability, and compliance readiness without relying on paper and chat threads.
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
