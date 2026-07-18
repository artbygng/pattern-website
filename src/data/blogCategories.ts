export const blogCategories = {
  'gift-guides': {
    label: 'Gift Guides',
    eyebrow: 'Gift Guides & Buyer Intent',
    description: 'Handmade gift ideas for toddlers, babies, and the people who love them.',
  },
  'comparison': {
    label: 'Which One Should I Make?',
    eyebrow: 'Comparisons & Decisions',
    description: "Help picking between patterns, or between a quiet book and something else entirely.",
  },
  'reassurance': {
    label: 'How It Works',
    eyebrow: 'Before You Start',
    description: 'Straight answers to the worries that stop people from starting a pattern.',
  },
  'seo-pinterest': {
    label: 'Ideas & Inspiration',
    eyebrow: 'Ideas & Inspiration',
    description: 'Roundups and guides for quiet book pages, crochet gifts, and getting started.',
  },
  'behind-the-scenes': {
    label: 'Behind the Scenes',
    eyebrow: 'Behind the Scenes',
    description: 'The story behind Artbygng, and the makers bringing the patterns to life.',
  },
  'crocheter-intent': {
    label: 'What to Make',
    eyebrow: 'For Crocheters',
    description: 'Project ideas and inspiration for crocheters deciding what to make next.',
  },
} as const;

export type BlogCategory = keyof typeof blogCategories;

export const blogCategoryList = Object.entries(blogCategories).map(([slug, meta]) => ({
  slug: slug as BlogCategory,
  ...meta,
}));
