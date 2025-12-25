
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface StoreConfig {
  name: string;
  logo: string;
  heroImage: string;
  primaryColor: string;
  whatsapp: string;
  pixCpf: string;
  categories: string[];
  isOpen: boolean;
}

export interface OrderData {
  items: CartItem[];
  address: {
    street: string;
    number: string;
    district: string;
    reference: string;
  };
  paymentMethod: 'credit' | 'debit' | 'pix' | 'cash';
  changeFor?: string;
  total: number;
}
