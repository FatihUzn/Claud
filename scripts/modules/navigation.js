// === NAVIGATION MODULE - Tourism Website ===
// Handles page loading and navigation with proper tourism terminology

import { PATHS, DEFAULT_LANGUAGE } from '../config/constants.js';
import { setLanguage, getCurrentLanguage } from './language.js';
import { showError } from '../utils/helpers.js';

const pageCache = {};

export async function showPage(pageId) {
    try {
        if (!pageId || pageId === '#') pageId = 'hero';
        
        console.log('📄 Loading page:', pageId);
        
        // Hide all page sections
        document.querySelectorAll('.page-section').forEach(sec => {
            sec.classList.remove('active', 'visible');
        });

        let newPage = document.getElementById(pageId);
        
        // If page not in DOM, load it via AJAX
        if (!newPage) {
            if (pageCache[pageId]) {
                // Use cached HTML
                document.getElementById('page-container').insertAdjacentHTML('beforeend', pageCache[pageId]);
            } else {
                // Load from file
                let fileName = pageId.replace('page-', '');
                
                // Legacy name mappings (OLD construction site → NEW tourism site)
                // This ensures old links still work during transition
                const legacyMappings = {
                    'satilik_kiralik': 'tours',      // For sale/rent → Tours
                    'restorasyon': 'blog',            // Restoration → Blog
                    'otel': 'tours-domestic'          // Hotel → Domestic Tours
                };
                
                // Apply mapping if exists
                if (legacyMappings[fileName]) {
                    fileName = legacyMappings[fileName];
                    console.log(`🔄 Legacy mapping: ${pageId} → ${fileName}`);
                }
                
                try {
                    const response = await fetch(`${PATHS.PAGES}${fileName}.html`);
                    
                    if (!response.ok) {
                        // Fallback: try root directory (for old file structure)
                        const retryResponse = await fetch(`${fileName}.html`);
                        
                        if (!retryResponse.ok) {
                            throw new Error(`Page not found: ${fileName}`);
                        }
                        
                        const html = await retryResponse.text();
                        pageCache[pageId] = html;
                        document.getElementById('page-container').insertAdjacentHTML('beforeend', html);
                    } else {
                        const html = await response.text();
                        pageCache[pageId] = html;
                        document.getElementById('page-container').insertAdjacentHTML('beforeend', html);
                    }
                } catch (error) {
                    throw new Error(`Failed to load page: ${error.message}`);
                }
            }
            
            newPage = document.getElementById(pageId);
        }

        if (newPage) {
            // Update URL hash (without triggering hashchange event)
            if (location.hash.replace('#', '') !== pageId) {
                history.replaceState(null, null, `#${pageId}`);
            }
            
            // Show the page
            newPage.classList.add('active');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Re-apply current language to new content
            const currentLang = getCurrentLanguage();
            await setLanguage(currentLang);
            
            // Add visible class after a short delay for animation
            setTimeout(() => {
                newPage.classList.add('visible');
            }, 50);

            // Handle special page-specific logic
            await handlePageSpecificLogic(pageId);
            
            console.log('✅ Page loaded:', pageId);
        } else {
            throw new Error(`Page element not found after loading: ${pageId}`);
        }
        
    } catch (error) {
        console.error('❌ Page loading error:', error);
        showError(`Sayfa yüklenemedi: ${error.message}<br>Lütfen menüyü kullanarak tekrar deneyin.`);
    }
}

// === HANDLE PAGE-SPECIFIC LOGIC ===
async function handlePageSpecificLogic(pageId) {
    // Tours page: check for category filter in URL
    if (pageId === 'page-tours') {
        // Wait a moment for the page HTML to be fully inserted
        setTimeout(() => {
            // Check if category is specified in URL
            const urlParams = new URLSearchParams(location.hash.split('?')[1]);
            const category = urlParams.get('category') || 'all';
            
            // Render tour grid with category filter
            if (window.renderTourGrid) {
                console.log('🎯 Rendering tours with category:', category);
                window.renderTourGrid(category);
            }
        }, 100);
    }
    
    // Blog page: render blog grid
    if (pageId === 'page-blog') {
        setTimeout(() => {
            if (window.renderBlogGrid) {
                console.log('📝 Rendering blog grid');
                window.renderBlogGrid();
            }
        }, 100);
    }
}

// === NAVIGATE TO PAGE (Helper function) ===
export function navigateToPage(pageId, params = {}) {
    let hash = pageId;
    
    // Add query parameters if provided
    if (Object.keys(params).length > 0) {
        const queryString = new URLSearchParams(params).toString();
        hash += `?${queryString}`;
    }
    
    location.hash = hash;
}

// === GET CURRENT PAGE ID ===
export function getCurrentPage() {
    return location.hash.replace('#', '').split('?')[0] || 'hero';
}