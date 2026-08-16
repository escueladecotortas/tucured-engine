import React, { useState, useEffect } from 'react';
import { Search, Type } from 'lucide-react';

// Popular Google Fonts (hardcoded for performance, no API needed)
const POPULAR_FONTS = [
    { family: 'Inter', category: 'sans-serif' },
    { family: 'Roboto', category: 'sans-serif' },
    { family: 'Open Sans', category: 'sans-serif' },
    { family: 'Montserrat', category: 'sans-serif' },
    { family: 'Lato', category: 'sans-serif' },
    { family: 'Poppins', category: 'sans-serif' },
    { family: 'Outfit', category: 'sans-serif' },
    { family: 'Playfair Display', category: 'serif' },
    { family: 'Cormorant Garamond', category: 'serif' },
    { family: 'Merriweather', category: 'serif' },
    { family: 'Lora', category: 'serif' },
    { family: 'Libre Baskerville', category: 'serif' },
    { family: 'Dancing Script', category: 'handwriting' },
    { family: 'Pacifico', category: 'handwriting' },
    { family: 'Caveat', category: 'handwriting' },
    { family: 'Great Vibes', category: 'handwriting' },
    { family: 'Fira Code', category: 'monospace' },
    { family: 'JetBrains Mono', category: 'monospace' },
    { family: 'Source Code Pro', category: 'monospace' },
];

const FontPicker = ({ currentFont, onFontChange, onInjectFont }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [loadedFonts, setLoadedFonts] = useState(new Set());

    // Filter fonts by search
    const filteredFonts = POPULAR_FONTS.filter(font =>
        font.family.toLowerCase().includes(search.toLowerCase())
    );

    // Load font preview in sidebar
    const loadFont = (fontFamily) => {
        if (loadedFonts.has(fontFamily)) return;

        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        setLoadedFonts(prev => new Set([...prev, fontFamily]));
    };

    const selectFont = (fontFamily) => {
        // Load in sidebar if not loaded
        loadFont(fontFamily);

        // Inject into iframe
        if (onInjectFont) {
            onInjectFont(fontFamily);
        }

        // Apply style change
        onFontChange(fontFamily);
        setIsOpen(false);
    };

    // Preload first few fonts for previews
    useEffect(() => {
        POPULAR_FONTS.slice(0, 5).forEach(font => loadFont(font.family));
    }, []);

    const displayFont = currentFont ? currentFont.replace(/["']/g, '').split(',')[0].trim() : 'Select Font';

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-2 bg-black/30 rounded-lg border border-white/10 px-3 py-2 text-left hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Type size={14} className="text-indigo-400" />
                    <span
                        className="text-sm text-zinc-300 truncate max-w-[120px]"
                        style={{ fontFamily: currentFont }}
                    >
                        {displayFont}
                    </span>
                </div>
                <svg
                    className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-zinc-800 border border-white/10 rounded-lg shadow-xl max-h-64 overflow-hidden">
                    {/* Search */}
                    <div className="p-2 border-b border-white/10">
                        <div className="relative">
                            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search fonts..."
                                className="w-full bg-black/30 border border-white/10 rounded pl-7 pr-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Font List */}
                    <div className="overflow-y-auto max-h-48">
                        {filteredFonts.map(font => {
                            loadFont(font.family); // Lazy load for preview
                            return (
                                <button
                                    key={font.family}
                                    onClick={() => selectFont(font.family)}
                                    className="w-full px-3 py-2 text-left hover:bg-white/10 transition-colors flex items-center justify-between"
                                >
                                    <span
                                        className="text-sm text-zinc-300"
                                        style={{ fontFamily: font.family }}
                                    >
                                        {font.family}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 uppercase">
                                        {font.category}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FontPicker;
