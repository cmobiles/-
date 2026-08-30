/**
 * CHARAN MOBILES — Centralized State & Data Layer
 * Handles LocalStorage persistence, Invoicing, Billing, and Kannada & English Customer Reminders.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'charan_mobiles_products',
  CART: 'charan_mobiles_cart',
  WISHLIST: 'charan_mobiles_wishlist',
  INVOICES: 'charan_mobiles_invoices',
  REMINDERS: 'charan_mobiles_customer_reminders',
  REVIEWS: 'charan_mobiles_reviews',
  OFFERS: 'charan_mobiles_offers',
  SETTINGS: 'charan_mobiles_settings',
  AUTH: 'charan_mobiles_owner_session'
};

// Initial default shop business settings from authentic assets
const DEFAULT_SETTINGS = {
  shopName: 'Charan Mobiles',
  tagline: 'Smart choice smart life',
  ownerName: 'Charan',
  phone: '6360509055',
  whatsapp: '6360509055',
  upiId: 'charanmobiles09-1@okicici',
  address: 'Naravi - 574109, Belthangady Taluk, D.K., Karnataka',
  pincode: '574109',
  hours: 'Mon - Sat: 9:00 AM - 8:30 PM | Sun: 10:00 AM - 2:00 PM',
  aboutText: 'Charan Mobiles in Naravi is your dedicated local destination for premier smartphones, high-grade mobile accessories, expert chip-level repair services, and multi-business assistance.'
};

class Store {
  constructor() {
    this.init();
  }

  init() {
    // Ensure data collections exist in LocalStorage without creating fake products or reviews
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REMINDERS)) {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  }

  // --- SETTINGS ---
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }

  // --- PRODUCTS ---
  getProducts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    } catch {
      return [];
    }
  }

  addProduct(productData) {
    const products = this.getProducts();
    const newProduct = {
      id: 'prod_' + Date.now(),
      name: productData.name || '',
      brand: productData.brand || 'Other',
      category: productData.category || 'Smartphones',
      price: Number(productData.price) || 0,
      offerPrice: productData.offerPrice ? Number(productData.offerPrice) : null,
      stock: Number(productData.stock) || 0,
      storage: productData.storage || '',
      specs: productData.specs || '',
      image: productData.image || 'assets/logo.jpg',
      isFeatured: Boolean(productData.isFeatured),
      isOffer: Boolean(productData.isOffer),
      createdAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  }

  updateProduct(id, updatedData) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedData, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return products[index];
    }
    return null;
  }

  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  // --- CART ---
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    } catch {
      return [];
    }
  }

  addToCart(product, quantity = 1) {
    const cart = this.getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.offerPrice || product.price,
        image: product.image,
        quantity: quantity
      });
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
  }

  updateCartQuantity(productId, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    } else {
      const item = cart.find(i => i.id === productId);
      if (item) item.quantity = quantity;
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
  }

  clearCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
  }

  // --- WISHLIST ---
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
    } catch {
      return [];
    }
  }

  toggleWishlist(productId) {
    let wishlist = this.getWishlist();
    const exists = wishlist.includes(productId);
    if (exists) {
      wishlist = wishlist.filter(id => id !== productId);
    } else {
      wishlist.push(productId);
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    return !exists;
  }

  // --- BILLING & TAX INVOICE SYSTEM ---
  getInvoices() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.INVOICES)) || [];
    } catch {
      return [];
    }
  }

  createInvoice(invoiceData) {
    const invoices = this.getInvoices();
    const date = new Date();
    const year = date.getFullYear();
    const invoiceNumber = `CM-${year}-${String(invoices.length + 1).padStart(3, '0')}`;

    const items = invoiceData.items || [];
    const subTotal = items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.unitPrice)), 0);
    const discount = Number(invoiceData.discount) || 0;
    const otherCharges = Number(invoiceData.otherCharges) || 0;
    const grandTotal = Math.max(0, subTotal - discount + otherCharges);
    const paidAmount = Number(invoiceData.paidAmount) || 0;
    const balanceDue = Math.max(0, grandTotal - paidAmount);

    let paymentStatus = 'UNPAID';
    if (balanceDue === 0 && grandTotal > 0) {
      paymentStatus = 'PAID';
    } else if (paidAmount > 0 && balanceDue > 0) {
      paymentStatus = 'PARTIALLY PAID';
    }

    const newInvoice = {
      id: 'inv_' + Date.now(),
      invoiceNumber: invoiceData.invoiceNumber || invoiceNumber,
      date: invoiceData.date || date.toISOString().split('T')[0],
      time: invoiceData.time || date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      billTo: {
        name: invoiceData.customerName || 'Walk-in Customer',
        phone: invoiceData.customerPhone || '',
        address: invoiceData.customerAddress || 'Naravi'
      },
      billFrom: {
        name: 'Charan Mobiles',
        address: 'Naravi - 574109',
        phone: '6360509055',
        upiId: 'charanmobiles09-1@okicici'
      },
      items: items,
      subTotal: subTotal,
      discount: discount,
      otherCharges: otherCharges,
      grandTotal: grandTotal,
      paidAmount: paidAmount,
      balanceDue: balanceDue,
      paymentStatus: paymentStatus,
      paymentMode: invoiceData.paymentMode || 'Cash / UPI',
      createdAt: date.toISOString()
    };

    invoices.unshift(newInvoice);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    return newInvoice;
  }

  deleteInvoice(id) {
    const invoices = this.getInvoices().filter(inv => inv.id !== id);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }

  // --- BILINGUAL CUSTOMER PAYMENT REMINDERS (KANNADA & ENGLISH) ---
  /**
   * Generates bilingual private WhatsApp payment reminders for customers with pending balances.
   * Specific to unpaid/partially paid customers.
   */
  generateCustomerPaymentReminder(invoice, language = 'english') {
    const settings = this.getSettings();
    const customerName = invoice.billTo.name;
    const invNo = invoice.invoiceNumber;
    const total = invoice.grandTotal.toLocaleString('en-IN');
    const balance = invoice.balanceDue.toLocaleString('en-IN');
    const upi = settings.upiId;
    const phone = settings.phone;
    const shop = settings.shopName;
    const location = 'Naravi';

    if (language === 'kannada') {
      return (
        `ಗೌರವಾನ್ವಿತ ${customerName} ರವರಿಗೆ,\n\n` +
        `ಇದು ${shop} (${location}) ವತಿಯಿಂದ ವಿನಮ್ರ ಪಾವತಿ ಜ್ಞಾಪನೆ.\n\n` +
        `📄 ಇನ್‌ವಾಯ್ಸ್ ಸಂಖ್ಯೆ: ${invNo}\n` +
        `💰 ಒಟ್ಟು ಮೊತ್ತ: ₹${total}\n` +
        `🔴 ಉಳಿದ ಬಾಕಿ ಮೊತ್ತ: ₹${balance}\n\n` +
        `ದಯವಿಟ್ಟು ಈ UPI ಮೂಲಕ ಪಾವತಿಸಿ:\n` +
        `📲 UPI ID: ${upi}\n` +
        `ಅಥವಾ ನಮ್ಮ ಅಂಗಡಿಗೆ ನೇರವಾಗಿ ಭೇಟಿ ನೀಡಿ ಪಾವತಿಸಬಹುದು.\n\n` +
        `ಯಾವುದೇ ಮಾಹಿತಿಗಾಗಿ ಸಂಪರ್ಕಿಸಿ: ${phone}\n` +
        `ಧನ್ಯವಾದಗಳು! — ${shop}`
      );
    }

    // Default: English
    return (
      `Dear ${customerName},\n\n` +
      `This is a gentle payment reminder from ${shop} (${location}).\n\n` +
      `📄 Invoice No: ${invNo}\n` +
      `💰 Total Bill: ₹${total}\n` +
      `🔴 Pending Balance Due: ₹${balance}\n\n` +
      `Kindly clear the pending balance using our UPI ID:\n` +
      `📲 UPI ID: ${upi}\n` +
      `Or visit our shop in Naravi to settle the bill.\n\n` +
      `For any query, contact us at: ${phone}\n` +
      `Thank you for choosing ${shop}!`
    );
  }

  /**
   * Helper to build a direct WhatsApp link to the customer
   */
  getWhatsAppReminderUrl(customerPhone, messageText) {
    const cleanPhone = customerPhone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`;
  }
}

// Global Store Instance
window.CharanStore = new Store();
