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

  var section = document.querySelector('.rf-broken');
  if (!section) return;

  var pinned = section.querySelector('.rf-broken__pinned');
  var scene1 = section.querySelector('.rf-broken__scene1');
  var scene2 = section.querySelector('.rf-broken__scene2');
  var scene3 = section.querySelector('.rf-broken__scene3');
  if (!scene1 || !scene2 || !scene3) return;

  // --- Split text1 into word spans ---
  var text1 = section.querySelector('.rf-broken__text1');
  if (text1) {
    var raw = text1.textContent.trim();
    text1.innerHTML = raw.split(/\s+/).map(function (w) {
      return '<span class="word">' + w + '</span>';
    }).join(' ');
  }
  var words1 = section.querySelectorAll('.rf-broken__text1 .word');

  // --- Split headline into character spans ---
  var headline = section.querySelector('.rf-broken__headline');
  if (headline) {
    var hText = headline.textContent.trim();
    var charHTML = '';
    for (var i = 0; i < hText.length; i++) {
      if (hText[i] === ' ') {
        charHTML += '<span class="char-space">&nbsp;</span>';
      } else {
        charHTML += '<span class="char">' + hText[i] + '</span>';
      }
    }
    headline.innerHTML = charHTML;
  }
  var chars = section.querySelectorAll('.rf-broken__headline .char');

  // --- Split text2 into word spans ---
  var text2 = section.querySelector('.rf-broken__text2');
  if (text2) {
    var raw2 = text2.textContent.trim();
    text2.innerHTML = raw2.split(/\s+/).map(function (w) {
      return '<span class="word">' + w + '</span>';
    }).join(' ');
  }
  var words2 = section.querySelectorAll('.rf-broken__text2 .word');

  // =============================================
  // PINNED AREA: Scene 1 + Scene 2
  // Pin the sticky container for 200vh of scroll
  // =============================================
  ScrollTrigger.create({
    trigger: '.rf-broken__sticky',
    start: 'top top',
    end: '+=200%',
    pin: true,
    pinSpacing: true
  });

  // === SCENE 1: Image scroll-in ===
  var imageWrap = section.querySelector('.rf-broken__image-wrap');
  if (imageWrap) {
    gsap.to(imageWrap, {
      opacity: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: pinned,
        start: 'top 75%',
        end: 'top top',
        scrub: 1
      }
    });
  }

  // === SCENE 1: Word highlight ===
  ScrollTrigger.create({
    trigger: pinned,
    start: 'top top',
    end: '30% top',
    scrub: 1,
    onUpdate: function (self) {
      var progress = self.progress;
      var total = words1.length;
      var litCount = Math.ceil(progress * total) - 1;
      words1.forEach(function (w, i) {
        if (progress > 0 && i <= litCount) {
          w.classList.add('is-lit');
        } else {
          w.classList.remove('is-lit');
        }
      });
    }
  });

  // Scene 1 fade out
  gsap.to(scene1, {
    opacity: 0,
    y: -100,
    filter: 'blur(20px)',
    ease: 'none',
    scrollTrigger: {
      trigger: pinned,
      start: '30% top',
      end: '40% top',
      scrub: 1
    }
  });

  // === SCENE 2: Headline fade in ===
  gsap.to(scene2, {
    opacity: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: pinned,
      start: '35% top',
      end: '42% top',
      scrub: 1
    }
  });

  // Char-by-char reveal
  ScrollTrigger.create({
    trigger: pinned,
    start: '42% top',
    end: '65% top',
    scrub: 1,
    onUpdate: function (self) {
      var progress = self.progress;
      var total = chars.length;
      var litCount = Math.ceil(progress * total) - 1;
      chars.forEach(function (c, i) {
        if (progress > 0 && i <= litCount) {
          c.classList.add('is-visible');
        } else {
          c.classList.remove('is-visible');
        }
      });
    }
  });

  // Scene 2 ends blurry + small — does NOT fully disappear
  gsap.to(scene2, {
    opacity: 0.15,
    scale: 0.85,
    filter: 'blur(6px)',
    ease: 'none',
    scrollTrigger: {
      trigger: pinned,
      start: '75% top',
      end: '100% top',
      scrub: 1
    }
  });

  // =============================================
  // SCENE 3: NOT pinned — triggers at bottom 20px
  // =============================================
  ScrollTrigger.create({
    trigger: scene3,
    start: 'top bottom-=20',
    end: 'bottom 40%',
    scrub: 1,
    onUpdate: function (self) {
      var progress = self.progress;
      var total = words2.length;
      var litCount = Math.ceil(progress * total) - 1;
      words2.forEach(function (w, i) {
        if (progress > 0 && i <= litCount) {
          w.classList.add('is-lit');
        } else {
          w.classList.remove('is-lit');
        }
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
  initWinningSection();

  console.log('[ScrollAnim] All animations initialized.');
});
