import { getPostBySlug, getAllPosts, getPostsByCategory } from '@/lib/blog'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BlogCard } from '@/components/blog/BlogCard'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/ui/modem-animated-footer'
import { MDXRemote } from 'next-mdx-remote/rsc'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = getPostBySlug(resolvedParams.slug)
  if (!post) return {}
  
  return {
    title: `${post.title.slice(0, 47)} | Audiment`,
    description: post.description,
    alternates: { 
      canonical: `https://audiment.com/blog/${resolvedParams.slug}` 
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://audiment.com/blog/${resolvedParams.slug}`,
      type: 'article',
      images: [{ url: 'https://audiment.com/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
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

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 group font-medium">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to blog
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

              <article className="prose prose-neutral dark:prose-invert prose-lg prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-medium prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:text-muted-foreground prose-blockquote:font-medium prose-blockquote:not-italic prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-2xl prose-table:w-full prose-table:border-collapse prose-table:my-8 prose-th:bg-muted/50 prose-th:text-foreground prose-th:font-semibold prose-th:p-4 prose-th:text-left prose-th:border-b prose-th:border-border hover:prose-tr:bg-muted/30 prose-tr:transition-colors prose-td:p-4 prose-td:border-b prose-td:border-border prose-td:text-muted-foreground prose-hr:border-border prose-hr:my-12 prose-img:rounded-2xl prose-img:border prose-img:border-border prose-img:shadow-xl max-w-none">
                <MDXRemote source={post.content} />
              </article>

              {/* CTA Box */}
              <div className="mt-24 bg-card border border-border rounded-3xl p-10 md:p-16 text-center relative overflow-hidden group shadow-2xl shadow-primary/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6">Ready to digitize your audit process?</h3>
                  <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">Join hundreds of multi-location businesses using Audiment to ensure compliance.</p>
                  <Link href="/#contact" className="inline-flex h-14 items-center justify-center px-10 bg-primary text-primary-foreground text-base font-semibold rounded-full transition-all hover:scale-[1.02] shadow-xl shadow-primary/25">
                    Book a call with Audiment
                  </Link>
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
          { label: "Terms of service", href: "/terms-of-service" },
        ]}
      />

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            author: { "@type": "Organization", "name": "Audiment" },
            publisher: { "@type": "Organization", "name": "Audiment" },
            datePublished: post.date,
            dateModified: post.date,
            image: "https://audiment.com/opengraph-image"
          })
        }}
      />
    </main>
  )
}
