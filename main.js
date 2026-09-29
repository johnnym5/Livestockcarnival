/**
 * LIVESTOCKCARNIVAL.NG - GLOBAL CLIENT ORCHESTRATION & SERVICES
 * Features:
 *  - Global Institutional Masthead, Navigation, and Footer Rendering (Borderless & Unboxed)
 *  - Pure JS iCalendar (.ics) Generator
 *  - Client-Side Form Validation (PDF MIME verification, <=5MB, 11-digit NIN)
 *  - XSS-safe HTML Escaping Utilities
 *  - Mobile Menu State Manager
 *  - Dynamic Schedule, Media & Attractions Loaders
 */

// XSS Sanitizer Utility
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Global Toast System
function showToast(message, type = 'info') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Global Institutional Navigation Renderer (Borderless & Unboxed)
function renderGlobalNav(activePage = '') {
  const mastheadMount = document.getElementById('masthead-mount');
  const navMount = document.getElementById('nav-mount');

  if (mastheadMount) {
    mastheadMount.innerHTML = '';
  }

  if (navMount) {
    const pages = [
      { name: 'Home', href: 'index.html', key: 'home' },
      { name: 'About & Mandate', href: 'about.html', key: 'about' },
      { name: 'Attractions', href: 'attractions.html', key: 'attractions' },
      { name: 'Schedule', href: 'schedule.html', key: 'schedule' },
      { name: 'Media Center', href: 'media.html', key: 'media' },
      { name: 'Venue Map', href: 'venue-map.html', key: 'map' },
      { name: 'Contact', href: 'contact.html', key: 'contact' }
    ];

    const navItemsHTML = pages.map(p => `
      <li class="nav-item">
        <a href="${p.href}" class="nav-link ${activePage === p.key ? 'active' : ''}">${p.name}</a>
      </li>
    `).join('');

    const mobileItemsHTML = pages.map(p => `
      <a href="${p.href}" class="mobile-nav-link ${activePage === p.key ? 'active' : ''}">${p.name}</a>
    `).join('');

    navMount.innerHTML = `
      <nav class="main-nav">
        <div class="container-custom nav-container">
          <a href="index.html" class="nav-brand nav-logo">
            <div class="brand-crest logo-wrapper">
              <img src="assets/company_logo_clean.png" alt="Renewed Hope National Livestock Carnival Emblem">
            </div>
            <div class="brand-text">
              <span class="brand-title">LIVESTOCK CARNIVAL</span>
              <span class="brand-subtitle">ABUJA 2026 • PILOT EXPO</span>
            </div>
          </a>

          <ul class="nav-menu">
            ${navItemsHTML}
          </ul>

          <div class="nav-actions">
            <a href="https://vendors.livestockcarnival.ng" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">Vendor Portal</a>
            <a href="https://pass.livestockcarnival.ng" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Free Gate Pass</a>
            <button class="mobile-toggle" id="mobile-toggle-btn" aria-label="Toggle navigation menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <div class="mobile-menu-drawer" id="mobile-menu-drawer">
          ${mobileItemsHTML}
          <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <a href="https://vendors.livestockcarnival.ng" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width: 100%;">Vendor Portal</a>
            <a href="https://pass.livestockcarnival.ng" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%;">Free Gate Pass</a>
          </div>
        </div>
      </nav>
    `;

    // Mobile Toggle Handler
    const toggleBtn = document.getElementById('mobile-toggle-btn');
    const drawer = document.getElementById('mobile-menu-drawer');
    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => {
        drawer.classList.toggle('open');
      });
    }
  }
}

// Global Footer Renderer (Borderless & Unboxed)
function renderGlobalFooter() {
  const footerMount = document.getElementById('footer-mount');
  if (!footerMount) return;

  footerMount.innerHTML = `
    <footer class="site-footer">
      <div class="container-custom">
        <div class="footer-grid">
          <div class="footer-brand-col">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="brand-crest logo-wrapper" style="width: 38px; height: 38px;">
                <img src="assets/company_logo_clean.png" alt="Emblem">
              </div>
              <span style="font-weight: 800; font-size: 1.125rem; letter-spacing: -0.02em;">LIVESTOCK CARNIVAL 2026</span>
            </div>
            <p class="text-subtle" style="font-size: 0.875rem; line-height: 1.6;">
              The gateway and public festival portal for the 2026 Pilot Livestock Show and Agri-Export Expo. Headquartered and operational in Abuja at the Old Parade Ground.
            </p>
            <div class="footer-endorsement">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              An official initiative of the Federal Government of Nigeria &amp; NHESICS
            </div>
          </div>

          <div>
            <h4 class="footer-col-title">Festival Hubs</h4>
            <ul class="footer-nav-list">
              <li><a href="attractions.html#durbar" class="footer-nav-link">Royal Durbar Pageantry</a></li>
              <li><a href="attractions.html#meat-market" class="footer-nav-link">Fresh Meat &amp; Scale Market</a></li>
              <li><a href="attractions.html#suya-village" class="footer-nav-link">Twilight Suya Village</a></li>
              <li><a href="attractions.html#livestock-judging" class="footer-nav-link">Championship Judging</a></li>
              <li><a href="venue-map.html" class="footer-nav-link">GIS Satellite Venue Map</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-col-title">Policy &amp; Media</h4>
            <ul class="footer-nav-list">
              <li><a href="about.html" class="footer-nav-link">Presidential Mandate</a></li>
              <li><a href="about.html#financing" class="footer-nav-link">Bank of Industry Window</a></li>
              <li><a href="media.html" class="footer-nav-link">Press Releases &amp; Briefings</a></li>
              <li><a href="media.html#kits" class="footer-nav-link">Media Kit Downloads</a></li>
              <li><a href="accreditation.html" class="footer-nav-link">Journalist Accreditation</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-col-title">Secretariat &amp; Venue</h4>
            <ul class="footer-nav-list">
              <li style="font-size: 0.875rem; color: var(--slate-subtext);">
                Old Parade Ground &amp; Abuja Mini Stadium, Area 10, Garki, Abuja FCT
              </li>
              <li><a href="contact.html" class="footer-nav-link">Secretariat Directory</a></li>
              <li><a href="tel:+2348000000000" class="footer-nav-link">+234 (0) 9 461 4000</a></li>
              <li><a href="mailto:secretariat@livestockcarnival.ng" class="footer-nav-link">secretariat@livestockcarnival.ng</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom-bar">
          <div>
            &copy; 2026 National Livestock Carnival Secretariat. All rights reserved.
          </div>
          <div style="display: flex; gap: 1.5rem;">
            <a href="contact.html" class="footer-nav-link">Privacy Policy</a>
            <a href="contact.html" class="footer-nav-link">Terms of Accreditation</a>
            <a href="contact.html" class="footer-nav-link">Security Protocols</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// iCalendar (.ics) Generator
function generateICS(event) {
  const formatDate = (isoStr) => {
    const d = new Date(isoStr);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startStamp = formatDate(event.startIso);
  const endStamp = formatDate(event.endIso);
  const nowStamp = formatDate(new Date().toISOString());

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Livestock Carnival Abuja 2026//Festival Timetable//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}-2026@livestockcarnival.ng`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${startStamp}`,
    `DTEND:${endStamp}`,
    `SUMMARY:${event.title} - Livestock Carnival 2026`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.venue}, Old Parade Ground, Area 10, Garki, Abuja`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.href = url;
  tempLink.setAttribute('download', `${event.id}_${event.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`);
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  URL.revokeObjectURL(url);
  showToast(`Calendar reminder exported for: ${event.title}`);
}

// Client-Side Validation Utilities
function validateAccreditationForm(formData, file) {
  const errors = [];

  const fullName = formData.get('fullName')?.trim();
  const organization = formData.get('organization')?.trim();
  const nin = formData.get('nin')?.trim();
  const email = formData.get('email')?.trim();

  if (!fullName || fullName.length < 3) {
    errors.push('Full legal name is required (minimum 3 characters).');
  }

  if (!organization || organization.length < 2) {
    errors.push('Press/Media Organization name is required.');
  }

  // 11-digit National Identity Number check
  if (!nin || !/^\d{11}$/.test(nin)) {
    errors.push('National Identity Number (NIN) must be exactly 11 digits.');
  }

  // Email check
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid editorial email address is required.');
  }

  // PDF File verification
  if (!file) {
    errors.push('An official press credential or assignment letter PDF is required.');
  } else {
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPDF) {
      errors.push('Uploaded credential must be a valid PDF document.');
    }
    const maxBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxBytes) {
      errors.push('File size exceeds the 5MB limit. Please compress your PDF.');
    }
  }

  return errors;
}

// Exported globals
window.livestockApp = {
  escapeHTML,
  showToast,
  renderGlobalNav,
  renderGlobalFooter,
  generateICS,
  validateAccreditationForm
};