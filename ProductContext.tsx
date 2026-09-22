import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { perfumes as staticPerfumes } from '../data';
import { productsCol, settingsCol, handleFirestoreError, OperationType } from '../lib/firebase';
import { onSnapshot, doc } from 'firebase/firestore';
import { Perfume } from '../types';
import {
  getInitialFilteredPerfumes,
  mergePerfumesWithCloud,
  syncLocalDeletedToFirestore,
} from '../utils/productManager';

interface ProductContextType {
  perfumes: Perfume[];
  loading: boolean;
  refreshProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [perfumes, setPerfumes] = useState<Perfume[]>(() =>
    getInitialFilteredPerfumes(staticPerfumes)
  );
  const [loading, setLoading] = useState(true);

  const refreshProducts = useCallback(() => {
    setPerfumes(getInitialFilteredPerfumes(staticPerfumes));
  }, []);

  useEffect(() => {
    // Push any offline or local storage deletions to Firestore
    syncLocalDeletedToFirestore();

    let cachedFbPerfumes: any[] = [];
    let cachedRegistry: any = null;

    const recompute = () => {
      const merged = mergePerfumesWithCloud(
        staticPerfumes,
        cachedFbPerfumes,
        cachedRegistry
      );
      setPerfumes(merged);
      setLoading(false);
    };

    let unsubProducts = () => {};
    let unsubRegistry = () => {};

    try {
      unsubProducts = onSnapshot(
        productsCol,
        (snapshot) => {
          cachedFbPerfumes = snapshot.docs.map((d) => ({
            ...d.data(),
            dbId: d.id,
          }));
          recompute();
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'njzaro_products');
          setLoading(false);
        }
      );
    } catch (e) {
      console.warn('Could not attach live products listener:', e);
      setLoading(false);
    }

    try {
      unsubRegistry = onSnapshot(
        doc(settingsCol, 'deleted_perfumes_registry'),
        (snapshot) => {
          if (snapshot.exists()) {
            cachedRegistry = snapshot.data();
          } else {
            cachedRegistry = null;
          }
          recompute();
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'njzaro_settings/deleted_perfumes_registry');
        }
      );
    } catch (e) {
      console.warn('Could not attach registry listener:', e);
    }

    const handleLocalUpdate = () => {
      recompute();
    };
    window.addEventListener('njzaro-products-updated', handleLocalUpdate);

    return () => {
      unsubProducts();
      unsubRegistry();
      window.removeEventListener('njzaro-products-updated', handleLocalUpdate);
    };
  }, []);

  return (
    <ProductContext.Provider value={{ perfumes, loading, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
