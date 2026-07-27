// Guards against the two regressions that actually happen when editing content:
// dead links/images, and a published post linking to a still-draft one (404 in prod).
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');

const BLOG_CATEGORIES = [
  'gift-guides',
  'comparison',
  'reassurance',
  'seo-pinterest',
  'behind-the-scenes',
  'crocheter-intent',
];

function loadCollection(dir: string) {
  const full = join(ROOT, 'src/content', dir);
  return readdirSync(full)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => {
      const raw = readFileSync(join(full, f), 'utf-8');
      const { data, content } = matter(raw);
      const slug = f.replace(/\.mdx?$/, '');
      return { slug, data, content, file: f };
    });
}

const blog = loadCollection('blog');
const patterns = loadCollection('patterns');

const patternSlugs = new Set(patterns.map((p) => p.slug));
const publishedBlogSlugs = new Set(blog.filter((p) => p.data.draft === false).map((p) => p.slug));
const allBlogSlugs = new Set(blog.map((p) => p.slug));

const staticRoutes = new Set([
  '/', '/patterns', '/blog', '/about',
  ...BLOG_CATEGORIES.map((c) => `/blog/category/${c}`),
]);

function isKnownRoute(path: string): boolean {
  if (staticRoutes.has(path)) return true;
  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) return allBlogSlugs.has(blogMatch[1]);
  const patternMatch = path.match(/^\/patterns\/([^/]+)$/);
  if (patternMatch) return patternSlugs.has(patternMatch[1]);
  return false;
}

function extractInternalLinks(content: string): string[] {
  const links: string[] = [];
  for (const m of content.matchAll(/\]\((\/[^)\s]+)\)/g)) links.push(m[1]);
  for (const m of content.matchAll(/href="(\/[^"]+)"/g)) links.push(m[1]);
  return links;
}

function extractImagePaths(content: string): string[] {
  const paths: string[] = [];
  for (const m of content.matchAll(/src="(\/images\/[^"]+)"/g)) paths.push(m[1]);
  for (const m of content.matchAll(/!\[[^\]]*\]\((\/images\/[^)]+)\)/g)) paths.push(m[1]);
  return paths;
}

function collectFrontmatterImages(data: Record<string, any>): string[] {
  const paths: string[] = [];
  if (typeof data.coverImage === 'string') paths.push(data.coverImage);
  if (typeof data.heroImage === 'string') paths.push(data.heroImage);
  if (Array.isArray(data.images)) paths.push(...data.images);
  if (data.skillNotes?.instructionImage) paths.push(data.skillNotes.instructionImage);
  if (Array.isArray(data.customerQuotes)) {
    for (const q of data.customerQuotes) if (q.image) paths.push(q.image);
  }
  return paths;
}

describe('blog posts', () => {
  for (const post of blog) {
    describe(post.file, () => {
      it('only links to published posts, real patterns, or known static routes', () => {
        const links = extractInternalLinks(post.content).filter((l) => !l.startsWith('/images/'));
        const broken = links.filter((l) => !isKnownRoute(l));
        expect(broken, `${post.file} links to unresolvable route(s)`).toEqual([]);
      });

      it('does not link to a draft post while itself published', () => {
        if (post.data.draft !== false) return;
        const links = extractInternalLinks(post.content);
        const draftLinks = links.filter((l) => {
          const m = l.match(/^\/blog\/([^/]+)$/);
          return m && allBlogSlugs.has(m[1]) && !publishedBlogSlugs.has(m[1]);
        });
        expect(draftLinks, `${post.file} is published but links to unpublished post(s)`).toEqual([]);
      });

      it('every relatedPatterns entry is a real pattern slug', () => {
        const related: string[] = post.data.relatedPatterns ?? [];
        const unknown = related.filter((slug) => !patternSlugs.has(slug));
        expect(unknown, `${post.file} relatedPatterns references unknown pattern(s)`).toEqual([]);
      });

      it('every referenced image file exists in public/', () => {
        const refs = [...collectFrontmatterImages(post.data), ...extractImagePaths(post.content)];
        const missing = refs.filter((p) => !existsSync(join(PUBLIC, p)));
        expect(missing, `${post.file} references missing image(s)`).toEqual([]);
      });
    });
  }
});

describe('patterns', () => {
  for (const pattern of patterns) {
    describe(pattern.file, () => {
      it('every referenced image file exists in public/', () => {
        const refs = [...collectFrontmatterImages(pattern.data), ...extractImagePaths(pattern.content)];
        const missing = refs.filter((p) => !existsSync(join(PUBLIC, p)));
        expect(missing, `${pattern.file} references missing image(s)`).toEqual([]);
      });
    });
  }
});
