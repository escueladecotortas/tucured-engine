import React, { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';

// Carousel Widget Panel
const CarouselWidgetPanel = ({ selectedElement, updateStyle, targetUrl, onUpdateImages }) => {
    const [isUploading, setIsUploading] = useState(false);

    // Resolve absolute URL for preview
    const resolveUrl = (src) => {
        if (!src) return '';
        if (src.startsWith('http') || src.startsWith('data:')) return src;
        if (!targetUrl) return src;
        const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
        return baseUrl + src;
    };

    // Get project path for upload
    const getProjectPath = () => {
        if (!targetUrl) return '';
        // Extract project path from URL: 
        // /nexus_archives/tucu-red/clients/amora-nails/index.html -> tucu-red/clients/amora-nails
        // Must capture everything between nexus_archives/ and the .html file
        const match = targetUrl.match(/nexus_archives\/(.+)\/[^/]+\.html/);
        if (match) return match[1];

        // Fallback: capture up to last slash before filename
        const fallbackMatch = targetUrl.match(/nexus_archives\/(.+)\/[^/]+$/);
        return fallbackMatch ? fallbackMatch[1] : '';
    };

    const handleReplace = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);

        try {
            // Upload to server first
            const formData = new FormData();
            // IMPORTANT: Text fields must come BEFORE file for Multer to read them in destination
            formData.append('projectPath', getProjectPath());
            formData.append('subfolder', 'assets');
            formData.append('file', file);

            const response = await fetch('/api/nexus/upload_asset', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            const result = await response.json();
            const relativePath = result.relativePath || `assets/${file.name}`;

            // Build absolute URL for the backend server (where images are served)
            const projectPath = getProjectPath();
            const absoluteUrl = `/nexus_archives/${projectPath}/${relativePath}`;

            console.log('📤 Image uploaded:', {
                relativePath,
                absoluteUrl,
                projectPath,
                targetUrl,
                filename: result.filename,
                fullPath: result.fullPath
            });

            // Update with absolute URL for preview, relative for HTML save
            const newImages = [...(selectedElement.widgetMeta?.images || [])];
            newImages[index] = {
                ...newImages[index],
                src: relativePath,        // Relative for HTML file
                previewSrc: absoluteUrl   // Absolute for preview
            };
            onUpdateImages(newImages, selectedElement.nexusId);
        } catch (err) {
            console.error('Upload error:', err);
            alert('❌ Error subiendo imagen');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = (index) => {
        const newImages = [...(selectedElement.widgetMeta?.images || [])];
        newImages.splice(index, 1);
        onUpdateImages(newImages, selectedElement.nexusId);
    };

    const handleAdd = () => {
        const newImages = [...(selectedElement.widgetMeta?.images || [])];
        // Add a placeholder
        newImages.push({
            src: 'https://images.unsplash.com/photo-1542377281-a95cda774d09?q=80&w=400&auto=format&fit=crop',
            nexusId: ''
        });
        onUpdateImages(newImages, selectedElement.nexusId);
    };

    return (
        <div className="space-y-4">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg flex items-center gap-3">
                {/* BOTÓN CORREGIDO: Ahora es un elemento button nativo con acción onClick asignada */}
                <button 
                    onClick={handleAdd}
                    className="p-2 bg-indigo-500 rounded-lg text-white flex items-center gap-1 hover:bg-indigo-600 transition-colors text-xs font-medium cursor-pointer"
                    disabled={isUploading}
                >
                    <Plus size={12} /> Add
                </button>
                
                <div className="grid grid-cols-3 gap-2">
                    {selectedElement.widgetMeta?.images?.map((img, i) => (
                        <div key={i} className="aspect-square rounded-md overflow-hidden border border-white/10 relative group hover:ring-2 ring-indigo-500">
                            <img src={img.previewSrc || resolveUrl(img.src)} alt="" className="w-full h-full object-cover" />

                            {/* Remove Button */}
                            <button
                                onClick={() => handleRemove(i)}
                                className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                title="Remove Slide"
                            >
                                <Trash2 size={8} />
                            </button>

                            {/* Replace Overlay */}
                            <label className="absolute inset-0 bg-black/60 hidden group-hover:flex flex-col items-center justify-center gap-1 cursor-pointer z-10">
                                <span className="text-[9px] text-white font-bold">Slide {i + 1}</span>
                                <span className="text-[8px] text-indigo-300 flex items-center gap-1"><Upload size={8} /> Replace</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleReplace(e, i)} />
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CarouselWidgetPanel;