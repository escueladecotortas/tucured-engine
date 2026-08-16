"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, ShoppingCart, Trash, Send } from "lucide-react";
import { CartItem } from "./CartV1_WhatsApp";

interface CartModalProps {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  totalPrice: number;
  clientName: string;
  setClientName: (n: string) => void;
  clientAddress: string;
  setClientAddress: (a: string) => void;
  checkout: () => void;
  currency: string;
}

export const CartV1_Drawer = ({
  isOpen,
  setIsOpen,
  cart,
  removeFromCart,
  updateQty,
  totalPrice,
  clientName,
  setClientName,
  clientAddress,
  setClientAddress,
  checkout,
  currency,
}: CartModalProps) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
      className="relative w-full max-w-md bg-slate-900 border-l border-white/5 shadow-2xl h-full flex flex-col z-10003 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="p-10 border-b border-white/5 flex justify-between items-center bg-slate-900/40 relative z-10">
        <div>
          <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase mb-1 block">
            Checkout System
          </span>
          <h3 className="text-2xl font-black text-white tracking-tighter italic">
            Tu Pedido
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="bg-white/5 p-3 rounded-2xl hover:bg-red-500/20 text-slate-400 hover:text-red-500 border border-white/5"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative z-10">
        {cart.length === 0 ? (
          <div className="text-center py-20 opacity-30 space-y-4">
            <ShoppingCart size={64} className="mx-auto text-slate-500" />
            <p className="font-black uppercase tracking-[0.2em] text-[10px]">
              El vacío de la soberanía
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="group flex gap-5 bg-slate-950/50 p-4 rounded-4xl border border-white/5 hover:border-indigo-500/30"
            >
              <div
                className="h-20 w-20 bg-slate-900 rounded-2xl shrink-0 bg-center bg-cover border border-white/5"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-white truncate pr-2 tracking-tight italic uppercase">
                    {item.name}
                  </h4>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-600 hover:text-red-500"
                  >
                    <Trash size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xs font-black text-indigo-400">
                    {currency}
                    {item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-4 bg-white/5 rounded-xl px-3 py-1.5 border border-white/5">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="text-slate-500 hover:text-white font-black text-sm"
                    >
                      -
                    </button>
                    <span className="text-xs font-black text-white w-4 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="text-slate-500 hover:text-white font-black text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-10 bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 space-y-8 relative z-10">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
              Inversión Total
            </p>
            <div className="text-4xl font-black text-white tracking-tighter italic">
              {currency}
              {totalPrice.toLocaleString()}
            </div>
          </div>
          <div className="bg-indigo-600/10 border border-indigo-500/20 px-3 py-1 rounded-lg text-indigo-400 text-[9px] font-black uppercase tracking-widest">
            Estimate
          </div>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nombre del Soberano"
            className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm italic focus:border-indigo-500 outline-none text-white"
          />
          <input
            type="text"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            placeholder="Coordenadas de Entrega"
            className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm italic focus:border-indigo-500 outline-none text-white"
          />
        </div>
        <button
          onClick={checkout}
          disabled={cart.length === 0}
          className="w-full bg-[#25D366] hover:bg-[#22c35e] text-white font-black py-5 rounded-4xl flex items-center justify-center gap-3 disabled:opacity-20 uppercase tracking-[0.2em] text-[12px]"
        >
          Enviar a WhatsApp <Send size={20} />
        </button>
      </div>
    </motion.div>
  );
};
