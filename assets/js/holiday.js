// ─── CREATIVA ACADEMY — CHRISTMAS DECORATIONS ────────────────────────────────
// Twinkling lights under the menu and gentle falling snow on every page.
// Turns itself off automatically after the date below, so nothing needs to be
// removed by hand. To turn it off sooner, set enabled to false.
// People whose device asks for less motion get the lights without animation
// and no snow.
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  var config = {
    enabled: true,
    lastDay: new Date(2027, 0, 6, 23, 59, 59) // January 6, 2027
  };
  if (!config.enabled || new Date() > config.lastDay) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var colors = ['#C0392B', '#D4A93A', '#4E7A3A', '#E8DCC0'];

  var css =
    '.xmas-lights{position:absolute;left:0;right:0;bottom:-13px;height:16px;pointer-events:none;overflow:hidden;z-index:1}' +
    '.xmas-lights::before{content:"";position:absolute;left:0;right:0;top:2px;height:1px;background:rgba(59,68,48,.35)}' +
    '.xmas-lights span{position:absolute;top:2px;width:7px;height:10px;border-radius:50% 50% 50% 50%/40% 40% 60% 60%;opacity:.9}' +
    '.xmas-lights span::before{content:"";position:absolute;top:-2px;left:2px;width:3px;height:3px;background:#5d6352;border-radius:1px}' +
    '@keyframes xmasTwinkle{0%,100%{opacity:.95;filter:brightness(1.1)}50%{opacity:.35;filter:brightness(.8)}}' +
    '.xmas-snow{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:40}' +
    '.xmas-snow i{position:absolute;top:-24px;color:#A9BCCB;font-style:normal;line-height:1;user-select:none;animation:xmasFall linear infinite}' +
    '@keyframes xmasFall{0%{transform:translate3d(0,-24px,0) rotate(0)}100%{transform:translate3d(var(--drift),105vh,0) rotate(200deg)}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function start() {
    // Lights along the bottom of the menu bar
    var header = document.querySelector('header');
    if (header) {
      var lights = document.createElement('div');
      lights.className = 'xmas-lights';
      lights.setAttribute('aria-hidden', 'true');
      var gap = 34, n = Math.ceil(Math.max(window.innerWidth, 1400) / gap);
      for (var i = 0; i < n; i++) {
        var b = document.createElement('span');
        b.style.left = (i * gap + 12) + 'px';
        b.style.background = colors[i % colors.length];
        b.style.boxShadow = '0 0 6px ' + colors[i % colors.length];
        if (!reduce) b.style.animation = 'xmasTwinkle ' + (1.6 + (i % 5) * 0.35) + 's ease-in-out ' + ((i * 0.37) % 2) + 's infinite';
        lights.appendChild(b);
      }
      header.appendChild(lights);
    }

    // Gentle snow
    if (reduce) return;
    var snow = document.createElement('div');
    snow.className = 'xmas-snow';
    snow.setAttribute('aria-hidden', 'true');
    var count = window.innerWidth < 700 ? 12 : 24;
    for (var j = 0; j < count; j++) {
      var f = document.createElement('i');
      f.textContent = '❄';
      var size = 9 + Math.random() * 11;
      f.style.left = (Math.random() * 100) + 'vw';
      f.style.fontSize = size + 'px';
      f.style.opacity = (0.35 + Math.random() * 0.4).toFixed(2);
      f.style.setProperty('--drift', (Math.random() * 120 - 60).toFixed(0) + 'px');
      f.style.animationDuration = (11 + Math.random() * 12).toFixed(1) + 's';
      f.style.animationDelay = (-Math.random() * 20).toFixed(1) + 's';
      snow.appendChild(f);
    }
    document.body.appendChild(snow);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
