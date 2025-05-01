// Standalone proxy server for DIU student info API
// This script runs as a separate service and proxies requests to the DIU HTTP API

const http = require('http');
const https = require('https');
const url = require('url');

// Configuration - you can change these values
const PORT = process.env.PORT || 3001;
const DIU_API_BASE = 'http://peoplepulse.diu.edu.bd:8189';

const server = http.createServer((req, res) => {
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse the request URL
  const parsedUrl = url.parse(req.url, true);
  
  // Only handle requests to /studentInfo
  if (parsedUrl.pathname === '/studentInfo') {
    const studentId = parsedUrl.query.studentId;
    
    if (!studentId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing studentId parameter' }));
      return;
    }
    
    const apiUrl = `${DIU_API_BASE}/result/studentInfo?studentId=${studentId}`;
    console.log(`Proxying request to: ${apiUrl}`);
    
    // Make request to DIU API
    http.get(apiUrl, (apiRes) => {
      let data = '';
      
      // Set the same content type
      res.setHeader('Content-Type', apiRes.headers['content-type'] || 'application/json');
      
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      
      apiRes.on('end', () => {
        // Forward the status code and data
        res.writeHead(apiRes.statusCode);
        res.end(data);
        console.log(`Request completed with status: ${apiRes.statusCode}`);
      });
      
    }).on('error', (err) => {
      console.error('Error proxying request:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Failed to fetch student info', 
        message: err.message 
      }));
    });
    
  } else {
    // Return 404 for all other paths
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Example usage: http://localhost:${PORT}/studentInfo?studentId=123456`);
});