const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/LINUX ONIX/Documents/Projet/site internet html/PROP CANADA/V5';

const filesToProcess = [
    { file: 'index.html', prefix: '' },
    { file: 'pages/product-info.html', prefix: '../' },
    { file: 'pages/delivery-info.html', prefix: '../' },
    { file: 'pages/reviews.html', prefix: '../' }
];

filesToProcess.forEach(item => {
    const fullPath = path.join(dir, item.file);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // 1. Remove old injected CSS block from HTML if it exists
    const cssRegex = /\/\* --- MOBILE MENU --- \*\/[\s\S]*?\}\n\}\n/g;
    content = content.replace(cssRegex, '');

    // 2. Remove old injected JS function
    const jsRegex = /function toggleMobileMenu\(\) \{[\s\S]*?\}\n/g;
    content = content.replace(jsRegex, '');

    // 3. Add link tag in <head> if not exists
    const linkTag = `<link rel="stylesheet" href="${item.prefix}mobile-menu.css">`;
    if (!content.includes('mobile-menu.css')) {
        content = content.replace('</head>', `    ${linkTag}\n</head>`);
    }

    // 4. Add script tag at the end of body if not exists
    const scriptTag = `<script src="${item.prefix}mobile-menu.js"></script>`;
    if (!content.includes('mobile-menu.js')) {
        content = content.replace('</body>', `    ${scriptTag}\n</body>`);
    }

    // 5. Inject the overlay into the navbar
    const overlayHtml = `<div class="mobile-menu-overlay" id="mobileOverlay" onclick="toggleMobileMenu()"></div>`;
    if (!content.includes('mobile-menu-overlay')) {
        content = content.replace(/<nav class="navbar">/, `<nav class="navbar">\n        ${overlayHtml}`);
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Cleaned and injected ' + item.file);
});

// Clean style.css
const stylePath = path.join(dir, 'style.css');
if (fs.existsSync(stylePath)) {
    let styleContent = fs.readFileSync(stylePath, 'utf8');
    const cssRegex = /\/\* --- MOBILE MENU --- \*\/[\s\S]*?\}\n\}\n/g;
    styleContent = styleContent.replace(cssRegex, '');
    fs.writeFileSync(stylePath, styleContent, 'utf8');
    console.log('Cleaned style.css');
}

// Clean script.js
const scriptPath = path.join(dir, 'script.js');
if (fs.existsSync(scriptPath)) {
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');
    const jsRegex = /function toggleMobileMenu\(\) \{[\s\S]*?\}\n/g;
    scriptContent = scriptContent.replace(jsRegex, '');
    fs.writeFileSync(scriptPath, scriptContent, 'utf8');
    console.log('Cleaned script.js');
}

console.log('Done.');
