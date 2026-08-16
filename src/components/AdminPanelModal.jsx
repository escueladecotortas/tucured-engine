// Archivo: frontend/src/components/AdminPanelModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminData } from '../hooks/useAdminData';
import { useAdminActions } from '../hooks/useAdminActions';
import { UsersInvitesTab, RoleDefinitionsTab } from './admin/AdminPanelTabs';

export default function AdminPanelModal({ onClose }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const { users, roles, invites, loading } = useAdminData();
  const actions = useAdminActions(users, currentUser);

  const allRoles = [
    { id: 'admin', name: 'Admin', color: '#bd00ff' },
    { id: 'viewer', name: 'Viewer', color: '#9ca3af' },
    ...roles.filter(r => !['admin', 'viewer'].includes(r.id))
  ];

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-5xl bg-[#080c14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-nexus-purple/20 rounded-xl border border-nexus-purple/50"><Settings className="w-6 h-6 text-nexus-purple" /></div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">SYSTEM ACCESS CONTROL</h2>
                <p className="text-xs text-gray-400 font-mono">AUTHORIZED PERSONNEL ONLY</p>
              </div>
            </div>
            <button onClick={onClose}><X className="w-6 h-6 text-gray-400 hover:text-white" /></button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10">
            {['users', 'roles'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-colors relative ${activeTab === tab ? 'text-white bg-white/5' : 'text-gray-500 hover:bg-white/5'}`}>
                {tab === 'users' ? 'Users & Invites' : 'Role Definitions'}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-nexus-purple"></div>}
              </button>
            ))}
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#080c14]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-500 font-mono text-sm animate-pulse">SYNCHRONIZING SECURE DATABASE...</div>
            ) : activeTab === 'users' ? (
              <UsersInvitesTab users={users} invites={invites} allRoles={allRoles} currentUser={currentUser} actions={actions} />
            ) : (
              <RoleDefinitionsTab allRoles={allRoles} actions={actions} />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
