// ============================================
// COLLECTION PAGE: FILTER TOGGLE (Mobile)
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const filterToggle = document.querySelector('[data-filter-toggle]');
  const filterPanel = document.querySelector('.collection__filters');
  
  // Only run if the elements exist (we're on the collection page)
  if (!filterToggle || !filterPanel) return;

  // Create backdrop
  const filterBackdrop = document.createElement('div');
  filterBackdrop.className = 'collection__filters-backdrop';
  filterBackdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(filterBackdrop);

  function toggleFilters() {
    const isOpen = filterPanel.getAttribute('aria-hidden') === 'false';
    filterPanel.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    filterBackdrop.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeFilters() {
    if (filterPanel) {
      filterPanel.setAttribute('aria-hidden', 'true');
      filterBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Only enable mobile toggle on small screens (but we always attach, it's fine)
  filterToggle.addEventListener('click', toggleFilters);
  filterBackdrop.addEventListener('click', closeFilters);

  // Close filter panel on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && filterPanel.getAttribute('aria-hidden') === 'false') {
      closeFilters();
      filterToggle.focus();
    }
  });

  // ============================================
  // FILTER GROUP ACCORDION
  // ============================================
  document.querySelectorAll('.filter-group__toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      const options = this.closest('.filter-group').querySelector('.filter-group__options');
      if (options) {
        options.style.display = isExpanded ? 'none' : '';
      }
    });
  });

  // ============================================
  // FILTER RESET
  // ============================================
  const resetBtn = document.querySelector('.collection__filters-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      const checkboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = false);
      const priceInputs = document.querySelectorAll('.price-range__input');
      priceInputs.forEach(inp => inp.value = '');
      // Close mobile panel
      closeFilters();
    });
  }

  // ============================================
  // APPLY FILTERS (Mobile)
  // ============================================
  const applyBtn = document.querySelector('[data-filter-apply]');
  if (applyBtn) {
    applyBtn.addEventListener('click', function() {
      // In a real app, this would submit the form / update URL
      // Here we just close the panel and show feedback
      closeFilters();
      const original = this.textContent;
      this.textContent = 'Applied!';
      setTimeout(() => {
        this.textContent = original;
      }, 1000);
    });
  }
});
