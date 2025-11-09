// Vercel Analytics data fetching utilities
// Note: This requires a Vercel API route to proxy requests (see api/vercel-analytics.js)

/**
 * Fetch Vercel Analytics data via API proxy
 * @param {Object} options - Query options
 * @param {string} options.projectId - Vercel project ID
 * @param {string} options.start - Start date (YYYY-MM-DD)
 * @param {string} options.end - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Analytics data
 */
export async function fetchVercelAnalytics({ projectId, start, end }) {
  try {
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    if (start) params.append('start', start);
    if (end) params.append('end', end);

    const response = await fetch(`/api/vercel-analytics?${params.toString()}`);
    
    if (!response.ok) {
      // Check if we got HTML or JavaScript (means API route doesn't exist - likely in dev)
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        console.warn('Vercel Analytics API route not available (only works when deployed to Vercel)');
        return null;
      }
      throw new Error(`Failed to fetch Vercel Analytics: ${response.statusText}`);
    }

    // Check if response is actually JSON before parsing
    const text = await response.text();
    if (!text || text.trim().startsWith('//') || text.trim().startsWith('<!')) {
      console.warn('Vercel Analytics API route not available (only works when deployed to Vercel)');
      return null;
    }

    try {
      const data = JSON.parse(text);
      // Check if it's an error response
      if (data.error) {
        console.warn('Vercel Analytics error:', data.message || data.error);
        return null;
      }
      return data;
    } catch (parseError) {
      console.warn('Vercel Analytics API route returned invalid JSON (only works when deployed to Vercel)');
      return null;
    }
  } catch (error) {
    // Silently fail in development - API route only works on Vercel
    if (import.meta.env.DEV) {
      console.warn('Vercel Analytics not available in development. It will work when deployed to Vercel.');
    } else {
      console.error('Error fetching Vercel Analytics:', error);
    }
    return null;
  }
}

/**
 * Fetch web analytics summary (pageviews, visitors, etc.)
 */
export async function fetchWebAnalyticsSummary(days = 30) {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    // Project ID is optional - API route can use VERCEL_PROJECT_ID env var or get it from query
    const projectId = import.meta.env.VITE_VERCEL_PROJECT_ID || null;

    const data = await fetchVercelAnalytics({
      projectId,
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    });

    if (!data) return null;

    return {
      pageviews: data.pageviews || 0,
      visitors: data.visitors || 0,
      topPages: data.topPages || [],
      topReferrers: data.topReferrers || [],
      topCountries: data.topCountries || [],
      topDevices: data.topDevices || [],
      topBrowsers: data.topBrowsers || [],
      topOS: data.topOS || [],
    };
  } catch (error) {
    console.error('Error fetching web analytics summary:', error);
    return null;
  }
}

