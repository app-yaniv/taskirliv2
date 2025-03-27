const fs = require('fs');
const path = require('path');

console.log('Fixing Next.js build for GitHub Pages...');

// Create .nojekyll file
const nojekyllPath = path.join(__dirname, 'out', '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, '');
  console.log('Created .nojekyll file.');
}

// Create a proper index.html at the root that will properly load the Next.js app
const indexPath = path.join(__dirname, 'out', 'index.html');

// Read _next directory to find the correct asset paths
const nextDir = path.join(__dirname, 'out', '_next');
const hasNextDir = fs.existsSync(nextDir) && fs.statSync(nextDir).isDirectory();

if (hasNextDir) {
  console.log('Creating proper Next.js homepage...');
  
  // Create the HTML content with proper Next.js loading
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TaskirLiv2</title>
  <link rel="stylesheet" href="/_next/static/css/app/layout.css">
  <script src="/_next/static/chunks/webpack.js" defer></script>
  <script src="/_next/static/chunks/main-app.js" defer></script>
  <script src="/_next/static/chunks/app-pages-internals.js" defer></script>
  <script src="/_next/static/chunks/app/page.js" defer></script>
  <script src="/_next/static/chunks/app/layout.js" defer></script>
  <meta name="next-size-adjust">
  <script>
    // Redirect to the actual app path with basePath
    window.location.href = '/taskirliv2/';
  </script>
</head>
<body>
  <div id="__next">
    <div class="min-h-screen">
      <div class="text-center py-20">
        <h1 class="text-4xl font-bold">Loading TaskirLiv2...</h1>
        <p class="mt-4">If you are not redirected automatically, <a href="/taskirliv2/" style="color: blue; text-decoration: underline;">click here</a>.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(indexPath, htmlContent);
  console.log('Created index.html with proper Next.js loading and redirect.');
} else {
  console.log('Warning: _next directory not found. Creating simple redirect...');
  
  // Create a simple redirect
  const simpleHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TaskirLiv2</title>
  <meta http-equiv="refresh" content="0; URL=/taskirliv2/">
</head>
<body>
  <p>Redirecting to <a href="/taskirliv2/">TaskirLiv2</a>...</p>
</body>
</html>`;

  fs.writeFileSync(indexPath, simpleHtml);
  console.log('Created simple redirect index.html.');
}

console.log('GitHub Pages preparation complete!'); 