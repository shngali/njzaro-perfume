import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en' | 'badini' | 'sorani';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  direction: 'rtl' | 'ltr';
  flag: string;
}

export const LANGUAGES: Record<Language, LanguageInfo> = {
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇮🇶',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇬🇧',
  },
  badini: {
    code: 'badini',
    name: 'Kurdish (Badini)',
    nativeName: 'کوردی (بادینی)',
    direction: 'rtl',
    flag: '☀️',
  },
  sorani: {
    code: 'sorani',
    name: 'Kurdish (Sorani)',
    nativeName: 'کوردی (سۆرانی)',
    direction: 'rtl',
    flag: '☀️',
  },
};

export const translations = {
  ar: {
    // Header & Nav
    navHome: 'الرئيسية',
    navCollection: 'المجموعة',
    navMaison: 'عن الدار',
    navReviews: 'آراء العملاء',
    navBoutique: 'الموقع والتواصل',
    hauteParfumerie: 'عطور راقية وحصرية',
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    owner: 'المالك',
    admin: 'المشرف',
    dashboard: 'لوحة التحكم',
    openDashboard: 'لوحة تحكم المسؤول',
    shoppingBag: 'الحقيبة',
    member: 'عضو',
    duhokOpenDaily: 'دهوك، إقليم كردستان · مفتوح يومياً',
    viewBag: 'عرض الحقيبة',

    // Announcement
    announcementDefault: '✨ خصم خاص بمناسبة الافتتاح 20% على باقة إبراهيم القرشي لجميع المحافظات | توصيل سريع',
    closeAnnouncement: 'إغلاق الإعلان',

    // Hero
    heroEyebrow: 'مجموعة إبراهيم القرشي والعطور النادرة',
    heroTitlePrefix: 'عطور',
    heroTitleSuffix: 'NJZARO',
    heroDescription: '"مجموعة خاصة ونادرة من أرقى عطور العالم — مختارة بعناية فائقة، مفحوصة بدقة برمز الدفعة، ومقدمة لمن يختارون التميز."',
    exploreFragrances: 'استكشف 48+ عطراً',
    maisonStory: 'قصة الدار',
    authentic100: 'أصلي 100%',
    authenticDesc: 'مفحوص برمز الدفعة (Batch Code)',
    expressDelivery: 'توصيل سريع لكافة العراق',
    deliveryDesc: 'دهوك، أربيل، بغداد وجميع المحافظات',
    decantsBottles: 'عينات وزجاجات كاملة',
    decantsDesc: '10 مل، 20 مل وزجاجات أصلية',
    instantWhatsApp: 'تواصل فوري واتساب',
    whatsAppDesc: 'استشارات واقتراحات مباشرة',

    // Collection
    catalogEyebrow: 'الكتالوج المختار',
    catalogTitle: 'عطور تخلّد',
    catalogTitleEm: 'الذكريات',
    catalogDesc: 'اختر زجاجتك الأصلية أو عينات الدكانت بأسعار شفافة بالدينار العراقي. كل عبوة أصلية ومحفوظة بدرجة حرارة مثالية.',
    addNewFragrance: 'إضافة عطر جديد',
    searchPlaceholder: 'ابحث عن عطر، ماركة، أو نوتات عطرية (عود، عنبر، فانيلا)...',
    sortBy: 'ترتيب حسب:',
    sortFeatured: 'المختارات المميزة',
    sortDiscount: 'العروض والتخفيضات الخاصة',
    sortPriceAsc: 'السعر: من الأقل للأعلى',
    sortPriceDesc: 'السعر: من الأعلى للأقل',
    sortNameAsc: 'الاسم: أ إلى ي',
    brandsAndCategories: 'التصنيفات والماركات',
    allBrands: 'الكل',
    all: 'الكل',
    showMore: 'عرض المزيد من العطور',
    showingCount: 'عرض {shown} من أصل {total} عطر',
    noResultsTitle: 'لم يتم العثور على عطور تطابق بحثك',
    noResultsDesc: 'جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً من القائمة أعلاه.',
    resetFilters: 'إعادة ضبط التصفية',

    // Product Card
    outOfStock: 'نفدت الكمية',
    inStock: 'متوفر',
    newBadge: 'جديد',
    priceLabel: 'السعر',
    currency: 'د.ع',
    addToBag: 'أضف للحقيبة',
    addedToBag: 'تمت الإضافة',
    orderOnWhatsApp: 'طلب فوري عبر واتساب',
    clickToAdd: 'انقر لإضافة العطر للحقيبة',
    editFragrance: 'تعديل العطر',
    deleteFragrance: 'حذف العطر',
    confirmDeletePrompt: 'تأكيد الحذف؟',
    cancel: 'إلغاء',

    // Cart Drawer
    bagTitle: 'حقيبة التسوق الخاصة بك',
    bagEmptyTitle: 'حقيبتك فارغة حالياً',
    bagEmptyDesc: 'اكتشف مجموعتنا الحصرية من عطور إبراهيم القرشي وعينات النيش الفاخرة.',
    exploreCollectionBtn: 'استكشف المجموعة',
    totalAmount: 'المجموع الإجمالي',
    fullNamePlaceholder: 'الاسم الكامل *',
    cityLabel: 'المدينة / المحافظة',
    phonePlaceholder: 'رقم الهاتف *',
    addressPlaceholder: 'العنوان بالتفصيل / ملاحظات التوصيل *',
    sendOrderWhatsApp: 'إرسال الطلب عبر واتساب',
    redirectingWhatsApp: 'جاري تحويلك إلى واتساب مع تفاصيل طلبك...',
    codBadge: 'الدفع عند الاستلام متوفر في كافة مدن ومحافظات العراق',
    pleaseEnterName: 'يرجى إدخال الاسم الكامل.',
    pleaseEnterPhone: 'يرجى إدخال رقم الهاتف.',

    // About
    aboutEyebrow: 'إرث وهوية الدار',
    aboutTitle: 'العطر ذاكرةٌ حُبِسَت في',
    aboutTitleEm: 'زجاجة.',
    aboutP1: 'بدأت NJZARO كشغف نقي بالفخامة الشرقية والعطور الراقية — وُجدت لمن يؤمنون بأن العطر توقيع شخصي يعبّر عن الهيبة والأناقة والتفرّد.',
    aboutP2: 'كل زجاجة من إبراهيم القرشي وعينات الدكانت في مجموعتنا تخضع لفحص دقيق لرمز الدفعة وسلامة التخزين، وتُسلّم بنفس العناية والتقدير التي نتمناها لعطورنا الخاصة.',
    statFragrances: '48+ عطر',
    statFragrancesLabel: 'تشكيلة مختارة',
    statAuthentic: '100% أصلي',
    statAuthenticLabel: 'ضمان التوثيق',
    statRating: '4.9★',
    statRatingLabel: 'تقييم الزبائن',

    // Reviews
    reviewsEyebrow: 'تجارب العملاء',
    reviewsTitle: 'موثوق من قِبل عشاق',
    reviewsTitleEm: 'الفخامة والعطور',
    reviewsSubtitle: 'انطباعات وتجارب حقيقية من عملائنا في دهوك وجميع محافظات العراق.',
    writeReview: 'اكتب تقييمك',
    closeForm: 'إغلاق النموذج',
    shareExperience: 'شاركنا تجربتك العطرية',
    shareExperienceSub: 'رأيك يهمنا ويسهم في مساعدة محبي العطور الآخرين.',
    yourName: 'اسمك الكامل',
    reviewPlaceholder: 'تحدث عن ثبات العطر، الفوحان، أو سرعة التوصيل...',
    submitReview: 'نشر التقييم',
    submitting: 'جاري النشر...',
    reviewSuccess: 'شكراً لك! تم نشر تقييمك بنجاح.',
    verifiedClient: 'عميل موثّق',

    // Footer
    footerDesc: 'مجموعة مختارة بعناية من عطور إبراهيم القرشي والعطور الشرقية والنيش، موثقة ومحفوظة بعناية لتصل لجميع محافظات العراق.',
    boutiqueLocation: 'موقع المعرض',
    boutiqueAddress: 'دهوك، إقليم كردستان',
    boutiqueSub: 'العراق · مركز العطور الفاخرة',
    openingHours: 'ساعات العمل',
    hoursDaily: 'مفتوح يومياً: 10:00 صباحاً – 12:00 منتصف الليل',
    customerConcierge: 'خدمة العملاء والطلب المباشر',
    conciergeDesc: 'هل لديك استفسار عن نوتة عطرية أو توفر عبوة معينة؟ تواصل مع فريقنا مباشرة عبر الهاتف أو واتساب.',
    allRightsReserved: '© 2026 NJZARO Perfume. جميع الحقوق محفوظة.',
    curatedWithLove: 'صُنعت بحرفية وعناية',

    // Auth Modal
    privateAccess: 'عضوية الزبائن المميزين',
    welcomeToNjzaro: 'أهلاً بك في NJZARO',
    authModalDesc: 'سجّل الدخول لحفظ عطرك المفضل، وتتبع طلباتك السابقة، واستلام إشعارات العطور النادرة عند توفرها.',
    continueWithGoogle: 'المتابعة بواسطة Google',
    continueAsGuest: 'المتابعة كزائر',

    // Switcher
    language: 'اللغة',
    selectLanguage: 'اختر اللغة',

    // Nav & General
    navShop: 'المتجر',
    navMen: 'عطور رجالية',
    navWomen: 'عطور نسائية',
    navUnisex: 'عطور للجنسين',
    navArabian: 'عطور شرقية ونيش',
    navBrands: 'الماركات العالمية',
    navNewArrivals: 'وصل حديثاً',
    navBestSellers: 'الأكثر مبيعاً',
    navOffers: 'العروض الخاصة',
    navContact: 'الفرع والتواصل',
    wishlist: 'المفضلة',
    activeAdmin: 'مشرف نشط',
    tapToOpenDashboard: 'انقر لفتح لوحة التحكم',

    // Categories Section
    curatedSelections: 'تصنيفات العطور المختارة',
    shopByCategory: 'تسوق حسب التصنيف',
    categoryDesc: 'اختر عطرك القادم حسب المناسبة، الطابع الشخصي، أو العائلة العطرية المفضلة لديك.',
    catMenTitle: 'عطور رجالية',
    catMenSub: 'أخشاب، توابل، وأروما جذابة',
    catWomenTitle: 'عطور نسائية',
    catWomenSub: 'زهور، فانيلا، وأنوثة ساحرة',
    catUnisexTitle: 'عطور للجنسين',
    catUnisexSub: 'نوتات عصرية تناسب الجميع',
    catArabianTitle: 'عطور شرقية وبخور',
    catArabianSub: 'دهن العود، المسك، والعنبر',
    catDesignerTitle: 'عطور ديزاينر عالمية',
    catDesignerSub: 'أشهر الإبداعات الفرنسية والإيطالية',
    catNicheTitle: 'عطور النيش الحصرية',
    catNicheSub: 'تركيبات فنية محدودة ونادرة',

    // Brands Section
    renownedPerfumeHouses: 'دور العطور العالمية',
    explorePrestigiousBrands: 'استكشف الماركات العالمية',
    brandsSectionDesc: 'اكتشف إبداعات أصلية من كبرى دور العطور الشرقية المرموقة وبيوت الأزياء الفرنسية.',
    viewAllBrands: 'استعراض كافة العطور في المجموعة',

    // Product Card & Detail
    bestSellerBadge: 'الأكثر مبيعاً',
    decantBadge: 'ديكانت',
    quickView: 'نظرة سريعة',
    addToWishlist: 'إضافة للمفضلة',
    buyNow: 'شراء فوري',
    orderViaWhatsApp: 'طلب عبر واتساب',
    fragrancePyramid: 'الهرم العطري والمكونات',
    topNotes: 'قمة العطر',
    heartNotes: 'قلب العطر',
    baseNotes: 'قاعدة العطر',
    selectVolume: 'اختر حجم العبوة / الديكانت:',
    originalSealedGuarantee: 'أصلي 100% زجاجات مختومة وعينات ديكانت مقسمة يدوياً',
    filterByNameOrNotes: 'بحث بالاسم أو المكونات...',
    allPriceRanges: 'جميع الأسعار',
    under25k: 'أقل من 25,000 د.ع',
    range25k50k: '25,000 - 50,000 د.ع',
    over50k: 'أكثر من 50,000 د.ع',
    saveAmount: 'وفر',
    reviewsCount: 'تقييم',
    quantity: 'الكمية',

    // Cart & Delivery
    freeDeliveryUnlocked: '🎉 مبروك! حصلت على توصيل مجاني!',
    addMoreForFreeDelivery: 'أضف {amount} د.ع للحصول على توصيل مجاني',
    proceedToCheckout: 'متابعة إتمام الطلب',
    deliveryFeeLabel: 'التوصيل',
    free: 'مجاني',
    item: 'عطر',
    items: 'عطور',

    // Checkout Modal
    checkoutTitle: 'إتمام الطلب',
    checkoutSubtitle: 'توصيل لكافة محافظات العراق · الدفع عند الاستلام',
    governorate: 'المدينة / المحافظة',
    detailedAddress: 'العنوان بالتفصيل',
    notesOptional: 'ملاحظات إضافية أو وقت التوصيل المفضل (اختياري)',
    cashOnDelivery: 'الدفع عند الاستلام',
    cashOnDeliveryDesc: 'ادفع بأمان عند وصول العطر إلى باب منزلك واستلامك للطلب.',
    orderSummary: 'ملخص الطلب',
    subtotal: 'المجموع الجزئي',
    total: 'المجموع الإجمالي',
    completeOrderOnWhatsApp: 'تأكيد وإرسال الطلب عبر واتساب',
    orderSuccessTitle: 'شكراً لك! تم استلام طلبك بنجاح',
    orderSuccessDesc: 'تم تحويل فاتورتك وتفاصيل طلبك إلى واتساب. سيتواصل معك فريقنا قريباً لترتيب موعد التوصيل.',
    orderSuccessNote: 'سنرسل لك رمز التتبع بمجرد شحن العبوة.',
    closeBtn: 'إغلاق',

    // Footer
    trustAuthentic: 'أصالة مضمونة 100%',
    trustAuthenticSub: 'عطور وماركات أصلية مختومة',
    trustDecants: 'تقسيم ديكانت معقم',
    trustDecantsSub: 'عينات مجربة بزجاج طبي فاخر',
    trustDelivery: 'توصيل سريع لكل العراق',
    trustDeliverySub: 'كافة المحافظات خلال 24-48 ساعة',
    trustConcierge: 'مستشار عطري خاص',
    trustConciergeSub: 'استشارات واقتراحات عبر واتساب',
    navigation: 'روابط سريعة',
    boutiqueVisit: 'زيارة الفرع',
    boutiqueAddressFull: 'دهوك، إقليم كردستان، العراق · المركز التجاري',
    openingHoursFull: 'مفتوح يومياً: 10:00 صباحاً – 11:00 مساءً',
    priveNewsletter: 'النشرة الحصرية',
    newsletterDesc: 'اشترك لتصلك إشعارات حصرية عند وصول دفعات العطور النادرة وتخفيضات الديكانت.',
    enterEmailPlaceholder: 'أدخل بريدك الإلكتروني...',
    subscribe: 'اشتراك',
    subscribed: 'تم الاشتراك بنجاح',

    // Wishlist Drawer
    wishlistTitle: 'قائمة العطور المفضلة',
    wishlistEmptyTitle: 'قائمة المفضلة فارغة حالياً',
    wishlistEmptyDesc: 'استكشف المجموعة وانقر على رمز القلب لحفظ العطور التي تنال إعجابك.',
    moveToBag: 'نقل إلى الحقيبة',
    clearAll: 'مسح الكل',

    // Reviews
    shareYourExperience: 'شاركنا رأيك وتجربتك',
    ratingLabel: 'التقييم:',
    yourNameLabel: 'اسمك الكريم:',
    yourReviewLabel: 'انطباعك عن العطر أو التوصيل:',
    reviewInputPlaceholder: 'كيف كان ثبات العطر، التغليف، وتجربة الشراء؟',
    writeReviewBtn: 'اكتب تقييماً',
    closeFormBtn: 'إغلاق النموذج',

    // Search Overlay
    searchFullPlaceholder: 'ابحث عن العطور الفاخرة، الماركات، أو المكونات (مثال: عود، فانيلا)...',
    closeEsc: 'إغلاق (Esc)',
    popularBrands: 'الماركات الأكثر طلباً',
    fragranceCategories: 'تصنيفات العطور',
    quickJump: 'تصفية سريعة:',

    // Auth Modal
    privateBoutique: 'دار العطور الحصرية',
    signInToExplore: 'تسجيل الدخول لتصفح المتجر',
    authModalInstructions: 'يرجى تسجيل الدخول بحساب Google للوصول إلى دار العطور الفاخرة، استعراض الأسعار، وتصفح التشكيلة الكاملة.',
    continueWithGoogleBtn: 'تسجيل الدخول بواسطة Google',
    secureAuthNote: 'تسجيل دخول آمن ومشفّر · وصول خاص لعملاء الدار',
    popupBlockedError: 'تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة في متصفحك للمتابعة.',
    authFailedError: 'تعذر إكمال تسجيل الدخول. يرجى المحاولة مجدداً.',
  },

  en: {
    // Header & Nav
    navHome: 'Home',
    navCollection: 'Collection',
    navMaison: 'Maison',
    navReviews: 'Reviews',
    navBoutique: 'Boutique',
    hauteParfumerie: 'Haute Parfumerie',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    owner: 'Owner',
    admin: 'Admin',
    dashboard: 'Dashboard',
    openDashboard: 'Master Dashboard',
    shoppingBag: 'Bag',
    member: 'Member',
    duhokOpenDaily: 'Duhok, Kurdistan · Open Daily',
    viewBag: 'View Bag',

    // Announcement
    announcementDefault: '✨ Grand opening special: 20% off curated Ibrahim Al Qurashi perfumes across all governorates | Express Delivery',
    closeAnnouncement: 'Close Announcement',

    // Hero
    heroEyebrow: 'Curated Ibrahim Al Qurashi & Niche Perfumes',
    heroTitlePrefix: 'NJZARO',
    heroTitleSuffix: 'Perfume',
    heroDescription: '"A private collection of the world\'s most coveted fragrances — hand-selected, batch-verified, and crafted for those who wear their signature."',
    exploreFragrances: 'Explore 48+ Fragrances',
    maisonStory: 'Maison Story',
    authentic100: '100% Authentic',
    authenticDesc: 'Batch Code Verified',
    expressDelivery: 'Iraq Express Delivery',
    deliveryDesc: 'Duhok, Erbil, Baghdad & All',
    decantsBottles: 'Decants & Bottles',
    decantsDesc: '10ml, 20ml & Full Bottles',
    instantWhatsApp: 'Instant WhatsApp',
    whatsAppDesc: 'Direct Concierge & Advice',

    // Collection
    catalogEyebrow: 'The Curated Catalog',
    catalogTitle: 'Fragrances Worth',
    catalogTitleEm: 'Remembering',
    catalogDesc: 'Select bottle or decant sample sizes with transparent Iraqi Dinar pricing. Every batch authentic and preserved in climate-controlled storage.',
    addNewFragrance: 'Add New Fragrance',
    searchPlaceholder: 'Search fragrance, brand, or notes (e.g. oud, rose, vanilla)...',
    sortBy: 'Sort by:',
    sortFeatured: 'Featured Selection',
    sortDiscount: 'Special Offers & Discounts',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortNameAsc: 'Name: A to Z',
    brandsAndCategories: 'Categories & Brands',
    allBrands: 'All',
    all: 'All',
    showMore: 'Load More Fragrances',
    showingCount: 'Showing {shown} of {total} fragrances',
    noResultsTitle: 'No fragrances matched your search',
    noResultsDesc: 'Try different keywords or select a different brand category above.',
    resetFilters: 'Reset Filters',

    // Product Card
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    newBadge: 'New',
    priceLabel: 'Price',
    currency: 'IQD',
    addToBag: 'Bag',
    addedToBag: 'Added',
    orderOnWhatsApp: 'Order via WhatsApp',
    clickToAdd: 'Click to add fragrance to bag',
    editFragrance: 'Edit Fragrance',
    deleteFragrance: 'Delete Fragrance',
    confirmDeletePrompt: 'Delete?',
    cancel: 'Cancel',

    // Cart Drawer
    bagTitle: 'Your Shopping Bag',
    bagEmptyTitle: 'Your bag is empty',
    bagEmptyDesc: 'Discover our curated Ibrahim Al Qurashi collection and niche decants.',
    exploreCollectionBtn: 'Explore Collection',
    totalAmount: 'Total Amount',
    fullNamePlaceholder: 'Full Name *',
    cityLabel: 'City / Governorate',
    phonePlaceholder: 'Phone Number *',
    addressPlaceholder: 'Detailed Address / Delivery Notes *',
    sendOrderWhatsApp: 'Send Order via WhatsApp',
    redirectingWhatsApp: 'Redirecting to WhatsApp with your order summary!',
    codBadge: 'Cash on Delivery available throughout Iraq',
    pleaseEnterName: 'Please enter your full name.',
    pleaseEnterPhone: 'Please enter your phone number.',

    // About
    aboutEyebrow: 'The Maison Heritage',
    aboutTitle: 'Scent Is Memory,',
    aboutTitleEm: 'Bottled.',
    aboutP1: 'NJZARO began as a dedicated pursuit of authentic oriental luxury — curated for those who believe a signature scent should speak truth, elegance, and unmistakable individuality.',
    aboutP2: 'Every Ibrahim Al Qurashi bottle and niche decant in our collection is strictly examined for batch integrity, stored under optimal climate protection, and packaged with the care we would expect for our own private collection.',
    statFragrances: '48+',
    statFragrancesLabel: 'Fragrances',
    statAuthentic: '100%',
    statAuthenticLabel: 'Authentic',
    statRating: '4.9★',
    statRatingLabel: 'Client Rating',

    // Reviews
    reviewsEyebrow: 'Client Experiences',
    reviewsTitle: 'Trusted by',
    reviewsTitleEm: 'Fragrance Lovers',
    reviewsSubtitle: 'Read genuine impressions from our private clientele across Iraq. Authenticity and satisfaction guaranteed.',
    writeReview: 'Write a Review',
    closeForm: 'Close Form',
    shareExperience: 'Share Your Experience',
    shareExperienceSub: 'Your review will be shared with other fragrance enthusiasts.',
    yourName: 'Your Name (e.g. Ahmed K.)',
    reviewPlaceholder: 'Tell us about the scent, projection, or your experience...',
    submitReview: 'Submit Review',
    submitting: 'Publishing...',
    reviewSuccess: 'Thank you! Your review has been successfully published.',
    verifiedClient: 'Verified Client',

    // Footer
    footerDesc: 'A curated Ibrahim Al Qurashi and niche fragrance collection, authenticated with care and delivered with reverence to perfume lovers across all Iraqi governorates.',
    boutiqueLocation: 'Boutique Location',
    boutiqueAddress: 'Duhok, Kurdistan Region',
    boutiqueSub: 'Iraq · Central Fragrance District',
    openingHours: 'Opening Hours',
    hoursDaily: 'Open Daily: 10:00 AM – 12:00 AM Midnight',
    customerConcierge: 'Customer Concierge',
    conciergeDesc: 'Questions about scent notes, batch codes, or delivery schedules? Our team is available directly via phone or WhatsApp.',
    allRightsReserved: '© 2026 NJZARO Perfume. All rights reserved.',
    curatedWithLove: 'Curated with Reverence',

    // Auth Modal
    privateAccess: 'Private Member Access',
    welcomeToNjzaro: 'Welcome to NJZARO',
    authModalDesc: 'Sign in to save favorite perfumes, track previous orders, and receive private drops of rare batch fragrances.',
    continueWithGoogle: 'Continue with Google',
    continueAsGuest: 'Continue browsing as guest',

    // Switcher
    language: 'Language',
    selectLanguage: 'Select Language',

    // Nav & General
    navShop: 'Shop',
    navMen: "Men's Fragrances",
    navWomen: "Women's Fragrances",
    navUnisex: 'Unisex',
    navArabian: 'Arabian & Niche',
    navBrands: 'Explore Brands',
    navNewArrivals: 'New Arrivals',
    navBestSellers: 'Best Sellers',
    navOffers: 'Special Offers',
    navContact: 'Boutique & Contact',
    wishlist: 'Wishlist',
    activeAdmin: 'Active Admin',
    tapToOpenDashboard: 'Tap to open dashboard',

    // Categories Section
    curatedSelections: 'Curated Selections',
    shopByCategory: 'Shop by Category',
    categoryDesc: 'Find your next olfactory masterpiece categorized by occasion, gender, and fragrance family.',
    catMenTitle: "Men's Fragrances",
    catMenSub: 'Bold, Woody & Aromatic',
    catWomenTitle: "Women's Fragrances",
    catWomenSub: 'Floral, Sweet & Elegant',
    catUnisexTitle: 'Unisex & Rare',
    catUnisexSub: 'Complex & Universal',
    catArabianTitle: 'Arabian & Bukhoor',
    catArabianSub: 'Pure Oud, Amber & Musk',
    catDesignerTitle: 'Designer Icons',
    catDesignerSub: 'Dior, YSL, Chanel, Versace',
    catNicheTitle: 'Haute Niche Parfums',
    catNicheSub: 'Artisanal & Limited Blends',

    // Brands Section
    renownedPerfumeHouses: 'Renowned Perfume Houses',
    explorePrestigiousBrands: 'Explore Prestigious Brands',
    brandsSectionDesc: 'Discover original creations from the worlds most acclaimed oriental masters and Parisian ateliers.',
    viewAllBrands: 'View All Fragrances in Collection',

    // Product Card & Detail
    bestSellerBadge: 'BEST SELLER',
    decantBadge: 'Decant',
    quickView: 'Quick View',
    addToWishlist: 'Add to Wishlist',
    buyNow: 'Buy Now',
    orderViaWhatsApp: 'Order on WhatsApp',
    fragrancePyramid: 'Fragrance Pyramid & Notes',
    topNotes: 'Top Notes',
    heartNotes: 'Heart Notes',
    baseNotes: 'Base Notes',
    selectVolume: 'Select Volume / Decant:',
    originalSealedGuarantee: '100% Original Sealed Flacons & Hand-Poured Decants',
    filterByNameOrNotes: 'Filter by name or note...',
    allPriceRanges: 'All Price Ranges',
    under25k: 'Under 25,000 IQD',
    range25k50k: '25,000 - 50,000 IQD',
    over50k: 'Over 50,000 IQD',
    saveAmount: 'Save',
    reviewsCount: 'reviews',
    quantity: 'Quantity',

    // Cart & Delivery
    freeDeliveryUnlocked: '🎉 You unlocked FREE Delivery!',
    addMoreForFreeDelivery: 'Add {amount} IQD more for FREE delivery',
    proceedToCheckout: 'Proceed to Checkout',
    deliveryFeeLabel: 'Delivery',
    free: 'FREE',
    item: 'item',
    items: 'items',

    // Checkout Modal
    checkoutTitle: 'Confirm Order',
    checkoutSubtitle: 'Delivery across all Iraq governorates · Cash on delivery',
    governorate: 'City / Governorate',
    detailedAddress: 'Delivery Address',
    notesOptional: 'Delivery notes or preferred arrival time (Optional)',
    cashOnDelivery: 'Cash on Delivery',
    cashOnDeliveryDesc: 'Pay safely upon receipt when your perfume arrives at your door.',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    total: 'Total Amount',
    completeOrderOnWhatsApp: 'Confirm & Send via WhatsApp',
    orderSuccessTitle: 'Thank You! Your Order Has Been Placed',
    orderSuccessDesc: 'We have forwarded your invoice and details to WhatsApp. Our team will contact you shortly to arrange delivery.',
    orderSuccessNote: 'We will send your parcel tracking number once dispatched.',
    closeBtn: 'Close',

    // Footer
    trustAuthentic: '100% Authentic',
    trustAuthenticSub: 'Original sealed flacons & verified batches',
    trustDecants: 'Hand-Poured Decants',
    trustDecantsSub: 'Medical-grade glass atomizers',
    trustDelivery: 'Fast Iraq Delivery',
    trustDeliverySub: 'All governorates within 24-48 hours',
    trustConcierge: 'Fragrance Concierge',
    trustConciergeSub: 'Direct recommendations via WhatsApp',
    navigation: 'Quick Navigation',
    boutiqueVisit: 'Boutique Visit',
    boutiqueAddressFull: 'Duhok, Kurdistan Region, Iraq · Central Commercial District',
    openingHoursFull: 'Open Daily: 10:00 AM – 11:00 PM',
    priveNewsletter: 'Privé Newsletter',
    newsletterDesc: 'Receive private invitations to limited decant releases and rare perfume arrivals.',
    enterEmailPlaceholder: 'Enter your email...',
    subscribe: 'Subscribe',
    subscribed: 'Subscribed Successfully',

    // Wishlist Drawer
    wishlistTitle: 'Saved Fragrances',
    wishlistEmptyTitle: 'Your wishlist is empty',
    wishlistEmptyDesc: 'Explore our catalog and click the heart icon to save fragrances you love.',
    moveToBag: 'Move to Bag',
    clearAll: 'Clear All',

    // Reviews
    shareYourExperience: 'Share Your Experience',
    ratingLabel: 'Rating:',
    yourNameLabel: 'Your Name:',
    yourReviewLabel: 'Your Impression:',
    reviewInputPlaceholder: 'How was the longevity, packaging, and authenticity?',
    writeReviewBtn: 'Write a Review',
    closeFormBtn: 'Close Form',

    // Search Overlay
    searchFullPlaceholder: 'Search for luxury fragrances, brands, or notes (e.g. Oud, Vanilla)...',
    closeEsc: 'Close (Esc)',
    popularBrands: 'Popular Brands',
    fragranceCategories: 'Fragrance Categories',
    quickJump: 'Quick Jump:',

    // Auth Modal
    privateBoutique: 'Private Luxury Boutique',
    signInToExplore: 'Sign in to Explore',
    authModalInstructions: 'Please sign in with your Google account to browse our exclusive fragrance collection, view pricing, and place orders.',
    continueWithGoogleBtn: 'Sign in with Google',
    secureAuthNote: 'Secure single sign-on · Authorized private client access',
    popupBlockedError: 'Sign-in popup was blocked. Please allow popups in your browser to sign in.',
    authFailedError: 'Unable to complete sign-in. Please try again.',
  },

  badini: {
    // Header & Nav (Kurdish Badini - دهۆک و دەڤەرا بادینان)
    navHome: 'دەستپێک',
    navCollection: 'بەرھەم و عەتر',
    navMaison: 'دەربارەی مە',
    navReviews: 'ڕایێن کڕیاران',
    navBoutique: 'جهـ و پەیوەندی',
    hauteParfumerie: 'عەترێن شاهانە و دەگمەن',
    signIn: 'چوونە ژوور',
    signOut: 'دەرکەفتن',
    owner: 'خودان',
    admin: 'ڕێڤەبەر',
    dashboard: 'دەستەیا کۆنترۆلێ',
    openDashboard: 'کۆنترۆلا سەرەکی',
    shoppingBag: 'سەبەتە',
    member: 'ئەندام',
    duhokOpenDaily: 'دهۆک، هەرێما کوردستانێ · ڕۆژانە ڤەکریە',
    viewBag: 'سەحدکە سەبەتێ',

    // Announcement
    announcementDefault: '✨ داشکاندنا تایبەت ب هەلکەفتا ڤەکرنێ 20% ل سەر عەترێن ئیبراهیم ئەلقوڕەشی بۆ هەمی باژێڕان | گەهاندنا لەزگین',
    closeAnnouncement: 'گرتنا ئاگەهداریێ',

    // Hero
    heroEyebrow: 'کۆمەلەکا دەستنیشانکری ژ ئیبراهیم ئەلقوڕەشی و عەترێن نایاب',
    heroTitlePrefix: 'عەترێن',
    heroTitleSuffix: 'NJZARO',
    heroDescription: '"کۆمەلەکا تایبەت ژ بێهناترین و جوانترین عەترێن جیهانێ — ب هویربینی هاتینە هەلبژارتن، پشکنین بۆ باتش کۆدی هاتیە کرن، تایبەت بۆ وان کەسێن حەز ژ جیاوازیێ دکەن."',
    exploreFragrances: 'سەحدکە 48+ عەتران',
    maisonStory: 'چیرۆکا مە',
    authentic100: '100% ئەسڵی و باوەرپێکری',
    authenticDesc: 'پشکنینا باتش کۆدی هاتیە کرن',
    expressDelivery: 'گەهاندنا بلەز بۆ هەمی عێراقێ',
    deliveryDesc: 'دهۆک، هەولێر، بەغدا و هەمی باژێڕ',
    decantsBottles: 'شوشە و نموونەیێن بچووک (دیکانت)',
    decantsDesc: '10 مل، 20 مل و شوشەیێن مەزن',
    instantWhatsApp: 'پەیوەندیا ئێکسەر ب واتساپێ',
    whatsAppDesc: 'شیرەتکاری و بەرسڤدانا بلەز',

    // Collection
    catalogEyebrow: 'کەتەلۆگێ هەلبژارتی',
    catalogTitle: 'عەترێن دهێنە',
    catalogTitleEm: 'بیرهاتن',
    catalogDesc: 'شوشەیا تەمام یان قەبارەیێن دیکانت ب بهایێ ڕوون ب دینارێ عێراقی هەلبژێرە. هەمی عەترێن مە ئەسڵینە و د جهانێ گونجای دا دهێنە پاراستن.',
    addNewFragrance: 'زێدەکرنا عەترەکێ نوو',
    searchPlaceholder: 'لێگەڕیان ل عەتری، مارکێ، یان پێکهاتەیان (عۆد، گوڵ، ڤانێلا)...',
    sortBy: 'ڕێزبەندی ل دووڤ:',
    sortFeatured: 'عەترێن هەلبژارتی',
    sortDiscount: 'داشکاندن و ئۆفەرێن تایبەت',
    sortPriceAsc: 'بها: ژ کێمترین بۆ زێدەترین',
    sortPriceDesc: 'بها: ژ زێدەترین بۆ کێمترین',
    sortNameAsc: 'ناڤ: ئەلفوبێ (A-Z)',
    brandsAndCategories: 'پۆلێن و مارکە',
    allBrands: 'هەمی',
    all: 'هەمی',
    showMore: 'دیتنا عەترێن زێدەتر',
    showingCount: 'نیشاندانا {shown} ژ کۆما {total} عەتران',
    noResultsTitle: 'چ عەتر ل سەر ڤێ لێگەڕیانێ نەهاتنە دیتن',
    noResultsDesc: 'پەیڤێن دی تاقی بکە یان مارکەکا دی ژ لیستێ هەلبژێرە.',
    resetFilters: 'ڕێکخستنەڤەیا فلتەری',

    // Product Card
    outOfStock: 'ب داوی هات',
    inStock: 'یا بەردەستە',
    newBadge: 'نوو',
    priceLabel: 'بها',
    currency: 'د.ع',
    addToBag: 'زێدەکرن',
    addedToBag: 'هاتە زێدەکرن',
    orderOnWhatsApp: 'داخازکرن ب ڕێکا واتساپێ',
    clickToAdd: 'کلیک بکە بۆ زێدەکرنێ بۆ سەبەتێ',
    editFragrance: 'دەستکاریا عەتری',
    deleteFragrance: 'ژێبرنا عەتری',
    confirmDeletePrompt: 'ژێببەم؟',
    cancel: 'پاشگەزبوون',

    // Cart Drawer
    bagTitle: 'سەبەتا تە یا کڕینێ',
    bagEmptyTitle: 'سەبەتا تە یا ڤالایە',
    bagEmptyDesc: 'سەحکە کۆمەلەیا عەترێن مە یێن ئیبراهیم ئەلقوڕەشی و عەترێن نایاب.',
    exploreCollectionBtn: 'سەحدکە کۆمەلەیێ',
    totalAmount: 'کۆما گشتی',
    fullNamePlaceholder: 'ناڤێ تەمام *',
    cityLabel: 'باژێڕ',
    phonePlaceholder: 'ژمارەیا مۆبایلێ *',
    addressPlaceholder: 'ناڤونیشان ب هویربینی / تێبینیێن گەهاندنێ *',
    sendOrderWhatsApp: 'هنارتنا داخوازیێ ب ڕێکا واتساپێ',
    redirectingWhatsApp: 'دێ هێیە ڤەگوهاستن بۆ واتساپێ دگەل پێزانینێن داخوازیێ...',
    codBadge: 'پارەدان ل دەمێ وەرگرتنێ ل هەمی دەڤەرێن عێراقێ بەردەستە',
    pleaseEnterName: 'هیڤیە ناڤێ خۆ بنڤیسە.',
    pleaseEnterPhone: 'هیڤیە ژمارەیا تەلەفۆنێ بنڤیسە.',

    // About
    aboutEyebrow: 'دیرۆک و بنەماڵا دارێ',
    aboutTitle: 'بۆهن بیرهاتنە، د شوشەکێ دا',
    aboutTitleEm: 'هاتە چێکرن.',
    aboutP1: 'NJZARO دەستپێکر ژ حەژێکرنەکا مەزن بۆ عەترێن ڕۆژهەڵاتی یێن گرانبەها — بۆ وان کەسان هاتیە دانان ئەوێن باوەری پێ هەی کو بۆهنا مرۆڤی ناسنامە و هەیبەت و جوانییا وییە.',
    aboutP2: 'هەر شوشەیەک ژ عەترێن ئیبراهیم ئەلقوڕەشی و نموونەیێن مە ب هویربینی دهێنە پشکنین ژ لایێ باتش کۆدی ڤە، و د کەشوهەوایەکێ پاراستی دا دهێنە هەلگرتن داکو ب باشترین شێوە بگەهنە دەستێ هەوە.',
    statFragrances: '48+ عەتر',
    statFragrancesLabel: 'عەترێن هەلبژارتی',
    statAuthentic: '100% ئەسڵی',
    statAuthenticLabel: 'باوەرپێکری',
    statRating: '4.9★',
    statRatingLabel: 'ڕایێن کڕیاران',

    // Reviews
    reviewsEyebrow: 'ئەزموونا کڕیاران',
    reviewsTitle: 'جهێ باوەریا هەمی حەژێکەرێن',
    reviewsTitleEm: 'عەترێن شاهانە',
    reviewsSubtitle: 'ڕا و سەرنجێن ڕاستەقینە یێن کڕیارێن مە ل دهۆکێ و سەرتاسەری عێراقێ.',
    writeReview: 'ڕایا خۆ بنڤیسە',
    closeForm: 'گرتنا فۆڕمێ',
    shareExperience: 'ئەزموونا خۆ دگەل مە بەشدار بکە',
    shareExperienceSub: 'ڕایا تە گرنگە بۆ مە و هاریکاریا کڕیارێن دی ژی دکەت.',
    yourName: 'ناڤێ تە',
    reviewPlaceholder: 'تێبینیا خۆ ل سەر بێهنێ، مانا وێ، یان خزمەتگۆزاریێ بنڤیسە...',
    submitReview: 'بەلاڤکرنا ڕایێ',
    submitting: 'دهێتە بەلاڤکرن...',
    reviewSuccess: 'سوپاس! ڕایا تە ب سەرکەفتیانە هاتە بەلاڤکرن.',
    verifiedClient: 'کڕیارێ پشتڕاستکری',

    // Footer
    footerDesc: 'کۆمەلەکا هەلبژارتی ژ عەترێن ئیبراهیم ئەلقوڕەشی و عەترێن ڕۆژهەڵاتی یێن ئەسڵی، ب گەهاندنا بلەز بۆ هەمی باژێڕ و دەڤەرێن عێراقێ.',
    boutiqueLocation: 'جهێ مە',
    boutiqueAddress: 'دهۆک، هەرێما کوردستانێ',
    boutiqueSub: 'عێراق · تاخێ عەتران',
    openingHours: 'دەمێ کارکرنێ',
    hoursDaily: 'ڕۆژانە ڤەکریە: 10:00 سپێدێ هەتا 12:00 شەڤێ',
    customerConcierge: 'پەیوەندی و خزمەتگۆزاریا کڕیاران',
    conciergeDesc: 'پسیارەک تە هەیە دەربارەی نۆتێن عەتری یان بەردەستبوونا وان؟ تیمی مە ڕاستەوخۆ بەرسڤا تە ددەت ب تەلەفۆنێ یان واتساپێ.',
    allRightsReserved: '© 2026 عەترێن NJZARO. هەمی ماف پاراستینە.',
    curatedWithLove: 'ب ڕێز و ڤیان هاتیە هەلبژارتن',

    // Auth Modal
    privateAccess: 'ئەندامەتیا تایبەت',
    welcomeToNjzaro: 'بخێرهاتی بۆ NJZARO',
    authModalDesc: 'بچۆ ژوور بۆ پاراستنا عەترێن دڵخوازێن خۆ، دیتنا داخوازیێن بەرێ، و وەرگرتنا ئاگەهداریێن عەترێن نوو.',
    continueWithGoogle: 'بەردەوامبە ب ڕێکا Google',
    continueAsGuest: 'وەک مێڤان بەردەوامبە',

    // Switcher
    language: 'زمان',
    selectLanguage: 'زمانێ خۆ هەلبژێرە',

    // Nav & General
    navShop: 'فرۆشگە',
    navMen: 'عەترێن زەلامان',
    navWomen: 'عەترێن ئافرەتان',
    navUnisex: 'عەترێن هەردوو ڕەگەزان',
    navArabian: 'عەترێن ڕۆژهەڵاتی و نیش',
    navBrands: 'مارکەیێن جیهانی',
    navNewArrivals: 'نووگەهشتی',
    navBestSellers: 'پڕفرۆشترین',
    navOffers: 'داشکاندن و ئۆفەر',
    navContact: 'جهـ و پەیوەندی',
    wishlist: 'دڵخواز',
    activeAdmin: 'ڕێڤەبەرێ چالاک',
    tapToOpenDashboard: 'کلیک بکە بۆ ڤەکرنا کۆنترۆلێ',

    // Categories Section
    curatedSelections: 'پۆلێنێن هەلبژارتی',
    shopByCategory: 'ل دووڤ پۆلینان بکڕە',
    categoryDesc: 'عەترێ خۆ یێ بهێت ل دووڤ هەلکەفت، ڕەگەز، یان پیكهاتەیێ هەلبژێرە.',
    catMenTitle: 'عەترێن زەلامان',
    catMenSub: 'دار، بهارات، و بێهنێن سەرنجڕاکێش',
    catWomenTitle: 'عەترێن ئافرەتان',
    catWomenSub: 'گوڵ، ڤانێلا، و جوانییا ئافرەتانە',
    catUnisexTitle: 'عەترێن هەردوو ڕەگەزان',
    catUnisexSub: 'بێهنێن سەردەمیانە بۆ هەمیان',
    catArabianTitle: 'عەترێن ڕۆژهەڵاتی و بخور',
    catArabianSub: 'دوهنێ عۆدی، میسک، و عەنبەر',
    catDesignerTitle: 'عەترێن دیزاینەر یێن جیهانی',
    catDesignerSub: 'ناڤدارترین عەترێن فەرەنسی و ئیتالی',
    catNicheTitle: 'عەترێن نیش یێن دەگمەن',
    catNicheSub: 'تێکەلێن هونەری یێن کێم و نایاب',

    // Brands Section
    renownedPerfumeHouses: 'دارێن عەترێن جیهانی',
    explorePrestigiousBrands: 'سەحدکە مارکەیێن ناڤدار',
    brandsSectionDesc: 'دیتنا بەرهەمێن ئەسڵی ژ مەزنترین دارێن عەترێن ڕۆژهەڵاتی و فەرەنسی.',
    viewAllBrands: 'دیتنا هەمی عەتران د کۆمەلەیێ دا',

    // Product Card & Detail
    bestSellerBadge: 'پڕفرۆشترین',
    decantBadge: 'دیکانت',
    quickView: 'تەماشاکرنا لەزگین',
    addToWishlist: 'زێدەکرن بۆ دڵخوازان',
    buyNow: 'کڕینا ئێکسەر',
    orderViaWhatsApp: 'داخازکرن ب واتساپێ',
    fragrancePyramid: 'هەرەمێ بێهنێ و پێکهاتە',
    topNotes: 'سەرێ عەتری',
    heartNotes: 'دڵێ عەتری',
    baseNotes: 'بنیاتێ عەتری',
    selectVolume: 'قەبارەیێ شووشێ / دیکانتی هەلبژێرە:',
    originalSealedGuarantee: '100% ئەسڵی و باوەرپێکری شوشە و دیکانتێن پاراستی',
    filterByNameOrNotes: 'لێگەڕیان ب ناڤ یان پێکهاتەیان...',
    allPriceRanges: 'هەمی بها',
    under25k: 'کێمتر ژ 25,000 د.ع',
    range25k50k: '25,000 - 50,000 د.ع',
    over50k: 'پتر ژ 50,000 د.ع',
    saveAmount: 'داشکاندن',
    reviewsCount: 'هەلسەنگاندن',
    quantity: 'ژمارە',

    // Cart & Delivery
    freeDeliveryUnlocked: '🎉 پیرۆزە! گەهاندنا بێ بەرامبەر ب دەستخۆڤە ئینا!',
    addMoreForFreeDelivery: '{amount} د.ع زێدە بکە بۆ گەهاندنا بێ بەرامبەر',
    proceedToCheckout: 'بەردەوامبە بۆ کڕینێ',
    deliveryFeeLabel: 'گەهاندن',
    free: 'بێ بەرامبەر',
    item: 'عەتر',
    items: 'عەتر',

    // Checkout Modal
    checkoutTitle: 'پشتڕاستکرنا داخوازیێ',
    checkoutSubtitle: 'گەهاندن بۆ هەمی باژێڕێن عێراقێ · پارەدان ل دەمێ وەرگرتنێ',
    governorate: 'باژێڕ / پارێزگەهـ',
    detailedAddress: 'ناڤونیشان ب هویربینی',
    notesOptional: 'تێبینیێن زێدە یان دەمێ گەهاندنێ (ئارەزوومەندانە)',
    cashOnDelivery: 'پارەدان ل دەمێ وەرگرتنێ',
    cashOnDeliveryDesc: 'ب ئارامی پارەی بدە دەمێ عەتر دگەهیتە بەر دەرگەهێ تە.',
    orderSummary: 'کورتیا داخوازیێ',
    subtotal: 'کۆما کەرەستان',
    total: 'کۆما گشتی',
    completeOrderOnWhatsApp: 'پشتڕاستکرن و هنارتن ب واتساپێ',
    orderSuccessTitle: 'سوپاس! داخوازیاتە ب سەرکەفتیانە هاتە وەرگرتن',
    orderSuccessDesc: 'فلیپێ داخوازیاتە بۆ واتساپێ هاتە هنارتن. تیمی مە دێ پەیوەندیێ ب تە کەت بۆ دیارکرنا دەمێ گەهاندنێ.',
    orderSuccessNote: 'ئەم دێ کۆدێ بارنامەی بۆ تە هنێرین پشت پێچانا عەتری.',
    closeBtn: 'گرتن',

    // Footer
    trustAuthentic: '100% ئەسڵی و باوەرپێکری',
    trustAuthenticSub: 'عەتر و مارکەیێن ئەسڵی یێن مۆرکری',
    trustDecants: 'دیکانتێن پاقژ و ستێریل',
    trustDecantsSub: 'نموونەیێن پاراستی د شوشەیێن ساخلەم دا',
    trustDelivery: 'گەهاندنا بلەز بۆ هەمی عێراقێ',
    trustDeliverySub: 'دهۆک، هەولێر، بەغدا و هەمی باژێڕ د 24-48 دەمژمێران دا',
    trustConcierge: 'شیرەتکارێ عەتران',
    trustConciergeSub: 'شیرەتکاری و بەرسڤدانا بلەز ب واتساپێ',
    navigation: 'بەشێن سەرەکی',
    boutiqueVisit: 'سەردانا مە',
    boutiqueAddressFull: 'دهۆک، هەرێما کوردستانێ، عێراق · سەنتەرێ باژێڕی',
    openingHoursFull: 'ڕۆژانە ڤەکریە: 10:00 سپێدێ هەتا 11:00 شەڤێ',
    priveNewsletter: 'ئاگەهداریێن تایبەت',
    newsletterDesc: 'بەشداربە بۆ وەرگرتنا ئاگەهداریێن عەترێن دەگمەن و داشکاندنان.',
    enterEmailPlaceholder: 'ئیمەیلا خۆ بنڤیسە...',
    subscribe: 'بەشداربە',
    subscribed: 'ب سەرکەفتیانە بەشداربووی',

    // Wishlist Drawer
    wishlistTitle: 'لیستا عەترێن دڵخواز',
    wishlistEmptyTitle: 'لیستا دڵخوازێن تە یا ڤالایە',
    wishlistEmptyDesc: 'سەحدکە کۆمەلەیێ و کلیک ل سەر دلی بکە بۆ پاراستنا وان عەترێن تە حەز ژێ هەی.',
    moveToBag: 'ڤەگوهێزە بۆ سەبەتێ',
    clearAll: 'پاقژکرنا هەمیا',

    // Reviews
    shareYourExperience: 'ئەزموونا خۆ بەشدار بکە',
    ratingLabel: 'هەلسەنگاندن:',
    yourNameLabel: 'ناڤێ تە یێ هێژا:',
    yourReviewLabel: 'ڕایا تە ل سەر عەتری یان خزمەتگۆزاریێ:',
    reviewInputPlaceholder: 'مانا عەتری، پاکێج، و ئەسڵیا وی چەوا بوو؟',
    writeReviewBtn: 'ڕایا خۆ بنڤیسە',
    closeFormBtn: 'گرتنا فۆڕمێ',

    // Search Overlay
    searchFullPlaceholder: 'لێگەڕیان ل عەتران، مارکەیان، یان پێکهاتەیان (عۆد، ڤانێلا)...',
    closeEsc: 'گرتن (Esc)',
    popularBrands: 'مارکەیێن پڕداخاز',
    fragranceCategories: 'پۆلینێن عەتران',
    quickJump: 'فلتەرا لەزگین:',

    // Auth Modal
    privateBoutique: 'بوتیکا عەترێن شاهانە',
    signInToExplore: 'چوونەژوور بۆ دیتنا عەتران',
    authModalInstructions: 'تکایە ب هەژمارا خۆ یا گووگڵ بچە ژوور دا بشێی تەماشەی هەمی عەترێن شاهانە و بهایان بکەی.',
    continueWithGoogleBtn: 'چوونەژوور ب ڕێکا Google',
    secureAuthNote: 'چوونەژوورا پاراستی و باوەرپێکری · دەستگەهشتنا تایبەت',
    popupBlockedError: 'پەنجەرا چوونەژوورێ هاتە بلۆک کرن. تکایە ڕێکێ بدە پەنجەرەیان د مۆبایل یان براوزەرێ خۆ دا.',
    authFailedError: 'چوونەژوور سەرنەگرت. هیڤیە دوبارە تاقی بکەڤە.',
  },

  sorani: {
    // Header & Nav (Kurdish Sorani - هەولێر، سلێمانی و دەڤەری سۆران)
    navHome: 'سەرەتا',
    navCollection: 'کۆکراوەی بۆنەکان',
    navMaison: 'دەربارەی ئێمە',
    navReviews: 'بۆچوونی کڕیاران',
    navBoutique: 'ناونیشان و پەیوەندی',
    hauteParfumerie: 'بۆنی شاهانە و نایاب',
    signIn: 'چوونەژوورەوە',
    signOut: 'چوونەدەرەوە',
    owner: 'خاوەن',
    admin: 'بەڕێوەبەر',
    dashboard: 'پانێڵی کۆنتڕۆڵ',
    openDashboard: 'کۆنتڕۆڵی سەرەکی',
    shoppingBag: 'سەبەتەی کڕین',
    member: 'ئەندام',
    duhokOpenDaily: 'دهۆک، هەرێمی کوردستان · هەموو ڕۆژێک کراوەیە',
    viewBag: 'سەیرکردنی سەبەتە',

    // Announcement
    announcementDefault: '✨ داشکاندنی تایبەت بەبۆنەی کرانەوە 20% لەسەر بۆنەکانی ئیبراهیم قوڕەشی بۆ هەموو شارەکان | گەیاندنی خێرا',
    closeAnnouncement: 'داخستنی ئاگاداری',

    // Hero
    heroEyebrow: 'کۆکراوەیەکی دەستنیشانکراو لە ئیبراهیم قوڕەشی و بۆنە نایابەکان',
    heroTitlePrefix: 'بۆنەکانی',
    heroTitleSuffix: 'NJZARO',
    heroDescription: '"کۆکراوەیەکی تایبەت لە باشترین و خۆشترین بۆنەکانی جیهان — بە وردی هەڵبژێردراون، پشکنین بۆ باچ کۆدەکەیان کراوە، تایبەت بۆ ئەوانەی ئارەزووی جیاوازی دەکەن."',
    exploreFragrances: 'گەڕان لە 48+ بۆن',
    maisonStory: 'چیرۆکی براندەکە',
    authentic100: '100% ئەسڵی و دڵنیاکراو',
    authenticDesc: 'پشکنینی باچ کۆدی بۆ کراوە',
    expressDelivery: 'گەیاندنی خێرا بۆ هەموو عێراق',
    deliveryDesc: 'دهۆک، هەولێر، بەغدا و هەموو پارێزگاکان',
    decantsBottles: 'شووشە و نموونەی دیکانت',
    decantsDesc: '10 مل، 20 مل و شووشەی گەورە',
    instantWhatsApp: 'پەیوەندی ڕاستەوخۆ بە واتسئەپ',
    whatsAppDesc: 'ڕاوێژکاری و وەڵامدانەوەی خێرا',

    // Collection
    catalogEyebrow: 'کەتەلۆگی هەڵبژێردراو',
    catalogTitle: 'بۆنە شایستە و',
    catalogTitleEm: 'لەبیرنەکراوەکان',
    catalogDesc: 'شووشەی تەواو یان قەبارەی دیکانت بە نرخی ڕوون بە دیناری عێراقی هەڵبژێرە. هەموو بۆنەکانمان ئەسڵین و لە کەشێکی گونجاودا هەڵگیراون.',
    addNewFragrance: 'زیادکردنی بۆنی نوێ',
    searchPlaceholder: 'گەڕان بەدوای بۆن، براند، یان پێکهاتەدا (عود، گوڵ، ڤانێلا)...',
    sortBy: 'ڕیزبەندی بەپێی:',
    sortFeatured: 'بۆنە دیار و هەڵبژێردراوەکان',
    sortDiscount: 'داشکاندن و ئۆفەرە تایبەتەکان',
    sortPriceAsc: 'نرخ: لە کەمترینەوە بۆ بەرزترین',
    sortPriceDesc: 'نرخ: لە بەرزترینەوە بۆ کەمترین',
    sortNameAsc: 'ناو: ئەلفوبێ (A-Z)',
    brandsAndCategories: 'بەشەکان و براندەکان',
    allBrands: 'هەمووی',
    all: 'هەمووی',
    showMore: 'پیشاندانی بۆنی زیاتر',
    showingCount: 'پیشاندانی {shown} لە کۆی {total} بۆن',
    noResultsTitle: 'هیچ بۆنێک نەدۆزرایەوە بەپێی گەڕانەکەت',
    noResultsDesc: 'وشەی تر تاقی بکەرەوە یان براندێکی تر لە لیستەکەدا دیاری بکە.',
    resetFilters: 'رێکخستنەوەی فلتەرەکان',

    // Product Card
    outOfStock: 'تەواو بووە',
    inStock: 'بەردەستە',
    newBadge: 'نوێ',
    priceLabel: 'نرخ',
    currency: 'د.ع',
    addToBag: 'بخەرە سەبەتەوە',
    addedToBag: 'زیادکرا',
    orderOnWhatsApp: 'داواکردن لە ڕێگەی واتسئەپ',
    clickToAdd: 'کلیک بکە بۆ خستنە ناو سەبەتە',
    editFragrance: 'دەستکاریکردنی بۆن',
    deleteFragrance: 'سڕینەوەی بۆن',
    confirmDeletePrompt: 'دڵنیایت لە سڕینەوە؟',
    cancel: 'پاشگەزبوونەوە',

    // Cart Drawer
    bagTitle: 'سەبەتەی کڕینی تۆ',
    bagEmptyTitle: 'سەبەتەکەت بەتاڵە',
    bagEmptyDesc: 'سەیری کۆکراوەی بۆنە نایابەکانمان بکە لە ئیبراهیم قوڕەشی و براندە جیهانییەکان.',
    exploreCollectionBtn: 'سەیری کۆکراوەکە بکە',
    totalAmount: 'کۆی گشتی',
    fullNamePlaceholder: 'ناوی تەواو *',
    cityLabel: 'شار / پارێزگا',
    phonePlaceholder: 'ژمارەی مۆبایل *',
    addressPlaceholder: 'ناونیشانی ورد / تێبینی گەیاندن *',
    sendOrderWhatsApp: 'ناردنی داواکاری لە ڕێگەی واتسئەپ',
    redirectingWhatsApp: 'دەگوازرێیتەوە بۆ واتسئەپ لەگەڵ زانیارییەکانی داواکارییەکەت...',
    codBadge: 'پارەدان لە کاتی وەرگرتن لە سەرجەم شارەکانی عێراق بەردەستە',
    pleaseEnterName: 'تکایە ناوی تەواوی خۆت بنووسە.',
    pleaseEnterPhone: 'تکایە ژمارەی تەلەفۆن بنووسە.',

    // About
    aboutEyebrow: 'مێژوو و ناسنامەی ئێمە',
    aboutTitle: 'بۆن یادەوەرییە، لە شووشەیەکدا',
    aboutTitleEm: 'بەندکراوە.',
    aboutP1: 'NJZARO وەک خۆشەویستییەکی بێسنوور بۆ بۆنە ڕۆژهەڵاتییە شاهانەکان دەستیپێکرد — تایبەتە بەوانەی باوەڕیان وایە کە بۆن بەشێکە لە کەسایەتی و جوانی و ناسنامەی مرۆڤ.',
    aboutP2: 'هەموو شووشەیەکی ئیبراهیم قوڕەشی و نموونەی دیکانتەکانمان بە وردی باچ کۆدەکەیان دەپشکنرێت و لە ژینگەیەکی لەباردا دەپارێزرێن تاوەکو بە باشترین کوالێتی بگاتە دەستتان.',
    statFragrances: '48+ بۆن',
    statFragrancesLabel: 'بۆنی هەڵبژێردراو',
    statAuthentic: '100% ئەسڵی',
    statAuthenticLabel: 'متمانەپێکراو',
    statRating: '4.9★',
    statRatingLabel: 'بۆچوونی کڕیاران',

    // Reviews
    reviewsEyebrow: 'ئەزموونی کڕیاران',
    reviewsTitle: 'جێگەی متمانەی ئاشقانی',
    reviewsTitleEm: 'بۆنی شاهانە و تایبەت',
    reviewsSubtitle: 'بۆچوونی ڕاستەقینەی کڕیارە بەڕێزەکانمان لە دهۆک، هەولێر، سلێمانی و هەموو عێراق.',
    writeReview: 'بۆچوونی خۆت بنووسە',
    closeForm: 'داخستنی فۆڕم',
    shareExperience: 'ئەزموونی خۆت لەگەڵمان بەش بکە',
    shareExperienceSub: 'بۆچوونی تۆ یارمەتیدەری کڕیارانی تر دەبێت.',
    yourName: 'ناوی تۆ',
    reviewPlaceholder: 'دەربارەی مانەوەی بۆنەکە، بڵاوبوونەوەی، یان خزمەتگوزاری بنووسە...',
    submitReview: 'بڵاوکردنەوەی بۆچوون',
    submitting: 'بڵاودەکرێتەوە...',
    reviewSuccess: 'سوپاس! بۆچوونەکەت بە سەرکەوتوویی بڵاوکرایەوە.',
    verifiedClient: 'کڕیاری پشتڕاستکراوە',

    // Footer
    footerDesc: 'کۆکراوەیەکی هەڵبژێردراو لە بۆنەکانی ئیبراهیم قوڕەشی و بۆنە ڕۆژهەڵاتییە نایابەکان، بە گەیاندنی خێرا بۆ هەموو پارێزگاکانی عێراق.',
    boutiqueLocation: 'ناونیشانی لقی ئێمە',
    boutiqueAddress: 'دهۆک، هەرێمی کوردستان',
    boutiqueSub: 'عێراق · بازاڕی سەرەکی بۆن',
    openingHours: 'کاتی کارکردن',
    hoursDaily: 'ڕۆژانە کراوەیە: 10:00 بەیانی تا 12:00 شەو',
    customerConcierge: 'پەیوەندی و خزمەتگوزاری کڕیاران',
    conciergeDesc: 'پرسیارت هەیە دەربارەی نۆتی بۆن یان بەردەستبوون؟ تیمەکەمان ڕاستەوخۆ لە ڕێگەی تەلەفۆن یان واتسئەپ وەڵامت دەدەنەوە.',
    allRightsReserved: '© 2026 بۆنەکانی NJZARO. هەموو مافەکان پارێزراون.',
    curatedWithLove: 'بە ڕێز و خۆشەویستییەوە ئامادەکراوە',

    // Auth Modal
    privateAccess: 'ئەندامێتی تایبەت',
    welcomeToNjzaro: 'بەخێربێیت بۆ NJZARO',
    authModalDesc: 'بچۆ ژوورەوە بۆ هەڵگرتنی بۆنە دڵخوازەکانت، بینینی داواکارییەکانی پێشوو، و وەرگرتنی ئاگاداری بۆنە نوێیەکان.',
    continueWithGoogle: 'بەردەوامبوون لەگەڵ Google',
    continueAsGuest: 'وەک میوان بەردەوامبە',

    // Switcher
    language: 'زمان',
    selectLanguage: 'زمانەکەت هەڵبژێرە',

    // Nav & General
    navShop: 'فرۆشگا',
    navMen: 'بۆنی پیاوان',
    navWomen: 'بۆنی خانمان',
    navUnisex: 'بۆنی هەردوو ڕەگەز',
    navArabian: 'بۆنی ڕۆژهەڵاتی و نیش',
    navBrands: 'براندە جیهانییەکان',
    navNewArrivals: 'تازە گەیشتوو',
    navBestSellers: 'پڕفرۆشترین',
    navOffers: 'ئۆفەرە تایبەتەکان',
    navContact: 'ناونیشان و پەیوەندی',
    wishlist: 'دڵخوازەکان',
    activeAdmin: 'بەڕێوەبەری چالاک',
    tapToOpenDashboard: 'کلیک بکە بۆ کردنەوەی پانێڵ',

    // Categories Section
    curatedSelections: 'بەشە هەڵبژێردراوەکان',
    shopByCategory: 'بەپێی بەشەکان بکڕە',
    categoryDesc: 'بۆنی داهاتووت بەپێی بۆنە، ڕەگەز، یان جۆری پێکهاتە هەڵبژێرە.',
    catMenTitle: 'بۆنی پیاوان',
    catMenSub: 'دار، بەهارات و بۆنی سەرنجڕاکێش',
    catWomenTitle: 'بۆنی خانمان',
    catWomenSub: 'گوڵ، ڤانێلا و ناسکی',
    catUnisexTitle: 'بۆنی هەردوو ڕەگەز',
    catUnisexSub: 'پێکهاتەی سەردەمیانە بۆ هەمووان',
    catArabianTitle: 'بۆنی ڕۆژهەڵاتی و بەخوور',
    catArabianSub: 'ڕۆنی عود، میسک و عەنبەر',
    catDesignerTitle: 'بۆنی دیزاینەری جیهانی',
    catDesignerSub: 'بەناوبانگترین بۆنە فەرەنسی و ئیتاڵییەکان',
    catNicheTitle: 'بۆنی نیشی دەگمەن',
    catNicheSub: 'پێکهاتەی هونەری تایبەت و کەم وێنە',

    // Brands Section
    renownedPerfumeHouses: 'ماڵە بۆنە جیهانییەکان',
    explorePrestigiousBrands: 'گەڕان لەناو براندە بەناوبانگەکان',
    brandsSectionDesc: 'دۆزینەوەی بەرهەمی ئەسڵی لە گەورەترین ماڵە بۆنەکانی ڕۆژهەڵاتی و فەرەنسی.',
    viewAllBrands: 'بینینی هەموو بۆنەکان لە کۆکراوەکەدا',

    // Product Card & Detail
    bestSellerBadge: 'پڕفرۆشترین',
    decantBadge: 'دیکانت',
    quickView: 'سەیرکردنی خێرا',
    addToWishlist: 'زیادکردن بۆ دڵخوازەکان',
    buyNow: 'کڕینی ڕاستەوخۆ',
    orderViaWhatsApp: 'داواکردن بە واتسئەپ',
    fragrancePyramid: 'هەرەمی بۆن و پێکهاتەکان',
    topNotes: 'لووتکەی بۆن',
    heartNotes: 'دڵی بۆن',
    baseNotes: 'بنکەی بۆن',
    selectVolume: 'قەبارەی شووشە / دیکانت دیاریبکە:',
    originalSealedGuarantee: '100% ئەسڵی و دڵنیاکراو شووشە و نموونەی دیکانت',
    filterByNameOrNotes: 'گەڕان بە ناو یان پێکهاتەکان...',
    allPriceRanges: 'هەموو نرخەکان',
    under25k: 'کەمتر لە 25,000 د.ع',
    range25k50k: '25,000 - 50,000 د.ع',
    over50k: 'زیاتر لە 50,000 د.ع',
    saveAmount: 'داشکاندن',
    reviewsCount: 'هەڵسەنگاندن',
    quantity: 'ژمارە',

    // Cart & Delivery
    freeDeliveryUnlocked: '🎉 پیرۆزە! گەیاندنی بێبەرامبەرت بەدەستهێنا!',
    addMoreForFreeDelivery: '{amount} د.ع زیاد بکە بۆ گەیاندنی بێبەرامبەر',
    proceedToCheckout: 'بڕۆ بۆ تەواوکردنی داواکاری',
    deliveryFeeLabel: 'گەیاندن',
    free: 'بێبەرامبەر',
    item: 'بۆن',
    items: 'بۆن',

    // Checkout Modal
    checkoutTitle: 'تەواوکردنی داواکاری',
    checkoutSubtitle: 'گەیاندن بۆ هەموو عێراق · پارەدان لە کاتی وەرگرتن',
    governorate: 'پارێزگا / شار',
    detailedAddress: 'ناونیشانی ورد',
    notesOptional: 'تێبینی زیاتر یان کاتی گەیاندن (ئارەزوومەندانە)',
    cashOnDelivery: 'پارەدان لە کاتی وەرگرتن',
    cashOnDeliveryDesc: 'بە دڵنیاییەوە پارە بدە کاتێک بۆنەکەت دەگاتە بەردەم دەرگات.',
    orderSummary: 'کورتەی داواکاری',
    subtotal: 'کۆی گشتی بۆنەکان',
    total: 'کۆی گشتی',
    completeOrderOnWhatsApp: 'پشتڕاستکردنەوە و ناردن بە واتسئەپ',
    orderSuccessTitle: 'سوپاس! داواکارییەکەت بە سەرکەوتوویی وەرگیرا',
    orderSuccessDesc: 'پسولەی داواکارییەکەت نێردرا بۆ واتسئەپ. تیمەکەمان پەیوەندیت پێوە دەکەن بۆ دیاریکردنی کاتی گەیاندن.',
    orderSuccessNote: 'کۆدی بەدواداچوونت بۆ دەنێرین لەکاتی بەڕێکردنی داواکارییەکەت.',
    closeBtn: 'داخستن',

    // Footer
    trustAuthentic: '100% ئەسڵی و دڵنیاکراو',
    trustAuthenticSub: 'بۆن و براندە ئەسڵییەکانی مۆرکراو',
    trustDecants: 'دیکانتی پاکژ و پشکنراو',
    trustDecantsSub: 'نموونەی پارێزراو لە شووشەی تایبەتدا',
    trustDelivery: 'گەیاندنی خێرا بۆ هەموو عێراق',
    trustDeliverySub: 'دهۆک، هەولێر، بەغدا و هەموو شارەکان لە 24-48 کاتژمێردا',
    trustConcierge: 'ڕاوێژکاری بۆن',
    trustConciergeSub: 'ڕاوێژکاری و پێشنیار لە ڕێگەی واتسئەپ',
    navigation: 'بەشە سەرەکییەکان',
    boutiqueVisit: 'سەردانی لقی ئێمە',
    boutiqueAddressFull: 'دهۆک، هەرێمی کوردستان، عێراق · ناوەندی شار',
    openingHoursFull: 'هەموو ڕۆژێک کراوەیە: 10:00 بەیانی تا 11:00 شەو',
    priveNewsletter: 'ئاگاداری تایبەت',
    newsletterDesc: 'بەشداربە بۆ وەرگرتنی ئاگاداری بۆنە نایابەکان و داشکاندنەکان.',
    enterEmailPlaceholder: 'ئیمەیڵەکەت بنووسە...',
    subscribe: 'بەشداربە',
    subscribed: 'بە سەرکەوتوویی بەشداربوویت',

    // Wishlist Drawer
    wishlistTitle: 'لیستی بۆنە دڵخوازەکان',
    wishlistEmptyTitle: 'لیستی دڵخوازەکانت بەتاڵە',
    wishlistEmptyDesc: 'سەیری کۆکراوەکە بکە و کلیک لەسەر دڵ بکە بۆ هەڵگرتنی ئەو بۆنانەی حەزت لێیە.',
    moveToBag: 'بیخەرە سەبەتە',
    clearAll: 'سڕینەوەی هەمووی',

    // Reviews
    shareYourExperience: 'بۆچوونی خۆت بنووسە',
    ratingLabel: 'هەڵسەنگاندن:',
    yourNameLabel: 'ناوی بەڕێزت:',
    yourReviewLabel: 'بۆچوونت لەسەر بۆن یان گەیاندن:',
    reviewInputPlaceholder: 'مانەوەی بۆن، پێچانەوە و ئەسڵییەکەی چۆن بوو؟',
    writeReviewBtn: 'بۆچوونت بنووسە',
    closeFormBtn: 'داخستنی فۆڕم',

    // Search Overlay
    searchFullPlaceholder: 'گەڕان بەدوای بۆنەکان، براندەکان یان پێکهاتەکان (عود، ڤانێلا)...',
    closeEsc: 'داخستن (Esc)',
    popularBrands: 'براندە پڕداواکراوەکان',
    fragranceCategories: 'بەشەکانی بۆن',
    quickJump: 'فلتەری خێرا:',

    // Auth Modal
    privateBoutique: 'ماڵی بۆنی شاهانە',
    signInToExplore: 'چوونەژوورەوە بۆ گەڕان',
    authModalInstructions: 'تکایە بە هەژماری گووگڵت بچۆژوورەوە تا بتوانی تەماشای هەموو بۆنە شاهانەکان و نرخەکان بکەیت.',
    continueWithGoogleBtn: 'چوونەژوورەوە لە ڕێگەی Google',
    secureAuthNote: 'چوونەژوورەوەی پارێزراو · دەستپێگەیشتنی تایبەت',
    popupBlockedError: 'پەنجەرەی چوونەژوورەوە بلۆککرا. تکایە لە براوزەرەکەتدا ڕێگە بدە.',
    authFailedError: 'چوونەژوورەوە سەرکەوتوو نەبوو. تکایە دووبارە تاقی بکەرەوە.',
  },
};

export interface CityTranslation {
  en: string;
  ar: string;
  badini: string;
  sorani: string;
}

export const CITIES_TRANSLATION: CityTranslation[] = [
  { en: 'Duhok', ar: 'دهوك', badini: 'دهۆک', sorani: 'دهۆک' },
  { en: 'Erbil', ar: 'أربيل', badini: 'هەولێر', sorani: 'هەولێر' },
  { en: 'Baghdad', ar: 'بغداد', badini: 'بەغدا', sorani: 'بەغدا' },
  { en: 'Sulaymaniyah', ar: 'السليمانية', badini: 'سلێمانی', sorani: 'سلێمانی' },
  { en: 'Basra', ar: 'البصرة', badini: 'بەسرە', sorani: 'بەسرە' },
  { en: 'Mosul', ar: 'الموصل', badini: 'مویسل', sorani: 'موسڵ' },
  { en: 'Kirkuk', ar: 'كركوك', badini: 'کەرکووک', sorani: 'کەرکووک' },
  { en: 'Najaf', ar: 'النجف', badini: 'نەجەف', sorani: 'نەجەف' },
  { en: 'Karbala', ar: 'كربلاء', badini: 'کەربەلا', sorani: 'کەربەلا' },
  { en: 'Nasiriyah', ar: 'الناصرية', badini: 'ناسریە', sorani: 'ناسریە' },
  { en: 'Hillah', ar: 'الحلة', badini: 'حلە', sorani: 'حلە' },
  { en: 'Amarah', ar: 'العمارة', badini: 'عەمارە', sorani: 'عەمارە' },
  { en: 'Diwaniyah', ar: 'الديوانية', badini: 'دیوانیە', sorani: 'دیوانیە' },
  { en: 'Kut', ar: 'الكوت', badini: 'کووت', sorani: 'کووت' },
  { en: 'Ramadi', ar: 'الرمادي', badini: 'ڕەمادی', sorani: 'ڕەمادی' },
  { en: 'Samawah', ar: 'السماوة', badini: 'سەماوە', sorani: 'سەماوە' },
  { en: 'Baqubah', ar: 'بعقوبة', badini: 'بەعقوبە', sorani: 'بەعقوبە' },
  { en: 'Other City', ar: 'مدينة أخرى', badini: 'باژێرەکێ دی', sorani: 'شارێکی تر' },
];

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  direction: 'rtl' | 'ltr';
  t: typeof translations.en;
  info: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('njzaro_language') as Language;
    if (saved && (saved === 'ar' || saved === 'en' || saved === 'badini' || saved === 'sorani')) {
      return saved;
    }
    return 'ar'; // Default to Arabic as primary regional language with easy 1-click switch to Badini, Sorani, or English
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('njzaro_language', lang);
  };

  const info = LANGUAGES[language] || LANGUAGES.ar;
  const direction = info.direction;
  const t = translations[language] || translations.ar;

  useEffect(() => {
    document.documentElement.lang = language === 'badini' ? 'ku-Arab' : language === 'sorani' ? 'ckb' : language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        direction,
        t,
        info,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
