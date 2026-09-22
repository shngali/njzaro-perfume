import { Language } from '../context/LanguageContext';
import { Perfume } from '../types';

/**
 * Comprehensive dictionary of perfume accords, ingredients, and olfactory notes
 * mapping from common English descriptors to Arabic, Kurdish Badini, and Kurdish Sorani.
 */
const NOTE_DICTIONARY: Record<string, { ar: string; badini: string; sorani: string; en: string }> = {
  // Woods & Resins
  oud: { ar: 'عود كمبودي فاخر', badini: 'عودێ گرانبها', sorani: 'عودی شاهانە', en: 'Precious Oud' },
  cambodian: { ar: 'كمبودي', badini: 'کەمبۆدی', sorani: 'کەمبۆدی', en: 'Cambodian' },
  woody: { ar: 'أخشاب عطرية', badini: 'دارێن بێهندار', sorani: 'دارە بۆندارەکان', en: 'Woody Notes' },
  wood: { ar: 'أخشاب نادرة', badini: 'دارێن دەگمەن', sorani: 'داری دەگمەن', en: 'Precious Woods' },
  cedar: { ar: 'خشب الأرز', badini: 'دارا ئەرزێ', sorani: 'داری ئەررز', en: 'Cedarwood' },
  cedarwood: { ar: 'خشب الأرز', badini: 'دارا ئەرزێ', sorani: 'داری ئەررز', en: 'Cedarwood' },
  sandalwood: { ar: 'خشب الصندل', badini: 'دارا سەندەل', sorani: 'داری سەندەل', en: 'Sandalwood' },
  patchouli: { ar: 'باتشولي إندونيسي', badini: 'پاچۆلی', sorani: 'پاچۆلی', en: 'Indonesian Patchouli' },
  vetiver: { ar: 'نجيل الهند (فيتيفر)', badini: 'ڤێتیڤێر', sorani: 'ڤێتیڤێر', en: 'Haitian Vetiver' },
  guaiac: { ar: 'خشب الغاياك', badini: 'دارا گایاک', sorani: 'داری گایاک', en: 'Guaiac Wood' },
  birch: { ar: 'خشب البتولا', badini: 'دارا بەتولا', sorani: 'داری بەتولا', en: 'Birch' },

  // Amber & Musks
  amber: { ar: 'عنبر دافئ', badini: 'عەنبەرێ گەرم', sorani: 'عەنبەری گەرم', en: 'Warm Amber' },
  musk: { ar: 'مسك نقي', badini: 'مسکا زەلال', sorani: 'میسکی پاک', en: 'Pure Musk' },
  musky: { ar: 'نفحات مسكية', badini: 'مسک', sorani: 'میسکی', en: 'Musky Accords' },
  'white musk': { ar: 'مسك أبيض', badini: 'مسکا سپی', sorani: 'میسکی سپی', en: 'White Musk' },
  ambergris: { ar: 'عنبر الحوت النادر', badini: 'عەنبەرێ حوتێ', sorani: 'عەنبەری نەهەنگ', en: 'Ambergris' },

  // Spices
  saffron: { ar: 'زعفران ملكي', badini: 'زەعفەرانێ شاهانە', sorani: 'زەعفەرانی شاهانە', en: 'Royal Saffron' },
  cardamom: { ar: 'هيل غواتيمالي', badini: 'هێل', sorani: 'هێلی سەوز', en: 'Guatemalan Cardamom' },
  cinnamon: { ar: 'قرفة سيلانية', badini: 'دارچین', sorani: 'دارچینی سێلانی', en: 'Ceylon Cinnamon' },
  pepper: { ar: 'فلفل أسود', badini: 'بیبەرا ڕەش', sorani: 'بیبەری ڕەش', en: 'Black Pepper' },
  'pink pepper': { ar: 'فلفل وردي', badini: 'بیبەرا پەمبەیی', sorani: 'بیبەری پەمەیی', en: 'Pink Pepper' },
  spices: { ar: 'توابل شرقية فاخرة', badini: 'بهاراتێن دەولەمەند', sorani: 'بەهاراتی دەوڵەمەند', en: 'Rich Spices' },
  spicy: { ar: 'توابل حارة ودافئة', badini: 'بهارات', sorani: 'بەهارات', en: 'Warm Spices' },
  'warm spicy': { ar: 'توابل دافئة', badini: 'بهاراتێن گەرم', sorani: 'بەهاراتی گەرم', en: 'Warm Spicy' },
  'fresh spicy': { ar: 'توابل منعشة', badini: 'بهاراتێن فێنک', sorani: 'بەهاراتی فێنک', en: 'Fresh Spicy' },
  nutmeg: { ar: 'جوزة الطيب', badini: 'جوزا بەهرێ', sorani: 'گوێزی هیندی بۆندار', en: 'Nutmeg' },
  clove: { ar: 'قرنفل', badini: 'مێخەک', sorani: 'مێخەک', en: 'Clove' },

  // Florals
  rose: { ar: 'ورد جوري دمشقي', badini: 'گولا سۆر یا دیمەشقی', sorani: 'گوڵی سووری دەمەشق', en: 'Damascena Rose' },
  jasmine: { ar: 'ياسمين سامباك', badini: 'یاسمینا سپی', sorani: 'یاسمینی سپی', en: 'Sambac Jasmine' },
  'white floral': { ar: 'زهور بيضاء نقية', badini: 'گولێن سپی', sorani: 'گوڵە سپییەکان', en: 'White Florals' },
  floral: { ar: 'أزهار نقية', badini: 'گولێن بهێندار', sorani: 'گوڵە بۆندارەکان', en: 'Floral Accords' },
  iris: { ar: 'زهرة السوسن الفلورنسية', badini: 'گولا سۆسنێ', sorani: 'گوڵی سووسن', en: 'Florentine Iris' },
  sakura: { ar: 'زهر الكرز (ساكورا)', badini: 'گولا ساکورا', sorani: 'گوڵی ساکورا', en: 'Cherry Blossom (Sakura)' },
  lavender: { ar: 'خزامى فرنسية', badini: 'لاڤێندەرێ فەرەنسی', sorani: 'لاڤاندەری فەڕەنسی', en: 'French Lavender' },
  tuberose: { ar: 'مسك الروم (توبيروز)', badini: 'توبیرۆز', sorani: 'تووبێڕۆز', en: 'Tuberose' },
  neroli: { ar: 'نيرولي (زهر البرتقال)', badini: 'نیرۆلی', sorani: 'نیرۆلی (گوڵی پرتەقاڵ)', en: 'Neroli' },
  violet: { ar: 'بنفسج', badini: 'وەنەوشە', sorani: 'بەنەوشە', en: 'Violet' },
  geranium: { ar: 'إبرة الراعي (جيرانيوم)', badini: 'جیرانیۆم', sorani: 'جیرانیۆم', en: 'Geranium' },
  orchid: { ar: 'سحلبية (أوركيد)', badini: 'ئۆرکید', sorani: 'ئۆرکید', en: 'Black Orchid' },

  // Citrus & Fruits
  bergamot: { ar: 'برغموت كالابريا', badini: 'بێرجامۆت', sorani: 'بێرجامۆت', en: 'Calabrian Bergamot' },
  citrus: { ar: 'حمضيات إيطالية منعشة', badini: 'ترشینێن فێنک', sorani: 'ترشەمەنی فێنک', en: 'Italian Citrus' },
  lemon: { ar: 'ليمون صقلي', badini: 'لیمۆنا فێنک', sorani: 'لیمۆی فێنک', en: 'Sicilian Lemon' },
  citron: { ar: 'ليمون عطري', badini: 'لیمۆنا بێهندار', sorani: 'لیمۆی بۆندار', en: 'Cedrat' },
  grapefruit: { ar: 'جريب فروت وردي', badini: 'گریپ فروت', sorani: 'گریپ فروت', en: 'Pink Grapefruit' },
  orange: { ar: 'برتقال دموي', badini: 'پرتەقالا شرین', sorani: 'پرتەقاڵ', en: 'Blood Orange' },
  mandarin: { ar: 'يوسفي ماندارين', badini: 'لالەنگی', sorani: 'لالەنگی', en: 'Mandarin' },
  'mandarin orange': { ar: 'يوسفي إيطالي', badini: 'لالەنگی', sorani: 'لالەنگی', en: 'Italian Mandarin' },
  fruity: { ar: 'فواكه استوائية ناعمة', badini: 'فێقیێ بێهندار', sorani: 'میوەی بۆندار', en: 'Fruity Accords' },
  raspberry: { ar: 'توت العليق الأحمر', badini: 'توویا سۆر', sorani: 'تووتڕڕک', en: 'Red Raspberry' },
  pear: { ar: 'كمثرى عصيرية', badini: 'هرمی', sorani: 'هەرمێ', en: 'Juicy Pear' },
  apple: { ar: 'تفاح أخضر مقرمش', badini: 'سێڤا کەسک', sorani: 'سێوی سەوز', en: 'Crisp Green Apple' },
  cacao: { ar: 'كاكاو غني', badini: 'کاکاو', sorani: 'کاکاو', en: 'Rich Cacao' },
  'black currant': { ar: 'الكشمش الأسود', badini: 'کشمشا ڕەش', sorani: 'کشمیشی ڕەش', en: 'Blackcurrant' },
  peach: { ar: 'دراق مخملي', badini: 'خۆخ', sorani: 'خۆخ', en: 'Velvety Peach' },

  // Gourmand & Sweet
  vanilla: { ar: 'فانيليا مدغشقر البوربون', badini: 'ڤانیلا ماداگاسکار', sorani: 'ڤانیلای ماداگاسکار', en: 'Madagascar Vanilla' },
  caramel: { ar: 'كراميل غني مدخن', badini: 'کارامێلا شرین', sorani: 'کارامێلی شیرین', en: 'Rich Caramel' },
  tonka: { ar: 'حبوب التونكا الفاخرة', badini: 'دەنکێن تۆنکا', sorani: 'تۆنکا بین', en: 'Tonka Bean' },
  'tonka bean': { ar: 'حبوب التونكا البرازيلية', badini: 'تۆنکا', sorani: 'تۆنکا', en: 'Tonka Bean' },
  sweet: { ar: 'لمسات سكرية فاخرة', badini: 'شیریناهییا نازک', sorani: 'شیرینی ناسک', en: 'Sweet Gourmand' },
  honey: { ar: 'عسل بري ذهبي', badini: 'هنگڤینێ زێڕین', sorani: 'هەنگوینی زێڕین', en: 'Golden Honey' },

  // Leather & Smoke & Earth
  leather: { ar: 'جلد إيطالي ملكي', badini: 'چەرمێ شاهانە', sorani: 'چەرمی شاهانە', en: 'Royal Tuscan Leather' },
  tobacco: { ar: 'أوراق التبغ الكوبي المعتق', badini: 'تووتنێ گرانبها', sorani: 'تووتنی کووبی', en: 'Rich Aged Tobacco' },
  smoky: { ar: 'بخور مدخن غامض', badini: 'دووکەل و بوخوور', sorani: 'دووکەڵ و بوخوور', en: 'Smoky Incense' },
  incense: { ar: 'بخور لبان عماني', badini: 'بوخوورا عومانێ', sorani: 'بوخووری عومانی', en: 'Omani Frankincense' },
  earthy: { ar: 'نفحات أرضية ندية', badini: 'ئەردی و سروشتی', sorani: 'خاکی و سروشتی', en: 'Earthy Mineral' },
  aromatic: { ar: 'أعشاب ونفحات أروماتية', badini: 'گیایێن ئەرۆماتیک', sorani: 'گیا ئەرۆماتیکەکان', en: 'Aromatic Botanicals' },
  powdery: { ar: 'لمسات بودرية مخملية', badini: 'پۆدەرا نازک', sorani: 'پۆدەری ناسک', en: 'Velvety Powdery' },
  fresh: { ar: 'انتعاش نقي متجدد', badini: 'فێنکاهییا زەلال', sorani: 'فێنکی پاک', en: 'Crisp Freshness' },
  'green accord': { ar: 'تناغم أوراق خضراء ندية', badini: 'پەلکێن کەسک یێن تەر', sorani: 'گەڵای سەوزی تەڕ', en: 'Dewy Green Accords' },
  green: { ar: 'أوراق خضراء منعشة', badini: 'کەسکاتییا فێنک', sorani: 'سەوزایی فێنک', en: 'Fresh Green' },
  marine: { ar: 'نسيم بحري منعش', badini: 'بایێ دەریایی', sorani: 'بای دەریایی', en: 'Marine Ozone' },
  aquatic: { ar: 'نفحات مائية ساحلية', badini: 'ئاڤی و فێنک', sorani: 'ئاوی و فێنک', en: 'Aquatic Breeze' },
};

/**
 * Normalizes and translates individual notes string into the target language.
 */
export function translatePerfumeNotes(notesString: string, lang: Language): string {
  if (!notesString || !notesString.trim()) return '';

  // Split by common delimiters (bullet, comma, Arabic comma, slash, dash)
  const delimiters = /[\s·,،\/\-]+/;
  const rawParts = notesString
    .split(/([·,،\/\-]|\sand\s)/i)
    .map((s) => s.trim())
    .filter((s) => s && !['·', ',', '،', '/', '-', 'and'].includes(s.toLowerCase()));

  if (lang === 'en') {
    return rawParts
      .map((part) => {
        const key = part.toLowerCase().trim();
        return NOTE_DICTIONARY[key]?.en || part;
      })
      .join(' · ');
  }

  const translatedParts = rawParts.map((part) => {
    const key = part.toLowerCase().trim();
    const entry = NOTE_DICTIONARY[key];
    if (entry) {
      return entry[lang] || entry.ar;
    }

    // Partial matching for multi-word phrases (e.g. "warm spicy" or "white floral")
    for (const [dictKey, dictVal] of Object.entries(NOTE_DICTIONARY)) {
      if (key.includes(dictKey)) {
        return dictVal[lang] || dictVal.ar;
      }
    }

    return part;
  });

  const separator = ' · ';
  return Array.from(new Set(translatedParts)).join(separator);
}

/**
 * Translates perfume categories into the active store language.
 */
export function translatePerfumeCategory(category: string, lang: Language): string {
  if (!category) return '';

  const catLower = category.toLowerCase().trim();

  const CATEGORY_MAP: Record<string, { ar: string; badini: string; sorani: string; en: string }> = {
    men: { ar: 'عطور رجالية', badini: 'عەترێن زەلامان', sorani: 'بۆنی پیاوان', en: "Men's Fragrances" },
    'for men': { ar: 'عطور رجالية', badini: 'عەترێن زەلامان', sorani: 'بۆنی پیاوان', en: "Men's Fragrances" },
    homme: { ar: 'عطور رجالية', badini: 'عەترێن زەلامان', sorani: 'بۆنی پیاوان', en: "Men's Fragrances" },
    women: { ar: 'عطور نسائية', badini: 'عەترێن ئافرەتان', sorani: 'بۆنی ژنان', en: "Women's Fragrances" },
    'women perfumes': { ar: 'عطور نسائية', badini: 'عەترێن ئافرەتان', sorani: 'بۆنی ژنان', en: "Women's Fragrances" },
    'for women': { ar: 'عطور نسائية', badini: 'عەترێن ئافرەتان', sorani: 'بۆنی ژنان', en: "Women's Fragrances" },
    femme: { ar: 'عطور نسائية', badini: 'عەترێن ئافرەتان', sorani: 'بۆنی ژنان', en: "Women's Fragrances" },
    unisex: { ar: 'عطور للجنسين', badini: 'بۆ هەردوو ڕەگەزان', sorani: 'بۆ هەردوو ڕەگەز', en: 'Unisex Fragrances' },
    niche: { ar: 'عطور نيش فاخرة', badini: 'عەترێن نیش یێن تایبەت', sorani: 'عەتری نیشی تایبەت', en: 'Niche Luxury' },
    sets: { ar: 'مجموعات وباقات الهدايا', badini: 'کۆمەڵە و دیاری', sorani: 'سێت و دیاری', en: 'Gift Sets' },
    'gift sets': { ar: 'مجموعات وباقات الهدايا', badini: 'کۆمەڵە و دیاری', sorani: 'سێت و دیاری', en: 'Gift Sets' },
    'ibrahim al qurashi': {
      ar: 'إبراهيم القرشي',
      badini: 'ئیبراهیم قورەیشی',
      sorani: 'ئیبراهیم قورەیشی',
      en: 'Ibrahim Al Qurashi',
    },
    rayhaan: { ar: 'ريحان', badini: 'رەیحان', sorani: 'ڕەیحان', en: 'Rayhaan' },
    assaf: { ar: 'عساف', badini: 'عەساف', sorani: 'عەساف', en: 'Assaf' },
    laverne: { ar: 'لافيرن', badini: 'لاڤێرن', sorani: 'لاڤێرن', en: 'Laverne' },
    stevano: { ar: 'ستيفانو', badini: 'ستیڤانۆ', sorani: 'ستیڤانۆ', en: 'Stevano' },
    iven: { ar: 'إيفين', badini: 'ئیڤین', sorani: 'ئیڤین', en: 'Iven' },
    'encre noire': { ar: 'انكر نوار لاليك', badini: 'ئەنکر نوار', sorani: 'ئەنکر نوار', en: 'Encre Noire Lalique' },
    samam: { ar: 'صمام', badini: 'سەمام', sorani: 'سەمام', en: 'Samam' },
  };

  const found = CATEGORY_MAP[catLower];
  if (found) {
    return found[lang] || found.ar;
  }

  return category;
}

/**
 * Translates perfume brand name into target language when appropriate.
 */
export function translatePerfumeBrand(brand: string, lang: Language): string {
  if (!brand) return '';
  const brandLower = brand.toLowerCase().trim();

  const BRAND_MAP: Record<string, { ar: string; badini: string; sorani: string; en: string }> = {
    'ibrahim al qurashi': {
      ar: 'إبراهيم القرشي',
      badini: 'ئیبراهیم قورەیشی',
      sorani: 'ئیبراهیم قورەیشی',
      en: 'Ibrahim Al Qurashi',
    },
    rayhaan: { ar: 'ريحان', badini: 'رەیحان', sorani: 'ڕەیحان', en: 'Rayhaan' },
    assaf: { ar: 'عساف', badini: 'عەساف', sorani: 'عەساف', en: 'Assaf' },
    laverne: { ar: 'لافيرن', badini: 'لاڤێرن', sorani: 'لاڤێرن', en: 'Laverne' },
    stevano: { ar: 'ستيفانو', badini: 'ستیڤانۆ', sorani: 'ستیڤانۆ', en: 'Stevano' },
    iven: { ar: 'إيفين', badini: 'ئیڤین', sorani: 'ئیڤین', en: 'Iven' },
    'encre noire': { ar: 'انكر نوار', badini: 'ئەنکر نوار', sorani: 'ئەنکر نوار', en: 'Encre Noire' },
    samam: { ar: 'صمام', badini: 'سەمام', sorani: 'سەمام', en: 'Samam' },
    'women perfumes': { ar: 'المجموعة النسائية', badini: 'کۆمەڵا ئافرەتان', sorani: 'کۆمەڵەی ژنان', en: "Women's Collection" },
  };

  const found = BRAND_MAP[brandLower];
  if (found) {
    return found[lang] || found.en;
  }

  return brand;
}

/**
 * Generates an evocative, culturally tuned description for the fragrance
 * based on its notes, brand, and category in the active language.
 */
export function getLocalizedPerfumeDescription(perfume: Perfume, lang: Language): string {
  // If user provided a specific manual description, check language:
  if (perfume.description && perfume.description.trim()) {
    return perfume.description;
  }

  const brandName = translatePerfumeBrand(perfume.brand, lang);
  const localizedNotes = translatePerfumeNotes(perfume.notes || '', lang);

  if (lang === 'ar') {
    return `توليفة عطرية ملكية وأخاذة من دار ${brandName}. تتألق بتناغم ساحر يجمع بين ${localizedNotes || 'أرقى المستخلصات العطرية والزيوت الطبيعية النادرة'}؛ لتمنحك هالة استثنائية من الفخامة بثبات يدوم لساعات طويلة وفوحان لا يُنسى.`;
  }

  if (lang === 'badini') {
    return `تێکەلەکا شاهانە و سەرنجڕاکێش ژ دەستێ دارا ${brandName}. بهاتیە دروستکرن ب هەماهەنگییا بێهنێن ${localizedNotes || 'پێکهاتە و زەیتێن سرۆشتی یێن گرانبها'}؛ دا کو بهێزترین و بلندترین مانا بێهنێ و دلسۆزییا سەرسوڕهێنەر د هەمی دەمان دا ب دەست ڤە بینیت.`;
  }

  if (lang === 'sorani') {
    return `پێکهاتەیەکی شاهانە و سەرنجڕاکێش لە براندی ${brandName}. بە هەماهەنگییەکی جوان لە نێوان ${localizedNotes || 'باشترین ماددەی سروشتی و زەیتی بۆنداری دەگمەن'} دروستکراوە؛ کە مانەوەیەکی زۆر بەهێز و بڵاوبوونەوەیەکی ئەفسوناوی بەردەوامت پێ دەبەخشێت.`;
  }

  // English fallback
  return `An extraordinary olfactory composition from the prestigious house of ${perfume.brand}. Crafted with masterfully balanced accords of ${perfume.notes || 'rare botanical extracts and precious aromatic oils'}, ensuring exceptional longevity and an unforgettable, enveloping sillage.`;
}

/**
 * Returns structured, localized olfactory pyramid (Top, Heart, Base notes)
 */
export function getLocalizedPyramid(perfume: Perfume, lang: Language) {
  const rawNotesList = perfume.notes
    ? perfume.notes
        .split(/[,،·/\-]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const rawTop = perfume.topNotes || rawNotesList.slice(0, 2).join(' · ') || 'Citrus, Bergamot, Pink Pepper';
  const rawHeart = perfume.heartNotes || rawNotesList.slice(2, 4).join(' · ') || 'Damascena Rose, Jasmine, Spices';
  const rawBase = perfume.baseNotes || rawNotesList.slice(4).join(' · ') || 'Cambodian Oud, Amber, White Musk';

  return {
    topNotes: translatePerfumeNotes(rawTop, lang),
    heartNotes: translatePerfumeNotes(rawHeart, lang),
    baseNotes: translatePerfumeNotes(rawBase, lang),
  };
}

/**
 * Translates unit volume text (e.g. 50 ml vs 50 مل)
 */
export function formatVolume(ml: number, lang: Language): string {
  if (lang === 'en') {
    return `${ml} ml`;
  }
  return `${ml} مل`;
}

/**
 * Luxury olfactory specs (Concentration, Longevity, Sillage)
 */
export function getLocalizedSpecs(perfume: Perfume, lang: Language) {
  const isEn = lang === 'en';
  const isBadini = lang === 'badini';
  const isSorani = lang === 'sorani';

  return {
    concentration: isEn
      ? perfume.concentration || 'Eau de Parfum (Extrait)'
      : isBadini
      ? 'ئاڤێ عەترێ خەست (Eau de Parfum)'
      : isSorani
      ? 'ئاوی عەتری خەست (Eau de Parfum)'
      : 'ماء عطر مركز (Eau de Parfum)',
    longevity: isEn
      ? '16 - 24 Hours on fabric'
      : isBadini
      ? 'مانەڤەیا 16 - 24 دەمژمێران'
      : isSorani
      ? 'مانەوەی بەهێز 16 بۆ 24 کاتژمێر'
      : 'ثبات فائق 16 - 24 ساعة',
    sillage: isEn
      ? 'Enveloping & Radiant'
      : isBadini
      ? 'بێهنڤەدانەکا بلند و سەرنجڕاکێش'
      : isSorani
      ? 'بڵاوبوونەوەیەکی ئەفسوناوی'
      : 'فوحان واسع وجذاب',
    authenticity: isEn
      ? '100% Original Sealed Flacon'
      : isBadini
      ? '100% ئەسڵی و باوەڕپێکری یێ دەرگەهـ گرتی'
      : isSorani
      ? '100% ئەسڵی و مۆركراوی دڵنیا'
      : 'أصلي 100% مفحوص برمز الدفعة',
  };
}
