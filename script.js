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

  // Unified card flip interaction: the entire gallery is image-first.
  // No separate image modal is used: click or Enter flips an image to a compact info card.
  const gallery = $('#gallery-scroll');
  const cards = [...(gallery?.querySelectorAll('.gallery-flip') || [])];
  const feature = $('#gallery-feature');
  const items = [{"img":"assets/street-mercedes.webp","alt":"GTA IV hangulatú utcai kampányfotó egy autó előtt","title":"Kampányhangulat","desc":"Utcai, GTA IV hangulatú vizuál a kampányhoz.","kicker":"01 / FŐ KÉP"},{"img":"assets/campus-maroon.webp","alt":"Illusztrált portré bordó ingben a Gábor Dénes Egyetem előtt","title":"Egyetemi portré","desc":"Illusztrált portré egyetemi háttérrel.","kicker":"02 / PORTRÉ"},{"img":"assets/campus-purple.webp","alt":"Illusztrált portré Gábor Dénes szobránál","title":"Hallgatói üzenet","desc":"Személyes kampányillusztráció a szobornál.","kicker":"03 / ÜZENET"},{"img":"assets/campus-pattern.webp","alt":"Illusztrált portré mintás felsőben az egyetem mellett","title":"Új nézőpont","desc":"Kampánykép egy másik megjelenéssel.","kicker":"04 / KAMPÁNY"},{"img":"assets/campus-brown.webp","alt":"Illusztrált portré barna kabátban, egyetemi háttérrel","title":"Fókuszban a cél","desc":"Portré az egyetem környezetében.","kicker":"05 / PORTRÉ"}];
  let activeFeatureIndex=0;
  function updateFlip(card,flipped){
    if(!card)return;
    card.classList.toggle('is-flipped',flipped);
    card.setAttribute('aria-pressed',String(flipped));
    const index=Number(card.dataset.galleryIndex);
    const title=items[index]?.title || 'Kampánykép';
    card.setAttribute('aria-label',title+(flipped?' – visszafordítás a fotóra':' – fordítás az információs kártyára'));
    card.querySelectorAll('.gallery-back').forEach(side=>side.setAttribute('aria-hidden',String(!flipped)));
  }
  cards.forEach(card=>{
    card.addEventListener('click',()=>updateFlip(card,!card.classList.contains('is-flipped')));
  });
  function showMainImage(index){
    if(!feature || !items.length)return;
    activeFeatureIndex=(index+items.length)%items.length;
    const item=items[activeFeatureIndex];
    const front=feature.querySelector('.gallery-front img');
    if(front){front.src=item.img;front.alt=item.alt;}
    const number=feature.querySelector('.gallery-card-number');
    if(number)number.textContent=String(activeFeatureIndex+1).padStart(2,'0')+' / 05';
    const caption=feature.querySelector('.gallery-front-caption strong');
    if(caption)caption.textContent=item.title;
    const kicker=feature.querySelector('.gallery-back-kicker');
    if(kicker)kicker.textContent=item.kicker;
    const heading=feature.querySelector('.gallery-back-title');
    if(heading)heading.textContent=item.title;
    const detail=feature.querySelector('.gallery-back-description');
    if(detail)detail.textContent=item.desc;
    feature.dataset.galleryIndex=String(activeFeatureIndex);
    updateFlip(feature,false);
  }
  $('#gallery-prev')?.addEventListener('click',()=>showMainImage(activeFeatureIndex-1));
  $('#gallery-next')?.addEventListener('click',()=>showMainImage(activeFeatureIndex+1));
  // Preserve the global ESC-to-home behavior unless an image is showing its back.
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape' || !$('#galeria')?.classList.contains('is-active'))return;
    const flipped=cards.filter(card=>card.classList.contains('is-flipped'));
    if(!flipped.length)return;
    event.preventDefault();event.stopImmediatePropagation();
    flipped.forEach(card=>updateFlip(card,false));
  });
  showMainImage(0);

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
