document.addEventListener('DOMContentLoaded', function () {
  // ============================================
  // MOBILE MENU
  // ============================================
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('.header__mobile-nav');
  const backdrop = document.createElement('div');
  backdrop.className = 'header__mobile-nav-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(backdrop);

  function toggleMenu() {
    const isOpen = mobileNav.getAttribute('aria-hidden') === 'false';
    mobileNav.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    backdrop.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMenu() {
    mobileNav.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }
  backdrop.addEventListener('click', closeMenu);

  // Close mobile nav on link click
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ============================================
  // SEARCH OVERLAY
  // ============================================
  const searchToggle = document.querySelector('[data-search-toggle]');
  const searchOverlay = document.querySelector('.header__search-overlay');
  const searchClose = document.querySelector('[data-search-close]');
  const searchInput = document.querySelector('.header__search-input');

  function openSearch() {
    if (searchOverlay) {
      searchOverlay.hidden = false;
      searchInput.focus();
    }
  }

  function closeSearch() {
    if (searchOverlay) {
      searchOverlay.hidden = true;
    }
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      if (searchOverlay.hidden) {
        openSearch();
      } else {
        closeSearch();
      }
    });
  }

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  // Close search with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay && !searchOverlay.hidden) {
      closeSearch();
      searchToggle.focus();
    }
  });

  // ============================================
  // QUICK ADD BUTTONS (demo)
  // ============================================
  const quickAddBtns = document.querySelectorAll('.product-card__quick-add');
  quickAddBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const originalText = btn.textContent;
      btn.textContent = 'Added!';
      btn.style.background = 'var(--color-success)';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 1500);
    });
  });

  // ============================================
  // WISHLIST BUTTONS (demo)
  // ============================================
  const wishlistBtns = document.querySelectorAll('.product-card__wishlist');
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const svg = btn.querySelector('svg');
      const isFilled = svg.getAttribute('fill') === 'currentColor';
      if (isFilled) {
        svg.setAttribute('fill', 'none');
        btn.style.background = 'var(--color-white)';
      } else {
        svg.setAttribute('fill', 'currentColor');
        btn.style.background = 'var(--color-primary-light)';
      }
    });
  });

  // ============================================
  // CART COUNT (demo - increment from 0)
  // ============================================
  const cartCount = document.querySelector('.header__cart-count');
  let count = 0;
  // For demo, we'll just show the count update when quick add is clicked
  // (the quick add already updates, but we can also intercept)
  // We'll also add a fake increment when the cart icon is clicked? Not needed.
  // We'll just update when quick add is clicked.
  // Actually quick add should increment, but we already have that logic.
  // Let's add an increment function.
  function updateCartCount() {
    count += 1;
    if (cartCount) {
      cartCount.textContent = count;
    }
  }

  // Override quick add to also update cart count
  quickAddBtns.forEach(btn => {
    const originalClick = btn._listeners ? btn._listeners : [];
    // We already have a click handler that changes text. We'll add another one that updates cart.
    btn.addEventListener('click', () => {
      updateCartCount();
    });
  });

  // ============================================
  // KEYBOARD ACCESSIBILITY: close search with Escape
  // ============================================
  // Already handled above.

  console.log('[Your Brand] - Theme initialized.');
});
