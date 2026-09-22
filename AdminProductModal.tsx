import { useState, FormEvent } from 'react';
import { addDoc, updateDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { productsCol, storage } from '../lib/firebase';
import { Perfume, PerfumeSize } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { permanentlyDeletePerfume } from '../utils/productManager';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Percent,
  Check,
  Smartphone,
  Camera,
  UploadCloud,
  Zap,
  Loader2,
} from 'lucide-react';

interface Props {
  perfume?: Perfume;
  onClose: () => void;
}

export function AdminProductModal({ perfume, onClose }: Props) {
  const isEditing = !!perfume;
  const [brand, setBrand] = useState(perfume?.brand || '');
  const [name, setName] = useState(perfume?.name || '');
  const [notes, setNotes] = useState(perfume?.notes || '');
  const [category, setCategory] = useState(perfume?.category || '');
  const [badge, setBadge] = useState(perfume?.badge || '');
  const [discountPercent, setDiscountPercent] = useState<number | ''>(
    perfume?.discountPercent ?? ''
  );
  const [inStock, setInStock] = useState<boolean>(perfume?.inStock ?? true);
  const [isFeatured, setIsFeatured] = useState<boolean>(perfume?.isFeatured ?? false);
  const [confirmDeleteMode, setConfirmDeleteMode] = useState(false);

  // Mobile Image Handling - Strictly via device upload / camera
  const [currentImg, setCurrentImg] = useState<string | null>(perfume?.img || null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(perfume?.img || null);
  const [optimizedDataUrl, setOptimizedDataUrl] = useState<string | null>(null);
  const [optimizedBlob, setOptimizedBlob] = useState<Blob | null>(null);
  const [imageSizeInfo, setImageSizeInfo] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const [sizes, setSizes] = useState<PerfumeSize[]>(
    perfume?.sizes && perfume.sizes.length > 0
      ? perfume.sizes.map((s) => ({
          ml: s.ml,
          price: s.price,
          originalPrice:
            s.originalPrice ??
            (perfume.discountPercent
              ? Math.round(s.price / (1 - perfume.discountPercent / 100))
              : undefined),
        }))
      : [
          { ml: 10, price: 15000, originalPrice: undefined },
          { ml: 50, price: 45000, originalPrice: undefined },
        ]
  );

  const [submitting, setSubmitting] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string | null>(null);

  const handleFileChange = async (selectedFile: File | null) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setIsCompressing(true);
    setImageSizeInfo('جاري ضغط وتحسين جودة الصورة للموبايل...');

    try {
      // Compress in browser instantly (<100ms)
      const { compressedBlob, dataUrl, sizeKb } = await compressImage(
        selectedFile,
        1000,
        1000,
        0.82
      );
      setOptimizedBlob(compressedBlob);
      setOptimizedDataUrl(dataUrl);
      setPreviewUrl(dataUrl);
      setImageSizeInfo(
        `تم ضغط الصورة وتسريعها بنجاح: ${sizeKb} KB (جاهزة للحفظ الفوري)`
      );
    } catch (err) {
      console.warn('Compression fallback to raw file:', err);
      const rawUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(rawUrl);
      setImageSizeInfo(`الحجم: ${Math.round(selectedFile.size / 1024)} KB`);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setCurrentImg(null);
    setOptimizedBlob(null);
    setOptimizedDataUrl(null);
    setImageSizeInfo(null);
  };

  // Quick discount applicator
  const applyDiscountPercent = (percent: number) => {
    setDiscountPercent(percent);
    setBadge(percent > 0 ? `خصم ${percent}%` : '');
    setSizes((prev) =>
      prev.map((s) => {
        const base = s.originalPrice || s.price;
        if (percent > 0) {
          const discounted = Math.round(base * (1 - percent / 100));
          return {
            ...s,
            originalPrice: base,
            price: discounted,
          };
        } else {
          return {
            ...s,
            price: s.originalPrice || s.price,
            originalPrice: undefined,
          };
        }
      })
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isCompressing) {
      alert('يرجى الانتظار لحظة لاكتمال معالجة الصورة...');
      return;
    }

    setSubmitting(true);
    setUploadProgressText('جاري معالجة وحفظ العطر...');

    try {
      let finalImgUrl: string | null = currentImg;

      if (optimizedDataUrl || file) {
        setUploadProgressText('جاري رفع صورة العطر بأقصى سرعة...');

        // Primary: Upload the ultra-light compressed blob (takes ~200-500ms)
        const blobToUpload = optimizedBlob || file;
        let storageUploadSucceeded = false;

        if (blobToUpload) {
          try {
            const cleanName = `${Date.now()}_perfume.webp`;
            const storageRef = ref(storage, `products/${cleanName}`);

            // Promise with timeout: don't let slow networks or CORS hang the user!
            const uploadPromise = uploadBytes(storageRef, blobToUpload).then((snapshot) =>
              getDownloadURL(snapshot.ref)
            );

            const timeoutPromise = new Promise<null>((_, reject) =>
              setTimeout(() => reject(new Error('Storage timeout')), 4000)
            );

            const uploadedUrl = (await Promise.race([
              uploadPromise,
              timeoutPromise,
            ])) as string | null;

            if (uploadedUrl) {
              finalImgUrl = uploadedUrl;
              storageUploadSucceeded = true;
            }
          } catch (storageErr) {
            console.warn(
              'Firebase Storage delayed or blocked; using instant compressed photo fallback:',
              storageErr
            );
          }
        }

        // If storage timed out or failed, use the optimized base64 dataUrl directly!
        if (!storageUploadSucceeded && optimizedDataUrl) {
          finalImgUrl = optimizedDataUrl;
        }
      }

      setUploadProgressText('جاري حفظ التعديلات في المتجر...');

      const productData = {
        brand: brand.trim(),
        name: name.trim(),
        notes: notes.trim(),
        category: category.trim() || brand.trim(),
        badge: badge.trim() || (discountPercent ? `خصم ${discountPercent}%` : null),
        discountPercent: discountPercent ? Number(discountPercent) : null,
        inStock,
        isFeatured,
        img: finalImgUrl || null,
        sizes: sizes.map((s) => ({
          ml: Number(s.ml),
          price: Number(s.price),
          ...(s.originalPrice ? { originalPrice: Number(s.originalPrice) } : {}),
        })),
      };

      const targetId = isEditing && perfume?.id ? perfume.id : Date.now();
      const docId = perfume?.dbId || `prod_${targetId}`;

      const savedPerfume = {
        ...productData,
        id: targetId,
        dbId: docId,
        updatedAt: Date.now(),
      };

      // 1. Save to Firestore (works for static catalog items and Firestore items alike!)
      await setDoc(doc(productsCol, docId), savedPerfume, { merge: true });

      // 2. Broadcast immediately so Collection and OwnerDashboard reflect changes with 0ms delay
      window.dispatchEvent(
        new CustomEvent('njzaro_product_updated', {
          detail: { product: savedPerfume },
        })
      );

      onClose();
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert('حدث خطأ أثناء الحفظ: ' + error.message);
    } finally {
      setSubmitting(false);
      setUploadProgressText(null);
    }
  };

  const handleDelete = async () => {
    if (!perfume) return;
    try {
      setSubmitting(true);
      await permanentlyDeletePerfume(perfume);
      onClose();
    } catch (error: any) {
      console.error('Error deleting perfume:', error);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in text-right"
      dir="rtl"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0A0407] border border-[#D4AF37]/35 p-5 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(107,23,39,0.25)] my-6 max-h-[92vh] overflow-y-auto text-[#FDFBF7]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-2 rounded-full text-[#D8CCC4] hover:text-[#ECC870] hover:bg-[#15070D] transition-colors cursor-pointer border border-[#D4AF37]/20"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Title Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20 pe-10">
          <div className="w-10 h-10 rounded-2xl bg-[#1E0B13] border border-[#D4AF37]/40 flex items-center justify-center text-[#ECC870] shadow-xs flex-shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="serif text-xl sm:text-2xl font-bold text-[#FDFBF7]">
              {isEditing ? 'تعديل بيانات العطر والأسعار' : 'إضافة عطر جديد إلى المتجر'}
            </h2>
            <span className="text-xs text-[#D8CCC4]">
              لوحة المالك — رفع الصور المباشر والسريع من الهاتف مع ضغط فوري
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Brand and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#D8CCC4] font-semibold block mb-1.5">
                دار العطور / الماركة (Brand)
              </label>
              <input
                required
                type="text"
                placeholder="مثال: Ibrahim Al Qurashi"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  if (!category) setCategory(e.target.value);
                }}
                className="checkout-input !mb-0 text-xs py-2.5"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#D8CCC4] font-semibold block mb-1.5">
                التصنيف / الفئة (Category)
              </label>
              <input
                required
                type="text"
                placeholder="مثال: Ibrahim Al Qurashi / Exclusive"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="checkout-input !mb-0 text-xs py-2.5"
              />
            </div>
          </div>

          {/* Perfume Name */}
          <div>
            <label className="text-xs uppercase tracking-wider text-[#D8CCC4] font-semibold block mb-1.5">
              اسم العطر (Fragrance Name)
            </label>
            <input
              required
              type="text"
              placeholder="مثال: Balas Rose أو Tobacco Cedar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="checkout-input !mb-0 text-xs py-2.5"
            />
          </div>

          {/* Olfactory Notes */}
          <div>
            <label className="text-xs uppercase tracking-wider text-[#D8CCC4] font-semibold block mb-1.5">
              النوتات العطرية (Notes)
            </label>
            <input
              required
              type="text"
              placeholder="مثال: ورد طائفي · زعفران · عود كمبودي · عنبر"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="checkout-input !mb-0 text-xs py-2.5"
            />
          </div>

          {/* Dedicated High-Speed Mobile Image Upload Area */}
          <div className="p-4 rounded-2xl bg-[#15070D] border border-[#D4AF37]/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-[#ECC870] font-bold flex items-center gap-1.5">
                <Smartphone size={15} />
                <span>صورة زجاجة العطر (رفع فوري من الموبايل)</span>
              </label>

              {isCompressing ? (
                <span className="text-[10px] text-[#ECC870] flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" />
                  <span>جاري المعالجة...</span>
                </span>
              ) : previewUrl ? (
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <Zap size={11} />
                  <span>جاهزة وفورية</span>
                </span>
              ) : null}
            </div>

            {previewUrl ? (
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#1E0B13] border border-[#D4AF37]/25">
                <div className="w-20 h-24 rounded-xl bg-[#0A0407] p-1.5 border border-[#D4AF37]/30 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md relative">
                  <img
                    src={previewUrl}
                    alt="معاينة العطر"
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                  />
                  {isCompressing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 size={18} className="text-[#ECC870] animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <span className="text-xs font-bold text-[#FDFBF7] block truncate">
                    {file ? file.name : 'الصورة المحفوظة للعطر'}
                  </span>
                  <span className="text-[10px] text-[#D8CCC4] block mt-0.5">
                    {imageSizeInfo ||
                      (file
                        ? `تم الضغط والتجهيز من الموبايل · ${(file.size / 1024).toFixed(1)} KB`
                        : 'صورة معتمدة ومخزنة')}
                  </span>
                  <div className="flex items-center gap-3 mt-3">
                    <label className="text-xs font-bold text-[#ECC870] hover:text-[#F5DE88] transition-colors cursor-pointer flex items-center gap-1.5 bg-[#15070D] hover:bg-[#1E0B13] px-3 py-1.5 rounded-lg border border-[#D4AF37]/30">
                      <Camera size={13} />
                      <span>التقاط / تغيير الصورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs text-red-300 hover:text-red-200 transition-colors cursor-pointer py-1 px-2"
                    >
                      إزالة
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-2xl bg-[#1E0B13]/40 hover:bg-[#1E0B13] transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-[#6B1727] border border-[#D4AF37]/50 flex items-center justify-center text-[#ECC870] mb-2.5 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                  <Camera size={22} />
                </div>
                <span className="text-xs font-bold text-[#FDFBF7] group-hover:text-[#ECC870] transition-colors text-center">
                  اضغط هنا لاختيار صورة من الموبايل أو التقاط صورة بالكاميرا
                </span>
                <span className="text-[10px] text-[#D8CCC4] mt-1 text-center">
                  يتم ضغط الصورة فورياً لتكون سريعة جداً وخفيفة على الهاتف
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>

          {/* Pricing & Discount Control Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37]/10 via-[#6B1727]/25 to-transparent border border-[#D4AF37]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#ECC870] font-bold flex items-center gap-1.5">
                <Percent size={14} />
                <span>تحديد الخصومات والعروض (Discounts)</span>
              </span>
              {discountPercent !== '' && Number(discountPercent) > 0 && (
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  خصم {discountPercent}% نشط
                </span>
              )}
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-[#D8CCC4]">خصم سريع:</span>
              {[0, 10, 15, 20, 25, 30, 40].map((pct) => (
                <button
                  type="button"
                  key={pct}
                  onClick={() => applyDiscountPercent(pct)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    discountPercent === pct
                      ? 'bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] border-[#D4AF37] font-bold'
                      : 'bg-[#15070D] text-[#D8CCC4] hover:text-[#FDFBF7] border-[#D4AF37]/25 hover:border-[#D4AF37]'
                  }`}
                >
                  {pct === 0 ? 'بدون خصم' : `${pct}%-`}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] text-[#D8CCC4] block mb-1">
                  نسبة الخصم المئوية مخصصة (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  placeholder="مثال: 20"
                  value={discountPercent}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : Number(e.target.value);
                    setDiscountPercent(val);
                    if (typeof val === 'number') {
                      applyDiscountPercent(val);
                    }
                  }}
                  className="checkout-input !mb-0 text-xs py-2"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#D8CCC4] block mb-1">
                  شارة العطر / النص الترويجي (Badge)
                </label>
                <input
                  type="text"
                  placeholder="مثال: خصم 20% / حصري / الأكثر مبيعاً"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="checkout-input !mb-0 text-xs py-2"
                />
              </div>
            </div>
          </div>

          {/* Sizes and Prices */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider text-[#D8CCC4] font-semibold">
                الأحجام والأسعار بالدينار العراقي (IQD)
              </label>
              <span className="text-[10px] text-[#A69B92]">
                السعر الأصلي يظهر مشطوباً إذا وجد خصم
              </span>
            </div>

            <div className="space-y-2">
              {sizes.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-[#15070D] p-2.5 rounded-xl border border-[#D4AF37]/20"
                >
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#A69B92] mb-0.5">الحجم</span>
                    <div className="flex items-center gap-1">
                      <input
                        required
                        type="number"
                        placeholder="ML"
                        value={s.ml}
                        onChange={(e) => {
                          const newSizes = [...sizes];
                          newSizes[idx].ml = Number(e.target.value);
                          setSizes(newSizes);
                        }}
                        className="w-16 checkout-input !mb-0 text-xs py-1.5 text-center font-bold"
                      />
                      <span className="text-[11px] text-[#D8CCC4]">مل</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <span className="text-[9px] text-[#A69B92] mb-0.5">
                      سعر البيع الفعلي (IQD)
                    </span>
                    <input
                      required
                      type="number"
                      placeholder="السعر الفعلي"
                      value={s.price}
                      onChange={(e) => {
                        const newSizes = [...sizes];
                        newSizes[idx].price = Number(e.target.value);
                        setSizes(newSizes);
                      }}
                      className="checkout-input !mb-0 text-xs py-1.5 font-bold text-[#ECC870]"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <span className="text-[9px] text-[#A69B92] mb-0.5">
                      السعر قبل الخصم (اختياري)
                    </span>
                    <input
                      type="number"
                      placeholder="السعر السابق"
                      value={s.originalPrice || ''}
                      onChange={(e) => {
                        const newSizes = [...sizes];
                        newSizes[idx].originalPrice = e.target.value
                          ? Number(e.target.value)
                          : undefined;
                        setSizes(newSizes);
                      }}
                      className="checkout-input !mb-0 text-xs py-1.5 text-white/40"
                    />
                  </div>

                  {sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSizes(sizes.filter((_, i) => i !== idx))}
                      className="p-2 text-[#D8CCC4] hover:text-red-300 transition-colors cursor-pointer mt-3"
                      title="حذف هذا الحجم"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setSizes([
                  ...sizes,
                  { ml: 50, price: 40000, originalPrice: undefined },
                ])
              }
              className="mt-2.5 flex items-center gap-1.5 text-xs text-[#ECC870] hover:text-[#F5DE88] hover:underline cursor-pointer py-1"
            >
              <Plus size={14} />
              <span>إضافة حجم عبوة آخر (Decant أو Full Bottle)</span>
            </button>
          </div>

          {/* Stock & Featured Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#15070D] border border-[#D4AF37]/20 cursor-pointer hover:bg-[#1E0B13] transition-colors">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 rounded text-[#D4AF37] focus:ring-0 bg-[#0A0407] border-[#D4AF37]/30"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#FDFBF7]">
                  متوفر في المخزن (In Stock)
                </span>
                <span className="text-[10px] text-[#A69B92]">
                  عند إلغائه يظهر العطر كـ "نفذت الكمية"
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#15070D] border border-[#D4AF37]/20 cursor-pointer hover:bg-[#1E0B13] transition-colors">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#D4AF37] focus:ring-0 bg-[#0A0407] border-[#D4AF37]/30"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#FDFBF7]">
                  عطر مميز في الواجهة (Featured)
                </span>
                <span className="text-[10px] text-[#A69B92]">
                  يظهر في مقدمة المجموعة للعملاء
                </span>
              </div>
            </label>
          </div>

          {/* Progress Indicator */}
          {uploadProgressText && (
            <div className="p-3 rounded-xl bg-[#1E0B13] border border-[#D4AF37]/40 text-[#ECC870] text-xs flex items-center gap-2 animate-pulse">
              <UploadCloud size={16} />
              <span>{uploadProgressText}</span>
            </div>
          )}

          {/* Submit and Delete Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#D4AF37]/20">
            <button
              type="submit"
              disabled={submitting || isCompressing}
              className="flex-1 btn btn-gold py-3 text-xs flex items-center justify-center gap-2"
            >
              {submitting ? 'جاري الحفظ الفوري...' : isEditing ? 'حفظ التعديلات' : 'إضافة العطر للمتجر'}
            </button>

            {isEditing && (
              confirmDeleteMode ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="px-4 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all animate-pulse flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>تأكيد الحذف نهائياً</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteMode(false)}
                    className="px-3 py-3 rounded-full bg-[#15070D] hover:bg-[#1E0B13] text-[#D8CCC4] text-xs cursor-pointer transition-colors border border-[#D4AF37]/20"
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteMode(true)}
                  disabled={submitting}
                  className="px-5 py-3 rounded-full bg-[#6B1727]/30 hover:bg-[#6B1727]/50 text-red-200 border border-[#6B1727] text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>حذف العطر</span>
                </button>
              )
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
