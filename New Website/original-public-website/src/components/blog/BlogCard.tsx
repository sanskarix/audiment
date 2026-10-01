import Link from 'next/link'
import { BlogPost } from '@/lib/blog'

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-col rounded-2xl border border-border overflow-hidden bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group h-full">
      <Link href={`/blog/${post.slug}`} className="block h-52 bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent group-hover:scale-105 transition-transform duration-700"></div>
        <div className="absolute bottom-4 left-4">
          <span className="text-[10px] font-bold px-2 py-1 rounded bg-background/80 backdrop-blur-md text-foreground border border-border uppercase tracking-widest">
            {post.category}
          </span>
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/blog/${post.slug}`} className="block mb-3">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
          {post.description}
        </p>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-auto pt-4 border-t border-border">
          <div className="flex gap-3 items-center">
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <span>{post.readingTime}</span>
          </div>
        </div>
        <Link href={`/blog/${post.slug}`} className="mt-6 text-primary text-sm font-semibold hover:underline flex items-center gap-1 group/link w-fit">
          Read article <span className="group-hover/link:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  )
}
