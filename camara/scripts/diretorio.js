const MEMBERS_URL = 'dados/membros.json';
const membersContainer = document.getElementById('membersContainer');
const btnGrid = document.getElementById('btnGrid');
const btnList = document.getElementById('btnList');

const LEVEL_LABELS = { 1: 'Membro', 2: 'Prata', 3: 'Ouro' };
const LEVEL_CLASSES = { 1: 'badge-member', 2: 'badge-silver', 3: 'badge-gold' };

async function fetchMembers() {
  try {
    const response = await fetch(MEMBERS_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
}

function buildCard(member) {
  const levelLabel = LEVEL_LABELS[member.membershipLevel] ?? 'Membro';
  const levelClass = LEVEL_CLASSES[member.membershipLevel] ?? 'badge-member';

  const article = document.createElement('article');
  article.className = 'member-card';
  article.setAttribute('data-level', member.membershipLevel);
  article.setAttribute('role', 'listitem');

  article.innerHTML = `
    <div class="card-header">
      <h2>${member.name}</h2>
      <span class="card-badge ${levelClass}">${levelLabel}</span>
    </div>
    <img
      class="card-image"
      src="imagens/${member.image}"
      alt="Logo de ${member.name}"
      width="400"
      height="160"
      loading="lazy"
      onerror="this.src='imagens/placeholder.svg'; this.onerror=null;"
    >
    <div class="card-body">
      <p class="card-description">${member.description ?? ''}</p>
      <div class="card-info">
        <p><span class="info-label">Endereço:</span> ${member.address}</p>
        <p><span class="info-label">Telefone:</span> <a href="tel:${member.phone.replace(/\D/g, '')}">${member.phone}</a></p>
        <p><span class="info-label">Site:</span> <a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website.replace(/^https?:\/\//, '')}</a></p>
      </div>
    </div>
  `;

  return article;
}

function renderMembers(members) {
  membersContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();
  members.forEach(member => fragment.appendChild(buildCard(member)));
  membersContainer.appendChild(fragment);
}

function setView(view) {
  if (view === 'list') {
    membersContainer.classList.add('list-view');
    btnList.classList.add('active');
    btnList.setAttribute('aria-pressed', 'true');
    btnGrid.classList.remove('active');
    btnGrid.setAttribute('aria-pressed', 'false');
  } else {
    membersContainer.classList.remove('list-view');
    btnGrid.classList.add('active');
    btnGrid.setAttribute('aria-pressed', 'true');
    btnList.classList.remove('active');
    btnList.setAttribute('aria-pressed', 'false');
  }
}

function setupToggle() {
  btnGrid.addEventListener('click', () => setView('grid'));
  btnList.addEventListener('click', () => setView('list'));
}

function setupNav() {
  const hamburger = document.getElementById('hamburgerBtn');
  const navList = document.getElementById('navList');

  hamburger.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });
}

function setFooterDates() {
  const yearEl = document.getElementById('currentYear');
  const modEl = document.getElementById('lastModified');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modEl) modEl.textContent = document.lastModified;
}

async function init() {
  setupNav();
  setupToggle();
  setFooterDates();

  membersContainer.innerHTML = '<p class="loading-msg">Carregando membros...</p>';

  try {
    const members = await fetchMembers();
    renderMembers(members);
  } catch {
    membersContainer.innerHTML = '<p class="error-msg">Não foi possível carregar os membros. Tente novamente.</p>';
  }
}

init();
