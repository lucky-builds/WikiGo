// Utility functions for validating Wikipedia articles

const API = "https://en.wikipedia.org/w/api.php?origin=*";

/**
 * Check if a Wikipedia article exists
 * @param {string} title - Article title
 * @returns {Promise<{exists: boolean, title: string, error?: string}>}
 */
export async function checkArticleExists(title) {
  if (!title || !title.trim()) {
    return { exists: false, title: title, error: 'Title is required' };
  }

  try {
    const url = `${API}&action=query&prop=info&titles=${encodeURIComponent(title)}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    
    const pages = data?.query?.pages || {};
    const page = Object.values(pages)[0];
    
    if (page?.missing !== undefined) {
      return { exists: false, title: title, error: 'Article does not exist on Wikipedia' };
    }
    
    // Get the actual title (Wikipedia may normalize it)
    const actualTitle = page?.title || title;
    
    // Check if it has links (required for the game)
    const linksUrl = `${API}&action=query&prop=links&plnamespace=0&pllimit=1&format=json&titles=${encodeURIComponent(actualTitle)}`;
    const linksRes = await fetch(linksUrl);
    const linksData = await linksRes.json();
    const linksPages = linksData?.query?.pages || {};
    const linksPage = Object.values(linksPages)[0];
    const hasLinks = linksPage?.links && linksPage.links.length > 0;
    
    if (!hasLinks) {
      return { exists: false, title: actualTitle, error: 'Article has no links (not suitable for game)' };
    }
    
    return { exists: true, title: actualTitle };
  } catch (error) {
    console.error('Error checking article:', error);
    return { exists: false, title: title, error: 'Failed to check article' };
  }
}

/**
 * Validate multiple articles
 * @param {string[]} titles - Array of article titles
 * @returns {Promise<Array<{exists: boolean, title: string, error?: string}>>}
 */
export async function validateArticles(titles) {
  const results = await Promise.all(
    titles.map(title => checkArticleExists(title))
  );
  return results;
}

