/*!
 * orbital-bg.js — Continuous 3D Orbital Dots Background
 * Successful Future / Успешно Бъдеще
 *
 * Creates a floating 3D orbital system featuring delicate elliptical trajectory rings
 * and crisp glowing dots continuously traveling along their orbital paths.
 */
(function () {
  'use strict';
  if (window.__orbitalBgMounted) return;          // never mount twice
  window.__orbitalBgMounted = true;

  var CFG = Object.assign({
    speed: 1,             // global animation speed
    zIndex: 0,            // keep behind page content (>= 1)
    colors: ['#4A8BDF', '#A0006D', '#2E6BC4', '#8FB8E8', '#C21E8A']  // brand palette
  }, window.ORBITAL_BG || {});

  function start() {
    if (!window.THREE) { console.warn('[orbital-bg] three.js not found'); return; }
    var T = window.THREE;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Fixed background canvas ──────────────────────────────────────────
    var canvas = document.createElement('canvas');
    canvas.id = 'orbital-bg-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:' + CFG.zIndex +
      ';pointer-events:none;display:block;';
    (document.body || document.documentElement).appendChild(canvas);

    var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x000000, 0);

    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 12);

    var field = new T.Group();           // whole orbital field
    scene.add(field);

    var dotTexture = makeDotTexture(T);

    // ── Generate 3D Elliptical Orbits & Traveling Dots ───────────────────
    var orbits = [];
    var orbitConfigs = [
      { rx: 7.5, ry: 4.2, cx: -1.5, cy: 1.2, cz: -1.0, rot: [0.6, 0.3, -0.2], color: 0x4a8bdf, dots: 4, speed: 0.18 },
      { rx: 9.0, ry: 5.0, cx: 1.8, cy: -0.8, cz: -2.5, rot: [-0.4, 0.8, 0.5], color: 0xa0006d, dots: 5, speed: -0.14 },
      { rx: 6.2, ry: 3.5, cx: -3.0, cy: -2.0, cz: 0.5,  rot: [1.1, -0.2, 0.4], color: 0x2e6bc4, dots: 3, speed: 0.22 },
      { rx: 11.0, ry: 6.0, cx: 0.0, cy: 0.5, cz: -4.0, rot: [0.2, -0.7, -0.3], color: 0x8fb8e8, dots: 6, speed: -0.12 },
      { rx: 8.2, ry: 4.6, cx: 2.5, cy: 2.2, cz: -1.5, rot: [-0.8, 0.4, -0.6], color: 0xc21e8a, dots: 4, speed: 0.16 },
      { rx: 10.5, ry: 5.8, cx: -2.2, cy: 3.0, cz: -3.0, rot: [0.5, 0.9, -0.1], color: 0x4a8bdf, dots: 5, speed: -0.15 }
    ];

    orbitConfigs.forEach(function (cfg) {
      var group = new T.Group();
      group.position.set(cfg.cx, cfg.cy, cfg.cz);
      group.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
      field.add(group);

      // 1. Draw thin elliptical trajectory line
      var SEG = 128;
      var pts = new Float32Array((SEG + 1) * 3);
      for (var s = 0; s <= SEG; s++) {
        var ang = (s / SEG) * Math.PI * 2;
        pts[s * 3]     = Math.cos(ang) * cfg.rx;
        pts[s * 3 + 1] = Math.sin(ang) * cfg.ry;
        pts[s * 3 + 2] = 0;
      }
      var lineGeo = new T.BufferGeometry();
      lineGeo.setAttribute('position', new T.BufferAttribute(pts, 3));
      var lineMat = new T.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.25
      });
      group.add(new T.Line(lineGeo, lineMat));

      // 2. Create dots moving along this trajectory
      var travellingDots = [];
      for (var d = 0; d < cfg.dots; d++) {
        var spriteMat = new T.SpriteMaterial({
          map: dotTexture,
          color: new T.Color(cfg.color),
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
          blending: T.AdditiveBlending
        });
        var sprite = new T.Sprite(spriteMat);
        var size = 0.24 + Math.random() * 0.16;
        sprite.scale.set(size, size, 1);
        group.add(sprite);

        travellingDots.push({
          sprite: sprite,
          phase: (d / cfg.dots) * Math.PI * 2 + (Math.random() * 0.4),
          speedOffset: 0.9 + Math.random() * 0.2,
          baseOpacity: 0.7 + Math.random() * 0.3
        });
      }

      orbits.push({
        group: group,
        rx: cfg.rx,
        ry: cfg.ry,
        speed: cfg.speed,
        dots: travellingDots
      });
    });

    // ── Interaction: Pointer & Scroll Parallax ────────────────────────────
    var px = 0, py = 0, tpx = 0, tpy = 0, scrollY = 0;
    window.addEventListener('pointermove', function (e) {
      tpx = (e.clientX / window.innerWidth - 0.5) * 2;
      tpy = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    window.addEventListener('scroll', function () {
      scrollY = window.scrollY || window.pageYOffset || 0;
    }, { passive: true });

    // ── Resize ───────────────────────────────────────────────────────────
    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    // ── Animation Loop ───────────────────────────────────────────────────
    var clock = new T.Clock();
    var paused = false;
    document.addEventListener('visibilitychange', function () { paused = document.hidden; });

    function tick() {
      requestAnimationFrame(tick);
      if (paused) return;
      var dt = Math.min(0.05, clock.getDelta());
      var t = clock.getElapsedTime() * CFG.speed;

      px += (tpx - px) * Math.min(1, dt * 3);
      py += (tpy - py) * Math.min(1, dt * 3);

      field.rotation.y = (reduce ? 0 : t * 0.015) + px * 0.12;
      field.rotation.x = (reduce ? 0 : Math.sin(t * 0.03) * 0.03) + py * 0.08;
      field.position.y = -scrollY * 0.0008;

      // Update position of each dot along its orbit trajectory
      orbits.forEach(function (orb) {
        orb.dots.forEach(function (dot) {
          var angle = dot.phase + (reduce ? 0 : t * orb.speed * dot.speedOffset);
          var x = Math.cos(angle) * orb.rx;
          var y = Math.sin(angle) * orb.ry;
          dot.sprite.position.set(x, y, 0);

          // Subtle twinkle/pulsing effect
          var pulse = 0.85 + 0.15 * Math.sin(t * 2.5 + dot.phase);
          dot.sprite.material.opacity = dot.baseOpacity * pulse;
        });
      });

      renderer.render(scene, camera);
    }
    tick();
  }

  // Texture helper for bright glowing dots
  function makeDotTexture(T) {
    var s = 64, m = s / 2;
    var c = document.createElement('canvas');
    c.width = c.height = s;
    var ctx = c.getContext('2d');

    var g = ctx.createRadialGradient(m, m, 0, m, m, m);
    g.addColorStop(0.0, 'rgba(255,255,255,1.0)');
    g.addColorStop(0.20, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.3)');
    g.addColorStop(1.0, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(m, m, m, 0, Math.PI * 2); ctx.fill();

    var tex = new T.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
