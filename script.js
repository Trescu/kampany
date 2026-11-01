/* Ricsi a HÖK-ért — plain JavaScript, no dependencies. */
(() => {
  'use strict';

  const config = window.CAMPAIGN_CONFIG || {};
  const $ = selector => document.querySelector(selector);
  const menuButton = $('#menu-toggle');
  const nav = $('#primary-nav');
  const toast = $('#toast');
  let toastTimer;

  const notify = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3600);
  };

  const closeMenu = () => {
    nav?.classList.remove('is-open');
    menuButton?.classList.remove('is-active');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Menü megnyitása');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const opening = !nav.classList.contains('is-open');
    if (opening) {
      nav.classList.add('is-open');
      menuButton.classList.add('is-active');
      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.setAttribute('aria-label', 'Menü bezárása');
      document.body.classList.add('menu-open');
    } else closeMenu();
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 1120) closeMenu(); });

  // Five original gallery assets; one large preview and four selectable thumbnails.
  const gallery = $('#gallery-scroll');
  const cards = [...(gallery?.querySelectorAll('.gallery-card') || [])];
  const featured = $('#gallery-feature');
  const featureImage = $('#gallery-feature-image');
  const featureTitle = $('#gallery-feature-title');
  const featureCaption = $('#gallery-feature-caption');
  const galleryItems = cards.map(card => ({
    full: card.dataset.full || '',
    story: card.dataset.story || '',
    title: card.dataset.galleryTitle || card.querySelector('strong')?.textContent?.trim() || 'Kampánykép',
    caption: card.dataset.galleryCaption || card.querySelector('small')?.textContent?.trim() || '',
    alt: card.querySelector('img')?.alt || 'Kampánykép'
  }));
  let selectedGalleryIndex = 0;
  const selectGalleryImage = index => {
    if (!galleryItems.length || !featured || !featureImage) return;
    selectedGalleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[selectedGalleryIndex];
    featureImage.src = item.full;
    featureImage.alt = item.alt;
    featured.dataset.full = item.full;
    featured.dataset.story = item.story;
    featured.dataset.galleryIndex = String(selectedGalleryIndex);
    featured.setAttribute('aria-label', item.title + ' – kép és történet megnyitása');
    if (featureTitle) featureTitle.textContent = '» ' + item.title;
    if (featureCaption) featureCaption.textContent = item.caption;
    cards.forEach((card, i) => {
      const current = i === selectedGalleryIndex;
      card.classList.toggle('is-current', current);
      if (i > 0) card.setAttribute('aria-pressed', String(current));
    });
  };
  $('#gallery-prev')?.addEventListener('click', () => selectGalleryImage(selectedGalleryIndex - 1));
  $('#gallery-next')?.addEventListener('click', () => selectGalleryImage(selectedGalleryIndex + 1));

  // Existing full-screen image/story dialog retained.
  const dialog = $('#image-modal');
  const modalImage = $('#modal-image');
  const modalCaption = $('#modal-caption');
  const modalStory = $('#modal-story');
  const modalClose = $('#modal-close');
  let activeCardIndex = 0;
  let lastTrigger = null;
  const populateStory = index => {
    if (!galleryItems.length || !modalImage || !modalStory) return;
    activeCardIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[activeCardIndex];
    modalImage.src = item.full;
    modalImage.alt = item.alt;
    modalCaption.textContent = item.title;
    const template = document.getElementById(item.story);
    modalStory.replaceChildren(template?.content.cloneNode(true) || document.createTextNode('A történet még nincs megadva.'));
    dialog?.scrollTo(0, 0);
    modalStory.scrollTop = 0;
  };
  const openStory = (index, trigger) => {
    if (!galleryItems.length) return;
    const safeIndex = (index + galleryItems.length) % galleryItems.length;
    if (!dialog?.showModal) {
      window.open(galleryItems[safeIndex].full, '_blank', 'noopener');
      return;
    }
    lastTrigger = trigger || featured;
    populateStory(safeIndex);
    dialog.showModal();
    modalClose?.focus();
  };
  const changeStory = direction => populateStory(activeCardIndex + direction);
  featured?.addEventListener('click', () => openStory(selectedGalleryIndex, featured));
  cards.slice(1).forEach((card, i) => card.addEventListener('click', () => {
    selectGalleryImage(i + 1);
  }));
  gallery?.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (!event.target.closest('.gallery-card')) return;
    event.preventDefault();
    event.stopPropagation();
    selectGalleryImage(selectedGalleryIndex + (event.key === 'ArrowRight' ? 1 : -1));
  });
  $('#modal-prev')?.addEventListener('click', () => changeStory(-1));
  $('#modal-next')?.addEventListener('click', () => changeStory(1));
  modalClose?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
    const link = event.target.closest?.('.story-link');
    if (link && link.getAttribute('href')?.startsWith('#')) dialog.close();
  });
  dialog?.addEventListener('keydown', event => {
    const tag = event.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); changeStory(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); changeStory(1); }
  });
  dialog?.addEventListener('close', () => {
    modalImage.removeAttribute('src');
    lastTrigger?.focus({ preventScroll: true });
  });
  selectGalleryImage(0);

  const getUrl = value => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value.trim());
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
    } catch { return ''; }
  };


  // --- GDE appearances / press links (config-driven; no guessed public URLs) ---
  const createText = (tag, className, value) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = typeof value === 'string' ? value : '';
    return el;
  };
  const getLocalImage = value => {
    // Keep optional media in our own static assets directory (no third-party image fetches).
    return typeof value === 'string' && /^assets\/[\w./-]+\.(?:png|jpe?g|webp|svg)$/i.test(value) && !value.includes('..') ? value : '';
  };
  const pressGrid = $('#press-grid');
  const appearances = Array.isArray(config.mediaAppearances) ? config.mediaAppearances : [];
  if (pressGrid) {
    appearances.forEach((item, index) => {
      const url = getUrl(item?.url);
      const card = document.createElement('article');
      card.className = 'press-card';
      const top = createText('div', 'press-card-top', `MEGJELENÉS / ${String(index + 1).padStart(2, '0')}`);
      const visual = document.createElement('div');
      visual.className = 'press-visual';
      const image = getLocalImage(item?.image);
      if (image) {
        visual.classList.add('has-image');
        const photo = document.createElement('img');
        photo.src = image;
        photo.alt = item?.title ? `Előnézeti kép: ${item.title}` : 'Bejegyzés előnézete';
        photo.loading = 'lazy';
        visual.append(photo);
      } else {
        visual.append(createText('span', 'press-preview-label', 'GDE / ONLINE'));
        visual.append(createText('span', 'press-preview-number', String(index + 1).padStart(2, '0')));
        visual.append(createText('span', 'press-preview-watermark', 'ELŐNÉZET HELYE'));
      }
      const content = document.createElement('div');
      content.className = 'press-card-body';
      content.append(createText('p', 'press-meta', `${item?.type || 'ONLINE'} · ${item?.date || 'DÁTUM HELYE'}`));
      content.append(createText('h3', '', item?.title || 'Lorem ipsum'));
      content.append(createText('p', 'press-excerpt', item?.excerpt || 'Lorem ipsum dolor sit amet.'));
      if (url) {
        const action = createText('a', 'press-card-action', 'Eredeti poszt megnyitása ↗');
        action.href = url;
        action.rel = 'noopener noreferrer';
        action.target = '_blank';
        action.setAttribute('aria-label', `${item?.title || 'Bejegyzés'} – eredeti poszt megnyitása új lapon`);
        content.append(action);
      } else {
        content.append(createText('span', 'press-card-action is-pending', 'Hivatkozás később'));
      }
      card.append(top, visual, content);
      pressGrid.append(card);
    });
    if (!appearances.length) pressGrid.append(createText('p', 'section-editor-note', 'Lorem ipsum dolor sit amet – ide kerülnek a GDE-posztok.'));
  }

  // --- Team cards / individual profile modal ---
  const teamGrid = $('#team-grid');
  const members = Array.isArray(config.teamMembers) ? config.teamMembers : [];
  const teamDialog = $('#team-modal');
  let lastTeamTrigger = null;
  let activeMember = 0;
  const teamButtons = [];

  const renderTeamProfile = index => {
    const member = members[index];
    if (!member || !teamDialog) return;
    activeMember = index;
    $('#team-modal-name').textContent = member.name || `Csapattag ${index + 1}`;
    $('#team-modal-role').textContent = member.role || 'Lorem ipsum';
    $('#team-modal-lead').textContent = member.tagline || 'Lorem ipsum dolor sit amet.';
    $('#team-modal-visual-label').textContent = `PROFIL / ${String(index + 1).padStart(2, '0')}`;
    const photo = $('#team-modal-photo');
    const local = getLocalImage(member.image);
    photo.src = local || 'assets/team-placeholder.svg';
    photo.alt = local ? `${member.name || 'Csapattag'} portréja` : 'Ideiglenes profilillusztráció';
    const bio = $('#team-modal-bio');
    bio.replaceChildren();
    (Array.isArray(member.bio) ? member.bio : []).forEach(para => bio.append(createText('p', '', para)));
    const focus = $('#team-modal-focus');
    focus.replaceChildren();
    const topics = (Array.isArray(member.focus) ? member.focus : []).filter(v => typeof v === 'string' && v.trim());
    if (topics.length) {
      focus.append(createText('h3', '', 'Fókuszterületek'));
      const tags = document.createElement('div');
      tags.className = 'team-tags';
      topics.forEach(topic => tags.append(createText('span', '', topic)));
      focus.append(tags);
    }
    const social = $('#team-modal-links');
    social.replaceChildren();
    const platformLabels = { instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn', website: 'Weboldal' };
    for (const [key, label] of Object.entries(platformLabels)) {
      const link = getUrl(member?.links?.[key]);
      if (!link) continue;
      const a = createText('a', 'team-social-link', `${label} ↗`);
      a.href = link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      social.append(a);
    }
    $('#team-prev').disabled = members.length <= 1;
    $('#team-next').disabled = members.length <= 1;
    teamDialog.scrollTop = 0;
    $('.team-modal-copy')?.scrollTo(0, 0);
  };
  const openTeamProfile = index => {
    if (!teamDialog?.showModal) return;
    lastTeamTrigger = teamButtons[index];
    renderTeamProfile(index);
    teamDialog.showModal();
    $('#team-modal-close')?.focus();
  };
  if (teamGrid) {
    members.forEach((member, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'team-card';
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-label', `${member?.name || `Csapattag ${index + 1}`} – profil megnyitása`);
      const visual = document.createElement('span');
      visual.className = 'team-card-art';
      const portrait = document.createElement('img');
      const photo = getLocalImage(member?.image);
      portrait.src = photo || 'assets/team-placeholder.svg';
      portrait.alt = '';
      portrait.loading = 'lazy';
      visual.append(portrait, createText('span', 'team-card-index', `0${index + 1} / CSAPAT`));
      const content = document.createElement('span');
      content.className = 'team-card-info';
      content.append(createText('span', 'team-card-role', member?.role || 'Lorem ipsum'));
      content.append(createText('strong', 'team-card-name', member?.name || `Csapattag ${index + 1}`));
      content.append(createText('span', 'team-card-summary', member?.tagline || 'Lorem ipsum dolor sit amet.'));
      content.append(createText('span', 'team-card-open', 'Profil megnyitása ↗'));
      button.append(visual, content);
      button.addEventListener('click', () => openTeamProfile(index));
      teamButtons.push(button);
      teamGrid.append(button);
    });
    if (!members.length) teamGrid.append(createText('p', 'section-editor-note', 'Lorem ipsum dolor sit amet – ide kerülnek a csapattagok profiljai.'));
  }
  $('#team-modal-close')?.addEventListener('click', () => teamDialog?.close());
  $('#team-prev')?.addEventListener('click', () => renderTeamProfile((activeMember - 1 + members.length) % members.length));
  $('#team-next')?.addEventListener('click', () => renderTeamProfile((activeMember + 1) % members.length));
  teamDialog?.addEventListener('click', event => { if (event.target === teamDialog) teamDialog.close(); });
  teamDialog?.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && members.length > 1) { event.preventDefault(); renderTeamProfile((activeMember - 1 + members.length) % members.length); }
    if (event.key === 'ArrowRight' && members.length > 1) { event.preventDefault(); renderTeamProfile((activeMember + 1) % members.length); }
  });
  teamDialog?.addEventListener('close', () => lastTeamTrigger?.focus({ preventScroll: true }));

  // Real external links are controlled only in config.js. Empty links are hidden.
  const vote = $('#vote-link');
  const voteUrl = getUrl(config.voteUrl);
  if (voteUrl && vote) { vote.href = voteUrl; vote.hidden = false; }

  const platforms = [['instagram', 'Instagram'], ['facebook', 'Facebook'], ['tiktok', 'TikTok'], ['linkedin', 'LinkedIn']];
  const socialRoot = $('#social-links');
  if (socialRoot) {
    for (const [key, label] of platforms) {
      const url = getUrl(config.socialLinks?.[key]);
      if (!url) continue;
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.textContent = label + ' ↗';
      anchor.setAttribute('aria-label', `${label} – megnyitás új lapon`);
      socialRoot.append(anchor);
    }
    if (!socialRoot.childElementCount) socialRoot.hidden = true;
  }

  const email = typeof config.contactEmail === 'string' ? config.contactEmail.trim() : '';
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  $('#contact-btn')?.addEventListener('click', () => {
    const notice = $('#contact-notice');
    if (!emailIsValid) {
      const message = 'A kapcsolattartási e-mail cím még nincs beállítva a config.js fájlban.';
      if (notice) notice.textContent = message;
      notify(message);
      return;
    }
    if (notice) notice.textContent = '';
    const subject = encodeURIComponent(config.contactSubject || 'Hallgatói javaslat – HÖK kampány');
    const body = encodeURIComponent('Szia Ricsi!\n\nSzeretném megosztani veled az alábbi javaslatomat:\n\n');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });

  $('#share-btn')?.addEventListener('click', async () => {
    const url = getUrl(config.siteUrl) || window.location.href.split('#')[0];
    const shareData = { title: config.shareTitle || document.title, text: config.shareText || '', url };
    try {
      if (navigator.share && /^https?:/.test(shareData.url)) await navigator.share(shareData);
      else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        notify('A kampányoldal hivatkozását kimásoltam.');
      } else window.prompt('Másold ki az oldal hivatkozását:', shareData.url);
    } catch (error) {
      if (error?.name !== 'AbortError') notify('Nem sikerült megosztani az oldalt.');
    }
  });
})();
