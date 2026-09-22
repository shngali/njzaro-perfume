/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProductProvider } from './context/ProductContext';
import { Loader } from './components/Loader';
import { Effects } from './components/Effects';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { BrandsSection } from './components/BrandsSection';
import { Collection } from './components/Collection';
import { About } from './components/About';
import { Reviews } from './components/Reviews';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchOverlay } from './components/SearchOverlay';
import { AuthModal } from './components/AuthModal';

function AppContent() {
  const { user, loading } = useAuth();
  const { quickViewProduct, setQuickViewProduct } = useCart();
  const [guestAllowed, setGuestAllowed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0407] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)]" />
        <span className="cinzel text-2xl tracking-[0.28em] font-bold text-[#FDFBF7]">NJZARO</span>
        <span className="text-[9px] tracking-[0.38em] text-[#ECC870] uppercase mt-1 font-semibold">HAUTE PARFUMERIE</span>
      </div>
    );
  }

  // Authentication Gate: Guests can also click explore to preview the boutique
  if (!user && !guestAllowed) {
    return <AuthModal onContinueAsGuest={() => setGuestAllowed(true)} />;
  }

  return (
    <>
      <Loader />
      <Effects />
      <Header />
      <main className="bg-[#0A0407] text-[#FDFBF7]">
        <Hero />
        <CategoriesSection />
        <BrandsSection />
        <Collection />
        <About />
        <Reviews />
      </main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <SearchOverlay />
      {quickViewProduct && (
        <ProductDetailModal
          perfume={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
