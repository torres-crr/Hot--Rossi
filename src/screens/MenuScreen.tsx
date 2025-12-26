
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../App';

const MenuScreen: React.FC = () => {
    const { config, products, addToCart, cart } = useStore();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>("Pizzas");

    const filteredProducts = products.filter(p => p.category === selectedCategory);

    // Logic to show all if "Todos" or distinct categories. 
    // Assuming categories are in config.categories

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            {/* Hero */}
            <div
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${config.heroImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-end justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-display font-black text-white leading-tight">{config.name}</h1>
                            <div className="flex items-center gap-3 mt-1">
                                <p className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-sm border ${config.isOpen
                                        ? 'text-lime-400 bg-lime-400/10 border-lime-400/20'
                                        : 'text-red-500 bg-red-500/10 border-red-500/20'
                                    }`}>
                                    <span className="material-symbols-outlined text-[10px]">schedule</span>
                                    {config.isOpen ? 'Aberto' : 'Fechado'}
                                </p>
                            </div>
                        </div>
                        <img src={config.logo} className="w-16 h-16 rounded-full border-2 border-white/20 shadow-lg" alt="Logo" />
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="sticky top-0 bg-slate-950/95 backdrop-blur-md z-40 border-b border-white/5 py-4 pl-4 overflow-x-auto no-scrollbar pb-2">
                <div className="flex gap-2 pr-4">
                    {config.categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${selectedCategory === cat
                                    ? 'bg-lime-400 text-slate-950'
                                    : 'bg-white/5 text-slate-400 border border-white/5'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Grid */}
            <div className="p-4 grid grid-cols-1 gap-4">
                {filteredProducts.map(product => (
                    <div key={product.id} className="bg-slate-900 rounded-2xl p-3 border border-white/5 flex gap-3">
                        <img src={product.image} alt={product.name} className="w-24 h-24 rounded-xl object-cover" />
                        <div className="flex-1 flex flex-col">
                            <h3 className="text-white font-bold">{product.name}</h3>
                            <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mt-1 flex-1">{product.description}</p>
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-lime-400 font-bold">R$ {product.price.toFixed(2)}</span>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="bg-white/10 hover:bg-lime-400 hover:text-slate-950 text-white p-2 rounded-xl transition-all active:scale-90"
                                >
                                    <span className="material-symbols-outlined">add_shopping_cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
                <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-50">
                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full bg-lime-400 text-slate-950 p-4 rounded-2xl font-black shadow-xl shadow-lime-400/20 flex items-center justify-between animate-slide-up"
                    >
                        <span className="flex items-center gap-2">
                            <span className="bg-slate-950 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                {cart.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>
                            <span>Ver Sacola</span>
                        </span>
                        <span>R$ {cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
                    </button>
                </div>
            )}

            <div className='fixed bottom-4 right-4 z-40' style={{ bottom: '5rem' }}>
                <button onClick={() => navigate('/admin')} className="bg-slate-800 p-2 rounded-full text-white/20 hover:text-white border border-white/5 shadow-lg"><span className="material-symbols-outlined">settings</span></button>
            </div>

        </div>
    );
};

export default MenuScreen;
