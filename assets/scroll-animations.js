/* ============================================
   SCROLL ANIMATIONS - Main JS Controller
   ============================================ */

// Register GSAP plugins FIRST
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({ markers: false });

// Initialize Lenis smooth scroll
var lenis = new Lenis({
  duration: 1.2,
  easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
  smoothWheel: true,
  touchMultiplier: 1.5
});

// Connect Lenis to GSAP ScrollTrigger (must be after plugin registration)
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(function (time) {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* --- Animation Init Functions --- */

function initHeroAnimation() {
  console.log('[ScrollAnim] initHeroAnimation loaded');

  const banner = document.querySelector('.rf-hero__banner');
  const headline = document.querySelector('.rf-hero__headline');
  const subtext = document.querySelector('.rf-hero__subtext');

  if (!headline) return;

  // Red banner fade in
  if (banner) {
    gsap.to(banner, {
      opacity: 1,
      duration: 0.5,
      delay: 0,
      ease: 'power2.out'
    });
  }

  // Headline entrance
  gsap.to(headline, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.1,
    delay: 0.1,
    ease: 'power3.out'
  });

  // Paragraph entrance
  if (subtext) {
    gsap.to(subtext, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay: 0.55,
      ease: 'power2.out'
    });
  }
}

function initStatsCounters() {
  console.log('[ScrollAnim] initStatsCounters loaded');

  var section = document.querySelector('.rf-stats');
  if (!section) return;

  var bars = section.querySelectorAll('.rf-stats__bar');
  var valueEls = section.querySelectorAll('.rf-stats__value');

  // Collect all target values to rank them
  var targets = [];
  bars.forEach(function (bar) {
    targets.push(parseInt(bar.getAttribute('data-bar-target'), 10) || 0);
  });
  // Set bar opacity based on rank: highest = full, others dimmer
  var sorted = targets.slice().sort(function (a, b) { return b - a; });
  bars.forEach(function (bar, i) {
    var val = targets[i];
    var rank = sorted.indexOf(val);
    var opacityMap = [1, 0.7, 0.45];
    bar.style.backgroundColor = 'rgba(204, 0, 0, ' + (opacityMap[rank] || 0.45) + ')';
  });

  // Animate: count numbers + grow bar heights
  valueEls.forEach(function (el, i) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var obj = { val: 0 };
    var item = el.closest('.rf-stats__item');
    var bar = item ? item.querySelector('.rf-stats__bar') : null;
    // Max bar height 300px, scale proportionally
    var maxBarHeight = 300;
    var barHeight = (target / 100) * maxBarHeight;

    gsap.to(obj, {
      val: target,
      duration: 2,
      delay: i * 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        once: true
      },
      onUpdate: function () {
        var current = Math.round(obj.val);
        el.textContent = current;
        if (bar) {
          bar.style.height = Math.round((current / target) * barHeight) + 'px';
        }
      }
    });
  });
}

function initVideoExpand() {
  console.log('[ScrollAnim] initVideoExpand loaded');

  var wrapper = document.querySelector('.video-expand__wrapper');
  if (!wrapper) return;

  // Skip animation on mobile — show static layout instead
  if (window.innerWidth < 768) return;

  var section = document.querySelector('.video-expand-section');
  var startWidth = getComputedStyle(section).getPropertyValue('--start-w').trim() || '80vw';

  // Play button: click = fullscreen, double-click = exit
  var playBtn = document.querySelector('.video-expand__play-btn');
  if (playBtn) {
    var clickTimer = null;

    playBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
        // Double click — exit fullscreen
        wrapper.classList.remove('is-fullscreen');
        document.body.style.overflow = '';
        var video = wrapper.querySelector('video');
        if (video) {
          video.muted = true;
          video.controls = false;
        }
      } else {
        clickTimer = setTimeout(function () {
          clickTimer = null;
          // Single click — enter fullscreen
          wrapper.classList.add('is-fullscreen');
          document.body.style.overflow = 'hidden';
          var video = wrapper.querySelector('video');
          if (video) {
            video.muted = false;
            video.controls = true;
          }
        }, 250);
      }
    });
  }

  gsap.fromTo(wrapper,
    { width: startWidth, borderRadius: 'var(--start-r, 24px)' },
    {
      width: '100vw',
      borderRadius: '0px',
      ease: 'none',
      scrollTrigger: {
        trigger: '.video-expand-section',
        start: 'top bottom-=100',
        end: 'top 25%',
        scrub: 1
      }
    }
  );
}

function initTextReveal() {
  console.log('[ScrollAnim] initTextReveal loaded');
}

function initBrokenSystem() {
  console.log('[ScrollAnim] initBrokenSystem loaded');

  // Helper: split text content into <span class="w"> per word
  function splitWords(el) {
    if (!el) return [];
    el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) {
      return '<span class="w">' + w + '</span>';
    }).join(' ');
    return el.querySelectorAll('.w');
  }

  // Helper: split text into <span class="ch"> per char
  function splitChars(el) {
    if (!el) return [];
    var t = el.textContent.trim();
    var html = '';
    for (var i = 0; i < t.length; i++) {
      html += t[i] === ' '
        ? '<span class="sp">&nbsp;</span>'
        : '<span class="ch">' + t[i] + '</span>';
    }
    el.innerHTML = html;
    return el.querySelectorAll('.ch');
  }

  // =============================================
  // PART 1 — Sticky image + word highlight
  // Section is 200vh, content is CSS sticky.
  // Image fades in, words light up, then all
  // fades out with blur + translateY before unpin.
  // =============================================
  var bs1 = document.querySelector('.rf-bs1');
  if (bs1) {
    var bs1Sticky = bs1.querySelector('.rf-bs1__sticky');
    var bs1Image  = bs1.querySelector('.rf-bs1__image');
    var bs1Words  = splitWords(bs1.querySelector('.rf-bs1__text'));

    // Image entrance: opacity 0.4→1, y -40→0
    if (bs1Image) {
      gsap.to(bs1Image, {
        opacity: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: bs1, start: 'top 75%', end: 'top top', scrub: 1 }
      });
    }

    // Words light up one by one (0%–50% of 200vh scroll)
    if (bs1Words.length) {
      ScrollTrigger.create({
        trigger: bs1, start: 'top top', end: '50% top', scrub: 1,
        onUpdate: function (self) {
          var n = Math.ceil(self.progress * bs1Words.length) - 1;
          bs1Words.forEach(function (w, i) {
            w.classList.toggle('lit', self.progress > 0 && i <= n);
          });
        }
      });
    }

    // Everything fades out together (60%–85%)
    if (bs1Sticky) {
      gsap.to(bs1Sticky, {
        opacity: 0, y: -100, filter: 'blur(20px)', ease: 'none',
        scrollTrigger: { trigger: bs1, start: '60% top', end: '85% top', scrub: 1 }
      });
    }
  }

  // =============================================
  // PART 2 — Headline char-by-char
  // GSAP pinned. Chars reveal on scroll, hold,
  // then blur out with brightness+scale.
  // =============================================
  var bs2 = document.querySelector('.rf-bs2');
  var bs2Pin = bs2 ? bs2.querySelector('.rf-bs2__pin') : null;
  if (bs2 && bs2Pin) {
    var bs2Chars = splitChars(bs2.querySelector('.rf-bs2__headline'));
    var numChars = bs2Chars.length;

    // Pin for 250% scroll
    ScrollTrigger.create({
      trigger: bs2Pin, start: 'top top', end: '+=250%',
      pin: true, pinSpacing: true
    });

    // Phase A: chars reveal one by one (0–40% of pin scroll)
    ScrollTrigger.create({
      trigger: bs2, start: 'top top', end: '30% top', scrub: 1,
      onUpdate: function (self) {
        var n = Math.ceil(self.progress * numChars) - 1;
        bs2Chars.forEach(function (c, i) {
          if (self.progress > 0 && i <= n) {
            c.style.opacity = '1';
            c.style.filter = 'blur(0px) brightness(1)';
            c.style.transform = 'translateY(0) scale(1)';
          }
        });
      }
    });

    // Phase B: all chars blur out with brightness + shrink (55–85%)
    ScrollTrigger.create({
      trigger: bs2, start: '55% top', end: '85% top', scrub: 1,
      onUpdate: function (self) {
        var p = self.progress;
        var f = 'blur(' + (p * 30).toFixed(1) + 'px) brightness(' + (1 + p * 9).toFixed(1) + ')';
        var t = 'translateY(' + (p * -50).toFixed(1) + 'px) scale(' + (1 - p * 0.7).toFixed(2) + ')';
        bs2Chars.forEach(function (c) {
          c.style.filter = f;
          c.style.transform = t;
        });
      }
    });
  }

  // =============================================
  // PART 3 — Word color transition
  // NOT pinned. Words #8d7d7d → #fff.
  // Triggers when part3 top is 20px from bottom.
  // =============================================
  var bs3 = document.querySelector('.rf-bs3');
  if (bs3) {
    var bs3Words = splitWords(bs3.querySelector('.rf-bs3__text'));

    if (bs3Words.length) {
      ScrollTrigger.create({
        trigger: bs3, start: 'top bottom-=20', end: 'center center', scrub: 1,
        onUpdate: function (self) {
          var n = Math.ceil(self.progress * bs3Words.length) - 1;
          bs3Words.forEach(function (w, i) {
            w.classList.toggle('lit', self.progress > 0 && i <= n);
          });
        }
      });
    }
  }
}

function initEatRealFood() {
  console.log('[ScrollAnim] initEatRealFood loaded');

  // Animate each food category panel
  var panels = document.querySelectorAll('.rf-erf__panel');
  panels.forEach(function (panel) {
    var text = panel.querySelector('.rf-erf__panel-text');
    var imgs = panel.querySelectorAll('.rf-erf__panel-img');

    if (text) {
      gsap.to(text, {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: panel, start: 'top 75%', once: true }
      });
    }

    imgs.forEach(function (img, j) {
      gsap.to(img, {
        opacity: 1, y: 0, duration: 0.7, delay: j * 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: panel, start: 'top 75%', once: true }
      });
    });
  });
}

function initClosingQuote() {
  console.log('[ScrollAnim] initClosingQuote loaded');

  var quoteEl = document.querySelector('[data-quote-words]');
  if (!quoteEl) return;

  // Split into word spans
  var raw = quoteEl.textContent.trim();
  quoteEl.innerHTML = raw.split(/\s+/).map(function (w) {
    return '<span class="w">' + w + '</span>';
  }).join(' ');
  var words = quoteEl.querySelectorAll('.w');

  ScrollTrigger.create({
    trigger: quoteEl, start: 'top bottom-=20', end: 'center center', scrub: 1,
    onUpdate: function (self) {
      var n = Math.ceil(self.progress * words.length) - 1;
      words.forEach(function (w, i) {
        w.classList.toggle('lit', self.progress > 0 && i <= n);
      });
    }
  });
}

function initWinningSection() {
  console.log('[ScrollAnim] initWinningSection loaded');
}

/* --- Bootstrap all animations on DOM ready --- */

document.addEventListener('DOMContentLoaded', function () {
  console.log('[ScrollAnim] Initializing all scroll animations...');

  initHeroAnimation();
  initVideoExpand();
  initStatsCounters();
  initTextReveal();
  initBrokenSystem();
  initEatRealFood();
  initClosingQuote();
  initWinningSection();

  console.log('[ScrollAnim] All animations initialized.');
});
