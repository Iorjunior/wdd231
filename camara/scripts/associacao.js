function setupNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navList = document.getElementById('navList');

  if (hamburgerBtn && navList) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }
}

function setFooterDates() {
  const yearEl = document.getElementById('currentYear');
  const modEl = document.getElementById('lastModified');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
  if (modEl) {
    modEl.textContent = document.lastModified;
  }
}

function setFormTimestamp() {
  const timestampInput = document.getElementById('timestamp');
  if (timestampInput) {
    timestampInput.value = new Date().toISOString();
  }
}

function setupModals() {
  const openButtons = document.querySelectorAll('[data-modal]');
  const closeButtons = document.querySelectorAll('.close-modal-btn, .modal-close-action');
  const dialogs = document.querySelectorAll('dialog.membership-modal');

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const dialog = document.getElementById(modalId);
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const dialog = btn.closest('dialog');
      if (dialog && typeof dialog.close === 'function') {
        dialog.close();
      }
    });
  });

  dialogs.forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });
}

function init() {
  setupNav();
  setFooterDates();
  setFormTimestamp();
  setupModals();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
