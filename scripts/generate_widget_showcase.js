// Archivo: scripts/generate_widget_showcase.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIDGETS_DIR = path.resolve(__dirname, '../backend/stitch/widgets');
const OUTPUT_FILE = path.resolve(__dirname, '../public/widget-showcase.html');

const photos = Array.from({ length: 8 }, (_, i) => `https://picsum.photos/seed/nexus${i + 1}/800/600`);

const DUMMY_DATA = {
  BUSINESS_NAME: 'Nexus Showcase',
  INSTAGRAM_HANDLE: '@nexus_showcase',
  RATING_DISPLAY: '4.9 ⭐ (120 opiniones)',
  REVIEW_1_TEXT: '¡Excelente lugar, me encantó!',
  REVIEW_2_TEXT: 'La atención es impecable, superaron mis expectativas.',
  REVIEW_3_TEXT: 'Súper recomendado para eventos. Volveremos.',
  RATING: '4.9',
  REVIEWS_COUNT: '120',
  WHATSAPP_CLEAN: '5491112345678',
  PHONE_RAW: '+54 9 11 1234-5678',
  WHATSAPP_NUMBER: '+54 9 11 1234-5678',
  MAPS_URL: '#',
  BOOKING_TITLE: 'Reserva tu lugar ahora',
  BOOKING_desc: 'Elegí el día y la hora que prefieras.',
  FIELD_2_LABEL: 'Cantidad de personas',
  FIELD_2_OPTIONS: '<option>2 personas</option><option>4 personas</option>',
  WA_INTENT_TEXT: 'Hola, quiero reservar.',
  BOOKING_CTA: 'Confirmar Reserva',
  PHOTO_1: photos[0],
  PHOTO_2: photos[1],
  PHOTO_3: photos[2],
  PHOTO_4: photos[3],
  LOGO_URL: photos[4]
};

function getAllHtmlFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllHtmlFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.html')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

function capitalize(str) {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') + ' Simulado';
}

function generateShowcase() {
  console.log(`[Showcase Generator] Leyendo widgets en: ${WIDGETS_DIR}`);
  const htmlFiles = getAllHtmlFiles(WIDGETS_DIR);
  
  let showcaseContainers = '';
  let sidebarButtons = '';
  let photoIndex = 0;

  htmlFiles.forEach((file, index) => {
    let content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(WIDGETS_DIR, file).replace(/\\/g, '/');
    const widgetId = `widget-${index}`;
    
    // Check if empty
    const isEmpty = content.trim() === '' || /^<!--[\s\S]*?-->$/.test(content.trim());

    if (isEmpty) {
        showcaseContainers += `
        <div id="${widgetId}" class="widget-container hidden w-full h-full flex flex-col items-center justify-center border border-dashed border-red-500/50 rounded-xl bg-red-950/20 min-h-[600px]">
           <span class="bg-red-500 text-white font-bold px-4 py-2 rounded">WIDGET VACÍO / DEPRECADO</span>
           <p class="text-zinc-400 mt-4 font-mono text-sm">${relativePath}</p>
        </div>
      `;
    } else {
        // Replace fixed with absolute to prevent floating widgets from breaking layout
        content = content.replace(/\bfixed\b/g, 'absolute');

        // Prevent Global JS Collisions with IIFE
        content = content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (match, scriptBody) => {
            if (scriptBody.trim() === '') return match;
            return `<script>(function(){\n${scriptBody}\n})();</script>`;
        });

        // Universal Interpolation Motor
        content = content.replace(/\{\{([^}]+)\}\}/g, (match, p1) => {
          const varName = p1.trim();
          if (DUMMY_DATA[varName]) return DUMMY_DATA[varName];
          if (varName.startsWith('PHOTO_')) return photos[(photoIndex++) % photos.length];
          return capitalize(varName);
        });
        
        // Ensure empty src or broken src get dummy photos
        content = content.replace(/src="([^"]*)"/gi, (match, p1) => {
            if (!p1 || p1 === '#' || p1.includes('placeholder')) {
                return `src="${photos[(photoIndex++) % photos.length]}"`;
            }
            return match;
        });

        showcaseContainers += `
          <div id="${widgetId}" class="widget-container hidden">
            <div class="mb-4 flex items-center justify-between border-b border-zinc-800 pb-2">
              <h2 class="text-xl font-mono font-bold text-teal-400">${relativePath}</h2>
            </div>
            <div class="min-h-[600px] relative w-full overflow-hidden bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
              ${content}
            </div>
          </div>
        `;
    }
    
    // Sidebar Button
    sidebarButtons += `
      <button data-target="${widgetId}" class="widget-btn w-full text-left px-4 py-3 text-sm font-mono rounded-lg transition-all border border-transparent hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 focus:outline-none">
        ${relativePath}
      </button>
    `;
  });

  const finalHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tucu Red - Widget Showcase</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            neutral: {
                900: '#171717',
                950: '#0a0a0a',
            }
          },
          fontFamily: {
             heading: ['"Playfair Display"', 'serif'],
          }
        }
      }
    }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; }
    .widget-btn.active {
       background-color: #0f766e; /* teal-700 */
       color: #ffffff;
       border-color: #14b8a6; /* teal-500 */
       box-shadow: 0 0 10px rgba(20, 184, 166, 0.2);
    }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-100 h-screen overflow-hidden flex">
  
  <!-- Sidebar -->
  <aside class="w-1/4 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col shadow-2xl z-20">
      <div class="p-6 border-b border-zinc-800 bg-zinc-950 sticky top-0">
          <h1 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-600">Widget Showcase</h1>
          <p class="text-xs text-zinc-500 mt-2 font-mono">Tucu Red Engine v2.0</p>
      </div>
      <nav class="flex-1 overflow-y-auto p-4 flex flex-col gap-2 scrollbar-thin">
          ${sidebarButtons}
      </nav>
  </aside>

  <!-- Main Stage -->
  <main class="w-3/4 h-full relative overflow-y-auto bg-zinc-900/50 flex flex-col">
      <!-- Tester Panel (Sticky) -->
      <div class="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 p-6 shadow-xl flex flex-col items-center justify-center">
          <input type="text" id="testInput" placeholder="Escribí acá para probar tipografías..." class="w-full max-w-xl px-6 py-3 bg-zinc-900 border border-zinc-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-center text-lg transition-all shadow-inner">
      </div>
      
      <div class="flex-1 p-8">
          <!-- Typo Preview -->
          <div id="typoPreview" class="text-4xl text-white font-heading text-center mb-10 min-h-[48px]">Texto de prueba...</div>
          
          <!-- Contenedor Principal de Widgets -->
          <div id="stageContainer" class="w-full max-w-5xl mx-auto">
             ${showcaseContainers}
             
             <div id="emptyState" class="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-zinc-600">
                <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2l2 2h5a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"></path></svg>
                <p class="text-lg font-mono">Seleccioná un widget del menú lateral para visualizarlo.</p>
             </div>
          </div>
      </div>
  </main>

  <script>
    // Typography Tester
    const input = document.getElementById('testInput');
    const preview = document.getElementById('typoPreview');
    input.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        preview.textContent = val ? val : 'Texto de prueba...';
    });

    // Widget Navigator
    const btns = document.querySelectorAll('.widget-btn');
    const containers = document.querySelectorAll('.widget-container');
    const emptyState = document.getElementById('emptyState');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            btns.forEach(b => b.classList.remove('active'));
            // Hide all containers
            containers.forEach(c => c.classList.add('hidden'));
            
            // Activate current
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
            emptyState.classList.add('hidden');
        });
    });

    // Auto-select first widget if exists
    if(btns.length > 0) {
        btns[0].click();
    }
  </script>
</body>
</html>`;

  const publicDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, finalHtml, 'utf8');
  console.log(`✅ [Showcase Generator] Showcase HTML compilado con éxito en: ${OUTPUT_FILE}`);
}

try {
  generateShowcase();
} catch (error) {
  console.error(`❌ [Showcase Generator] Error crítico:`, error);
  process.exit(1);
}
