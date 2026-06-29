/*!
 * compass-planet.js — 3D "Compass" logo-planet for the Compass page.
 * Successful Future / Успешно Бъдеще
 *
 * Renders the brand owl logo integrated on a 3D spherical surface with physical lighting,
 * subtle bump relief, and a smooth 3D curved geometry matching the rotating wireframe globe
 * cage and orbiting moons.
 *
 * Requires three.js (r128) loaded before this script.
 * Mounts into <canvas id="compass-planet">. If WebGL is unavailable or the user
 * prefers reduced motion, it reveals the static fallback <img> instead.
 *
 * Palette (from styles/tokens.css):
 *   royal blue   #4A8BDF   eggplant/pink #C21E8A
 *   light blue   #8FB8E8   deep navy     #0A2247
 */
(function () {
  'use strict';

  var LOGO_SRC = '/assets/compass-logo.png';

  var canvas = document.getElementById('compass-planet');
  if (!canvas) return;
  var fallback = document.querySelector('.compass-intro__planet-fallback');

  function showFallback() {
    if (canvas) canvas.style.display = 'none';
    if (fallback) fallback.hidden = false;
  }

  function webglOK() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function start() {
    if (!window.THREE) { showFallback(); return; }
    if (!webglOK()) { showFallback(); return; }

    var T = window.THREE;
    var renderer;
    try {
      renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    } catch (e) { showFallback(); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    var R = 1.0;
    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 8.3);

    // ── Lighting — soft planetary terminator, blue + pink rim ──
    scene.add(new T.AmbientLight(0xcfe2ff, 0.70));
    var key = new T.DirectionalLight(0xe6f0fa, 0.75); key.position.set(-2, 2.5, 4); scene.add(key);
    var rim = new T.DirectionalLight(0x4a8bdf, 0.70); rim.position.set(3.5, -1.5, -2.5); scene.add(rim);
    var warm = new T.DirectionalLight(0xc21e8a, 0.35); warm.position.set(2, 2.5, 2); scene.add(warm);

    // ── Atmosphere glow (two back-side shells) ──
    scene.add(new T.Mesh(
      new T.SphereGeometry(R * 1.22, 48, 48),
      new T.MeshBasicMaterial({ color: 0x4a8bdf, transparent: true, opacity: 0.15, side: T.BackSide })
    ));
    scene.add(new T.Mesh(
      new T.SphereGeometry(R * 1.06, 48, 48),
      new T.MeshBasicMaterial({ color: 0x8fb8e8, transparent: true, opacity: 0.10, side: T.BackSide })
    ));

    // ── Planet group holding body sphere and 3D spherical logo face ──
    var planetGroup = new T.Group();
    scene.add(planetGroup);

    // 1. Base planet sphere
    var planetBody = new T.Mesh(
      new T.SphereGeometry(R, 96, 96),
      new T.MeshStandardMaterial({ color: 0xbcd4f0, roughness: 0.65, metalness: 0.12 })
    );
    planetGroup.add(planetBody);

    // 2. Owl logo: rendered as a 3D spherical curved cap with physical PBR lighting
    var img = new Image();
    img.onload = function () {
      var S = 1024, c = document.createElement('canvas'); c.width = c.height = S;
      var x = c.getContext('2d');
      // Spherical shading baked into the texture face (softened ice-blue gradient)
      var g = x.createRadialGradient(S * 0.40, S * 0.38, S * 0.04, S * 0.5, S * 0.5, S * 0.54);
      g.addColorStop(0, '#d8e6f7'); g.addColorStop(0.60, '#b8d3f2'); g.addColorStop(1, '#93bce8');
      x.fillStyle = g; x.beginPath(); x.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2); x.fill();
      
      // Draw owl logo
      var oh = S * 0.60, sc = oh / img.height, ow = img.width * sc;
      x.globalCompositeOperation = 'multiply';
      x.drawImage(img, S / 2 - ow / 2, S / 2 - oh / 2 - S * 0.01, ow, oh);
      x.globalCompositeOperation = 'source-over';

      var tex = new T.CanvasTexture(c);
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 1;

      // Generate bump texture for physical 3D linework relief
      var bc = document.createElement('canvas'); bc.width = bc.height = S;
      var bx = bc.getContext('2d');
      bx.fillStyle = '#808080'; bx.fillRect(0, 0, S, S);
      bx.drawImage(img, S / 2 - ow / 2, S / 2 - oh / 2 - S * 0.01, ow, oh);
      var imgData = bx.getImageData(0, 0, S, S), data = imgData.data;
      for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i+1] + data[i+2]) / 3;
        var val = avg < 200 ? 230 : 128;
        data[i] = data[i+1] = data[i+2] = val;
      }
      bx.putImageData(imgData, 0, 0);
      var bumpTex = new T.CanvasTexture(bc);

      // Create high-density disk geometry and project vertices onto 3D sphere surface (z = sqrt(R^2 - x^2 - y^2))
      var rad = R * 0.90;
      var decalGeo = new T.CircleGeometry(rad, 72, 24);
      var pos = decalGeo.attributes.position;
      var sphereR = R * 1.004;
      for (var p = 0; p < pos.count; p++) {
        var vx = pos.getX(p), vy = pos.getY(p);
        var distSq = vx * vx + vy * vy;
        var vz = Math.sqrt(Math.max(0, sphereR * sphereR - distSq));
        pos.setZ(p, vz);
      }
      decalGeo.computeVertexNormals();

      // Physical standard material responding dynamically to 3D scene lights
      var decalMat = new T.MeshStandardMaterial({
        map: tex,
        bumpMap: bumpTex,
        bumpScale: 0.025,
        roughness: 0.45,
        metalness: 0.10,
        color: 0xdde9f7,
        depthWrite: true
      });

      var decalMesh = new T.Mesh(decalGeo, decalMat);
      planetGroup.add(decalMesh);
    };
    img.src = LOGO_SRC;

    // ── Rotating wireframe globe cage ──
    var cage = new T.Group(); scene.add(cage);
    var cageMat = new T.LineBasicMaterial({ color: 0x8fb8e8, transparent: true, opacity: 0.16 });
    function circle(rad, segs) {
      var pts = new Float32Array((segs + 1) * 3);
      for (var i = 0; i <= segs; i++) { var a = (i / segs) * Math.PI * 2; pts[i*3]=Math.cos(a)*rad; pts[i*3+1]=Math.sin(a)*rad; pts[i*3+2]=0; }
      var gg = new T.BufferGeometry(); gg.setAttribute('position', new T.BufferAttribute(pts, 3));
      return new T.Line(gg, cageMat);
    }
    for (var k = 0; k < 6; k++) { var mer = circle(R * 1.012, 96); mer.rotation.y = (k / 6) * Math.PI; cage.add(mer); }
    [-0.55, 0, 0.55].forEach(function (lat) {
      var r = Math.cos(lat) * R * 1.012; var lc = circle(r, 96);
      lc.rotation.x = Math.PI / 2; lc.position.y = Math.sin(lat) * R * 1.012; cage.add(lc);
    });

    // ── Orbits + moons ──
    var dotTex = makeDotTexture(T);
    var orbits = new T.Group(); scene.add(orbits);

    var ringSpecs = [
      { rad: 1.52, tilt: [1.15, 0.0, 0.22], color: 0x4a8bdf, moons: [{ size: 0.10, phase: 0.0, speed: 0.42 }, { size: 0.05, phase: 2.4, speed: 0.42 }] },
      { rad: 1.86, tilt: [-0.55, 0.5, 0.0], color: 0xc21e8a, moons: [{ size: 0.11, phase: 1.2, speed: -0.32 }, { size: 0.06, phase: 4.0, speed: -0.32 }] }
    ];

    var moonList = [];
    ringSpecs.forEach(function (spec) {
      var rg = new T.Group(); rg.rotation.set(spec.tilt[0], spec.tilt[1], spec.tilt[2]); orbits.add(rg);
      var segs = 160, pts = new Float32Array((segs + 1) * 3);
      for (var i = 0; i <= segs; i++) { var a = (i / segs) * Math.PI * 2; pts[i*3]=Math.cos(a)*spec.rad; pts[i*3+1]=Math.sin(a)*spec.rad; pts[i*3+2]=0; }
      var lg = new T.BufferGeometry(); lg.setAttribute('position', new T.BufferAttribute(pts, 3));
      rg.add(new T.Line(lg, new T.LineBasicMaterial({ color: spec.color, transparent: true, opacity: 0.5 })));
      spec.moons.forEach(function (mo) {
        var moon = new T.Mesh(new T.SphereGeometry(mo.size, 24, 24),
          new T.MeshStandardMaterial({ color: spec.color, emissive: spec.color, emissiveIntensity: 0.85, roughness: 0.4, metalness: 0.0 }));
        rg.add(moon);
        var halo = new T.Sprite(new T.SpriteMaterial({ map: dotTex, color: new T.Color(spec.color), transparent: true, opacity: 0.7, depthWrite: false, blending: T.AdditiveBlending }));
        var hs = mo.size * 5.5; halo.scale.set(hs, hs, 1); rg.add(halo);
        moonList.push({ moon: moon, halo: halo, rad: spec.rad, phase: mo.phase, speed: mo.speed });
      });
    });

    // ── Resize (square) ──
    function resize() {
      var w = Math.max(1, Math.round(canvas.clientWidth));
      renderer.setSize(w, w, false);
      camera.aspect = 1; camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    // ── Animation loop ──
    var clock = new T.Clock();
    var paused = false;
    document.addEventListener('visibilitychange', function () { paused = document.hidden; });

    function animate() {
      requestAnimationFrame(animate);
      if (paused) return;
      var t = clock.getElapsedTime();
      var d = reduce ? 0 : 1;
      
      // Gentle 3D sway for the planet object to showcase dynamic lighting curvature
      planetGroup.rotation.y = Math.sin(t * 0.35) * 0.06 * d;
      planetGroup.rotation.x = Math.cos(t * 0.28) * 0.04 * d;

      cage.rotation.y = t * 0.14 * d;
      cage.rotation.x = 0.18;
      orbits.rotation.y = t * 0.05 * d;
      moonList.forEach(function (m) {
        var a = m.phase + (reduce ? 0 : t * m.speed);
        var px = Math.cos(a) * m.rad, py = Math.sin(a) * m.rad;
        m.moon.position.set(px, py, 0);
        m.halo.position.set(px, py, 0);
      });
      renderer.render(scene, camera);
    }
    animate();
  }

  function makeDotTexture(T) {
    var s = 64, m = s / 2;
    var c = document.createElement('canvas'); c.width = c.height = s;
    var ctx = c.getContext('2d');
    var g = ctx.createRadialGradient(m, m, 0, m, m, m);
    g.addColorStop(0.0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,.85)');
    g.addColorStop(0.5, 'rgba(255,255,255,.25)');
    g.addColorStop(1.0, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(m, m, m, 0, Math.PI * 2); ctx.fill();
    var tex = new T.CanvasTexture(c); tex.needsUpdate = true; return tex;
  }

  // three.js may still be loading (deferred). Poll briefly.
  (function wait(n) {
    n = n || 0;
    if (window.THREE) { start(); return; }
    if (n > 200) { showFallback(); return; }
    setTimeout(function () { wait(n + 1); }, 50);
  })();
})();
