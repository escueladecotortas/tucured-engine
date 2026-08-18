// Archivo: src/components/tabs/neural-factory/useNeuralActions.js
// Gate 1: Ingesta Aislada con KPIs | Gate 2+3: Forja Manual (Ley de 200 líneas)

export function useNeuralActions({ setProspects, addToast, setIsExtracting, setExtractionStatus, setGenerationLogs, setActiveAgents, currentGeneration }) {

  // ── GATE 1: INGESTA AISLADA (C.Y.B.O.R.G.) ──────────────────────────────
  const handleManualAdd = async (formData, setFormData) => {
    if (!formData?.name?.trim()) return addToast('El nombre del negocio es obligatorio', 'warning');

    const hasMaps = !!formData.mapsUrl || (!formData.whatsapp && formData.address);
    const startTotal = Date.now();

    const newProspect = {
      id: `manual-${Date.now()}`,
      name: formData.name.trim(),
      status: 'enriching_cyborg',
      leadScore: hasMaps ? 10 : 8,
      platform: 'cyborg_injection',
      phone: formData.whatsapp || formData.phone || '',
      whatsapp: formData.whatsapp || formData.phone || '',
      instagram: (formData.instagram || '').replace('@', '').trim(),
      goal: formData.goal || 'leads',
      audience: formData.audience || 'local',
      vibe: formData.vibe || '2',
      usp: formData.usp || '',
      category: formData.category || 'general',
      rubro: formData.category || 'general',
      subcategory: formData.subcategory || '',
      mapsUrl: (formData.mapsUrl || '').trim(),
      address: formData.address || '',
      city: formData.city || 'San Miguel de Tucumán',
      createdAt: new Date().toISOString()
    };

    setProspects(prev => [newProspect, ...prev]);
    addToast(hasMaps ? '⚡ Iniciando Extracción Total (Maps + IG)...' : '⚡ Iniciando Extracción Híbrida (IG)...', 'success');

    try {
      const saveRes = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospects: [newProspect] })
      });
      const saveData = await saveRes.json();
      if (!saveData.success) throw new Error(saveData.error || 'Error al guardar lead');

      setIsExtracting(true);
      setExtractionStatus(hasMaps ? '📡 Extrayendo entidad en Maps e IG...' : '📸 Analizando huella digital en IG...');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const enrichRes = await fetch('/api/leads/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: newProspect.id }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const enrichData = await enrichRes.json();

      if (enrichData.success && enrichData.lead) {
        const tiempoTotal = Math.round((Date.now() - startTotal) / 1000);
        const kpis = enrichData.kpis || {};

        // Ficha KPI: tiempo, reviews, fotos
        const finalLead = {
          ...newProspect,
          ...enrichData.lead,
          status: 'stitch_ready',   // ← GATE 1 termina aquí: NO auto-forja
          kpis: {
            tiempoTotal,
            tiempoMaps:       kpis.tiempoMaps || null,
            tiempoInstagram:  kpis.tiempoInstagram || null,
            tiempoCuraduria:  kpis.tiempoCuraduria || null,
            reviewsValidas:   (enrichData.lead.topReviews || []).length,
            fotosIndexadas:   (enrichData.lead.photos || []).length,
            featuresDetectados: (enrichData.lead.features || []).length,
          }
        };

        setExtractionStatus(`✅ Extracción completada en ${tiempoTotal}s. Listo para forjar.`);
        addToast(`✅ C.Y.B.O.R.G. procesó "${formData.name}" en ${tiempoTotal}s`, 'success');
        setProspects(prev => prev.map(p => p.id === newProspect.id ? finalLead : p));
        // ⛔ Auto-forja ELIMINADA — el PO debe presionar [Forjar] en Gate 2

      } else {
        setExtractionStatus('❌ Falló la extracción.');
        addToast(`❌ Error en C.Y.B.O.R.G.: ${enrichData.error || 'Fallo desconocido'}`, 'error');
        setProspects(prev => prev.map(p => p.id === newProspect.id ? { ...p, status: 'error' } : p));
      }

      setTimeout(() => setIsExtracting(false), 2000);

    } catch (err) {
      if (err.name === 'AbortError') {
        addToast('❌ Tiempo excedido: La extracción tardó demasiado.', 'error');
      } else {
        addToast(`❌ Error: ${err.message || 'Fallo de conexión'}`, 'error');
      }
      setIsExtracting(false);
    }

    if (typeof setFormData === 'function') {
      setFormData({
        name: '', instagram: '', category: '', subcategory: '',
        address: '', city: 'San Miguel de Tucumán', whatsapp: '',
        mapsUrl: '', goal: 'auto', audience: 'auto', fastTrack: false
      });
    }
  };

  // ── GATE 2+3: FORJA MANUAL (requiere selección explícita de motor) ────────
  const executeGeneration = async (engine) => {
    if (!currentGeneration) return;
    setGenerationLogs([
      { message: `🚀 Iniciando secuencia de forja [${engine}]...`, timestamp: new Date() },
      { message: `⚡ Orquestando agentes neurales para "${currentGeneration.name}"...`, timestamp: new Date() }
    ]);

    const agents = engine === 'stitch-mcp' ? [
      { name: 'Orion', task: '🔱 Validación' }, { name: 'Atenea', task: '🎨 Diseño' },
      { name: 'Lorem', task: '✍️ Copy' }, { name: 'Codi', task: '⚡ Prompt' }
    ] : [
      { name: 'Codi', task: 'Código' }, { name: 'Lorem', task: 'Copy' }, { name: 'Atenea', task: '🎨 Diseño' }
    ];
    setActiveAgents(agents);

    const endpoint = engine === 'stitch-mcp' ? '/api/forge/stitch-mcp' : '/api/forge/native';

    try {
      setGenerationLogs(prev => [...prev, { message: '🌱 Paso 1/3: Ensamblando Semilla y ADN Visual...', timestamp: new Date() }]);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentGeneration)
      });
      const data = await res.json();

      if (data.success) {
        const siteUrl = data.localUrl || `/clients/${currentGeneration.slug || currentGeneration.id}/index.html`;
        setGenerationLogs(prev => [
          ...prev,
          { message: '🎨 Paso 2/3: Director de Arte & Tokens de Diseño aplicados', timestamp: new Date() },
          { message: '⬇️ Paso 3/3: Descarga, Inyección de Widgets & Persistencia Dual', timestamp: new Date() },
          { message: `✅ ¡Sitio generado con éxito! Preview disponible.`, timestamp: new Date() },
          { message: `🖥️ Preview local: ${siteUrl}`, timestamp: new Date() },
          // Gate 3: El deploy a Netlify es MANUAL — ver botón en GenerationResult
          { message: `⚠️ Deploy a Netlify: usa el botón [🚀 Desplegar a Netlify] cuando estés listo.`, timestamp: new Date() }
        ]);
        setProspects(prev => prev.map(p => p.id === currentGeneration.id ? { ...p, status: 'generated', siteUrl, localUrl: siteUrl } : p));
        addToast(`🚀 Sitio forjado para ${currentGeneration.name}`, 'success');
      } else {
        setGenerationLogs(prev => [...prev, { message: `❌ Error en pipeline: ${data.error || 'Fallo desconocido'}`, timestamp: new Date() }]);
        addToast(`❌ Error al forjar: ${data.error || 'Fallo'}`, 'error');
      }
    } catch (err) {
      setGenerationLogs(prev => [...prev, { message: `❌ Error de conexión: ${err.message}`, timestamp: new Date() }]);
      addToast('❌ Falló la conexión con el motor de forja', 'error');
    }
  };

  return { handleManualAdd, executeGeneration };
}
