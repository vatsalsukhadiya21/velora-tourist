const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const CATEGORIES = [
  { name: 'Adventure', slug: 'adventure', emoji: '🏔️' },
  { name: 'Nature', slug: 'nature', emoji: '🌿' },
  { name: 'Peaceful', slug: 'peaceful', emoji: '🧘' },
  { name: 'Solo Travel', slug: 'solo-travel', emoji: '🎒' },
  { name: 'Food Experience', slug: 'food-experience', emoji: '🍜' },
  { name: 'Hidden Gems', slug: 'hidden-gems', emoji: '💎' },
  { name: 'Cultural Experience', slug: 'cultural-experience', emoji: '🏛️' },
  { name: 'Nightlife', slug: 'nightlife', emoji: '🌃' },
  { name: 'Spiritual', slug: 'spiritual', emoji: '🕊️' },
  { name: 'Budget Travel', slug: 'budget-travel', emoji: '💰' },
];

/** Attach emoji labels to categories returned by the API. */
export function enrichCategories(apiCategories = []) {
  if (!Array.isArray(apiCategories)) return [];
  return apiCategories.map((cat) => {
    const meta = CATEGORIES.find((c) => c.slug === cat.slug);
    return { ...cat, emoji: meta?.emoji ?? '' };
  });
}

export const COUNTRIES = [
  'Japan', 'Italy', 'Thailand', 'France', 'Indonesia',
  'Iceland', 'Peru', 'Morocco', 'New Zealand', 'Greece',
  'Portugal', 'Turkey', 'Vietnam', 'Norway', 'India',
  'Mexico', 'Spain', 'Croatia', 'Sri Lanka', 'Nepal',
  'Colombia', 'South Korea', 'Egypt', 'Switzerland', 'Argentina',
];

export { API_BASE_URL };
