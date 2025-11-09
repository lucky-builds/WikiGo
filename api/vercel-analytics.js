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

    // Vercel Analytics API endpoint
    // Note: Vercel Analytics API structure may vary. Try multiple endpoints.
    // Option 1: Analytics endpoint (if available)
    const analyticsUrl = `https://api.vercel.com/v1/analytics/${projectIdEnv}?from=${startDate}&to=${endDate}`;
    
    // Option 2: Web Analytics endpoint (alternative format)
    const webAnalyticsUrl = `https://api.vercel.com/v1/web-analytics/${projectIdEnv}?from=${startDate}&to=${endDate}`;
    
    // Option 3: Project analytics endpoint
    const projectAnalyticsUrl = `https://api.vercel.com/v1/projects/${projectIdEnv}/analytics?from=${startDate}&to=${endDate}`;

    // Try the primary analytics endpoint first
    let response = await fetch(analyticsUrl, {
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
    });

    // If that fails, try alternative endpoints
    if (!response.ok && response.status === 404) {
      response = await fetch(webAnalyticsUrl, {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
      });
    }

    if (!response.ok && response.status === 404) {
      response = await fetch(projectAnalyticsUrl, {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      // Log the error for debugging (check Vercel function logs)
      console.error('Vercel API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        triedUrls: [analyticsUrl, webAnalyticsUrl, projectAnalyticsUrl],
      });

      // Return a more helpful error message
      return res.status(response.status).json({
        error: 'Vercel Analytics API not available',
        message: errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        note: 'Vercel Analytics API may require specific permissions or may not be publicly available. Check Vercel function logs for details.',
        details: errorData,
      });
    }

    const data = await response.json();
    
    // Vercel Analytics API returns data in different formats
    // Handle both the analytics response and transform it to our format
    const analyticsData = data.analytics || data;
    
    // Return formatted analytics data
    return res.status(200).json({
      pageviews: analyticsData.pageviews || analyticsData.views || 0,
      visitors: analyticsData.visitors || analyticsData.uniqueVisitors || 0,
      topPages: analyticsData.topPages || analyticsData.pages || [],
      topReferrers: analyticsData.topReferrers || analyticsData.referrers || [],
      topCountries: analyticsData.topCountries || analyticsData.countries || [],
      topDevices: analyticsData.topDevices || analyticsData.devices || [],
      topBrowsers: analyticsData.topBrowsers || analyticsData.browsers || [],
      topOS: analyticsData.topOS || analyticsData.operatingSystems || [],
      raw: data,
    });

  } catch (error) {
    console.error('Error fetching Vercel Analytics:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch analytics',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

