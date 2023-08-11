$ports = 3000, 3001

foreach ($port in $ports) {
    Write-Host "Searching for processes on port $port..."
    $processes = Get-NetTCPConnection | Where-Object { $_.LocalPort -eq $port -and $_.State -eq 'Listen' }
    
    foreach ($process in $processes) {
        $processId = $process.OwningProcess
        Write-Host "Killing process with PID $processId..."
        Stop-Process -Id $processId -Force
    }
}