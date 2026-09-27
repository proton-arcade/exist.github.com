/* Parse the small, human-editable catalog files used by the arcade. */
(function () {
  function parse(text) {
    return String(text || '').split(/\n\s*\[game\]\s*\n/i).slice(1).map((block) => {
      const item = {};
      block.split(/\r?\n/).forEach((line) => {
        const at = line.indexOf('=');
        if (at > 0) item[line.slice(0, at).trim()] = line.slice(at + 1).trim();
      });
      return item;
    }).filter((item) => item.id && item.title && item.path);
  }
  window.EXST_GAMES = parse(window.EXST_GAMES_TEXT);
})();
