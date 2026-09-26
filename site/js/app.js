// N's Zoroark ex guide — active nav pill, chart reveal, card viewer, copy-decklist.
// No frameworks; IntersectionObserver only (no scroll listeners).

(function () {
  const links = document.querySelectorAll('.pill__links a');
  const sections = Array.from(links)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          links.forEach((a) => {
            const on = a.getAttribute('href') === id;
            a.classList.toggle('is-active', on);
            if (on) a.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          });
        });
      },
      { rootMargin: '-35% 0px -60% 0px' }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  // Bars grow once when their chart scrolls into view.
  const charts = document.querySelectorAll('.bars, .mus');
  if (charts.length && 'IntersectionObserver' in window) {
    const chartObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );
    charts.forEach((c) => chartObserver.observe(c));
  } else {
    charts.forEach((c) => c.classList.add('is-visible'));
  }

  // Card viewer: tap a card on the mat to see it large, with its role in this deck.
  const viewer = document.getElementById('viewer');
  if (viewer && typeof viewer.showModal === 'function') {
    const art = viewer.querySelector('.viewer__art');
    const img = document.getElementById('viewer-img');
    let lastCard = null;
    document.querySelectorAll('[data-card]').forEach((card) => {
      card.addEventListener('click', () => {
        lastCard = card;
        const { name, code, qty, role, img: src } = card.dataset;
        document.getElementById('viewer-name').textContent = name;
        document.getElementById('viewer-code').textContent = code;
        document.getElementById('viewer-qty').textContent = `${qty} in the deck`;
        document.getElementById('viewer-role').textContent = role;
        art.querySelector('.energy-art')?.remove();
        if (src) {
          img.hidden = false;
          img.src = src;
          img.alt = name;
        } else {
          img.hidden = true;
          const face = card.querySelector('.energy-art');
          if (face) art.appendChild(face.cloneNode(true));
        }
        viewer.showModal();
      });
    });
    viewer.addEventListener('click', (e) => {
      if (e.target === viewer) viewer.close();
    });
    viewer.addEventListener('close', () => lastCard?.focus());
  } else {
    document.querySelectorAll('[data-card]').forEach((c) => (c.style.cursor = 'default'));
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
        copyBtn.dataset.state = 'error';
        copyBtn.textContent = 'Could not copy';
      }
      setTimeout(() => {
        copyBtn.removeAttribute('data-state');
        copyBtn.textContent = defaultLabel;
      }, 2200);
    });
  }
})();
