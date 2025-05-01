// Serverless function to proxy student info requests
// This solves the mixed content issue by making HTTP requests from the server instead of the browser

// Fetch API is available in Node.js environments on Vercel
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract studentId from query parameters
    const { studentId } = req.query;
    
    if (!studentId) {
      return res.status(400).json({ error: 'Missing studentId parameter' });
    }

    // Make request to the DIU API
    const apiUrl = `http://peoplepulse.diu.edu.bd:8189/result/studentInfo?studentId=${studentId}`;
    console.log(`Proxying request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    // Check if the response is OK
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `DIU API returned error: ${response.status}` 
      });
    }

    // Parse and return the data
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch student info', 
      message: error.message 
    });
  }
}