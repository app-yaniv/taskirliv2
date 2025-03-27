const fs = require('fs');
const path = require('path');

console.log('Fixing Next.js build for GitHub Pages...');

// Create .nojekyll file
const nojekyllPath = path.join(__dirname, 'out', '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, '');
  console.log('Created .nojekyll file.');
}

// Create a simple redirect index.html at the root
const indexPath = path.join(__dirname, 'out', 'index.html');

console.log('Creating direct meta refresh redirect...');

// Create a simple redirect without any Next.js dependencies
const simpleHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TaskirLiv2 - Redirecting</title>
  <meta http-equiv="refresh" content="0; URL=https://app-yaniv.github.io/taskirliv2/">
  <link rel="canonical" href="https://app-yaniv.github.io/taskirliv2/">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
    h1 { margin-top: 50px; }
    a { color: #0070f3; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Redirecting to TaskirLiv2...</h1>
  <p>If you are not redirected automatically, <a href="https://app-yaniv.github.io/taskirliv2/">click here</a>.</p>
</body>
</html>`;

fs.writeFileSync(indexPath, simpleHtml);
console.log('Created simple redirect index.html without Next.js dependencies.');

console.log('GitHub Pages preparation complete!'); 