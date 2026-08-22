// Archivo: src/app/admin/configuracion/categorias/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/firebase/categories';
import { Layers, Plus, Trash2, Edit2, X, Scissors, User, Sparkles, Coffee } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Toast from '@/components/ui/Toast';

const ICONS = [
  { key: 'Scissors', icon: Scissors, label: 'Tijeras' },
  { key: 'User', icon: User, label: 'Usuario' },
  { key: 'Sparkles', icon: Sparkles, label: 'Chispa' },
  { key: 'Layers', icon: Layers, label: 'Capas' },
  { key: 'Coffee', icon: Coffee, label: 'Café' }
];

export default function CategoriasManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', icon: 'Layers' });
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (e) { 
      console.error('[ADMIN] Error fetching categories:', e); 
      setToast({ message: 'Error de sincronización', type: 'error' });
    } finally { 
      setLoading(false); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCategory(editing.id, formData);
        setToast({ message: 'Categoría actualizada', type: 'success' });
      } else {
        await addCategory(formData);
        setToast({ message: 'Categoría creada con éxito', type: 'success' });
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ name: '', slug: '', icon: 'Layers' });
      fetchData();
    } catch (e) { 
      setToast({ message: 'Error: ' + e.message, type: 'error' }); 
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setFormData({ 
      name: cat.name, 
      slug: cat.slug || '', 
      icon: cat.icon || 'Layers' 
    });
    setShowModal(true);
  };

  const handleDeleteRequest = (id) => {
    setConfirmDelete({ show: true, id });
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete.id) {
      try {
        await deleteCategory(confirmDelete.id);
        setToast({ message: 'Categoría eliminada', type: 'success' });
        fetchData();
      } catch (e) {
        setToast({ message: 'Error al eliminar: ' + e.message, type: 'error' });
      } finally {
        setConfirmDelete({ show: false, id: null });
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-zinc-200 pb-8">
          <div>
            <h2 className="text-3xl font-bold text-zinc-800 uppercase tracking-tighter">Categorías</h2>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Gestión del Kernel / Nexus OS</p>
          </div>
          <button 
            onClick={() => { 
              setEditing(null); 
              setFormData({ name: '', slug: '', icon: 'Layers' }); 
              setShowModal(true); 
            }} 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
          >
            <Plus size={14} /> Nueva Categoría
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-20 flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Sincronizando búnker...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center py-20 text-zinc-400 uppercase tracking-widest border border-dashed border-zinc-200 rounded-2xl font-bold text-[10px]">Sin categorías registradas</div>
          ) : categories.map(cat => {
            const IconComp = ICONS.find(i => i.key === cat.icon)?.icon || Layers;
            return (
              <div key={cat.id} className="bg-white border border-zinc-200 p-5 flex justify-between items-center rounded-2xl hover:border-primary/30 transition-colors shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <IconComp size={22} />
                  </div>
                  <div>
                    <h4 className="text-zinc-800 font-bold text-base uppercase tracking-tight">{cat.name}</h4>
                    <p className="text-zinc-400 text-[9px] uppercase tracking-widest font-bold">{cat.slug}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(cat)} 
                    className="p-2.5 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-xl border border-zinc-100 transition-all shadow-sm"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)} 
                    className="p-2.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-zinc-100 transition-all shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
            <form onSubmit={handleSubmit} className="bg-white w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-200">
              <div className="bg-zinc-50 px-8 py-6 border-b border-zinc-200 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-zinc-800 uppercase tracking-tighter">
                    {editing ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h3>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                    {editing ? 'Actualizar registro' : 'Crear nuevo activo'}
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest ml-1">Nombre de la Categoría</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.name} 
                      placeholder="Ej: BARBERÍA" 
                      className="w-full bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-zinc-800 font-bold uppercase text-sm transition-all" 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest ml-1">Título Frontend (Slug)</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.slug} 
                      placeholder="Ej: CORTE Y BARBA" 
                      className="w-full bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-zinc-800 font-bold uppercase text-sm transition-all" 
                      onChange={e => setFormData({...formData, slug: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest ml-1">Icono Representativo</label>
                    <div className="grid grid-cols-5 gap-2">
                      {ICONS.map(item => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setFormData({...formData, icon: item.key})}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
                            formData.icon === item.key 
                              ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                              : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:text-zinc-600'
                          }`}
                        >
                          <item.icon size={18} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="flex-1 py-4 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all uppercase font-bold tracking-widest text-zinc-400 text-[10px]"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all uppercase font-bold tracking-widest shadow-lg shadow-primary/20 text-[10px]"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
