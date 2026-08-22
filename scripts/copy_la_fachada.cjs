// Archivo: scripts/copy_la_fachada.cjs
const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\leola\\Downloads\\la-fachada';
const destDir = path.resolve(__dirname, '../public/clients/barber-l3');

const EXCLUDED = ['node_modules', '.next', '.git', '.gemini', '.cursor', '.vscode'];

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      if (EXCLUDED.includes(childItemName)) return;
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Iniciando copia desde:', srcDir);
console.log('Hacia:', destDir);

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

copyRecursiveSync(srcDir, destDir);
console.log('✅ Copia de estructura física completada.');

// Neutralización de marcas en archivos HTML / JS / JSON
const BRAND_REPLACEMENTS = [
  { regex: /LA FACHADA/gi, replacement: 'Nexus Barber L3' },
  { regex: /La Fachada Barbería Unisex/gi, replacement: 'Nexus Barber Studio L3' },
  { regex: /La Fachada Barber Club/gi, replacement: 'Nexus Barber Club L3' },
  { regex: /la-fachada/gi, replacement: 'barber-l3' },
  { regex: /Ciudad Universitaria FADU/gi, replacement: 'San Miguel de Tucumán' }
];

function sanitizeFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const ext = path.extname(filePath).toLowerCase();
  if (!['.html', '.js', '.jsx', '.json', '.md', '.css'].includes(ext)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  for (const rep of BRAND_REPLACEMENTS) {
    if (rep.regex.test(content)) {
      content = content.replace(rep.regex, rep.replacement);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

function sanitizeDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      sanitizeDir(fullPath);
    } else {
      sanitizeFile(fullPath);
    }
  }
}

sanitizeDir(destDir);
console.log('✅ Sanitización y neutralización de marca completada.');
