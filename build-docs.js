const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Make sure the docs directory exists
if (!fs.existsSync('docs')) {
  fs.mkdirSync('docs', { recursive: true });
}

// Create .nojekyll file
fs.writeFileSync('docs/.nojekyll', '');

// Run the Next.js build
console.log('Building the Next.js application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Ensure there's an index.html in the docs folder
if (!fs.existsSync(path.join('docs', 'index.html'))) {
  const indexHtml = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Taskirli - השכרת ציוד</title>
    <script>
        // Redirect to the actual application
        window.location.href = '/';
    </script>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            text-align: center;
        }
        h1 {
            color: #0070f3;
        }
        p {
            margin-bottom: 1.5rem;
        }
        .loading {
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 3px solid rgba(0,112,243,0.3);
            border-radius: 50%;
            border-top-color: #0070f3;
            animation: spin 1s ease-in-out infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <h1>Taskirli</h1>
    <p>מעבירים אותך לאפליקציה...</p>
    <div class="loading"></div>
    <p>אם אינך מועבר אוטומטית, <a href="/">לחץ כאן</a></p>
</body>
</html>`;
  
  fs.writeFileSync(path.join('docs', 'index.html'), indexHtml);
  console.log('Created index.html in docs folder');
}

console.log('Docs directory is ready for GitHub Pages deployment!'); 