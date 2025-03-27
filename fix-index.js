const fs = require('fs');
const path = require('path');

console.log('Fixing homepage for GitHub Pages...');

// Create proper index.html with static content instead of redirect
const indexPath = path.join(__dirname, 'out', 'index.html');
const homepageHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TaskirLiv2 - Homepage</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    header { background: linear-gradient(to bottom, #f0f9ff, #ffffff); padding: 40px 0; text-align: center; }
    h1 { color: #1e40af; margin-bottom: 16px; font-size: 2.5rem; }
    p { color: #4b5563; margin-bottom: 24px; font-size: 1.125rem; }
    .btn { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; 
          text-decoration: none; border-radius: 8px; font-weight: bold; transition: background-color 0.3s; }
    .btn:hover { background-color: #1d4ed8; }
    .products { padding: 48px 0; }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
                  gap: 24px; margin-top: 32px; }
    .product-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; transition: transform 0.3s; }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    .product-card a { text-decoration: none; color: inherit; display: block; padding: 16px; }
    h3 { color: #1f2937; margin-bottom: 8px; }
    .product-description { color: #6b7280; font-size: 0.875rem; }
    footer { background-color: #1f2937; color: white; padding: 48px 0; text-align: center; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>Welcome to TaskirLiv2</h1>
      <p>The leading rental platform in Israel</p>
      <a href="/taskirliv2/product/7ef9ba3b-84fb-40b4-8447-91a97deee6b3/" class="btn">View Our Products</a>
    </div>
  </header>
  
  <section class="products">
    <div class="container">
      <h2 style="text-align: center; margin-bottom: 16px; font-size: 2rem; color: #1f2937;">Popular Products</h2>
      <p style="text-align: center; margin-bottom: 32px; color: #6b7280;">Choose from our quality product selection</p>
      
      <div class="product-grid">
        <div class="product-card">
          <a href="/taskirliv2/product/7ef9ba3b-84fb-40b4-8447-91a97deee6b3/">
            <h3>Popular Product</h3>
            <p class="product-description">Short description of the popular product</p>
          </a>
        </div>
        
        <div class="product-card">
          <a href="/taskirliv2/product/252c5d46-580b-4416-ac55-4be55f1f563d/">
            <h3>Another Popular Product</h3>
            <p class="product-description">Short description of another popular product</p>
          </a>
        </div>
        
        <div class="product-card">
          <a href="/taskirliv2/product/7ef9ba3b-84fb-40b4-8447-91a97deee6b3/">
            <h3>Additional Product</h3>
            <p class="product-description">Short description of an additional product</p>
          </a>
        </div>
      </div>
    </div>
  </section>
  
  <footer>
    <div class="container">
      <p>&copy; 2025 TaskirLiv2. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;

fs.writeFileSync(indexPath, homepageHtml);
console.log('Created static homepage successfully!');

// Create .nojekyll file if it doesn't exist
const nojekyllPath = path.join(__dirname, 'out', '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, '');
  console.log('Created .nojekyll file.');
}

console.log('Fix complete!'); 