(function () {
  const catalog = window.EXST_GAMES || [];
  const rows = document.getElementById('rows');
  const grid = document.getElementById('searchGrid');
  const storageKey = 'exstHomeSections';
  let settings = {};
  try { settings = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch (_) { settings = {}; }

  function makeCard(game) {
    const link = document.createElement('a');
    link.className = 'game-card';
    link.href = `website/game.html?id=${encodeURIComponent(game.id)}`;
    const image = document.createElement('img');
    image.src = `website/${game.icon || 'assets/images/default-game.svg'}`;
    image.alt = '';
    image.onerror = () => { image.src = 'website/assets/images/default-game.svg'; };
    const title = document.createElement('span');
    title.textContent = game.title;
    link.append(image, title);
    return link;
  }

  function renderSections() {
    rows.replaceChildren();
    const groups = new Map();
    catalog.forEach((game) => {
      (game.tags || 'Games').split(',').map((tag) => tag.trim()).filter(Boolean).forEach((tag) => {
        if (settings[tag] === false) return;
        if (!groups.has(tag)) groups.set(tag, []);
        groups.get(tag).push(game);
      });
    });
    if (!groups.size && catalog.length) groups.set('Games', catalog);
    groups.forEach((items, label) => {
      const section = document.createElement('section');
      section.className = 'flix-row';
      const heading = document.createElement('h2');
      heading.textContent = label;
      const cards = document.createElement('div');
      cards.className = 'row-posters';
      items.forEach((game) => cards.append(makeCard(game)));
      section.append(heading, cards);
      rows.append(section);
    });
  }

  const hero = catalog.find((game) => game.id === settings.spotlight) || catalog.find((game) => game.hero === 'true') || catalog[0];
  if (hero) {
    document.getElementById('heroTitle').textContent = hero.title;
    document.getElementById('heroOverview').textContent = hero.description || '';
    document.getElementById('heroKicker').textContent = hero.version || 'Featured game';
    document.getElementById('heroPlay').dataset.play = hero.id;
    document.getElementById('heroCover').style.backgroundImage = `linear-gradient(90deg,#111,transparent),url("website/${hero.icon || 'assets/images/default-game.svg'}")`;
  }
  renderSections();
  catalog.forEach((game) => grid.append(makeCard(game)));
  const count = document.getElementById('searchCount');
  if (count) count.textContent = `${catalog.length} games`;

  // Main-page editor: select the spotlight game and toggle tag-based home rows.
  document.getElementById('editSections')?.addEventListener('click', () => {
    const dialog = document.getElementById('sectionsDialog');
    const content = document.getElementById('sectionsEditor');
    content.replaceChildren();
    const spotlightLabel = document.createElement('label');
    spotlightLabel.className = 'section-editor-field';
    spotlightLabel.textContent = 'Spotlight game';
    const spotlightSelect = document.createElement('select');
    spotlightSelect.id = 'spotlightChoice';
    catalog.forEach((game) => {
      const option = document.createElement('option'); option.value = game.id; option.textContent = game.title;
      option.selected = game.id === (settings.spotlight || hero?.id); spotlightSelect.append(option);
    });
    spotlightLabel.append(spotlightSelect);
    content.append(spotlightLabel);
    const heading = document.createElement('h3'); heading.textContent = 'Home page sections'; content.append(heading);
    const tags = [...new Set(catalog.flatMap((game) => (game.tags || 'Games').split(',').map((tag) => tag.trim()).filter(Boolean)))];
    tags.forEach((tag) => {
      const label = document.createElement('label'); label.className = 'section-editor-toggle';
      const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = settings[tag] !== false;
      checkbox.dataset.section = tag;
      label.append(checkbox, document.createTextNode(` Show ${tag} section`)); content.append(label);
    });
    dialog.showModal();
  });
  document.getElementById('saveSections')?.addEventListener('click', () => {
    const dialog = document.getElementById('sectionsDialog');
    const next = { spotlight: document.getElementById('spotlightChoice')?.value };
    document.querySelectorAll('#sectionsEditor [data-section]').forEach((checkbox) => { next[checkbox.dataset.section] = checkbox.checked; });
    settings = next;
    try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch (_) { /* session remains usable */ }
    location.reload();
  });
  document.getElementById('closeSections')?.addEventListener('click', () => document.getElementById('sectionsDialog').close());

  document.querySelectorAll('#footerBar button').forEach((button) => button.addEventListener('click', () => {
    const name = button.getAttribute('ref');
    document.querySelectorAll('.flix-page').forEach((page) => { page.hidden = page.id !== `page-${name}`; });
    document.querySelectorAll('#footerBar button').forEach((item) => item.classList.toggle('active', item === button));
  }));
  document.getElementById('searchInput')?.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    grid.replaceChildren(...catalog.filter((game) => game.title.toLowerCase().includes(query)).map(makeCard));
  });
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-play]'); if (!button) return;
    const game = catalog.find((item) => item.id === button.dataset.play) || hero; if (!game) return;
    const mode = localStorage.getItem('openMode') || 'page';
    const url = `website/${game.path}`;
    if (mode === 'same') location.href = url;
    else if (mode === 'new') window.open(url, '_blank', 'noopener');
    else location.href = `website/game.html?id=${encodeURIComponent(game.id)}`;
  });
  document.getElementById('openMode')?.addEventListener('change', (event) => localStorage.setItem('openMode', event.target.value));
  const mode = document.getElementById('openMode'); if (mode) mode.value = localStorage.getItem('openMode') || 'page';
})();
