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

  // =============================================
  // PART 1: Image + word highlight (CSS sticky, 200vh)
  // =============================================
  var part1 = document.querySelector('.rf-broken-part1');
  if (part1) {
    // Split text into word spans
    var text1 = part1.querySelector('.rf-broken-part1__text');
    if (text1) {
      var raw1 = text1.textContent.trim();
      text1.innerHTML = raw1.split(/\s+/).map(function (w) {
        return '<span class="word">' + w + '</span>';
      }).join(' ');
    }
    var words1 = part1.querySelectorAll('.rf-broken-part1__text .word');

    // Image scroll-in: opacity 0.4 → 1, translateY -40 → 0
    var imageWrap = part1.querySelector('.rf-broken-part1__image-wrap');
    if (imageWrap) {
      gsap.to(imageWrap, {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: part1,
          start: 'top 75%',
          end: 'top top',
          scrub: 1
        }
      });
    }

    // Word highlight as you scroll through the 200vh
    ScrollTrigger.create({
      trigger: part1,
      start: 'top top',
      end: '50% top',
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

    // Fade out part1 sticky content after words are done
    var sticky1 = part1.querySelector('.rf-broken-part1__sticky');
    if (sticky1) {
      gsap.to(sticky1, {
        opacity: 0,
        y: -80,
        filter: 'blur(20px)',
        ease: 'none',
        scrollTrigger: {
          trigger: part1,
          start: '55% top',
          end: '75% top',
          scrub: 1
        }
      });
    }
  }

  // =============================================
  // PART 2: Headline with char blur/brightness/scale (GSAP pinned)
  // Pins when center, unpins when part3 hits center
  // =============================================
  var part2 = document.querySelector('.rf-broken-part2');
  var part2inner = document.querySelector('.rf-broken-part2__inner');
  var part3 = document.querySelector('.rf-broken-part3');

  if (part2 && part2inner) {
    // Split headline into character spans
    var headline = part2.querySelector('.rf-broken-part2__headline');
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
    var chars = part2.querySelectorAll('.rf-broken-part2__headline .char');

    // Pin part2 for 200vh of scroll
    ScrollTrigger.create({
      trigger: part2inner,
      start: 'top top',
      end: '+=200%',
      pin: true,
      pinSpacing: true
    });

    // State 1: Chars appear (blur 8 → 0, opacity 0 → 1)
    chars.forEach(function (c, idx) {
      gsap.to(c, {
        opacity: 1,
        filter: 'blur(0px) brightness(1)',
        y: 0,
        scale: 1,
        duration: 0.5,
        delay: idx * 0.02,
        scrollTrigger: {
          trigger: part2inner,
          start: 'top 40%',
          once: true
        }
      });
    });

    // State 2: Chars blur out with brightness + scale down as you scroll past
    chars.forEach(function (c) {
      gsap.to(c, {
        filter: 'blur(30px) brightness(10)',
        y: -50,
        scale: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: part2,
          start: '60% top',
          end: '90% top',
          scrub: 1
        }
      });
    });
  }

  // =============================================
  // PART 3: Word color change (NOT pinned, bottom 20px trigger)
  // =============================================
  if (part3) {
    var text3 = part3.querySelector('.rf-broken-part3__text');
    if (text3) {
      var raw3 = text3.textContent.trim();
      text3.innerHTML = raw3.split(/\s+/).map(function (w) {
        return '<span class="word">' + w + '</span>';
      }).join(' ');
    }
    var words3 = part3.querySelectorAll('.rf-broken-part3__text .word');

    ScrollTrigger.create({
      trigger: part3,
      start: 'top bottom-=20',
      end: 'center center',
      scrub: 1,
      onUpdate: function (self) {
        var progress = self.progress;
        var total = words3.length;
        var litCount = Math.ceil(progress * total) - 1;
        words3.forEach(function (w, i) {
          if (progress > 0 && i <= litCount) {
            w.classList.add('is-lit');
          } else {
            w.classList.remove('is-lit');
          }
        });
      }
    });
  }
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
