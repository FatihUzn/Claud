// === TOURS MODULE - Tourism Website ===
// Converted from construction/real estate terminology

import { PATHS, IMAGES_PER_LOAD } from '../config/constants.js';
import { generateImages, showError } from '../utils/helpers.js';
import { openGallery } from './lightbox.js';

let tourData = {};
let currentTourGallery = {
    images: [],
    index: 0
};

// === LOAD TOUR DATA FROM JSON ===
export async function loadTourData() {
    try {
        const response = await fetch(PATHS.TOURS_DATA);
        if (!response.ok) throw new Error('Tour data could not be loaded');
        
        const data = await response.json();
        
        // Generate image arrays from prefix + count
        Object.entries(data).forEach(([id, tour]) => {
            if (tour.imagePrefix && tour.imageCount) {
                tour.images = generateImages(tour.imagePrefix + '-', tour.imageCount);
            }
        });
        
        tourData = data;
        console.log('✅ Tour data loaded:', Object.keys(tourData).length, 'tours');
        return data;
        
    } catch (error) {
        console.error('❌ Tour data loading error:', error);
        showError('Tur verileri yüklenemedi. Lütfen sayfayı yenileyin.');
        throw error;
    }
}

// === RENDER TOUR GRID (with category filtering) ===
export function renderTourGrid(category = 'all') {
    const grid = document.getElementById('tours-grid');
    const titleEl = document.getElementById('tours-page-title');
    const subtitleEl = document.getElementById('tours-page-subtitle');
    
    if (!grid) {
        console.warn('⚠️ Tour grid container not found');
        return;
    }

    grid.innerHTML = ''; // Clear existing content

    // Update page title based on category
    if (titleEl) {
        if (category === 'domestic') {
            titleEl.textContent = "Yurt İçi Kültür Turları";
            if (subtitleEl) subtitleEl.textContent = "Anadolu'nun eşsiz güzelliklerini keşfedin";
        } else if (category === 'international') {
            titleEl.textContent = "Yurt Dışı Rotalar";
            if (subtitleEl) subtitleEl.textContent = "Dünyanın en popüler destinasyonları";
        } else {
            titleEl.textContent = "Tüm Rotalarımız";
            if (subtitleEl) subtitleEl.textContent = "Size uygun bir tatil mutlaka var";
        }
    }

    // Filter tours by category
    const tours = Object.entries(tourData).filter(([id, tour]) => {
        if (category === 'all') return true;
        // Domestic: IDs starting with TUR-TR
        if (category === 'domestic') return id.startsWith('TUR-TR');
        // International: IDs starting with TUR-D
        if (category === 'international') return id.startsWith('TUR-D');
        return true;
    });

    if (tours.length === 0) {
        grid.innerHTML = '<p style="width:100%; text-align:center; color:#999;">Bu kategoride tur bulunamadı.</p>';
        return;
    }

    // Generate HTML cards
    tours.forEach(([id, tour]) => {
        const mainImage = tour.images && tour.images.length > 0 
            ? tour.images[0] 
            : PATHS.FALLBACK_IMAGE;

        const cardHTML = `
            <div class="tour-card" onclick="window.openTourDetail('${id}')">
                <img loading="lazy" 
                     src="${mainImage}" 
                     alt="${tour.title}"
                     onerror="this.src='${PATHS.FALLBACK_IMAGE}'; this.onerror=null;">
                <h3>${tour.title}</h3>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });

    console.log('✅ Tour grid rendered:', tours.length, 'cards (category:', category + ')');
}

// === OPEN TOUR DETAIL MODAL ===
export function openTourDetail(tourID) {
    const tour = tourData[tourID];

    if (!tour) {
        console.error(`❌ Tour not found: ${tourID}`);
        alert("Bu turun detaylarına şu an ulaşılamıyor.");
        return;
    }

    console.log('📖 Opening tour detail:', tour.title);

    const detail = document.getElementById("tour-detail");
    const content = document.getElementById("tour-detail-content");
    
    if (!detail || !content) {
        console.error('❌ Tour detail modal elements not found');
        return;
    }

    // Build modal content HTML
    content.innerHTML = `
        <h2 class="page-title-gold">${tour.title}</h2>
        
        <div class="tour-info">
            <div style="margin-bottom: 10px;">
                <i class="fas fa-map-marker-alt" style="color: #4c99ff; width: 20px;"></i> 
                <strong>Lokasyon:</strong> 
                <span style="color: #666;">${tour.location} (${tour.area})</span>
            </div>
            
            <div style="margin-bottom: 10px;">
                <i class="fas fa-clock" style="color: #4c99ff; width: 20px;"></i> 
                <strong>Süre & Fiyat:</strong> 
                <span style="color: #0056b3; font-weight: bold;">${tour.price}</span>
            </div>
            
            <div style="margin-bottom: 10px;">
                <i class="fas fa-bed" style="color: #4c99ff; width: 20px;"></i> 
                <strong>Konaklama:</strong> 
                <span style="color: #666;">${tour.rooms}</span>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="line-height: 1.7;">${tour.desc}</p>

            <div style="margin-top: 25px; text-align: center;">
                <a href="mailto:info@walkaboutravel.com?subject=Rezervasyon: ${tour.title}" 
                   class="btn">
                    <i class="fas fa-paper-plane"></i> Rezervasyon Yap
                </a>
            </div>
        </div>

        <div class="detail-gallery" id="detail-gallery-container"></div>
        <div id="gallery-loader" style="text-align:center; margin-top:20px;"></div>
    `;

    // Setup gallery
    currentTourGallery.images = tour.images || [];
    currentTourGallery.index = 0;
    
    // Expose to global for onclick handlers
    window.currentGalleryImages = currentTourGallery.images;
    
    // Load first batch of images
    loadMoreTourImages();
    
    // Show modal
    detail.style.display = "block";
    document.body.style.overflow = "hidden";
}

// === CLOSE TOUR DETAIL MODAL ===
export function closeTourDetail() {
    const detail = document.getElementById("tour-detail");
    if (detail) {
        detail.style.display = "none";
    }
    document.body.style.overflow = "auto";
    console.log('✅ Tour detail modal closed');
}

// === LOAD MORE TOUR IMAGES (Lazy Loading) ===
export function loadMoreTourImages() {
    const container = document.getElementById('detail-gallery-container');
    const loader = document.getElementById('gallery-loader');
    
    if (!container) {
        console.warn('⚠️ Gallery container not found');
        return;
    }

    if (currentTourGallery.images.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#999;'>Bu tur için görsel bulunmuyor.</p>";
        return;
    }

    // Get next batch of images
    const endIndex = Math.min(
        currentTourGallery.index + IMAGES_PER_LOAD, 
        currentTourGallery.images.length
    );
    
    const imagesToLoad = currentTourGallery.images.slice(
        currentTourGallery.index, 
        endIndex
    );

    // Generate HTML for images
    const html = imagesToLoad.map((img, i) => {
        const absoluteIndex = currentTourGallery.index + i;
        return `
            <img loading="lazy" 
                 src="${img}" 
                 alt="Tur Görseli ${absoluteIndex + 1}"
                 onclick="window.openGlobalGallery(${absoluteIndex})" 
                 onerror="this.src='${PATHS.FALLBACK_IMAGE}'; this.onerror=null;" 
                 style="cursor:pointer;">
        `;
    }).join('');

    container.insertAdjacentHTML('beforeend', html);
    currentTourGallery.index = endIndex;

    // Show/hide "Load More" button
    if (loader) {
        if (currentTourGallery.index < currentTourGallery.images.length) {
            loader.innerHTML = `
                <button class="btn" onclick="window.loadMoreTourImages()">
                    Daha Fazla Göster (${currentTourGallery.images.length - currentTourGallery.index} kaldı)
                </button>
            `;
        } else {
            loader.innerHTML = '';
        }
    }

    console.log(`✅ Loaded ${imagesToLoad.length} images (${currentTourGallery.index}/${currentTourGallery.images.length})`);
}

// === GET CURRENT GALLERY IMAGES (for lightbox) ===
export function getCurrentGalleryImages() {
    return currentTourGallery.images;
}