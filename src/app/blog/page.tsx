import { getAllPosts } from '@/lib/blog'
import Link from 'next/link'
import { BlogCard } from '@/components/blog/BlogCard'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/ui/modem-animated-footer'
import { Search } from 'lucide-react'

export const metadata = {
  title: 'Blog – Audit Management Insights | Audiment',
  description: 'Expert insights on audit management, FSSAI compliance, multi-location operations, and corrective action tracking for operations leaders.',
  alternates: { canonical: 'https://audiment.com/blog' },
  openGraph: {
    title: 'Audiment blog — field audit insights',
    description: 'Expert insights on audit management, FSSAI compliance, multi-location operations, and corrective action tracking for field operations leaders.',
    url: 'https://audiment.com/blog',
    type: 'website',
    images: [{ url: 'https://audiment.com/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audiment blog — field audit insights',
    description: 'Expert insights on audit management, FSSAI compliance, multi-location operations, and corrective action tracking for field operations leaders.',
  },
  keywords: ['audit software', 'restaurant compliance', 'field audits', 'multi-location operations'],
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const posts = getAllPosts()
  const resolvedSearchParams = await searchParams
  const searchQuery = resolvedSearchParams?.q?.toLowerCase()

  let filteredPosts = posts

  if (searchQuery) {
    filteredPosts = filteredPosts.filter(p =>
      p.title.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.tags?.some(t => t.toLowerCase().includes(searchQuery))
    )
  }

  const featuredPost = searchQuery ? null : posts.find(p => p.featured)
  const displayPosts = searchQuery ? filteredPosts : filteredPosts.filter(p => p.slug !== featuredPost?.slug)

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Our blog</h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium">
            Insights on audit management, compliance, and operational excellence for multi-location businesses.
          </p>
        </div>

        {/* Centered Minimalist Search Bar */}
        <div className="max-w-2xl mx-auto mb-20">
          <form action="/blog" method="GET" className="relative group">
            <label htmlFor="blog-search" className="sr-only">Search</label>
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
            </div>
            <input
              id="blog-search"
              name="q"
              type="text"
              placeholder="Search articles and guides..."
              className="block w-full pl-12 pr-6 py-3 border border-border rounded-2xl bg-card/50 backdrop-blur-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xl shadow-primary/5 transition-all placeholder:text-muted-foreground/40 font-medium"
              defaultValue={searchQuery}
            />
          </form>
        </div>

        {/* Search Results Display */}
        {searchQuery && (
          <div className="mb-12 flex items-center justify-between border-b border-border pb-8">
            <h2 className="text-xl text-muted-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-4 w-4 text-primary" />
              </div>
              Search results for <span className="text-foreground font-bold italic">"{searchQuery}"</span>
            </h2>
            <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">Clear Search</Link>
          </div>
        )}

        {/* Featured Post Card */}
        {!searchQuery && featuredPost && (
          <div className="mb-20 rounded-3xl overflow-hidden border border-border bg-card shadow-2xl shadow-primary/5 group hover:shadow-primary/10 transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-0 overflow-hidden">
              <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                    Featured
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {featuredPost.category}
                  </span>
                </div>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <h2 className="text-3xl md:text-5xl font-bold hover:text-primary transition-colors mb-6 leading-[1.1] tracking-tight">
                    {featuredPost.title}
                  </h2>
                </Link>
                <p className="text-muted-foreground text-lg mb-8 line-clamp-3 leading-relaxed">
                  {featuredPost.description}
                </p>
                <div className="flex items-center text-sm text-muted-foreground gap-6 mb-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{featuredPost.readingTime}</span>
                  </div>
                </div>
                <Link href={`/blog/${featuredPost.slug}`} className="inline-flex h-12 items-center justify-center px-8 bg-primary text-primary-foreground font-semibold rounded-full transition-all hover:scale-[1.02] w-fit shadow-lg shadow-primary/25">
                  Read article
                </Link>
              </div>
              <div className="h-full min-h-[350px] w-full bg-muted relative overflow-hidden order-1 md:order-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent group-hover:scale-105 transition-transform duration-1000"></div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayPosts.length > 0 ? (
            displayPosts.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <h3 className="text-2xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms to find what you're looking for.</p>
              <Link href="/blog" className="inline-block mt-6 text-primary font-medium hover:underline">View all articles</Link>
            </div>
          )}
        </div>
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
    </main>
  )
}
