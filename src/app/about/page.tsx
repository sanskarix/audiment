import Link from 'next/link'

export const metadata = {
  title: 'About Audiment – Enterprise Audit Management Software for Multi-Location Businesses',
  description: 'Audiment is an enterprise platform transforming how multi-location businesses execute audits, track compliance, and enforce brand standards worldwide.',
  alternates: { canonical: 'https://audiment.com/about' }
}

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Audiment",
    "url": "https://audiment.com",
    "logo": "https://audiment.com/logo.png",
    "email": "hello@audiment.com",
    "sameAs": [
      "https://www.linkedin.com/company/audiment",
      "https://twitter.com/audiment"
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="pt-32 pb-20 border-b border-border text-center bg-muted/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-balance text-heading">
            About Audiment
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Enterprise Audit Management Software for Multi-Location Businesses
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="prose prose-lg dark:prose-invert">
          <h2>What is Audiment?</h2>
          <p>
            Audiment is an enterprise-grade compliance and audit management platform designed explicitly for fast-scaling multi-location businesses. Founded with a vision to eradicate operational blind spots, Audiment provides a secure, centralized digital infrastructure that empowers global brands to manage quality control, food safety, and brand standards comprehensively across hundreds of disparate locations seamlessly.
          </p>
          <p>
            By replacing outdated paper processes and manual spreadsheets with intuitive mobile applications and intelligent automated workflows, Audiment fundamentally shifts how operations executives collect, analyze, and act upon field intelligence data in real-time.
          </p>

          <h2>The Problem We Solve</h2>
          <p>
            When a business scales beyond a single location, entropy inevitably sets in. Corporate leadership loses physical visibility, relying heavily on delayed reports and subjective regional manager assessments that are often fraught with "pencil whipping"–the act of falsifying compliance checklists to avoid scrutiny. Audiment solves this execution gap. By mandating geo-tagged photo evidence and automating corrective interventions immediately when a standard fails, Audiment ensures that what corporate dictates is definitively what occurs on the front line.
          </p>

          <h2>Key Features</h2>
          <ul>
            <li><strong>Intelligent Mobile Checklists:</strong> Dynamic logical branches that adapt to auditor input efficiently.</li>
            <li><strong>Flash Verification:</strong> Undeniable geo-fenced and facial recognition integration actively preventing forged inspections.</li>
            <li><strong>Automated CAPA Workflows:</strong> Strict SLA-tracked Corrective and Preventive Action generation natively integrated.</li>
            <li><strong>Real-Time Analytics Dashboard:</strong> Instantaneous regional comparative scoring empowering data-driven executive oversight.</li>
            <li><strong>Offline-First Execution:</strong> Flawless auditing in deep freezers or remote industrial locations securely.</li>
          </ul>

          <h2>Industries Served</h2>
          <ul>
            <li>Quick Service Restaurants (QSR) & Fine Dining</li>
            <li>Large-Scale Retail Chains & FMCG Brands</li>
            <li>Hotels & Global Hospitality Groups</li>
            <li>Massive Franchise Networks (Master/Sub configurations)</li>
            <li>Food Manufacturing & Processing Centers</li>
          </ul>

          <h2>Technology</h2>
          <p>
            Audiment leverages state-of-the-art architectures intrinsically designed for massive concurrent scale and military-grade security. Utilizing Next.js for universally fast and responsive interfaces, backed natively by Firebase scaling infrastructure and seamless Cloudinary media delivery networks, the platform provides an entirely mobile-optimized experience free of hardware friction.
          </p>

          <h2>Contact</h2>
          <p>
            For enterprise inquiries or technical assistance, our global team remains readily accessible:<br />
            <strong>Email:</strong> <a href="mailto:hello@audiment.com" className="text-primary hover:underline">hello@audiment.com</a>
          </p>
        </div>

      </section>

      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  )
}
