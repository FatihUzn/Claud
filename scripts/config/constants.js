// === CONSTANTS & CONFIGURATION ===
// For GitHub Pages: fatihuzn.github.io/Claud/

// Base path for GitHub Pages subdirectory
const BASE_PATH = '/Claud/';

export const PATHS = {
    // Data files
    TOURS_DATA: BASE_PATH + 'data/tours.json',
    BLOG_DATA: BASE_PATH + 'data/blog-posts.json',
    
    // Language files
    LANGUAGES: BASE_PATH + 'data/languages/',
    
    // Pages
    PAGES: BASE_PATH + 'pages/',
    
    // Assets
    IMAGES: BASE_PATH + 'assets/images/',
    FALLBACK_IMAGE: BASE_PATH + 'assets/fallback.webp'
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

// Helper function to get full path
export function getFullPath(relativePath) {
    return BASE_PATH + relativePath;
}
