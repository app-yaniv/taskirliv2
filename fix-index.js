const fs = require('fs');
const path = require('path');

console.log('Fixing index.html for GitHub Pages...');

const indexPath = path.join(__dirname, 'out', 'index.html');

if (fs.existsSync(indexPath)) {
  const correctHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>TaskirLiv2</title>
  <meta http-equiv="refresh" content="0; URL=./">
  <link rel="canonical" href="https://app-yaniv.github.io/taskirliv2/">
</head>
<body>
  <p>Loading TaskirLiv2...</p>
</body>
</html>`;

  fs.writeFileSync(indexPath, correctHtml);
  console.log('Fixed index.html successfully!');
} else {
  console.log('Creating index.html...');
  const correctHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>TaskirLiv2</title>
  <meta http-equiv="refresh" content="0; URL=./">
  <link rel="canonical" href="https://app-yaniv.github.io/taskirliv2/">
</head>
<body>
  <p>Loading TaskirLiv2...</p>
</body>
</html>`;

  fs.writeFileSync(indexPath, correctHtml);
  console.log('Created index.html successfully!');
}

console.log('Fix complete!'); 