// N's Zoroark ex guide — scroll-spy nav, mobile rail toggle, copy-decklist utility.
// No frameworks; IntersectionObserver only (no scroll listeners).

(function () {
  const rail = document.querySelector('.rail');
  const toggle = document.querySelector('.rail-toggle');
  if (toggle && rail) {
    toggle.addEventListener('click', () => {
      const open = rail.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    rail.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => rail.classList.remove('is-open'))
    );
  }

  const links = document.querySelectorAll('.rail__nav a');
  const sections = Array.from(links)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          links.forEach((a) =>
            a.classList.toggle('is-active', a.getAttribute('href') === id)
          );
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
  }

  const copyBtn = document.querySelector('[data-copy-decklist]');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const text = document.querySelector('#decklist-plaintext')?.textContent?.trim();
      if (!text) return;
      copyBtn.dataset.state = 'loading';
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.dataset.state = 'success';
        copyBtn.textContent = 'Copiado ✓';
      } catch {
        copyBtn.removeAttribute('data-state');
        copyBtn.textContent = 'No se pudo copiar — selecciona manualmente';
      }
      setTimeout(() => {
        copyBtn.removeAttribute('data-state');
        copyBtn.textContent = 'Copiar lista (formato TCG Live)';
      }, 2200);
    });
  }
})();
