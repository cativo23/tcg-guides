// N's Zoroark ex guide — scroll-spy nav, mobile rail toggle, scroll-reveal, copy-decklist utility.
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
    const navObserver = new IntersectionObserver(
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
    sections.forEach((s) => navObserver.observe(s));
  }

  // Reveal-on-scroll: fires once per element, no scroll-event listeners.
  const revealTargets = document.querySelectorAll('.reveal-on-scroll');
  if (revealTargets.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  const copyBtn = document.querySelector('[data-copy-decklist]');
  if (copyBtn) {
    const defaultLabel = copyBtn.textContent;
    copyBtn.addEventListener('click', async () => {
      const text = document.querySelector('#decklist-plaintext')?.textContent?.trim();
      if (!text) return;
      copyBtn.dataset.state = 'loading';
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.dataset.state = 'success';
        copyBtn.textContent = 'Copied ✓';
      } catch {
        copyBtn.removeAttribute('data-state');
        copyBtn.textContent = 'Could not copy — select manually';
      }
      setTimeout(() => {
        copyBtn.removeAttribute('data-state');
        copyBtn.textContent = defaultLabel;
      }, 2200);
    });
  }
})();
