// === CONFIGURATION CONSTANTS - Tourism Website ===
// All paths updated to tourism terminology

export const PATHS = {
    // Data files
    TOURS_DATA: 'data/tours.json',
    BLOG_DATA: 'data/blog-posts.json',
    LANGUAGES: 'data/languages/',
    
    // Page files (NEW - proper tourism names)
    PAGES: 'pages/',
    
    // Assets
    IMAGES: 'assets/images/',
    FALLBACK_IMAGE: 'assets/fallback.webp',
    
    // API endpoints (if needed)
    API_BASE: '/api/'
};

export const IMAGES_PER_LOAD = 6;
export const DEFAULT_LANGUAGE = 'tr';

export const SUPPORTED_LANGUAGES = ['tr', 'en', 'zh', 'ar'];

export const TOUR_CATEGORIES = {
    ALL: 'all',
    DOMESTIC: 'domestic',      // Yurt İçi (TUR-TR-*)
    INTERNATIONAL: 'international'  // Yurt Dışı (TUR-D-*)
};

export const ANIMATION_DURATION = 300; // ms
export const DEBOUNCE_DELAY = 150; // ms