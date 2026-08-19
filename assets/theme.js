/* ========================================
   THEME MAIN JAVASCRIPT
   ========================================
   This file contains all client-side functionality.
   It uses ES6 modules and is loaded with `defer`.
   ======================================== */

// ========================================
// 1. HEADER FUNCTIONALITY
// ========================================

class Header {
  constructor() {
    this.menuToggle = document.querySelector('[data-menu-toggle]');
    this.mobileNav = document.querySelector('[data-mobile-nav]');
    this.mobileBackdrop = document.querySelector('[data-mobile-backdrop]');
    this.searchToggle = document.querySelector('[data-search-toggle]');
    this.searchOverlay = document.querySelector('[data-search-overlay]');
    this.searchClose = document.querySelector('[data-search-close]');
    this.searchInput = document.querySelector('.header__search-input');
    this.header = document.querySelector('.header');
    
    this.isMobileNavOpen = false;
    this.isSearchOpen = false;
    
    this.init();
  }
  
  init() {
    // Mobile menu toggle
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', this.toggleMobileNav.bind(this));
    }
    
    // Mobile backdrop close
    if (this.mobileBackdrop) {
      this.mobileBackdrop.addEventListener('click', this.closeMobileNav.bind(this));
    }
    
    // Search toggle
    if (this.searchToggle) {
      this.searchToggle.addEventListener('click', this.toggleSearch.bind(this));
    }
    
    // Search close
    if (this.searchClose) {
      this.searchClose.addEventListener('click', this.closeSearch.bind(this));
    }
    
    // Keyboard: Escape closes menus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isSearchOpen) this.closeSearch();
        if (this.isMobileNavOpen) this.closeMobileNav();
      }
    });
    
    // Keyboard: Search input shortcut (Ctrl+K or Cmd+K)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.toggleSearch();
      }
    });
    
    // Close mobile nav on link click
    if (this.mobileNav) {
      const links = this.mobileNav.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', this.closeMobileNav.bind(this));
      });
    }
    
    // Sticky header with scroll
    this.handleScroll();
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
        scrollTimeout = null;
      }, 100);
    });
  }
  
  toggleMobileNav() {
    if (this.isMobileNavOpen) {
      this.closeMobileNav();
    } else {
      this.openMobileNav();
    }
  }
  
  openMobileNav() {
    this.isMobileNavOpen = true;
    if (this.mobileNav) {
      this.mobileNav.setAttribute('aria-hidden', 'false');
    }
    if (this.mobileBackdrop) {
      this.mobileBackdrop.setAttribute('aria-hidden', 'false');
    }
    if (this.menuToggle) {
      this.menuToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
    if (this.isSearchOpen) this.closeSearch();
  }
  
  closeMobileNav() {
    this.isMobileNavOpen = false;
    if (this.mobileNav) {
      this.mobileNav.setAttribute('aria-hidden', 'true');
    }
    if (this.mobileBackdrop) {
      this.mobileBackdrop.setAttribute('aria-hidden', 'true');
    }
    if (this.menuToggle) {
      this.menuToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }
  
  toggleSearch() {
    if (this.isSearchOpen) {
      this.closeSearch();
    } else {
      this.openSearch();
    }
  }
  
  openSearch() {
    this.isSearchOpen = true;
    if (this.searchOverlay) {
      this.searchOverlay.hidden = false;
    }
    if (this.searchInput) {
      setTimeout(() => this.searchInput.focus(), 100);
    }
    if (this.isMobileNavOpen) this.closeMobileNav();
  }
  
  closeSearch() {
    this.isSearchOpen = false;
    if (this.searchOverlay) {
      this.searchOverlay.hidden = true;
    }
    if (this.searchToggle) {
      this.searchToggle.focus();
    }
  }
  
  handleScroll() {
    if (!this.header) return;
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      this.header.classList.add('header--scrolled');
    } else {
      this.header.classList.remove('header--scrolled');
    }
  }
}

// ========================================
// 2. CART FUNCTIONALITY
// ========================================

class Cart {
  constructor() {
    this.countBubble = document.querySelector('[data-cart-count-bubble]');
    this.cartCount = document.querySelector('[data-cart-count]');
    this.init();
  }
  
  init() {
    // Listen for cart updates via AJAX
    document.addEventListener('cart:updated', this.updateCartCount.bind(this));
    
    // Quantity controls on cart page
    document.querySelectorAll('.quantity-selector').forEach(selector => {
      const input = selector.querySelector('.quantity-selector__input');
      const decrease = selector.querySelector('[data-qty-decrease]');
      const increase = selector.querySelector('[data-qty-increase]');
      
      if (decrease) {
        decrease.addEventListener('click', () => this.updateQuantity(input, -1));
      }
      if (increase) {
        increase.addEventListener('click', () => this.updateQuantity(input, 1));
      }
      if (input) {
        input.addEventListener('change', () => this.validateQuantity(input));
      }
    });
    
    // Remove item buttons
    document.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', this.removeCartItem.bind(this));
    });
  }
  
  updateCartCount(event) {
    const count = event.detail.count || 0;
    if (this.countBubble) {
      this.countBubble.textContent = count;
    }
    if (this.cartCount) {
      this.cartCount.setAttribute('aria-label', `Cart: ${count} items`);
    }
  }
  
  updateQuantity(input, delta) {
    if (!input) return;
    const current = parseInt(input.value, 10) || 1;
    const newValue = Math.max(1, current + delta);
    input.value = newValue;
    this.validateQuantity(input);
    // Trigger cart update event
    document.dispatchEvent(new CustomEvent('cart:update', {
      detail: { lineId: input.dataset.lineId, quantity: newValue }
    }));
  }
  
  validateQuantity(input) {
    const min = parseInt(input.min, 10) || 1;
    const max = parseInt(input.max, 10) || 999;
    let value = parseInt(input.value, 10) || min;
    if (value < min) value = min;
    if (value > max) value = max;
    input.value = value;
  }
  
  removeCartItem(event) {
    const btn = event.currentTarget;
    const lineId = btn.dataset.lineId;
    if (lineId) {
      document.dispatchEvent(new CustomEvent('cart:remove', {
        detail: { lineId: lineId }
      }));
    }
  }
}

// ========================================
// 3. PRODUCT PAGE FUNCTIONALITY
// ========================================

class ProductPage {
  constructor() {
    this.mainImage = document.querySelector('.product-page__main-img');
    this.thumbnails = document.querySelectorAll('.product-page__thumb');
    this.variantOptions = document.querySelectorAll('.variant-option');
    this.quantityInput = document.querySelector('#quantity');
    this.addToCartBtn = document.querySelector('.product-page__add-to-cart');
    this.zoomBtn = document.querySelector('.product-page__zoom');
    this.init();
  }
  
  init() {
    // Thumbnail clicks
    this.thumbnails.forEach(thumb => {
      thumb.addEventListener('click', this.changeMainImage.bind(this));
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.changeMainImage.call(this, { currentTarget: thumb });
        }
      });
    });
    
    // Variant selection
    this.variantOptions.forEach(option => {
      option.addEventListener('click', this.selectVariant.bind(this));
    });
    
    // Quantity controls
    const decrease = document.querySelector('[data-qty-decrease]');
    const increase = document.querySelector('[data-qty-increase]');
    if (decrease) {
      decrease.addEventListener('click', () => this.updateQuantity(-1));
    }
    if (increase) {
      increase.addEventListener('click', () => this.updateQuantity(1));
    }
    if (this.quantityInput) {
      this.quantityInput.addEventListener('change', () => this.validateQuantity());
    }
    
    // Zoom
    if (this.zoomBtn && this.mainImage) {
      this.zoomBtn.addEventListener('click', this.openZoom.bind(this));
    }
  }
  
  changeMainImage(event) {
    const thumb = event.currentTarget;
    const img = thumb.querySelector('img');
    if (!img) return;
    
    // Update main image
    if (this.mainImage) {
      this.mainImage.src = img.src;
      this.mainImage.alt = img.alt;
    }
    
    // Update active state
    this.thumbnails.forEach(t => t.setAttribute('aria-current', 'false'));
    thumb.setAttribute('aria-current', 'true');
  }
  
  selectVariant(event) {
    const option = event.currentTarget;
    const group = option.closest('.product-page__variant-options');
    if (!group) return;
    
    // Update selected state
    group.querySelectorAll('.variant-option').forEach(opt => {
      opt.setAttribute('aria-checked', 'false');
    });
    option.setAttribute('aria-checked', 'true');
    
    // Update price if variant has different price
    const variantData = option.dataset;
    const priceDisplay = document.querySelector('.product-page__price-current');
    if (variantData.price && priceDisplay) {
      priceDisplay.textContent = variantData.price;
    }
  }
  
  updateQuantity(delta) {
    if (!this.quantityInput) return;
    const current = parseInt(this.quantityInput.value, 10) || 1;
    const newValue = Math.max(1, current + delta);
    this.quantityInput.value = newValue;
  }
  
  validateQuantity() {
    if (!this.quantityInput) return;
    const min = parseInt(this.quantityInput.min, 10) || 1;
    const max = parseInt(this.quantityInput.max, 10) || 999;
    let value = parseInt(this.quantityInput.value, 10) || min;
    if (value < min) value = min;
    if (value > max) value = max;
    this.quantityInput.value = value;
  }
  
  openZoom() {
    if (!this.mainImage) return;
    // Create zoom overlay
    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Product image zoom');
    
    const img = document.createElement('img');
    img.src = this.mainImage.src;
    img.alt = this.mainImage.alt;
    img.className = 'zoom-overlay__image';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'zoom-overlay__close';
    closeBtn.setAttribute('aria-label', 'Close zoom');
    closeBtn.innerHTML = '×';
    
    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    const closeZoom = () => {
      overlay.remove();
      document.body.style.overflow = '';
      if (this.zoomBtn) this.zoomBtn.focus();
    };
    
    closeBtn.addEventListener('click', closeZoom);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeZoom();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeZoom();
    });
  }
}

// ========================================
// 4. COLLECTION PAGE FUNCTIONALITY
// ========================================

class CollectionPage {
  constructor() {
    this.filterToggle = document.querySelector('[data-filter-toggle]');
    this.filterPanel = document.querySelector('.collection__filters');
    this.filterApply = document.querySelector('[data-filter-apply]');
    this.filterReset = document.querySelector('.collection__filters-reset');
    this.filterOptions = document.querySelectorAll('.filter-option input');
    this.sortSelect = document.querySelector('#sort-by');
    this.init();
  }
  
  init() {
    // Mobile filter toggle
    if (this.filterToggle && this.filterPanel) {
      this.filterToggle.addEventListener('click', this.toggleFilters.bind(this));
    }
    
    // Apply filters (mobile)
    if (this.filterApply) {
      this.filterApply.addEventListener('click', this.applyFilters.bind(this));
    }
    
    // Reset filters
    if (this.filterReset) {
      this.filterReset.addEventListener('click', this.resetFilters.bind(this));
    }
    
    // Sort change
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', this.applySort.bind(this));
    }
    
    // Filter option change (auto-apply on desktop)
    this.filterOptions.forEach(option => {
      option.addEventListener('change', () => {
        if (window.innerWidth >= 1024) {
          this.applyFilters();
        }
      });
    });
  }
  
  toggleFilters() {
    if (!this.filterPanel) return;
    const isOpen = this.filterPanel.classList.toggle('collection__filters--open');
    if (this.filterToggle) {
      this.filterToggle.setAttribute('aria-expanded', isOpen);
    }
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  
  applyFilters() {
    // Collect all selected filters
    const filters = {};
    document.querySelectorAll('.filter-option input:checked').forEach(input => {
      const name = input.name;
      const value = input.value;
      if (!filters[name]) filters[name] = [];
      filters[name].push(value);
    });
    
    // Dispatch event for AJAX update
    document.dispatchEvent(new CustomEvent('filters:apply', {
      detail: { filters }
    }));
    
    // Close mobile filters
    if (window.innerWidth < 1024) {
      this.toggleFilters();
    }
  }
  
  resetFilters() {
    this.filterOptions.forEach(option => {
      option.checked = false;
    });
    this.applyFilters();
  }
  
  applySort() {
    if (!this.sortSelect) return;
    document.dispatchEvent(new CustomEvent('sort:apply', {
      detail: { sort: this.sortSelect.value }
    }));
  }
}

// ========================================
// 5. LAZY LOADING FOR IMAGES
// ========================================

class LazyImages {
  constructor() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
      
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        this.observer.observe(img);
      });
    }
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        // Image is already loaded via src attribute
        // but we can use this to trigger other lazy behaviors
        img.classList.add('lazy-loaded');
        this.observer.unobserve(img);
      }
    });
  }
}

// ========================================
// 6. INITIALIZE EVERYTHING
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Header
  if (document.querySelector('.header')) {
    new Header();
  }
  
  // Cart
  if (document.querySelector('[data-cart-count-bubble]')) {
    new Cart();
  }
  
  // Product page
  if (document.querySelector('.product-page')) {
    new ProductPage();
  }
  
  // Collection page
  if (document.querySelector('.collection-page')) {
    new CollectionPage();
  }
  
  // Lazy images
  new LazyImages();
});

// ========================================
// 7. REMOVE APPLE-DEFAULT STYLES
// ========================================

// Prevent iOS zoom on focus
document.addEventListener('touchend', () => {
  const active = document.activeElement;
  if (active && active.tagName === 'INPUT') {
    active.blur();
  }
}, { passive: true });
