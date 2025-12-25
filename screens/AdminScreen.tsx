
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../App';
import { ADMIN_PASSWORD } from '../constants';
import { Product } from '../types';

const AdminScreen: React.FC = () => {
    const { config, updateConfig, products, addProduct, editProduct, removeProduct } = useStore();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [isAuthed, setIsAuthed] = useState(false);
    const [formData, setFormData] = useState(config);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        image: '',
        category: config.categories[0] || ''
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthed(true);
        } else {
            alert("Senha incorreta!");
        }
    };

    const handleSaveConfig = () => {
        updateConfig(formData);
        alert("Configurações da loja salvas!");
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        if (formData.categories.includes(newCategoryName.trim())) {
            alert("Esta categoria já existe!");
            return;
        }
        const updatedCategories = [...formData.categories, newCategoryName.trim()];
        setFormData({ ...formData, categories: updatedCategories });
        setNewCategoryName('');
    };

    const handleDeleteCategory = (catToDelete: string) => {
        if (confirm(`Excluir a categoria "${catToDelete}"? Os produtos desta categoria ficarão sem categoria vinculada.`)) {
            const updatedCategories = formData.categories.filter(c => c !== catToDelete);
            setFormData({ ...formData, categories: updatedCategories });
        }
    };

    const moveCategory = (index: number, direction: 'up' | 'down') => {
        const newCats = [...formData.categories];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newCats.length) return;
        [newCats[index], newCats[targetIndex]] = [newCats[targetIndex], newCats[index]];
        setFormData({ ...formData, categories: newCats });
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.category) {
            alert("Preencha os campos obrigatórios do produto!");
            return;
        }
        const product: Product = {
            ...newProduct as Product,
            id: Date.now().toString(),
        };
        await addProduct(product);
        setNewProduct({ name: '', description: '', price: 0, image: '', category: formData.categories[0] || '' });
        setShowProductForm(false);
        alert("Produto adicionado com sucesso!");
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct) return;
        await editProduct(editingProduct);
        setEditingProduct(null);
        alert("Produto atualizado!");
    };

    const handleDeleteProduct = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            await removeProduct(id);
        }
    };

    const moveProduct = (index: number, direction: 'up' | 'down') => {
        alert("Reorganizar produtos ainda não suportado na versão Cloud.");
    };

    if (!isAuthed) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 bg-slate-950">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-6xl text-red-600 mb-4 animate-bounce">lock</span>
                        <h2 className="text-2xl font-display font-bold text-white">Painel Administrativo</h2>
                        <p className="text-slate-500 mt-2">Área restrita ao proprietário</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Digite a senha administrativa"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-red-600 transition-all text-center outline-none"
                        />
                        <button type="submit" className="w-full bg-red-600 text-white p-4 rounded-2xl font-bold shadow-xl shadow-red-600/30 active:scale-95 transition-transform">
                            Entrar
                        </button>
                        <button type="button" onClick={() => navigate('/')} className="w-full text-slate-500 font-medium">Cancelar</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white">
            <div className="p-4 bg-slate-900 border-b border-white/5 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="material-symbols-outlined text-slate-400 hover:text-white transition-colors">arrow_back</button>
                    <h1 className="text-lg font-black">Painel de Controle</h1>
                </div>
                <button onClick={() => { handleSaveConfig(); navigate('/'); }} className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all">Sair e Salvar</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-10 no-scrollbar">
                {/* Store Info Section */}
                <section className="bg-slate-900 p-6 rounded-3xl border border-white/5 shadow-sm space-y-6">
                    <h2 className="text-yellow-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">storefront</span>
                        Informações da Loja
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-1 block">Nome da Pizzaria</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-lime-400 outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase mb-1 block">WhatsApp</label>
                                <input
                                    type="text"
                                    value={formData.whatsapp}
                                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-lime-400 outline-none"
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase mb-1 block">CPF PIX</label>
                                    <input
                                        type="text"
                                        value={formData.pixCpf}
                                        onChange={e => setFormData({ ...formData, pixCpf: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-lime-400 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase mb-1 block">Status da Loja</label>
                                    <button
                                        onClick={() => setFormData({ ...formData, isOpen: !formData.isOpen })}
                                        className={`w-full p-3 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${formData.isOpen
                                                ? 'bg-lime-400/10 text-lime-400 border-lime-400'
                                                : 'bg-red-500/10 text-red-500 border-red-500'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-base">
                                            {formData.isOpen ? 'lock_open' : 'lock'}
                                        </span>
                                        {formData.isOpen ? 'Aberto' : 'Fechado'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Category Management */}
                <section className="bg-slate-900 p-6 rounded-3xl border border-white/5 shadow-sm space-y-6">
                    <h2 className="text-yellow-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">category</span>
                        Gestão de Categorias
                    </h2>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Nova Categoria (Ex: Entradas)"
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                className="flex-1 bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-lime-400 outline-none"
                            />
                            <button
                                onClick={handleAddCategory}
                                className="bg-lime-400 text-slate-950 px-4 rounded-xl font-black text-sm active:scale-95 transition-all"
                            >
                                Add
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.categories.map((cat, index) => (
                                <div key={cat + index} className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-white/5">
                                    <div className="flex flex-col">
                                        <button disabled={index === 0} onClick={() => moveCategory(index, 'up')} className="material-symbols-outlined text-xs text-slate-600 disabled:opacity-0">keyboard_arrow_up</button>
                                        <button disabled={index === formData.categories.length - 1} onClick={() => moveCategory(index, 'down')} className="material-symbols-outlined text-xs text-slate-600 disabled:opacity-0">keyboard_arrow_down</button>
                                    </div>
                                    <span className="flex-1 text-sm font-bold">{cat}</span>
                                    <button onClick={() => handleDeleteCategory(cat)} className="text-red-500/50 hover:text-red-500 transition-colors material-symbols-outlined text-lg">delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Visual Settings */}
                <section className="bg-slate-900 p-6 rounded-3xl border border-white/5 shadow-sm space-y-6">
                    <h2 className="text-yellow-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">palette</span>
                        Identidade Visual
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Link do Logotipo (.jpg)</label>
                            <div className="flex gap-4 items-center">
                                <img src={formData.logo} className="w-16 h-16 rounded-2xl bg-slate-950 object-cover border border-white/10 shadow-sm" alt="Preview" />
                                <input
                                    type="text"
                                    value={formData.logo}
                                    onChange={e => setFormData({ ...formData, logo: e.target.value })}
                                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-lime-400 outline-none"
                                    placeholder="URL da imagem"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Banner Principal (.jpg)</label>
                            <div
                                className="w-full h-32 rounded-2xl bg-cover bg-center mb-2 shadow-inner border border-white/10"
                                style={{ backgroundImage: `url(${formData.heroImage})` }}
                            ></div>
                            <input
                                type="text"
                                value={formData.heroImage}
                                onChange={e => setFormData({ ...formData, heroImage: e.target.value })}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-lime-400 outline-none"
                                placeholder="URL do banner"
                            />
                        </div>
                    </div>
                </section>

                {/* Product Management */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-yellow-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">restaurant_menu</span>
                            Gestão de Cardápio
                        </h2>
                        <button
                            onClick={() => { setShowProductForm(!showProductForm); setEditingProduct(null); }}
                            className="bg-lime-400 text-slate-950 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-lime-400/20 active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">{showProductForm ? 'close' : 'add'}</span>
                            {showProductForm ? 'Cancelar' : 'Criar Produto'}
                        </button>
                    </div>

                    {(showProductForm || editingProduct) && (
                        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-lime-400/20 space-y-4 animate-slide-up">
                            <h3 className="font-black text-white">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nome do produto"
                                    value={editingProduct ? editingProduct.name : newProduct.name}
                                    onChange={e => editingProduct ? setEditingProduct({ ...editingProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-lime-400 outline-none"
                                />
                                <textarea
                                    placeholder="Descrição (ingredientes, etc)"
                                    value={editingProduct ? editingProduct.description : newProduct.description}
                                    onChange={e => editingProduct ? setEditingProduct({ ...editingProduct, description: e.target.value }) : setNewProduct({ ...newProduct, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-lime-400 outline-none resize-none"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        placeholder="Preço (Ex: 45.90)"
                                        value={editingProduct ? editingProduct.price : newProduct.price}
                                        onChange={e => {
                                            const val = parseFloat(e.target.value);
                                            editingProduct ? setEditingProduct({ ...editingProduct, price: val }) : setNewProduct({ ...newProduct, price: val })
                                        }}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-lime-400 outline-none"
                                    />
                                    <select
                                        value={editingProduct ? editingProduct.category : newProduct.category}
                                        onChange={e => {
                                            const val = e.target.value;
                                            editingProduct ? setEditingProduct({ ...editingProduct, category: val }) : setNewProduct({ ...newProduct, category: val })
                                        }}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-lime-400 outline-none"
                                    >
                                        <option value="" disabled>Selecione uma categoria</option>
                                        {formData.categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Link da imagem (.jpg)</label>
                                    <div className="flex gap-4 items-center">
                                        <img
                                            src={editingProduct ? editingProduct.image : newProduct.image}
                                            className="w-12 h-12 rounded-xl bg-slate-950 object-cover border border-white/10"
                                            alt="Preview"
                                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x400?text=Imagem+Invalida')}
                                        />
                                        <input
                                            type="text"
                                            placeholder="URL da imagem"
                                            value={editingProduct ? editingProduct.image : newProduct.image}
                                            onChange={e => editingProduct ? setEditingProduct({ ...editingProduct, image: e.target.value }) : setNewProduct({ ...newProduct, image: e.target.value })}
                                            className="flex-1 bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-lime-400 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                                        className="flex-1 bg-lime-400 text-slate-950 p-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all"
                                    >
                                        {editingProduct ? 'Atualizar Produto' : 'Salvar Produto'}
                                    </button>
                                    {editingProduct && (
                                        <button
                                            onClick={() => setEditingProduct(null)}
                                            className="px-4 bg-slate-800 text-white rounded-2xl font-bold"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Produtos no Cardápio</h3>
                        <div className="space-y-2">
                            {products.map((product, index) => (
                                <div key={product.id} className="bg-slate-900 p-3 rounded-2xl border border-white/5 flex items-center gap-3 group hover:border-lime-400/30 transition-all">
                                    {/* Position Controls */}
                                    <div className="flex flex-col gap-1">
                                        <button
                                            disabled={index === 0}
                                            onClick={() => moveProduct(index, 'up')}
                                            className="material-symbols-outlined text-lg text-slate-600 hover:text-lime-400 disabled:opacity-10"
                                        >
                                            keyboard_arrow_up
                                        </button>
                                        <button
                                            disabled={index === products.length - 1}
                                            onClick={() => moveProduct(index, 'down')}
                                            className="material-symbols-outlined text-lg text-slate-600 hover:text-lime-400 disabled:opacity-10"
                                        >
                                            keyboard_arrow_down
                                        </button>
                                    </div>

                                    <img src={product.image} className="w-14 h-14 rounded-xl object-cover shadow-sm border border-white/5" alt={product.name} />

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
                                        <p className="text-[10px] text-lime-400 font-bold uppercase truncate">{product.category} • R$ {product.price.toFixed(2)}</p>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => { setEditingProduct(product); setShowProductForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="text-slate-600 hover:text-yellow-400 transition-colors p-2 material-symbols-outlined text-xl"
                                        >
                                            edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="text-slate-600 hover:text-red-600 transition-colors p-2 material-symbols-outlined text-xl"
                                        >
                                            delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminScreen;
