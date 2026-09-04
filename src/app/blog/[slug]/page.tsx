import { getPostBySlug, getAllPosts, getPostsByCategory } from '@/lib/blog'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BlogCard } from '@/components/blog/BlogCard'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/ui/modem-animated-footer'
import { CalButton } from '@/components/ui/cal-button'
import { MDXRemote } from 'next-mdx-remote/rsc'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({
    slug: post.slug,
  }))
}

function cleanBlogTitle(title: string): string {
  const separators = ['?', ':', '(', '-']
  let clean = title
  
  let firstSepIdx = -1
  let matchingSep = ''
  for (const sep of separators) {
    const idx = clean.indexOf(sep)
    if (idx !== -1 && (firstSepIdx === -1 || idx < firstSepIdx)) {
      firstSepIdx = idx
      matchingSep = sep
    }
  }
  
  if (firstSepIdx !== -1) {
    clean = clean.substring(0, firstSepIdx).trim()
    if (matchingSep === '?') {
      clean += '?'
    }
  }
  
  clean = clean
    .replace(/\bfor Multi-Location Businesses\b/gi, '')
    .replace(/\bfor Multi-Outlet Restaurants\b/gi, '')
    .replace(/\bAcross Multiple Locations\b/gi, '')
    .replace(/\bAcross Locations\b/gi, '')
    .trim()
    
  return clean
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = getPostBySlug(resolvedParams.slug)
  if (!post) return {}
  
  const displayTitle = post.metaTitle || cleanBlogTitle(post.title)
  const metaTitle = `${displayTitle} | Audiment`
  
  return {
    title: { absolute: metaTitle },
    description: post.description,
    alternates: { 
      canonical: `https://audiment.in/blog/${resolvedParams.slug}` 
    },
    openGraph: {
      title: displayTitle,
      description: post.description,
      url: `https://audiment.in/blog/${resolvedParams.slug}`,
      type: 'article',
      images: [{ url: 'https://audiment.in/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
      description: post.description,
    },
    keywords: post.tags,
  }
}

function getTOC(content: string) {
  const headings = content.match(/^##\s+(.*)/gm);
  if (!headings) return [];
  return headings.map(h => {
    const text = h.replace(/^##\s+/, '');
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return { text, id };
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = getPostBySlug(resolvedParams.slug)
  
  if (!post) {
    notFound()
  }

  const toc = getTOC(post.content)

  const relatedPosts = getPostsByCategory(post.category)
    .filter(p => p.slug !== post.slug)
    .slice(0, 3)

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://audiment.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://audiment.in/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://audiment.in/blog/${post.slug}`
      }
    ]
  };

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-md">{post.category}</span>
        </nav>

        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group font-medium text-sm">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to all articles
        </Link>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Table of Contents - Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-32">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xl shadow-primary/5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Contents</p>
              <nav className="flex flex-col gap-4">
                {toc.map(item => (
                  <a key={item.id} href={`#${item.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors leading-snug font-medium">
                    {item.text}
                  </a>
                ))}
                {toc.length === 0 && <span className="text-xs text-muted-foreground italic">No sections</span>}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow w-full overflow-hidden">
            <div className="max-w-3xl mx-auto">
              <header className="mb-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 inline-block">
                  {post.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm border-b border-border pb-8">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{post.author}</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-border"></span>
                  <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</time>
                  <span className="w-1 h-1 rounded-full bg-border"></span>
                  <span>{post.readingTime}</span>
                </div>
              </header>

              <article className="prose prose-neutral dark:prose-invert prose-p:text-[15px] prose-li:text-[15px] prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground prose-h1:text-3xl prose-h2:text-[20px] prose-h2:mt-10 prose-h3:text-base prose-h3:mt-8 prose-h4:text-[15px] prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-li:leading-relaxed prose-strong:text-foreground prose-strong:font-semibold prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[13px] prose-code:font-medium prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted-foreground prose-blockquote:not-italic prose-blockquote:pl-4 prose-blockquote:py-0 prose-hr:border-border prose-hr:my-10 prose-img:rounded-2xl prose-img:border prose-img:border-border prose-img:shadow-xl max-w-none blog-prose">
                <MDXRemote 
                  source={post.content} 
                  components={{
                    BlogCTA: () => null,
                  }}
                />
              </article>

              {/* Author & Editorial Trust Box */}
              <div className="mt-16 p-8 rounded-2xl border border-border bg-muted/20 flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
                  A
                </div>
                <div className="space-y-2 text-sm">
                  <h4 className="font-bold text-base text-heading">Written by the Audiment Editorial Team</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Audiment is built by Asellus LLP to help multi-location restaurant, retail, hotel, and healthcare operators eliminate operational drift. We publish practical, research-backed guides on audit management, proof-based verification, and corrective action workflows.
                  </p>
                  <div className="pt-2 flex items-center gap-4 text-xs">
                    <Link href="/about" className="text-primary hover:underline font-medium">About Audiment</Link>
                    <span className="text-muted-foreground">•</span>
                    <Link href="/solutions" className="text-primary hover:underline font-medium">Industry Solutions</Link>
                    <span className="text-muted-foreground">•</span>
                    <Link href="/compare" className="text-primary hover:underline font-medium">Software Comparisons</Link>
                  </div>
                </div>
              </div>

              {/* CTA Box */}
              <div className="mt-16 bg-card border border-border rounded-3xl p-10 md:p-16 text-center relative overflow-hidden group shadow-2xl shadow-primary/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6">Ready to digitize your audit process?</h3>
                  <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">See how multi-location teams use proof-based audits and corrective actions to stay on top of quality and compliance.</p>
                  <CalButton className="inline-flex h-14 items-center justify-center px-10 bg-primary text-primary-foreground text-base font-semibold rounded-full transition-all hover:scale-[1.02] shadow-xl shadow-primary/25">
                    Book a call with Audiment
                  </CalButton>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-32 pt-24 border-t border-border">
            <h2 className="text-3xl font-bold mb-12 text-center md:text-left">More from our blog</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedPosts.map(rp => (
                <BlogCard key={rp.slug} post={rp} />
              ))}
            </div>
          </section>
        )}
      </div>

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

      {/* Structured Schema: Article + Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            image: "https://audiment.in/opengraph-image.png",
            datePublished: post.date,
            dateModified: post.dateModified || post.date,
            author: {
              "@type": "Organization",
              "@id": "https://audiment.in/#organization",
              "name": post.author,
              "url": "https://audiment.in/about"
            },
            publisher: {
              "@id": "https://audiment.in/#organization"
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://audiment.in/blog/${post.slug}`
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsSchema)
        }}
      />
    </main>
  )
}
