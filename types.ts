export interface PerfumeSize {
  ml: number;
  price: number;
  originalPrice?: number;
}

export interface Perfume {
  id: number;
  dbId?: string; // Firestore document ID
  brand: string;
  name: string;
  notes: string;
  img: string | null;
  badge: string | null;
  discountPercent?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  category: string;
  sizes: PerfumeSize[];
  isDeleted?: boolean;
  gender?: 'men' | 'women' | 'unisex' | string;
  rating?: number;
  reviewsCount?: number;
  fragranceFamily?: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  description?: string;
  concentration?: string;
  country?: string;
}

export interface StoreSettings {
  announcement: string;
  announcementActive: boolean;
  whatsappNumber: string;
  deliveryFee: number;
}

export interface CartItem {
  key: string;
  id: number;
  name: string;
  brand: string;
  img: string | null;
  ml: number;
  price: number;
  originalPrice?: number;
  qty: number;
}

export interface Review {
  id?: string;
  name: string;
  text: string;
  rating: number;
  date?: number;
  createdAt?: any;
}

export interface HeroShowcaseConfig {
  imageUrl: string;
  fallbackImageUrl?: string;
  badgeLeft: string;
  badgeRight: string;
  titleEn: string;
  titleAr: string;
  tagEn: string;
  tagAr: string;
  actionType: 'shop' | 'brand' | 'category' | 'whatsapp';
  actionTarget?: string;
}
