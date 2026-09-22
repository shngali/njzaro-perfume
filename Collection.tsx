import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from './ProductCard';
import { AdminProductModal } from './AdminProductModal';
import { Perfume } from '../types';
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  Plus,
  X,
  ChevronDown,
  Filter,
} from 'lucide-react';

export function Collection() {
  const { t, language } = useLanguage();
  const { perfumes, loading } = useProducts();
  const { isAdmin, isOwner } = useAuth();
  const {
    activeCategoryFilter,
    setActiveCategoryFilter,
    activeBrandFilter,
    setActiveBrandFilter,
  } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'discount' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [visibleCount, setVisibleCount] = useState(12);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Sync external filter triggers (e.g. from Header or CategoriesSection)
  useEffect(() => {
    if (activeCategoryFilter !== null) {
      setActiveCategoryFilter(null);
    }
  }, [activeCategoryFilter, setActiveCategoryFilter]);

  useEffect(() => {
    if (activeBrandFilter !== null) {
      setSelectedBrand(activeBrandFilter);
      setActiveBrandFilter(null);
    }
  }, [activeBrandFilter, setActiveBrandFilter]);

  const [currentCategory, setCurrentCategory] = useState('All');

  const categories = useMemo(() => {
    return [
      { id: 'All', label: t.all ? `${t.all} (${t.allBrands || 'All'})` : 'All Fragrances' },
      { id: 'Men', label: t.navMen || 'Men' },
      { id: 'Women', label: t.navWomen || 'Women' },
      { id: 'Unisex', label: t.navUnisex || 'Unisex' },
      { id: 'Arabian', label: t.navArabian || 'Arabian & Niche' },
      { id: 'Offers', label: t.navOffers || 'Special Offers', isSale: true },
    ];
  }, [t]);

  // Extract list of all unique brands
  const allBrands = useMemo(() => {
    const set = new Set<string>();
    perfumes.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return ['All', ...Array.from(set).sort()];
  }, [perfumes]);

  // Filtered perfumes
  const filteredPerfumes = useMemo(() => {
    let list = [...perfumes];

    // Category filter
    if (currentCategory === 'Offers') {
      list = list.filter(
        (p) =>
          (p.discountPercent && p.discountPercent > 0) ||
          p.sizes.some((s) => s.originalPrice && s.originalPrice > s.price)
      );
    } else if (currentCategory !== 'All') {
      list = list.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const target = currentCategory.toLowerCase();
        return cat.includes(target) || (p.gender && p.gender.toLowerCase() === target);
      });
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      list = list.filter((p) => p.brand === selectedBrand);
    }

    // Price range filter
    if (selectedPriceRange === 'under-25k') {
      list = list.filter((p) => (p.sizes[0]?.price || 0) < 25000);
    } else if (selectedPriceRange === '25k-50k') {
      list = list.filter((p) => {
        const pr = p.sizes[0]?.price || 0;
        return pr >= 25000 && pr <= 50000;
      });
    } else if (selectedPriceRange === 'over-50k') {
      list = list.filter((p) => (p.sizes[0]?.price || 0) > 50000);
    }

    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.notes && p.notes.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'discount') {
      list.sort((a, b) => {
        const aHasDisc =
          (a.discountPercent && a.discountPercent > 0) ||
          a.sizes.some((s) => s.originalPrice && s.originalPrice > s.price);
        const bHasDisc =
          (b.discountPercent && b.discountPercent > 0) ||
          b.sizes.some((s) => s.originalPrice && s.originalPrice > s.price);
        if (aHasDisc && !bHasDisc) return -1;
        if (!aHasDisc && bHasDisc) return 1;
        return 0;
      });
    } else if (sortBy === 'featured') {
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.sizes[0]?.price || 0) - (b.sizes[0]?.price || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.sizes[0]?.price || 0) - (a.sizes[0]?.price || 0));
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [perfumes, currentCategory, selectedBrand, selectedPriceRange, searchTerm, sortBy]);

  const shownPerfumes = filteredPerfumes.slice(0, visibleCount);
  const isPrivileged = isAdmin || isOwner;

  const resetAllFilters = () => {
    setCurrentCategory('All');
    setSelectedBrand('All');
    setSelectedPriceRange('all');
    setSearchTerm('');
    setSortBy('featured');
    setVisibleCount(12);
  };

  const hasActiveFilters =
    currentCategory !== 'All' ||
    selectedBrand !== 'All' ||
    selectedPriceRange !== 'all' ||
    searchTerm !== '';

  return (
    <section id="shop" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Anchor for both #shop and #collection */}
      <div id="collection" className="relative -top-28" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#ECC870] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
          <Sparkles size={13} className="text-[#D4AF37]" />
          <span>{t.catalogEyebrow}</span>
        </div>

        <h2 className="serif text-3xl sm:text-5xl font-bold text-[#FDFBF7] mb-3">
          {t.catalogTitle} {t.catalogTitleEm && <span className="text-[#ECC870] italic">{t.catalogTitleEm}</span>}
        </h2>

        <p className="text-sm sm:text-base text-[#D6CEC4] font-light max-w-xl mx-auto leading-relaxed">
          {t.catalogDesc}
        </p>

        {isPrivileged && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsAddingNew(true)}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F5DE88] via-[#D4AF37] to-[#A67C1E] text-[#0A0407] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_16px_rgba(212,175,55,0.3)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus size={15} className="stroke-[2.5]" />
              <span>{t.addNewFragrance || 'Add New Fragrance'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Modern Filter System */}
      <div className="space-y-5 mb-10">
        {/* Row 1: Category Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCurrentCategory(cat.id);
                  setVisibleCount(12);
                }}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#F5DE88] via-[#D4AF37] to-[#A67C1E] text-[#0A0407] font-bold border-[#FFE79E]/40 shadow-[0_2px_16px_rgba(212,175,55,0.35)]'
                    : cat.isSale
                    ? 'bg-[#8B1E30]/25 text-[#F5DE88] border-[#8B1E30]/40 hover:bg-[#8B1E30]/40'
                    : 'bg-[#180811] text-[#D8CCC4] border-[#D4AF37]/25 hover:border-[#D4AF37] hover:text-[#ECC870]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Row 2: Secondary Filters (Search, Brand, Price, Sort) */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[#15070D] border border-[#D4AF37]/25 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Search Field */}
          <div className="relative">
            <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
            <input
              type="text"
              placeholder={t.filterByNameOrNotes || t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(12);
              }}
              className="w-full bg-[#1E0A14] border border-[#D4AF37]/25 focus:border-[#D4AF37] rounded-xl ps-9 pe-8 py-2.5 text-xs text-[#FDFBF7] placeholder-[#A69B92] outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[#A69B92] hover:text-[#ECC870]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Brand Filter */}
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setVisibleCount(12);
              }}
              aria-label="Filter by brand"
              className="w-full appearance-none bg-[#1E0A14] border border-[#D4AF37]/25 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-[#FDFBF7] outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#1E0A14] text-[#FDFBF7]">{t.allBrands || 'All Brands'}</option>
              {allBrands.filter((b) => b !== 'All').map((b) => (
                <option key={b} value={b} className="bg-[#1E0A14] text-[#FDFBF7]">{b}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute end-3 top-1/2 -translate-y-1/2 text-[#D4AF37]/80 pointer-events-none" />
          </div>

          {/* Price Range Filter */}
          <div className="relative">
            <select
              value={selectedPriceRange}
              onChange={(e) => {
                setSelectedPriceRange(e.target.value);
                setVisibleCount(12);
              }}
              aria-label="Filter by price range"
              className="w-full appearance-none bg-[#1E0A14] border border-[#D4AF37]/25 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-[#FDFBF7] outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#1E0A14] text-[#FDFBF7]">{t.allPriceRanges || 'All Prices'}</option>
              <option value="under-25k" className="bg-[#1E0A14] text-[#FDFBF7]">{t.under25k || 'Under 25,000 IQD'}</option>
              <option value="25k-50k" className="bg-[#1E0A14] text-[#FDFBF7]">{t.range25k50k || '25,000 - 50,000 IQD'}</option>
              <option value="over-50k" className="bg-[#1E0A14] text-[#FDFBF7]">{t.over50k || 'Over 50,000 IQD'}</option>
            </select>
            <ChevronDown size={14} className="absolute end-3 top-1/2 -translate-y-1/2 text-[#D4AF37]/80 pointer-events-none" />
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort products"
              className="w-full appearance-none bg-[#1E0A14] border border-[#D4AF37]/25 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-[#FDFBF7] outline-none cursor-pointer"
            >
              <option value="featured" className="bg-[#1E0A14] text-[#FDFBF7]">{t.sortFeatured}</option>
              <option value="discount" className="bg-[#1E0A14] text-[#FDFBF7]">{t.sortDiscount}</option>
              <option value="price-asc" className="bg-[#1E0A14] text-[#FDFBF7]">{t.sortPriceAsc}</option>
              <option value="price-desc" className="bg-[#1E0A14] text-[#FDFBF7]">{t.sortPriceDesc}</option>
              <option value="name-asc" className="bg-[#1E0A14] text-[#FDFBF7]">{t.sortNameAsc}</option>
            </select>
            <ArrowUpDown size={14} className="absolute end-3 top-1/2 -translate-y-1/2 text-[#D4AF37]/80 pointer-events-none" />
          </div>
        </div>

        {/* Filter Results & Reset bar */}
        <div className="flex items-center justify-between text-xs text-[#D8CCC4] px-1">
          <div>
            <span>
              {language === 'en'
                ? `Showing ${filteredPerfumes.length} ${filteredPerfumes.length === 1 ? 'fragrance' : 'fragrances'}`
                : language === 'badini'
                ? `پیشاندانا ${filteredPerfumes.length} عەتران`
                : language === 'sorani'
                ? `پیشاندانی ${filteredPerfumes.length} بۆن`
                : `عرض ${filteredPerfumes.length} عطور`}
            </span>
            {selectedBrand !== 'All' && <span className="font-semibold text-[#ECC870]"> • {selectedBrand}</span>}
            {currentCategory !== 'All' && <span className="font-semibold text-[#ECC870]"> • {currentCategory}</span>}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-[#ECC870] hover:underline font-bold cursor-pointer"
            >
              {t.clearAll || t.resetFilters}
            </button>
          )}
        </div>
      </div>

      {/* Catalog Grid */}
      {shownPerfumes.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#15070D] border border-[#D4AF37]/25 p-8">
          <div className="w-12 h-12 rounded-full bg-[#1E0A14] border border-[#D4AF37]/35 text-[#ECC870] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Search size={20} />
          </div>
          <h3 className="serif text-xl font-bold text-[#FDFBF7] mb-2">
            {t.noResultsTitle}
          </h3>
          <p className="text-xs text-[#D8CCC4] max-w-sm mx-auto mb-6">
            {t.noResultsDesc}
          </p>
          <button
            onClick={resetAllFilters}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F5DE88] to-[#D4AF37] text-[#0A0407] text-xs uppercase font-bold hover:brightness-110 transition-colors cursor-pointer"
          >
            {t.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {shownPerfumes.map((p, i) => (
            <ProductCard key={p.dbId || p.id} perfume={p} index={i} />
          ))}
        </div>
      )}

      {/* Load More Pagination */}
      {visibleCount < filteredPerfumes.length && (
        <div className="mt-16 text-center flex flex-col items-center">
          <div className="text-xs text-[#D8CCC4] mb-2 font-light">
            {t.showingCount
              ? t.showingCount.replace('{shown}', String(shownPerfumes.length)).replace('{total}', String(filteredPerfumes.length))
              : `${shownPerfumes.length} / ${filteredPerfumes.length}`}
          </div>
          <div className="w-48 h-1 bg-[#1E0A14] rounded-full overflow-hidden mb-5 border border-[#D4AF37]/20">
            <div
              className="h-full bg-gradient-to-r from-[#ECC870] to-[#D4AF37] transition-all duration-300"
              style={{ width: `${(shownPerfumes.length / filteredPerfumes.length) * 100}%` }}
            />
          </div>
          <button
            onClick={() => setVisibleCount((v) => v + 12)}
            className="px-8 py-3.5 rounded-full border border-[#D4AF37]/35 bg-[#180811] hover:bg-[#240A18] hover:border-[#D4AF37] text-[#FDFBF7] hover:text-[#ECC870] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
          >
            {t.showMore}
          </button>
        </div>
      )}

      {isAddingNew && <AdminProductModal onClose={() => setIsAddingNew(false)} />}
    </section>
  );
}
