import React from 'react';
import ActivityFeed from './ActivityFeed';

// Standalone Activity Panel for testing
export default function ActivityPanel() {
    return (
        <div className="fixed bottom-4 right-4 w-96 max-h-[600px] bg-[#0a0e1a] rounded-2xl p-6 border border-white/10 shadow-2xl z-40">
            <ActivityFeed maxItems={10} />
        </div>
    );
}
