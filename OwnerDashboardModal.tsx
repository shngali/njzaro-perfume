import { useState, useEffect, FormEvent } from 'react';
import { productsCol, settingsCol, reviewsCol, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { perfumes as staticPerfumes } from '../data';
import { Perfume, StoreSettings, Review } from '../types';
import { AdminProductModal } from './AdminProductModal';
import {
  permanentlyDeletePerfume,
  getInitialFilteredPerfumes,
  mergePerfumesWithCloud,
  normalizePerfumeKey,
  syncLocalDeletedToFirestore,
} from '../utils/productManager';
import {
  X,
  Crown,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Percent,
  Search,
  Check,
  AlertCircle,
  Megaphone,
  ShoppingBag,
  Star,
  Settings,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function OwnerDashboardModal({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'products' | 'discounts' | 'settings' | 'reviews'>('products');
  const [perfumes, setPerfumes] = useState<Perfume[]>(() =>
    getInitialFilteredPerfumes(staticPerfumes)
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Store Settings State
  const [settings, setSettings] = useState<StoreSettings>({
    announcement: '✨ عروض خاصة: خصم 20% على جميع عطور إبراهيم القرشي لجميع محافظات العراق',
    announcementActive: true,
    whatsappNumber: '9647508491439',
    deliveryFee: 5000,
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Batch Discount State
  const [batchDiscountPercent, setBatchDiscountPercent] = useState<number>(20);
  const [batchBrand, setBatchBrand] = useState<string>('All');
  const [applyingBatch, setApplyingBatch] = useState(false);
  const [batchSuccessMsg, setBatchSuccessMsg] = useState<string | null>(null);
  const [batchErrorMsg, setBatchErrorMsg] = useState<string | null>(null);
  const [confirmBatchMode, setConfirmBatchMode] = useState(false);

  // Inline Delete Confirm States (No window.confirm!)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | string | null>(null);
  const [deleteReviewConfirmId, setDeleteReviewConfirmId] = useState<string | null>(null);

  // 1. Listen to products and deleted registry
  useEffect(() => {
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
    };

    const unsubProducts = onSnapshot(
      productsCol,
      (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data(), dbId: docSnap.id });
        });
        cachedFbPerfumes = list;
        recompute();
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'njzaro_products');
      }
    );

    const unsubRegistry = onSnapshot(
      doc(settingsCol, 'deleted_perfumes_registry'),
      (snapshot) => {
        cachedRegistry = snapshot.exists() ? snapshot.data() : null;
        recompute();
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'njzaro_settings/deleted_perfumes_registry');
      }
    );

    return () => {
      unsubProducts();
      unsubRegistry();
    };
  }, []);

  // Instant local event listeners for delete and update
  useEffect(() => {
    const handleDeleted = (e: any) => {
      const { id, name, key, dbId } = e.detail || {};
      setPerfumes((prev) =>
        prev.filter((p) => {
          if (id !== undefined && String(p.id) === String(id)) return false;
          if (dbId && p.dbId === dbId) return false;
          if (name && p.name && p.name.trim().toLowerCase() === name.trim().toLowerCase()) return false;
          if (key && normalizePerfumeKey(p) === key) return false;
          return true;
        })
      );
    };

    const handleUpdated = (e: any) => {
      const updatedProduct = e.detail?.product;
      if (updatedProduct) {
        setPerfumes((prev) => {
          const idx = prev.findIndex((p) => String(p.id) === String(updatedProduct.id));
          if (idx > -1) {
            const copy = [...prev];
            copy[idx] = updatedProduct;
            return copy;
          } else {
            return [updatedProduct, ...prev];
          }
        });
      }
    };

    window.addEventListener('njzaro_product_deleted', handleDeleted);
    window.addEventListener('njzaro_product_updated', handleUpdated);

    return () => {
      window.removeEventListener('njzaro_product_deleted', handleDeleted);
      window.removeEventListener('njzaro_product_updated', handleUpdated);
    };
  }, []);

  // 2. Listen to settings
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(doc(settingsCol, 'main'), (snap) => {
        if (snap.exists()) {
          setSettings((prev) => ({ ...prev, ...(snap.data() as StoreSettings) }));
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'njzaro_settings/main');
      });
      return () => unsubscribe();
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 3. Listen to reviews
  useEffect(() => {
    try {
      const q = query(reviewsCol, orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: Review[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as Review);
        });
        setReviews(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'njzaro_reviews');
      });
      return () => unsubscribe();
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Filtered perfumes for table
  const filteredList = perfumes.filter((p) => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(s) ||
      p.brand.toLowerCase().includes(s) ||
      (p.category && p.category.toLowerCase().includes(s))
    );
  });

  // Toggle in stock
  const handleToggleStock = async (perfume: Perfume) => {
    const newStock = perfume.inStock === false ? true : false;
    try {
      const docId = perfume.dbId || `prod_${perfume.id}`;
      await setDoc(doc(productsCol, docId), { ...perfume, inStock: newStock }, { merge: true });
    } catch (err: any) {
      alert('خطأ أثناء تحديث حالة التوافر: ' + err.message);
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (perfume: Perfume) => {
    const newFeatured = !perfume.isFeatured;
    try {
      const docId = perfume.dbId || `prod_${perfume.id}`;
      await setDoc(doc(productsCol, docId), { ...perfume, isFeatured: newFeatured }, { merge: true });
    } catch (err: any) {
      alert('خطأ أثناء التحديث: ' + err.message);
    }
  };

  // Delete product safely and permanently
  const confirmDeleteProduct = async (perfume: Perfume) => {
    try {
      setDeleteConfirmId(null);
      await permanentlyDeletePerfume(perfume);
    } catch (err: any) {
      console.error('Error deleting product from Firestore:', err);
    }
  };

  // Delete review safely
  const confirmDeleteReview = async (reviewId?: string) => {
    if (!reviewId) return;
    try {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setDeleteReviewConfirmId(null);
      await deleteDoc(doc(reviewsCol, reviewId));
    } catch (err: any) {
      console.error('Error deleting review:', err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsError(null);
    try {
      await setDoc(doc(settingsCol, 'main'), settings, { merge: true });
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3500);
    } catch (err: any) {
      setSettingsError('خطأ أثناء حفظ إعدادات المتجر: ' + (err.message || 'يرجى المحاولة مجدداً'));
    } finally {
      setSavingSettings(false);
    }
  };

  // Apply Batch Discount to Perfumes
  const handleApplyBatchDiscount = async () => {
    setApplyingBatch(true);
    setBatchSuccessMsg(null);
    setBatchErrorMsg(null);
    setConfirmBatchMode(false);
    try {
      const targetPerfumes = perfumes.filter((p) => {
        if (batchBrand === 'All') return true;
        return (p.category || p.brand) === batchBrand;
      });

      for (const p of targetPerfumes) {
        const updatedSizes = p.sizes.map((s) => {
          if (batchDiscountPercent > 0) {
            const basePrice = s.originalPrice || s.price;
            const discounted = Math.round(basePrice * (1 - batchDiscountPercent / 100));
            return {
              ...s,
              originalPrice: basePrice,
              price: discounted,
            };
          } else {
            return {
              ...s,
              price: s.originalPrice || s.price,
              originalPrice: undefined,
            };
          }
        });

        const updatedData = {
          ...p,
          discountPercent: batchDiscountPercent > 0 ? batchDiscountPercent : null,
          badge: batchDiscountPercent > 0 ? `خصم ${batchDiscountPercent}%` : null,
          sizes: updatedSizes,
        };

        const docId = p.dbId || `prod_${p.id}`;
        await setDoc(doc(productsCol, docId), updatedData, { merge: true });
      }

      setBatchSuccessMsg(
        batchDiscountPercent > 0
          ? `تم بنجاح تطبيق خصم ${batchDiscountPercent}% على ${targetPerfumes.length} عطر!`
          : `تم بنجاح إزالة الخصم واسترجاع الأسعار الأصلية لـ ${targetPerfumes.length} عطر!`
      );
      setTimeout(() => setBatchSuccessMsg(null), 4000);
    } catch (err: any) {
      setBatchErrorMsg('خطأ أثناء تطبيق الخصم: ' + (err.message || 'يرجى المحاولة مجدداً'));
    } finally {
      setApplyingBatch(false);
    }
  };

  // Unique brands
  const brandsList = ['All', ...new Set(perfumes.map((p) => p.category || p.brand))];

  // Stats calculation
  const totalFragrances = perfumes.length;
  const discountedCount = perfumes.filter(
    (p) => (p.discountPercent && p.discountPercent > 0) || p.sizes.some((s) => s.originalPrice && s.originalPrice > s.price)
  ).length;
  const outOfStockCount = perfumes.filter((p) => p.inStock === false).length;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in text-right" dir="rtl">
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#0A0407] border border-[#D4AF37]/35 p-5 sm:p-8 shadow-[0_35px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(107,23,39,0.25)] max-h-[92vh] flex flex-col text-[#FDFBF7]">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#D4AF37]/20 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#1E0B13] border border-[#D4AF37]/40 p-0.5 shadow-xs flex-shrink-0 flex items-center justify-center text-[#ECC870]">
              <Crown size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="serif text-lg sm:text-2xl font-bold text-[#FDFBF7] truncate">
                  لوحة تحكم المالك والمسؤول
                </h2>
                <span className="text-[10px] uppercase font-bold text-[#ECC870] bg-[#6B1727] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40 whitespace-nowrap">
                  Owner Suite
                </span>
              </div>
              <p className="text-xs text-[#D8CCC4] font-light truncate">
                إدارة كاملة للمتجر: إضافة العطور، تحديد الخصومات والأسعار، وإعدادات المتجر
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#D8CCC4] hover:text-[#ECC870] hover:bg-[#15070D] border border-[#D4AF37]/20 transition-colors cursor-pointer flex-shrink-0"
            aria-label="إغلاق"
          >
            <X size={22} />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 flex-shrink-0">
          <div className="p-3 rounded-2xl bg-[#15070D] border border-[#D4AF37]/20">
            <span className="text-[11px] text-[#D8CCC4] block">إجمالي العطور</span>
            <span className="text-xl font-bold text-[#FDFBF7] serif">{totalFragrances}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#15070D] border border-[#D4AF37]/35">
            <span className="text-[11px] text-[#ECC870] block flex items-center gap-1">
              <Percent size={12} />
              <span>عطور مخفّضة</span>
            </span>
            <span className="text-xl font-bold text-[#ECC870] serif">{discountedCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#15070D] border border-[#6B1727]">
            <span className="text-[11px] text-red-300 block">نفذت الكمية</span>
            <span className="text-xl font-bold text-red-400 serif">{outOfStockCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#15070D] border border-[#D4AF37]/20">
            <span className="text-[11px] text-[#D8CCC4] block flex items-center gap-1">
              <Star size={12} className="text-[#ECC870]" />
              <span>آراء العملاء</span>
            </span>
            <span className="text-xl font-bold text-[#FDFBF7] serif">{reviews.length}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-3 mb-4 overflow-x-auto flex-shrink-0">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] font-bold shadow-xs'
                : 'bg-[#15070D] text-[#D8CCC4] hover:text-[#FDFBF7] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
            }`}
          >
            <ShoppingBag size={15} />
            <span>إدارة العطور والأسعار ({totalFragrances})</span>
          </button>

          <button
            onClick={() => setActiveTab('discounts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'discounts'
                ? 'bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] font-bold shadow-xs'
                : 'bg-[#15070D] text-[#D8CCC4] hover:text-[#FDFBF7] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
            }`}
          >
            <Percent size={15} />
            <span>أداة الخصومات الجماعية</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] font-bold shadow-xs'
                : 'bg-[#15070D] text-[#D8CCC4] hover:text-[#FDFBF7] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
            }`}
          >
            <Megaphone size={15} />
            <span>شريط الإعلانات وتفاصيل المتجر</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] font-bold shadow-xs'
                : 'bg-[#15070D] text-[#D8CCC4] hover:text-[#FDFBF7] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
            }`}
          >
            <Star size={15} />
            <span>مراجعة التقييمات ({reviews.length})</span>
          </button>
        </div>

        {/* Tab Contents Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* 1. PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Actions & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c9bcaf]" />
                  <input
                    type="text"
                    placeholder="بحث في العطور أو الماركات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#15070D] border border-[#D4AF37]/25 rounded-xl pr-10 pl-3 py-2 text-xs text-[#FDFBF7] placeholder:text-[#A69B92] outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  onClick={() => setIsAddingNew(true)}
                  className="w-full sm:w-auto btn btn-gold py-2.5 px-5 text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <Plus size={15} />
                  <span>إضافة عطر جديد</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto rounded-2xl border border-[#D4AF37]/20 bg-[#12070B]">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="border-b border-[#D4AF37]/20 bg-[#15070D] text-[#D8CCC4]">
                      <th className="p-3">العطر</th>
                      <th className="p-3">الدار / الفئة</th>
                      <th className="p-3">الأحجام والأسعار الفعالة</th>
                      <th className="p-3">الخصم / الشارة</th>
                      <th className="p-3 text-center">التوافر</th>
                      <th className="p-3 text-center">مميز</th>
                      <th className="p-3 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4AF37]/10">
                    {filteredList.map((p) => {
                      const hasDiscount = (p.discountPercent && p.discountPercent > 0) || p.sizes.some((s) => s.originalPrice && s.originalPrice > s.price);
                      return (
                        <tr key={p.id} className="hover:bg-[#18070F] transition-colors">
                          <td className="p-3 font-semibold text-[#FDFBF7]">
                            <div className="flex items-center gap-2.5">
                              {p.img ? (
                                <img
                                  src={p.img}
                                  alt={p.name}
                                  className="w-9 h-9 object-contain rounded-lg bg-black/60 p-1 border border-[#D4AF37]/20"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-[#6B1727] border border-[#D4AF37]/35 flex items-center justify-center text-[#ECC870] font-bold">
                                  N
                                </div>
                              )}
                              <div>
                                <span className="block">{p.name}</span>
                                <span className="text-[10px] text-[#A69B92] line-clamp-1 max-w-[150px]">
                                  {p.notes}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3 text-[#D8CCC4]">{p.brand}</td>

                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {p.sizes.map((s) => (
                                <span
                                  key={s.ml}
                                  className="px-2 py-0.5 rounded bg-[#15070D] border border-[#D4AF37]/20 text-[10px] text-[#ECC870] font-medium"
                                >
                                  {s.ml}ml: {s.price.toLocaleString('en-US')} IQD
                                  {s.originalPrice && s.originalPrice > s.price && (
                                    <span className="text-white/40 line-through mr-1 text-[9px]">
                                      {s.originalPrice.toLocaleString('en-US')}
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="p-3">
                            {hasDiscount ? (
                              <span className="text-[10px] font-bold text-[#0A0407] bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] px-2 py-0.5 rounded-full">
                                {p.badge || `خصم ${p.discountPercent}%`}
                              </span>
                            ) : p.badge ? (
                              <span className="text-[10px] text-[#ECC870] bg-[#6B1727] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                                {p.badge}
                              </span>
                            ) : (
                              <span className="text-[10px] text-white/30">سعر عادي</span>
                            )}
                          </td>

                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleToggleStock(p)}
                              className={`px-2 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                                p.inStock !== false
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-red-950/60 text-red-300 border border-red-500/40'
                              }`}
                              title="انقر لتبديل التوافر"
                            >
                              {p.inStock !== false ? 'متوفر' : 'نفذت الكمية'}
                            </button>
                          </td>

                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleToggleFeatured(p)}
                              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                                p.isFeatured
                                  ? 'bg-[#D4AF37]/20 text-[#ECC870] border border-[#D4AF37]/40'
                                  : 'text-white/20 hover:text-white/60'
                              }`}
                              title={p.isFeatured ? 'مميز في المقدمة' : 'عادي'}
                            >
                              <Flame size={15} />
                            </button>
                          </td>

                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setEditingPerfume(p)}
                                className="p-1.5 rounded-lg bg-[#15070D] hover:bg-[#6B1727]/40 text-[#D8CCC4] hover:text-[#ECC870] border border-[#D4AF37]/20 transition-colors cursor-pointer"
                                title="تعديل العطر والأسعار"
                              >
                                <Edit2 size={14} />
                              </button>
                              {deleteConfirmId === p.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => confirmDeleteProduct(p)}
                                    className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] cursor-pointer shadow-sm animate-pulse"
                                    title="تأكيد الحذف نهائياً"
                                  >
                                    تأكيد
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-1.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[#D8CCC4] text-[10px] cursor-pointer"
                                  >
                                    إلغاء
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirmId(p.id)}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-red-200 border border-red-500/20 transition-colors cursor-pointer"
                                  title="حذف العطر نهائياً"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. DISCOUNTS TAB */}
          {activeTab === 'discounts' && (
            <div className="max-w-2xl mx-auto space-y-6 py-2">
              <div className="p-5 rounded-2xl bg-[#15070D] border border-[#D4AF37]/35 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-[#ECC870]">
                  <Percent size={20} />
                  <h3 className="serif text-lg font-bold text-[#FDFBF7]">
                    تطبيق خصم جماعي فوري على العطور
                  </h3>
                </div>
                <p className="text-xs text-[#D8CCC4] leading-relaxed">
                  يمكنك من هنا تحديد نسبة خصم مئوية وتطبيقها بنقرة واحدة على جميع عطور المتجر أو على دار معينة (مثل عطور إبراهيم القرشي)، وسيتم حفظ السعر الأصلي وإظهار السعر المخفض تلقائياً.
                </p>

                {batchSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                    <Check size={16} />
                    <span>{batchSuccessMsg}</span>
                  </div>
                )}

                {batchErrorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{batchErrorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs text-[#D8CCC4] font-semibold block mb-1.5">
                      الدار أو التصنيف المستهدف
                    </label>
                    <select
                      value={batchBrand}
                      onChange={(e) => setBatchBrand(e.target.value)}
                      className="checkout-input !mb-0 text-xs py-2.5 bg-[#0A0407] border-[#D4AF37]/30 text-[#FDFBF7]"
                    >
                      {brandsList.map((b) => (
                        <option key={b} value={b} className="bg-[#15070D] text-[#FDFBF7]">
                          {b === 'All' ? 'جميع العطور في المتجر' : b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#D8CCC4] font-semibold block mb-1.5">
                      نسبة الخصم المئوية (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      value={batchDiscountPercent}
                      onChange={(e) => setBatchDiscountPercent(Number(e.target.value))}
                      className="checkout-input !mb-0 text-xs py-2.5 font-bold text-[#ECC870] bg-[#0A0407] border-[#D4AF37]/30"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[11px] text-[#D8CCC4] self-center">نسب سريعة:</span>
                  {[10, 15, 20, 25, 30, 40].map((pct) => (
                    <button
                      type="button"
                      key={pct}
                      onClick={() => setBatchDiscountPercent(pct)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        batchDiscountPercent === pct
                          ? 'bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] border-[#D4AF37] font-bold'
                          : 'bg-[#12070B] text-[#D8CCC4] hover:text-[#FDFBF7] border-[#D4AF37]/20'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setBatchDiscountPercent(0)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      batchDiscountPercent === 0
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-red-950/40 text-red-300 border-red-500/30'
                    }`}
                  >
                    إلغاء الخصومات (0%)
                  </button>
                </div>

                <div className="pt-3 border-t border-[#D4AF37]/20 flex flex-col gap-2">
                  {!confirmBatchMode ? (
                    <button
                      onClick={() => setConfirmBatchMode(true)}
                      className="w-full btn btn-gold py-3 text-xs flex items-center justify-center gap-2"
                    >
                      <Percent size={15} />
                      <span>
                        {batchDiscountPercent > 0
                          ? `تطبيق خصم ${batchDiscountPercent}% على (${batchBrand === 'All' ? 'جميع العطور' : batchBrand})`
                          : `إزالة الخصم عن (${batchBrand === 'All' ? 'جميع العطور' : batchBrand})`}
                      </span>
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-[#1E0B13] border border-[#D4AF37]/50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                      <span className="text-xs text-[#FDFBF7]">
                        تأكيد: هل أنت متأكد من {batchDiscountPercent > 0 ? `تطبيق خصم ${batchDiscountPercent}%` : 'إلغاء الخصم'} الآن؟
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleApplyBatchDiscount}
                          disabled={applyingBatch}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          {applyingBatch ? 'جاري التطبيق...' : 'نعم، طبّق الآن'}
                        </button>
                        <button
                          onClick={() => setConfirmBatchMode(false)}
                          disabled={applyingBatch}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#D8CCC4] text-xs transition-colors cursor-pointer"
                        >
                          تراجع
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. STORE SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-5 py-2">
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 space-y-4">
                  <div className="flex items-center gap-2 text-[#ECC870]">
                    <Megaphone size={18} />
                    <h3 className="serif text-base font-bold text-[#FDFBF7]">
                      شريط الإعلانات الترويجي العلوي
                    </h3>
                  </div>

                  {settingsSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                      <Check size={16} />
                      <span>تم حفظ إعدادات المتجر بنجاح وتحديثها للعملاء فوراً!</span>
                    </div>
                  )}

                  {settingsError && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle size={16} />
                      <span>{settingsError}</span>
                    </div>
                  )}

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.announcementActive}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, announcementActive: e.target.checked }))
                      }
                      className="w-4 h-4 rounded text-[#D4AF37] bg-black/40 border-[#D4AF37]/40 accent-[#D4AF37]"
                    />
                    <span className="text-xs font-semibold text-[#FDFBF7]">
                      تفعيل ظهور شريط الإعلان في أعلى الموقع للزوار
                    </span>
                  </label>

                  <div>
                    <label className="text-xs text-[#D8CCC4] font-semibold block mb-1.5">
                      نص الإعلان الترويجي
                    </label>
                    <textarea
                      rows={2}
                      value={settings.announcement}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, announcement: e.target.value }))
                      }
                      placeholder="مثال: خصم 20% بمناسبة الافتتاح على جميع عطور إبراهيم القرشي..."
                      className="checkout-input !mb-0 text-xs py-2.5 resize-none bg-[#0A0407] border-[#D4AF37]/30 text-[#FDFBF7]"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 space-y-4">
                  <div className="flex items-center gap-2 text-[#ECC870]">
                    <Settings size={18} />
                    <h3 className="serif text-base font-bold text-[#FDFBF7]">
                      أرقام التواصل والتوصيل
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#D8CCC4] font-semibold block mb-1.5">
                        رقم واتساب لاستقبال الطلبات
                      </label>
                      <input
                        type="text"
                        value={settings.whatsappNumber}
                        onChange={(e) =>
                          setSettings((prev) => ({ ...prev, whatsappNumber: e.target.value }))
                        }
                        placeholder="9647508491439"
                        className="checkout-input !mb-0 text-xs py-2.5 bg-[#0A0407] border-[#D4AF37]/30 text-[#FDFBF7]"
                      />
                      <span className="text-[10px] text-[#A69B92] mt-1 block">
                        بالصيغة الدولية بدون علامة + (مثال: 9647508491439)
                      </span>
                    </div>

                    <div>
                      <label className="text-xs text-[#D8CCC4] font-semibold block mb-1.5">
                        أجور التوصيل الافتراضية (IQD)
                      </label>
                      <input
                        type="number"
                        value={settings.deliveryFee}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            deliveryFee: Number(e.target.value),
                          }))
                        }
                        placeholder="5000"
                        className="checkout-input !mb-0 text-xs py-2.5 bg-[#0A0407] border-[#D4AF37]/30 text-[#FDFBF7]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="w-full btn btn-gold py-3 text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <Check size={16} />
                  <span>{savingSettings ? 'جاري الحفظ...' : 'حفظ إعدادات المتجر'}</span>
                </button>
              </form>
            </div>
          )}

          {/* 4. REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <p className="text-xs text-[#D8CCC4]">
                يمكنك هنا إدارة ومسح أي تقييمات غير لائقة من قسم آراء العملاء.
              </p>

              {reviews.length === 0 ? (
                <div className="text-center py-12 text-[#A69B92] text-xs">
                  لا توجد مراجعات مسجلة في قاعدة البيانات حالياً.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-2xl bg-[#15070D] border border-[#D4AF37]/20 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, idx) => (
                              <Star
                                key={idx}
                                size={13}
                                className={
                                  idx < r.rating
                                    ? 'text-[#ECC870] fill-[#ECC870]'
                                    : 'text-white/20'
                                }
                              />
                            ))}
                          </div>
                          {deleteReviewConfirmId === r.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => confirmDeleteReview(r.id)}
                                className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold cursor-pointer"
                              >
                                حذف
                              </button>
                              <button
                                onClick={() => setDeleteReviewConfirmId(null)}
                                className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#D8CCC4] text-[10px] cursor-pointer"
                              >
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteReviewConfirmId(r.id)}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              title="حذف هذا التقييم"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-[#FDFBF7] italic leading-relaxed mb-3">
                          "{r.text}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#D4AF37]/15 text-[11px] text-[#D8CCC4] flex items-center justify-between">
                        <span className="font-semibold text-[#ECC870]">{r.name}</span>
                        <span className="text-[9px] text-[#A69B92]">عميل معتمد</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit or Add Fragrance Modal overlay */}
      {(editingPerfume || isAddingNew) && (
        <AdminProductModal
          perfume={editingPerfume || undefined}
          onClose={() => {
            setEditingPerfume(null);
            setIsAddingNew(false);
          }}
        />
      )}
    </div>
  );
}
