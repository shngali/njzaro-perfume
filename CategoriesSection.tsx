import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ArrowUpRight } from 'lucide-react';

export function CategoriesSection() {
  const { t, language, direction } = useLanguage();
  const { setActiveCategoryFilter } = useCart();
  const isRTL = direction === 'rtl';

  const categories = [
    {
      id: 'Men',
      title: t.catMenTitle || (language === 'en' ? "Men's Fragrances" : 'عطور رجالية'),
      subtitle: t.catMenSub || (language === 'en' ? 'Bold, Woody & Aromatic' : 'أخشاب، توابل، وأروما جذابة'),
      img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
      filter: 'Men',
    },
    {
      id: 'Women',
      title: t.catWomenTitle || (language === 'en' ? "Women's Fragrances" : 'عطور نسائية'),
      subtitle: t.catWomenSub || (language === 'en' ? 'Floral, Sweet & Elegant' : 'زهور، فانيلا، وأنوثة ساحرة'),
      img: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80',
      filter: 'Women',
    },
    {
      id: 'Unisex',
      title: t.catUnisexTitle || (language === 'en' ? 'Unisex & Rare' : 'عطور للجنسين'),
      subtitle: t.catUnisexSub || (language === 'en' ? 'Complex & Universal' : 'نوتات عصرية تناسب الجميع'),
      img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
      filter: 'Unisex',
    },
    {
      id: 'Arabian',
      title: t.catArabianTitle || (language === 'en' ? 'Arabian & Bukhoor' : 'عطور شرقية وبخور'),
      subtitle: t.catArabianSub || (language === 'en' ? 'Pure Oud, Amber & Musk' : 'دهن العود، المسك، والعنبر'),
      img: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80',
      filter: 'Arabian',
    },
    {
      id: 'Designer',
      title: t.catDesignerTitle || (language === 'en' ? 'Designer Icons' : 'عطور ديزاينر عالمية'),
      subtitle: t.catDesignerSub || (language === 'en' ? 'Dior, YSL, Chanel, Versace' : 'أشهر الإبداعات الفرنسية والإيطالية'),
      img: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
      filter: 'Designer',
    },
    {
      id: 'Niche',
      title: t.catNicheTitle || (language === 'en' ? 'Haute Niche Parfums' : 'عطور النيش الحصرية'),
      subtitle: t.catNicheSub || (language === 'en' ? 'Artisanal & Limited Blends' : 'تركيبات فنية محدودة ونادرة'),
      img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
      filter: 'Niche',
    },
  ];

  const handleCategorySelect = (filterValue: string) => {
    setActiveCategoryFilter(filterValue);
    const el = document.getElementById('shop') || document.getElementById('collection');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categories" className="py-14 sm:py-18 lg:py-24 bg-[#0A0407] border-b border-[#D4AF37]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3 sm:gap-4">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.24em] font-bold text-[#D4AF37] block mb-1 sm:mb-2">
              {t.curatedSelections || (language === 'en' ? 'Curated Selections' : 'تصنيفات العطور المختارة')}
            </span>
            <h2 className="serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FDFBF7]">
              {t.shopByCategory || (language === 'en' ? 'Shop by Category' : 'تسوق حسب التصنيف')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#D8CCC4] max-w-md font-light leading-relaxed">
            {t.categoryDesc || (language === 'en'
              ? 'Find your next olfactory masterpiece categorized by occasion, gender, and fragrance family.'
              : 'اختر عطرك القادم حسب المناسبة، الطابع الشخصي، أو العائلة العطرية المفضلة لديك.')}
          </p>
        </div>

        {/* 6 Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat.filter)}
              className="group relative h-60 sm:h-72 lg:h-80 rounded-3xl overflow-hidden cursor-pointer border border-[#D4AF37]/25 bg-[#15070D] shadow-[0_10px_30px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-[#D4AF37]/70 hover:shadow-[0_15px_35px_rgba(212,175,55,0.18),0_0_20px_rgba(107,23,39,0.25)] hover:-translate-y-1"
            >
              {/* Background Image with Zoom */}
              <img
                src={cat.img}
                alt={cat.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 brightness-90 group-hover:brightness-95"
              />

              {/* Minimal Velvet Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0407] via-[#0A0407]/45 to-transparent transition-opacity duration-300 group-hover:from-[#0A0407]/95" />

              {/* Card Content */}
              <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between text-white z-10">
                <div className="flex justify-end">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#18090F]/80 backdrop-blur-md border border-[#D4AF37]/45 flex items-center justify-center text-[#ECC870] transition-all duration-300 group-hover:rotate-45 group-hover:bg-gradient-to-r group-hover:from-[#F5DE88] group-hover:to-[#D4AF37] group-hover:text-[#0A0407] shadow-sm">
                    <ArrowUpRight size={17} />
                  </div>
                </div>

                <div>
                  <h3 className="serif text-xl sm:text-2xl font-bold text-[#FDFBF7] mb-1 group-hover:text-[#ECC870] transition-colors drop-shadow-sm">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#D8CCC4] font-light">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
