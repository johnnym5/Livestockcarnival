const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace variations
  content = content.replace(/OFFICIAL CARNIVAL/g, 'OFFICIAL CARNIVAL');
  content = content.replace(//g, '');
  content = content.replace(//g, '');
  content = content.replace(/ /g, ' ');
  content = content.replace(//g, '');
  content = content.replace(//g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated in: ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next' || file === 'out' || file === '.git' || file === 'docx_temp') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (/\.(tsx|ts|json|html|js|jsx)$/.test(file)) {
      processFile(fullPath);
    }
  }
}

walkDir('C:/Users/HP/Documents/CODING/GOLDENCAMELANDCOW/nextjs-app/src');
walkDir('C:/Users/HP/Documents/CODING/GOLDENCAMELANDCOW/data');
walkDir('C:/Users/HP/Documents/CODING/GOLDENCAMELANDCOW');
