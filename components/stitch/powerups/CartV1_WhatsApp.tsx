"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { CartV1_Drawer } from "./CartV1_WhatsApp_Drawer";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}
interface CartV1Props {
  data?: any;
  whatsappNumber?: string;
  currency?: string;
  primaryColor?: string;
}

export const CartV1_WhatsApp = ({
  data = {},
  whatsappNumber = "549381000000",
  currency = "$",
  primaryColor = "#4F46E5",
}: CartV1Props) => {
  const [cart, setCart] = useState<CartItem[]>(data.products || []);
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("stitch_cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) setCart(parsed);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("stitch_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const handleAdd = (e: CustomEvent<CartItem>) => {
      const newItem = e.detail;
      setCart((prev) => {
        const existing = prev.find((p) => p.id === newItem.id);
        return existing
          ? prev.map((p) =>
              p.id === newItem.id ? { ...p, qty: p.qty + 1 } : p,
            )
          : [...prev, { ...newItem, qty: 1 }];
      });
    };
    window.addEventListener("stitch-add-to-cart" as any, handleAdd);
    return () =>
      window.removeEventListener("stitch-add-to-cart" as any, handleAdd);
  }, []);

  const checkout = () => {
    if (cart.length === 0) return;
    let msg =
      `Hola! Soy *${clientName || "Cliente"}*. Pedido:\n\n` +
      cart
        .map(
          (p) =>
            `▪️ ${p.qty}x ${p.name} ($${(p.price * p.qty).toLocaleString()})`,
        )
        .join("\n");
    msg += `\n\n💰 *TOTAL: ${currency}${cart.reduce((s, p) => s + p.price * p.qty, 0).toLocaleString()}*`;
    if (clientAddress) msg += `\n📍 Envío: ${clientAddress}`;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const totalQty = cart.reduce((sum, p) => sum + p.qty, 0);

  return (
    <>
      <AnimatePresence>
        {totalQty > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-10 right-10 z-10001"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="relative bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl border border-white/20 group hover:scale-110 transition-all"
            >
              <ShoppingCart size={32} />
              <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-black w-8 h-8 rounded-2xl flex items-center justify-center border-4 border-slate-900">
                {totalQty}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-10002 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <CartV1_Drawer
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              cart={cart}
              removeFromCart={(id) =>
                setCart((prev) => prev.filter((p) => p.id !== id))
              }
              updateQty={(id, delta) =>
                setCart((prev) =>
                  prev.map((p) =>
                    p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p,
                  ),
                )
              }
              totalPrice={cart.reduce((s, p) => s + p.price * p.qty, 0)}
              clientName={clientName}
              setClientName={setClientName}
              clientAddress={clientAddress}
              setClientAddress={setClientAddress}
              checkout={checkout}
              currency={currency}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
