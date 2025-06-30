// Tipos para Spots Promocionales
export interface PromotionalSpot {
  id: string;
  title: string;
  description: string;
  type: "discount" | "service" | "announcement";
  value: string;
  isActive: boolean;
  active?: boolean; // Para compatibilidad
  startDate: string;
  endDate: string;
  image: string;
  details?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Tipos para Banners
export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  imageUrl?: string; // Para compatibilidad
  cta: string;
  cta_link: string;
  link?: string; // Para compatibilidad
  position: "hero" | "sidebar" | "footer" | "content";
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Tipos para formularios
export interface PromotionalSpotFormData {
  title: string;
  description: string;
  type: "discount" | "service" | "announcement";
  value: string;
  image: string;
  details?: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface BannerFormData {
  title: string;
  description: string;
  image: string;
  cta: string;
  cta_link: string;
  position: "hero" | "sidebar" | "footer" | "content";
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para filtros y búsqueda
export interface PromotionalSpotFilter {
  type?: "discount" | "service" | "announcement";
  isActive?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface BannerFilter {
  position?: "hero" | "sidebar" | "footer" | "content";
  isActive?: boolean;
  search?: string;
}

// Tipos para estadísticas
export interface PromotionalStats {
  totalSpots: number;
  activeSpots: number;
  totalBanners: number;
  activeBanners: number;
  spotsByType: {
    discount: number;
    service: number;
    announcement: number;
  };
  bannersByPosition: {
    hero: number;
    sidebar: number;
    footer: number;
    content: number;
  };
}

// Tipos para configuración
export interface PromotionalConfig {
  maxSpotsPerPage: number;
  maxBannersPerPosition: number;
  defaultSpotDuration: number; // días
  allowedImageFormats: string[];
  maxImageSize: number; // bytes
}

// Tipos para validación
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormErrors {
  [key: string]: string | string[];
}

// Enums útiles
export enum SpotType {
  DISCOUNT = "discount",
  SERVICE = "service",
  ANNOUNCEMENT = "announcement"
}

export enum BannerPosition {
  HERO = "hero",
  SIDEBAR = "sidebar",
  FOOTER = "footer",
  CONTENT = "content"
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc"
}

// Tipos para ordenamiento
export interface SortConfig {
  field: string;
  order: SortOrder;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

// Tipos para acciones masivas
export interface BulkAction {
  id: string;
  label: string;
  icon?: string;
  variant?: "default" | "destructive" | "secondary";
}

export interface BulkActionResult {
  success: string[];
  errors: string[];
  total: number;
}

// Tipos para notificaciones
export interface NotificationConfig {
  title: string;
  description?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}