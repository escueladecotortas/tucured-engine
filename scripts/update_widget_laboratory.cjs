// Archivo: scripts/update_widget_laboratory.cjs
const fs = require('fs');
const path = require('path');

const widgetsDir = path.resolve(__dirname, '../backend/stitch/widgets');
const publicDir = path.resolve(__dirname, '../public');
const outputPath = path.join(publicDir, 'widget-laboratory.html');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Dummy data for placeholders
const dummyData = {
  '{{WIDGET_ID}}': () => Math.random().toString(36).substring(2, 9),
  '{{BUSINESS_NAME}}': 'Nexus Laboratory',
  '{{WHATSAPP_NUMBER}}': '3811234567',
  '{{PHONE}}': '+54 9 381 123-4567',
  '{{EMAIL}}': 'lab@nexus-os.com',
  '{{ADDRESS}}': 'Av. Independencia 123, Tucumán',
  '{{PHOTO_1}}': 'https://picsum.photos/seed/n1/800/600',
  '{{PHOTO_2}}': 'https://picsum.photos/seed/n2/800/600',
  '{{PHOTO_3}}': 'https://picsum.photos/seed/n3/800/600',
  '{{LOGO_URL}}': 'https://picsum.photos/seed/logo/150/150'
};

function readWidgetsRecursive(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(readWidgetsRecursive(filePath));
    } else if (file.endsWith('.html')) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relPath = path.relative(widgetsDir, filePath);
      results.push({ name: file, path: relPath, content });
    }
  });
  return results;
}

let widgets = readWidgetsRecursive(widgetsDir);

// Prioritize turneros
widgets.sort((a, b) => {
  if (a.name.includes('booking_l2')) return -1;
  if (b.name.includes('booking_l2')) return 1;
  if (a.name.includes('booking_l1')) return -1;
  if (b.name.includes('booking_l1')) return 1;
  return a.name.localeCompare(b.name);
});

// Replace placeholders
const regex = /\{\{([^}]+)\}\}/g;
const processedWidgets = widgets.map((w, idx) => {
  const currentWidgetId = `wid_${idx}_${Math.random().toString(36).substring(2, 9)}`;
  
  let html = w.content.replace(regex, (match, key) => {
    const fullKey = `{{${key}}}`;
    if (fullKey === '{{WIDGET_ID}}') return currentWidgetId;
    if (dummyData[fullKey]) {
      return typeof dummyData[fullKey] === 'function' ? dummyData[fullKey]() : dummyData[fullKey];
    }
    return match;
  });
  
  return {
    ...w,
    html: html
  };
});

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateHTML() {
  const sidebarHtml = processedWidgets.map((w, idx) => `
    <li>
      <button onclick="showWidget('${idx}')" id="btn-${idx}" class="${idx === 0 ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'} w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors widget-btn truncate">
        ${w.name}
      </button>
      <div class="text-[10px] text-zinc-400 px-3 truncate">${w.path}</div>
    </li>
  `).join('');

  const mainStageHtml = processedWidgets.map((w, idx) => `
    <div id="content-${idx}" class="widget-content ${idx === 0 ? '' : 'hidden'} animate-fade-in w-full h-full flex flex-col">
      <div class="mb-6 max-w-4xl flex justify-between items-start gap-4">
        <div>
          <div class="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full text-xs font-bold mb-3">Widget Lab</div>
          <h2 class="text-2xl font-bold text-zinc-900 dark:text-white mb-2">${w.name}</h2>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm font-mono">${w.path}</p>
        </div>
        <div class="relative">
          <button onclick="copyCode('${idx}', this)" id="btn-copy-${idx}" class="flex-shrink-0 flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            <span>Copiar Código</span>
          </button>
          <textarea id="code-${idx}" style="position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none;" readonly>${escapeHtml(w.content)}</textarea>
        </div>
      </div>
      
      <div class="flex-1 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-[#0a0a0a] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 flex items-start justify-center min-h-[600px] w-full overflow-y-auto relative shadow-inner">
        <div class="w-full max-w-xl mx-auto relative z-10 flex justify-center items-center" data-nexus-slot="preview">
          ${w.html}
        </div>
        <div class="absolute inset-0 z-0 opacity-20 pointer-events-none" style="background-image: radial-gradient(#60a5fa 1px, transparent 1px); background-size: 24px 24px;"></div>
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus Widget Laboratory</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Outfit', sans-serif; }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body class="bg-white dark:bg-zinc-950 h-screen overflow-hidden flex text-zinc-900 dark:text-zinc-100">
  
  <aside class="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col h-full shrink-0">
    <div class="p-6 border-b border-zinc-200 dark:border-zinc-800">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">W</div>
        <div>
          <h1 class="font-bold text-lg leading-tight">Widget Laboratory</h1>
          <span class="text-xs text-zinc-500">Live Preview & QA Environment</span>
        </div>
      </div>
      <div class="relative">
        <input type="text" id="searchInput" onkeyup="filterWidgets()" placeholder="Buscar componente..." class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
        <svg class="w-4 h-4 absolute left-3 top-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto p-4 hide-scrollbar">
      <ul class="space-y-2" id="sidebarList">
        ${sidebarHtml}
      </ul>
    </div>
  </aside>

  <main class="flex-1 h-full overflow-y-auto p-6 lg:p-10 relative bg-white dark:bg-[#050505]">
    ${mainStageHtml}
  </main>

  <script>
    function copyCode(idx, btn) {
      const ta = document.getElementById('code-' + idx);
      if (!ta) return;
      const textToCopy = ta.value;

      const triggerFeedback = () => {
        const targetBtn = btn || document.getElementById('btn-copy-' + idx);
        if (targetBtn) {
          const originalHTML = targetBtn.innerHTML;
          targetBtn.innerHTML = '<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span class="text-emerald-500 dark:text-emerald-400 font-bold">¡Copiado!</span>';
          targetBtn.classList.add('bg-emerald-500/20', 'border-emerald-500/40');
          setTimeout(() => {
            targetBtn.innerHTML = originalHTML;
            targetBtn.classList.remove('bg-emerald-500/20', 'border-emerald-500/40');
          }, 2000);
        }
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
          .then(triggerFeedback)
          .catch(() => {
            ta.select();
            document.execCommand('copy');
            triggerFeedback();
          });
      } else {
        ta.select();
        document.execCommand('copy');
        triggerFeedback();
      }
    }

    function showWidget(id) {
      document.querySelectorAll('.widget-content').forEach(el => el.classList.add('hidden'));
      document.getElementById('content-' + id).classList.remove('hidden');
      
      document.querySelectorAll('.widget-btn').forEach(btn => {
        btn.classList.remove('bg-blue-50', 'text-blue-700', 'dark:bg-blue-900/20', 'dark:text-blue-400');
        btn.classList.add('text-zinc-600', 'dark:text-zinc-400');
      });
      
      const activeBtn = document.getElementById('btn-' + id);
      if (activeBtn) {
        activeBtn.classList.remove('text-zinc-600', 'dark:text-zinc-400');
        activeBtn.classList.add('bg-blue-50', 'text-blue-700', 'dark:bg-blue-900/20', 'dark:text-blue-400');
      }
    }

    function filterWidgets() {
      const query = document.getElementById('searchInput').value.toLowerCase();
      const items = document.querySelectorAll('#sidebarList li');
      items.forEach(li => {
        const text = li.textContent.toLowerCase();
        if (text.includes(query)) {
          li.style.display = '';
        } else {
          li.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>`;
}

fs.writeFileSync(outputPath, generateHTML(), 'utf-8');
console.log(`✅ [SUCCESS] Widget Laboratory compilado con éxito. Se indexaron ${processedWidgets.length} componentes.`);
console.log(`➡️  Componente principal destacado: ${processedWidgets[0].name}`);
console.log(`🌐 Acceso local disponible en: public/widget-laboratory.html`);
