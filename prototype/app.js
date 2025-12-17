/* ========================================
   Trust Estate MVP Prototype - JavaScript
   ======================================== */

// ========================================
// State Management
// ========================================

const state = {
    isLoggedIn: false,
    user: null,
    credits: 5,
    selectedListing: null,
    selectedSlot: null,
    currentStep: 1,
    newListing: {
        type: '',
        title: '',
        zone: '',
        price: 0,
        surface: 0,
        bedrooms: 0,
        bathrooms: 0,
        features: {},
        photos: [],
        description: ''
    },
    aiGenerationsLeft: 3,
    myListings: [],
    myReservations: [],
    myVisits: []
};

// ========================================
// Mock Data
// ========================================

const mockListings = [
    {
        id: 1,
        title: "Villa T4 avec piscine à Ivandry",
        price: 450000000,
        type: "sale",
        zone: "tana-ivandry",
        zoneDisplay: "Antananarivo - Ivandry",
        surface: 200,
        bedrooms: 4,
        bathrooms: 3,
        features: { parking: true, garden: true, pool: true, furnished: false },
        photos: ["🏠"],
        description: "Magnifique villa moderne avec piscine, jardin arboré et vue panoramique. Idéale pour une famille, proche des écoles internationales.",
        trustScore: 85,
        status: "active",
        seller: { name: "Jean Rakoto", phone: "+261 34 00 000 01", trustScore: 88 },
        sellerHistory: { totalListings: 5, successfulSales: 3, averageRating: 4.2 }
    },
    {
        id: 2,
        title: "Appartement T3 centre-ville Analakely",
        price: 25000000,
        type: "rent",
        zone: "tana-analakely",
        zoneDisplay: "Antananarivo - Analakely",
        surface: 85,
        bedrooms: 3,
        bathrooms: 1,
        features: { parking: false, garden: false, pool: false, furnished: true },
        photos: ["🏢"],
        description: "Bel appartement lumineux au cœur d'Analakely. Entièrement meublé et équipé, proche de toutes commodités.",
        trustScore: 78,
        status: "active",
        seller: { name: "Marie Razafy", phone: "+261 34 00 000 02", trustScore: 82 },
        sellerHistory: { totalListings: 3, successfulSales: 2, averageRating: 4.5 }
    },
    {
        id: 3,
        title: "Maison T5 avec grand jardin",
        price: 320000000,
        type: "sale",
        zone: "tana-ankorondrano",
        zoneDisplay: "Antananarivo - Ankorondrano",
        surface: 180,
        bedrooms: 5,
        bathrooms: 2,
        features: { parking: true, garden: true, pool: false, furnished: false },
        photos: ["🏡"],
        description: "Grande maison familiale avec jardin de 500m². Quartier calme et sécurisé, idéal pour famille avec enfants.",
        trustScore: 92,
        status: "active",
        seller: { name: "Paul Andria", phone: "+261 34 00 000 03", trustScore: 95 },
        sellerHistory: { totalListings: 8, successfulSales: 7, averageRating: 4.8 }
    },
    {
        id: 4,
        title: "Studio meublé Ankorondrano",
        price: 8000000,
        type: "rent",
        zone: "tana-ankorondrano",
        zoneDisplay: "Antananarivo - Ankorondrano",
        surface: 35,
        bedrooms: 1,
        bathrooms: 1,
        features: { parking: false, garden: false, pool: false, furnished: true },
        photos: ["🏬"],
        description: "Studio moderne entièrement équipé. Parfait pour un jeune professionnel. Eau et électricité inclus.",
        trustScore: 72,
        status: "active",
        seller: { name: "Luc Rabe", phone: "+261 34 00 000 04", trustScore: 75 },
        sellerHistory: { totalListings: 2, successfulSales: 1, averageRating: 4.0 }
    },
    {
        id: 5,
        title: "Terrain constructible 1000m²",
        price: 180000000,
        type: "sale",
        zone: "tana-ivandry",
        zoneDisplay: "Antananarivo - Ivandry",
        surface: 1000,
        bedrooms: 0,
        bathrooms: 0,
        features: { parking: false, garden: false, pool: false, furnished: false },
        photos: ["🌳"],
        description: "Terrain plat constructible dans un quartier résidentiel. Idéal pour projet de construction villa ou immeuble.",
        trustScore: 88,
        status: "active",
        seller: { name: "Sophie Ranaivo", phone: "+261 34 00 000 05", trustScore: 90 },
        sellerHistory: { totalListings: 4, successfulSales: 3, averageRating: 4.6 }
    },
    {
        id: 6,
        title: "Local commercial centre Analakely",
        price: 35000000,
        type: "rent",
        zone: "tana-analakely",
        zoneDisplay: "Antananarivo - Analakely",
        surface: 120,
        bedrooms: 0,
        bathrooms: 1,
        features: { parking: false, garden: false, pool: false, furnished: false },
        photos: ["🏪"],
        description: "Local commercial idéalement situé en plein centre-ville. Grande vitrine, fort passage piétons.",
        trustScore: 80,
        status: "active",
        seller: { name: "Eric Rakoto", phone: "+261 34 00 000 06", trustScore: 83 },
        sellerHistory: { totalListings: 6, successfulSales: 4, averageRating: 4.3 }
    }
];

const mockSlots = [
    { date: "2025-01-20", time: "09:00", available: true },
    { date: "2025-01-20", time: "10:00", available: true },
    { date: "2025-01-20", time: "11:00", available: false },
    { date: "2025-01-20", time: "14:00", available: true },
    { date: "2025-01-20", time: "15:00", available: true },
    { date: "2025-01-21", time: "09:00", available: true },
    { date: "2025-01-21", time: "10:00", available: false },
    { date: "2025-01-21", time: "14:00", available: true },
    { date: "2025-01-22", time: "10:00", available: true }
];

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedListings();
    renderListings(mockListings);
    setupEventListeners();
    updateAuthUI();
});

function setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo(btn.dataset.screen);
        });
    });

    // Auth button
    document.getElementById('authBtn').addEventListener('click', () => {
        if (state.isLoggedIn) {
            logout();
        } else {
            openLoginModal();
        }
    });

    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });

    // Star rating
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', () => {
            setRating(parseInt(star.dataset.rating));
        });
    });
}

// ========================================
// Navigation
// ========================================

function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${screenId}`).classList.add('active');

    // Scroll to top
    window.scrollTo(0, 0);

    // Screen-specific initialization
    if (screenId === 'dashboard') {
        renderDashboard();
    } else if (screenId === 'create') {
        resetCreateForm();
    }
}

// ========================================
// Listings
// ========================================

function renderFeaturedListings() {
    const grid = document.getElementById('featuredListings');
    grid.innerHTML = mockListings.slice(0, 3).map(listing => createListingCard(listing)).join('');
}

function renderListings(listings) {
    const grid = document.getElementById('listingsGrid');
    const noResults = document.getElementById('noResults');

    if (listings.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        grid.innerHTML = listings.map(listing => createListingCard(listing)).join('');
    }
}

function createListingCard(listing) {
    const priceFormatted = formatPrice(listing.price);
    const typeLabel = listing.type === 'sale' ? 'Vente' : 'Location';

    return `
        <div class="listing-card" onclick="showListing(${listing.id})">
            <div class="listing-image">${listing.photos[0]}</div>
            <div class="listing-content">
                <span class="listing-type">${typeLabel}</span>
                <h3 class="listing-title">${listing.title}</h3>
                <p class="listing-price">${priceFormatted} Ar${listing.type === 'rent' ? '/mois' : ''}</p>
                <div class="listing-details">
                    <span>📐 ${listing.surface}m²</span>
                    ${listing.bedrooms > 0 ? `<span>🛏️ ${listing.bedrooms}</span>` : ''}
                    <span>📍 ${listing.zoneDisplay.split(' - ')[1]}</span>
                </div>
                <div class="listing-trust">
                    <span class="trust-score">⭐ ${listing.trustScore}</span>
                    <span>Score de confiance</span>
                </div>
            </div>
        </div>
    `;
}

function showListing(id) {
    const listing = mockListings.find(l => l.id === id);
    if (!listing) return;

    state.selectedListing = listing;

    const container = document.getElementById('listingDetail');
    const priceFormatted = formatPrice(listing.price);

    container.innerHTML = `
        <div class="detail-gallery">
            <div class="detail-main-image">${listing.photos[0]}</div>
            <div class="detail-thumbnails">
                <div class="detail-thumb"></div>
                <div class="detail-thumb"></div>
                <div class="detail-thumb"></div>
            </div>
        </div>
        <div class="detail-info">
            <div class="detail-header">
                <div>
                    <span class="listing-type">${listing.type === 'sale' ? 'Vente' : 'Location'}</span>
                    <h1 class="detail-title">${listing.title}</h1>
                </div>
                <span class="detail-price">${priceFormatted} Ar${listing.type === 'rent' ? '/mois' : ''}</span>
            </div>
            <p class="detail-zone">📍 ${listing.zoneDisplay}</p>
            
            <div class="detail-features">
                <div class="feature-item">
                    <span class="feature-icon">📐</span>
                    <span class="feature-label">${listing.surface}m²</span>
                </div>
                ${listing.bedrooms > 0 ? `
                <div class="feature-item">
                    <span class="feature-icon">🛏️</span>
                    <span class="feature-label">${listing.bedrooms} chambres</span>
                </div>
                ` : ''}
                ${listing.bathrooms > 0 ? `
                <div class="feature-item">
                    <span class="feature-icon">🚿</span>
                    <span class="feature-label">${listing.bathrooms} SdB</span>
                </div>
                ` : ''}
                ${listing.features.parking ? `<div class="feature-item"><span class="feature-icon">🚗</span><span class="feature-label">Parking</span></div>` : ''}
                ${listing.features.garden ? `<div class="feature-item"><span class="feature-icon">🌳</span><span class="feature-label">Jardin</span></div>` : ''}
                ${listing.features.pool ? `<div class="feature-item"><span class="feature-icon">🏊</span><span class="feature-label">Piscine</span></div>` : ''}
                ${listing.features.furnished ? `<div class="feature-item"><span class="feature-icon">🛋️</span><span class="feature-label">Meublé</span></div>` : ''}
            </div>
            
            <p class="detail-description">${listing.description}</p>
            
            <div class="seller-preview">
                <div class="seller-hidden">
                    <p>🔒 Contact vendeur masqué</p>
                    <small>Réservez une visite pour accéder aux coordonnées</small>
                </div>
            </div>
            
            <div class="listing-trust" style="margin-bottom: 1.5rem;">
                <span class="trust-score">⭐ ${listing.trustScore}</span>
                <span>Score de confiance • ${listing.sellerHistory.totalListings} annonces • ${listing.sellerHistory.averageRating}★ moyenne</span>
            </div>
            
            <button class="btn-primary" onclick="showReservation(${listing.id})">
                📅 Réserver une visite
            </button>
        </div>
    `;

    navigateTo('detail');
}

function applyFilters() {
    const type = document.getElementById('filterType').value;
    const minPrice = parseInt(document.getElementById('filterMinPrice').value) || 0;
    const maxPrice = parseInt(document.getElementById('filterMaxPrice').value) || Infinity;

    const filtered = mockListings.filter(listing => {
        if (type && listing.type !== type) return false;
        if (listing.price < minPrice) return false;
        if (listing.price > maxPrice) return false;
        return true;
    });

    renderListings(filtered);
}

// ========================================
// Reservation
// ========================================

function showReservation(listingId) {
    if (!checkAuth()) return;

    const listing = mockListings.find(l => l.id === listingId);
    if (!listing) return;

    state.selectedListing = listing;
    state.selectedSlot = null;

    // Render summary
    document.getElementById('reservationSummary').innerHTML = `
        <h4>${listing.title}</h4>
        <p>📍 ${listing.zoneDisplay}</p>
        <p>${formatPrice(listing.price)} Ar${listing.type === 'rent' ? '/mois' : ''}</p>
    `;

    // Render slots
    const slotsGrid = document.getElementById('slotsGrid');
    slotsGrid.innerHTML = mockSlots.map((slot, index) => `
        <button class="slot-btn ${slot.available ? '' : 'unavailable'}" 
                data-index="${index}"
                ${slot.available ? `onclick="selectSlot(${index})"` : 'disabled'}>
            ${slot.date}<br>${slot.time}
        </button>
    `).join('');

    document.getElementById('confirmBtn').disabled = true;

    navigateTo('reservation');
}

function selectSlot(index) {
    const slot = mockSlots[index];
    if (!slot.available) return;

    state.selectedSlot = slot;

    // Update UI
    document.querySelectorAll('.slot-btn').forEach((btn, i) => {
        btn.classList.toggle('selected', i === index);
    });

    document.getElementById('confirmBtn').disabled = false;
}

function confirmReservation() {
    if (!state.selectedSlot || !state.selectedListing) return;

    // Create reservation
    const reservation = {
        id: Date.now(),
        listing: state.selectedListing,
        slot: state.selectedSlot,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    state.myVisits.push(reservation);

    showConfirmation();
}

function showConfirmation() {
    const listing = state.selectedListing || mockListings[0];
    const slot = state.selectedSlot || mockSlots[0];

    document.getElementById('confirmationDetails').innerHTML = `
        <p><strong>Bien:</strong> ${listing.title}</p>
        <p><strong>Date:</strong> ${slot.date} à ${slot.time}</p>
        <p><strong>Adresse:</strong> ${listing.zoneDisplay}</p>
    `;

    document.getElementById('sellerContact').innerHTML = `
        <h4>🎉 Coordonnées du vendeur</h4>
        <p><strong>${listing.seller.name}</strong></p>
        <p>📞 ${listing.seller.phone}</p>
    `;

    navigateTo('confirmation');
}

// ========================================
// Feedback
// ========================================

function showFeedback() {
    const listing = state.selectedListing || mockListings[0];

    document.getElementById('feedbackListing').innerHTML = `
        <p><strong>${listing.title}</strong></p>
        <p>Visite du ${state.selectedSlot?.date || '20/01/2025'}</p>
    `;

    // Reset rating
    document.querySelectorAll('.star').forEach(star => {
        star.classList.remove('active');
        star.textContent = '☆';
    });
    document.getElementById('feedbackComment').value = '';

    navigateTo('feedback');
}

function setRating(rating) {
    document.querySelectorAll('.star').forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
            star.textContent = '★';
        } else {
            star.classList.remove('active');
            star.textContent = '☆';
        }
    });
}

function submitFeedback() {
    const rating = document.querySelectorAll('.star.active').length;
    const comment = document.getElementById('feedbackComment').value;

    if (rating === 0) {
        alert('Veuillez donner une note');
        return;
    }

    alert(`Merci pour votre feedback ! Note: ${rating}/5`);
    navigateTo('dashboard');
}

// ========================================
// Dashboard
// ========================================

function renderDashboard() {
    document.getElementById('statCredits').textContent = state.credits;
    document.getElementById('statListings').textContent = state.myListings.length;
    document.getElementById('statReservations').textContent = state.myReservations.length;

    // My listings
    const myListingsGrid = document.getElementById('myListingsGrid');
    if (state.myListings.length === 0) {
        myListingsGrid.innerHTML = '<p style="color: var(--gray-500)">Aucune annonce. Créez votre première annonce !</p>';
    } else {
        myListingsGrid.innerHTML = state.myListings.map(listing => createListingCard(listing)).join('');
    }

    // My visits
    const visitsList = document.getElementById('myVisitsList');
    if (state.myVisits.length === 0) {
        visitsList.innerHTML = '<p style="color: var(--gray-500)">Aucune visite programmée.</p>';
    } else {
        visitsList.innerHTML = state.myVisits.map(visit => `
            <div class="reservation-item" style="background: var(--white); padding: 1rem; border-radius: var(--radius); margin-bottom: 1rem;">
                <h4>${visit.listing.title}</h4>
                <p>📅 ${visit.slot.date} à ${visit.slot.time}</p>
                <span style="color: var(--secondary)">✅ Confirmée</span>
                ${visit.slot.date < new Date().toISOString().split('T')[0] ?
                '<button onclick="showFeedback()" style="margin-left: 1rem; padding: 0.5rem 1rem; background: var(--accent); color: white; border: none; border-radius: 6px; cursor: pointer;">Donner un feedback</button>' : ''}
            </div>
        `).join('');
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabId}`);
    });
}

// ========================================
// Create Listing
// ========================================

function resetCreateForm() {
    state.currentStep = 1;
    state.newListing = { type: '', title: '', zone: '', price: 0, surface: 0, bedrooms: 0, bathrooms: 0, features: {}, photos: [], description: '' };
    state.aiGenerationsLeft = 3;

    updateStepUI();

    // Reset form fields
    document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('listingTitle').value = '';
    document.getElementById('listingPrice').value = '';
    document.getElementById('listingSurface').value = '';
    document.getElementById('listingBedrooms').value = '';
    document.getElementById('listingBathrooms').value = '';
    document.getElementById('listingDescription').value = '';
    document.getElementById('photoPreview').innerHTML = '';
    document.getElementById('aiCounter').textContent = '3 générations restantes';
}

function selectType(type) {
    state.newListing.type = type;

    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.type === type);
    });

    setTimeout(() => nextStep(2), 300);
}

function nextStep(step) {
    // Validate current step
    if (step === 3) {
        state.newListing.title = document.getElementById('listingTitle').value;
        state.newListing.zone = document.getElementById('listingZone').value;
        state.newListing.price = parseInt(document.getElementById('listingPrice').value) || 0;
        state.newListing.surface = parseInt(document.getElementById('listingSurface').value) || 0;
        state.newListing.bedrooms = parseInt(document.getElementById('listingBedrooms').value) || 0;
        state.newListing.bathrooms = parseInt(document.getElementById('listingBathrooms').value) || 0;
        state.newListing.features = {
            parking: document.getElementById('featureParking').checked,
            garden: document.getElementById('featureGarden').checked,
            pool: document.getElementById('featurePool').checked,
            furnished: document.getElementById('featureFurnished').checked
        };
    }

    if (step === 5) {
        state.newListing.description = document.getElementById('listingDescription').value;
        document.getElementById('currentBalance').textContent = `${state.credits} crédits`;
        document.getElementById('newBalance').textContent = `${state.credits - 1} crédits`;
    }

    state.currentStep = step;
    updateStepUI();
}

function updateStepUI() {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 === state.currentStep) step.classList.add('active');
        if (index + 1 < state.currentStep) step.classList.add('completed');
    });

    // Show current step content
    document.querySelectorAll('.create-step-content').forEach((content, index) => {
        content.classList.toggle('active', index + 1 === state.currentStep);
    });
}

function handlePhotoUpload(event) {
    const files = event.target.files;
    const preview = document.getElementById('photoPreview');

    for (let i = 0; i < files.length; i++) {
        state.newListing.photos.push(files[i].name);
        preview.innerHTML += `<div class="photo-preview-item">📷</div>`;
    }
}

function generateDescription() {
    if (state.aiGenerationsLeft <= 0) {
        alert('Limite de générations atteinte');
        return;
    }

    const btn = document.getElementById('aiGenerateBtn');
    btn.textContent = '⏳ Génération...';
    btn.disabled = true;

    // Simulate AI generation
    setTimeout(() => {
        const descriptions = [
            "Magnifique bien situé dans un quartier prisé. Cette propriété offre un cadre de vie exceptionnel avec ses espaces lumineux et ses finitions de qualité. Proche de toutes commodités, c'est l'opportunité idéale pour votre projet immobilier.",
            "Superbe opportunité dans ce secteur recherché. Ce bien vous séduira par son agencement optimisé et son environnement privilégié. À découvrir sans tarder pour apprécier tout son potentiel.",
            "Bien d'exception dans un emplacement stratégique. Les volumes généreux et la qualité des prestations en font une propriété rare sur le marché. Ne manquez pas cette occasion unique."
        ];

        const index = 3 - state.aiGenerationsLeft;
        document.getElementById('listingDescription').value = descriptions[index % 3];

        state.aiGenerationsLeft--;
        document.getElementById('aiCounter').textContent = `${state.aiGenerationsLeft} génération${state.aiGenerationsLeft > 1 ? 's' : ''} restante${state.aiGenerationsLeft > 1 ? 's' : ''}`;

        btn.textContent = '✨ Générer avec IA';
        btn.disabled = false;
    }, 1500);
}

function publishListing() {
    if (state.credits < 1) {
        alert('Crédits insuffisants !');
        return;
    }

    // Create new listing
    const newListing = {
        id: Date.now(),
        ...state.newListing,
        zoneDisplay: document.getElementById('listingZone').options[document.getElementById('listingZone').selectedIndex].text,
        photos: ['🏠'],
        trustScore: 50,
        status: 'active',
        seller: state.user || { name: 'Vous', phone: '+261 34 00 000 00' },
        sellerHistory: { totalListings: 1, successfulSales: 0, averageRating: 0 }
    };

    state.myListings.push(newListing);
    mockListings.unshift(newListing);

    // Deduct credit
    state.credits--;
    updateCreditsDisplay();

    // Show published preview
    document.getElementById('publishedPreview').innerHTML = `
        <h4>${newListing.title}</h4>
        <p>📍 ${newListing.zoneDisplay}</p>
        <p>${formatPrice(newListing.price)} Ar</p>
    `;

    navigateTo('published');
}

function viewPublishedListing() {
    if (state.myListings.length > 0) {
        showListing(state.myListings[state.myListings.length - 1].id);
    }
}

// ========================================
// Authentication
// ========================================

function checkAuth() {
    if (!state.isLoggedIn) {
        openLoginModal();
        return false;
    }
    return true;
}

function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function closeModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('phoneLoginForm').classList.add('hidden');
    document.getElementById('emailLoginForm').classList.add('hidden');
}

function loginWithPhone() {
    document.getElementById('phoneLoginForm').classList.remove('hidden');
    document.getElementById('emailLoginForm').classList.add('hidden');
}

function loginWithEmail() {
    document.getElementById('emailLoginForm').classList.remove('hidden');
    document.getElementById('phoneLoginForm').classList.add('hidden');
}

function loginWithGoogle() {
    simulateLogin('Google User', 'google@gmail.com');
}

function submitPhoneLogin() {
    const phone = document.getElementById('phoneInput').value;
    if (phone) {
        simulateLogin('Utilisateur', phone);
    }
}

function submitEmailLogin() {
    const email = document.getElementById('emailInput').value;
    if (email) {
        simulateLogin('Utilisateur', email);
    }
}

function simulateLogin(name, contact) {
    state.isLoggedIn = true;
    state.user = {
        id: 'u1',
        name: name,
        contact: contact,
        phoneVerified: true,
        trustScore: 50
    };
    state.credits = 5; // Initial credits

    closeModal();
    updateAuthUI();

    // Show welcome message
    alert(`Bienvenue ${name} ! Vous avez reçu 5 crédits gratuits.`);
}

function logout() {
    state.isLoggedIn = false;
    state.user = null;
    state.credits = 0;
    state.myListings = [];
    state.myReservations = [];
    state.myVisits = [];

    updateAuthUI();
    navigateTo('home');
}

function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    const creditsDisplay = document.getElementById('creditsDisplay');

    if (state.isLoggedIn) {
        authBtn.textContent = 'Déconnexion';
        creditsDisplay.textContent = `💰 ${state.credits} crédits`;
        creditsDisplay.style.display = 'block';
    } else {
        authBtn.textContent = 'Se connecter';
        creditsDisplay.style.display = 'none';
    }
}

function updateCreditsDisplay() {
    document.getElementById('creditsDisplay').textContent = `💰 ${state.credits} crédits`;
}

// ========================================
// Utilities
// ========================================

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
