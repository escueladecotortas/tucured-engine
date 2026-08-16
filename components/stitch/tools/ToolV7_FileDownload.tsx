'use client';

import React from 'react';
import { Folder } from 'lucide-react';

export const ToolV7_FileDownload = () => (
    <a href="#" className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors">
        <div className="bg-blue-200 p-2 rounded-lg text-blue-700"><Folder size={24}/></div>
        <div>
            <p className="font-bold text-blue-900">Brief_Comercial_2026.zip</p>
            <p className="text-xs text-blue-500">12.5 MB</p>
        </div>
    </a>
);
