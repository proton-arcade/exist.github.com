(function () {
  const symbols = { home: '⌂', search: '⌕', info: 'ⓘ', add: '+', play: '▶', sort: '↕', arrow_back: '←', 'arrow-up-right': '↗', x: '×' };
  document.querySelectorAll('[data-icon]').forEach((el) => { el.textContent = symbols[el.dataset.icon] || '•'; el.setAttribute('aria-hidden', 'true'); });
})();
