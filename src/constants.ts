
import { Product, StoreConfig } from './types';

export const ADMIN_PASSWORD = '116289';

export const INITIAL_STORE_CONFIG: StoreConfig = {
  name: "Hott Rossi Pizzaria",
  logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop",
  heroImage: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1200&h=400&fit=crop",
  primaryColor: "#a3e635", // Lime-400 (Verde Florecente)
  whatsapp: "5511992525810",
  pixCpf: "30507986881",
  categories: ["Pizzas", "Pastel", "Lanche", "Almoço", "Bebidas", "Sobremesas"],
  isOpen: true
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Margherita Supreme',
    description: 'Molho de tomate italiano, mussarela de búfala, manjericão fresco e azeite extra virgem.',
    price: 49.90,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=400&h=300&fit=crop',
    category: 'Pizzas'
  },
  {
    id: '2',
    name: 'Calabresa Especial',
    description: 'Calabresa defumada artesanal, cebola roxa caramelizada e azeitonas pretas.',
    price: 44.90,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=300&fit=crop',
    category: 'Pizzas'
  },
  {
    id: '3',
    name: 'Quatro Queijos',
    description: 'Mussarela, provolone, parmesão e gorgonzola cremoso.',
    price: 52.90,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'Pizzas'
  },
  {
    id: '4',
    name: 'Coca-Cola 2L',
    description: 'Refrescante e gelada.',
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop',
    category: 'Bebidas'
  }
];
