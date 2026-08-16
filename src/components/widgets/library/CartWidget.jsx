import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PRODUCTS = [
    { id: 1, name: 'Pizza Napolitana', price: 12000, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80' },
    { id: 2, name: 'Empanada Carne', price: 1500, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&q=80' },
    { id: 3, name: 'Cerveza Artesanal', price: 4500, image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=80' },
];

export default function CartWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [cart, setCart] = useState([]);

    // Add to Cart
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsOpen(true);
    };

    // Remove / Decrease
    const removeFromCart = (productId) => {
        setCart(prev => prev.reduce((acc, item) => {
            if (item.id === productId) {
                if (item.quantity > 1) return [...acc, { ...item, quantity: item.quantity - 1 }];
                return acc;
            }
            return [...acc, item];
        }, []));
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="relative font-sans text-slate-800">
            {/* FLOATING TRIGGER */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center group"
            >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                )}
            </motion.button>

            {/* PRODUCT SHOWCASE (FOR DEMO) */}
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                    Menú Demo
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {MOCK_PRODUCTS.map(product => (
                        <div key={product.id} className="group relative rounded-lg overflow-hidden border border-slate-100 hover:shadow-md transition-all">
                            <div className="aspect-video overflow-hidden">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-3">
                                <h4 className="font-bold text-sm">{product.name}</h4>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-orange-600 font-bold">${product.price.toLocaleString()}</span>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DRAWER */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                        >
                            {/* HEADER */}
                            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-orange-600" />
                                    Tu Pedido
                                </h2>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {/* ITEMS */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                                        <ShoppingCart className="w-16 h-16 opacity-20" />
                                        <p>El carrito está vacío</p>
                                        <button onClick={() => setIsOpen(false)} className="text-orange-600 font-bold hover:underline">Ir a comprar</button>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <motion.div layout key={item.id} className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                                                <div className="text-orange-600 font-bold text-sm">${(item.price * item.quantity).toLocaleString()}</div>

                                                <div className="flex items-center gap-3 mt-2">
                                                    <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded-md hover:border-orange-200">
                                                        <Minus className="w-3 h-3 text-slate-600" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded-md hover:border-orange-200">
                                                        <Plus className="w-3 h-3 text-slate-600" />
                                                    </button>
                                                </div>
                                            </div>
                                            <button onClick={() => setCart(c => c.filter(x => x.id !== item.id))} className="text-slate-300 hover:text-red-500 self-start">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* FOOTER */}
                            {cart.length > 0 && (
                                <div className="p-6 bg-slate-50 border-t border-slate-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-slate-500">Total a pagar</span>
                                        <span className="text-2xl font-black text-slate-900">${total.toLocaleString()}</span>
                                    </div>
                                    <button className="w-full py-4 bg-slate-900 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-orange-500/30">
                                        <CreditCard className="w-5 h-5" />
                                        Iniciar Pago
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// CONFIG_SCHEMA:
// {
//   "currency": "string ('ARS', 'USD')",
//   "mockProducts": "array<object>",
//   "minOrder": "number"
// }
