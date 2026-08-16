// Archivo: frontend/src/components/tabs/blueprint/BlueprintHeader.jsx
import React from 'react';
import { LayoutTemplate, Save } from 'lucide-react';

export function BlueprintHeader({ projectId, onSave, saving }) {
    return (
        <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <LayoutTemplate className="w-5 h-5 text-indigo-400" />
                    Digital Blueprint
                </h2>
                <p className="text-xs text-gray-500 mt-1">Strategic Architecture for {projectId}</p>
            </div>
            <button
                onClick={onSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
                {saving ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <Save className="w-3.5 h-3.5" />
                )}
                SAVE STRATEGY
            </button>
        </div>
    );
}
