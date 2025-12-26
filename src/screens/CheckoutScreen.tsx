
import React from 'react';
import { useStore } from '../App';
import { useNavigate } from 'react-router-dom';

const CheckoutScreen: React.FC = () => {
    const { cart, removeFromCart, clearCart, config } = useStore();
    const navigate = useNavigate();

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleFinish = () => {
        // Simple WhatsApp Link generation
        const message = `*Novo Pedido - ${config.name}*\n\n` +
            cart.map(item => `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n') +
            `\n\n*Total: R$ ${total.toFixed(2)}*`;

        const url = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        clearCart();
        navigate('/');
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white">
            <div className="p-4 bg-slate-900 border-b border-white/5 flex items-center gap-4">
                <button onClick={() => navigate('/')} className="material-symbols-outlined text-slate-400">arrow_back</button>
                <h1 className="font-black text-lg">Seu Pedido</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                    <div className="text-center text-slate-500 mt-20">
                        <span className="material-symbols-outlined text-6xl mb-4">shopping_cart_off</span>
                        <p>Sua sacola está vazia.</p>
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item.id} className="flex gap-4 bg-slate-900 p-4 rounded-xl border border-white/5">
                            <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt={item.name} />
                            <div className="flex-1">
                                <h3 className="font-bold">{item.name}</h3>
                                <p className="text-lime-400 font-bold">R$ {item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 material-symbols-outlined">delete</button>
                                <span className="bg-slate-950 px-2 rounded text-xs">x{item.quantity}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {cart.length > 0 && (
                <div className="p-4 bg-slate-900 border-t border-white/5 safe-area-bottom">
                    <div className="flex justify-between mb-4 text-xl font-black">
                        <span>Total</span>
                        <span className="text-lime-400">R$ {total.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleFinish}
                        className="w-full bg-lime-400 text-slate-950 p-4 rounded-2xl font-black shadow-lg"
                    >
                        Finalizar Pedido no WhatsApp
                    </button>
                </div>
            )}
        </div>
    );
};
export default CheckoutScreen;
