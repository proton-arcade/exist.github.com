(function () {
  const games = window.EXST_GAMES || [];
  const rows = document.getElementById('rows');
  const grid = document.getElementById('searchGrid');
  function card(game) {
    const a = document.createElement('a'); a.className = 'game-card'; a.href = `website/game.html?id=${encodeURIComponent(game.id)}`;
    a.innerHTML = `<img src="website/${game.icon || 'assets/images/default-game.svg'}" alt="" onerror="this.src='website/assets/images/default-game.svg'"><span>${game.title}</span>`; return a;
  }
  games.forEach((g) => rows.append(card(g)));
  games.forEach((g) => grid.append(card(g)));
  const count = document.getElementById('searchCount'); if (count) count.textContent = `${games.length} games`;
  const hero = games.find((g) => g.hero === 'true') || games[0];
  if (hero) {
    document.getElementById('heroTitle').textContent = hero.title;
    document.getElementById('heroOverview').textContent = hero.description || '';
    document.getElementById('heroKicker').textContent = hero.version || 'Featured game';
    document.getElementById('heroPlay').dataset.play = hero.id;
    document.getElementById('heroCover').style.backgroundImage = `linear-gradient(90deg,#111,transparent),url("website/${hero.icon || 'assets/images/default-game.svg'}")`;
  }
  document.querySelectorAll('#footerBar button').forEach((button) => button.addEventListener('click', () => {
    const name = button.getAttribute('ref');
    document.querySelectorAll('.flix-page').forEach((p) => { p.hidden = p.id !== `page-${name}`; });
    document.querySelectorAll('#footerBar button').forEach((b) => b.classList.toggle('active', b === button));
  }));
  document.getElementById('searchInput')?.addEventListener('input', (event) => {
    const q = event.target.value.toLowerCase(); grid.replaceChildren(...games.filter((g) => g.title.toLowerCase().includes(q)).map(card));
  });
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-play]'); if (!button) return;
    const game = games.find((g) => g.id === button.dataset.play) || hero; if (!game) return;
    const mode = localStorage.getItem('openMode') || 'page'; const url = `website/${game.path}`;
    localStorage.setItem('plays', String(Number(localStorage.getItem('plays') || 0) + 1));
    if (mode === 'same') location.href = url; else if (mode === 'new') window.open(url, '_blank', 'noopener'); else location.href = `website/game.html?id=${encodeURIComponent(game.id)}`;
  });
  document.getElementById('openMode')?.addEventListener('change', (e) => localStorage.setItem('openMode', e.target.value));
  const mode = document.getElementById('openMode'); if (mode) mode.value = localStorage.getItem('openMode') || 'page';
})();
