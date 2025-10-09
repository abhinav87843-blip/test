module.exports = async (req, res) => {
  console.log('=== 🔔 HACKMD REQUEST ===');
  console.log('Time:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    console.log('📦 POST Data:', JSON.stringify(req.body, null, 2));
    console.log('=== END REQUEST ===');
    
    return res.json({ 
      status: 'success', 
      received: true,
      timestamp: new Date().toISOString()
    });
  }
  
  return res.json({ 
    status: 'server_active',
    time: new Date().toISOString()
  });
};
