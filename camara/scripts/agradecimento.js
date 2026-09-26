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

function formatTimestamp(timestampStr) {
  if (!timestampStr) return 'Não informado';
  const parsedDate = new Date(timestampStr);
  if (Number.isNaN(parsedDate.getTime())) {
    return timestampStr;
  }
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'medium'
  }).format(parsedDate);
}

function formatMembershipLevel(levelCode) {
  const levels = {
    np: 'Associação NP (Sem fins lucrativos)',
    bronze: 'Associação Bronze',
    silver: 'Associação Prata (Silver)',
    gold: 'Associação Ouro (Gold)'
  };
  return levels[levelCode] || levelCode || 'Não especificado';
}

function displaySubmittedData() {
  const params = new URLSearchParams(window.location.search);
  const summaryContainer = document.getElementById('summaryList');
  if (!summaryContainer) return;

  const firstName = params.get('firstName') || '';
  const lastName = params.get('lastName') || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Não informado';
  const email = params.get('email') || 'Não informado';
  const phone = params.get('phone') || 'Não informado';
  const organization = params.get('organization') || 'Não informado';
  const orgTitle = params.get('orgTitle') || '';
  const membershipLevel = params.get('membershipLevel') || '';
  const description = params.get('description') || '';
  const rawTimestamp = params.get('timestamp') || '';
  const formattedTime = formatTimestamp(rawTimestamp);

  const items = [
    { label: 'Nome Completo', value: fullName },
    { label: 'Endereço de E-mail', value: email },
    { label: 'Telefone / Celular', value: phone },
    { label: 'Nome da Organização', value: organization },
    ...(orgTitle ? [{ label: 'Cargo na Organização', value: orgTitle }] : []),
    ...(membershipLevel ? [{ label: 'Nível Selecionado', value: formatMembershipLevel(membershipLevel) }] : []),
    ...(description ? [{ label: 'Descrição da Atividade', value: description }] : []),
    { label: 'Data e Hora da Solicitação', value: formattedTime }
  ];

  summaryContainer.innerHTML = '';
  items.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'summary-item';

    const labelSpan = document.createElement('span');
    labelSpan.className = 'summary-label';
    labelSpan.textContent = item.label;

    const valueSpan = document.createElement('span');
    valueSpan.className = 'summary-value';
    valueSpan.textContent = item.value;

    itemEl.appendChild(labelSpan);
    itemEl.appendChild(valueSpan);
    summaryContainer.appendChild(itemEl);
  });
}

function init() {
  setupNav();
  setFooterDates();
  displaySubmittedData();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
