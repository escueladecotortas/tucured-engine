// Archivo: src/app/admin/configuracion/sistema/components/TemplateField.jsx
import React, { useRef } from 'react';

/**
 * Componente que representa un campo de plantilla de WhatsApp con pastillas de comodines interactivos
 * para insertar comodines directamente en la posición actual del cursor.
 */
export default function TemplateField({ label, value, onChange, placeholder }) {
  const textareaRef = useRef(null);

  // Lista de comodines disponibles aprobados por el negocio
  const wildcards = [
    { key: '{{cliente}}', label: 'Cliente' },
    { key: '{{servicio}}', label: 'Servicio' },
    { key: '{{especialista}}', label: 'Especialista' },
    { key: '{{fecha}}', label: 'Fecha' },
    { key: '{{hora}}', label: 'Hora' }
  ];

  // Inserta quirúrgicamente el comodín en la posición actual del cursor/selección
  const handleInsertWildcard = (wildcard) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    // Construye el nuevo valor e informa al componente padre
    const newValue = before + wildcard + after;
    onChange(newValue);

    // Devuelve el foco al textarea y posiciona el cursor justo después del comodín insertado
    setTimeout(() => {
      textarea.focus();
      const caretPos = start + wildcard.length;
      textarea.setSelectionRange(caretPos, caretPos);
    }, 0);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <label className="text-xs text-gray-600 font-bold uppercase tracking-wider">{label}</label>
        <div className="flex flex-wrap gap-1">
          {wildcards.map((wc) => (
            <button
              key={wc.key}
              type="button"
              onClick={() => handleInsertWildcard(wc.key)}
              className="rounded-full bg-[#800000]/10 hover:bg-[#800000]/20 text-[#800000] text-[10px] font-bold py-1 px-2.5 transition-colors cursor-pointer active:scale-95 border border-[#800000]/20"
              title={`Insertar ${wc.label}`}
            >
              {wc.key}
            </button>
          ))}
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full border border-gray-300 focus:border-[#800000] outline-none px-3 py-2 text-sm rounded-md font-sans transition-colors focus:ring-1 focus:ring-[#800000]/20 text-[#1A1A1A] placeholder-gray-400 bg-white"
        placeholder={placeholder}
      />
    </div>
  );
}
