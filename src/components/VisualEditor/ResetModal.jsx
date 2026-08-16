// Archivo: frontend/src/components/VisualEditor/ResetModal.jsx
// Modal de confirmación para resetear estilos del elemento — Ley de 200 Líneas 2026.
import React from 'react';

/**
 * Modal de confirmación de reset de estilos.
 * Recibe updateStyle y setShowResetConfirm para operar.
 */
const RESET_PROPS = [
    'width', 'height', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
    'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'borderRadius',
    'color', 'backgroundColor', 'fontSize', 'fontWeight', 'fontFamily',
    'fontStyle', 'textDecoration', 'textAlign', 'lineHeight',
    'display', 'flexDirection', 'alignItems', 'justifyContent',
    'objectFit', 'objectPosition', 'transform', 'filter'
];

const ResetModal = ({ updateStyle, setShowResetConfirm }) => (
    <div className="absolute inset-0 z-60 bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="bg-black border border-white/10 rounded-xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-amber-500">Reset Styles?</h3>
            <p className="text-sm text-zinc-400">This will revert all local changes. This action cannot be undone.</p>
            <div className="flex gap-2 pt-2">
                <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        RESET_PROPS.forEach(p => updateStyle(p, ''));
                        setShowResetConfirm(false);
                    }}
                    className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                    Confirm Reset
                </button>
            </div>
        </div>
    </div>
);

export default ResetModal;
