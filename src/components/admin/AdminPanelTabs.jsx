// Archivo: frontend/src/components/admin/AdminPanelTabs.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Search, Plus, Trash2, Mail, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const UsersInvitesTab = ({ users, invites, allRoles, currentUser, actions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');

  const filteredUsers = users.filter(u =>
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onInvite = async (e) => {
    e.preventDefault();
    const res = await actions.handleInviteUser(inviteEmail, inviteRole);
    if (res.success) {
      toast.success(res.message);
      setIsInviting(false);
      setInviteEmail('');
    } else toast.error(res.message);
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search personnel..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-nexus-purple/50 font-mono" />
        </div>
        <button onClick={() => setIsInviting(true)} className="px-4 py-2 bg-nexus-purple/20 border border-nexus-purple/50 text-nexus-purple hover:bg-nexus-purple/30 rounded-lg flex items-center gap-2 text-xs font-bold transition-all"><Plus className="w-4 h-4" /> INVITE USER</button>
      </div>

      {isInviting && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={onInvite} className="p-4 bg-nexus-purple/5 border border-nexus-purple/20 rounded-xl flex items-center gap-3">
          <Mail className="w-4 h-4 text-nexus-purple" />
          <input type="email" required placeholder="User Email" className="bg-black/40 border border-white/10 rounded px-3 py-1.5 text-sm text-white flex-1 outline-none" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
          <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="bg-black/40 border border-white/10 rounded px-3 py-1.5 text-sm text-white outline-none">
            {allRoles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <button type="submit" className="text-xs bg-nexus-purple text-white px-3 py-1.5 rounded font-bold hover:bg-nexus-purple/80">SEND</button>
          <button type="button" onClick={() => setIsInviting(false)} className="text-xs text-gray-400 hover:text-white">CANCEL</button>
        </motion.form>
      )}

      {invites.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Pending Invites</h3>
          {invites.map(inv => (
            <div key={inv.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 border-l-2 border-l-orange-500 rounded-lg opacity-75">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-gray-300 font-mono">{inv.email}</span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 uppercase">{inv.role}</span>
              </div>
              <button onClick={() => actions.handleDeleteInvite(inv.id)} className="text-gray-500 hover:text-red-400"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Active Users</h3>
        {filteredUsers.map(user => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:border-nexus-cyan/30 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border border-white/10">
                {user.photoURL ? <img src={user.photoURL} alt="" /> : <User className="w-5 h-5 text-gray-400" />}
              </div>
              <div>
                <div className="font-bold text-white text-sm">{user.displayName || 'Unknown'}</div>
                <div className="text-gray-500 text-xs font-mono">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={user.role} onChange={(e) => actions.handleRoleChange(user.id, e.target.value)}
                disabled={user.id === currentUser.uid}
                className="bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs font-bold uppercase cursor-pointer focus:outline-none"
                style={{ color: allRoles.find(r => r.id === user.role)?.color || '#fff' }}
              >
                {allRoles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <button onClick={() => actions.handleDeleteUser(user.id)} disabled={user.id === currentUser.uid} className="p-2 text-gray-600 hover:text-red-500 rounded-lg disabled:opacity-20"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RoleDefinitionsTab = ({ allRoles, actions }) => {
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#00F3FF');

  const onCreate = async (e) => {
    e.preventDefault();
    if (await actions.handleCreateRole(newRoleName, newRoleColor)) {
      setIsCreatingRole(false);
      setNewRoleName('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-white">Defined Roles</h3>
        <button onClick={() => setIsCreatingRole(true)} className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded text-xs font-bold flex items-center gap-2"><Plus className="w-3 h-3" /> ADD ROLE</button>
      </div>

      {isCreatingRole && (
        <form onSubmit={onCreate} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4">
          <input type="color" value={newRoleColor} onChange={e => setNewRoleColor(e.target.value)} className="w-8 h-8 rounded bg-transparent cursor-pointer border-none" />
          <input type="text" required placeholder="Role Name" className="bg-black/40 border border-white/10 rounded px-3 py-1.5 text-sm text-white flex-1 outline-none" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} />
          <button type="submit" className="text-xs bg-nexus-cyan text-black px-4 py-1.5 rounded font-bold hover:bg-cyan-400">CREATE</button>
          <button type="button" onClick={() => setIsCreatingRole(false)} className="text-xs text-gray-500 hover:text-white">CANCEL</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allRoles.map(role => (
          <div key={role.id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:border-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full shadow-[0_0_10px]" style={{ backgroundColor: role.color, boxShadow: `0 0 10px ${role.color}` }}></div>
              <div>
                <div className="font-bold text-white text-sm">{role.name}</div>
                <div className="text-[10px] text-gray-500 font-mono uppercase">ID: {role.id}</div>
              </div>
            </div>
            {['admin', 'viewer'].includes(role.id) ? (
              <div className="px-2 py-0.5 text-[10px] bg-white/10 rounded text-gray-400">SYSTEM</div>
            ) : (
              <button onClick={() => actions.handleDeleteRole(role.id)} className="text-gray-600 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
