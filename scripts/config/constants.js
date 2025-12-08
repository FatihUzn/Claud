// === CONSTANTS & CONFIGURATION ===

export const PATHS = {
    // Data files - adjust based on your actual folder structure
    TOURS_DATA: 'data/tours.json',
    BLOG_DATA: 'data/blog-posts.json',
    
    // Language files
    LANGUAGES: 'data/languages/',
    
    // Pages
    PAGES: 'pages/',
    
    // Assets - using your actual Claud/assets path
    IMAGES: 'Claud/assets/images/',
    FALLBACK_IMAGE: 'Claud/assets/fallback.webp'
};

export const IMAGES_PER_LOAD = 6; // Lazy loading batch size

export const DEFAULT_LANGUAGE = 'tr';

export const SUPPORTED_LANGUAGES = ['tr', 'en', 'zh', 'ar'];

export const API_ENDPOINTS = {
    // Add any API endpoints here if needed
};

export const CONFIG = {
    enableDebug: true, // Set to false in production
    animationDuration: 300,
    mobileBreakpoint: 768
};
