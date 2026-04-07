import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  tags: string[]
  readingTime: string
  featured: boolean
  content: string
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  
  const files = fs.readdirSync(BLOG_DIR)
  const posts = files
    .filter(f => f.endsWith('.mdx'))
    .map(filename => {
      const slug = filename.replace('.mdx', '')
      const fullPath = path.join(BLOG_DIR, filename)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      const stats = readingTime(content)
      
      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        author: data.author || 'Audiment Team',
        category: data.category,
        tags: data.tags || [],
        readingTime: stats.text,
        featured: data.featured || false,
        content,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return posts
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) return null
  
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const stats = readingTime(content)
  
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author || 'Audiment Team',
    category: data.category,
    tags: data.tags || [],
    readingTime: stats.text,
    featured: data.featured || false,
    content,
  }
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter(p => p.category === category)
}
