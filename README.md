# Charan Mobiles — Official Website & Owner Control System

> **"Smart choice. Smart life."** | **Naravi - 574109** (Mob: 6360509055 | UPI: `charanmobiles09-1@okicici`)

A complete, production-grade website for **Charan Mobiles** built with a luxury dark & gold mobile technology aesthetic, smooth cursor spotlight reveal, iPhone-inspired crystal card effects, interactive 4-step diagnostic fault finder, and a full Owner Control Center featuring real tax invoicing and private bilingual (English & Kannada) payment reminders.

---

## 🌟 Key Features

### 1. Authentic Brand & Asset Integration
- **Official Brand Logo**: The golden bow & smartphone emblem (`assets/logo.jpg`) on pure luxury black.
- **Authentic Shop Photo**: Real interior showcase of Charan Mobiles accessories counters (`assets/shop.jpg`).
- **Owner Portrait**: Photo of proprietor Mr. Charan (`assets/owner.jpg`) in the About/Trust section.
- **Official UPI QR Code**: GPay/UPI QR code with UPI ID `charanmobiles09-1@okicici` (`assets/upi-qr.jpg`).
- **Tax Invoice Layout**: Exact digital and printable replica of the official `media_1788100214276.jpg` tax invoice (`assets/invoice-template.jpg`).

### 2. Cinematic Hero & Cursor Spotlight Reveal
- Canvas-based spotlight reveal engine (`js/hero-spotlight.js`).
- Base layer features the luxury dark atmosphere and Charan Mobiles logo.
- Spotlight reveal lens (~260px radius) smoothly follows cursor with damped interpolation (`requestAnimationFrame`), revealing the illuminated interior product scene.
- Feathered radial gradient edges with soft golden rim glow (no hard square borders or flickering).
- Mobile & touch fallback with gentle ambient sway and touch tracking.

### 3. iPhone Crystal Effects & 3D Tilt
- Transparent crystal glassmorphism panels with prism highlights.
- Perspective 3D tilt tracking pointer movement on desktop (disabled on mobile and when `prefers-reduced-motion` is active).

### 4. Interactive Mobile Problem Solver
- 4-step diagnostic assistant:
  1. Select Phone Brand (iPhone, Samsung, OnePlus, Xiaomi, Vivo, Oppo, Realme, Motorola, etc.)
  2. Select Category (Screen, Battery, Water Damage, Audio, Software)
  3. Select Exact Symptom
  4. Instant Guidance, Severity, Estimated Time, and 1-click WhatsApp booking with diagnostics payload to `6360509055`.

### 5. Owner Control Center (Restricted Administration)
- **Owner Passcode**: `63605` (or `6360509055` / `admin`)
- **Product Management**: Add new phones/accessories with file reader image uploads or URLs, set price, offer price, stock quantity, specs, featured/offer badges. Immediately updates the public catalog.
- **Official Invoicing System**: Create electronic bills with auto-calculated subtotals, discounts, other charges, grand total, and payment status (`PAID`, `PARTIALLY PAID`, `UNPAID`). Print-ready sheet with seal and signature lines.
- **Private Customer Balance Reminders (English & ಕನ್ನಡ)**:
  - Specifically designed for customers with pending balances.
  - Generates customized polite reminders in **English** and **Kannada (ಕನ್ನಡ)**.
  - 1-click WhatsApp send directly to the customer's phone number with invoice number, balance due, total, UPI ID, and Naravi address.
- **Business Profile Settings**: Edit shop name, phone, UPI ID, address, and business hours.

### 6. Additional Business Services
- Dedicated cards and direct WhatsApp links for:
  1. **SBI Insurance** (Vehicle, Health, Life, Device policies)
  2. **Rubber Tapping** (Workers & plantation coordination)
  3. **Water Pumps & Machinery** (Agricultural & domestic motors)
  4. **Used Vehicles** (Pre-owned bike & car listings)

---

## 📂 Project Architecture

```
C:\Users\chara\.gemini\antigravity\scratch\charan-mobiles\
├── index.html                  # Accessible HTML5 Single Page Application
├── assets/
│   ├── logo.jpg                # Charan Mobiles gold bow logo
│   ├── shop.jpg                # Authentic shop interior
│   ├── owner.jpg               # Real owner photograph
│   ├── upi-qr.jpg              # Official UPI QR code
│   └── invoice-template.jpg    # Reference tax invoice sheet
├── css/
│   ├── style.css               # Luxury dark/gold design system & glassmorphism
│   └── animations.css          # Performant GPU keyframes & motion rules
├── js/
│   ├── app.js                  # Navigation, cart drawer, search overlay, modals, toasts
│   ├── hero-spotlight.js       # Canvas cursor-following spotlight reveal engine
│   ├── store.js                # LocalStorage state layer, invoicing, and Kannada reminders
│   ├── owner-control.js        # Product CRUD, Invoicing, and Customer Reminders
│   ├── problem-solver.js       # Interactive step-by-step diagnostic fault finder
│   └── crystal-3d.js           # 3D card tilt and reflection micro-interactions
└── README.md                   # Complete documentation
```

---

## 🚀 How to Run & View

You can open `index.html` directly in any web browser (Chrome, Edge, Firefox, Safari):

```powershell
# Open directly in default browser on Windows
Start-Process "C:\Users\chara\.gemini\antigravity\scratch\charan-mobiles\index.html"
```
