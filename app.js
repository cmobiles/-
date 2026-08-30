/**
 * CHARAN MOBILES — Main Application Orchestrator
 * Controls navigation, product rendering, cart, wishlist, search, modals, and toasts.
 */

class App {
  constructor() {
    this.currentCategory = 'All';
    this.searchQuery = '';
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateBrandDetails();
    this.renderProducts();
    this.updateCartBadge();
  }

  bindEvents() {
    // Scroll header opacity
    window.addEventListener('scroll', () => {
      const header = document.getElementById('main-header');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
      }
    });

    // Mobile Hamburger
    const menuToggle = document.getElementById('menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (menuToggle && mobileDrawer) {
      menuToggle.addEventListener('click', () => {
        mobileDrawer.classList.toggle('open');
      });
    }

    // Escape key to close any open modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.admin-modal.open, .drawer-open').forEach(el => {
          el.classList.remove('open', 'drawer-open');
        });
      }
    });

    // Password beam lighting tracking on login dialog
    const loginWrap = document.querySelector('.password-beam-wrap');
    if (loginWrap) {
      loginWrap.addEventListener('mousemove', (e) => {
        const rect = loginWrap.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        loginWrap.style.setProperty('--beam-x', `${x}%`);
        loginWrap.style.setProperty('--beam-y', `${y}%`);
      });
    }
  }

  updateBrandDetails() {
    const settings = window.CharanStore.getSettings();
    document.querySelectorAll('.shop-phone-text').forEach(el => el.textContent = settings.phone);
    document.querySelectorAll('.shop-address-text').forEach(el => el.textContent = settings.address);
    document.querySelectorAll('.shop-hours-text').forEach(el => el.textContent = settings.hours);
    document.querySelectorAll('.shop-upi-text').forEach(el => el.textContent = settings.upiId);
  }

  // --- PRODUCTS RENDERING ---
  filterCategory(category) {
    this.currentCategory = category;
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.category === category);
    });
    this.renderProducts();
  }

  renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    let products = window.CharanStore.getProducts();

    if (this.currentCategory !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === this.currentCategory.toLowerCase() || p.brand.toLowerCase() === this.currentCategory.toLowerCase());
    }

    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.specs && p.specs.toLowerCase().includes(q))
      );
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">📱</div>
          <h3 class="empty-state-title">No Products in "${this.currentCategory}" Category Yet</h3>
          <p class="empty-state-text">
            Our live inventory is updated in real time by Charan Mobiles. Use the Owner Control Center to add live smartphones and accessories to the shop.
          </p>
          <button class="btn btn-primary" onclick="window.charanOwnerControl.openControlCenter()">
            🔒 Open Owner Control Center
          </button>
        </div>
      `;
      return;
    }

    const wishlist = window.CharanStore.getWishlist();

    grid.innerHTML = products.map(p => {
      const isWishlisted = wishlist.includes(p.id);
      return `
        <div class="crystal-card product-card">
          <div class="product-media-wrap">
            <div class="product-badges-top">
              ${p.isOffer ? '<span class="badge badge-gold">Special Offer</span>' : ''}
              ${p.isFeatured ? '<span class="badge badge-amber">Featured</span>' : ''}
            </div>

            <button class="wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" onclick="window.charanApp.toggleWishlist('${p.id}')" title="Add to Wishlist">
              ${isWishlisted ? '❤️' : '🤍'}
            </button>

            <img src="${p.image}" class="product-img" alt="${p.name}" onerror="this.src='assets/logo.jpg'" />
          </div>

          <div class="product-info-wrap">
            <div class="product-brand">${p.brand}</div>
            <h4 class="product-title">${p.name}</h4>
            <div class="product-specs-snippet">${p.storage ? `<strong>${p.storage}</strong> • ` : ''}${p.specs || 'Official warranty & genuine accessories included.'}</div>

            <div class="product-price-row">
              <span class="price-current">₹${(p.offerPrice || p.price).toLocaleString('en-IN')}</span>
              ${p.offerPrice ? `<span class="price-original">₹${p.price.toLocaleString('en-IN')}</span>` : ''}
            </div>

            <div class="product-actions-row">
              <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8125rem;" onclick="window.charanApp.addToCart('${p.id}')">
                <span>🛒 Add to Cart</span>
              </button>
              <button class="btn btn-secondary btn-icon" onclick="window.charanApp.openProductDetails('${p.id}')" title="View Specifications">
                ℹ️
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Reattach crystal 3D tilt effects
    window.charanCrystal3D?.attachTiltListeners();
  }

  // --- CART & WISHLIST ---
  addToCart(productId) {
    const product = window.CharanStore.getProducts().find(p => p.id === productId);
    if (!product) return;
    window.CharanStore.addToCart(product, 1);
    this.updateCartBadge();
    this.showToast(`🛒 Added "${product.name}" to your cart!`, 'success');
  }

  updateCartBadge() {
    const cart = window.CharanStore.getCart();
    const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    const badges = document.querySelectorAll('.cart-btn-badge');
    badges.forEach(b => {
      b.textContent = totalCount;
      b.style.display = totalCount > 0 ? 'flex' : 'none';
    });
  }

  openCartDrawer() {
    this.renderCartDrawer();
    document.getElementById('cart-drawer')?.classList.add('drawer-open');
  }

  closeCartDrawer() {
    document.getElementById('cart-drawer')?.classList.remove('drawer-open');
  }

  renderCartDrawer() {
    const container = document.getElementById('cart-drawer-items');
    if (!container) return;

    const cart = window.CharanStore.getCart();
    const settings = window.CharanStore.getSettings();

    if (cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1.5rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
          <div style="font-size: 1.125rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Your Cart is Empty</div>
          <p style="font-size: 0.875rem; margin-bottom: 1.5rem;">Explore our smartphones and accessories in Naravi!</p>
          <button class="btn btn-gold-outline" onclick="window.charanApp.closeCartDrawer()">Browse Products</button>
        </div>
      `;
      document.getElementById('cart-drawer-total').textContent = '₹0';
      document.getElementById('cart-checkout-btn').style.display = 'none';
      return;
    }

    const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    container.innerHTML = cart.map(item => `
      <div style="display: flex; gap: 1rem; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border-subtle);">
        <img src="${item.image}" style="width: 54px; height: 54px; border-radius: 8px; object-fit: contain; background: #000;" onerror="this.src='assets/logo.jpg'" />
        <div style="flex-grow: 1;">
          <div style="font-weight: 700; color: #fff; font-size: 0.9375rem;">${item.name}</div>
          <div style="color: var(--gold-light); font-size: 0.875rem; font-weight: 700;">₹${item.price.toLocaleString('en-IN')}</div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem;">
            <button class="btn-icon" style="width: 24px; height: 24px; font-size: 0.75rem;" onclick="window.charanApp.updateCartQty('${item.id}', ${item.quantity - 1})">-</button>
            <span style="font-weight: 700; font-size: 0.875rem;">${item.quantity}</span>
            <button class="btn-icon" style="width: 24px; height: 24px; font-size: 0.75rem;" onclick="window.charanApp.updateCartQty('${item.id}', ${item.quantity + 1})">+</button>
          </div>
        </div>
        <button class="btn-icon" style="width: 32px; height: 32px; color: var(--neon-rose);" onclick="window.charanApp.updateCartQty('${item.id}', 0)" title="Remove">🗑️</button>
      </div>
    `).join('');

    document.getElementById('cart-drawer-total').textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.style.display = 'flex';

      // Build WhatsApp order payload
      const orderLines = cart.map(i => `• ${i.name} (Qty: ${i.quantity}) - ₹${(i.price * i.quantity).toLocaleString('en-IN')}`).join('\n');
      const waMsg = 
        `Hello Charan Mobiles (Naravi),\n\n` +
        `I would like to place an order from your website:\n\n` +
        `${orderLines}\n\n` +
        `💰 Grand Total: ₹${grandTotal.toLocaleString('en-IN')}\n\n` +
        `Please confirm availability and pickup / delivery time. Thank you!`;

      checkoutBtn.href = `https://wa.me/91${settings.phone}?text=${encodeURIComponent(waMsg)}`;
    }
  }

  updateCartQty(productId, qty) {
    window.CharanStore.updateCartQuantity(productId, qty);
    this.updateCartBadge();
    this.renderCartDrawer();
  }

  toggleWishlist(productId) {
    const isAdded = window.CharanStore.toggleWishlist(productId);
    this.renderProducts();
    this.showToast(isAdded ? '❤️ Added to your wishlist!' : '🤍 Removed from wishlist', 'info');
  }

  // --- GLOBAL SEARCH ---
  openSearch() {
    const overlay = document.getElementById('search-overlay');
    if (overlay) {
      overlay.classList.add('open');
      const input = document.getElementById('global-search-input');
      if (input) {
        input.value = '';
        input.focus();
      }
      this.handleSearch('');
    }
  }

  closeSearch() {
    document.getElementById('search-overlay')?.classList.remove('open');
  }

  handleSearch(query) {
    this.searchQuery = query;
    const resultsContainer = document.getElementById('search-results-list');
    if (!resultsContainer) return;

    let products = window.CharanStore.getProducts();
    if (query.trim() !== '') {
      const q = query.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }

    if (products.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
          No matching products found for "${query}".
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = products.map(p => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-bottom: 1px solid var(--border-subtle); cursor: pointer;"
           onclick="window.charanApp.closeSearch(); window.charanApp.openProductDetails('${p.id}')">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <img src="${p.image}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: contain; background: #000;" onerror="this.src='assets/logo.jpg'" />
          <div>
            <div style="font-weight: 700; color: #fff;">${p.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${p.brand} • ${p.category}</div>
          </div>
        </div>
        <div style="font-weight: 700; color: var(--gold-light);">₹${(p.offerPrice || p.price).toLocaleString('en-IN')}</div>
      </div>
    `).join('');
  }

  // --- PRODUCT DETAILS MODAL ---
  openProductDetails(productId) {
    const product = window.CharanStore.getProducts().find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-details-modal');
    const content = document.getElementById('product-details-content');
    if (!modal || !content) return;

    const settings = window.CharanStore.getSettings();
    const waInquiryMsg = `Hello Charan Mobiles, I am inquiring about the ${product.name} (₹${(product.offerPrice || product.price).toLocaleString('en-IN')}) shown on your website.`;
    const waUrl = `https://wa.me/91${settings.phone}?text=${encodeURIComponent(waInquiryMsg)}`;

    content.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div style="background: #000; border-radius: var(--radius-lg); padding: 2rem; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-subtle);">
          <img src="${product.image}" style="max-width: 100%; max-height: 280px; object-fit: contain;" onerror="this.src='assets/logo.jpg'" />
        </div>
        <div style="display: flex; flex-direction: column; justify-content: center;">
          <span class="badge badge-gold" style="align-self: flex-start; margin-bottom: 0.5rem;">${product.brand}</span>
          <h3 style="font-size: 1.75rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">${product.name}</h3>
          <div style="font-size: 0.9375rem; color: var(--text-muted); margin-bottom: 1rem;">Storage/RAM: ${product.storage || 'Standard Edition'}</div>
          
          <div style="font-size: 1.75rem; font-weight: 800; color: var(--gold-light); margin-bottom: 1.5rem;">
            ₹${(product.offerPrice || product.price).toLocaleString('en-IN')}
            ${product.offerPrice ? `<span style="font-size: 1rem; color: var(--text-muted); text-decoration: line-through; margin-left: 0.75rem;">₹${product.price.toLocaleString('en-IN')}</span>` : ''}
          </div>

          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem; font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
            <strong>Specifications & Highlights:</strong><br />
            ${product.specs || 'Genuine brand device with manufacturer warranty, box accessories, and local support in Naravi.'}
          </div>

          <div style="display: flex; gap: 1rem;">
            <button class="btn btn-primary" onclick="window.charanApp.addToCart('${product.id}'); window.charanApp.closeProductDetails();">
              🛒 Add to Cart
            </button>
            <a href="${waUrl}" target="_blank" class="btn btn-whatsapp">
              💬 Inquire on WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('open');
  }

  closeProductDetails() {
    document.getElementById('product-details-modal')?.classList.remove('open');
  }

  // --- UPI PAYMENT MODAL ---
  openPaymentQR() {
    document.getElementById('upi-qr-modal')?.classList.add('open');
  }

  closePaymentQR() {
    document.getElementById('upi-qr-modal')?.classList.remove('open');
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-root');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `
      <span style="font-size: 1.25rem;">${type === 'success' ? '✨' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.charanApp = new App();
});
