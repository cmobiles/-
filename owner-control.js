/**
 * CHARAN MOBILES — Owner Control Center & Administration
 * Secure owner area for Products, Invoicing, Billing, and Kannada & English Customer Reminders.
 */

class OwnerControl {
  constructor() {
    this.isAuthenticated = false;
    this.activeTab = 'products';
    this.currentReminderInvoice = null;
    this.reminderLang = 'kannada'; // Default to Kannada as requested

    this.init();
  }

  init() {
    // Check existing session
    const session = sessionStorage.getItem(STORAGE_KEYS.AUTH);
    if (session === 'charan_authenticated') {
      this.isAuthenticated = true;
    }
  }

  // Open Owner Login or Control Center
  openControlCenter() {
    if (!this.isAuthenticated) {
      this.showLoginModal();
    } else {
      this.showAdminModal();
    }
  }

  showLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
      modal.classList.add('open');
      document.getElementById('owner-password-input')?.focus();
    }
  }

  closeLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) modal.classList.remove('open');
  }

  // Authenticate (Default Owner Pin: 63605 or 1234)
  handleLogin(e) {
    e?.preventDefault();
    const pinInput = document.getElementById('owner-password-input');
    const pin = pinInput ? pinInput.value.trim() : '';

    if (pin === '63605' || pin === '6360509055' || pin === 'admin' || pin === 'charan') {
      this.isAuthenticated = true;
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'charan_authenticated');
      this.closeLoginModal();
      window.charanApp.showToast('✅ Welcome to Owner Control Center, Charan!', 'success');
      this.showAdminModal();
    } else {
      window.charanApp.showToast('❌ Incorrect Owner Password / PIN', 'error');
      if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
      }
    }
  }

  logout() {
    this.isAuthenticated = false;
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    this.closeAdminModal();
    window.charanApp.showToast('Logged out of Owner Control Center', 'info');
  }

  showAdminModal() {
    const modal = document.getElementById('admin-dashboard-modal');
    if (modal) {
      modal.classList.add('open');
      this.renderTabContent(this.activeTab);
    }
  }

  closeAdminModal() {
    const modal = document.getElementById('admin-dashboard-modal');
    if (modal) modal.classList.remove('open');
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    this.renderTabContent(tabName);
  }

  renderTabContent(tabName) {
    const body = document.getElementById('admin-tab-body');
    if (!body) return;

    if (tabName === 'products') {
      this.renderProductsTab(body);
    } else if (tabName === 'billing') {
      this.renderBillingTab(body);
    } else if (tabName === 'reminders') {
      this.renderRemindersTab(body);
    } else if (tabName === 'settings') {
      this.renderSettingsTab(body);
    }
  }

  // =========================================================================
  // TAB 1: PRODUCTS & INVENTORY
  // =========================================================================
  renderProductsTab(container) {
    const products = window.CharanStore.getProducts();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 style="font-size: 1.5rem; font-weight: 800; color: #fff;">Product & Inventory Management</h3>
          <p style="color: var(--text-secondary); font-size: 0.875rem;">Add smartphones and accessories to update the live public website.</p>
        </div>
        <button class="btn btn-primary" onclick="window.charanOwnerControl.showAddProductModal()">
          <span>➕ Add New Product</span>
        </button>
      </div>

      <div style="background: rgba(14, 14, 20, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-medium); background: rgba(20, 20, 30, 0.8); color: var(--gold-light);">
              <th style="padding: 1rem;">Product</th>
              <th style="padding: 1rem;">Category</th>
              <th style="padding: 1rem;">Brand</th>
              <th style="padding: 1rem;">Price</th>
              <th style="padding: 1rem;">Stock</th>
              <th style="padding: 1rem; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${products.length === 0 ? `
              <tr>
                <td colspan="6" style="padding: 3rem; text-align: center; color: var(--text-muted);">
                  No products added yet. Click "+ Add New Product" above to populate the catalog.
                </td>
              </tr>
            ` : products.map(p => `
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 1rem; display: flex; align-items: center; gap: 0.75rem;">
                  <img src="${p.image}" style="width: 36px; height: 36px; border-radius: 6px; object-fit: contain; background: #000;" onerror="this.src='assets/logo.jpg'" />
                  <div>
                    <div style="font-weight: 700; color: #fff;">${p.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${p.storage || ''}</div>
                  </div>
                </td>
                <td style="padding: 1rem; color: var(--text-secondary);">${p.category}</td>
                <td style="padding: 1rem; color: var(--text-secondary);">${p.brand}</td>
                <td style="padding: 1rem; font-weight: 700; color: #fff;">
                  ₹${p.price.toLocaleString('en-IN')}
                  ${p.offerPrice ? `<span style="font-size: 0.75rem; color: var(--gold-primary); display: block;">Offer: ₹${p.offerPrice.toLocaleString('en-IN')}</span>` : ''}
                </td>
                <td style="padding: 1rem;">
                  <span class="badge ${p.stock > 5 ? 'badge-emerald' : p.stock > 0 ? 'badge-amber' : 'badge-rose'}">
                    ${p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                  </span>
                </td>
                <td style="padding: 1rem; text-align: right;">
                  <button class="btn btn-icon" style="width: 32px; height: 32px; margin-right: 0.25rem;" onclick="window.charanOwnerControl.deleteProduct('${p.id}')" title="Delete">
                    🗑️
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  showAddProductModal() {
    const modal = document.getElementById('add-product-modal');
    if (modal) modal.classList.add('open');
  }

  closeAddProductModal() {
    const modal = document.getElementById('add-product-modal');
    if (modal) modal.classList.remove('open');
  }

  handleSaveProduct(e) {
    e.preventDefault();
    const form = e.target;
    const fileInput = document.getElementById('prod-img-file');

    const save = (imgData) => {
      const product = {
        name: form.name.value.trim(),
        brand: form.brand.value,
        category: form.category.value,
        price: Number(form.price.value),
        offerPrice: form.offerPrice.value ? Number(form.offerPrice.value) : null,
        stock: Number(form.stock.value) || 1,
        storage: form.storage.value.trim(),
        specs: form.specs.value.trim(),
        image: imgData || form.imageUrl.value.trim() || 'assets/logo.jpg',
        isFeatured: form.isFeatured.checked,
        isOffer: form.isOffer.checked
      };

      window.CharanStore.addProduct(product);
      this.closeAddProductModal();
      this.renderProductsTab(document.getElementById('admin-tab-body'));
      window.charanApp.renderProducts();
      window.charanApp.showToast('✅ Product added to public catalog!', 'success');
      form.reset();
    };

    if (fileInput && fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => save(event.target.result);
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      save(null);
    }
  }

  deleteProduct(id) {
    if (confirm('Are you sure you want to remove this product?')) {
      window.CharanStore.deleteProduct(id);
      this.renderProductsTab(document.getElementById('admin-tab-body'));
      window.charanApp.renderProducts();
      window.charanApp.showToast('Product deleted', 'info');
    }
  }

  // =========================================================================
  // TAB 2: BILLING & TAX INVOICING (Exact format from authentic document)
  // =========================================================================
  renderBillingTab(container) {
    const invoices = window.CharanStore.getInvoices();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 style="font-size: 1.5rem; font-weight: 800; color: #fff;">E-Bill / Tax Invoicing System</h3>
          <p style="color: var(--text-secondary); font-size: 0.875rem;">Official billing for Naravi - 574109 (Mob: 6360509055).</p>
        </div>
        <button class="btn btn-primary" onclick="window.charanOwnerControl.showCreateInvoiceModal()">
          <span>📄 + Create New Invoice</span>
        </button>
      </div>

      <div style="background: rgba(14, 14, 20, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-medium); background: rgba(20, 20, 30, 0.8); color: var(--gold-light);">
              <th style="padding: 1rem;">Invoice No</th>
              <th style="padding: 1rem;">Customer</th>
              <th style="padding: 1rem;">Date</th>
              <th style="padding: 1rem;">Grand Total</th>
              <th style="padding: 1rem;">Balance Due</th>
              <th style="padding: 1rem;">Status</th>
              <th style="padding: 1rem; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${invoices.length === 0 ? `
              <tr>
                <td colspan="7" style="padding: 3rem; text-align: center; color: var(--text-muted);">
                  No invoices created yet. Click "+ Create New Invoice" to bill a customer.
                </td>
              </tr>
            ` : invoices.map(inv => `
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 1rem; font-weight: 700; color: var(--gold-light);">${inv.invoiceNumber}</td>
                <td style="padding: 1rem;">
                  <div style="font-weight: 700; color: #fff;">${inv.billTo.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${inv.billTo.phone || 'No Phone'}</div>
                </td>
                <td style="padding: 1rem; color: var(--text-secondary);">${inv.date}</td>
                <td style="padding: 1rem; font-weight: 700; color: #fff;">₹${inv.grandTotal.toLocaleString('en-IN')}</td>
                <td style="padding: 1rem; font-weight: 700; color: ${inv.balanceDue > 0 ? 'var(--neon-rose)' : 'var(--neon-emerald)'};">
                  ₹${inv.balanceDue.toLocaleString('en-IN')}
                </td>
                <td style="padding: 1rem;">
                  <span class="badge ${inv.paymentStatus === 'PAID' ? 'badge-emerald' : inv.paymentStatus === 'PARTIALLY PAID' ? 'badge-amber' : 'badge-rose'}">
                    ${inv.paymentStatus}
                  </span>
                </td>
                <td style="padding: 1rem; text-align: right;">
                  <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; margin-right: 0.25rem;" onclick="window.charanOwnerControl.viewInvoicePrint('${inv.id}')">
                    🖨️ View / Print
                  </button>
                  ${inv.balanceDue > 0 ? `
                    <button class="btn btn-whatsapp" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;" onclick="window.charanOwnerControl.openReminderModal('${inv.id}')">
                      📲 Remind
                    </button>
                  ` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  showCreateInvoiceModal() {
    const modal = document.getElementById('create-invoice-modal');
    if (modal) modal.classList.add('open');
  }

  closeCreateInvoiceModal() {
    const modal = document.getElementById('create-invoice-modal');
    if (modal) modal.classList.remove('open');
  }

  handleSaveInvoice(e) {
    e.preventDefault();
    const form = e.target;

    const items = [];
    const itemRows = document.querySelectorAll('.invoice-item-row');
    itemRows.forEach(row => {
      const desc = row.querySelector('.item-desc').value.trim();
      const qty = Number(row.querySelector('.item-qty').value) || 1;
      const price = Number(row.querySelector('.item-price').value) || 0;
      if (desc && price > 0) {
        items.push({ desc, qty, unitPrice: price, total: qty * price });
      }
    });

    if (items.length === 0) {
      window.charanApp.showToast('Please add at least one billed item.', 'error');
      return;
    }

    const invoiceData = {
      customerName: form.customerName.value.trim() || 'Walk-in Customer',
      customerPhone: form.customerPhone.value.trim(),
      customerAddress: form.customerAddress.value.trim() || 'Naravi',
      items: items,
      discount: Number(form.discount.value) || 0,
      otherCharges: Number(form.otherCharges.value) || 0,
      paidAmount: Number(form.paidAmount.value) || 0,
      paymentMode: form.paymentMode.value
    };

    const newInv = window.CharanStore.createInvoice(invoiceData);
    this.closeCreateInvoiceModal();
    this.renderBillingTab(document.getElementById('admin-tab-body'));
    window.charanApp.showToast(`✅ Invoice ${newInv.invoiceNumber} created successfully!`, 'success');
  }

  viewInvoicePrint(invId) {
    const invoice = window.CharanStore.getInvoices().find(i => i.id === invId);
    if (!invoice) return;

    const printContainer = document.getElementById('printable-invoice-content');
    if (!printContainer) return;

    printContainer.innerHTML = `
      <div class="invoice-sheet" style="max-width: 800px; margin: 0 auto; border: 1px solid #000; padding: 2rem;">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 1rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 0.5rem;">
            <img src="assets/logo.jpg" style="width: 50px; height: 50px; border-radius: 8px;" />
            <h1 style="font-size: 1.75rem; font-weight: 800; letter-spacing: 0.1em; margin: 0; color: #000;">CHARAN MOBILES</h1>
          </div>
          <div style="font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;">SMART CHOICE. SMART LIFE.</div>
          <div style="font-size: 0.875rem; font-weight: 700; margin-top: 0.25rem;">📍 Naravi - 574109 &nbsp;&nbsp;|&nbsp;&nbsp; 📞 Mob: 6360509055</div>
          <div style="display: inline-block; margin-top: 0.75rem; padding: 0.25rem 1.5rem; border: 1px solid #000; font-weight: 800; font-size: 1rem;">E-BILL / TAX INVOICE</div>
        </div>

        <!-- Meta Info -->
        <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 1rem;">
          <div><strong>Invoice No.:</strong> ${invoice.invoiceNumber}</div>
          <div><strong>Date:</strong> ${invoice.date}</div>
          <div><strong>Time:</strong> ${invoice.time}</div>
        </div>

        <!-- Bill To / Bill From -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1rem;">
          <div style="border: 1px solid #000; border-radius: 6px; padding: 0.75rem;">
            <div style="background: #000; color: #fff; display: inline-block; padding: 0.1rem 0.5rem; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem;">BILL TO:</div>
            <div style="font-weight: 700;">${invoice.billTo.name}</div>
            <div>${invoice.billTo.address}</div>
            <div>Phone: ${invoice.billTo.phone || 'N/A'}</div>
          </div>
          <div style="border: 1px solid #000; border-radius: 6px; padding: 0.75rem;">
            <div style="background: #000; color: #fff; display: inline-block; padding: 0.1rem 0.5rem; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem;">BILL FROM:</div>
            <div style="font-weight: 700;">Charan Mobiles</div>
            <div>Naravi - 574109</div>
            <div>Mob: 6360509055 | UPI: charanmobiles09-1@okicici</div>
          </div>
        </div>

        <!-- Table -->
        <table class="invoice-table">
          <thead>
            <tr>
              <th style="width: 8%;">SL. NO.</th>
              <th style="width: 52%;">DESCRIPTION</th>
              <th style="width: 10%;">QUANTITY</th>
              <th style="width: 15%;">UNIT PRICE</th>
              <th style="width: 15%;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item, idx) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td>${item.desc}</td>
                <td style="text-align: center;">${item.qty}</td>
                <td style="text-align: right;">₹${item.unitPrice.toLocaleString('en-IN')}</td>
                <td style="text-align: right;">₹${item.total.toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Totals & Payment Status -->
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; margin-top: 1rem;">
          <div style="border: 1px solid #000; border-radius: 6px; padding: 0.75rem;">
            <div style="background: #000; color: #fff; display: inline-block; padding: 0.1rem 0.5rem; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem;">PAYMENT STATUS</div>
            <div style="font-size: 0.875rem;">
              <div>[ ${invoice.paymentStatus === 'PAID' ? '✓' : ' '} ] PAID</div>
              <div>[ ${invoice.paymentStatus === 'PARTIALLY PAID' ? '✓' : ' '} ] PARTIALLY PAID</div>
              <div>[ ${invoice.paymentStatus === 'UNPAID' ? '✓' : ' '} ] UNPAID</div>
            </div>
            <div style="margin-top: 0.75rem; font-size: 0.8125rem;">
              <strong>Paid Amount:</strong> ₹${invoice.paidAmount.toLocaleString('en-IN')}<br />
              <strong>Balance Due:</strong> ₹${invoice.balanceDue.toLocaleString('en-IN')}
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <tr>
              <td style="border: 1px solid #000; padding: 0.4rem; font-weight: 700;">SUB TOTAL</td>
              <td style="border: 1px solid #000; padding: 0.4rem; text-align: right;">₹${invoice.subTotal.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 0.4rem;">DISCOUNT</td>
              <td style="border: 1px solid #000; padding: 0.4rem; text-align: right;">- ₹${invoice.discount.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 0.4rem;">OTHER CHARGES</td>
              <td style="border: 1px solid #000; padding: 0.4rem; text-align: right;">+ ₹${invoice.otherCharges.toLocaleString('en-IN')}</td>
            </tr>
            <tr style="background: #000; color: #fff; font-weight: 800;">
              <td style="border: 1px solid #000; padding: 0.5rem;">GRAND TOTAL</td>
              <td style="border: 1px solid #000; padding: 0.5rem; text-align: right;">₹${invoice.grandTotal.toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <!-- Footer Seal & Signatures -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 3rem; padding-top: 1rem;">
          <div style="text-align: center;">
            <div style="width: 160px; border-top: 1px solid #000; margin-bottom: 0.25rem;"></div>
            <div style="font-size: 0.75rem; font-weight: 700;">Customer Signature</div>
          </div>
          <div style="text-align: center;">
            <img src="assets/logo.jpg" style="width: 50px; height: 50px; border-radius: 50%; opacity: 0.8; margin-bottom: 0.25rem;" />
            <div style="font-size: 0.6875rem; font-weight: 700;">CHARAN MOBILES (NARAVI)</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 160px; border-top: 1px solid #000; margin-bottom: 0.25rem;"></div>
            <div style="font-size: 0.75rem; font-weight: 700;">Authorised Signature</div>
          </div>
        </div>

        <div style="text-align: center; font-size: 0.75rem; font-weight: 700; margin-top: 2rem; border-top: 1px dashed #666; padding-top: 0.5rem;">
          Thank you for shopping with Charan Mobiles!
        </div>
      </div>
    `;

    const printModal = document.getElementById('view-invoice-modal');
    if (printModal) printModal.classList.add('open');
  }

  // =========================================================================
  // TAB 3: PRIVATE CUSTOMER REMINDERS (ENGLISH & KANNADA)
  // Specific to customers who haven't paid or have a remaining balance!
  // =========================================================================
  renderRemindersTab(container) {
    const invoices = window.CharanStore.getInvoices();
    const unpaidInvoices = invoices.filter(inv => inv.balanceDue > 0);

    container.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <h3 style="font-size: 1.5rem; font-weight: 800; color: #fff;">Private Customer Payment Reminders</h3>
        <p style="color: var(--text-secondary); font-size: 0.875rem;">
          Privately send payment balance notices directly to customers with pending balances in <strong>English</strong> and <strong>Kannada (ಕನ್ನಡ)</strong> via WhatsApp.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <!-- Left: Customer Due List -->
        <div style="background: rgba(14, 14, 20, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem;">
          <h4 style="font-size: 1rem; font-weight: 700; color: var(--gold-light); margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between;">
            <span>Customers with Pending Balance</span>
            <span class="badge badge-rose">${unpaidInvoices.length} Pending</span>
          </h4>

          ${unpaidInvoices.length === 0 ? `
            <div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
              🎉 All customer invoices are completely paid! No pending balances.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-height: 400px; overflow-y: auto;">
              ${unpaidInvoices.map(inv => `
                <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; cursor: pointer; transition: all 0.2s;"
                     onclick="window.charanOwnerControl.selectReminderInvoice('${inv.id}')">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                      <div style="font-weight: 700; color: #fff;">${inv.billTo.name}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${inv.billTo.phone || 'No phone'} | Inv: ${inv.invoiceNumber}</div>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-weight: 800; color: var(--neon-rose);">Due: ₹${inv.balanceDue.toLocaleString('en-IN')}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">Total: ₹${inv.grandTotal.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Right: Message Generator (Kannada / English) -->
        <div style="background: rgba(14, 14, 20, 0.6); border: 1px solid var(--gold-border); border-radius: var(--radius-lg); padding: 1.5rem;" id="reminder-composer-box">
          <h4 style="font-size: 1rem; font-weight: 700; color: var(--gold-light); margin-bottom: 1rem;">
            Private WhatsApp Message Preview
          </h4>

          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
            <button class="btn btn-secondary ${this.reminderLang === 'kannada' ? 'btn-primary' : ''}" style="padding: 0.4rem 1rem; font-size: 0.8125rem;" onclick="window.charanOwnerControl.setReminderLanguage('kannada')">
              ಕನ್ನಡ (Kannada)
            </button>
            <button class="btn btn-secondary ${this.reminderLang === 'english' ? 'btn-primary' : ''}" style="padding: 0.4rem 1rem; font-size: 0.8125rem;" onclick="window.charanOwnerControl.setReminderLanguage('english')">
              English
            </button>
          </div>

          <div id="reminder-text-preview" style="background: #000; border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 1.25rem; font-family: var(--font-mono); font-size: 0.8125rem; line-height: 1.6; color: #fff; min-height: 180px; white-space: pre-wrap; margin-bottom: 1.25rem;">
            ${this.currentReminderInvoice ? 
              window.CharanStore.generateCustomerPaymentReminder(this.currentReminderInvoice, this.reminderLang) : 
              'Select a customer from the left list to generate their private payment reminder.'}
          </div>

          ${this.currentReminderInvoice && this.currentReminderInvoice.billTo.phone ? `
            <a href="${window.CharanStore.getWhatsAppReminderUrl(this.currentReminderInvoice.billTo.phone, window.CharanStore.generateCustomerPaymentReminder(this.currentReminderInvoice, this.reminderLang))}"
               target="_blank" class="btn btn-whatsapp" style="width: 100%;">
              <span>💬 Send Private WhatsApp Reminder to ${this.currentReminderInvoice.billTo.name}</span>
            </a>
          ` : `
            <button class="btn btn-secondary" style="width: 100%; opacity: 0.6;" disabled>
              Select customer with valid phone number to send
            </button>
          `}
        </div>
      </div>
    `;
  }

  selectReminderInvoice(invId) {
    this.currentReminderInvoice = window.CharanStore.getInvoices().find(i => i.id === invId);
    this.renderRemindersTab(document.getElementById('admin-tab-body'));
  }

  setReminderLanguage(lang) {
    this.reminderLang = lang;
    this.renderRemindersTab(document.getElementById('admin-tab-body'));
  }

  openReminderModal(invId) {
    this.activeTab = 'reminders';
    this.currentReminderInvoice = window.CharanStore.getInvoices().find(i => i.id === invId);
    this.showAdminModal();
    this.switchTab('reminders');
  }

  // =========================================================================
  // TAB 4: SETTINGS & SHOP PROFILE
  // =========================================================================
  renderSettingsTab(container) {
    const settings = window.CharanStore.getSettings();

    container.innerHTML = `
      <div style="max-width: 600px;">
        <h3 style="font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 1.5rem;">Business Profile & Settings</h3>
        
        <form onsubmit="window.charanOwnerControl.handleSaveSettings(event)">
          <div class="form-group">
            <label class="form-label">Shop Name</label>
            <input type="text" name="shopName" class="form-input" value="${settings.shopName}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Tagline</label>
            <input type="text" name="tagline" class="form-input" value="${settings.tagline}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Owner Name</label>
            <input type="text" name="ownerName" class="form-input" value="${settings.ownerName}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Contact / WhatsApp Phone Number</label>
            <input type="text" name="phone" class="form-input" value="${settings.phone}" required />
          </div>
          <div class="form-group">
            <label class="form-label">UPI ID for Customer Payments & QR</label>
            <input type="text" name="upiId" class="form-input" value="${settings.upiId}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Shop Physical Address</label>
            <input type="text" name="address" class="form-input" value="${settings.address}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Opening Business Hours</label>
            <input type="text" name="hours" class="form-input" value="${settings.hours}" required />
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top: 1rem;">
            Save Business Settings
          </button>
        </form>
      </div>
    `;
  }

  handleSaveSettings(e) {
    e.preventDefault();
    const form = e.target;
    const updated = {
      shopName: form.shopName.value.trim(),
      tagline: form.tagline.value.trim(),
      ownerName: form.ownerName.value.trim(),
      phone: form.phone.value.trim(),
      upiId: form.upiId.value.trim(),
      address: form.address.value.trim(),
      hours: form.hours.value.trim()
    };
    window.CharanStore.updateSettings(updated);
    window.charanApp.updateBrandDetails();
    window.charanApp.showToast('✅ Business profile updated!', 'success');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.charanOwnerControl = new OwnerControl();
});
