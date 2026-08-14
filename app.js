/* =========================================================================
   POP CULTURE  ::  client
   Hash-routed static app over data/ledger.json. No build step, no framework.
   ========================================================================= */

(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let DATA = { items: [], facets: { tags: [], people: [] } };
  let ITEMS = [];
  const BY_SLUG = new Map();

  /* --- utils ------------------------------------------------------------ */

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const slugify = (s) => String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();

  const KIND_LABEL = { film: 'Film', tv: 'TV', book: 'Book' };
  const RATING_N   = { essential: 3, strong: 2, decent: 1, unrated: 0 };
  const REGION_LABEL = { indian: 'India', world: 'World' };

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  /* --- generated fallback plate ----------------------------------------- */
  /* Cubist geometry seeded by slug. Used whenever there is no real poster,
     so the grid never shows a hole. */

  const PLATES = [
    ['#C2552F', '#8C3A22', '#E8A33D'],
    ['#2A7575', '#1B4F4F', '#7FBEB4'],
    ['#A8761F', '#6E4B12', '#DCB566'],
    ['#3E4C7A', '#232D4D', '#8792BE'],
    ['#7A3357', '#4C1F36', '#C07FA0'],
    ['#4A6741', '#2C3E27', '#93B089'],
  ];

  /* Four fixed compositions rather than free random points: random polygons
     drift off-canvas and read as noise. These are anchored, so every plate is
     a deliberate looking cover instead of an accident. */
  const COMPOSITIONS = [
    (a, b) => `<polygon points="0,0 100,0 100,96 0,138" fill="${a}"/>
               <polygon points="0,138 100,96 100,150 0,150" fill="${b}" opacity=".9"/>`,
    (a, b) => `<polygon points="100,0 100,72 0,26 0,0" fill="${a}"/>
               <polygon points="0,150 0,104 100,132 100,150" fill="${b}" opacity=".9"/>`,
    (a, b) => `<polygon points="0,0 58,0 34,150 0,150" fill="${a}"/>
               <polygon points="58,0 100,0 100,150 34,150" fill="${b}" opacity=".55"/>`,
    (a, b) => `<polygon points="50,8 100,150 0,150" fill="${a}"/>
               <polygon points="50,44 92,150 8,150" fill="${b}" opacity=".75"/>`,
  ];

  /* The plate is 84 user units wide. A long unbroken word like NIGHTCRAWLER
     overruns that at a fixed size, so step the size down as titles grow. */
  function plateFontSize(title) {
    const longest = title.split(/\s+/).reduce((m, w) => Math.max(m, w.length), 0);
    if (longest >= 13 || title.length > 30) return 7;
    if (longest >= 10 || title.length > 20) return 8.5;
    return 10;
  }

  function genPlate(item) {
    const h = hash(item.slug);
    const pal = PLATES[h % PLATES.length];
    // Unsigned shift: h is a uint32, and a signed >> makes large values negative,
    // which indexes off the end of the array.
    const comp = COMPOSITIONS[(h >>> 4) % COMPOSITIONS.length];

    const title = item.title.length > 46 ? item.title.slice(0, 44) + '…' : item.title;
    const kicker = [KIND_LABEL[item.kind], item.year || ''].filter(Boolean).join(' · ');
    const who = (item.by || '').split(',')[0].trim();

    return `<svg class="gen" viewBox="0 0 100 150" preserveAspectRatio="xMidYMid slice" role="img"
        aria-label="${esc(item.title)}">
      <rect width="100" height="150" fill="${pal[1]}"/>
      ${comp(pal[0], pal[2])}
      <rect width="100" height="150" fill="#000" opacity=".26"/>
      <line x1="9" y1="60" x2="35" y2="60" stroke="#fff" stroke-width=".8" opacity=".85"/>
      <foreignObject x="8" y="12" width="84" height="16">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'JetBrains Mono',monospace;
             font-size:3.6px;letter-spacing:.18em;text-transform:uppercase;color:#fff;opacity:.8">
          ${esc(kicker)}</div>
      </foreignObject>
      <foreignObject x="8" y="66" width="84" height="62">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Fraunces,Georgia,serif;
             font-weight:700;font-size:${plateFontSize(title)}px;line-height:1.04;
             letter-spacing:-.03em;text-transform:uppercase;color:#fff;
             overflow-wrap:anywhere;text-shadow:0 1px 4px rgba(0,0,0,.45)">
          ${esc(title)}</div>
      </foreignObject>
      ${who ? `<foreignObject x="8" y="132" width="84" height="14">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'JetBrains Mono',monospace;
             font-size:3.4px;letter-spacing:.1em;text-transform:uppercase;color:#fff;opacity:.72">
          ${esc(who)}</div></foreignObject>` : ''}
    </svg>`;
  }

  function artHTML(item, lazy = true) {
    if (item.art) {
      return `<img src="${esc(item.art)}" alt="${esc(item.title)}"
        ${lazy ? 'loading="lazy" decoding="async"' : ''}
        onerror="this.parentNode.innerHTML=this.dataset.fb||''"
        data-fb="${esc(genPlate(item))}">`;
    }
    return genPlate(item);
  }

  /* --- small pieces ------------------------------------------------------ */

  function dotsHTML(rating) {
    const n = RATING_N[rating] ?? 0;
    let s = `<span class="dots r-${rating}" title="${rating}">`;
    for (let i = 1; i <= 3; i++) s += `<i class="${i <= n ? 'on' : ''}"></i>`;
    return s + '</span>';
  }

  function scoreBadges(item) {
    const bits = [];
    if (item.imdb != null) bits.push(`<span class="s imdb">IMDb <b>${item.imdb}</b></span>`);
    if (item.rt   != null) bits.push(`<span class="s rt">RT <b>${item.rt}%</b></span>`);
    if (item.mc   != null) bits.push(`<span class="s mc">MC <b>${item.mc}</b></span>`);
    return bits.length ? `<div class="art-badge">${bits.join('')}</div>` : '';
  }

  function cardHTML(item, i = 0, rank = null) {
    return `<a class="card rv" style="--d:${i % 12}" href="#/e/${item.slug}">
      ${rank != null ? `<span class="card-rank">${rank}</span>` : ''}
      <div class="art-frame">${artHTML(item)}${scoreBadges(item)}</div>
      <div class="card-body">
        <h4 class="card-title">${esc(item.title)}</h4>
        <div class="card-meta">
          ${dotsHTML(item.rating)}
          ${item.year ? `<span>${item.year}</span>` : ''}
          ${item.by ? `<span class="sep">/</span><span>${esc(item.by.split(',')[0])}</span>` : ''}
        </div>
      </div>
    </a>`;
  }

  function gridHTML(items, ranked = false) {
    if (!items.length) return `<p class="empty">Nothing here yet</p>`;
    return `<div class="grid">${items.map((it, i) =>
      cardHTML(it, i, ranked ? String(i + 1).padStart(2, '0') : null)).join('')}</div>`;
  }

  function railHTML(items) {
    return `<div class="rail">${items.map((it, i) => cardHTML(it, i)).join('')}</div>`;
  }

  function secHead(num, title, meta, moreHref, moreLabel) {
    return `<div class="sec-head">
      <span class="sec-num">${num}</span>
      <h2 class="sec-title">${esc(title)}</h2>
      ${meta ? `<span class="sec-meta">${esc(meta)}</span>` : ''}
      ${moreHref ? `<a class="sec-more" href="${moreHref}">${esc(moreLabel || 'All')} &rarr;</a>` : ''}
    </div>`;
  }

  /* --- selectors --------------------------------------------------------- */

  const byRating = (a, b) =>
    (RATING_N[b.rating] - RATING_N[a.rating]) || (b.year || 0) - (a.year || 0);

  const musts  = (kind, region) => ITEMS.filter((i) =>
    i.must && (kind ? (kind === 'screen' ? i.kind !== 'book' : i.kind === kind) : true) &&
    (region ? i.region === region : true)).sort(byRating);

  const nowItems = (kinds) => ITEMS.filter((i) => i.status === 'now' && kinds.includes(i.kind));

  /* --- views ------------------------------------------------------------- */

  function viewHome() {
    const watching = nowItems(['film', 'tv']);
    const reading  = nowItems(['book']);

    const stats = [
      ['Entries',   ITEMS.length],
      ['Essential', ITEMS.filter((i) => i.rating === 'essential').length],
      ['Must list', ITEMS.filter((i) => i.must).length],
      ['On shelf',  ITEMS.filter((i) => i.status === 'shelf').length],
    ];

    const auteurs = DATA.facets.people
      .filter((p) => p.count >= 3 && p.kinds.some((k) => k === 'film' || k === 'tv'))
      .slice(0, 6);

    const nowPanel = (label, items, emptyMsg) => `
      <div class="now-panel rv">
        <div class="now-head"><span class="pulse"></span><h3>${esc(label)}</h3></div>
        ${items.length ? items.map((it) => `
          <a class="now-item" href="#/e/${it.slug}">
            <div class="art-frame">${artHTML(it, false)}</div>
            <div>
              <h4 class="now-title">${esc(it.title)}</h4>
              <p class="now-by">${esc(it.by || '')}${it.year ? ` &middot; ${it.year}` : ''}</p>
              ${it.note ? `<p class="now-note">${esc(it.note)}</p>` : ''}
            </div>
          </a>`).join('') : `<p class="now-empty">${esc(emptyMsg)}</p>`}
      </div>`;

    return `
      <header class="masthead">
        <div class="masthead-kicker">
          <span class="kicker">Nitin Khola</span><span class="line"></span>
          <span class="kicker">Est. 2026</span>
        </div>
        <h1 class="masthead-title display">${letters('Pop')}<span class="l2">${letters('Culture')}</span></h1>
        <div class="masthead-sub">
          <p class="standfirst">A standing record of the films, shows and books worth the hours.
            Two regions, India and the world, one three point scale, and no entry that nobody
            actually watched or read. Built to be handed down.</p>
          <div class="stat-grid">
            ${stats.map(([k, n]) => `<div class="stat"><span class="n" data-count="${n}">0</span><span class="k">${k}</span></div>`).join('')}
          </div>
        </div>
      </header>

      ${tickerHTML()}

      <section class="sec">
        ${secHead('01', 'Right now', 'currently open')}
        <div class="now-grid">
          ${nowPanel('What I am watching', watching, 'Nothing in progress. Between things.')}
          ${nowPanel('What I am reading',  reading,  'Nothing in progress. Between books.')}
        </div>
      </section>

      <section class="sec">
        ${secHead('02', 'Must watch', `${musts('screen').length} titles`, '#/must', 'Full list')}
        <p class="sec-lede">The ones I would put in front of somebody who had never seen anything.</p>
        <div class="person">
          <div class="person-head"><h3 class="person-name">India</h3>
            <span class="person-count">${musts('screen', 'indian').length}</span><span class="person-line"></span>
            <a class="sec-more" href="#/films/indian">All Indian cinema &rarr;</a></div>
          ${railHTML(musts('screen', 'indian').slice(0, 14))}
        </div>
        <div class="person">
          <div class="person-head"><h3 class="person-name">World</h3>
            <span class="person-count">${musts('screen', 'world').length}</span><span class="person-line"></span>
            <a class="sec-more" href="#/films/world">All world cinema &rarr;</a></div>
          ${railHTML(musts('screen', 'world').slice(0, 14))}
        </div>
      </section>

      <section class="sec">
        ${secHead('03', 'Must read', `${musts('book').length} titles`, '#/must', 'Full list')}
        <p class="sec-lede">Mostly realism, mostly short stories, and a few that rearranged something.</p>
        <div class="person">
          <div class="person-head"><h3 class="person-name">India</h3>
            <span class="person-count">${musts('book', 'indian').length}</span><span class="person-line"></span>
            <a class="sec-more" href="#/books/indian">All Indian books &rarr;</a></div>
          ${railHTML(musts('book', 'indian'))}
        </div>
        <div class="person">
          <div class="person-head"><h3 class="person-name">World</h3>
            <span class="person-count">${musts('book', 'world').length}</span><span class="person-line"></span>
            <a class="sec-more" href="#/books/world">All world books &rarr;</a></div>
          ${railHTML(musts('book', 'world'))}
        </div>
      </section>

      <section class="sec">
        ${secHead('04', 'By director', `${auteurs.length} auteurs`, '#/people', 'Everyone')}
        <p class="sec-lede">The filmmakers I follow rather than the films I stumble into.</p>
        ${auteurs.map((p) => personBlock(p.name)).join('')}
      </section>

      <section class="sec">
        ${secHead('05', 'On the shelf', `${ITEMS.filter((i) => i.status === 'shelf').length} waiting`, '#/shelf', 'All')}
        <p class="sec-lede">Bought, queued, not yet started. Honest about the backlog.</p>
        ${gridHTML(ITEMS.filter((i) => i.status === 'shelf').slice(0, 12))}
      </section>`;
  }

  function letters(word) {
    return [...word].map((c, i) => `<span class="ch" style="--i:${i}">${esc(c)}</span>`).join('');
  }

  function tickerHTML() {
    const tags = DATA.facets.tags.filter((t) => t.count >= 2).slice(0, 34);
    const run = tags.map((t) =>
      `<a href="#/tag/${encodeURIComponent(t.tag)}">${esc(t.tag)}<span class="dot"> &middot;</span></a>`).join('');
    return `<div class="ticker"><div class="ticker-track">${run}${run}</div></div>`;
  }

  function personBlock(name) {
    const items = ITEMS.filter((i) => i.by && i.by.split(',').map((s) => s.trim()).includes(name))
      .sort((a, b) => (a.year || 0) - (b.year || 0));
    if (!items.length) return '';
    const ess = items.filter((i) => i.rating === 'essential').length;
    return `<div class="person rv">
      <div class="person-head">
        <a class="person-name" href="#/by/${slugify(name)}">${esc(name)}</a>
        <span class="person-count">${items.length} title${items.length > 1 ? 's' : ''}${ess ? ` &middot; ${ess} essential` : ''}</span>
        <span class="person-line"></span>
      </div>
      ${railHTML(items)}
    </div>`;
  }

  function viewList(kind, region, opts = {}) {
    const kinds = kind === 'films' ? ['film'] : kind === 'tv' ? ['tv'] : ['book'];
    let items = ITEMS.filter((i) => kinds.includes(i.kind));
    if (region) items = items.filter((i) => i.region === region);
    items.sort(byRating);

    const title = opts.title || (kind === 'films' ? 'Cinema' : kind === 'tv' ? 'Television' : 'Books');
    const base = `#/${kind}`;

    return `
      <section class="sec">
        ${secHead(opts.num || '', title + (region ? ` / ${REGION_LABEL[region]}` : ''), `${items.length} entries`)}
        <div class="chips">
          <a class="chip ${!region ? 'on' : ''}" href="${base}">All</a>
          <a class="chip ${region === 'indian' ? 'on' : ''}" href="${base}/indian">India</a>
          <a class="chip ${region === 'world' ? 'on' : ''}" href="${base}/world">World</a>
          <a class="chip" href="#/ledger">Ledger view</a>
        </div>
        ${gridHTML(items)}
      </section>`;
  }

  function viewMust() {
    const groups = [
      ['Cinema / India', musts('film', 'indian')],
      ['Cinema / World', musts('film', 'world')],
      ['Television',     musts('tv')],
      ['Books / India',  musts('book', 'indian')],
      ['Books / World',  musts('book', 'world')],
    ].filter(([, v]) => v.length);

    return `<section class="sec">
      ${secHead('', 'The must list', `${ITEMS.filter((i) => i.must).length} entries`)}
      <p class="sec-lede">Everything flagged must in the ledger, ranked by rating then recency.
        If you only ever use one page on this site, use this one.</p>
      ${groups.map(([label, items]) => `
        <div class="person">
          <div class="person-head"><h3 class="person-name">${esc(label)}</h3>
            <span class="person-count">${items.length}</span><span class="person-line"></span></div>
          ${gridHTML(items, true)}
        </div>`).join('')}
    </section>`;
  }

  function viewPeople() {
    const people = DATA.facets.people.filter((p) => p.count >= 2);
    return `<section class="sec">
      ${secHead('', 'Directors and authors', `${people.length} with more than one entry`)}
      <div class="chips">
        ${people.map((p) => `<a class="chip" href="#/by/${p.slug}">${esc(p.name)}<span class="c">${p.count}</span></a>`).join('')}
      </div>
      ${people.filter((p) => p.count >= 3).map((p) => personBlock(p.name)).join('')}
    </section>`;
  }

  function viewPerson(personSlug) {
    const person = DATA.facets.people.find((p) => p.slug === personSlug);
    if (!person) return notFound('No such director or author');
    const items = ITEMS.filter((i) => i.by && i.by.split(',').map((s) => s.trim()).includes(person.name))
      .sort((a, b) => (a.year || 0) - (b.year || 0));

    return `<section class="sec">
      <a class="backlink" href="#/people">&larr; All names</a>
      ${secHead('', person.name, `${items.length} entries`)}
      ${gridHTML(items)}
    </section>`;
  }

  function viewTag(tag) {
    const items = ITEMS.filter((i) => i.tags.includes(tag)).sort(byRating);
    const related = new Map();
    items.forEach((i) => i.tags.forEach((t) => {
      if (t !== tag) related.set(t, (related.get(t) || 0) + 1);
    }));
    const rel = [...related.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14);

    return `<section class="sec">
      <a class="backlink" href="#/">&larr; Home</a>
      ${secHead('', tag, `${items.length} entries`)}
      ${rel.length ? `<div class="chips">${rel.map(([t, n]) =>
        `<a class="chip" href="#/tag/${encodeURIComponent(t)}">${esc(t)}<span class="c">${n}</span></a>`).join('')}</div>` : ''}
      ${gridHTML(items)}
    </section>`;
  }

  function viewShelf() {
    const items = ITEMS.filter((i) => i.status === 'shelf');
    return `<section class="sec">
      ${secHead('', 'On the shelf', `${items.length} waiting`)}
      <p class="sec-lede">Owned or queued, not started. No ratings here, because rating something
        you have not read is how the rest of the internet works, not how this does.</p>
      ${gridHTML(items)}
    </section>`;
  }

  /* --- ledger table ------------------------------------------------------ */

  let ledgerSort = { key: 'title', dir: 1 };

  function viewLedger() {
    return `<section class="sec">
      ${secHead('', 'The ledger', `${ITEMS.length} entries`)}
      <p class="sec-lede">Every entry on the site in one table, straight out of
        <span class="mono">data/ledger.md</span>. Sort any column, or just use the browser find.</p>
      <div class="ledger-tools">
        <input class="ledger-search" id="ledgerQ" type="search" placeholder="Filter title, person, tag, note...">
        <a class="chip" href="data/ledger.md">Source markdown</a>
      </div>
      <div class="table-scroll">${tableHTML(ITEMS)}</div>
    </section>`;
  }

  const COLS = [
    ['title',  'Title'],
    ['kind',   'Kind'],
    ['region', 'Region'],
    ['by',     'By'],
    ['year',   'Year'],
    ['rating', 'Rating'],
    ['must',   'Must'],
    ['imdb',   'IMDb'],
    ['rt',     'RT'],
    ['mc',     'MC'],
    ['tags',   'Tags'],
    ['note',   'Note'],
  ];

  function tableHTML(items) {
    const sorted = [...items].sort((a, b) => {
      const k = ledgerSort.key;
      let x = a[k], y = b[k];
      if (k === 'rating') { x = RATING_N[x]; y = RATING_N[y]; }
      if (k === 'must')   { x = x ? 1 : 0;   y = y ? 1 : 0; }
      if (k === 'tags')   { x = (x || []).join(); y = (y || []).join(); }
      if (x == null) return 1;
      if (y == null) return -1;
      if (typeof x === 'string') return x.localeCompare(y) * ledgerSort.dir;
      return (x - y) * ledgerSort.dir;
    });

    return `<table class="ledger">
      <thead><tr>${COLS.map(([k, label]) =>
        `<th data-k="${k}">${label}${ledgerSort.key === k
          ? `<span class="arrow">${ledgerSort.dir > 0 ? '↑' : '↓'}</span>` : ''}</th>`).join('')}</tr></thead>
      <tbody>${sorted.map((i) => `<tr>
        <td class="t-title"><a href="#/e/${i.slug}">${esc(i.title)}</a></td>
        <td class="num">${KIND_LABEL[i.kind]}</td>
        <td class="num">${REGION_LABEL[i.region]}</td>
        <td>${esc(i.by || '')}</td>
        <td class="num">${i.year ?? ''}</td>
        <td class="num">${dotsHTML(i.rating)} <span class="rating-tag r-${i.rating}">${i.rating}</span></td>
        <td class="num">${i.must ? '&#9733;' : ''}</td>
        <td class="num">${i.imdb ?? ''}</td>
        <td class="num">${i.rt != null ? i.rt + '%' : ''}</td>
        <td class="num">${i.mc ?? ''}</td>
        <td class="t-tags"><div class="clamp2">${esc((i.tags || []).join(' '))}</div></td>
        <td class="t-note"><div class="clamp2">${esc(i.note || '')}</div></td>
      </tr>`).join('')}</tbody>
    </table>`;
  }

  function bindLedger() {
    const q = $('#ledgerQ');
    const host = $('.table-scroll');
    if (!host) return;

    const redraw = () => {
      const term = (q?.value || '').trim().toLowerCase();
      const items = !term ? ITEMS : ITEMS.filter((i) =>
        [i.title, i.by, i.note, (i.tags || []).join(' '), i.kind, i.region, i.rating, i.year]
          .join(' ').toLowerCase().includes(term));
      host.innerHTML = tableHTML(items);
      bindHeaders();
      const meta = $('.sec-meta');
      if (meta) meta.textContent = `${items.length} entries`;
    };

    const bindHeaders = () => $$('th', host).forEach((th) => {
      th.onclick = () => {
        const k = th.dataset.k;
        ledgerSort = { key: k, dir: ledgerSort.key === k ? -ledgerSort.dir : 1 };
        redraw();
      };
    });

    bindHeaders();
    if (q) q.oninput = redraw;
  }

  /* --- detail ------------------------------------------------------------ */

  function viewDetail(slug) {
    const it = BY_SLUG.get(slug);
    if (!it) return notFound('No such entry');

    const sameBy = it.by
      ? ITEMS.filter((x) => x.slug !== it.slug && x.by === it.by).sort((a, b) => (a.year || 0) - (b.year || 0))
      : [];
    const related = ITEMS
      .filter((x) => x.slug !== it.slug && x.by !== it.by)
      .map((x) => ({ x, n: x.tags.filter((t) => it.tags.includes(t)).length }))
      .filter((r) => r.n >= 2)
      .sort((a, b) => b.n - a.n || RATING_N[b.x.rating] - RATING_N[a.x.rating])
      .slice(0, 12).map((r) => r.x);

    const backHref = it.kind === 'book' ? `#/books/${it.region}`
      : it.kind === 'tv' ? '#/tv' : `#/films/${it.region}`;

    const facts = [
      ['Kind',   KIND_LABEL[it.kind]],
      ['Region', REGION_LABEL[it.region]],
      ['Year',   it.year ?? '—'],
      ['Status', { now: 'In progress', done: 'Finished', shelf: 'On the shelf' }[it.status]],
      ['Rating', it.rating],
      ['Must',   it.must ? 'Yes' : 'No'],
    ];

    const scores = [];
    if (it.imdb != null) scores.push(['imdb', 'IMDb', it.imdb]);
    if (it.rt   != null) scores.push(['rt', 'Rotten Tomatoes', it.rt + '%']);
    if (it.mc   != null) scores.push(['mc', 'Metacritic', it.mc]);

    return `
      <a class="backlink" href="${backHref}">&larr; Back</a>
      <div class="detail">
        <div><div class="art-frame">${artHTML(it, false)}</div></div>
        <div>
          <h1 class="detail-title">${esc(it.title)}</h1>
          ${it.by ? `<p class="detail-by">${it.by.split(',').map((n) =>
            `<a href="#/by/${slugify(n.trim())}">${esc(n.trim())}</a>`).join(', ')}</p>` : ''}
          ${it.note ? `<blockquote class="detail-note">${esc(it.note)}</blockquote>` : ''}
          ${scores.length ? `<div class="scorebar">${scores.map(([c, src, v]) =>
            `<div class="score ${c}"><span class="src">${src}</span><span class="val">${v}</span></div>`).join('')}</div>` : ''}
          <div class="facts">${facts.map(([k, v]) =>
            `<div class="fact"><span class="k">${k}</span><span class="v">${esc(v)}</span></div>`).join('')}</div>
          ${it.flag ? `<p class="flagnote">Needs your correction: ${esc(it.flag)}</p>` : ''}
          <div class="chips">${it.tags.map((t) =>
            `<a class="chip" href="#/tag/${encodeURIComponent(t)}">${esc(t)}</a>`).join('')}</div>
        </div>
      </div>

      ${sameBy.length ? `<section class="sec">
        ${secHead('', `More from ${it.by.split(',')[0]}`, `${sameBy.length}`)}
        ${railHTML(sameBy)}</section>` : ''}

      ${related.length ? `<section class="sec">
        ${secHead('', 'Adjacent', 'shares tags')}
        ${railHTML(related)}</section>` : ''}`;
  }

  function notFound(msg) {
    return `<section class="sec"><p class="empty">${esc(msg)}</p>
      <p style="text-align:center"><a class="chip" href="#/">Back to the front page</a></p></section>`;
  }

  /* --- router ------------------------------------------------------------ */

  const ROUTES = [
    [/^\/?$/,                    () => viewHome()],
    [/^\/films\/(indian|world)$/, (m) => viewList('films', m[1], { num: '' })],
    [/^\/films$/,                 () => viewList('films', null)],
    [/^\/tv$/,                    () => viewList('tv', null)],
    [/^\/books\/(indian|world)$/, (m) => viewList('books', m[1])],
    [/^\/books$/,                 () => viewList('books', null)],
    [/^\/must$/,                  () => viewMust()],
    [/^\/people$/,                () => viewPeople()],
    [/^\/by\/(.+)$/,              (m) => viewPerson(m[1])],
    [/^\/tag\/(.+)$/,             (m) => viewTag(decodeURIComponent(m[1]))],
    [/^\/shelf$/,                 () => viewShelf()],
    [/^\/ledger$/,                () => viewLedger()],
    [/^\/e\/(.+)$/,               (m) => viewDetail(m[1])],
  ];

  function currentPath() {
    return (location.hash.replace(/^#/, '') || '/').replace(/\/+$/, '') || '/';
  }

  let transitioning = false;

  function render() {
    const path = currentPath();
    let html = null;

    for (const [re, fn] of ROUTES) {
      const m = path.match(re);
      if (m) { html = fn(m); break; }
    }
    if (html == null) html = notFound('That page does not exist');

    const app = $('#app');
    const paint = () => {
      app.innerHTML = `<div class="wrap">${html}</div>`;
      afterRender(path);
    };

    // View Transitions are decoration. If one is already running, or the browser
    // refuses, fall straight through to a plain paint rather than losing the render.
    if (document.startViewTransition && !REDUCED && !transitioning) {
      transitioning = true;
      try {
        document.startViewTransition(paint).finished
          .catch(() => {})
          .finally(() => { transitioning = false; });
      } catch (e) {
        transitioning = false;
        paint();
      }
    } else {
      paint();
    }
  }

  function afterRender(path) {
    setActiveNav(path);
    observeReveals();
    bindTilt();
    countUp();
    if (path === '/ledger') bindLedger();
    document.title = titleFor(path);
    window.scrollTo(0, 0);
  }

  function titleFor(path) {
    const base = 'Pop Culture / Nitin Khola';
    if (path === '/') return base;
    if (path.startsWith('/e/')) {
      const it = BY_SLUG.get(path.slice(3));
      return it ? `${it.title} / ${base}` : base;
    }
    const seg = path.split('/').filter(Boolean);
    return `${seg.map((s) => s[0].toUpperCase() + s.slice(1)).join(' / ')} / ${base}`;
  }

  function setActiveNav(path) {
    $$('.nav-link').forEach((a) => {
      const href = a.getAttribute('href').replace(/^#/, '');
      const on = href === '/' ? path === '/' : path.startsWith(href);
      a.toggleAttribute('aria-current', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  /* --- effects ----------------------------------------------------------- */

  let io = null;
  function observeReveals() {
    if (REDUCED) { $$('.rv').forEach((e) => e.classList.add('in')); return; }
    io?.disconnect();
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
    $$('.rv').forEach((el) => io.observe(el));
  }

  function bindTilt() {
    if (REDUCED || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    $$('.card').forEach((card) => {
      const frame = $('.art-frame', card);
      if (!frame) return;
      card.addEventListener('pointermove', (e) => {
        const r = frame.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        frame.style.transform =
          `perspective(760px) rotateY(${x * 7}deg) rotateX(${-y * 9}deg) translateZ(9px)`;
      });
      card.addEventListener('pointerleave', () => { frame.style.transform = ''; });
    });
  }

  function countUp() {
    const els = $$('.stat .n[data-count]');
    if (!els.length) return;
    els.forEach((el) => {
      const target = +el.dataset.count;
      if (REDUCED) { el.textContent = target; return; }
      const t0 = performance.now(), dur = 900;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  function initGrain() {
    const c = document.createElement('canvas');
    const S = 140;
    c.width = c.height = S;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(S, S);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 26;
    }
    ctx.putImageData(img, 0, 0);
    document.documentElement.style.setProperty('--grain-url', `url(${c.toDataURL()})`);

    if (REDUCED) return;
    const el = $('.grain');
    let f = 0;
    const jitter = () => {
      f = (f + 1) % 8;
      el.style.transform = `translate(${(f % 3) * 4 - 4}px, ${((f >> 1) % 3) * 4 - 4}px)`;
      setTimeout(() => requestAnimationFrame(jitter), 90);
    };
    jitter();
  }

  function initProgress() {
    const bar = $('.progress');
    let ticking = false;
    const update = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* --- theme ------------------------------------------------------------- */

  window.pcToggleTheme = function () {
    const root = document.documentElement;
    const now = root.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = now === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('pc-theme', next); } catch (e) { /* private mode */ }
  };

  /* --- command palette ---------------------------------------------------- */

  const NAV_CMDS = [
    ['Front page', '#/'], ['Must list', '#/must'], ['Cinema, India', '#/films/indian'],
    ['Cinema, World', '#/films/world'], ['Television', '#/tv'], ['Books, India', '#/books/indian'],
    ['Books, World', '#/books/world'], ['Directors and authors', '#/people'],
    ['On the shelf', '#/shelf'], ['The full ledger', '#/ledger'],
  ];

  let palOpen = false, palIdx = 0, palResults = [];

  function score(item, q) {
    const t = item.title.toLowerCase();
    if (t === q) return 100;
    if (t.startsWith(q)) return 80;
    if (t.includes(q)) return 60;
    if ((item.by || '').toLowerCase().includes(q)) return 45;
    if (item.tags.some((x) => x.includes(q))) return 30;
    if ((item.note || '').toLowerCase().includes(q)) return 12;
    return 0;
  }

  function palRender() {
    const q = $('#palQ').value.trim().toLowerCase();
    const list = $('#palList');

    const navHits = NAV_CMDS.filter(([label]) => !q || label.toLowerCase().includes(q))
      .map(([label, href]) => ({ nav: true, label, href }));

    const hits = !q ? ITEMS.filter((i) => i.must).sort(byRating).slice(0, 8)
      : ITEMS.map((i) => ({ i, s: score(i, q) })).filter((r) => r.s > 0)
          .sort((a, b) => b.s - a.s || RATING_N[b.i.rating] - RATING_N[a.i.rating])
          .slice(0, 30).map((r) => r.i);

    palResults = [...(q ? navHits.slice(0, 3) : []), ...hits.map((i) => ({ item: i, href: `#/e/${i.slug}` }))];
    if (!q) palResults = [...palResults, ...navHits];
    palIdx = 0;

    if (!palResults.length) {
      list.innerHTML = `<p class="palette-empty">Nothing matches "${esc(q)}"</p>`;
      return;
    }

    list.innerHTML = palResults.map((r, n) => {
      if (r.nav) {
        return `<button class="p-item" data-n="${n}" aria-selected="${n === 0}">
          <span style="width:26px;text-align:center;color:var(--ink-faint)">&rarr;</span>
          <span><span class="p-title">${esc(r.label)}</span></span>
          <span class="p-kind">Go</span></button>`;
      }
      const i = r.item;
      return `<button class="p-item" data-n="${n}" aria-selected="${n === 0}">
        ${i.art ? `<img class="p-thumb" src="${esc(i.art)}" alt="" loading="lazy">`
                : `<span class="p-thumb"></span>`}
        <span><span class="p-title">${esc(i.title)}</span>
        <span class="p-sub">${esc(i.by || '')}${i.year ? ` &middot; ${i.year}` : ''}</span></span>
        <span class="p-kind">${KIND_LABEL[i.kind]} &middot; ${REGION_LABEL[i.region]}</span></button>`;
    }).join('');

    $$('.p-item', list).forEach((b) => {
      b.onclick = () => { location.hash = palResults[+b.dataset.n].href; palClose(); };
    });
  }

  function palMove(d) {
    if (!palResults.length) return;
    palIdx = (palIdx + d + palResults.length) % palResults.length;
    $$('.p-item').forEach((b, n) => b.setAttribute('aria-selected', n === palIdx));
    $$('.p-item')[palIdx]?.scrollIntoView({ block: 'nearest' });
  }

  function palOpenFn() {
    palOpen = true;
    $('#palette').classList.add('open');
    const q = $('#palQ');
    q.value = '';
    palRender();
    setTimeout(() => q.focus(), 30);
  }

  function palClose() {
    palOpen = false;
    $('#palette').classList.remove('open');
  }

  function initPalette() {
    $('#palette').addEventListener('click', (e) => {
      if (e.target.id === 'palette') palClose();
    });
    $('#palQ').addEventListener('input', palRender);

    addEventListener('keydown', (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); palOpen ? palClose() : palOpenFn(); return; }
      if (e.key === '/' && !palOpen && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
        e.preventDefault(); palOpenFn(); return;
      }
      if (!palOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); palClose(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); palMove(1); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); palMove(-1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        const r = palResults[palIdx];
        if (r) { location.hash = r.href; palClose(); }
      }
    });

    $$('[data-open-palette]').forEach((b) => { b.onclick = palOpenFn; });
  }

  /* --- boot -------------------------------------------------------------- */

  async function boot() {
    // The app paints its own routes, so the browser restoring a previous scroll
    // offset just drops you into the middle of a page you have not seen.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    initGrain();
    initProgress();
    initPalette();

    try {
      const res = await fetch('data/ledger.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      DATA = await res.json();
    } catch (err) {
      $('#app').innerHTML = `<div class="wrap"><p class="empty">
        Could not load the ledger (${esc(err.message)}).<br>
        Run <span class="mono">python3 .scripts/popculture/build_ledger.py</span></p></div>`;
      return;
    }

    ITEMS = DATA.items || [];
    ITEMS.forEach((i) => BY_SLUG.set(i.slug, i));

    addEventListener('hashchange', render);
    render();
  }

  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', boot);
  else boot();
})();
