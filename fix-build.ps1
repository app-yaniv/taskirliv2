Write-Host "Fixing build output for GitHub Pages..."

# Create .nojekyll file
$null = New-Item -Path "docs\.nojekyll" -Force
Write-Host "Created .nojekyll file"

# Create .nojekyll file inside taskirliv2 dir if it exists
$taskirlivDir = "docs\taskirliv2"
if (Test-Path $taskirlivDir) {
    $null = New-Item -Path "$taskirlivDir\.nojekyll" -Force
    Write-Host "Created .nojekyll file in taskirliv2 directory"
}

# Check if index.html exists in root
$rootIndexPath = "docs\index.html"
if (-not (Test-Path $rootIndexPath)) {
    Write-Host "Creating redirect index.html in root"
    $html = @"
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting to taskirliv2</title>
  <meta http-equiv="refresh" content="0; URL=taskirliv2/">
  <link rel="canonical" href="https://app-yaniv.github.io/taskirliv2/">
</head>
<body>
  <p>Redirecting to <a href="https://app-yaniv.github.io/taskirliv2/">https://app-yaniv.github.io/taskirliv2/</a>...</p>
</body>
</html>
"@
    Set-Content -Path $rootIndexPath -Value $html
}

# Copy the public index.html to docs root if it exists
$publicIndexPath = "public\index.html"
if (Test-Path $publicIndexPath) {
    Copy-Item -Path $publicIndexPath -Destination $rootIndexPath -Force
    Write-Host "Copied public/index.html to docs/"
}

# Check if favicon exists
$faviconPath = "docs\favicon.ico"
if (-not (Test-Path $faviconPath)) {
    # Copy from public if it exists
    $publicFaviconPath = "public\favicon.ico"
    if (Test-Path $publicFaviconPath) {
        Copy-Item -Path $publicFaviconPath -Destination $faviconPath -Force
        Write-Host "Copied favicon.ico to docs/"
    } else {
        Write-Host "No favicon.ico found in public/"
    }
}

# If there's a taskirliv2 directory, copy index.html from it to root if needed
if (Test-Path $taskirlivDir) {
    $taskirlivIndexPath = "$taskirlivDir\index.html"
    if ((Test-Path $taskirlivIndexPath) -and (-not (Test-Path $rootIndexPath))) {
        Copy-Item -Path $taskirlivIndexPath -Destination $rootIndexPath -Force
        Write-Host "Copied taskirliv2/index.html to docs/"
    }
}

# Modify the next.config.js to ensure proper pathing
$nextConfigPath = "next.config.js"
if (Test-Path $nextConfigPath) {
    $configContent = Get-Content -Path $nextConfigPath -Raw
    if ($configContent -notmatch "trailingSlash: true") {
        Write-Host "Adding trailingSlash: true to next.config.js"
        $configContent = $configContent -replace "const nextConfig = \{", "const nextConfig = {`n  trailingSlash: true,"
        Set-Content -Path $nextConfigPath -Value $configContent
    }
}

Write-Host "Build output fixed!" 