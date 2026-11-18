// ─── CREATIVA ACADEMY — SCHOOL ALERT BANNER ──────────────────────────────────
// To show a banner: set enabled to true, choose type, and update message.
// To hide it: set enabled back to false and deploy.
//
// Types: 'info' (green), 'warning' (yellow), 'closed' (dark)
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  var config = {
    enabled: false,
    type: 'warning',
    message: 'School is closed today due to inclement weather. We will reopen tomorrow.',
    link: null           // e.g. { text: 'Learn more', href: '/contact/' }
  };

  if (!config.enabled) return;

  var el = document.getElementById('school-alert');
  if (!el) return;

  el.className = 'school-alert school-alert--' + config.type + ' visible';

  var msg = el.querySelector('.alert-msg');
  if (msg) {
    msg.textContent = config.message;
    if (config.link) {
      var a = document.createElement('a');
      a.href = config.link.href;
      a.textContent = ' ' + config.link.text;
      msg.appendChild(a);
    }
  }
})();
