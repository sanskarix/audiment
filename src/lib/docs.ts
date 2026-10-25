import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const DOCS_DIR = path.join(process.cwd(), 'content/docs');

export interface DocItem {
  slug: string;
  title: string;
  metaTitle?: string;
  description: string;
  category: 'Platform Overview' | 'Core Features' | 'User Handbooks' | 'Standards & Scoring';
  categoryOrder: number;
  order: number;
  role?: 'All Roles' | 'Admin' | 'Manager' | 'Auditor';
  badge?: string;
  lastModified?: string;
  tags: string[];
  readingTime: string;
  content: string;
}

export interface DocTOCItem {
  id: string;
  text: string;
  level: number;
}

export interface DocCategoryGroup {
  category: string;
  order: number;
  docs: DocItem[];
}

export function getAllDocs(): DocItem[] {
  if (!fs.existsSync(DOCS_DIR)) return [];

  const files = fs.readdirSync(DOCS_DIR);
  const docs = files
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace(/\.(mdx|md)$/, '');
      const fullPath = path.join(DOCS_DIR, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const stats = readingTime(content);

      return {
        slug,
        title: data.title || slug,
        metaTitle: data.metaTitle || data.meta_title || `${data.title} | Audiment Documentation`,
        description: data.description || '',
        category: data.category || 'Platform Overview',
        categoryOrder: data.categoryOrder ?? 1,
        order: data.order ?? 99,
        role: data.role || 'All Roles',
        badge: data.badge || undefined,
        lastModified: data.lastModified || data.date || '2026-10-24',
        tags: data.tags || [],
        readingTime: stats.text,
        content,
      } as DocItem;
    })
    .sort((a, b) => {
      if (a.categoryOrder !== b.categoryOrder) {
        return a.categoryOrder - b.categoryOrder;
      }
      return a.order - b.order;
    });

  return docs;
}

export function getDocBySlug(slug: string): DocItem | null {
  const mdxPath = path.join(DOCS_DIR, `${slug}.mdx`);
  const mdPath = path.join(DOCS_DIR, `${slug}.md`);
  const fullPath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!fullPath) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || slug,
    metaTitle: data.metaTitle || data.meta_title || `${data.title} | Audiment Documentation`,
    description: data.description || '',
    category: data.category || 'Platform Overview',
    categoryOrder: data.categoryOrder ?? 1,
    order: data.order ?? 99,
    role: data.role || 'All Roles',
    badge: data.badge || undefined,
    lastModified: data.lastModified || data.date || '2026-10-24',
    tags: data.tags || [],
    readingTime: stats.text,
    content,
  };
}

export function getDocsGroupedByCategory(): DocCategoryGroup[] {
  const docs = getAllDocs();
  const categoryMap = new Map<string, { order: number; docs: DocItem[] }>();

  const categoryOrderMap: Record<string, number> = {
    'Platform Overview': 1,
    'Core Features': 2,
    'User Handbooks': 3,
    'Standards & Scoring': 4,
  };

  docs.forEach((doc) => {
    const cat = doc.category;
    const catOrder = categoryOrderMap[cat] ?? doc.categoryOrder ?? 99;
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, { order: catOrder, docs: [] });
    }
    categoryMap.get(cat)!.docs.push(doc);
  });

  return Array.from(categoryMap.entries())
    .map(([category, { order, docs }]) => ({
      category,
      order,
      docs: docs.sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.order - b.order);
}

export function getDocNavigation(currentSlug: string): {
  prevDoc: { slug: string; title: string; category: string } | null;
  nextDoc: { slug: string; title: string; category: string } | null;
} {
  const docs = getAllDocs();
  const currentIndex = docs.findIndex((d) => d.slug === currentSlug);

  if (currentIndex === -1) {
    return { prevDoc: null, nextDoc: null };
  }

  const prevDoc =
    currentIndex > 0
      ? {
          slug: docs[currentIndex - 1].slug,
          title: docs[currentIndex - 1].title,
          category: docs[currentIndex - 1].category,
        }
      : null;

  const nextDoc =
    currentIndex < docs.length - 1
      ? {
          slug: docs[currentIndex + 1].slug,
          title: docs[currentIndex + 1].title,
          category: docs[currentIndex + 1].category,
        }
      : null;

  return { prevDoc, nextDoc };
}

export function getDocTOC(content: string): DocTOCItem[] {
  const headings = content.match(/^(#{2,3})\s+(.*)/gm);
  if (!headings) return [];

  return headings.map((h) => {
    const isH3 = h.startsWith('### ');
    const rawText = h.replace(/^#{2,3}\s+/, '');
    const cleanText = rawText
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`]/g, '')
      .trim();
    const id = cleanText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return {
      id,
      text: cleanText,
      level: isH3 ? 3 : 2,
    };
  });
}
