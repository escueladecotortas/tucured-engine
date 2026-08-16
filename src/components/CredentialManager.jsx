import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Copy, Key, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { useToast } from './Toast';

const MOCK_CREDS = [
    { id: 1, service: 'Wordpress Admin', username: 'admin_amora', pass: 'Amora2026!', url: 'wp-admin' },
    { id: 2, service: 'Instagram', username: '@amora.nails', pass: '*********', url: 'instagram.com' },
    { id: 3, service: 'Hosting Panel', username: 'cpanel_user', pass: 'HosterKeys#99', url: 'hostinger.com' },
];

export default function CredentialManager({ clientId = "amora-nails" }) {
    const { addToast } = useToast();
    const [creds, setCreds] = useState([]);
    const [visible, setVisible] = useState({});
    const [isEditing, setIsEditing] = useState(null); // ID of cred being edited
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ service: '', username: '', pass: '', url: '' });

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem(`nexus_creds_${clientId}`);
        if (saved) {
            setCreds(JSON.parse(saved));
        } else {
            setCreds(MOCK_CREDS);
            localStorage.setItem(`nexus_creds_${clientId}`, JSON.stringify(MOCK_CREDS));
        }
    }, [clientId]);

    // Save to LocalStorage
    const saveToStorage = (newCreds) => {
        setCreds(newCreds);
        localStorage.setItem(`nexus_creds_${clientId}`, JSON.stringify(newCreds));
    };

    const toggleVis = (id) => setVisible(prev => ({ ...prev, [id]: !prev[id] }));

    const copyToClip = (text) => {
        navigator.clipboard.writeText(text);
        addToast("Copied to clipboard", "success");
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this credential permanently?')) {
            const temp = creds.filter(c => c.id !== id);
            saveToStorage(temp);
            addToast("Credential deleted", "info");
        }
    };

    const handleSaveNew = () => {
        if (!formData.service || !formData.pass) return addToast("Service and Password required", "error");

        const newCred = { ...formData, id: Date.now() };
        saveToStorage([...creds, newCred]);
        setIsAdding(false);
        setFormData({ service: '', username: '', pass: '', url: '' });
        addToast("Credential saved", "success");
    };

    const handleUpdate = (id) => {
        const updated = creds.map(c => c.id === id ? { ...c, ...formData } : c);
        saveToStorage(updated);
        setIsEditing(null);
        setFormData({ service: '', username: '', pass: '', url: '' });
        addToast("Credential updated", "success");
    };

    const startEdit = (cred) => {
        setIsEditing(cred.id);
        setFormData(cred);
    }

    return (
        <div className="bg-white/5 border border-white/5 rounded-xl p-6 relative">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Key className="w-4 h-4 text-fuchsia-400" /> Client Credentials
                </h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-1 text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded hover:bg-indigo-500/30 transition-colors uppercase font-bold tracking-wider"
                >
                    <Plus className="w-3 h-3" /> Add Key
                </button>
            </div>

            <div className="space-y-3">
                {/* ADD FORM */}
                {isAdding && (
                    <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/30 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <input autoFocus placeholder="Service Name" className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white" value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })} />
                            <input placeholder="Username/Email" className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                            <input placeholder="Password" type="text" className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white" value={formData.pass} onChange={e => setFormData({ ...formData, pass: e.target.value })} />
                            <input placeholder="URL (Optional)" className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsAdding(false)} className="text-[10px] text-gray-400 hover:text-white px-2 py-1">Cancel</button>
                            <button onClick={handleSaveNew} className="text-[10px] bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-400 flex items-center gap-1"><Save className="w-3 h-3" /> Save</button>
                        </div>
                    </div>
                )}

                {/* LIST */}
                {creds.map(cred => (
                    <div key={cred.id} className="group flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5 hover:border-white/10 transition-colors">

                        {isEditing === cred.id ? (
                            <div className="w-full">
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input className="bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-white" value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })} />
                                    <input className="bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-white" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                                    <input className="bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-white" value={formData.pass} onChange={e => setFormData({ ...formData, pass: e.target.value })} />
                                    <input className="bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-white" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setIsEditing(null)} className="p-1 text-gray-400 hover:text-white"><X className="w-3 h-3" /></button>
                                    <button onClick={() => handleUpdate(cred.id)} className="p-1 text-emerald-400 hover:text-emerald-300"><CheckCircleIcon className="w-3 h-3" /></button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/5 rounded text-gray-400 group-hover:text-indigo-400 transition-colors">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{cred.service}</div>
                                        <div className="text-xs text-gray-500 font-mono">{cred.username}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="bg-black px-3 py-1 rounded text-xs font-mono text-gray-300 min-w-[100px] text-center">
                                        {visible[cred.id] ? cred.pass : '••••••••'}
                                    </div>
                                    <div className="flex items-center gap-1 border-l border-white/10 pl-2 ml-2">
                                        <button onClick={() => toggleVis(cred.id)} className="p-1.5 hover:bg-white/10 rounded text-gray-400" title="Reveal">
                                            {visible[cred.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                        </button>
                                        <button onClick={() => copyToClip(cred.pass)} className="p-1.5 hover:bg-white/10 rounded text-indigo-400" title="Copy">
                                            <Copy className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => startEdit(cred)} className="p-1.5 hover:bg-white/10 rounded text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Edit">
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => handleDelete(cred.id)} className="p-1.5 hover:bg-rose-500/20 rounded text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {creds.length === 0 && !isAdding && (
                    <div className="text-center py-4 text-xs text-gray-600 italic">No credentials stored.</div>
                )}
            </div>

        </div>
    );
}

// Helper for the icon in update mode
const CheckCircleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
