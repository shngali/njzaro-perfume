import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Perfume } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (key: string) => void;
  updateQty: (key: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;
  // Wishlist
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  wishlistCount: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  // Quick View Product Modal
  quickViewProduct: Perfume | null;
  setQuickViewProduct: (product: Perfume | null) => void;
  // Search Overlay
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  // Checkout Modal
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  // Category / Brand filter jump
  activeCategoryFilter: string | null;
  setActiveCategoryFilter: (cat: string | null) => void;
  activeBrandFilter: string | null;
  setActiveBrandFilter: (brand: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('njzaro_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('njzaro_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Perfume | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [activeBrandFilter, setActiveBrandFilter] = useState<string | null>(null);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('njzaro_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Sync wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('njzaro_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.key === item.key);
      if (existing) {
        return prev.map((c) => (c.key === item.key ? { ...c, qty: c.qty + (item.qty || 1) } : c));
      }
      return [...prev, { ...item, qty: item.qty || 1 }];
    });
  };

  const removeFromCart = (key: string) => {
    setCart((prev) => prev.filter((c) => c.key !== key));
  };

  const updateQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.key === key) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isInWishlist = (id: number) => wishlist.includes(id);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const wishlistCount = wishlist.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        isWishlistOpen,
        setIsWishlistOpen,
        quickViewProduct,
        setQuickViewProduct,
        isSearchOpen,
        setIsSearchOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeCategoryFilter,
        setActiveCategoryFilter,
        activeBrandFilter,
        setActiveBrandFilter,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

