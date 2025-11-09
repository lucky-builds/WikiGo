// Vercel API Route: /api/vercel-analytics
// This serverless function proxies requests to Vercel Analytics API
// Requires VERCEL_API_TOKEN and VERCEL_PROJECT_ID environment variables

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { projectId, start, end } = req.query;

  // Get Vercel API token from environment
  const vercelToken = process.env.VERCEL_API_TOKEN;
  // Try to get project ID from env var, query param, or try to infer from Vercel deployment
  const projectIdEnv = process.env.VERCEL_PROJECT_ID || projectId || process.env.VERCEL_URL?.split('.')[0];

  if (!vercelToken) {
    return res.status(500).json({ 
      error: 'VERCEL_API_TOKEN not configured',
      message: 'Please set VERCEL_API_TOKEN in your Vercel project environment variables. Go to Project Settings > Environment Variables.'
    });
  }

  if (!projectIdEnv) {
    return res.status(400).json({ 
      error: 'Project ID required',
      message: 'Please set VERCEL_PROJECT_ID environment variable in Vercel project settings, or provide projectId query parameter'
    });
  }

  try {
    // Calculate date range (default to last 30 days)
    const endDate = end || new Date().toISOString().split('T')[0];
    const startDate = start || (() => {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return d.toISOString().split('T')[0];
    })();

    // Fetch analytics data from Vercel API
    // Note: This uses Vercel's Analytics API v2
    const analyticsUrl = `https://vercel.com/api/v1/deployments/${projectIdEnv}/analytics?from=${startDate}&to=${endDate}`;
    
    // Alternative: Use the web analytics endpoint if available
    // For web analytics (pageviews, visitors), we need to use a different endpoint
    const webAnalyticsUrl = `https://vercel.com/api/web/analytics/${projectIdEnv}?from=${startDate}&to=${endDate}`;

    const response = await fetch(webAnalyticsUrl, {
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If web analytics endpoint doesn't work, try the deployments endpoint
      const deploymentsResponse = await fetch(analyticsUrl, {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!deploymentsResponse.ok) {
        throw new Error(`Vercel API error: ${deploymentsResponse.status} ${deploymentsResponse.statusText}`);
      }

      const deploymentsData = await deploymentsResponse.json();
      
      // Transform deployment data to analytics format
      return res.status(200).json({
        pageviews: deploymentsData.pageviews || 0,
        visitors: deploymentsData.visitors || 0,
        topPages: [],
        topReferrers: [],
        topCountries: [],
        topDevices: [],
        topBrowsers: [],
        topOS: [],
        deployments: deploymentsData,
      });
    }

    const data = await response.json();
    
    // Return formatted analytics data
    return res.status(200).json({
      pageviews: data.pageviews || 0,
      visitors: data.visitors || 0,
      topPages: data.topPages || [],
      topReferrers: data.topReferrers || [],
      topCountries: data.topCountries || [],
      topDevices: data.topDevices || [],
      topBrowsers: data.topBrowsers || [],
      topOS: data.topOS || [],
      raw: data,
    });

  } catch (error) {
    console.error('Error fetching Vercel Analytics:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch analytics',
      message: error.message 
    });
  }
}

