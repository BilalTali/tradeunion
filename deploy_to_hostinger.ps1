
$filesToUpload = @(
    "app",
    "bootstrap",
    "config",
    "database",
    "public",
    "resources",
    "routes",
    "composer.json",
    "composer.lock",
    "package.json",
    "vite.config.js"
)

$User = "u502041317"
$Server = "89.117.157.115"
$Port = "65002"

Write-Host "Teacher's Union Portal - Hostinger Deployer" -ForegroundColor Cyan
Write-Host "-------------------------------------------" -ForegroundColor Cyan

# 1. Ask for Remote Path
$RemotePath = Read-Host "Enter remote Public HTML path (e.g., domains/tradeunion.com/public_html)"
if ([string]::IsNullOrWhiteSpace($RemotePath)) {
    Write-Error "Remote path is required."
    exit 1
}

# 2. Add Host Key (Fixes verification error)
Write-Host "Updating known_hosts..."
Ensure-Directory "$env:USERPROFILE\.ssh"
ssh-keyscan -p $Port $Server | Out-File -Encoding ascii -Append "$env:USERPROFILE\.ssh\known_hosts"

# 3. Choose Method
$method = Read-Host "Choose method: [1] Git Pull (Recommended), [2] SCP Upload (Slow) [Default: 1]"
if ($method -ne "2") {
    # GIT METHOD
    Write-Host "Deploying via basic SSH + Git..." -ForegroundColor Yellow
    
    $commands = "cd $RemotePath && " +
                "git pull origin main && " +
                "composer install --no-dev --optimize-autoloader && " +
                "npm install && npm run build && " +
                "php artisan migrate --force && " +
                "php artisan config:cache && " +
                "php artisan route:cache && " +
                "php artisan view:cache && " +
                "echo 'DEPLOYMENT COMPLETE!'"

    ssh -p $Port $User@$Server $commands
} else {
    # SCP METHOD
    Write-Host "Deploying via SCP..." -ForegroundColor Yellow
    foreach ($file in $filesToUpload) {
        Write-Host "Uploading $file..."
        scp -P $Port -r $file "$User@${Server}:$RemotePath/"
    }
}

Write-Host "Done." -ForegroundColor Green
Read-Host "Press Enter to exit"
