'use client';

import { Product } from '@/types';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [discount, setDiscount] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cart');
    }
    
    // Calculate totals
    const items = cartItems.reduce((total, item) => total + item.quantity, 0);
    setTotalItems(items);
    
    // Calculate subtotal
    const sub = cartItems.reduce((total, item) => {
      const itemPrice = item.product.discount
        ? item.product.price - (item.product.price * item.product.discount / 100)
        : item.product.price;
      return total + itemPrice * item.quantity;
    }, 0);
    setSubtotal(sub);
    
    // Calculate tax (10%)
    const taxAmount = sub * 0.1;
    setTax(taxAmount);
    
    // Calculate shipping (free over 1000, otherwise 100)
    const shippingAmount = sub > 1000 ? 0 : 100;
    setShipping(shippingAmount);
    
    // Calculate discount (if any bulk discounts)
    const discountAmount = sub > 2000 ? sub * 0.05 : 0; // 5% off over 2000
    setDiscount(discountAmount);
    
    // Calculate total
    const total = sub + taxAmount + shippingAmount - discountAmount;
    setTotalPrice(total);
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      // Check if product already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingItemIndex !== -1) {
        // Update quantity if product already in cart
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        
        // Show success message
        toast.success(`Added ${quantity} more ${product.name} to cart`);
        return updatedItems;
      } else {
        // Add new product to cart
        toast.success(`Added ${quantity} ${product.name} to cart`);
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.product._id === productId);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.product.name} from cart`);
      }
      return prevItems.filter((item) => item.product._id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
    
    const item = cartItems.find(item => item.product._id === productId);
    if (item) {
      toast.success(`Updated ${item.product.name} quantity to ${quantity}`);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared successfully');
  };

  const isInCart = (productId: string): boolean => {
    return cartItems.some(item => item.product._id === productId);
  };

  const getItemQuantity = (productId: string): number => {
    const item = cartItems.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    subtotal,
    tax,
    shipping,
    discount,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}