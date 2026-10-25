(function () {
  'use strict';

  var stage = document.getElementById('stage');
  if (!stage) return;

  var panels = Array.prototype.slice.call(stage.querySelectorAll('.panel'));

  /* ---------------------------------------------------------
     Tampilkan panel
     --------------------------------------------------------- */
  function showView(name) {
    var target = stage.querySelector('.panel[data-view="' + name + '"]');
    if (!target) return;

    panels.forEach(function (panel) {
      panel.classList.remove('is-active');
    });

    target.classList.add('is-active');
  }

  /* ---------------------------------------------------------
     Klik navigasi
     --------------------------------------------------------- */
  stage.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-goto]');
    if (!trigger) return;

    e.preventDefault();

    var dest = trigger.getAttribute('data-goto');
    showView(dest);
  });

  /* ---------------------------------------------------------
     Salin nomor DANA
     --------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var copyBtn = e.target.closest('[data-copy]');
    if (!copyBtn) return;

    e.preventDefault();

    var selector = copyBtn.getAttribute('data-copy');
    var source = document.querySelector(selector);
    if (!source) return;

    var text = source.textContent.trim();
    if (!text) return;

    var original = copyBtn.textContent;

    function done() {
      copyBtn.textContent = 'Tersalin';
      setTimeout(function () {
        copyBtn.textContent = original;
      }, 1500);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        fallbackCopy(text, done);
      });
    } else {
      fallbackCopy(text, done);
    }
  });

  function fallbackCopy(text, callback) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();

    try {
      document.execCommand('copy');
      callback();
    } catch (err) { /* diamkan */ }

    document.body.removeChild(ta);
  }

  /* ---------------------------------------------------------
     Musik — play / pause
     --------------------------------------------------------- */
  var music    = document.getElementById('music');
  var musicBtn = document.getElementById('musicBtn');
  var musicBox = document.getElementById('musicBox');
  var musicStatus = document.getElementById('musicStatus');

  if (music && musicBtn && musicBox) {
    music.volume = 0.6;

    function setPlaying(state) {
      musicBox.classList.toggle('is-playing', state);
      musicBtn.setAttribute('aria-pressed', state ? 'true' : 'false');
      musicBtn.setAttribute('aria-label', state ? 'Jeda musik' : 'Putar musik');
      if (musicStatus) {
        musicStatus.textContent = state ? 'Sedang diputar' : 'Musik dijeda';
      }
    }

    musicBtn.addEventListener('click', function () {
      if (music.paused) {
        music.play().then(function () {
          setPlaying(true);
        }).catch(function () {
          setPlaying(false);
        });
      } else {
        music.pause();
        setPlaying(false);
      }
    });

    music.addEventListener('play',  function () { setPlaying(true);  });
    music.addEventListener('pause', function () { setPlaying(false); });
    music.addEventListener('error', function () { setPlaying(false); });
  }

  /* ---------------------------------------------------------
     Tampilan awal
     --------------------------------------------------------- */
  showView('home');
})();
