/* Scroll-driven 3D Geo-Dot Globe Hero
   Features clean non-overlapping continent coastline boundary lines, high-density land dots,
   and Europe to US flight arcs with continuous traveling particles. */
(function () {
  'use strict';

  var hero = document.getElementById('hero');
  if (!hero) return;

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function webglOK() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  if (!webglOK()) { hero.classList.add('is-fallback'); return; }
  if (reduceMotion) hero.classList.add('is-fallback');

  /* ── Constants ── */
  var ARC_COLOR = 0xA0006D;  // eggplant
  var BLUE_COLOR = 0x4A8BDF; // royal blue
  var R = 1.55;

  /* ── State ── */
  var T, renderer, scene, camera, globe, orbits, clock, raf;
  var markers = [], arcs = [], arcParticles = [], landDotMat, boundaryDotMat, oceanDotMat;
  var progress = 0;
  var cachedVH = 0;

  function getVH() {
    return (window.visualViewport ? window.visualViewport.height : 0) || window.innerHeight;
  }

  function smooth(x, a, b) {
    var t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  function latLng(lat, lng, r) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (lng + 180) * Math.PI / 180;
    return new T.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
       r * Math.cos(phi),
       r * Math.sin(phi) * Math.sin(theta)
    );
  }

  /* ── High-Precision Non-Overlapping Continent Coastlines ── */
  var CONTINENT_COASTLINES = [
    // Eurasia (Continuous perimeter from Europe through Russia, Asia, India, Middle East)
    [
      [71,-10],[71,40],[71,90],[71,140],[71,175],[60,170],[40,140],[22,114],[10,105],[1,104],[8,77],[15,73],[12,43],[12,44],[24,56],[30,48],[31,32],[36,35],[36,28],[36,-9],[43,-9],[48,-4],[54,6],[62,5],[71,-10]
    ],
    // North America
    [
      [72,-168],[71,-150],[69,-135],[68,-110],[60,-80],[62,-64],[47,-52],[44,-64],[41,-71],[35,-75],[25,-80],[25,-97],[18,-92],[15,-88],[8,-77],[9,-83],[16,-95],[20,-105],[30,-114],[34,-120],[48,-125],[60,-140],[65,-168],[72,-168]
    ],
    // South America
    [
      [12,-73],[10,-62],[8,-51],[-2,-44],[-8,-35],[-20,-38],[-33,-52],[-45,-64],[-55,-67],[-52,-75],[-42,-74],[-18,-71],[-4,-81],[0,-80],[8,-77],[12,-73]
    ],
    // Africa
    [
      [37,10],[35,-6],[28,-13],[15,-17],[4,-8],[-12,13],[-34,18],[-35,20],[-25,32],[-10,40],[11,51],[12,43],[28,34],[32,32],[37,10]
    ],
    // Australia
    [
      [-12,130],[-12,142],[-25,153],[-38,148],[-37,140],[-35,117],[-22,114],[-12,130]
    ],
    // UK & Ireland
    [
      [59,-4],[59,-1],[53,1],[50,-5],[54,-10],[59,-4]
    ],
    // Japan
    [
      [45,142],[40,140],[34,135],[31,130],[35,133],[43,145],[45,142]
    ],
    // Greenland
    [
      [83,-30],[76,-18],[60,-42],[60,-50],[70,-70],[83,-60],[83,-30]
    ]
  ];

  function inPoly(lat, lng, vs) {
    var x = lat, y = lng;
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0], yi = vs[i][1];
      var xj = vs[j][0], yj = vs[j][1];
      var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function isLand(lat, lng) {
    for (var c = 0; c < CONTINENT_COASTLINES.length; c++) {
      if (inPoly(lat, lng, CONTINENT_COASTLINES[c])) return true;
    }
    return false;
  }

  function makeArc(group, a, b, color, height) {
    var start = latLng(a.lat, a.lng, 1).normalize();
    var end = latLng(b.lat, b.lng, 1).normalize();
    var omega = start.angleTo(end);
    var sinO = Math.sin(omega) || 1;
    var SEG = 90;
    var pts = new Float32Array((SEG + 1) * 3);
    var curvePoints = [];

    for (var i = 0; i <= SEG; i++) {
      var t = i / SEG;
      var f1 = Math.sin((1 - t) * omega) / sinO;
      var f2 = Math.sin(t * omega) / sinO;
      var v = new T.Vector3(
        start.x * f1 + end.x * f2,
        start.y * f1 + end.y * f2,
        start.z * f1 + end.z * f2
      ).normalize().multiplyScalar(R * (1 + Math.sin(Math.PI * t) * height));
      pts[i * 3] = v.x; pts[i * 3 + 1] = v.y; pts[i * 3 + 2] = v.z;
      curvePoints.push(v);
    }
    var geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(pts, 3));
    geo.setDrawRange(0, 0);
    group.add(new T.Line(geo, new T.LineBasicMaterial({ color: color, transparent: true, opacity: 0.95 })));
    arcs.push({ geo: geo, count: SEG + 1 });

    var particleTex = makeParticleTexture(T);
    for (var pIdx = 0; pIdx < 2; pIdx++) {
      var pMat = new T.SpriteMaterial({
        map: particleTex,
        color: new T.Color(color),
        transparent: true,
        opacity: 0,
        blending: T.AdditiveBlending
      });
      var sprite = new T.Sprite(pMat);
      sprite.scale.set(0.18, 0.18, 1);
      group.add(sprite);
      arcParticles.push({
        sprite: sprite,
        curvePoints: curvePoints,
        speed: 0.25 + Math.random() * 0.15,
        offset: pIdx * 0.5 + Math.random() * 0.2
      });
    }
  }

  function init() {
    T = window.THREE;
    var canvas = document.getElementById('globe-canvas');
    if (!canvas || renderer) return;
    cachedVH = getVH();
    var w = canvas.clientWidth || window.innerWidth;
    var h = canvas.clientHeight || cachedVH;

    canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      hero.classList.add('is-fallback');
    }, false);

    renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x000000, 0);

    scene = new T.Scene();
    camera = new T.PerspectiveCamera(34, w / h, 0.1, 100);
    camera.position.set(0, 0, 7.4);

    scene.add(new T.AmbientLight(0xcfe2ff, 0.85));
    var dir = new T.DirectionalLight(0xffffff, 0.9); dir.position.set(-3, 4, 5); scene.add(dir);
    var rim = new T.DirectionalLight(0xa0006d, 0.5); rim.position.set(4, -2, -3); scene.add(rim);

    globe = new T.Group();
    globe.rotation.x = 0.38; // Pitch forward to bring Northern Hemisphere (Europe & US) into central view
    globe.rotation.z = 0.22; // Gentle axial tilt
    scene.add(globe);

    // atmosphere glow
    scene.add(new T.Mesh(
      new T.SphereGeometry(R * 1.12, 48, 48),
      new T.MeshBasicMaterial({ color: 0x4a8bdf, transparent: true, opacity: 0.07, side: T.BackSide })
    ));

    // dark core for silhouette
    globe.add(new T.Mesh(
      new T.SphereGeometry(R * 0.985, 48, 48),
      new T.MeshBasicMaterial({ color: 0x081a36, transparent: true, opacity: 0.55 })
    ));

    // ── 1. High-Resolution Interior Land Dots & Ocean Background ──
    var landPts = [], oceanPts = [];
    var stepLat = 1.4, stepLng = 1.4;

    for (var lat = -80; lat <= 80; lat += stepLat) {
      var rad = Math.cos(lat * Math.PI / 180);
      var lngStep = stepLng / Math.max(0.12, rad);
      for (var lng = -180; lng < 180; lng += lngStep) {
        var pt = latLng(lat, lng, R);
        if (isLand(lat, lng)) {
          landPts.push(pt.x, pt.y, pt.z);
        } else if (Math.random() < 0.06) {
          oceanPts.push(pt.x, pt.y, pt.z);
        }
      }
    }

    // High-Density Land Dots (Glowing Royal Blue)
    var landGeo = new T.BufferGeometry();
    landGeo.setAttribute('position', new T.Float32BufferAttribute(landPts, 3));
    landDotMat = new T.PointsMaterial({
      color: 0x6fa0e0,
      size: 0.024,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true
    });
    globe.add(new T.Points(landGeo, landDotMat));

    // Ambient Ocean Dots
    var oceanGeo = new T.BufferGeometry();
    oceanGeo.setAttribute('position', new T.Float32BufferAttribute(oceanPts, 3));
    oceanDotMat = new T.PointsMaterial({
      color: 0x1a457a,
      size: 0.015,
      transparent: true,
      opacity: 0.18,
      sizeAttenuation: true
    });
    globe.add(new T.Points(oceanGeo, oceanDotMat));

    // ── 2. Clean, Non-Overlapping Coastal Boundary Lines (White Dotted Coastlines) ──
    var boundPts = [];
    CONTINENT_COASTLINES.forEach(function (poly) {
      for (var i = 0; i < poly.length - 1; i++) {
        var p1 = poly[i], p2 = poly[i + 1];
        var dist = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
        var steps = Math.max(6, Math.floor(dist * 2.2));
        for (var s = 0; s <= steps; s++) {
          var tFactor = s / steps;
          var blat = p1[0] + (p2[0] - p1[0]) * tFactor;
          var blng = p1[1] + (p2[1] - p1[1]) * tFactor;
          var bpt = latLng(blat, blng, R * 1.003);
          boundPts.push(bpt.x, bpt.y, bpt.z);
        }
      }
    });

    var boundGeo = new T.BufferGeometry();
    boundGeo.setAttribute('position', new T.Float32BufferAttribute(boundPts, 3));
    boundaryDotMat = new T.PointsMaterial({
      color: 0xffffff,
      size: 0.028,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true
    });
    globe.add(new T.Points(boundGeo, boundaryDotMat));

    // orbit rings
    orbits = new T.Group(); scene.add(orbits);
    var ringColors = [0x4a8bdf, 0xa0006d, 0x6fa0e0];
    var ringTilts = [[0.4, 0, 0.2], [1.2, 0.5, 0], [0.8, -0.6, 0.5]];
    for (var k = 0; k < 3; k++) {
      var rr = 2.05 + k * 0.32, segs = 128, rpos = new Float32Array((segs + 1) * 3);
      for (var s = 0; s <= segs; s++) {
        var ang = (s / segs) * Math.PI * 2;
        rpos[s * 3] = Math.cos(ang) * rr; rpos[s * 3 + 1] = Math.sin(ang) * rr; rpos[s * 3 + 2] = 0;
      }
      var rgeo = new T.BufferGeometry();
      rgeo.setAttribute('position', new T.BufferAttribute(rpos, 3));
      var ring = new T.Line(rgeo, new T.LineBasicMaterial({ color: ringColors[k], transparent: true, opacity: 0.22 }));
      ring.rotation.set(ringTilts[k][0], ringTilts[k][1], ringTilts[k][2]);
      orbits.add(ring);
    }

    // starfield shell
    var SN = 320, spos = new Float32Array(SN * 3);
    for (var j = 0; j < SN; j++) {
      var sr = 4 + Math.random() * 4, u = Math.random() * 2 - 1, sa = Math.random() * Math.PI * 2, ss = Math.sqrt(1 - u * u);
      spos[j * 3] = Math.cos(sa) * ss * sr; spos[j * 3 + 1] = u * sr; spos[j * 3 + 2] = Math.sin(sa) * ss * sr;
    }
    var sgeo = new T.BufferGeometry();
    sgeo.setAttribute('position', new T.BufferAttribute(spos, 3));
    scene.add(new T.Points(sgeo, new T.PointsMaterial({ color: 0x9fc0ea, size: 0.02, transparent: true, opacity: 0.5 })));

    // City markers
    var cities = [
      { name: "Sofia", lat: 42.7, lng: 23.3, c: 0xffffff },
      { name: "London", lat: 51.5, lng: -0.12, c: 0x8fb8e8 },
      { name: "Delaware", lat: 39.68, lng: -75.75, c: 0xa0006d },
      { name: "Missouri", lat: 37.2, lng: -93.3, c: 0x4a8bdf }
    ];
    cities.forEach(function (ct) {
      var p = latLng(ct.lat, ct.lng, R * 1.01);
      var m = new T.Mesh(new T.SphereGeometry(0.03, 12, 12), new T.MeshBasicMaterial({ color: ct.c }));
      m.position.copy(p); globe.add(m);
      var halo = new T.Mesh(new T.SphereGeometry(0.06, 12, 12), new T.MeshBasicMaterial({ color: ct.c, transparent: true, opacity: 0.3 }));
      halo.position.copy(p); globe.add(halo); markers.push(halo);
    });

    // Europe to US Flight Arcs
    makeArc(globe, { lat: 42.7, lng: 23.3 }, { lat: 39.68, lng: -75.75 }, ARC_COLOR, 0.55); // Sofia -> Delaware
    makeArc(globe, { lat: 42.7, lng: 23.3 }, { lat: 37.2, lng: -93.3 }, BLUE_COLOR, 0.45);  // Sofia -> Missouri
    makeArc(globe, { lat: 51.5, lng: -0.12 }, { lat: 39.68, lng: -75.75 }, 0x8fb8e8, 0.38); // London -> Delaware

    clock = new T.Clock();
    onResize();
    animate();
  }

  function animate() {
    if (!renderer) return;
    raf = requestAnimationFrame(animate);
    onScroll();
    var t = clock.getElapsedTime();
    var p = progress;

    globe.rotation.y = -1.15 + t * 0.06 + p * Math.PI * 2.3;
    orbits.rotation.y = t * 0.04;
    orbits.rotation.x = Math.sin(t * 0.05) * 0.1;

    var wide = window.innerWidth > 900;
    scene.position.x = wide ? smooth(p, 0.42, 0.92) * 1.05 : 0;
    scene.position.y = wide ? 0 : 0.28 + smooth(p, 0, 0.6) * 1.4;
    globe.scale.setScalar(1 - smooth(p, 0.42, 0.92) * 0.12);

    var pulse = 1 + Math.sin(t * 2.2) * 0.18;
    markers.forEach(function (m) { m.scale.setScalar(pulse); });

    var ap = smooth(p, 0.05, 0.85);
    arcs.forEach(function (a) { a.geo.setDrawRange(0, Math.floor(ap * a.count)); });

    var textFade = smooth(p, 0.42, 0.88);
    if (landDotMat) landDotMat.opacity = 0.75 - textFade * 0.35;
    if (boundaryDotMat) boundaryDotMat.opacity = 0.95 - textFade * 0.4;
    if (oceanDotMat) oceanDotMat.opacity = 0.18 - textFade * 0.1;

    arcParticles.forEach(function (ap) {
      if (ap.curvePoints && ap.curvePoints.length > 0) {
        var progressT = ((t * ap.speed + ap.offset) % 1.0);
        var idx = Math.floor(progressT * (ap.curvePoints.length - 1));
        ap.sprite.position.copy(ap.curvePoints[idx]);
        ap.sprite.material.opacity = (ap.curvePoints.length > 0 && idx < ap.curvePoints.length * ap.curvePoints.length) ? (0.85 * Math.sin(progressT * Math.PI) * (1 - textFade * 0.5)) : 0;
      }
    });

    renderer.render(scene, camera);
  }

  function onScroll() {
    var rect = hero.getBoundingClientRect();
    var total = hero.offsetHeight - cachedVH;
    progress = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
    var p = progress;

    var intro = document.getElementById('hero-intro');
    var content = document.getElementById('hero-content');
    var cue = document.getElementById('scroll-cue');
    if (intro) {
      intro.style.opacity = 1 - smooth(p, 0.02, 0.32);
      intro.style.transform = 'translateY(' + (-smooth(p, 0.02, 0.4) * 50) + 'px)';
    }
    if (content) content.style.opacity = smooth(p, 0.46, 0.78);
    if (cue) cue.style.opacity = 1 - smooth(p, 0, 0.12);
  }

  function onResize() {
    if (!renderer) return;
    cachedVH = getVH();
    var canvas = document.getElementById('globe-canvas');
    var w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    var vHalf = Math.tan((camera.fov * Math.PI / 180) / 2);
    var FIT = 2.0;
    var BASE_Z = 7.4;
    camera.position.z = Math.max(BASE_Z, FIT / (vHalf * camera.aspect));
    camera.updateProjectionMatrix();
  }

  function makeParticleTexture(T) {
    var s = 64, m = s / 2;
    var c = document.createElement('canvas');
    c.width = c.height = s;
    var ctx = c.getContext('2d');
    var g = ctx.createRadialGradient(m, m, 0, m, m, m);
    g.addColorStop(0.0, 'rgba(255,255,255,1.0)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.8)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.2)');
    g.addColorStop(1.0, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(m, m, m, 0, Math.PI * 2); ctx.fill();
    var tex = new T.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  (function wait(n) {
    n = n || 0;
    if (window.THREE) { init(); return; }
    if (n > 160) { hero.classList.add('is-fallback'); return; }
    setTimeout(function () { wait(n + 1); }, 50);
  })();
})();
