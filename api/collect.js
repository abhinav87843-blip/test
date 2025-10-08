module.exports = async (req, res) => {
  console.log('🔔 API Called - Method:', req.method);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.json({
      message: '✅ Collect API is working!',
      usage: 'Send POST request with JSON data',
      timestamp: new Date().toISOString()
    });
  }
  
  if (req.method === 'POST') {
    try {
      console.log('📦 Received POST data:', req.body);
      
      const systemData = req.body.data || req.body;
      console.log('🎯 Target Data:', systemData);
      
      return res.json({
        status: 'success',
        message: 'Data received successfully',
        received: systemData,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error:', error);
      return res.status(500).json({ error: 'Processing failed' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
};
