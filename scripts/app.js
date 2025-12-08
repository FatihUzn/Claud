// === MAIN APPLICATION FILE - TOURISM WEBSITE ===
// All construction/real estate terminology converted to tourism terms

import { loadTourData, renderTourGrid, openTourDetail, closeTourDetail, loadMoreTourImages, getCurrentGalleryImages } from './modules/tours.js';
import { loadBlogData, renderBlogGrid, openBlogModal, closeBlogModal } from './modules/blog.js';
import { setLanguage, getCurrentLanguage } from './modules/language.js';
import { showPage } from './modules/navigation.js';
import { openGallery, closeLightbox, showNextImage, showPrevImage } from './modules/lightbox.js';

// === GLOBAL SCOPE EXPOSURE (for onclick handlers in HTML) ===
window.renderTourGrid = renderTourGrid;
window.openTourDetail = openTourDetail;
window.closeTourDetail = closeTourDetail;
window.openBlogModal = openBlogModal;
window.closeBlogModal = closeBlogModal;
window.closeModal = closeBlogModal; // Alias for blog modal
window.showPage = showPage;
window.setLanguage = setLanguage;
window.loadMoreTourImages = loadMoreTourImages;
window.closeLightbox = closeLightbox;
window.showNextImage = showNextImage;
window.showPrevImage = showPrevImage;

// Gallery helper - expose current images for onclick
window.openGlobalGallery = (index) => {
    const images = getCurrentGalleryImages();
    if (images && images.length > 0) {
        openGallery(images, index);
    }
};

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Tourism website initializing...');

    // 1. Setup Language
    const savedLang = localStorage.getItem('lang') || 'tr';
    await setLanguage(savedLang);
    console.log('✅ Language loaded:', savedLang);

    // 2. Load Tour Data
    try {
        await loadTourData();
        console.log('✅ Tour data loaded');
    } catch (error) {
        console.error('❌ Tour data loading failed:', error);
    }

    // 3. Load Blog Data
    try {
        await loadBlogData();
        console.log('✅ Blog data loaded');
        
        // Render blog grid if on homepage
        const blogContainer = document.getElementById('blog-grid-display');
        if (blogContainer) {
            renderBlogGrid('blog-grid-display');
        }
    } catch (error) {
        console.error('❌ Blog data loading failed:', error);
    }

    // 4. Initial Page Navigation
    const initialPage = location.hash.replace('#', '') || 'hero';
    await showPage(initialPage);
    console.log('✅ Initial page loaded:', initialPage);

    // 5. Setup Hash Navigation
    window.addEventListener('hashchange', async () => {
        const newPage = location.hash.replace('#', '') || 'hero';
        await showPage(newPage);
    });

    // 6. Menu Toggle (Mobile)
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.getElementById('navbar')?.classList.toggle('open');
        });
    }

    // 7. Category Link Handlers (for tour filtering)
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', async (e) => {
            const category = link.getAttribute('data-category');
            
            // If it's a link (not already navigating via href)
            if (link.tagName === 'A' && link.getAttribute('href') === '#page-tours') {
                e.preventDefault();
                location.hash = 'page-tours';
                
                // Wait for page to load, then filter
                setTimeout(() => {
                    if (window.renderTourGrid) {
                        window.renderTourGrid(category);
                    }
                }, 200);
            }
        });
    });

    // 8. Global Click Handlers
    document.body.addEventListener('click', (e) => {
        // Back button handler
        if (e.target.classList.contains('btn-page-back')) {
            e.preventDefault();
            location.hash = 'hero';
            document.getElementById('navbar')?.classList.remove('open');
        }
        
        // Page navigation links
        if (e.target.matches('[data-page]')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            location.hash = page;
            document.getElementById('navbar')?.classList.remove('open');
        }
        
        // Close modals on backdrop click
        if (e.target.id === 'lightbox-modal') {
            closeLightbox();
        }
        if (e.target.id === 'blog-modal') {
            closeBlogModal();
        }
    });

    // 9. Keyboard Controls
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            // Close tour detail modal
            const tourDetail = document.getElementById("tour-detail");
            if (tourDetail && tourDetail.style.display !== "none") {
                closeTourDetail();
                return;
            }
            
            // Close lightbox
            const lightbox = document.getElementById("lightbox-modal");
            if (lightbox && lightbox.style.display !== "none") {
                closeLightbox();
                return;
            }
            
            // Close blog modal
            const blogModal = document.getElementById("blog-modal");
            if (blogModal && blogModal.classList.contains('active')) {
                closeBlogModal();
                return;
            }
        }
        
        // Arrow keys for lightbox navigation
        const lightbox = document.getElementById('lightbox-modal');
        if (lightbox && lightbox.style.display !== 'none') {
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });

    // 10. Lightbox Button Event Listeners
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const closeLightboxBtn = document.getElementById('close-lightbox');

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });
    }

    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', closeLightbox);
    }

    console.log('✅ Tourism website fully initialized');
});