import type { PromotionalSpot, Banner, SpotType, BannerPosition } from './types';

// Utilidades para fechas
export const dateUtils = {
  // Formatear fecha para mostrar
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Formatear fecha corta
  formatDateShort: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  // Verificar si una fecha está en el pasado
  isPastDate: (dateString: string): boolean => {
    return new Date(dateString) < new Date();
  },

  // Verificar si una fecha está en el futuro
  isFutureDate: (dateString: string): boolean => {
    return new Date(dateString) > new Date();
  },

  // Calcular días entre fechas
  daysBetween: (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Verificar si un spot está activo por fechas
  isActiveByDate: (startDate: string, endDate: string): boolean => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  },

  // Obtener estado del spot por fechas
  getDateStatus: (startDate: string, endDate: string): 'pending' | 'active' | 'expired' => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'pending';
    if (now > end) return 'expired';
    return 'active';
  }
};

// Utilidades para spots promocionales
export const spotUtils = {
  // Verificar si un spot está completamente activo
  isFullyActive: (spot: PromotionalSpot): boolean => {
    return spot.isActive && dateUtils.isActiveByDate(spot.startDate, spot.endDate);
  },

  // Obtener la etiqueta del tipo
  getTypeLabel: (type: SpotType): string => {
    const labels = {
      discount: 'Descuento',
      service: 'Servicio',
      announcement: 'Anuncio'
    };
    return labels[type];
  },

  // Obtener el color del tipo
  getTypeColor: (type: SpotType): string => {
    const colors = {
      discount: 'bg-green-100 text-green-800',
      service: 'bg-blue-100 text-blue-800',
      announcement: 'bg-purple-100 text-purple-800'
    };
    return colors[type];
  },

  // Obtener estado visual del spot
  getStatusBadge: (spot: PromotionalSpot): { label: string; color: string } => {
    if (!spot.isActive) {
      return { label: 'Inactivo', color: 'bg-gray-100 text-gray-800' };
    }
    
    const dateStatus = dateUtils.getDateStatus(spot.startDate, spot.endDate);
    
    switch (dateStatus) {
      case 'pending':
        return { label: 'Programado', color: 'bg-yellow-100 text-yellow-800' };
      case 'active':
        return { label: 'Activo', color: 'bg-green-100 text-green-800' };
      case 'expired':
        return { label: 'Expirado', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Inactivo', color: 'bg-gray-100 text-gray-800' };
    }
  },

  // Filtrar spots activos
  getActiveSpots: (spots: PromotionalSpot[]): PromotionalSpot[] => {
    return spots.filter(spot => spotUtils.isFullyActive(spot));
  },

  // Ordenar spots por prioridad (activos primero, luego por fecha de inicio)
  sortByPriority: (spots: PromotionalSpot[]): PromotionalSpot[] => {
    return [...spots].sort((a, b) => {
      // Primero los activos
      if (spotUtils.isFullyActive(a) !== spotUtils.isFullyActive(b)) {
        return spotUtils.isFullyActive(b) ? 1 : -1;
      }
      
      // Luego por fecha de inicio (más reciente primero)
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }
};

// Utilidades para banners
export const bannerUtils = {
  // Obtener la etiqueta de la posición
  getPositionLabel: (position: BannerPosition): string => {
    const labels = {
      hero: 'Principal',
      sidebar: 'Lateral',
      footer: 'Pie de página',
      content: 'Contenido'
    };
    return labels[position];
  },

  // Obtener el color de la posición
  getPositionColor: (position: BannerPosition): string => {
    const colors = {
      hero: 'bg-purple-100 text-purple-800',
      sidebar: 'bg-blue-100 text-blue-800',
      footer: 'bg-gray-100 text-gray-800',
      content: 'bg-green-100 text-green-800'
    };
    return colors[position];
  },

  // Obtener descripción de la posición
  getPositionDescription: (position: BannerPosition): string => {
    const descriptions = {
      hero: 'Banner principal en la página de inicio',
      sidebar: 'Banner lateral en páginas de contenido',
      footer: 'Banner en el pie de página',
      content: 'Banner integrado en el contenido'
    };
    return descriptions[position];
  },

  // Filtrar banners activos
  getActiveBanners: (banners: Banner[]): Banner[] => {
    return banners.filter(banner => banner.isActive);
  },

  // Obtener banners por posición
  getBannersByPosition: (banners: Banner[], position: BannerPosition): Banner[] => {
    return banners.filter(banner => banner.position === position && banner.isActive);
  },

  // Verificar si es enlace externo
  isExternalLink: (link: string): boolean => {
    return link.startsWith('http://') || link.startsWith('https://');
  },

  // Validar enlace
  validateLink: (link: string): boolean => {
    if (link.startsWith('/')) return true; // Enlace interno
    try {
      new URL(link);
      return true;
    } catch {
      return false;
    }
  }
};

// Utilidades de validación
export const validationUtils = {
  // Validar URL de imagen
  validateImageUrl: (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      return validExtensions.some(ext => 
        parsedUrl.pathname.toLowerCase().endsWith(ext)
      );
    } catch {
      return false;
    }
  },

  // Validar fechas
  validateDates: (startDate: string, endDate: string): { valid: boolean; error?: string } => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      return { valid: false, error: 'La fecha de fin debe ser posterior a la fecha de inicio' };
    }
    
    if (start < new Date(new Date().setHours(0, 0, 0, 0))) {
      return { valid: false, error: 'La fecha de inicio no puede ser en el pasado' };
    }
    
    return { valid: true };
  },

  // Validar campos requeridos
  validateRequired: (value: any, fieldName: string): { valid: boolean; error?: string } => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return { valid: false, error: `${fieldName} es requerido` };
    }
    return { valid: true };
  },

  // Validar longitud mínima
  validateMinLength: (value: string, minLength: number, fieldName: string): { valid: boolean; error?: string } => {
    if (value.trim().length < minLength) {
      return { valid: false, error: `${fieldName} debe tener al menos ${minLength} caracteres` };
    }
    return { valid: true };
  }
};

// Utilidades de formato
export const formatUtils = {
  // Formatear texto para SEO
  slugify: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Truncar texto
  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  },

  // Capitalizar primera letra
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  // Formatear número con separadores
  formatNumber: (num: number): string => {
    return num.toLocaleString('es-ES');
  }
};

// Utilidades de búsqueda y filtrado
export const searchUtils = {
  // Buscar en spots
  searchSpots: (spots: PromotionalSpot[], query: string): PromotionalSpot[] => {
    if (!query.trim()) return spots;
    
    const searchTerm = query.toLowerCase();
    return spots.filter(spot =>
      spot.title.toLowerCase().includes(searchTerm) ||
      spot.description.toLowerCase().includes(searchTerm) ||
      spot.details?.toLowerCase().includes(searchTerm) ||
      spot.value.toLowerCase().includes(searchTerm)
    );
  },

  // Buscar en banners
  searchBanners: (banners: Banner[], query: string): Banner[] => {
    if (!query.trim()) return banners;
    
    const searchTerm = query.toLowerCase();
    return banners.filter(banner =>
      banner.title.toLowerCase().includes(searchTerm) ||
      banner.description.toLowerCase().includes(searchTerm) ||
      banner.cta.toLowerCase().includes(searchTerm)
    );
  }
};

// Exportar todas las utilidades
export const promotionalUtils = {
  date: dateUtils,
  spot: spotUtils,
  banner: bannerUtils,
  validation: validationUtils,
  format: formatUtils,
  search: searchUtils
};