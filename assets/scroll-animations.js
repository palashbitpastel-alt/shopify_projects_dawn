/* ============================================
   SCROLL ANIMATIONS - Main JS Controller
   ============================================ */

// Initialize Lenis smooth scroll
var lenis = new Lenis({
  duration: 1.2,
  easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
  smoothWheel: true,
  touchMultiplier: 1.5
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(function (time) {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Set ScrollTrigger defaults
ScrollTrigger.defaults({ markers: false });

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

  const grid = document.querySelector('.rf-stats__grid');
  if (!grid) return;

  const valueEls = grid.querySelectorAll('.rf-stats__value');

  // Slide-up the entire grid
  gsap.to(grid, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: grid,
      start: 'top 70%',
      once: true
    }
  });

  // Count-up each number + bar fill with stagger
  valueEls.forEach(function (el, i) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var obj = { val: 0 };

    // Find the bar fill in the same stat item
    var statItem = el.closest('.rf-stats__item');
    var barFill = statItem ? statItem.querySelector('.rf-stats__bar-fill') : null;

    gsap.to(obj, {
      val: target,
      duration: 2,
      delay: i * 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 70%',
        once: true
      },
      onUpdate: function () {
        el.textContent = Math.round(obj.val);
        if (barFill) {
          barFill.style.width = Math.round(obj.val) + '%';
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

function initPyramidSection() {
  console.log('[ScrollAnim] initPyramidSection loaded');

  var section = document.querySelector('.rf-broken');
  if (!section) return;

  var left = section.querySelector('.rf-broken__left');
  var right = section.querySelector('.rf-broken__right');
  var headline = section.querySelector('.rf-broken__headline');

  // Split headline into words and wrap each in a span
  if (headline) {
    var text = headline.textContent.trim();
    headline.innerHTML = text.split(/\s+/).map(function (word) {
      return '<span class="word">' + word + '</span>';
    }).join(' ');
  }

  // Left column slide in
  if (left) {
    gsap.to(left, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        once: true
      }
    });
  }

  // Word-by-word stagger on headline
  var words = section.querySelectorAll('.rf-broken__headline .word');
  if (words.length) {
    gsap.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        once: true
      }
    });
  }

  // Right column slide in
  if (right) {
    gsap.to(right, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      delay: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        once: true
      }
    });
  }
}

function initWinningSection() {
  console.log('[ScrollAnim] initWinningSection loaded');
}

/* --- 3D Effects --- */

function init3DEffects() {
  console.log('[ScrollAnim] init3DEffects loaded');

  // === 1. Hero 3D Parallax Tilt on Mouse Move ===
  var hero = document.querySelector('.rf-hero');
  var heroContent = document.querySelector('.rf-hero__content');
  if (hero && heroContent) {
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(heroContent, {
        rotateY: x * 8,
        rotateX: -y * 5,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
    hero.addEventListener('mouseleave', function () {
      gsap.to(heroContent, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    });
  }

  // === 2. Floating Particles in Hero ===
  if (hero) {
    var particlesDiv = document.createElement('div');
    particlesDiv.className = 'rf-hero__particles';
    for (var i = 0; i < 25; i++) {
      var p = document.createElement('div');
      p.className = 'rf-hero__particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = (Math.random() * 8) + 's';
      p.style.animationDuration = (6 + Math.random() * 6) + 's';
      p.style.width = (2 + Math.random() * 4) + 'px';
      p.style.height = p.style.width;
      particlesDiv.appendChild(p);
    }
    hero.insertBefore(particlesDiv, hero.firstChild);
  }

  // === 3. 3D Tilt on Stat Cards ===
  var statItems = document.querySelectorAll('.rf-stats__item');
  statItems.forEach(function (item) {
    // Wrap content in a card-inner div for 3D effect
    var inner = document.createElement('div');
    inner.className = 'rf-stats__card-inner';
    while (item.firstChild) {
      inner.appendChild(item.firstChild);
    }
    item.appendChild(inner);

    item.addEventListener('mousemove', function (e) {
      var rect = item.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(inner, {
        rotateY: x * 15,
        rotateX: -y * 15,
        scale: 1.03,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    item.addEventListener('mouseleave', function () {
      gsap.to(inner, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });

  // === 4. 3D Perspective Rotate on Broken System Image ===
  var brokenImage = document.querySelector('.rf-broken__image img');
  if (brokenImage) {
    gsap.fromTo(brokenImage,
      { rotateY: -12, rotateX: 5, scale: 0.9 },
      {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.rf-broken__image',
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1
        }
      }
    );
  }

  // === 5. Cursor Glow Follow ===
  if (window.innerWidth >= 768) {
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    var glowX = 0, glowY = 0, curX = 0, curY = 0;

    document.addEventListener('mousemove', function (e) {
      curX = e.clientX;
      curY = e.clientY;
    });

    function animateGlow() {
      glowX += (curX - glowX) * 0.08;
      glowY += (curY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // === 6. Magnetic Buttons ===
  var magneticEls = document.querySelectorAll('.video-expand__play-btn, .rf-hero__banner');
  magneticEls.forEach(function (el) {
    el.classList.add('magnetic-btn');
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    el.addEventListener('mouseleave', function () {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });

  // === 7. 3D Scroll Reveal for sections ===
  var revealSections = document.querySelectorAll('.rf-stats, .rf-broken');
  revealSections.forEach(function (section) {
    gsap.fromTo(section,
      { rotateX: 4, y: 60, opacity: 0, transformPerspective: 800 },
      {
        rotateX: 0,
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  // === 8. Parallax depth layers on scroll ===
  var bgLeft = document.querySelector('.rf-hero__bg-left');
  var bgRight = document.querySelector('.rf-hero__bg-right');
  if (bgLeft) {
    gsap.to(bgLeft, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: '.rf-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }
  if (bgRight) {
    gsap.to(bgRight, {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.rf-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }
}

/* --- Bootstrap all animations on DOM ready --- */

document.addEventListener('DOMContentLoaded', function () {
  console.log('[ScrollAnim] Initializing all scroll animations...');

  initHeroAnimation();
  initVideoExpand();
  initStatsCounters();
  initTextReveal();
  initPyramidSection();
  initWinningSection();
  init3DEffects();

  console.log('[ScrollAnim] All animations initialized.');
});
