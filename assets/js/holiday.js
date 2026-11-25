// ─── CREATIVA ACADEMY — CHRISTMAS DECORATIONS ────────────────────────────────
// On every page: a holiday banner under the top bar, a pine garland with
// twinkling lights under the menu, holly in place of the ❦ dividers, a holiday
// greeting in the footer and gentle falling snow. On the homepage: ornaments
// hanging over the main photo, festive December event cards and a nativity
// scene above the December highlights (also on the calendar page).
//
// Everything turns itself off after lastDay, so nothing needs removing by hand.
// To turn it off sooner, set enabled to false.
// People whose device asks for less motion get the decorations without
// animation and no snow.
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  var config = {
    enabled: true,
    lastDay: new Date(2027, 0, 6, 23, 59, 59) // January 6, 2027
  };
  var now = new Date();
  if (!config.enabled || now > config.lastDay) return;

  // Banner message changes as the season goes on.
  function banner() {
    var y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
    var before = function (mm, dd) { return y < 2026 || (y === 2026 && (m < mm || (m === mm && d <= dd))); };
    if (before(11, 15)) return { text: '🎄 Christmas Show · Tuesday, Dec. 15 at 6:00pm · MAS Academy', link: 'See the December calendar' };
    if (before(11, 20)) return { text: '🎅 Merry Christmas from all of us at Creativa! Winter break is Dec. 21 – Jan. 1', link: 'See the December calendar' };
    if (y === 2026) return { text: '❄️ Merry Christmas from all of us at Creativa! School is closed for winter break until Jan. 1', link: null };
    return { text: '✨ Happy New Year from all of us at Creativa Academy!', link: null };
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var RED = '#A63D32', GOLD = '#C9A547', GREEN = '#4E7A3A', IVORY = '#F1E6C8';
  var bulbs = [RED, GOLD, GREEN, IVORY];
  var garland = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='24' viewBox='0 0 80 24'%3E%3Cline x1='-0.5' y1='11' x2='2.9' y2='6.0' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='-0.8' y1='11' x2='2.3' y2='16.7' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='3.6' y1='11' x2='9.7' y2='6.9' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='2.6' y1='11' x2='6.2' y2='14.5' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='6.9' y1='11' x2='10.0' y2='4.8' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='6.6' y1='11' x2='10.4' y2='15.5' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='8.2' y1='11' x2='13.6' y2='4.6' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='8.4' y1='11' x2='13.2' y2='14.4' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='11.0' y1='11' x2='15.2' y2='4.5' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='12.7' y1='11' x2='17.7' y2='16.1' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='14.9' y1='11' x2='18.5' y2='6.5' stroke='%234E5E3A' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='14.2' y1='11' x2='19.0' y2='19.0' stroke='%233F4F33' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='18.4' y1='11' x2='22.0' y2='4.6' stroke='%234E5E3A' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='17.8' y1='11' x2='21.6' y2='17.2' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='20.4' y1='11' x2='25.1' y2='5.1' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='21.8' y1='11' x2='25.2' y2='14.3' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='23.6' y1='11' x2='28.9' y2='3.7' stroke='%234E5E3A' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='23.7' y1='11' x2='27.4' y2='16.3' stroke='%234E5E3A' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='26.7' y1='11' x2='30.0' y2='3.2' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='27.5' y1='11' x2='34.3' y2='14.1' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='29.6' y1='11' x2='33.3' y2='4.7' stroke='%234E5E3A' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='29.6' y1='11' x2='33.4' y2='16.2' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='32.5' y1='11' x2='37.9' y2='7.2' stroke='%234E5E3A' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='32.7' y1='11' x2='37.5' y2='15.8' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='37.0' y1='11' x2='42.3' y2='5.8' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='35.8' y1='11' x2='39.7' y2='14.3' stroke='%234E5E3A' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='39.5' y1='11' x2='44.9' y2='3.1' stroke='%234E5E3A' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='39.1' y1='11' x2='44.4' y2='15.6' stroke='%234E5E3A' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='41.2' y1='11' x2='46.4' y2='4.1' stroke='%233F4F33' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='42.3' y1='11' x2='46.1' y2='15.0' stroke='%233F4F33' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='44.8' y1='11' x2='48.0' y2='5.9' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='45.3' y1='11' x2='50.0' y2='15.1' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='47.1' y1='11' x2='51.1' y2='6.8' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='48.5' y1='11' x2='53.2' y2='15.3' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='50.1' y1='11' x2='56.8' y2='5.2' stroke='%233F4F33' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='51.9' y1='11' x2='57.5' y2='18.4' stroke='%234E5E3A' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='54.0' y1='11' x2='57.4' y2='6.9' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='53.7' y1='11' x2='59.3' y2='18.0' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='57.6' y1='11' x2='62.7' y2='4.7' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='56.7' y1='11' x2='61.2' y2='16.5' stroke='%236F7F52' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='60.9' y1='11' x2='66.6' y2='7.8' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='60.5' y1='11' x2='64.6' y2='18.3' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='63.4' y1='11' x2='68.2' y2='5.6' stroke='%233F4F33' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='63.9' y1='11' x2='67.7' y2='14.0' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='65.0' y1='11' x2='71.5' y2='7.4' stroke='%233F4F33' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='66.8' y1='11' x2='72.0' y2='18.4' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='68.3' y1='11' x2='73.8' y2='3.9' stroke='%233F4F33' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='69.8' y1='11' x2='74.6' y2='14.4' stroke='%234E5E3A' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='72.0' y1='11' x2='78.4' y2='5.0' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='71.1' y1='11' x2='74.4' y2='18.4' stroke='%234E5E3A' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='74.6' y1='11' x2='79.0' y2='7.6' stroke='%233F4F33' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='74.8' y1='11' x2='80.9' y2='15.6' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='78.5' y1='11' x2='84.9' y2='6.0' stroke='%234E5E3A' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='77.2' y1='11' x2='82.7' y2='18.4' stroke='%233F4F33' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='80.8' y1='11' x2='86.7' y2='5.8' stroke='%235C6B44' stroke-width='1.3' stroke-linecap='round'/%3E%3Cline x1='81.3' y1='11' x2='88.0' y2='16.4' stroke='%234E5E3A' stroke-width='1.3' stroke-linecap='round'/%3E%3Ccircle cx='22' cy='12' r='2.3' fill='%23A63D32'/%3E%3Ccircle cx='25' cy='13.5' r='2.3' fill='%23A63D32'/%3E%3Ccircle cx='21' cy='15' r='2.3' fill='%23A63D32'/%3E%3Ccircle cx='62' cy='12' r='2.3' fill='%23A63D32'/%3E%3Ccircle cx='65' cy='13.5' r='2.3' fill='%23A63D32'/%3E%3Ccircle cx='61' cy='15' r='2.3' fill='%23A63D32'/%3E%3Ccircle cx='42' cy='9' r='1.4' fill='%23D4A93A'/%3E%3C/svg%3E\")";
  var holly = '<svg viewBox="0 0 40 22" width="34" height="19" aria-hidden="true">' +
    '<path d="M20 12C15 5 7 4 2 8c4 1 4 4 2 6 5-2 10 0 16-2z" fill="#5C6B44"/>' +
    '<path d="M20 12c5-7 13-8 18-4-4 1-4 4-2 6-5-2-10 0-16-2z" fill="#6F7F52"/>' +
    '<circle cx="17.5" cy="11.5" r="2.6" fill="' + RED + '"/><circle cx="22.5" cy="11.5" r="2.6" fill="' + RED + '"/>' +
    '<circle cx="20" cy="7.8" r="2.6" fill="#B84A3E"/></svg>';

  var nativity = '<svg class="xmas-nativity" viewBox="0 0 240 130" width="240" height="130" role="img" aria-label="Nativity scene">' +
    '<g stroke="#C9A547" stroke-width="1.4" stroke-linecap="round" opacity=".8"><line x1="120" y1="2" x2="120" y2="8"/><line x1="104" y1="14" x2="110" y2="14"/><line x1="130" y1="14" x2="136" y2="14"/><line x1="109" y1="4" x2="113" y2="8"/><line x1="131" y1="4" x2="127" y2="8"/></g>' +
    '<path d="M120 5 L123 12 L130 14 L123 16 L120 24 L117 16 L110 14 L117 12Z" fill="#C9A547"/>' +
    '<g stroke="#5C6B44" stroke-linecap="round" fill="none"><path d="M46 62 L120 30 L194 62" stroke-width="5"/><path d="M60 56 V118 M180 56 V118" stroke-width="4"/><path d="M30 119 H210" stroke-width="2.5"/>' +
    '<path d="M172 52 V118 M172 52 c0-7 9-7 9 0" stroke-width="2.4"/></g>' +
    '<g fill="#5C6B44" stroke="#F7F4EC" stroke-width="2" stroke-linejoin="round">' +
    '<path d="M96 88 C88 92 84 106 82 118 H106 C105 106 103 94 96 88Z"/>' +
    '<path d="M89 80 C86 70 94 64 100 68 C104 72 104 80 101 86 C99 92 104 100 106 108 C98 104 92 96 89 80Z"/>' +
    '<circle cx="98" cy="76" r="5.2"/>' +
    '<path d="M150 74 C140 80 138 100 137 118 H164 C163 100 161 80 150 74Z"/>' +
    '<circle cx="150" cy="65" r="6"/><path d="M143 64 C143 55 157 55 157 64 L158 72 L142 72Z"/>' +
    '<path d="M158 84 L170 80" stroke="#5C6B44" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M108 104 H134 L129 115 H113Z"/></g>' +
    '<path d="M112 115 L108 120 M130 115 L134 120" stroke="#5C6B44" stroke-width="2.5" stroke-linecap="round"/>' +
    '<ellipse cx="121" cy="101" rx="10" ry="4.2" fill="#F1E6C8" stroke="#5C6B44" stroke-width="1.2"/><circle cx="112" cy="99.5" r="3.6" fill="#F1E6C8" stroke="#5C6B44" stroke-width="1.2"/>' +
    '<circle cx="112" cy="99.5" r="6.8" fill="none" stroke="#C9A547" stroke-width="1.2"/></svg>';

  var css =
    '.xmas-banner{background:#3F4F33;color:#F3EBD3;text-align:center;font-size:13px;letter-spacing:.05em;padding:8px 16px;border-bottom:1px solid rgba(201,165,71,.45)}' +
    '.xmas-banner a{color:' + GOLD + ';border-bottom:1px solid rgba(201,165,71,.5);margin-left:8px;white-space:nowrap}' +
    '.xmas-garland{position:absolute;left:0;right:0;bottom:-22px;height:28px;overflow:hidden;pointer-events:none;z-index:1;background:' + garland + ' repeat-x 0 0/94px 28px}' +
    '.xmas-garland span{position:absolute;top:11px;width:7px;height:10px;border-radius:50%/40% 40% 60% 60%}' +
    '.xmas-garland span::before{content:"";position:absolute;top:-2px;left:2px;width:3px;height:3px;background:#5d6352;border-radius:1px}' +
    '@keyframes xmasTwinkle{0%,100%{opacity:1;filter:brightness(1.15)}50%{opacity:.4;filter:brightness(.8)}}' +
    '.divider span.xmas-holly{display:inline-flex;font-size:0}' +
    '.xmas-ornaments{position:absolute;top:0;right:7%;display:flex;gap:26px;pointer-events:none;z-index:2}' +
    '.xmas-orn{position:relative;width:2px;background:rgba(201,165,71,.85);transform-origin:top center}' +
    '.xmas-orn::before{content:"";position:absolute;left:50%;bottom:-3px;transform:translateX(-50%);width:8px;height:6px;background:' + GOLD + ';border-radius:2px}' +
    '.xmas-orn::after{content:"";position:absolute;left:50%;top:100%;transform:translateX(-50%);margin-top:2px;width:var(--s);height:var(--s);border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.75) 0 8%,transparent 26%),var(--c);box-shadow:0 6px 14px rgba(0,0,0,.22)}' +
    '@keyframes xmasSwing{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}' +
    '.month-events .event-card{border-top:3px solid ' + RED + '}' +
    '.month-events .event-card:nth-child(3n+2){border-top-color:' + GOLD + '}' +
    '.month-events .event-card:nth-child(3n){border-top-color:#5C6B44}' +
    '.month-events .event-card.highlight{background:#3F4F33;border-top-color:' + GOLD + ';box-shadow:inset 0 0 0 1px rgba(201,165,71,.35),0 2px 14px rgba(59,68,48,.1)}' +
    '.month-events .event-card.highlight .event-date{color:' + GOLD + '}' +
    '.xmas-foot{font-family:"Playfair Display",serif;font-style:italic;color:' + RED + ';font-size:17px;margin-top:10px}' +
    '.xmas-nativity{display:block;margin:0 auto 14px;max-width:62vw;height:auto}' +
    '.xmas-snow{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:40}' +
    '.xmas-snow i{position:absolute;top:-24px;color:#A9BCCB;font-style:normal;line-height:1;user-select:none;animation:xmasFall linear infinite}' +
    '@keyframes xmasFall{0%{transform:translate3d(0,-24px,0) rotate(0)}100%{transform:translate3d(var(--drift),105vh,0) rotate(200deg)}}' +
    '@media(max-width:700px){.xmas-ornaments{gap:18px;right:5%}.xmas-banner{font-size:12px}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function start() {
    // 1. Holiday banner under the green top bar
    var top = document.querySelector('.topbar');
    if (top) {
      var msg = banner();
      var bn = document.createElement('div');
      bn.className = 'xmas-banner';
      bn.textContent = msg.text;
      if (msg.link) {
        var a = document.createElement('a');
        a.href = '/calendar/';
        a.textContent = msg.link + ' →';
        bn.appendChild(a);
      }
      top.parentNode.insertBefore(bn, top.nextSibling);
    }

    // 2. Pine garland with twinkling lights under the menu
    var header = document.querySelector('header');
    if (header) {
      var g = document.createElement('div');
      g.className = 'xmas-garland';
      g.setAttribute('aria-hidden', 'true');
      var gap = 40, n = Math.ceil(Math.max(window.innerWidth, 1400) / gap);
      for (var i = 0; i < n; i++) {
        var b = document.createElement('span');
        var c = bulbs[i % bulbs.length];
        b.style.left = (i * gap + 16) + 'px';
        b.style.background = c;
        b.style.boxShadow = '0 0 7px ' + c;
        if (!reduce) b.style.animation = 'xmasTwinkle ' + (1.6 + (i % 5) * 0.35) + 's ease-in-out ' + ((i * 0.37) % 2) + 's infinite';
        g.appendChild(b);
      }
      header.appendChild(g);
    }

    // 3. Holly instead of the ❦ dividers
    document.querySelectorAll('.divider span').forEach(function (s) {
      if (s.textContent.trim() === '❦') { s.classList.add('xmas-holly'); s.innerHTML = holly; }
    });

    // 4. Ornaments hanging over the homepage photo
    var hero = document.querySelector('.hero-img');
    if (hero) {
      var o = document.createElement('div');
      o.className = 'xmas-ornaments';
      o.setAttribute('aria-hidden', 'true');
      [[70, RED, 30], [120, GOLD, 24], [45, '#5C6B44', 26], [95, RED, 20]].forEach(function (x, k) {
        var e = document.createElement('div');
        e.className = 'xmas-orn';
        e.style.height = x[0] + 'px';
        e.style.setProperty('--c', x[1]);
        e.style.setProperty('--s', x[2] + 'px');
        if (!reduce) e.style.animation = 'xmasSwing ' + (3.2 + k * 0.6) + 's ease-in-out ' + (-k * 0.9) + 's infinite';
        o.appendChild(e);
      });
      hero.appendChild(o);
    }

    // 5. Holiday greeting in the footer
    var tag = document.querySelector('footer .tag');
    if (tag) {
      var f = document.createElement('div');
      f.className = 'xmas-foot';
      f.textContent = now.getFullYear() === 2026 ? 'Merry Christmas & Happy New Year from the Creativa family' : 'Happy New Year from the Creativa family';
      tag.parentNode.insertBefore(f, tag.nextSibling);
    }

    // 5b. Nativity scene above the December highlights and on the calendar page
    var spots = [document.querySelector('.month-events .eyebrow'), document.querySelector('.page-hero.wrap .eyebrow')];
    spots.forEach(function (el) {
      if (!el) return;
      if (el.closest('.page-hero') && location.pathname.indexOf('/calendar') !== 0) return;
      el.insertAdjacentHTML('beforebegin', nativity);
    });

    // 6. Gentle snow
    if (reduce) return;
    var snow = document.createElement('div');
    snow.className = 'xmas-snow';
    snow.setAttribute('aria-hidden', 'true');
    var count = window.innerWidth < 700 ? 12 : 24;
    for (var j = 0; j < count; j++) {
      var fl = document.createElement('i');
      fl.textContent = '❄';
      fl.style.left = (Math.random() * 100) + 'vw';
      fl.style.fontSize = (9 + Math.random() * 11) + 'px';
      fl.style.opacity = (0.35 + Math.random() * 0.4).toFixed(2);
      fl.style.setProperty('--drift', (Math.random() * 120 - 60).toFixed(0) + 'px');
      fl.style.animationDuration = (11 + Math.random() * 12).toFixed(1) + 's';
      fl.style.animationDelay = (-Math.random() * 20).toFixed(1) + 's';
      snow.appendChild(fl);
    }
    document.body.appendChild(snow);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
