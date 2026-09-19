const OPENWEATHER_API_KEY = 'c4e7ada7f619f1bdae8619c9815de4ed';
const LAT = -9.6658;
const LON = -35.7353;
const MEMBERS_URL = 'dados/membros.json';

const LEVEL_LABELS = { 2: 'Prata', 3: 'Ouro' };
const LEVEL_CLASSES = { 2: 'badge-silver', 3: 'badge-gold' };

function capitalizeWords(text) {
  return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function setupNav() {
  const hamburger = document.getElementById('hamburgerBtn');
  const navList = document.getElementById('navList');

  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
  }
}

function setFooterDates() {
  const yearEl = document.getElementById('currentYear');
  const modEl = document.getElementById('lastModified');

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modEl) modEl.textContent = document.lastModified;
}

function renderCurrentWeather(data) {
  const container = document.getElementById('weatherCurrent');
  if (!container) return;

  const temp = Math.round(data.main.temp);
  const tempMax = Math.round(data.main.temp_max);
  const tempMin = Math.round(data.main.temp_min);
  const humidity = data.main.humidity;
  const description = capitalizeWords(data.weather[0].description);
  const iconCode = data.weather[0].icon;
  const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  container.innerHTML = `
    <div class="weather-main-row">
      <img class="weather-icon-img" src="${iconSrc}" alt="${description}" width="64" height="64">
      <span class="current-temp-val">${temp}&deg;C</span>
    </div>
    <p class="weather-desc-text">${description}</p>
    <ul class="weather-details-list">
      <li><span>Máxima:</span> <strong>${tempMax}&deg;C</strong></li>
      <li><span>Mínima:</span> <strong>${tempMin}&deg;C</strong></li>
      <li><span>Umidade:</span> <strong>${humidity}%</strong></li>
    </ul>
  `;
}

function renderForecast(forecastList) {
  const container = document.getElementById('weatherForecast');
  if (!container) return;

  const dailyMap = new Map();
  const todayIso = new Date().toISOString().split('T')[0];

  forecastList.forEach(item => {
    const dateStr = item.dt_txt.split(' ')[0];
    if (!dailyMap.has(dateStr)) {
      dailyMap.set(dateStr, []);
    }
    dailyMap.get(dateStr).push(item);
  });

  const dayKeys = Array.from(dailyMap.keys()).slice(0, 3);

  const forecastItems = dayKeys.map((dateKey, index) => {
    const dayItems = dailyMap.get(dateKey);
    const middayItem = dayItems.find(it => it.dt_txt.includes('12:00:00')) || dayItems[0];
    const temp = Math.round(middayItem.main.temp);

    let label;
    if (index === 0 && dateKey === todayIso) {
      label = 'Hoje';
    } else {
      const dateObj = new Date(`${dateKey}T12:00:00`);
      const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
      label = capitalizeWords(weekday);
    }

    return `
      <div class="forecast-row">
        <span class="forecast-day-label">${label}:</span>
        <span class="forecast-temp-val">${temp}&deg;C</span>
      </div>
    `;
  });

  container.innerHTML = forecastItems.join('');
}

function getFallbackWeatherData() {
  return {
    current: {
      main: { temp: 28, temp_max: 30, temp_min: 24, humidity: 73 },
      weather: [{ description: 'parcialmente nublado', icon: '02d' }]
    },
    forecast: [
      { dt_txt: new Date(Date.now()).toISOString().split('T')[0] + ' 12:00:00', main: { temp: 28 } },
      { dt_txt: new Date(Date.now() + 86400000).toISOString().split('T')[0] + ' 12:00:00', main: { temp: 29 } },
      { dt_txt: new Date(Date.now() + 172800000).toISOString().split('T')[0] + ' 12:00:00', main: { temp: 27 } }
    ]
  };
}

async function fetchWeather() {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;
  const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastWeatherUrl)
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error(`OpenWeather status: ${currentRes.status} / ${forecastRes.status}`);
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    renderCurrentWeather(currentData);
    renderForecast(forecastData.list);
  } catch (error) {
    console.warn('OpenWeather live fetch unavailable (key may be activating). Using fallback data.', error);
    const fallback = getFallbackWeatherData();
    renderCurrentWeather(fallback.current);
    renderForecast(fallback.forecast);
  }
}

function createSpotlightCard(member) {
  const levelLabel = LEVEL_LABELS[member.membershipLevel] ?? 'Membro';
  const levelClass = LEVEL_CLASSES[member.membershipLevel] ?? 'badge-silver';
  const cleanUrl = member.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  const domain = cleanUrl.split('/')[0];
  const email = `contato@${domain}`;

  const article = document.createElement('article');
  article.className = 'spotlight-card';
  article.setAttribute('data-level', member.membershipLevel);
  article.setAttribute('role', 'listitem');

  article.innerHTML = `
    <div class="spotlight-header">
      <h3>${member.name}</h3>
      <p class="spotlight-slogan">${member.description ?? 'Associado à Câmara de Comércio de Alagoas'}</p>
    </div>
    <hr class="spotlight-divider">
    <div class="spotlight-body">
      <div class="spotlight-image-box">
        <img
          src="imagens/${member.image}"
          alt="Logotipo de ${member.name}"
          width="130"
          height="80"
          loading="lazy"
          onerror="this.src='imagens/placeholder.svg'; this.onerror=null;"
        >
      </div>
      <div class="spotlight-info-list">
        <p><span class="spotlight-label">E-mail:</span> <a href="mailto:${email}">${email}</a></p>
        <p><span class="spotlight-label">Telefone:</span> <a href="tel:${member.phone.replace(/\D/g, '')}">${member.phone}</a></p>
        <p><span class="spotlight-label">Site:</span> <a href="${member.website}" target="_blank" rel="noopener noreferrer">${cleanUrl}</a></p>
      </div>
    </div>
    <div class="spotlight-footer">
      <span class="spotlight-badge ${levelClass}">Nível ${levelLabel}</span>
    </div>
  `;

  return article;
}

async function loadSpotlights() {
  const container = document.getElementById('spotlightsGrid');
  if (!container) return;

  try {
    const response = await fetch(MEMBERS_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const members = await response.json();

    const eligible = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);

    for (let i = eligible.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
    }

    const selected = eligible.slice(0, 3);

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    selected.forEach(member => fragment.appendChild(createSpotlightCard(member)));
    container.appendChild(fragment);
  } catch (error) {
    console.error('Failed to load spotlights:', error);
    container.innerHTML = '<p class="error-msg">Não foi possível carregar as empresas em destaque.</p>';
  }
}

async function init() {
  setupNav();
  setFooterDates();
  await Promise.all([
    fetchWeather(),
    loadSpotlights()
  ]);
}

init();
