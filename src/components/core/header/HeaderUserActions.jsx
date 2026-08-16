// Archivo: frontend/src/components/core/header/HeaderUserActions.jsx
import React from 'react';
import { Terminal, Rocket, LayoutGrid, Zap, Globe, LogOut } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

export default function HeaderUserActions({ project, user, userRole, onLogout, onToggleLanguage }) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {project?.id === 'tucu-red' && (
        <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
          <ActionButton icon={<Terminal className="w-4 h-4" />} color="text-indigo-400" onClick={() => window.location.href = '#/project/tucu-red?mode=console'} title="System Console" />
          <ActionButton icon={<Rocket className="w-4 h-4" />} color="text-orange-400" onClick={() => window.open('#/tucu-red-public', '_blank')} title="Public Website" />
          <ActionButton icon={<LayoutGrid className="w-4 h-4" />} color="text-pink-400" onClick={() => window.open('#/visual-editor?projectId=tucu-red&url=%23%2Ftucu-red-public', '_blank')} title="Visual Editor" />
        </div>
      )}

      <div className="flex items-center gap-1 mr-2">
        <button
          onClick={() => window.location.hash = `#/project/${project?.id || 'tucu-red'}?tab=agents&t=${Date.now()}`}
          className="flex items-center gap-2 px-3 py-1.5 text-purple-400 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all border border-purple-500/20 hover:border-purple-400/50"
        >
          <Zap className="w-4 h-4" />
          <span className="text-xs font-bold hidden sm:inline">Neural Team</span>
        </button>

        {onToggleLanguage && (
          <button onClick={onToggleLanguage} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all" title="Change Language">
            <Globe className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 px-2 border-l border-white/10 pl-4">
        {onLogout && (
          <button onClick={onLogout} className="group p-2 hover:bg-rose-500/10 rounded-full transition-all mr-2" title={t('header.logout')}>
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-rose-500" />
          </button>
        )}

        <img
          src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=6366f1&color=fff`}
          alt="User" className="w-8 h-8 rounded-full ring-2 ring-white/10 object-cover bg-indigo-900"
          referrerPolicy="no-referrer"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=6366f1&color=fff`; }}
        />

        <div className="hidden md:block text-right">
          <div className="text-xs font-bold">{user?.displayName || 'Usuario'}</div>
          <div className="text-[9px] text-indigo-400 font-mono uppercase">{t('header.role')}: {userRole || 'USER'}</div>
        </div>
      </div>
    </div>
  );
}

const ActionButton = ({ icon, color, onClick, title }) => (
  <button onClick={onClick} className={`p-2 ${color} hover:text-white hover:bg-white/10 rounded-lg transition-all`} title={title}>
    {icon}
  </button>
);
