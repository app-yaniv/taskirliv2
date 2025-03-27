const fs = require('fs');
const path = require('path');

console.log('Fixing build output for GitHub Pages...');

// Create .nojekyll file
fs.writeFileSync(path.join(__dirname, 'docs', '.nojekyll'), '');
console.log('Created .nojekyll file');

// Check if index.html exists in root
const rootIndexPath = path.join(__dirname, 'docs', 'index.html');
if (!fs.existsSync(rootIndexPath)) {
  console.log('Creating redirect index.html in root');
  fs.writeFileSync(
    rootIndexPath,
    '<meta http-equiv="refresh" content="0;url=taskirliv2/" />'
  );
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
  }
}

console.log('Build output fixed!'); 