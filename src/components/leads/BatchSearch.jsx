// Archivo: frontend/src/components/leads/BatchSearch.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useBatchSearch } from './useBatchSearch';
import BatchSearchInput from './BatchSearchInput';
import BatchSearchScraping from './BatchSearchScraping';
import BatchSearchResults from './BatchSearchResults';

/**
 * Orchestrator for Google Maps Batch Search
 * Complies with 200-line limit by delegating logic and UI
 */
const BatchSearch = () => {
    const {
        form,
        isScraping,
        progress,
        logs,
        results,
        handleInputChange,
        startScraping,
        downloadResults,
        clearResults,
        reScrapeLead
    } = useBatchSearch();

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20">
                        <Search className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight">BATCH SEARCH</h2>
                        <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Google Maps Intelligence</p>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!isScraping && results.length === 0 && (
                    <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <BatchSearchInput form={form} onInputChange={handleInputChange} onStart={startScraping} />
                    </motion.div>
                )}

                {isScraping && (
                    <motion.div key="scraping" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <BatchSearchScraping progress={progress} logs={logs} isScraping={isScraping} />
                    </motion.div>
                )}

                {!isScraping && results.length > 0 && (
                    <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <BatchSearchResults results={results} onDownload={downloadResults} onClear={clearResults} onReScrape={reScrapeLead} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BatchSearch;
