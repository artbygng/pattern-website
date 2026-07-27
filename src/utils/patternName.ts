// Pattern `title` frontmatter is inconsistent ("Bake Time Pattern", "The Painter Pattern",
// "Halloween Quiet Book Pattern"...) and doubles as the on-page H1, so strip any existing
// "Pattern"/"Quiet Book Pattern" wording to get the bare product name for SEO titles and alt text.
export function getPatternName(title: string): string {
  return title
    .replace(/^The\s+/i, '')
    .replace(/\s+(Crochet\s+)?Quiet\s+Book\s+Pattern$/i, '')
    .replace(/\s+Pattern$/i, '');
}
