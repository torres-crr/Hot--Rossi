
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreConfig, CartItem, Product } from './types';
import { INITIAL_STORE_CONFIG, INITIAL_PRODUCTS } from './constants';
import { supabase } from './lib/supabase';
import MenuScreen from './screens/MenuScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import AdminScreen from './screens/AdminScreen';

interface StoreContextType {
  config: StoreConfig;
  updateConfig: (newConfig: StoreConfig) => void;
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  editProduct: (product: Product) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

const App: React.FC = () => {
  /* Supabase Migration */
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<StoreConfig>(INITIAL_STORE_CONFIG);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Config
        const { data: configData } = await supabase
          .from('store_config')
          .select('*')
          .single();

        if (configData) {
          // Parse categories if stored as text array in DB, or use as is
          setConfig({
            ...configData,
            categories: configData.categories || INITIAL_STORE_CONFIG.categories,
            isOpen: configData.is_open ?? true // Map is_open (db) to isOpen (app)
          });
        }

        // Fetch Products
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: true });

        if (productsData) {
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update Config in Supabase
  const updateConfig = async (newConfig: StoreConfig) => {
    setConfig(newConfig);
    try {
      await supabase
        .from('store_config')
        .upsert({
          id: 1, // Assuming single store config
          name: newConfig.name,
          logo: newConfig.logo,
          hero_image: newConfig.heroImage,
          primary_color: newConfig.primaryColor,
          whatsapp: newConfig.whatsapp,
          pix_cpf: newConfig.pixCpf,
          categories: newConfig.categories,
          is_open: newConfig.isOpen
        });
    } catch (error) {
      console.error('Error updating config:', error);
      alert('Erro ao salvar configuração na nuvem.');
    }
  };

  const addProduct = async (product: Product) => {
    setProducts(prev => [...prev, product]); // Optimistic update
    try {
      await supabase.from('products').insert(product);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Erro ao adicionar produto no banco de dados.');
    }
  };

  const editProduct = async (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    try {
      await supabase.from('products').update(updatedProduct).eq('id', updatedProduct.id);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Erro ao atualizar produto no banco de dados.');
    }
  };

  const removeProduct = async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    try {
      await supabase.from('products').delete().eq('id', productId);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erro ao excluir produto do banco de dados.');
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const clearCart = () => setCart([]);

  return (
    <StoreContext.Provider value={{ config, updateConfig, products, addProduct, editProduct, removeProduct, cart, addToCart, removeFromCart, clearCart }}>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col max-w-xl mx-auto shadow-2xl overflow-hidden relative">
          <Routes>
            <Route path="/" element={<MenuScreen />} />
            <Route path="/checkout" element={<CheckoutScreen />} />
            <Route path="/admin" element={<AdminScreen />} />
          </Routes>
        </div>
      </Router>
    </StoreContext.Provider>
  );
};

export default App;
// Redeploy trigger qui 25 dez 2025 23:46:55 -03
