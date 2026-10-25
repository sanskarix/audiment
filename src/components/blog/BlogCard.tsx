import Link from 'next/link'
import { BlogPost } from '@/lib/blog'

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-col border border-[#e8e8e8] overflow-hidden bg-white hover:border-neutral-400 transition-all duration-200 group h-full">
      <Link href={`/blog/${post.slug}`} className="block h-52 bg-neutral-100 relative overflow-hidden">
        <div className="absolute bottom-4 left-4">
          <span className="font-mono text-[10px] px-2 py-0.5 bg-white text-neutral-800 border border-[#e8e8e8] uppercase tracking-wider">
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
