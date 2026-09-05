const hamburgerBtn = document.querySelector('#hamburgerBtn');
const navList = document.querySelector('#navList');

if (hamburgerBtn && navList) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    hamburgerBtn.textContent = isOpen ? '✕' : '☰';
  });
}
