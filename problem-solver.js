/**
 * CHARAN MOBILES — Interactive Mobile Fault Finder & Problem Solver
 * Step-by-step diagnostic tool with tailored repair recommendations and WhatsApp handoff.
 */

const FAULT_DATABASE = {
  categories: [
    {
      id: 'screen',
      name: 'Screen & Touch Display',
      icon: 'smartphone',
      symptoms: [
        { id: 'cracked_glass', title: 'Cracked outer glass, touch is working', desc: 'Display works fine but front glass is shattered.' },
        { id: 'black_screen', title: 'Completely blank / black screen', desc: 'Phone vibrates or rings, but no visual output.' },
        { id: 'touch_dead', title: 'Touch not responding in certain areas', desc: 'Ghost touches or unresponsive sections.' },
        { id: 'lines_flicker', title: 'Green / pink lines or screen flickering', desc: 'Vertical or horizontal lines on AMOLED/OLED/LCD.' }
      ],
      diagnosis: {
        cracked_glass: {
          title: 'Glass / OCA Lamination or Screen Replacement',
          advice: 'Do not apply heavy pressure on the glass as it can puncture the AMOLED panel. Bring the device to Charan Mobiles (Naravi) for precision OCA glass separation or full OEM display replacement.',
          severity: 'Moderate',
          timeEstimate: '1 - 2 Hours'
        },
        black_screen: {
          title: 'Display IC or Internal Flex Cable Disconnection',
          advice: 'Try a forced reboot first (Hold Power + Volume Down for 15s). If no display returns, the internal backlight or AMOLED driver has failed.',
          severity: 'High',
          timeEstimate: 'Same Day'
        },
        touch_dead: {
          title: 'Digitizer Circuit Failure',
          advice: 'Check if a thick or cracked tempered glass is interfering. If not, the digitizer layer requires digitizer replacement or combo change.',
          severity: 'Moderate',
          timeEstimate: 'Same Day'
        },
        lines_flicker: {
          title: 'Display Controller / Flex Cable Micro-Damage',
          advice: 'Common after drop or software update on AMOLED panels. Requires display panel replacement.',
          severity: 'High',
          timeEstimate: 'Same Day'
        }
      }
    },
    {
      id: 'battery',
      name: 'Battery & Fast Charging',
      icon: 'battery-charging',
      symptoms: [
        { id: 'battery_drain', title: 'Battery drains rapidly within 2-4 hours', desc: 'Sudden battery percentage drops or shuts down at 20%.' },
        { id: 'slow_charging', title: 'Charging very slowly or only at certain angles', desc: 'Loose charging pin or moisture warning.' },
        { id: 'swollen_battery', title: 'Back cover lifting / swollen battery', desc: 'Device feels bloated or screen pushing out.' },
        { id: 'not_turning_on', title: 'Device completely dead, no charging sign', desc: 'No LED indicator or current draw.' }
      ],
      diagnosis: {
        battery_drain: {
          title: 'Battery Cell Degradation (Cycle Count Exhausted)',
          advice: 'Original high-capacity battery replacement is recommended to restore full day battery health and prevent overheating.',
          severity: 'Low to Moderate',
          timeEstimate: '30 - 45 Mins'
        },
        slow_charging: {
          title: 'Type-C / Lightning Port Wear or Lint Contamination',
          advice: 'Often caused by lint accumulation or worn CC pins. Charan Mobiles cleans or replaces charging sub-boards with original fast-charging support.',
          severity: 'Low',
          timeEstimate: '30 Mins'
        },
        swollen_battery: {
          title: 'DANGER: Expanded Lithium-ion Pouch',
          advice: 'Stop charging immediately! Swollen batteries are a safety hazard. Bring immediately to Charan Mobiles for safe removal.',
          severity: 'Urgent',
          timeEstimate: 'Priority Service'
        },
        not_turning_on: {
          title: 'Power Management IC (PMIC) or Dead Battery Shock Required',
          advice: 'Our technician will diagnose if battery voltage has dropped below cutoff or if motherboard power rail requires micro-soldering.',
          severity: 'High',
          timeEstimate: '2 - 4 Hours'
        }
      }
    },
    {
      id: 'water',
      name: 'Water & Liquid Ingress',
      icon: 'droplets',
      symptoms: [
        { id: 'water_drop', title: 'Dropped in water / rain exposure', desc: 'Phone got wet and was recently switched on.' },
        { id: 'moisture_speaker', title: 'Muffled sound or camera fogging', desc: 'Liquid vapor inside lens or speaker mesh.' }
      ],
      diagnosis: {
        water_drop: {
          title: 'Ultrasonic Motherboard De-Oxidation Required',
          advice: 'DO NOT put in rice or charge the device! Immediate ultrasonic chemical cleaning at our workshop prevents short circuits and trace corrosion.',
          severity: 'Urgent',
          timeEstimate: '1 - 3 Hours'
        },
        moisture_speaker: {
          title: 'Acoustic Mesh Cleaning & Internal Dry Cycle',
          advice: 'Our technicians safely remove moisture without damaging delicate acoustic diaphragms.',
          severity: 'Moderate',
          timeEstimate: '1 Hour'
        }
      }
    },
    {
      id: 'audio',
      name: 'Sound, Speaker & Mic',
      icon: 'volume-2',
      symptoms: [
        { id: 'earpiece_low', title: 'Call volume very low (cannot hear caller)', desc: 'Earpiece speaker volume is barely audible.' },
        { id: 'mic_issue', title: 'Other person cannot hear your voice', desc: 'Microphone not picking up speech during calls.' }
      ],
      diagnosis: {
        earpiece_low: {
          title: 'Earpiece Grill Dust Clogging or Speaker Replacement',
          advice: 'In 80% of cases, specialized acoustic solvent cleaning restores original volume without parts replacement.',
          severity: 'Low',
          timeEstimate: '20 Mins'
        },
        mic_issue: {
          title: 'Secondary Noise Cancellation / Main Mic Board Issue',
          advice: 'We test whether the secondary mic or main sub-board mic requires replacement.',
          severity: 'Low',
          timeEstimate: '45 Mins'
        }
      }
    },
    {
      id: 'software',
      name: 'Software, Hanging & Data',
      icon: 'cpu',
      symptoms: [
        { id: 'bootloop', title: 'Stuck on Brand Logo / Bootloop', desc: 'Phone keeps restarting continuously.' },
        { id: 'storage_full', title: 'Memory Full / Extreme Sluggishness', desc: 'Apps crashing, slow response.' },
        { id: 'data_transfer', title: 'Data Backup & Old-to-New Phone Transfer', desc: 'Transfer contacts, photos, WhatsApp chats to new phone.' }
      ],
      diagnosis: {
        bootloop: {
          title: 'Firmware Recovery / Software Flashing',
          advice: 'Official software flashing with high data-preservation success rate at Charan Mobiles.',
          severity: 'Moderate',
          timeEstimate: '1 - 2 Hours'
        },
        storage_full: {
          title: 'Deep System Cache Purge & App Optimization',
          advice: 'We clean junk cache, optimize background memory, and provide high-speed memory cards or external storage.',
          severity: 'Low',
          timeEstimate: '30 Mins'
        },
        data_transfer: {
          title: 'Complete 100% Secure Data & WhatsApp Migration',
          advice: 'Safe end-to-end phone transfer for Android to iPhone, iPhone to Android, or Android to Android.',
          severity: 'Low',
          timeEstimate: '1 Hour'
        }
      }
    }
  ]
};

class ProblemSolver {
  constructor() {
    this.currentStep = 1;
    this.selectedBrand = '';
    this.selectedCategory = null;
    this.selectedSymptom = null;

    this.init();
  }

  init() {
    const container = document.getElementById('problem-solver-root');
    if (!container) return;
    this.render();
  }

  setStep(step) {
    this.currentStep = step;
    this.render();
  }

  selectBrand(brand) {
    this.selectedBrand = brand;
    this.currentStep = 2;
    this.render();
  }

  selectCategory(catId) {
    this.selectedCategory = FAULT_DATABASE.categories.find(c => c.id === catId);
    this.currentStep = 3;
    this.render();
  }

  selectSymptom(symId) {
    this.selectedSymptom = this.selectedCategory.symptoms.find(s => s.id === symId);
    this.currentStep = 4;
    this.render();
  }

  reset() {
    this.currentStep = 1;
    this.selectedBrand = '';
    this.selectedCategory = null;
    this.selectedSymptom = null;
    this.render();
  }

  render() {
    const root = document.getElementById('problem-solver-root');
    if (!root) return;

    let contentHtml = '';

    // Step 1: Select Brand
    if (this.currentStep === 1) {
      const brands = ['iPhone / Apple', 'Samsung', 'OnePlus', 'Xiaomi / Redmi', 'Vivo', 'Oppo', 'Realme', 'Motorola', 'Other Brand'];
      contentHtml = `
        <div style="text-align: center; margin-bottom: 2rem;">
          <h3 style="font-size: 1.375rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Step 1: Select Your Phone Brand</h3>
          <p style="color: var(--text-secondary); font-size: 0.9375rem;">Choose the manufacturer of your smartphone or device</p>
        </div>
        <div class="solver-options-grid">
          ${brands.map(brand => `
            <button class="solver-option-btn" onclick="window.charanProblemSolver.selectBrand('${brand}')">
              <span style="font-size: 1.25rem;">📱</span>
              <span style="font-weight: 600; color: #fff;">${brand}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    // Step 2: Select Issue Category
    else if (this.currentStep === 2) {
      contentHtml = `
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="margin-bottom: 0.5rem;">
            <span class="badge badge-gold">${this.selectedBrand}</span>
          </div>
          <h3 style="font-size: 1.375rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Step 2: What type of problem are you experiencing?</h3>
          <p style="color: var(--text-secondary); font-size: 0.9375rem;">Select the hardware or software symptom area</p>
        </div>
        <div class="solver-options-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));">
          ${FAULT_DATABASE.categories.map(cat => `
            <button class="solver-option-btn" onclick="window.charanProblemSolver.selectCategory('${cat.id}')">
              <span style="font-size: 1.5rem; color: var(--gold-primary);">🔧</span>
              <span style="font-weight: 700; color: #fff;">${cat.name}</span>
            </button>
          `).join('')}
        </div>
        <div style="text-align: center; margin-top: 1.5rem;">
          <button class="btn btn-secondary" onclick="window.charanProblemSolver.setStep(1)">← Back to Brand</button>
        </div>
      `;
    }

    // Step 3: Specific Symptom
    else if (this.currentStep === 3) {
      contentHtml = `
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 0.5rem;">
            <span class="badge badge-gold">${this.selectedBrand}</span>
            <span class="badge badge-gold">${this.selectedCategory.name}</span>
          </div>
          <h3 style="font-size: 1.375rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Step 3: Select Exact Symptom</h3>
          <p style="color: var(--text-secondary); font-size: 0.9375rem;">Which description best matches what happened?</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 680px; margin: 0 auto 2rem auto;">
          ${this.selectedCategory.symptoms.map(sym => `
            <button class="solver-option-btn" style="text-align: left; align-items: flex-start; padding: 1.25rem 1.5rem;" onclick="window.charanProblemSolver.selectSymptom('${sym.id}')">
              <span style="font-weight: 700; font-size: 1.0625rem; color: #fff; margin-bottom: 0.25rem;">${sym.title}</span>
              <span style="color: var(--text-muted); font-size: 0.875rem;">${sym.desc}</span>
            </button>
          `).join('')}
        </div>
        <div style="text-align: center;">
          <button class="btn btn-secondary" onclick="window.charanProblemSolver.setStep(2)">← Back to Categories</button>
        </div>
      `;
    }

    // Step 4: Diagnosis & Actionable Recommendation
    else if (this.currentStep === 4) {
      const diag = this.selectedCategory.diagnosis[this.selectedSymptom.id];
      const settings = window.CharanStore.getSettings();

      const waMessage = 
        `Hello Charan Mobiles,\n\n` +
        `I ran a diagnostic on your website for my phone:\n` +
        `📱 Brand: ${this.selectedBrand}\n` +
        `🔧 Category: ${this.selectedCategory.name}\n` +
        `⚠️ Issue: ${this.selectedSymptom.title}\n` +
        `💡 Suggested Service: ${diag.title}\n\n` +
        `Can you please provide an estimate and check availability at your Naravi shop? Thank you!`;

      const waUrl = `https://wa.me/91${settings.phone}?text=${encodeURIComponent(waMessage)}`;

      contentHtml = `
        <div class="solver-result-box">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: gap; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
            <div>
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span class="badge badge-gold">${this.selectedBrand}</span>
                <span class="badge badge-gold">${this.selectedCategory.name}</span>
              </div>
              <h3 style="font-size: 1.5rem; font-weight: 800; color: #fff;">${diag.title}</h3>
            </div>
            <div style="text-align: right;">
              <span class="badge ${diag.severity === 'Urgent' ? 'badge-rose' : 'badge-amber'}">${diag.severity} Priority</span>
              <div style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.25rem;">Est. Time: ${diag.timeEstimate}</div>
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.875rem; font-weight: 700; color: var(--gold-light); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Expert Diagnostic Guidance:</h4>
            <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6;">${diag.advice}</p>
          </div>

          <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid var(--gold-border); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem;">
            <span style="font-size: 1.75rem;">📍</span>
            <div>
              <div style="font-weight: 700; color: #fff; font-size: 0.9375rem;">Service Location: Charan Mobiles (Naravi - 574109)</div>
              <div style="color: var(--text-muted); font-size: 0.8125rem;">Walk in anytime or book ahead via WhatsApp for priority bench repair.</div>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="${waUrl}" target="_blank" class="btn btn-whatsapp">
              <span>💬</span>
              <span>Send Diagnostic & Book on WhatsApp</span>
            </a>
            <button class="btn btn-secondary" onclick="window.charanProblemSolver.reset()">
              <span>🔄</span>
              <span>Start New Diagnosis</span>
            </button>
          </div>
        </div>
      `;
    }

    root.innerHTML = `
      <div class="solver-steps-indicator">
        <div class="solver-step-badge ${this.currentStep >= 1 ? 'active' : ''}">
          <div class="step-circle">${this.currentStep > 1 ? '✓' : '1'}</div>
          <span class="step-label">Brand</span>
        </div>
        <div class="solver-step-badge ${this.currentStep >= 2 ? 'active' : ''}">
          <div class="step-circle">${this.currentStep > 2 ? '✓' : '2'}</div>
          <span class="step-label">Category</span>
        </div>
        <div class="solver-step-badge ${this.currentStep >= 3 ? 'active' : ''}">
          <div class="step-circle">${this.currentStep > 3 ? '✓' : '3'}</div>
          <span class="step-label">Symptom</span>
        </div>
        <div class="solver-step-badge ${this.currentStep >= 4 ? 'active' : ''}">
          <div class="step-circle">4</div>
          <span class="step-label">Solution</span>
        </div>
      </div>
      ${contentHtml}
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.charanProblemSolver = new ProblemSolver();
});
