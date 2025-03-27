const fs = require('fs');
const path = require('path');

console.log('Fixing build output for GitHub Pages...');

// Create .nojekyll file
fs.writeFileSync(path.join(__dirname, 'docs', '.nojekyll'), '');
console.log('Created .nojekyll file');

// Create .nojekyll file inside taskirliv2 dir if it exists
const taskirlivDir = path.join(__dirname, 'docs', 'taskirliv2');
if (fs.existsSync(taskirlivDir)) {
  fs.writeFileSync(path.join(taskirlivDir, '.nojekyll'), '');
  console.log('Created .nojekyll file in taskirliv2 directory');
}

// Check if index.html exists in root
const rootIndexPath = path.join(__dirname, 'docs', 'index.html');
if (!fs.existsSync(rootIndexPath)) {
  console.log('Creating redirect index.html in root');
  const html = `
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
  `;
  fs.writeFileSync(rootIndexPath, html);
}

// Copy the public index.html to docs root if it exists
const publicIndexPath = path.join(__dirname, 'public', 'index.html');
if (fs.existsSync(publicIndexPath)) {
  fs.copyFileSync(publicIndexPath, rootIndexPath);
  console.log('Copied public/index.html to docs/');
}

// Check if favicon exists
const faviconPath = path.join(__dirname, 'docs', 'favicon.ico');
if (!fs.existsSync(faviconPath)) {
  // Copy from public if it exists
  const publicFaviconPath = path.join(__dirname, 'public', 'favicon.ico');
  if (fs.existsSync(publicFaviconPath)) {
    fs.copyFileSync(publicFaviconPath, faviconPath);
    console.log('Copied favicon.ico to docs/');
  } else {
    console.log('No favicon.ico found in public/');
    // Create a simple transparent favicon
    try {
      // Create a simple transparent favicon
      console.log('Creating a default favicon.ico');
      // This is a tiny 1x1 transparent ICO file in base64
const fs = require('fs');
const path = require('path');

console.log('Fixing build output for GitHub Pages...');

// Create .nojekyll file
fs.writeFileSync(path.join(__dirname, 'docs', '.nojekyll'), '');
console.log('Created .nojekyll file');

// Create .nojekyll file inside taskirliv2 dir if it exists
const taskirlivDir = path.join(__dirname, 'docs', 'taskirliv2');
if (fs.existsSync(taskirlivDir)) {
  fs.writeFileSync(path.join(taskirlivDir, '.nojekyll'), '');
  console.log('Created .nojekyll file in taskirliv2 directory');
}

// Check if index.html exists in root
const rootIndexPath = path.join(__dirname, 'docs', 'index.html');
if (!fs.existsSync(rootIndexPath)) {
  console.log('Creating redirect index.html in root');
  const html = `
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
  `;
  fs.writeFileSync(rootIndexPath, html);
}

// Copy the public index.html to docs root if it exists
const publicIndexPath = path.join(__dirname, 'public', 'index.html');
if (fs.existsSync(publicIndexPath)) {
  fs.copyFileSync(publicIndexPath, rootIndexPath);
  console.log('Copied public/index.html to docs/');
}

// Check if favicon exists
const faviconPath = path.join(__dirname, 'docs', 'favicon.ico');
if (!fs.existsSync(faviconPath)) {
  // Copy from public if it exists
  const publicFaviconPath = path.join(__dirname, 'public', 'favicon.ico');
  if (fs.existsSync(publicFaviconPath)) {
    fs.copyFileSync(publicFaviconPath, faviconPath);
    console.log('Copied favicon.ico to docs/');
  } else {
    console.log('No favicon.ico found in public/');
    // Create a simple transparent favicon
    try {
      // Copy a sample favicon from node_modules if available, or create a simple one
      console.log('Creating a default favicon.ico');
      // This is a tiny 1x1 transparent ICO file in base64
  }
}

console.log('Build output fixed!'); 