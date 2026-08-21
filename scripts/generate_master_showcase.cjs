// Archivo: scripts/generate_master_showcase.cjs
// Generador del Master Showcase v2.0 - Catálogo de 35 Widgets
// Doctrina de Hierro: PEAC Estricto (Cero parches)

const fs = require('fs');
const path = require('path');

const widgets = [
  // --- GRUPO 1: CONVERSIÓN, RESERVAS Y TURNOS ---
  {
    id: "booking_v1_turnero_express", group: "GRUPO 1: CONVERSIÓN, RESERVAS Y TURNOS",
    name: "Turnero Express", desc: "Selector interactivo de día/franja horaria con despacho a WhatsApp.",
    html: `
      <div class="max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 p-6">
        <h3 class="text-xl font-bold mb-2">Agendar Turno</h3>
        <p class="text-zinc-500 text-sm mb-6">Selecciona una fecha y horario disponible.</p>
        <div class="space-y-4">
          <select class="w-full rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 outline-none"><option>Hoy</option><option>Mañana</option></select>
          <div class="grid grid-cols-3 gap-2">
            <button class="py-2 text-sm rounded-lg bg-zinc-100 dark:bg-zinc-800">09:00</button>
            <button class="py-2 text-sm rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20">10:30</button>
            <button class="py-2 text-sm rounded-lg bg-zinc-100 dark:bg-zinc-800">11:00</button>
          </div>
        </div>
        <button class="mt-8 w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold py-4 rounded-xl flex justify-center items-center gap-2">Confirmar</button>
      </div>
    `
  },
  {
    id: "booking_v2_multi_service_selector", group: "GRUPO 1: CONVERSIÓN, RESERVAS Y TURNOS",
    name: "Selector de Servicios", desc: "Tarjetas seleccionables de múltiples servicios con precios dinámicos.",
    html: `
      <div class="max-w-2xl mx-auto space-y-4">
        <label class="block cursor-pointer border-2 border-blue-500 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow flex justify-between items-center">
          <div><h4 class="font-bold">Consulta Premium</h4><p class="text-zinc-500 text-sm">45 min</p></div>
          <div class="text-right"><span class="font-bold text-xl">$15.000</span></div>
        </label>
        <label class="block cursor-pointer border-2 border-transparent bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow flex justify-between items-center">
          <div><h4 class="font-bold">Control de Rutina</h4><p class="text-zinc-500 text-sm">20 min</p></div>
          <div class="text-right"><span class="font-bold text-xl">$8.000</span></div>
        </label>
      </div>
    `
  },
  {
    id: "booking_v3_calendar_slots", group: "GRUPO 1: CONVERSIÓN, RESERVAS Y TURNOS",
    name: "Calendario de Slots", desc: "Mini-calendario horizontal con grilla de horarios.",
    html: `
      <div class="max-w-md mx-auto bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-xl">
        <div class="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar mb-4">
          <div class="min-w-[4rem] text-center"><span class="text-xs">Lun</span><button class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 font-bold">12</button></div>
          <div class="min-w-[4rem] text-center"><span class="text-xs text-blue-500 font-bold">Mar</span><button class="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold">13</button></div>
          <div class="min-w-[4rem] text-center"><span class="text-xs">Mie</span><button class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 font-bold">14</button></div>
        </div>
        <div class="flex flex-wrap gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-6">
          <button class="px-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700">09:00</button>
          <button class="px-4 py-2 text-sm rounded-xl bg-blue-50 border border-blue-500 text-blue-700 font-bold">10:30</button>
        </div>
      </div>
    `
  },
  {
    id: "booking_v4_table_reservation", group: "GRUPO 1: CONVERSIÓN, RESERVAS Y TURNOS",
    name: "Reserva Gastronómica", desc: "Selector de cantidad de comensales (pax) y horario.",
    html: `
      <div class="max-w-lg mx-auto bg-zinc-950 p-8 rounded-[2rem] text-white shadow-2xl">
        <h3 class="text-3xl font-serif mb-6">Reserva tu Mesa</h3>
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-zinc-900 p-4 rounded-2xl"><label class="text-xs text-zinc-500">PAX</label><div class="text-2xl font-bold text-center">4</div></div>
          <div class="bg-zinc-900 p-4 rounded-2xl"><label class="text-xs text-zinc-500">FECHA</label><div class="text-lg font-medium text-center">Hoy</div></div>
        </div>
        <div class="flex gap-2 overflow-x-auto pb-4">
          <button class="px-5 py-2 rounded-full border border-zinc-700">20:30</button>
          <button class="px-5 py-2 rounded-full bg-amber-600 font-bold shadow-lg shadow-amber-600/20">21:00</button>
        </div>
        <button class="w-full bg-white text-black font-bold py-4 rounded-xl mt-4">Confirmar</button>
      </div>
    `
  },
  {
    id: "booking_v5_consultation_modal", group: "GRUPO 1: CONVERSIÓN, RESERVAS Y TURNOS",
    name: "Modal de Asesoramiento", desc: "Drawer flotante con formulario ultracorto.",
    html: `
      <div class="w-full max-w-md mx-auto bg-white dark:bg-zinc-950 p-6 rounded-3xl shadow-xl text-center">
        <h3 class="text-2xl font-bold mb-2">Hablemos</h3>
        <p class="text-zinc-500 mb-6">Déjanos tu WhatsApp y te contactamos.</p>
        <div class="flex gap-2">
          <input type="tel" placeholder="+54 9 381 1234567" class="flex-1 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 outline-none">
          <button class="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl">Enviar</button>
        </div>
      </div>
    `
  },
  {
    id: "booking_v6_event_rsvp", group: "GRUPO 1: CONVERSIÓN, RESERVAS Y TURNOS",
    name: "RSVP Eventos", desc: "Tarjeta de confirmación de asistencia con cupos.",
    html: `
      <div class="max-w-sm mx-auto bg-zinc-950 p-8 rounded-3xl text-white text-center border border-zinc-800">
        <span class="inline-block px-3 py-1 bg-zinc-800 text-xs font-bold uppercase rounded-full mb-4">Vip Access</span>
        <h3 class="text-3xl font-bold mb-2">Gran Apertura</h3>
        <p class="text-zinc-400 mb-6">Viernes 28 Octubre • 21:00 hs</p>
        <div class="text-pink-400 text-sm font-medium mb-8 animate-pulse">Solo quedan 12 lugares</div>
        <button class="w-full bg-white text-black font-bold py-4 rounded-xl uppercase">Confirmar Asistencia</button>
      </div>
    `
  },
  // --- GRUPO 2: CONTACTO RÁPIDO Y OMNICANALIDAD ---
  {
    id: "contact_v1_floating_action_dock", group: "GRUPO 2: CONTACTO RÁPIDO Y OMNICANALIDAD",
    name: "Floating Action Dock", desc: "Barra inferior flotante mobile-first.",
    html: `
      <div class="max-w-md mx-auto bg-white dark:bg-zinc-950 p-4 rounded-3xl shadow-xl flex justify-between items-center border border-zinc-200 dark:border-zinc-800">
        <button class="flex flex-col items-center flex-1 text-green-500 font-bold"><span class="text-xs">WhatsApp</span></button>
        <button class="flex flex-col items-center flex-1 text-blue-500 font-bold"><span class="text-xs">Llamar</span></button>
        <button class="flex flex-col items-center flex-1 -mt-8 relative">
          <div class="w-14 h-14 bg-zinc-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-zinc-900 shadow-xl">Turnos</div>
        </button>
        <button class="flex flex-col items-center flex-1 text-zinc-500"><span class="text-xs">Ubicación</span></button>
      </div>
    `
  },
  {
    id: "contact_v2_whatsapp_megabutton", group: "GRUPO 2: CONTACTO RÁPIDO Y OMNICANALIDAD",
    name: "WhatsApp Megabutton", desc: "Botón flotante lateral con pulso de radar.",
    html: `
      <button class="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 pr-6 rounded-full shadow-lg border border-zinc-100 dark:border-zinc-800 mx-auto">
        <div class="relative flex h-12 w-12 items-center justify-center">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-12 w-12 bg-green-500"></span>
        </div>
        <div class="text-left"><span class="block text-xs font-bold text-green-500">En Línea</span><span class="block text-sm font-medium">Chateá con nosotros</span></div>
      </button>
    `
  },
  {
    id: "contact_v3_callback_widget", group: "GRUPO 2: CONTACTO RÁPIDO Y OMNICANALIDAD",
    name: "Callback Instantáneo", desc: "Formulario de una sola línea.",
    html: `
      <div class="max-w-xl mx-auto bg-blue-600 text-white p-2 rounded-2xl flex items-center gap-2 shadow-2xl">
        <div class="pl-4 font-bold whitespace-nowrap">¿Te llamamos?</div>
        <div class="flex-1 flex gap-2 w-full p-2">
          <input type="tel" placeholder="Tu número..." class="flex-1 bg-blue-700/50 border-none rounded-xl px-4 text-white outline-none">
          <button class="bg-white text-blue-600 font-bold px-6 py-2 rounded-xl">Llamadme</button>
        </div>
      </div>
    `
  },
  {
    id: "contact_v4_social_links_grid", group: "GRUPO 2: CONTACTO RÁPIDO Y OMNICANALIDAD",
    name: "Redes Sociales Grid", desc: "Grilla moderna de botones a redes sociales.",
    html: `
      <div class="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        <a href="#" class="bg-[#E1306C] text-white p-4 rounded-2xl font-bold text-center shadow-lg hover:scale-105 transition-transform">Instagram</a>
        <a href="#" class="bg-[#1877F2] text-white p-4 rounded-2xl font-bold text-center shadow-lg hover:scale-105 transition-transform">Facebook</a>
        <a href="#" class="bg-[#FF0000] text-white p-4 rounded-2xl font-bold text-center shadow-lg hover:scale-105 transition-transform">YouTube</a>
        <a href="#" class="bg-black text-white p-4 rounded-2xl font-bold text-center shadow-lg hover:scale-105 transition-transform">TikTok</a>
      </div>
    `
  },
  {
    id: "contact_v5_click_to_chat_bubble", group: "GRUPO 2: CONTACTO RÁPIDO Y OMNICANALIDAD",
    name: "Chat Bubble", desc: "Mini-chat simulado con avatar y mensaje.",
    html: `
      <div class="max-w-xs mx-auto bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-xl border border-zinc-100 dark:border-zinc-800">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex-shrink-0"></div>
          <div>
            <div class="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-none text-sm text-zinc-700 dark:text-zinc-300">
              ¡Hola! ¿En qué puedo ayudarte hoy?
            </div>
            <button class="mt-3 w-full text-center bg-blue-600 text-white font-bold py-2 rounded-xl text-sm">Responder</button>
          </div>
        </div>
      </div>
    `
  },
  // --- GRUPO 3: AUTORIDAD, CONFIANZA Y PRUEBA SOCIAL ---
  {
    id: "trust_v1_google_live_badge", group: "GRUPO 3: AUTORIDAD, CONFIANZA Y PRUEBA SOCIAL",
    name: "Google Live Badge", desc: "Píldora con calificación real de Google Maps.",
    html: `
      <div class="flex justify-center">
        <div class="inline-flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-5 py-2 shadow-sm">
          <span class="text-amber-400 font-bold tracking-widest text-lg">★★★★★</span>
          <span class="text-sm font-bold text-zinc-900 dark:text-white">4.9 / 5.0</span>
        </div>
      </div>
    `
  },
  {
    id: "social_v1_marquee_reviews_tape", group: "GRUPO 3: AUTORIDAD, CONFIANZA Y PRUEBA SOCIAL",
    name: "Marquee Reviews Tape", desc: "Cinta continua infinita de testimonios.",
    html: `
      <div class="w-full overflow-hidden whitespace-nowrap bg-zinc-950 text-white py-4 relative group">
        <div class="inline-block animate-marquee group-hover:pause">
          <span class="mx-8 font-bold">"El mejor servicio de la zona" ⭐⭐⭐⭐⭐</span>
          <span class="mx-8 text-zinc-500">•</span>
          <span class="mx-8 font-bold">"Rápidos y confiables" ⭐⭐⭐⭐⭐</span>
          <span class="mx-8 text-zinc-500">•</span>
          <span class="mx-8 font-bold">"Excelente atención al cliente" ⭐⭐⭐⭐⭐</span>
        </div>
        <style>@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { animation: marquee 15s linear infinite; } .pause { animation-play-state: paused; }</style>
      </div>
    `
  },
  {
    id: "trust_v2_verified_stats_counter", group: "GRUPO 3: AUTORIDAD, CONFIANZA Y PRUEBA SOCIAL",
    name: "Contador de Estadísticas", desc: "Contador numérico animado de métricas clave.",
    html: `
      <div class="grid grid-cols-3 gap-6 text-center max-w-2xl mx-auto">
        <div class="p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800"><div class="text-4xl font-black text-blue-600 mb-2">+10k</div><div class="text-xs uppercase font-bold text-zinc-500">Clientes Felices</div></div>
        <div class="p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800"><div class="text-4xl font-black text-blue-600 mb-2">99%</div><div class="text-xs uppercase font-bold text-zinc-500">Casos de Éxito</div></div>
        <div class="p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800"><div class="text-4xl font-black text-blue-600 mb-2">5</div><div class="text-xs uppercase font-bold text-zinc-500">Años de Exp.</div></div>
      </div>
    `
  },
  {
    id: "social_v2_testimonials_grid", group: "GRUPO 3: AUTORIDAD, CONFIANZA Y PRUEBA SOCIAL",
    name: "Grilla de Testimonios", desc: "Grilla estructurada de opiniones.",
    html: `
      <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div class="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl"><div class="text-amber-400 mb-3">★★★★★</div><p class="italic mb-4">"Increíble calidad y profesionalismo."</p><div class="font-bold text-sm">María L.</div></div>
        <div class="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl"><div class="text-amber-400 mb-3">★★★★★</div><p class="italic mb-4">"Totalmente recomendados, volveré a comprar."</p><div class="font-bold text-sm">Carlos M.</div></div>
      </div>
    `
  },
  {
    id: "trust_v3_press_logo_bar", group: "GRUPO 3: AUTORIDAD, CONFIANZA Y PRUEBA SOCIAL",
    name: "Barra de Logos", desc: "Barra en escala de grises con logotipos.",
    html: `
      <div class="flex justify-center gap-12 items-center max-w-4xl mx-auto py-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
        <div class="text-2xl font-black font-serif tracking-tighter">FORBES</div>
        <div class="text-2xl font-black uppercase">Clarin</div>
        <div class="text-2xl font-black italic">La Gaceta</div>
      </div>
    `
  },
  {
    id: "social_v3_faq_accordion", group: "GRUPO 3: AUTORIDAD, CONFIANZA Y PRUEBA SOCIAL",
    name: "Acordeón FAQ", desc: "Acordeón interactivo de preguntas frecuentes.",
    html: `
      <div class="max-w-xl mx-auto space-y-4">
        <details class="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 cursor-pointer open:bg-blue-50 dark:open:bg-blue-900/10">
          <summary class="font-bold text-lg outline-none">¿Cuáles son los medios de pago?</summary>
          <p class="mt-4 text-zinc-600 dark:text-zinc-400">Aceptamos tarjetas de crédito, débito, transferencia bancaria y MercadoPago.</p>
        </details>
        <details class="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 cursor-pointer">
          <summary class="font-bold text-lg outline-none">¿Hacen envíos al interior?</summary>
          <p class="mt-4 text-zinc-600 dark:text-zinc-400">Sí, enviamos a todo el país a través de Andreani y OCA.</p>
        </details>
      </div>
    `
  },
  // --- GRUPO 4: EXHIBICIÓN VISUAL Y CATÁLOGOS ---
  {
    id: "gallery_v1_stories_grid_vertical", group: "GRUPO 4: EXHIBICIÓN VISUAL Y CATÁLOGOS",
    name: "Stories Grid", desc: "Grilla de tarjetas 4:5 estilo Instagram Stories.",
    html: `
      <div class="flex gap-4 overflow-x-auto snap-x max-w-5xl mx-auto pb-4">
        <div class="min-w-[200px] h-80 bg-zinc-800 rounded-3xl snap-center relative overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80" class="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform">
          <div class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent"><span class="text-white font-bold text-lg">Proyectos</span></div>
        </div>
        <div class="min-w-[200px] h-80 bg-zinc-800 rounded-3xl snap-center relative overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80" class="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform">
          <div class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent"><span class="text-white font-bold text-lg">Equipo</span></div>
        </div>
        <div class="min-w-[200px] h-80 bg-zinc-800 rounded-3xl snap-center relative overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80" class="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform">
          <div class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent"><span class="text-white font-bold text-lg">Instalaciones</span></div>
        </div>
      </div>
    `
  },
  {
    id: "catalog_v1_quick_shop_grid", group: "GRUPO 4: EXHIBICIÓN VISUAL Y CATÁLOGOS",
    name: "Quick Shop Grid", desc: "Tarjetas de productos/servicios con botón de compra rápida.",
    html: `
      <div class="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
        <div class="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
          <div class="h-48 bg-zinc-200"><img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" class="h-full w-full object-cover"></div>
          <div class="p-5 flex justify-between items-center"><div class="font-bold">Auriculares Pro</div><button class="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm">$45.000</button></div>
        </div>
        <div class="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
          <div class="h-48 bg-zinc-200"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" class="h-full w-full object-cover"></div>
          <div class="p-5 flex justify-between items-center"><div class="font-bold">Smart Watch</div><button class="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm">$89.000</button></div>
        </div>
      </div>
    `
  },
  {
    id: "gallery_v2_masonry_portfolio", group: "GRUPO 4: EXHIBICIÓN VISUAL Y CATÁLOGOS",
    name: "Masonry Portfolio", desc: "Galería de imágenes asimétrica.",
    html: `
      <div class="columns-2 md:columns-3 gap-4 space-y-4 max-w-5xl mx-auto">
        <div class="break-inside-avoid"><img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80" class="w-full rounded-2xl shadow"></div>
        <div class="break-inside-avoid"><img src="https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&q=80" class="w-full rounded-2xl shadow"></div>
        <div class="break-inside-avoid"><img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80" class="w-full rounded-2xl shadow"></div>
        <div class="break-inside-avoid"><img src="https://images.unsplash.com/photo-1600607687920-4e2a09c26471?w=500&q=80" class="w-full rounded-2xl shadow"></div>
      </div>
    `
  },
  {
    id: "catalog_v2_service_menu_cards", group: "GRUPO 4: EXHIBICIÓN VISUAL Y CATÁLOGOS",
    name: "Service Menu Cards", desc: "Menú de servicios tabulado.",
    html: `
      <div class="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 border border-zinc-100 dark:border-zinc-800">
        <h3 class="text-2xl font-serif font-bold mb-6 text-center border-b pb-4">Menú de Spa</h3>
        <ul class="space-y-4">
          <li class="flex justify-between items-baseline border-b border-dashed border-zinc-300 dark:border-zinc-700 pb-2"><div class="font-bold text-lg">Masaje Descontracturante</div><div class="font-mono font-bold">$12.000</div></li>
          <li class="flex justify-between items-baseline border-b border-dashed border-zinc-300 dark:border-zinc-700 pb-2"><div class="font-bold text-lg">Limpieza Facial Profunda</div><div class="font-mono font-bold">$15.500</div></li>
          <li class="flex justify-between items-baseline pb-2"><div class="font-bold text-lg text-blue-600">Pack Día de Spa (2 hs)</div><div class="font-mono font-bold text-blue-600">$25.000</div></li>
        </ul>
      </div>
    `
  },
  {
    id: "gallery_v3_before_after_slider", group: "GRUPO 4: EXHIBICIÓN VISUAL Y CATÁLOGOS",
    name: "Before/After Slider", desc: "Control deslizante interactivo de comparación visual.",
    html: `
      <div class="relative w-full max-w-2xl mx-auto h-80 bg-zinc-200 rounded-3xl overflow-hidden cursor-ew-resize group">
        <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80')"></div>
        <div class="absolute inset-0 bg-cover bg-center border-r-4 border-white w-1/2" style="background-image: url('https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&q=80')">
          <div class="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 text-xs font-bold rounded">Antes</div>
        </div>
        <div class="absolute bottom-4 right-4 bg-white text-black px-2 py-1 text-xs font-bold rounded shadow">Después</div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center pointer-events-none">
          <svg class="w-5 h-5 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l-3 3 3 3m8-6l3 3-3 3"></path></svg>
        </div>
      </div>
    `
  },
  {
    id: "catalog_v3_pricing_comparison_table", group: "GRUPO 4: EXHIBICIÓN VISUAL Y CATÁLOGOS",
    name: "Pricing Comparison Table", desc: "Tabla comparativa de planes con columna destacada.",
    html: `
      <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div class="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center">
          <h4 class="text-xl font-bold mb-2">Básico</h4><div class="text-4xl font-black mb-6">$5.000<span class="text-sm text-zinc-500 font-normal">/mes</span></div>
          <ul class="text-left space-y-3 mb-8 text-sm"><li class="flex gap-2">✅ Acceso estándar</li><li class="flex gap-2">✅ Soporte email</li></ul>
          <button class="w-full py-3 rounded-xl border border-zinc-300 font-bold hover:bg-zinc-50">Elegir Básico</button>
        </div>
        <div class="bg-blue-600 text-white p-8 rounded-3xl shadow-2xl text-center relative scale-105">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">Popular</div>
          <h4 class="text-xl font-bold mb-2">Premium</h4><div class="text-4xl font-black mb-6">$12.000<span class="text-blue-200 text-sm font-normal">/mes</span></div>
          <ul class="text-left space-y-3 mb-8 text-sm"><li class="flex gap-2">✅ Todo lo Básico</li><li class="flex gap-2">✅ Soporte prioritario 24/7</li><li class="flex gap-2">✅ Funciones Pro</li></ul>
          <button class="w-full py-3 rounded-xl bg-white text-blue-600 font-bold shadow-lg hover:bg-zinc-100">Elegir Premium</button>
        </div>
      </div>
    `
  },
  // --- GRUPO 5: UBICACIÓN, CIERRE Y FOOTERS ---
  {
    id: "footer_v1_map_and_hours", group: "GRUPO 5: UBICACIÓN, CIERRE Y FOOTERS",
    name: "Mapa y Horarios (Dual)", desc: "Bloque dual con dirección y estado en vivo.",
    html: `
      <div class="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl">
        <div class="md:w-1/2 p-8 flex flex-col justify-center">
          <h3 class="text-2xl font-bold mb-4">Te esperamos</h3>
          <p class="font-bold mb-1">San Martín 1234, Local 5</p>
          <p class="text-zinc-500 text-sm mb-6">San Miguel de Tucumán</p>
          <div class="flex items-center gap-2 text-green-500 font-bold"><span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span> Abierto ahora</div>
        </div>
        <div class="md:w-1/2 h-64 bg-zinc-200 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-26.83,-65.20&zoom=15&size=600x400')] bg-cover bg-center"></div>
      </div>
    `
  },
  {
    id: "footer_v2_newsletter_lead_magnet", group: "GRUPO 5: UBICACIÓN, CIERRE Y FOOTERS",
    name: "Newsletter Lead Magnet", desc: "Caja de captura de emails con incentivo.",
    html: `
      <div class="max-w-2xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-10 text-center text-white shadow-2xl">
        <h3 class="text-3xl font-bold mb-3">Obtén 20% de Descuento</h3>
        <p class="text-indigo-100 mb-8">Suscríbete y recibe tu cupón en el momento.</p>
        <div class="flex gap-2 max-w-md mx-auto bg-white/10 p-1.5 rounded-2xl backdrop-blur-sm border border-white/20">
          <input type="email" placeholder="Tu email..." class="flex-1 bg-transparent border-none text-white placeholder-indigo-200 px-4 outline-none">
          <button class="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl shadow-lg">Quiero el cupón</button>
        </div>
      </div>
    `
  },
  {
    id: "footer_v3_complete_brand_directory", group: "GRUPO 5: UBICACIÓN, CIERRE Y FOOTERS",
    name: "Footer Institucional", desc: "Footer completo con columnas y enlaces legales.",
    html: `
      <footer class="bg-zinc-950 text-zinc-400 py-12 px-8 rounded-t-3xl max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-zinc-800 pb-8">
          <div class="md:col-span-2">
            <h2 class="text-2xl font-black text-white mb-4">NEXUS BRAND</h2>
            <p class="text-sm">Potenciando negocios con tecnología de punta y diseño espectacular.</p>
          </div>
          <div>
            <h4 class="text-white font-bold mb-4">Enlaces</h4>
            <ul class="space-y-2 text-sm"><li><a href="#" class="hover:text-white">Inicio</a></li><li><a href="#" class="hover:text-white">Servicios</a></li><li><a href="#" class="hover:text-white">Contacto</a></li></ul>
          </div>
          <div>
            <h4 class="text-white font-bold mb-4">Legales</h4>
            <ul class="space-y-2 text-sm"><li><a href="#" class="hover:text-white">Privacidad</a></li><li><a href="#" class="hover:text-white">Términos</a></li></ul>
          </div>
        </div>
        <div class="text-sm text-center">© 2026 Nexus OS. Todos los derechos reservados.</div>
      </footer>
    `
  },
  // --- GRUPO 6: GADGETS DE URGENCIA Y PERSUASIÓN ---
  {
    id: "powerup_v1_countdown_banner", group: "GRUPO 6: GADGETS DE URGENCIA Y PERSUASIÓN",
    name: "Sticky Countdown Banner", desc: "Barra adhesiva con temporizador en vivo.",
    html: `
      <div class="bg-red-600 text-white p-3 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium rounded-xl">
        <span>🔥 OFERTA RELÁMPAGO TERMINA EN:</span>
        <div class="flex items-center gap-2 font-mono font-bold bg-black/20 px-3 py-1 rounded-lg">
          <span>02H : 45M : 12S</span>
        </div>
      </div>
    `
  },
  {
    id: "powerup_v2_simple_cost_calculator", group: "GRUPO 6: GADGETS DE URGENCIA Y PERSUASIÓN",
    name: "Cotizador Interactivo", desc: "Cotizador con range slider para presupuestos.",
    html: `
      <div class="max-w-md mx-auto bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-zinc-100">
        <h3 class="text-xl font-bold mb-6 text-center">Calcula tu presupuesto</h3>
        <label class="block text-sm font-medium mb-4">Metros Cuadrados: <span class="font-bold text-blue-600">120 m²</span></label>
        <input type="range" min="50" max="500" value="120" class="w-full mb-8 accent-blue-600">
        <div class="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-4 text-center">
          <span class="block text-sm text-zinc-500 mb-1">Costo Estimado</span>
          <span class="block text-3xl font-black text-zinc-900 dark:text-white">$ 240.000</span>
        </div>
      </div>
    `
  },
  {
    id: "powerup_v3_announcement_bar", group: "GRUPO 6: GADGETS DE URGENCIA Y PERSUASIÓN",
    name: "Announcement Bar", desc: "Barra superior minimalista para avisos.",
    html: `
      <div class="bg-zinc-900 text-zinc-200 text-xs font-bold text-center py-2 uppercase tracking-widest w-full rounded-xl">
        Envío gratis a todo el país en compras superiores a $50.000 🚀
      </div>
    `
  },
  {
    id: "powerup_v4_exit_intent_popup", group: "GRUPO 6: GADGETS DE URGENCIA Y PERSUASIÓN",
    name: "Exit Intent Popup", desc: "Modal automatizado de abandono de página.",
    html: `
      <div class="w-full max-w-lg mx-auto relative group">
        <div class="absolute inset-0 bg-black/60 rounded-3xl backdrop-blur-sm z-0"></div>
        <div class="relative bg-white dark:bg-zinc-950 m-4 p-8 rounded-2xl shadow-2xl text-center z-10 border border-zinc-200 dark:border-zinc-800">
          <h2 class="text-3xl font-black mb-2">¡Espera! No te vayas.</h2>
          <p class="text-zinc-500 mb-6">Llévate un 15% OFF en tu primera compra usando el código: <span class="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-black dark:text-white">NEXUS15</span></p>
          <button class="bg-zinc-900 dark:bg-white text-white dark:text-black font-bold px-8 py-3 rounded-xl w-full">Aprovechar Descuento</button>
        </div>
      </div>
    `
  },
  {
    id: "powerup_v5_floating_audio_player", group: "GRUPO 6: GADGETS DE URGENCIA Y PERSUASIÓN",
    name: "Floating Audio Player", desc: "Reproductor de audio compacto.",
    html: `
      <div class="flex justify-center">
        <div class="bg-white dark:bg-zinc-900 rounded-full p-2 pr-6 shadow-xl border border-zinc-200 flex items-center gap-4">
          <button class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">▶</button>
          <div class="flex flex-col"><span class="text-xs font-bold">Un mensaje del fundador</span><div class="w-32 h-1 bg-zinc-200 rounded-full mt-2"><div class="w-1/3 h-full bg-blue-600 rounded-full"></div></div></div>
        </div>
      </div>
    `
  },
  {
    id: "powerup_v6_floating_promo_banner", group: "GRUPO 6: GADGETS DE URGENCIA Y PERSUASIÓN",
    name: "Floating Promo Banner", desc: "Tarjeta desplegable flotante con promoción.",
    html: `
      <div class="max-w-xs bg-gradient-to-tr from-pink-500 to-rose-500 text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden mx-auto">
        <button class="absolute top-2 right-2 text-white/50 hover:text-white">✕</button>
        <div class="text-4xl font-black mb-1">50% OFF</div>
        <p class="text-sm font-medium mb-4">En tratamiento capilar por tiempo limitado.</p>
        <button class="bg-white text-rose-600 text-sm font-bold w-full py-2 rounded-xl">Reservar Ahora</button>
      </div>
    `
  },
  {
    id: "powerup_v7_interactive_quiz_lead", group: "GRUPO 6: GADGETS DE URGENCIA Y PERSUASIÓN",
    name: "Interactive Quiz Lead", desc: "Mini cuestionario para derivación de servicios.",
    html: `
      <div class="max-w-md mx-auto bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl text-center border border-zinc-200 dark:border-zinc-800">
        <h3 class="text-xl font-bold mb-6">¿Qué tipo de piel tienes?</h3>
        <div class="space-y-3">
          <button class="w-full bg-zinc-50 dark:bg-zinc-800 hover:bg-blue-50 hover:text-blue-600 border border-zinc-200 rounded-xl p-4 font-medium transition-colors">Seca o Sensible</button>
          <button class="w-full bg-zinc-50 dark:bg-zinc-800 hover:bg-blue-50 hover:text-blue-600 border border-zinc-200 rounded-xl p-4 font-medium transition-colors">Grasa o Mixta</button>
        </div>
        <p class="text-xs text-zinc-400 mt-6">Paso 1 de 3</p>
      </div>
    `
  },
  {
    id: "powerup_v8_floating_share_dock", group: "GRUPO 6: GADGETS DE URGENCIA Y PERSUASIÓN",
    name: "Floating Share Dock", desc: "Botones flotantes de copiado y compartir.",
    html: `
      <div class="flex justify-center">
        <div class="bg-zinc-900 text-white rounded-full px-6 py-3 shadow-xl flex items-center gap-6">
          <span class="text-sm font-bold">Compartir:</span>
          <button class="hover:text-blue-400 transition-colors">🔗 Copiar</button>
          <button class="hover:text-blue-400 transition-colors">💬 WhatsApp</button>
        </div>
      </div>
    `
  },
  {
    id: "powerup_v9_breadcrumb_navigation", group: "GRUPO 6: GADGETS DE URGENCIA Y PERSUASIÓN",
    name: "Breadcrumb Navigation", desc: "Barra de migas de pan minimalista.",
    html: `
      <div class="w-full bg-zinc-50 dark:bg-zinc-900/50 px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-medium text-zinc-500">
        <a href="#" class="hover:text-blue-600">Inicio</a>
        <span>/</span>
        <a href="#" class="hover:text-blue-600">Servicios</a>
        <span>/</span>
        <span class="text-zinc-900 dark:text-zinc-100 font-bold">Masajes Relajantes</span>
      </div>
    `
  }
];

function generateHTML() {
  const groups = [...new Set(widgets.map(w => w.group))];
  
  const sidebarHtml = groups.map(group => {
    const groupWidgets = widgets.filter(w => w.group === group);
    return `
      <div class="mb-8">
        <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 px-3">${group}</h3>
        <ul class="space-y-1">
          ${groupWidgets.map((w, idx) => `
            <li>
              <button onclick="showWidget('${w.id}')" id="btn-${w.id}" class="${idx===0 && group===groups[0] ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'} w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors widget-btn truncate">
                ${w.name}
              </button>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }).join('');

  const mainStageHtml = widgets.map((w, idx) => `
    <div id="content-${w.id}" class="widget-content ${idx === 0 ? '' : 'hidden'} animate-fade-in">
      <div class="mb-8 max-w-4xl">
        <div class="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full text-xs font-bold mb-3">${w.id}</div>
        <h2 class="text-3xl font-bold text-zinc-900 dark:text-white mb-2">${w.name}</h2>
        <p class="text-zinc-500 dark:text-zinc-400 text-lg">${w.desc}</p>
      </div>
      <div class="bg-zinc-50/50 dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 min-h-[600px] flex items-center justify-center overflow-x-auto">
        <div class="w-full">
          ${w.html}
        </div>
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus Master Showcase v2.0</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;700;900&display=swap');
    body { font-family: 'Inter', sans-serif; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Outfit', sans-serif; }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body class="bg-white dark:bg-zinc-950 h-screen overflow-hidden flex text-zinc-900 dark:text-zinc-100">
  
  <aside class="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col h-full">
    <div class="p-6 border-b border-zinc-200 dark:border-zinc-800">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">N</div>
        <div>
          <h1 class="font-bold text-lg leading-tight">Master Showcase</h1>
          <span class="text-xs text-zinc-500">v2.0 • 35 Widgets Headless</span>
        </div>
      </div>
      <div class="relative">
        <input type="text" id="searchInput" onkeyup="filterWidgets()" placeholder="Buscar widget..." class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto p-4 hide-scrollbar" id="sidebarList">
      ${sidebarHtml}
    </div>
  </aside>

  <main class="flex-1 h-full overflow-y-auto p-8 lg:p-12">
    ${mainStageHtml}
  </main>

  <script>
    function showWidget(id) {
      document.querySelectorAll('.widget-content').forEach(el => el.classList.add('hidden'));
      document.getElementById('content-' + id).classList.remove('hidden');
      
      document.querySelectorAll('.widget-btn').forEach(btn => {
        btn.classList.remove('bg-blue-50', 'text-blue-700', 'dark:bg-blue-900/20', 'dark:text-blue-400');
        btn.classList.add('text-zinc-600', 'dark:text-zinc-400');
      });
      
      const activeBtn = document.getElementById('btn-' + id);
      activeBtn.classList.remove('text-zinc-600', 'dark:text-zinc-400');
      activeBtn.classList.add('bg-blue-50', 'text-blue-700', 'dark:bg-blue-900/20', 'dark:text-blue-400');
    }

    function filterWidgets() {
      const query = document.getElementById('searchInput').value.toLowerCase();
      const btns = document.querySelectorAll('.widget-btn');
      btns.forEach(btn => {
        const text = btn.textContent.toLowerCase();
        if (text.includes(query)) {
          btn.parentElement.style.display = '';
        } else {
          btn.parentElement.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>`;
}

const outputPath = path.resolve(__dirname, '../public/master-showcase.html');
const publicDir = path.dirname(outputPath);
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(outputPath, generateHTML(), 'utf-8');
console.log(`✅ [SUCCESS] Master Showcase v2.0 generado rigurosamente con ${widgets.length} widgets reales en: public/master-showcase.html`);
