// Archivo: frontend/src/hooks/useSopLibrary.js
import { useState, useEffect } from 'react';

export function useSopLibrary() {
    const [activeCategory, setActiveCategory] = useState('workflows');
    const [allFiles, setAllFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [reading, setReading] = useState(false);

    const libraries = [
        { id: 'workflows', label: 'Protocolos', path: '.agent/workflows', icon: 'Terminal', color: 'text-indigo-400' },
        { id: 'docs', label: 'Documentación', path: 'documents', icon: 'FileText', color: 'text-emerald-400' },
        { id: 'manuals', label: 'Manuales', path: 'system_core/manuals', icon: 'Shield', color: 'text-rose-400' }
    ];

    useEffect(() => {
        const fetchAllLibraries = async () => {
            if (allFiles.length === 0) setLoading(true);
            const masterList = [];

            for (const lib of libraries) {
                try {
                    const res = await fetch(`/api/files?project=root&dir=${encodeURIComponent(lib.path)}&_t=${Date.now()}`);
                    if (res.ok) {
                        const data = await res.json();
                        const mdFiles = data
                            .filter(f => f.name.endsWith('.md') && f.type === 'file')
                            .map(f => ({
                                ...f,
                                categoryId: lib.id,
                                categoryLabel: lib.label,
                                categoryPath: lib.path,
                                categoryColor: lib.color
                            }));
                        masterList.push(...mdFiles);
                    }
                } catch (e) {
                    console.error(`Error loading lib ${lib.id}:`, e);
                }
            }
            setAllFiles(masterList);
            setLoading(false);
        };

        fetchAllLibraries();
        const interval = setInterval(fetchAllLibraries, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const readBook = async () => {
            if (!selectedFile) return;
            setReading(true);
            try {
                const fullPath = `${selectedFile.categoryPath}/${selectedFile.name}`;
                const res = await fetch(`/api/files/read?project=root&path=${encodeURIComponent(fullPath)}`);
                if (res.ok) {
                    const data = await res.json();
                    setFileContent(data.content);
                }
            } catch (e) {
                setFileContent("# Error reading file\nCould not load content.");
            }
            setReading(false);
        };

        readBook();
    }, [selectedFile]);

    const filteredFiles = allFiles.filter(f => {
        if (searchTerm.trim() !== '') {
            return f.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return f.categoryId === activeCategory;
    });

    return {
        activeCategory,
        setActiveCategory,
        searchTerm,
        setSearchTerm,
        selectedFile,
        setSelectedFile,
        fileContent,
        loading,
        reading,
        filteredFiles,
        libraries
    };
}
