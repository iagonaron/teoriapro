/* =====================================================================
   ESCENAS · Dodecafonismo (GP)
   Montado por pipe/escenas_build.py: utilidades comunes (_comun/) + escenas
   propias (dodecafonismo/escenas_cuerpo.js). Todo es función pura de t.
   Rosa = lo que se está explicando; el resto, blanco. «Mayor» con mayúscula,
   «menor» con minúscula; intervalos «3M», «3ªm», «5J», «4A», «5D».
   ===================================================================== */
(function () {
  'use strict';
  const N = window.NOTA, D = window.DIB, C = D.C;
  const { ramp, ease, eo, lerp, win, clamp, mezcla, texto, panel, chip, flecha, aspa, tick, pos, opa, color } = D;
  const SP = N.SP = 26;                    // tamaño único de toda la grafía (norma 7)
  const CX = 960;
  const S = window.SONIDOS || {};
  const ORO = C.rosa;

  let T = null;
  const esc = [];

  // ---------------------------------------------------------------- marcas de tiempo
  const F0 = id => T.frase[id] ? T.frase[id].t0 : (T.bloque[id] ? T.bloque[id].t0 : 0);
  const F1 = id => T.frase[id] ? T.frase[id].t1 : (T.bloque[id] ? T.bloque[id].t1 : 0);
  const limpia = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[¿?¡!.,;:…«»"()—–\-]/g, '');
  function Wd(id, pal, n) {
    const f = T.frase[id]; if (!f) { console.warn('frase no encontrada', id); return 0; }
    const p = limpia(pal); let k = 0;
    for (const [w, t] of f.palabras) if (limpia(w).startsWith(p)) { k++; if (k === (n || 1)) return t; }
    console.warn('palabra no encontrada', id, pal); return f.t0;
  }

  // ---------------------------------------------------------------- utilidades de escena
  function escena(nombre, a, b, build) {
    const g = N.group(document.getElementById('capaEscenas'), 'escena ' + nombre);
    const s = { nombre, a, b, g, tracks: [] };
    s.on = fn => s.tracks.push(fn);
    build(s, g);
    esc.push(s);
    return s;
  }
  function aparece(s, g, ta, tb, o) {
    o = o || {};
    const dy = o.dy != null ? o.dy : 14, fi = o.fi || .5, fo = o.fo || .5;
    const x0 = o.x || 0, y0 = o.y || 0, sc = o.s;
    s.on(t => {
      const v = win(t, ta, tb == null ? 1e9 : tb, fi, fo);
      opa(g, v);
      if (v > 0) pos(g, x0, y0 + (1 - eo(ramp(t, ta, ta + fi))) * dy, sc);
    });
  }
  function resalta(s, g, ta, tb, o) {
    o = o || {};
    const de = o.de || C.blanco, a = o.a || C.rosa, d = o.d || .35;
    s.on(t => {
      let k = ease(ramp(t, ta, ta + d));
      if (tb != null) k = Math.min(k, 1 - ease(ramp(t, tb, tb + d)));
      color(g, mezcla(de, a, k));
    });
  }
  function mostrarEn(s, g, ta, tb, fi, fo) { s.on(t => opa(g, win(t, ta, tb == null ? 1e9 : tb, fi || .35, fo || .35))); }
  /** «Pop»: aparece creciendo un poco desde su centro (cx, cy). */
  function pop(s, g, ta, tb, cx, cy, o) {
    o = o || {};
    const fi = o.fi || .35, fo = o.fo || .4, k0 = o.k0 != null ? o.k0 : .82;
    s.on(t => {
      const v = win(t, ta, tb == null ? 1e9 : tb, fi, fo); opa(g, v);
      if (v > 0) { const k = lerp(k0, 1, eo(ramp(t, ta, ta + fi))); g.setAttribute('transform', `translate(${cx},${cy}) scale(${k.toFixed(4)}) translate(${-cx},${-cy})`); }
    });
  }
  /** Trazo que se dibuja (pathLength = 1). Devuelve el path; progreso con trazoK(p, k). */
  function trazo(parent, d, o) {
    o = o || {};
    return N.el('path', { d, fill: o.fill || 'none', stroke: o.stroke || 'currentColor', 'stroke-width': o.w || 4,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 0 }, parent);
  }
  const trazoK = (p, k) => p.setAttribute('stroke-dashoffset', (1 - clamp(k)).toFixed(4));
  function dibuja(s, paths, t0, dur) { s.on(t => { const k = ramp(t, t0, t0 + dur); paths.forEach((p, i) => trazoK(p, clamp(k * paths.length - i))); }); }

  // ---------------------------------------------------------------- música: nombres y pentagramas
  const NOMBRE = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' };
  /** Nombre de nota en español con su alteración en Bravura: 'F#' → «Fa♯». */
  function nombreNota(parent, nota, x, y, o) {
    o = o || {};
    const size = o.size || 30;
    const g = N.group(parent, 'nombre');
    if (o.fill && o.fill !== 'currentColor') color(g, o.fill);   // la alteración (♯/♭) del mismo color que el nombre
    const letra = nota[0], alt = nota[1] === '#' ? 'accidentalSharp' : (nota[1] === 'b' ? 'accidentalFlat' : null);
    const t = texto(g, o.mayus ? NOMBRE[letra].toUpperCase() : NOMBRE[letra], 0, 0, { size, peso: o.peso || 700, fill: o.fill || 'currentColor' });
    const wt = D.medir(t);
    const sa = size * 0.36;                            // sp de la alteración para que case con la letra
    const wa = alt ? (N.M[alt].adv * sa + size * 0.06) : 0;
    if (alt) N.glyph(g, alt, wt + size * 0.06, -size * 0.33, sa);
    const w = wt + wa;
    const ax = o.anchor === 'middle' ? x - w / 2 : (o.anchor === 'end' ? x - w : x);
    g.setAttribute('transform', `translate(${ax.toFixed(1)},${y})`);
    g._w = w; g._x = ax;
    return g;
  }
  /** Pentagrama con clave de sol. Devuelve {g, x0 (primera x libre tras la clave), yMid}. */
  function pentaClave(parent, x, yMid, ancho, sp) {
    sp = sp || SP;
    const g = N.group(parent, 'penta');
    N.pentagrama(g, x, yMid, ancho, sp);
    N.claveSol(g, x + 0.6 * sp, yMid, sp);
    return { g, x0: x + 3.9 * sp, yMid, x, ancho };
  }
  function barra(parent, x, yMid, sp) { return N.line(parent, x, yMid - 2 * (sp || SP), x, yMid + 2 * (sp || SP), N.E.thinBar * (sp || SP)); }

  // ---------------------------------------------------------------- iconos vectoriales (línea fina, estética del Diario)
  function icoCancion(g, cx, cy, r) {           // disco con nota y ondas
    const G = N.group(g, 'ico');
    N.el('circle', { cx, cy, r, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 }, G);
    N.el('circle', { cx, cy, r: r * 0.16, fill: 'currentColor' }, G);
    for (const k of [0.55, 0.78]) N.el('path', { d: `M${cx - r * k * 0.7},${cy - r * k * 0.7} A${r * k},${r * k} 0 0 1 ${cx + r * k * 0.7},${cy - r * k * 0.7}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 3, opacity: .55 }, G);
    return G;
  }
  function icoEdificio(g, cx, cy, s) {          // conservatorio: frontón y columnas
    const G = N.group(g, 'ico');
    const w = 150 * s, h = 110 * s;
    N.el('path', { d: `M${cx - w / 2 - 10 * s},${cy - h / 2} L${cx},${cy - h / 2 - 48 * s} L${cx + w / 2 + 10 * s},${cy - h / 2} Z`, fill: 'none', stroke: 'currentColor', 'stroke-width': 4, 'stroke-linejoin': 'round' }, G);
    for (let i = 0; i < 5; i++) { const x = cx - w / 2 + 8 * s + i * (w - 16 * s) / 4; N.line(G, x, cy - h / 2 + 12 * s, x, cy + h / 2 - 12 * s, 6 * s, { 'stroke-linecap': 'round' }); }
    N.line(G, cx - w / 2 - 14 * s, cy + h / 2, cx + w / 2 + 14 * s, cy + h / 2, 5, { 'stroke-linecap': 'round' });
    N.line(G, cx - w / 2 - 4 * s, cy - h / 2 + 4 * s, cx + w / 2 + 4 * s, cy - h / 2 + 4 * s, 4, { 'stroke-linecap': 'round' });
    return G;
  }
  function icoNotas(g, cx, cy, s) {             // dos corcheas unidas
    const G = N.group(g, 'ico');
    s = s || 1;
    N.el('ellipse', { cx: cx - 22 * s, cy: cy + 22 * s, rx: 13 * s, ry: 9.5 * s, transform: `rotate(-20 ${cx - 22 * s} ${cy + 22 * s})`, fill: 'currentColor' }, G);
    N.el('ellipse', { cx: cx + 26 * s, cy: cy + 14 * s, rx: 13 * s, ry: 9.5 * s, transform: `rotate(-20 ${cx + 26 * s} ${cy + 14 * s})`, fill: 'currentColor' }, G);
    N.line(G, cx - 10 * s, cy + 20 * s, cx - 10 * s, cy - 30 * s, 4 * s); N.line(G, cx + 38 * s, cy + 12 * s, cx + 38 * s, cy - 38 * s, 4 * s);
    N.el('polygon', { points: `${cx - 12 * s},${cy - 30 * s} ${cx + 40 * s},${cy - 38 * s} ${cx + 40 * s},${cy - 26 * s} ${cx - 12 * s},${cy - 18 * s}`, fill: 'currentColor' }, G);
    return G;
  }
  function icoLupa(g, cx, cy, s) {
    const G = N.group(g, 'ico'); s = s || 1;
    N.el('circle', { cx: cx - 10 * s, cy: cy - 10 * s, r: 30 * s, fill: 'none', stroke: 'currentColor', 'stroke-width': 6 * s }, G);
    N.line(G, cx + 12 * s, cy + 12 * s, cx + 40 * s, cy + 40 * s, 9 * s, { 'stroke-linecap': 'round' });
    return G;
  }
  function icoCantar(g, cx, cy) {               // cara de perfil cantando
    const G = N.group(g, 'ico');
    N.el('circle', { cx, cy, r: 44, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 }, G);
    N.el('ellipse', { cx: cx + 16, cy: cy + 14, rx: 9, ry: 12, fill: 'currentColor' }, G);
    N.el('circle', { cx: cx + 12, cy: cy - 12, r: 4.5, fill: 'currentColor' }, G);
    const n = N.group(G); icoNotas(n, cx + 86, cy - 20, 0.55);
    return G;
  }
  function icoLira(g, cx, cy) {                 // lira (tocar)
    const G = N.group(g, 'ico');
    N.el('path', { d: `M${cx - 40},${cy - 40} C${cx - 58},${cy + 10} ${cx - 30},${cy + 46} ${cx},${cy + 48} C${cx + 30},${cy + 46} ${cx + 58},${cy + 10} ${cx + 40},${cy - 40}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 5, 'stroke-linecap': 'round' }, G);
    N.line(G, cx - 46, cy - 36, cx + 46, cy - 36, 5, { 'stroke-linecap': 'round' });
    for (let i = -2; i <= 2; i++) N.line(G, cx + i * 11, cy - 36, cx + i * 7, cy + 40, 2.2);
    return G;
  }
  function icoPajaro(g, cx, cy) {               // imitar: pájaro con notas
    const G = N.group(g, 'ico');
    N.el('path', { d: `M${cx - 50},${cy + 6} C${cx - 20},${cy - 30} ${cx + 10},${cy - 26} ${cx + 30},${cy - 4} L${cx + 52},${cy - 10} L${cx + 34},${cy + 6} C${cx + 16},${cy + 32} ${cx - 24},${cy + 34} ${cx - 50},${cy + 6} Z`, fill: 'none', stroke: 'currentColor', 'stroke-width': 5, 'stroke-linejoin': 'round' }, G);
    N.el('path', { d: `M${cx - 12},${cy - 4} C${cx},${cy - 40} ${cx + 16},${cy - 50} ${cx + 22},${cy - 58}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 4, 'stroke-linecap': 'round' }, G);
    N.el('circle', { cx: cx + 22, cy: cy - 8, r: 3.5, fill: 'currentColor' }, G);
    return G;
  }
  function icoPersonas(g, cx, cy) {             // transmitir: dos personas y una nota que pasa
    const G = N.group(g, 'ico');
    for (const dx of [-46, 46]) {
      N.el('circle', { cx: cx + dx, cy: cy - 24, r: 15, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 }, G);
      N.el('path', { d: `M${cx + dx - 26},${cy + 34} C${cx + dx - 24},${cy + 2} ${cx + dx + 24},${cy + 2} ${cx + dx + 26},${cy + 34}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 5, 'stroke-linecap': 'round' }, G);
    }
    const f = flecha(G, cx - 18, cy - 24, cx + 18, cy - 24, { w: 3.5, cab: 10 });
    return G;
  }
  function icoCasa(g, cx, cy, s) {
    const G = N.group(g, 'ico'); s = s || 1;
    N.el('path', { d: `M${cx - 34 * s},${cy - 2 * s} L${cx},${cy - 34 * s} L${cx + 34 * s},${cy - 2 * s} M${cx - 24 * s},${cy - 10 * s} L${cx - 24 * s},${cy + 30 * s} L${cx + 24 * s},${cy + 30 * s} L${cx + 24 * s},${cy - 10 * s}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 * s, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, G);
    N.el('rect', { x: cx - 7 * s, y: cy + 8 * s, width: 14 * s, height: 22 * s, rx: 2 * s, fill: 'currentColor' }, G);
    return G;
  }
  function icoOido(g, cx, cy, s) {
    const G = N.group(g, 'ico'); s = s || 1;
    N.el('path', { d: `M${cx - 14 * s},${cy + 30 * s} C${cx - 4 * s},${cy + 44 * s} ${cx + 22 * s},${cy + 36 * s} ${cx + 22 * s},${cy + 14 * s} C${cx + 22 * s},${cy - 2 * s} ${cx + 34 * s},${cy - 8 * s} ${cx + 34 * s},${cy - 24 * s} C${cx + 34 * s},${cy - 50 * s} ${cx - 26 * s},${cy - 52 * s} ${cx - 26 * s},${cy - 20 * s}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 * s, 'stroke-linecap': 'round' }, G);
    N.el('path', { d: `M${cx - 8 * s},${cy - 18 * s} C${cx - 6 * s},${cy - 32 * s} ${cx + 18 * s},${cy - 32 * s} ${cx + 16 * s},${cy - 14 * s}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 * s, 'stroke-linecap': 'round' }, G);
    return G;
  }
  function icoLapiz(g, cx, cy, s) {
    const G = N.group(g, 'ico'); s = s || 1;
    N.el('path', { d: `M${cx - 30 * s},${cy + 30 * s} L${cx - 22 * s},${cy + 8 * s} L${cx + 20 * s},${cy - 34 * s} L${cx + 34 * s},${cy - 20 * s} L${cx - 8 * s},${cy + 22 * s} Z M${cx - 22 * s},${cy + 8 * s} L${cx - 8 * s},${cy + 22 * s}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 4.5 * s, 'stroke-linejoin': 'round' }, G);
    return G;
  }
  function icoOjo(g, cx, cy, s) {
    const G = N.group(g, 'ico'); s = s || 1;
    N.el('path', { d: `M${cx - 60 * s},${cy} C${cx - 30 * s},${cy - 40 * s} ${cx + 30 * s},${cy - 40 * s} ${cx + 60 * s},${cy} C${cx + 30 * s},${cy + 40 * s} ${cx - 30 * s},${cy + 40 * s} ${cx - 60 * s},${cy} Z`, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 * s, 'stroke-linejoin': 'round' }, G);
    N.el('circle', { cx, cy, r: 17 * s, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 * s }, G);
    N.el('circle', { cx, cy, r: 6 * s, fill: 'currentColor' }, G);
    return G;
  }
  function interrogacion(g, cx, cy, size, fill) { return texto(g, '?', cx, cy, { anchor: 'middle', size, peso: 800, fill: fill || C.rosa }); }

  function chipNota(parent, n, o) {
    o = o || {};
    const G = N.group(parent, 'chipNota');
    const w = o.w || 118, h = o.h || 64;
    const r = N.el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 16, fill: C.panel, stroke: C.borde, 'stroke-width': 2 }, G);
    const t = nombreNota(G, n, 0, 11, { size: o.size || 30, anchor: 'middle', fill: C.blanco });
    G._r = r; G._t = t;
    return G;
  }
  function patronPuntos(parent, offs, x, y, ancho, colorP) {
    const G = N.group(parent, 'patron');
    const st = ancho / 12;
    N.line(G, x, y, x + ancho, y, 2, { stroke: C.tenue });
    offs.forEach(o => N.el('circle', { cx: x + o * st, cy: y, r: 9, fill: colorP || 'currentColor' }, G));
    return G;
  }

  // ---------------------------------------------------------------- utilidades propias de este vídeo
  /** Pentagrama grande con clave y armadura (n alteraciones de tipo '#'/'b'); cada alteración animable. */
  function pentaArm(parent, x, yM, ancho, n, tipo, sp) {
    sp = sp || SP;
    const P = pentaClave(parent, x, yM, ancho, sp);
    const A = N.armaduraGen(parent, P.x0 + 4, yM, sp, n, tipo);
    return { P, A, xLibre: P.x0 + 4 + A.w + 1.2 * sp };
  }
  /** Chip de tonalidad: «La M», «Mi♭ M», «Fa♯ m» (nota con su alteración en Bravura + M/m). */
  function chipTon(parent, nota, modo, x, y, o) {
    o = o || {};
    const W = N.group(parent, 'chipTon');
    const size = o.size || 34;
    const tmp = N.group(W);
    const MM = modo === 'menor' ? 'm' : 'M';
    const nn = nombreNota(tmp, nota, 0, 0, { size, peso: 800, fill: '#fff' });
    const tm = texto(tmp, MM, 0, 0, { size, peso: 800, fill: '#fff' });
    const wN = nn._w, wM = D.medir(tm), gap = size * 0.28, pad = size * 0.62;
    const w = wN + gap + wM + 2 * pad, h = size * 1.75;
    tmp.remove();
    const x0 = o.anchor === 'start' ? x : x - w / 2;
    N.el('rect', { x: x0, y: y - h / 2, width: w, height: h, rx: 14, fill: o.fondo || C.rosa, stroke: o.borde || 'none', 'stroke-width': 3 }, W);
    nombreNota(W, nota, x0 + pad, y + size * 0.36, { size, peso: 800, fill: o.color || '#fff' });
    texto(W, MM, x0 + pad + wN + gap, y + size * 0.36, { size, peso: 800, fill: o.color || '#fff' });
    W._w = w; W._h = h; W._x = x0;
    return W;
  }
  /** Tarjeta con título y cuerpo, para las reglas. */
  function regla(parent, x, y, w, h, titulo, colT) {
    const G = N.group(parent, 'regla');
    panel(G, x, y, w, h, { rx: 20 });
    if (titulo) texto(G, titulo, x + 30, y + 46, { size: 24, peso: 800, ls: '0.18em', fill: colT || C.rosa });
    return G;
  }
  function marca(parent, ok, x, y, r) { const G = N.group(parent); (ok ? tick : aspa)(G, x, y, r || 16, 6); color(G, ok ? C.verde : C.rojo); return G; }
  /** Flecha curva entre dos puntos (arco). */
  function arco(parent, x1, y1, x2, y2, curv, o) {
    o = o || {};
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - (curv || 40);
    const G = N.group(parent, 'arco');
    N.el('path', { d: `M${x1},${y1} Q${mx},${my} ${x2},${y2}`, fill: 'none', stroke: 'currentColor', 'stroke-width': o.w || 4, 'stroke-linecap': 'round' }, G);
    const ang = Math.atan2(y2 - my, x2 - mx), cab = o.cab || 13;
    const p = a => `${(x2 - Math.cos(ang + a) * cab).toFixed(1)},${(y2 - Math.sin(ang + a) * cab).toFixed(1)}`;
    N.el('polygon', { points: `${x2},${y2} ${p(0.45)} ${p(-0.45)}`, fill: 'currentColor' }, G);
    return G;
  }


  // ================================================================ (28-sep) utilidades comunes de las intros GE (intervalos, compases…)
  /** Pentagrama con clave de Fa. Devuelve {g, x0, yMid, x, ancho, clave}. */
  function pentaFa(parent, x, yMid, ancho, sp) {
    sp = sp || SP;
    const g = N.group(parent, 'penta');
    N.pentagrama(g, x, yMid, ancho, sp);
    N.claveFa(g, x + 0.6 * sp, yMid, sp);
    return { g, x0: x + 3.9 * sp, yMid, x, ancho, clave: 'fa' };
  }
  /** Sistema de piano: clave de Sol arriba (yS) y de Fa abajo (yS + sep), con llave y barra inicial. */
  function sistema(parent, x, yS, ancho, o) {
    o = o || {};
    const sp = o.sp || SP, sep = o.sep || 10 * sp;
    const g = N.group(parent, 'sistema');
    const sol = pentaClave(g, x, yS, ancho, sp);
    const fa = pentaFa(g, x, yS + sep, ancho, sp);
    N.line(g, x, yS - 2 * sp, x, yS + sep + 2 * sp, N.E.thinBar * sp);
    N.llave(g, x - 0.3 * sp, yS - 2 * sp, yS + sep + 2 * sp, sp);
    return { g, x0: sol.x0, yS, yF: yS + sep, sol, fa };
  }
  /** Altura (y) de una nota en un pentagrama (clave 'sol' por defecto o 'fa'). */
  const yNota = (n, yMid, clave, sp) => yMid - (clave === 'fa' ? N.posFa(n) : N.posSol(n)) * (sp || SP);
  /** Redonda en clave de sol o de fa. Devuelve {g, x, y, pos, cab, alt, w, cx} (cx = centro de la cabeza). */
  function nota(parent, n, x, yMid, o) {
    o = o || {};
    const r = N.redonda(parent, n, x, yMid, o.sp || SP, { clave: o.clave, cabeza: o.cabeza, alteracion: o.alteracion });
    r.cx = x + r.w / 2;
    return r;
  }
  /** Intervalo armónico (dos redondas en la misma vertical; la segunda se aparta si es una 2ª). */
  function intervaloArm(parent, n1, n2, x, yMid, o) {
    o = o || {};
    const G = N.group(parent, 'intervalo');
    const p1 = o.clave === 'fa' ? N.posFa(n1) : N.posSol(n1), p2 = o.clave === 'fa' ? N.posFa(n2) : N.posSol(n2);
    const a = nota(G, n1, x, yMid, o);
    const dx = Math.abs(p2 - p1) === 0.5 ? a.w * 0.98 : 0;
    const b = nota(G, n2, x + dx, yMid, o);
    return { g: G, a, b, x, cx: x + a.w / 2 + dx / 2 };
  }
  /** Etiqueta de intervalo en texto: «3M», «3ªm», «5J», «4A», «5D», «10M»… (norma: ª solo en los menores). */
  function etiquetaInt(parent, txt, x, y, o) {
    o = o || {};
    return texto(parent, txt, x, y, { anchor: o.anchor || 'middle', size: o.size || 44, peso: 800, fill: o.fill || C.rosa });
  }
  /** Chip de intervalo (rosa lleno por defecto; relleno:false = contorno). */
  function chipInt(parent, txt, x, y, o) {
    o = o || {};
    return chip(parent, txt, x, y, Object.assign({ size: 30, anchor: 'middle', ls: '0.04em' }, o));
  }
  /** Corchete vertical entre dos alturas (abierto hacia la izquierda). */
  function corchete(parent, x, y1, y2, o) {
    o = o || {};
    const G = N.group(parent, 'corchete');
    const d = o.d || 14;
    N.el('path', { d: `M${x - d},${y1} H${x} V${y2} H${x - d}`, fill: 'none', stroke: 'currentColor', 'stroke-width': o.w || 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, G);
    return G;
  }
  /** «Do–Mi», «Fa♯–Re»… (nombres con alteración en Bravura). Devuelve el grupo con _w. */
  function parNotas(parent, n1, n2, x, y, o) {
    o = o || {};
    const size = o.size || 34, fill = o.fill || C.blanco, peso = o.peso || 700;
    const G = N.group(parent, 'par');
    const a = nombreNota(G, n1, 0, y, { size, fill, peso });
    const gT = texto(G, '–', 0, y, { size, peso: 600, fill });
    const wg = D.medir(gT);
    const b = nombreNota(G, n2, 0, y, { size, fill, peso });
    const gap = size * 0.1;
    const w = a._w + gap + wg + gap + b._w;
    const x0 = o.anchor === 'start' ? x : (o.anchor === 'end' ? x - w : x - w / 2);
    a.setAttribute('transform', `translate(${x0.toFixed(1)},${y})`);
    gT.setAttribute('x', (x0 + a._w + gap).toFixed(1));
    b.setAttribute('transform', `translate(${(x0 + a._w + gap + wg + gap).toFixed(1)},${y})`);
    G._w = w; G._x = x0;
    return G;
  }
  /** Mueve un grupo de (0,0) a (dx,dy) entre ta y tb, con un arco lateral (curva) opcional. */
  function desliza(s, g, ta, tb, dx, dy, o) {
    o = o || {};
    const curva = o.curva || 0, hasta = o.hasta;
    s.on(t => {
      let k = ease(ramp(t, ta, tb));
      if (hasta != null) k = Math.min(k, 1 - ease(ramp(t, hasta, hasta + (o.vuelta || 0.5))));
      const x = dx * k + curva * Math.sin(Math.PI * k), y = dy * k;
      g.setAttribute('transform', `translate(${x.toFixed(2)},${y.toFixed(2)})`);
    });
  }
  /** Brillo breve (en rosa) de un grupo en los instantes ts (p. ej., cuando suena). */
  function destella(s, g, ts, o) {
    o = o || {};
    const d = o.d || 0.9, de = o.de || C.blanco, a = o.a || C.rosa;
    s.on(t => {
      let k = 0;
      for (const t0 of [].concat(ts)) k = Math.max(k, win(t, t0 - 0.05, t0 + d, .08, .5));
      color(g, mezcla(de, a, k));
    });
  }
  /** Cuenta 1·2·3… (números pequeños) sobre posiciones [{x,y}] a partir de los instantes ts. */
  function cuenta(s, parent, pts, ts, tb, o) {
    o = o || {};
    const G = N.group(parent, 'cuenta');
    pts.forEach((p, i) => {
      const n = texto(G, String((o.desde || 1) + i), p.x, p.y, { anchor: 'middle', size: o.size || 28, peso: 800, fill: o.fill || C.rosa });
      mostrarEn(s, n, ts[i], tb, .2, .3);
    });
    return G;
  }
  /** Fila de texto con viñeta para chuletas (se enciende en rosa mientras se explica). */
  function filaChuleta(s, parent, txt, x, y, ta, tb, tFin, o) {
    o = o || {};
    const G = N.group(parent);
    texto(G, txt, x, y, { size: o.size || 34, peso: o.peso || 700, fill: 'currentColor' });
    color(G, C.blanco);
    aparece(s, G, ta, tFin, { dy: 8 });
    if (tb) resalta(s, G, ta, tb, { d: .25 });
    return G;
  }
  /** Flecha curva «de lado» entre dos alturas (x fijo), abombada hacia la izquierda (dx < 0) o la derecha. */
  function arcoLado(parent, x, y1, y2, dx, o) {
    o = o || {};
    const G = N.group(parent, 'arcoLado');
    N.el('path', { d: `M${x},${y1} C${x + dx},${y1} ${x + dx},${y2} ${x},${y2}`, fill: 'none', stroke: 'currentColor', 'stroke-width': o.w || 3.5, 'stroke-linecap': 'round', 'stroke-dasharray': o.dash || null }, G);
    const cab = o.cab || 13, dir = dx < 0 ? 1 : -1;
    N.el('polygon', { points: `${x},${y2} ${x - dir * cab},${(y2 - cab * 0.45).toFixed(1)} ${x - dir * cab},${(y2 + cab * 0.45).toFixed(1)}`, fill: 'currentColor' }, G);
    return G;
  }

  // ================================================================ (28-sep, tarde) NORMAS DE IAGO · código estándar de todos los vídeos
  // TONO = arco redondo · SEMITONO = pico en V · SIEMPRE por DEBAJO de las notas (como en el Kit salvavidas).
  /** Punto de partida bajo la cabeza de una redonda creada con nota(): {x, y}. lado −1 = mitad izquierda, +1 = derecha. */
  function bajoCabeza(n, lado) {
    const w = n.w || 30;
    return { x: n.cx + (lado || 0) * w * 0.22, y: n.y + SP * 0.72 };
  }
  /** Tono entre dos puntos (bajo las cabezas): arco redondo por debajo. o.txt = rótulo bajo el arco («T», «1T»…). */
  function arcoTono(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const G = N.group(parent, 'tono');
    const prof = o.prof || Math.min(44, Math.max(16, Math.abs(x2 - x1) * 0.26));
    const mx = (x1 + x2) / 2, yb = Math.max(y1, y2) + prof;
    // cuadrática cuyo punto más bajo queda en yb
    const cy = 2 * yb - (y1 + y2) / 2;
    N.el('path', { d: `M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`, fill: 'none', stroke: 'currentColor', 'stroke-width': o.w || 3.2, 'stroke-linecap': 'round' }, G);
    if (o.txt) texto(G, o.txt, mx, yb + (o.dyTxt || 30), { anchor: 'middle', size: o.size || 24, peso: 800, fill: 'currentColor' });
    G._yb = yb;
    return G;
  }
  /** Semitono entre dos puntos (bajo las cabezas): pico en V por debajo. */
  function picoSemitono(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const G = N.group(parent, 'semitono');
    const prof = o.prof || Math.min(38, Math.max(14, Math.abs(x2 - x1) * 0.22));
    const mx = (x1 + x2) / 2, yb = Math.max(y1, y2) + prof;
    N.el('path', { d: `M${x1.toFixed(1)},${y1.toFixed(1)} L${mx.toFixed(1)},${yb.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`, fill: 'none', stroke: 'currentColor', 'stroke-width': o.w || 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'miter' }, G);
    if (o.txt) texto(G, o.txt, mx, yb + (o.dyTxt || 28), { anchor: 'middle', size: o.size || 24, peso: 800, fill: 'currentColor' });
    G._yb = yb;
    return G;
  }
  /** Tono ('T') o semitono ('st') entre dos redondas de nota(): siempre por debajo. o.txt opcional. */
  function distancia(parent, n1, n2, tipo, o) {
    const a = bajoCabeza(n1, +1), b = bajoCabeza(n2, -1);
    return (tipo === 'st' ? picoSemitono : arcoTono)(parent, a.x, a.y, b.x, b.y, o);
  }
  /** Movimiento de una nota (p. ej., cambio de octava al invertir): arco discontinuo con punta, como en el Kit.
   *  curv > 0 abomba hacia ARRIBA (por defecto). o.dash, o.w, o.cab. */
  function arcoMovimiento(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const G = N.group(parent, 'movimiento');
    const curv = o.curv != null ? o.curv : 70;
    const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - curv;
    N.el('path', { d: `M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`, fill: 'none', stroke: 'currentColor', 'stroke-width': o.w || 3, 'stroke-linecap': 'round', 'stroke-dasharray': o.dash || '9 8' }, G);
    const ang = Math.atan2(y2 - my, x2 - mx), cab = o.cab || 14;
    const p = a => `${(x2 - Math.cos(ang + a) * cab).toFixed(1)},${(y2 - Math.sin(ang + a) * cab).toFixed(1)}`;
    N.el('polygon', { points: `${x2.toFixed(1)},${y2.toFixed(1)} ${p(0.42)} ${p(-0.42)}`, fill: 'currentColor' }, G);
    G._curva = t => {   // punto de la curva en t∈[0,1] (para mover una cabeza por el arco)
      const u = 1 - t;
      return { x: u * u * x1 + 2 * u * t * mx + t * t * x2, y: u * u * y1 + 2 * u * t * my + t * t * y2 };
    };
    return G;
  }
  /** Cabeza rosa que VIAJA por un arco de movimiento entre ta y tb (y se queda en el destino).
   *  Úsala con arcoMovimiento(...)._curva. dib(G) dibuja la cabeza centrada en (0,0). */
  function viaja(s, G, curva, ta, tb) {
    s.on(t => {
      const k = ease(ramp(t, ta, tb));
      const p = curva(k);
      G.setAttribute('transform', `translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`);
    });
  }
  /** (28-sep, Iago) Los carteles que remiten a OTRO vídeo se pueden pulsar: abren ese vídeo en una pestaña nueva
   *  (y paran este). slug = carpeta del otro vídeo dentro de intros/ (p. ej. 'inversion-intervalos'). */
  function enlaceVideo(g, slug) {
    g.style.cursor = 'pointer';
    g.setAttribute('role', 'link'); g.setAttribute('tabindex', '0');
    g.setAttribute('aria-label', 'Abrir el vídeo en una pestaña nueva');
    const abre = ev => {
      ev.stopPropagation(); ev.preventDefault();
      const url = new URL('../' + slug + '/index.html', location.href).href;
      let w = null;
      try { w = window.open(url, '_blank'); } catch (e) { }
      if (w) { try { w.opener = null; } catch (e) { } }
      else { try { parent.postMessage({ intro: 'abrir', slug: slug, src: 'intros/' + slug + '/index.html' }, '*'); } catch (e) { } }
      try { if (document.body.classList.contains('sonando')) document.getElementById('botonPausa').click(); } catch (e) { }
    };
    g.addEventListener('click', abre);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') abre(e); });
    g.addEventListener('mouseenter', () => { g.style.filter = 'brightness(1.25)'; });
    g.addEventListener('mouseleave', () => { g.style.filter = ''; });
    return g;
  }
  /** Pequeño icono «abrir en pestaña nueva» (↗ en un cuadrado) para ponerlo en la esquina de esas tarjetas. */
  function icoAbrir(parent, x, y, sz) {
    sz = sz || 26;
    const G = N.group(parent, 'icoAbrir');
    N.el('rect', { x: x, y: y, width: sz, height: sz, rx: sz * 0.22, fill: 'none', stroke: 'currentColor', 'stroke-width': 2.4 }, G);
    N.el('path', { d: `M${x + sz * 0.35},${y + sz * 0.65} L${x + sz * 0.72},${y + sz * 0.28} M${x + sz * 0.42},${y + sz * 0.28} H${x + sz * 0.72} V${y + sz * 0.58}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, G);
    return G;
  }
  /** (29-sep, Iago) Cuando el vídeo nombra los APUNTES, el cartel se puede pulsar y los abre (el apartado exacto).
   *  Dentro del portal (el vídeo va en un marco): se lo pide al portal con postMessage y el portal abre sus apuntes
   *  (los mismos de «VER APUNTES»). Suelto (pestaña propia): abre el portal de esta misma web con ?apuntes=…
   *  temas = ids de los apuntes (p. ej. ['armadura']); nombre = título de la ventana de apuntes. */
  function enlaceApuntes(g, temas, nombre) {
    g.style.cursor = 'pointer';
    g.setAttribute('role', 'link'); g.setAttribute('tabindex', '0');
    g.setAttribute('aria-label', 'Abrir los apuntes: ' + (nombre || temas.join(', ')));
    const abre = ev => {
      ev.stopPropagation(); ev.preventDefault();
      try { if (document.body.classList.contains('sonando')) document.getElementById('botonPausa').click(); } catch (e) { }
      let dentro = false;
      try { dentro = window.parent && window.parent !== window; } catch (e) { dentro = true; }
      if (dentro) { try { parent.postMessage({ intro: 'apuntes', temas: temas, nombre: nombre || '' }, '*'); return; } catch (e) { } }
      const url = new URL('../../?apuntes=' + encodeURIComponent(temas.join(',')) + (nombre ? '&nombre=' + encodeURIComponent(nombre) : ''), location.href).href;
      let w = null;
      try { w = window.open(url, '_blank'); } catch (e) { }
      if (w) { try { w.opener = null; } catch (e) { } }
    };
    g.addEventListener('click', abre);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') abre(e); });
    g.addEventListener('mouseenter', () => { g.style.filter = 'brightness(1.25)'; });
    g.addEventListener('mouseleave', () => { g.style.filter = ''; });
    return g;
  }
  /** (29-sep, Iago) TARJETA DE ENLACE: la misma en todos los vídeos (la de «Inversión de intervalos» en «Intervalos»).
   *  Panel oscuro con contorno rosa · cuadrado rosa con su icono (▶ = vídeo; hoja = apuntes) · rótulo pequeño en rosa
   *  («VÍDEO» / «APUNTES») · título en blanco · ↗ en la esquina. Se pulsa entera.
   *  o = { tipo: 'video'|'apuntes', titulo, slug (vídeo) | temas + nombre (apuntes), rotulo?, centro?: true, w?, enlace?: false }
   *  (x, y) = esquina superior izquierda, o el centro si o.centro. Devuelve el grupo (con _w, _h, _cx, _cy). */
  function tarjetaEnlace(parent, x, y, o) {
    o = o || {};
    const V = N.group(parent, 'tarjetaEnlace');
    const h = 96, esApu = o.tipo === 'apuntes';
    const P = panel(V, 0, 0, 460, h, { rx: 18, stroke: C.rosa, sw: 2 });
    N.el('rect', { x: 22, y: 22, width: 52, height: 52, rx: 12, fill: C.rosa }, V);
    if (esApu) {
      N.el('path', { d: 'M37,33 h15 l9,9 v21 h-24 z M52,33 v9 h9', fill: 'none', stroke: '#fff', 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, V);
      for (let i = 0; i < 3; i++) N.line(V, 42, 48 + i * 5, 56, 48 + i * 5, 2, { stroke: '#fff', 'stroke-linecap': 'round' });
    } else {
      N.el('path', { d: 'M40,36 v24 l20,-12 z', fill: '#fff' }, V);
    }
    const r = texto(V, o.rotulo || (esApu ? 'APUNTES' : 'VÍDEO'), 94, 40, { size: 18, peso: 800, ls: '0.18em', fill: C.rosa });
    const tt = texto(V, o.titulo || '', 94, 72, { size: 28, peso: 800, fill: C.blanco });
    const w = Math.max(o.w || 0, 94 + Math.max(D.medir(r) + 50, D.medir(tt)) + 64);
    P.setAttribute('width', w.toFixed(0));
    if (o.enlace !== false) { const ia = icoAbrir(V, w - 40, 14, 26); color(ia, C.rosa); }   // enlace:false → misma tarjeta, sin ↗ ni clic
    const x0 = o.centro ? x - w / 2 : x, y0 = o.centro ? y - h / 2 : y;
    V.setAttribute('transform', `translate(${x0.toFixed(1)},${y0.toFixed(1)})`);
    if (o.enlace !== false) { if (esApu) enlaceApuntes(V, o.temas || [], o.nombre || o.titulo); else if (o.slug) enlaceVideo(V, o.slug); }
    V._w = w; V._h = h; V._cx = x0 + w / 2; V._cy = y0 + h / 2;
    const E = N.group(parent, 'tarjetaEnlaceCaja'); E.appendChild(V);    // envoltorio: para pop/aparece sin pisar el translate
    E._w = w; E._h = h; E._cx = V._cx; E._cy = V._cy;
    return E;
  }

  // ================================================================ (29-sep) ACORDES: redondas apiladas, etiquetas con línea guía y ejemplo sonoro
  /** Acorde de redondas apiladas (clave de sol), de abajo arriba: ['C4','Eb4','Gb4']. Las alteraciones se escalonan
   *  (columna nueva si la de encima está a menos de una sexta). Devuelve {g, x, notas:[{n, y, cx, w, g, alt}]}. */
  function acorde(parent, notas, x, yM) {
    const G = N.group(parent, 'acorde'), out = [];
    for (const n of notas) {
      const W = N.group(G, 'nota');
      const r = N.redonda(W, n, x, yM, SP, { alteracion: false });
      out.push({ n, y: r.y, pos: r.pos, cx: x + r.w / 2, w: r.w, g: W, alt: null });
    }
    const cols = [];
    for (let i = out.length - 1; i >= 0; i--) {
      const m = /^([A-G])([#bnxd]?)(\d)$/.exec(out[i].n); if (!m[2]) continue;
      const gl = { '#': 'accidentalSharp', b: 'accidentalFlat', n: 'accidentalNatural', x: 'accidentalDoubleSharp', d: 'accidentalDoubleFlat' }[m[2]];
      let c = 0; while (c < cols.length && cols[c] - out[i].pos < 3) c++;
      cols[c] = out[i].pos;
      const A = N.group(out[i].g, 'alteracion');
      N.glyph(A, gl, x - (N.M[gl].adv + 0.22) * SP - c * 1.2 * SP, out[i].y, SP);
      out[i].alt = A;
    }
    return { g: G, x, notas: out };
  }
  /** Etiqueta a la derecha del acorde, con una línea fina hasta su nota (para que no se pisen: cada una a su altura).
   *  Devuelve el grupo (texto + línea) en currentColor. */
  function etiquetaNota(parent, n, txt, xL, yL, o) {
    o = o || {};
    const G = N.group(parent, 'etiqueta');
    const x0 = n.cx + n.w / 2 + 8;
    N.el('path', { d: `M${x0},${n.y} L${xL - 44},${n.y} L${xL - 14},${yL - 13}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.8 }, G);
    if (typeof frase === 'function') frase(G, txt, xL, yL, { size: o.size || 42, peso: 800 }); else texto(G, txt, xL, yL, { size: o.size || 42, peso: 800, fill: 'currentColor' });
    return G;
  }
  /** Mientras suena un bloque (S[blq] = [nota1, nota2, …, plaqué]), cada nota se enciende en rosa con su ataque. */
  function suenaAcorde(s, ac, blq) {
    const ts = S[blq] || []; if (!ts.length) return;
    const tp = ts[ts.length - 1];
    ac.notas.forEach((n, i) => s.on(t => {
      const k = Math.max(win(t, (ts[i] || tp) - 0.03, (ts[i] || tp) + 0.35, .05, .25), win(t, tp - 0.03, tp + 1.1, .05, .4));
      color(n.g, mezcla(C.blanco, C.rosa, k));
    }));
  }
  /** Oído pequeño que late mientras suena el ejemplo. */
  function oido(s, g, x, y, blqs) {
    const O = N.group(g), Oi = N.group(O); icoOido(Oi, 0, 0, 0.9); color(Oi, C.rosa);
    O.setAttribute('transform', `translate(${x},${y})`);
    s.on(t => {
      let k = 0;
      for (const b of blqs) if (T.bloque[b]) k = Math.max(k, win(t, T.bloque[b].t0 - 0.1, T.bloque[b].t1, .2, .3));
      opa(O, k); Oi.setAttribute('transform', `scale(${(1 + 0.06 * Math.sin(t * 9) * k).toFixed(3)})`);
    });
  }

  // ================================================================ P4 · DODECAFONISMO (GP)
  const TITULO = { kicker: 'GRADO PROFESIONAL  ·  TEORÍA', lineas: ['DODECAFONISMO'], sub: 'La serie · P · R · I' };

  // ---------------------------------------------------------------- utilidades de este vídeo
  const ALT_GL = { '♭': 'accidentalFlat', '♯': 'accidentalSharp', '♮': 'accidentalNatural' };
  /** Línea de texto con ♭ ♯ ♮ de Bravura. segs = [[texto, color], …] */
  function frase(parent, segs, x, y, o) {
    o = o || {};
    const size = o.size || 36, peso = o.peso || 700, esp = size * 0.28;
    const G = N.group(parent, 'frase');
    if (typeof segs === 'string') segs = [[segs, o.fill || 'currentColor']];
    let cx = 0, prev = '';
    for (const [str, col] of segs) {
      for (const tr of str.split(/(♭|♯|♮)/u)) {
        if (!tr) continue;
        if (ALT_GL[tr]) {
          const gl = ALT_GL[tr], bem = tr === '♭', pegada = /[A-Za-zÁÉÍÓÚáéíóúñÑ0-9]$/.test(prev) || !!ALT_GL[prev];
          const sa = pegada ? size * 0.36 : size * (bem ? 0.31 : 0.29);
          const yo = pegada ? -size * 0.33 : (bem ? -0.7 * sa : -size * 0.36);
          const xg = cx + size * (pegada ? 0.05 : 0.02);
          const gg = N.group(G, 'alt'); if (col && col !== 'currentColor') color(gg, col);
          N.glyph(gg, gl, xg, yo, sa);
          cx = xg + N.M[gl].adv * sa + size * 0.05;
        } else {
          if (/^\s/.test(tr)) cx += esp;
          const core = tr.trim();
          if (core) { const t = texto(G, core, cx, 0, { size, peso, fill: col || 'currentColor', italic: o.italic, ls: o.ls }); cx += D.medir(t); }
          if (core && /\s$/.test(tr)) cx += esp;
        }
        prev = tr;
      }
    }
    const ax = o.anchor === 'middle' ? x - cx / 2 : (o.anchor === 'end' ? x - cx : x);
    G.setAttribute('transform', `translate(${ax.toFixed(1)},${y})`);
    G._w = cx; G._x = ax;
    return G;
  }
  function fraseG(parent, segs, x, y, o) { const w = N.group(parent); w._f = frase(w, segs, x, y, o); return w; }
  const aRGB = c => c[0] === '#' ? [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)] : c.match(/\d+/g).map(Number);
  const mezcla2 = (c1, c2, k) => { const a = aRGB(c1), b = aRGB(c2); return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * clamp(k))).join(',')})`; };

  // la serie del libro (P0) y sus formas (en clave de sol; las alteraciones, como en UN solo compás)
  const P0 = ['D4', 'Bb4', 'G4', 'Eb4', 'C4', 'Ab4', 'B4', 'A4', 'Gb4', 'E4', 'Db4', 'F4'];
  const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const midi = n => { const m = /^([A-G])([#b]?)(\d)$/.exec(n); return 12 * (+m[3] + 1) + SEMI[m[1]] + (m[2] === '#' ? 1 : (m[2] === 'b' ? -1 : 0)); };
  const NOMB = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const nom = m => NOMB[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
  const P5 = P0.map(n => nom(midi(n) + 5));
  const R0 = P0.slice().reverse();
  const I0 = (() => { const m0 = P0.map(midi), o = [m0[0]]; for (let i = 1; i < 12; i++) o.push(o[i - 1] - (m0[i] - m0[i - 1])); return o.map(nom); })();
  const GRAVE = n => midi(n) < 60;                  // por debajo del Do4: «demasiado grave»
  /** Nombres para escribir en UN compás: alteración solo cuando cambia; ♮ cuando hace falta. */
  function enCompas(ns) {
    const est = {};
    return ns.map(n => {
      const m = /^([A-G])([#b]?)(\d)$/.exec(n), k = m[1] + m[3], alt = m[2], vig = est[k] || '';
      est[k] = alt;
      return alt === vig ? m[1] + m[3] : m[1] + (alt || 'n') + m[3];
    });
  }
  const letra = n => n[0] + (n[1] === 'b' || n[1] === '#' ? n[1] : '');
  const XN = i => 381 + i * 110;                    // columna de cada nota (las 12 en un compás)
  /** Pentagrama de un compás (con doble barra final) y una serie de 12 redondas, cada una en su grupo. */
  function serie(parent, notas, yS, o) {
    o = o || {};
    const G = N.group(parent, 'serie');
    const pc = pentaClave(G, 240, yS, 1440);
    N.line(pc.g, 1662, yS - 2 * SP, 1662, yS + 2 * SP, N.E.thinBar * SP);                 // doble barra final (con el pentagrama)
    N.el('rect', { x: 1672, y: yS - 2 * SP, width: 8, height: 4 * SP, fill: 'currentColor' }, pc.g);
    const esc = enCompas(notas);
    const ns = esc.map((e, i) => {
      const W = N.group(G, 'n'); const r = nota(W, e, XN(i), yS);
      return { g: W, cx: r.cx, y: r.y, n: notas[i], e, r };
    });
    if (o.rotulo) { const R = N.group(G); texto(R, o.rotulo, 196, yS + 12, { anchor: 'end', size: 38, peso: 800, fill: C.rosa }); ns.rotulo = R; }
    return { g: G, pc, ns, yS };
  }
  /** Tira de etiquetas «X0 X1 … X11» (cada una en su grupo). */
  function tira(parent, L, y, color0) {
    return Array.from({ length: 12 }, (_, i) => {
      const G = N.group(parent); color(G, i === 0 ? (color0 || C.rosa) : C.blanco);
      const x = 285 + i * 123;
      N.el('rect', { x: x - 50, y: y - 30, width: 100, height: 56, rx: 10, fill: 'rgba(11,19,32,0.88)', stroke: 'currentColor', 'stroke-width': 2 }, G);
      texto(G, L + i, x, y + 11, { anchor: 'middle', size: 30, peso: 800, fill: 'currentColor' });
      G._x = x; return G;
    });
  }
  /** Una nota «vuela» desde (dx, dy) hasta su sitio entre ta y tb (y se queda). */
  function llega(s, g, ta, tb, dx, dy, fin) {
    s.on(t => {
      const v = win(t, ta, fin, .15, .35); opa(g, v); if (v <= 0) return;
      const k = ease(ramp(t, ta, tb)), y = (1 - k) * dy - Math.sin(Math.PI * k) * 60;
      g.setAttribute('transform', `translate(${((1 - k) * dx).toFixed(1)},${y.toFixed(1)})`);
    });
  }

  // ================================================================ A · la atonalidad, sus salidas y la regla de oro del dodecafonismo
  function escenaAtonal() {
    const a = F0('A1') - 0.2, b = F0('B1') - 0.25;
    escena('atonal', a, b, (s, g) => {
      const fin = b - 0.3, tA3 = F0('A3') - 0.3;
      // A1 · el portal de la atonalidad: formas de salirse de las reglas tonales
      const kv = tarjetaEnlace(g, CX, 170, { tipo: 'video', rotulo: 'PORTAL', titulo: 'La atonalidad', enlace: false, centro: true });
      pop(s, kv, Wd('A1', 'portal') - 0.3, tA3, CX, 170);
      const RT = N.group(g); color(RT, C.blanco);
      N.el('rect', { x: CX - 200, y: 470, width: 400, height: 120, rx: 20, fill: 'rgba(11,19,32,0.9)', stroke: 'currentColor', 'stroke-width': 3 }, RT);
      texto(RT, 'REGLAS TONALES', CX, 542, { anchor: 'middle', size: 34, peso: 800, ls: '0.1em', fill: 'currentColor' });
      aparece(s, RT, Wd('A1', 'reglas') - 0.5, tA3, { dy: 8 });
      const tSa = Wd('A1', 'salirse') - 0.2;
      const SAL = [[CX - 205, 505, CX - 480, 390], [CX - 205, 560, CX - 480, 690], [CX + 205, 505, CX + 480, 390], [CX + 205, 560, CX + 480, 690]];
      const FL = SAL.map(([x1, y1, x2, y2], i) => { const G = N.group(g); color(G, C.suave); flecha(G, x1, y1, x2, y2, { w: 4, cab: 18 }); mostrarEn(s, G, tSa + i * 0.12, tA3); return G; });
      const fo = fraseG(g, [['formas de ', C.blanco], ['salirse', C.rosa]], CX, 390, { size: 38, peso: 800, anchor: 'middle' });
      aparece(s, fo, tSa, tA3, { dy: 6 });
      // A2 · una de ellas, con series y normas muy estrictas: el dodecafonismo
      const tUna = Wd('A2', 'una') - 0.2, tDo = Wd('A2', 'dodecafonismo') - 0.3;
      resalta(s, FL[3], tUna, null, { de: C.suave, a: C.rosa });
      const kd = N.group(g); chip(kd, 'DODECAFONISMO', CX + 510, 760, { size: 32, anchor: 'middle' });
      pop(s, kd, tDo, tA3, CX + 510, 760);
      const sn = fraseG(g, [['series', C.rosa], [' y normas muy estrictas', C.blanco]], CX + 510, 842, { size: 28, peso: 700, anchor: 'middle' });
      aparece(s, sn, Wd('A2', 'series') - 0.2, tA3, { dy: 6 });
      // A3 · la regla de oro: los 12 sonidos de la escala cromática; ninguno se repite hasta que suenen los 12
      const kr = N.group(g); chip(kr, 'LA REGLA DE ORO', CX, 140, { size: 36, anchor: 'middle' });
      pop(s, kr, F0('A3') + 0.1, fin, CX, 140);
      const CROM = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
      const OX = CX, OY = 555, RX = 330, RY = 290;
      const tDoce = Wd('A3', 'doce') - 0.25, tRep = Wd('A3', 'repites') - 0.2, tSon = Wd('A3', 'sonado') - 0.2;
      const CI = CROM.map((n, i) => {
        const ang = -Math.PI / 2 + i * Math.PI / 6, x = OX + RX * Math.cos(ang), y = OY + RY * Math.sin(ang);
        const G = N.group(g); color(G, C.blanco);
        N.el('circle', { cx: x, cy: y, r: 50, fill: 'rgba(11,19,32,0.92)', stroke: 'currentColor', 'stroke-width': 3 }, G);
        nombreNota(G, n, x, y + 11, { size: 30, anchor: 'middle', fill: 'currentColor', peso: 800 });
        pop(s, G, tDoce + i * 0.06, fin, x, y, { k0: .6 });
        return { G, x, y };
      });
      const ORD = [2, 10, 7, 3, 0, 8, 11, 9, 6, 4, 1, 5];   // se encienden en un orden cualquiera (el de la serie del libro)
      const tFa = Wd('A4', 'favoritismos') - 0.3, tGu = Wd('A4', 'guste') - 0.3;
      const tEnc = ORD.map((_, k) => tRep + k * Math.max(0.12, (tSon + 0.5 - tRep) / 12));
      ORD.forEach((ci, k) => s.on(t => color(CI[ci].G, mezcla(C.blanco, C.rosa, win(t, tEnc[k], tFa, .12, .5)))));
      const CU = N.group(g);
      const numT = texto(CU, '', OX, OY + 34, { anchor: 'middle', size: 104, peso: 800, fill: C.rosa });
      s.on(t => { let n = 0; for (const te of tEnc) if (t >= te) n++; numT.textContent = String(Math.max(1, n)); opa(CU, win(t, tRep, tFa - 0.1, .2, .3)); });
      const doce = fraseG(g, [['12 sonidos', C.rosa], [' · ninguno se repite hasta que suenen los 12', C.blanco]], CX, 960, { size: 32, peso: 800, anchor: 'middle' });
      aparece(s, doce, tRep, tFa - 0.1, { dy: 6 });
      // A4 · sin favoritismos (todos iguales) · otra cosa es que te guste cómo suena
      const IG = N.group(g); texto(IG, '=', OX, OY + 36, { anchor: 'middle', size: 120, peso: 800, fill: C.rosa });
      aparece(s, IG, tFa, fin, { dy: 0 });
      const sf = fraseG(g, [['sin favoritismos', C.rosa], [': ninguno manda más que otro', C.blanco]], CX, 960, { size: 32, peso: 800, anchor: 'middle' });
      aparece(s, sf, tFa, tGu - 0.1, { dy: 6 });
      const gu = fraseG(g, [['…que te guste cómo suena, ya es otra cosa', C.suave]], CX, 960, { size: 32, peso: 700, italic: true, anchor: 'middle' });
      aparece(s, gu, tGu, fin, { dy: 6 });
      const O_ = N.group(g); icoOido(O_, CX + 470, 930, 0.8); color(O_, C.suave); aparece(s, O_, tGu + 0.2, fin, { dy: 6 });
    });
  }

  // ================================================================ B–C · la serie del libro (P0) y los tres avisos para construirla en el portal
  function escenaSerie() {
    const a = F0('B1') - 0.2, b = F0('V1') - 0.25;
    escena('serie', a, b, (s, g) => {
      const fin = b - 0.3, YS = 440;
      const tOr = Wd('B1', 'orden') - 0.3, tP0 = Wd('B2', 'p0') - 0.3, tLi = Wd('B3', 'libro') - 0.3, tC1 = F0('C1') - 0.1;
      const or = fraseG(g, [['el orden: ', C.blanco], ['lo decides tú', C.rosa]], CX, 150, { size: 40, peso: 800, anchor: 'middle' });
      aparece(s, or, tOr, tP0 - 0.1, { dy: 6 });
      const kp = N.group(g); chip(kp, 'P0 · TU SERIE PRINCIPAL', CX, 150, { size: 32, anchor: 'middle' });
      pop(s, kp, tP0, tLi - 0.1, CX, 150);
      const kl = N.group(g); chip(kl, 'P0 · EL EJEMPLO DEL LIBRO', CX, 150, { size: 32, anchor: 'middle' });
      pop(s, kl, tLi, tC1, CX, 150);
      const S0 = serie(g, P0, YS, { rotulo: 'P0' });
      color(S0.g, C.blanco);
      aparece(s, S0.pc.g, tOr + 0.2, fin, { dy: 8 });
      const TS = S.SON_P0 || [], LB = N.group(g);
      S0.ns.forEach((n, i) => {
        const tn = (TS[i] != null ? TS[i] : tLi + 0.5 + i * 0.45) - 0.08;
        pop(s, n.g, tn, fin, n.cx, n.y, { k0: .5 });
        destella(s, n.g, [tn + 0.08], { d: .7 });
        const L = N.group(LB); texto(L, String(i + 1), n.cx, YS - 108, { anchor: 'middle', size: 30, peso: 800, fill: C.suave });
        mostrarEn(s, L, tn, fin);
        const Nm = N.group(LB); nombreNota(Nm, letra(n.n), n.cx, YS + 132, { size: 26, anchor: 'middle', fill: C.blanco, peso: 700 });
        mostrarEn(s, Nm, tn + 0.05, fin);
      });
      if (S0.ns.rotulo) mostrarEn(s, S0.ns.rotulo, tP0, fin);
      // C1 · tres avisos para construirla en el portal
      const ka = N.group(g); chip(ka, 'PARA EL PORTAL: 3 AVISOS', CX, 150, { size: 32, anchor: 'middle' });
      pop(s, ka, tC1, fin, CX, 150);
      const AV = [
        ['C1', [['1 · ', C.rosa], ['un sonido y su enarmónico ', C.blanco], ['cuentan como el mismo', C.rosa]], F0('C3') - 0.2],
        ['C3', [['2 · ', C.rosa], ['todo en ', C.blanco], ['un solo compás', C.rosa], [': la alteración dura hasta el final', C.blanco]], F0('C5') - 0.2],
        ['C5', [['3 · ', C.rosa], ['nada de ', C.blanco], ['escalitas', C.rosa]], fin],
      ];
      AV.forEach(([fid, segs, hasta]) => { const G = fraseG(g, segs, CX, 960, { size: 32, peso: 800, anchor: 'middle' }); aparece(s, G, F0(fid) + 0.4, hasta, { dy: 6 }); });
      // aviso 1 · Sol♭ = Fa♯: el mismo sonido (la 9.ª nota)
      const n9 = S0.ns[8], tSo = Wd('C2', 'sol') - 0.25;
      resalta(s, n9.g, tSo, F0('C3') - 0.3);
      const EQ = fraseG(g, [['Sol♭', C.rosa], [' = ', C.blanco], ['Fa♯', C.rosa]], n9.cx, YS + 205, { size: 34, peso: 800, anchor: 'middle' });
      aparece(s, EQ, tSo, F0('C3') - 0.3, { dy: 6 });
      const ms = fraseG(g, [['el mismo sonido', C.suave]], n9.cx, YS + 250, { size: 24, peso: 700, italic: true, anchor: 'middle' });
      aparece(s, ms, Wd('C2', 'mismo') - 0.2, F0('C3') - 0.3, { dy: 4 });
      // aviso 2 · un solo compás: el ♭ del Si (2.ª nota) vale hasta el final… y hará falta un becuadro (7.ª)
      const tDos = Wd('C3', 'compas') - 0.3, tFin = Wd('C3', 'final') - 0.3, tBe = Wd('C4', 'becuadro') - 0.3, tC5 = F0('C5') - 0.3;
      const LL = N.group(g); color(LL, C.rosa);
      N.el('path', { d: `M${240},${YS - 2 * SP - 26} V${YS - 2 * SP - 40} H${1680} V${YS - 2 * SP - 26}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 4, 'stroke-linejoin': 'round' }, LL);
      aparece(s, LL, tDos, tC5, { dy: 0 });
      const uc = fraseG(g, [['1 compás', C.rosa]], 1700, YS - 2 * SP - 34, { size: 26, peso: 800 });
      aparece(s, uc, tDos, tC5, { dy: 4 });
      const n2 = S0.ns[1], n7 = S0.ns[6];
      if (n2.r.alt) resalta(s, n2.r.alt, tFin - 0.4, tC5);
      const DU = N.group(g); color(DU, C.rosa);
      N.el('path', { d: `M${n2.cx + 26},${YS} H${n7.cx - 58}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 3, 'stroke-dasharray': '10 9', 'stroke-linecap': 'round' }, DU);
      mostrarEn(s, DU, tFin, tC5, .5, .3);
      resalta(s, n7.g, tBe, tC5);
      [S0.ns[7], S0.ns[9]].forEach(n => resalta(s, n.g, tBe + 0.5, tC5, { a: '#f39ac4' }));   // (hex: mezcla() solo acepta hex)
      const bq = fraseG(g, [['♮', C.rosa], [' ¡no te olvides del becuadro!', C.rosa]], n7.cx, YS - 2 * SP - 110, { size: 30, peso: 800, anchor: 'middle' });
      aparece(s, bq, tBe, tC5, { dy: 6 });
      // aviso 3 · nada de escalitas: 4 notas por grado conjunto, en la misma dirección, suenan tonales
      const tTr = F0('C5') - 0.1, tCu = Wd('C6', 'cuatro') - 0.3, tAt = Wd('C6', 'atonal') - 0.3;
      s.on(t => { const k = 1 - 0.7 * win(t, tTr, fin + 1, .4, .3); opa(S0.g, k); opa(LB, k); });
      const EG = N.group(g); color(EG, C.blanco);
      const pe = pentaClave(EG, 610, 770, 700);
      const ESC = ['C4', 'D4', 'Eb4', 'F4'];
      const EN = ESC.map((n, i) => { const W = N.group(EG); const r = nota(W, n, 800 + i * 120, 770); return { W, r }; });
      aparece(s, EG, tCu, fin, { dy: 8 });
      EN.forEach((o, i) => mostrarEn(s, o.W, tCu + 0.2 + i * 0.25, fin));
      const ESCF = N.group(g); color(ESCF, C.rosa);
      flecha(ESCF, 790, 830, 1180, 740, { w: 3.5, cab: 14 });
      mostrarEn(s, ESCF, Wd('C6', 'direccion') - 0.3, fin);
      const X_ = N.group(g); color(X_, C.rojo); aspa(X_, 980, 770, 70, 9);
      mostrarEn(s, X_, tAt, fin, .15, .3);
      const nt = fraseG(g, [['suena ', C.blanco], ['demasiado tonal', C.rojo]], 980, 900, { size: 30, peso: 800, anchor: 'middle' });
      aparece(s, nt, tAt, fin, { dy: 6 });
      void pe;
    });
  }

  // ================================================================ V · siempre la misma serie… monótono: las variantes
  function escenaVariantes() {
    const a = F0('V1') - 0.2, b = F0('P1') - 0.25;
    escena('variantes', a, b, (s, g) => {
      const fin = b - 0.3, tV2 = F0('V2') - 0.2;
      const tVu = Wd('V1', 'vuelta') - 0.4, tMo = Wd('V1', 'monotono') - 0.3;
      // la serie, una y otra vez
      const VU = [];
      for (let k = 0; k < 5; k++) {
        const G = N.group(g); color(G, k ? C.suave : C.blanco);
        const x = 420 + k * 270;
        N.el('rect', { x: x - 90, y: 440, width: 180, height: 100, rx: 18, fill: 'rgba(11,19,32,0.9)', stroke: 'currentColor', 'stroke-width': 3 }, G);
        texto(G, 'P0', x, 508, { anchor: 'middle', size: 50, peso: 800, fill: 'currentColor' });
        if (k < 4) { const F = N.group(G); flecha(F, x + 100, 490, x + 170, 490, { w: 3.5, cab: 14 }); }
        pop(s, G, tVu + k * 0.35, tV2, x, 490, { k0: .7 });
        VU.push(G);
      }
      const ot = fraseG(g, [['una y otra vuelta…', C.blanco]], CX, 330, { size: 38, peso: 800, anchor: 'middle' });
      aparece(s, ot, tVu, tV2, { dy: 6 });
      const mo = fraseG(g, [['…bastante ', C.suave], ['monótono', C.rosa]], CX, 650, { size: 38, peso: 800, italic: true, anchor: 'middle' });
      aparece(s, mo, tMo, tV2, { dy: 6 });
      // V2 · variantes que salen de la misma serie
      const kv = N.group(g); chip(kv, 'LAS VARIANTES', CX, 200, { size: 36, anchor: 'middle' });
      pop(s, kv, Wd('V2', 'variantes') - 0.4, fin, CX, 200);
      const FOR = [['P', 'transportada'], ['R', 'retrógrada'], ['I', 'inversión'], ['RI', 'retrógrada de la inversión']];
      FOR.forEach(([L, d], i) => {
        const G = N.group(g); color(G, i < 3 ? C.blanco : C.suave);
        const x = 330 + i * 420;
        N.el('rect', { x: x - 170, y: 400, width: 340, height: 250, rx: 22, fill: 'rgba(11,19,32,0.9)', stroke: 'currentColor', 'stroke-width': 3 }, G);
        texto(G, L, x, 540, { anchor: 'middle', size: 110, peso: 800, fill: i < 3 ? C.rosa : 'currentColor' });
        const dd = d.length > 14 ? ['retrógrada', 'de la inversión'] : [d];
        dd.forEach((l, k) => texto(G, l, x, 606 + (k - (dd.length - 1) / 2) * 30, { anchor: 'middle', size: 26, peso: 700, fill: 'currentColor' }));
        pop(s, G, Wd('V2', 'variantes') + 0.1 + i * 0.25, fin, x, 525, { k0: .7 });
      });
    });
  }

  // ================================================================ P · transportar: la misma serie, n semitonos más arriba
  function escenaTransporte() {
    const a = F0('P1') - 0.2, b = F0('R1') - 0.25;
    escena('transporte', a, b, (s, g) => {
      const fin = b - 0.3, Y1 = 330, Y2 = 690;
      const kp = N.group(g); chip(kp, 'P · TRANSPORTAR', CX, 120, { size: 34, anchor: 'middle' });
      pop(s, kp, a + 0.2, fin, CX, 120);
      const A = serie(g, P0, Y1, { rotulo: 'P0' }); color(A.g, C.blanco);
      aparece(s, A.g, a + 0.1, fin, { dy: 8 });
      const tSu = Wd('P2', 'sumas') - 0.3, tCi = Wd('P2', 'cinco') - 0.3, tOb = Wd('P2', 'obtienes') - 0.2;
      const B = serie(g, P5, Y2, { rotulo: 'P5' }); color(B.g, C.blanco);
      aparece(s, B.pc.g, tCi, fin, { dy: 8 });
      if (B.ns.rotulo) mostrarEn(s, B.ns.rotulo, tOb, fin);
      const TP = S.P5 || [];
      B.ns.forEach((n, i) => {
        const tn = (TP[i] != null ? TP[i] : tOb + i * 0.16) - 0.05;
        llega(s, n.g, tn, tn + 0.45, A.ns[i].cx - n.cx, Y1 - Y2, fin);
      });
      const M5 = N.group(g); color(M5, C.rosa);
      flecha(M5, CX, Y1 + 100, CX, Y2 - 100, { w: 4, cab: 16 });
      texto(M5, '+5 semitonos', CX + 24, (Y1 + Y2) / 2 + 12, { anchor: 'start', size: 34, peso: 800, fill: 'currentColor' });
      aparece(s, M5, tCi, fin, { dy: 0 });
      const ms = fraseG(g, [['a todas las notas, ', C.blanco], ['los mismos semitonos', C.rosa]], CX, (Y1 + Y2) / 2 + 12, { size: 30, peso: 700, anchor: 'middle' });
      s.on(t => opa(ms, win(t, tSu, tCi - 0.1, .3, .3)));
      // P3 · cada número, un semitono más arriba: P0 … P11
      const tCa = Wd('P3', 'cada') - 0.3, tDo = Wd('P3', 'doce') - 0.3;
      const cs = fraseG(g, [['cada número = ', C.blanco], ['1 semitono', C.rosa], [' hacia arriba', C.blanco]], CX, 890, { size: 32, peso: 800, anchor: 'middle' });
      aparece(s, cs, tCa, tDo - 0.1, { dy: 6 });
      const TI = tira(g, 'P', 890);
      TI.forEach((G, i) => pop(s, G, tDo + i * 0.09, fin, G._x, 890, { k0: .6 }));
      resalta(s, TI[5], tDo + 0.9, fin);
    });
  }

  // ================================================================ R · retrógrada: la serie al revés (rebobinada)
  function escenaRetro() {
    const a = F0('R1') - 0.2, b = F0('I1') - 0.25;
    escena('retro', a, b, (s, g) => {
      const fin = b - 0.3, Y1 = 330, Y2 = 690;
      const kr = N.group(g); chip(kr, 'R · RETRÓGRADA', CX, 120, { size: 34, anchor: 'middle' });
      pop(s, kr, Wd('R1', 'retrograda') - 0.3, fin, CX, 120);
      const A = serie(g, P0, Y1, { rotulo: 'P0' }); color(A.g, C.blanco);
      aparece(s, A.g, a + 0.1, fin, { dy: 8 });
      const tRe = Wd('R1', 'reves') - 0.3;
      const B = serie(g, R0, Y2, { rotulo: 'R0' }); color(B.g, C.blanco);
      aparece(s, B.pc.g, tRe - 0.2, fin, { dy: 8 });
      if (B.ns.rotulo) mostrarEn(s, B.ns.rotulo, tRe + 1.4, fin);
      B.ns.forEach((n, j) => {
        const src = A.ns[11 - j], tn = tRe + j * 0.1;
        llega(s, n.g, tn, tn + 0.8, src.cx - n.cx, Y1 - Y2, fin);
      });
      const FL = N.group(g); color(FL, C.rosa);
      flecha(FL, 1600, 520, 400, 520, { w: 4, cab: 18 });
      texto(FL, 'al revés', CX, 500, { anchor: 'middle', size: 30, peso: 800, fill: 'currentColor' });
      aparece(s, FL, tRe, fin, { dy: 0 });
      // R2 · como si la rebobinas: ⏪ y suena al revés
      const RB = N.group(g); color(RB, C.rosa);
      [0, 1].forEach(k => N.el('path', { d: `M${1760 - k * 34},${Y2 - 26} l-34,26 l34,26 z`, fill: 'currentColor' }, RB));
      mostrarEn(s, RB, Wd('R2', 'rebobinas') - 0.3, fin);
      const TR = S.SON_R0 || [];
      B.ns.forEach((n, j) => { if (TR[j] != null) destella(s, n.g, [TR[j]], { d: .5 }); });
      // R3 · también transportadas: R0 … R11
      const tTr = Wd('R3', 'transportadas') - 0.3, tR0 = Wd('R3', 'r0') - 0.3, tDo = Wd('R3', 'doce') - 0.3;
      const TI = tira(g, 'R', 900);
      TI.forEach((G, i) => pop(s, G, (i < 3 ? tR0 + i * 0.55 : tDo) + (i >= 3 ? (i - 3) * 0.08 : 0), fin, G._x, 900, { k0: .6 }));
      const ts = fraseG(g, [['también ', C.blanco], ['transportadas', C.rosa]], CX, 810, { size: 30, peso: 800, anchor: 'middle' });
      aparece(s, ts, tTr, fin, { dy: 6 });
    });
  }

  // ================================================================ I · inversión: mismos intervalos, dirección contraria (y la octava da igual)
  function escenaInversion() {
    const a = F0('I1') - 0.2, b = F0('Q1') - 0.25;
    escena('inversion', a, b, (s, g) => {
      const fin = b - 0.3, Y1 = 320, Y2 = 690, tI3 = F0('I3') - 0.2;
      const ki = N.group(g); chip(ki, 'I · INVERSIÓN', CX, 120, { size: 34, anchor: 'middle' });
      pop(s, ki, Wd('I1', 'inversion') - 0.3, fin, CX, 120);
      // I2 · todo lo que sube, baja (y al revés): el espejo
      const tSu = Wd('I2', 'sube') - 0.3, tBa = Wd('I2', 'baja', 2) - 0.3, tMi = Wd('I2', 'mismos') - 0.3;
      const ES = N.group(g);
      const e1 = N.group(ES); color(e1, C.blanco); flecha(e1, 640, 620, 860, 420, { w: 6, cab: 26 });
      const e2 = N.group(ES); color(e2, C.rosa); flecha(e2, 1060, 420, 1280, 620, { w: 6, cab: 26 });
      const ml = N.group(ES); color(ml, C.suave); N.el('path', { d: `M${CX},380 V660`, stroke: 'currentColor', 'stroke-width': 3, 'stroke-dasharray': '10 10' }, ml);
      mostrarEn(s, e1, tSu, tI3); mostrarEn(s, ml, tSu + 0.3, tI3); mostrarEn(s, e2, tSu + 0.6, tI3);
      const sb = fraseG(g, [['lo que sube, ', C.blanco], ['baja', C.rosa]], CX, 760, { size: 36, peso: 800, anchor: 'middle' });
      aparece(s, sb, tSu, tBa - 0.1, { dy: 6 });
      const bs = fraseG(g, [['lo que baja, ', C.blanco], ['sube', C.rosa]], CX, 760, { size: 36, peso: 800, anchor: 'middle' });
      aparece(s, bs, tBa, tMi - 0.1, { dy: 6 });
      const mi = fraseG(g, [['mismos intervalos', C.blanco], [' · ', C.suave], ['dirección contraria', C.rosa]], CX, 760, { size: 36, peso: 800, anchor: 'middle' });
      aparece(s, mi, tMi, tI3, { dy: 6 });
      // I3 · en P0: de Re a Si♭ subimos 4 tonos (6ªm)
      const A = serie(g, P0, Y1, { rotulo: 'P0' }); color(A.g, C.blanco);
      s.on(t => A.ns.forEach((n, i) => { if (i > 1) opa(n.g, 1 - 0.65 * win(t, tI3, F0('I5') - 0.2, .3, .4)); }));
      const tSi = Wd('I3', 'si') - 0.3, tSx = Wd('I3', 'sexta') - 0.3;
      [0, 1].forEach(i => resalta(s, A.ns[i].g, tSi, F0('I5') - 0.2));
      const U = N.group(g); color(U, C.rosa);
      flecha(U, A.ns[0].cx + 20, A.ns[0].y - 40, A.ns[1].cx - 16, A.ns[1].y - 44, { w: 3.5, cab: 14 });
      texto(U, '4 tonos', (A.ns[0].cx + A.ns[1].cx) / 2 - 30, Y1 - 85, { anchor: 'middle', size: 26, peso: 800, fill: 'currentColor' });
      mostrarEn(s, U, tSi, F0('I5') - 0.2);
      const sx = N.group(g); etiquetaInt(sx, '6ªm', (A.ns[0].cx + A.ns[1].cx) / 2 + 80, Y1 - 85, { size: 30, fill: 'currentColor' }); color(sx, C.rosa);
      mostrarEn(s, sx, tSx, F0('I5') - 0.2);
      // I4 · en la inversión: desde Re bajamos 4 tonos → Sol♭ (grave, bajo el pentagrama)
      const B = serie(g, I0, Y2, { rotulo: 'I0' }); color(B.g, C.blanco);
      const tIn = F0('I4') - 0.2, tSo = Wd('I4', 'sol') - 0.3, tI5 = F0('I5') - 0.2, TI0 = S.SON_I0 || [];
      aparece(s, B.pc.g, tIn, fin, { dy: 8 });
      if (B.ns.rotulo) mostrarEn(s, B.ns.rotulo, tIn, fin);
      const T0 = B.ns.map((n, i) => i === 0 ? tIn + 0.3 : (i === 1 ? tSo : (TI0[i] != null ? TI0[i] - 0.05 : tI5 + i * 0.25)));
      B.ns.forEach((n, i) => { pop(s, n.g, T0[i], fin, n.cx, n.y, { k0: .5 }); if (TI0[i] != null && i > 1) destella(s, n.g, [TI0[i]], { d: .5 }); });
      [0, 1].forEach(i => resalta(s, B.ns[i].g, tSo, tI5 + 0.4));
      const Dn = N.group(g); color(Dn, C.rosa);
      flecha(Dn, B.ns[0].cx + 24, B.ns[0].y + 8, B.ns[1].cx - 18, B.ns[1].y - 8, { w: 3.5, cab: 14 });
      texto(Dn, '↓ 4 tonos', (B.ns[0].cx + B.ns[1].cx) / 2, 880, { anchor: 'middle', size: 26, peso: 800, fill: 'currentColor' });
      mostrarEn(s, Dn, Wd('I4', 'bajamos') - 0.3, tI5 + 0.4);
      const ii = fraseG(g, [['intervalo a intervalo', C.rosa]], CX, 560, { size: 30, peso: 800, anchor: 'middle' });
      aparece(s, ii, Wd('I5', 'intervalo') - 0.3, F0('I6') - 0.2, { dy: 6 });
      // I6–I7 · demasiado grave → súbela de octava (igual de correcto)
      const tGr = Wd('I6', 'grave') - 0.3, tSb = Wd('I7', 'subela') - 0.3, tCo = Wd('I7', 'correcto') - 0.3;
      const gr = B.ns.filter(n => GRAVE(n.n));
      gr.forEach((n, k) => {
        resalta(s, n.g, tGr, tCo + 1.2);
        const W = N.group(n.g.parentNode); W.appendChild(n.g);          // envoltorio: el «pop» de la nota sigue siendo suyo
        const lin = [...n.g.querySelectorAll('line')];                     // líneas adicionales: se van al subir
        const dy = -3.5 * SP, t1 = tSb + k * 0.18;
        s.on(t => { const kk = ease(ramp(t, t1, t1 + 0.7)); W.setAttribute('transform', `translate(0,${(dy * kk).toFixed(1)})`); lin.forEach(l => l.setAttribute('opacity', (1 - clamp(kk * 1.6)).toFixed(3))); });
      });
      const DG = fraseG(g, [['demasiado graves', C.rosa]], 1180, Y2 + 205, { size: 28, peso: 800, anchor: 'middle' });
      aparece(s, DG, tGr, tSb, { dy: 6 });
      const OC = fraseG(g, [['8ª ↑', C.rosa], ['  súbelas de octava', C.blanco]], 1180, Y2 + 205, { size: 28, peso: 800, anchor: 'middle' });
      aparece(s, OC, tSb, tCo - 0.1, { dy: 6 });
      const OK = N.group(g); color(OK, C.verde || '#22c55e'); tick(OK, 890, Y2 + 196, 18, 6);
      mostrarEn(s, OK, tCo, F0('I8') - 0.2);
      const ic = fraseG(g, [['igual de correcto', C.blanco]], 1060, Y2 + 205, { size: 28, peso: 800, anchor: 'middle' });
      aparece(s, ic, tCo, F0('I8') - 0.2, { dy: 6 });
      // I8–I9 · la altura exacta da igual: importa la relación
      const al = fraseG(g, [['la altura exacta ', C.blanco], ['da igual', C.rosa]], CX, Y2 + 205, { size: 30, peso: 800, anchor: 'middle' });
      aparece(s, al, Wd('I8', 'altura') - 0.3, F0('I9') - 0.1, { dy: 6 });
      const re = fraseG(g, [['lo que importa: ', C.blanco], ['la relación', C.rosa], [' (los intervalos)', C.suave]], CX, Y2 + 205, { size: 30, peso: 800, anchor: 'middle' });
      aparece(s, re, Wd('I9', 'relacion') - 0.4, F0('I10') - 0.2, { dy: 6 });
      // I10 · y también se transporta: I0 … I11
      const tTp = Wd('I10', 'transportes') - 0.4;
      s.on(t => opa(A.g, win(t, tI3, fin, .5, .4) * (1 - 0.8 * win(t, tTp, fin + 1, .3, .3))));
      const TI = tira(g, 'I', 450);
      TI.forEach((G, i) => pop(s, G, tTp + i * 0.08, fin, G._x, 450, { k0: .6 }));
    });
  }

  // ================================================================ Q · la cuarta, RI (que sepas que existe) · 4 × 12 = 48
  function escenaRI() {
    const a = F0('Q1') - 0.2, b = F0('E1') - 0.25;
    escena('ri', a, b, (s, g) => {
      const fin = b - 0.3, tQ3 = F0('Q3') - 0.2;
      const kr = N.group(g); chip(kr, 'RI · RETRÓGRADA DE LA INVERSIÓN', CX, 200, { size: 32, anchor: 'middle', fondo: '#64748b' });
      pop(s, kr, Wd('Q1', 'cuarta') - 0.3, tQ3, CX, 200);
      const fo = fraseG(g, [['I', C.rosa], [' leída ', C.blanco], ['al revés', C.rosa], ['  =  ', C.suave], ['RI', C.suave]], CX, 420, { size: 60, peso: 800, anchor: 'middle' });
      aparece(s, fo, Wd('Q1', 'ri') - 0.4, tQ3, { dy: 8 });
      const tTq = Wd('Q2', 'tranquilo') - 0.3, tEx = Wd('Q2', 'existe') - 0.3, tPr = Wd('Q2', 'preguntar') - 0.3;
      const tq = fraseG(g, [['tranquilo…', C.blanco]], CX, 600, { size: 40, peso: 800, italic: true, anchor: 'middle' });
      aparece(s, tq, tTq, tQ3, { dy: 6 });
      const ex = fraseG(g, [['basta con que sepas que ', C.blanco], ['existe', C.rosa]], CX, 680, { size: 40, peso: 800, anchor: 'middle' });
      aparece(s, ex, tEx, tQ3, { dy: 6 });
      const np = fraseG(g, [['no te la voy a preguntar', C.suave]], CX, 760, { size: 32, peso: 700, italic: true, anchor: 'middle' });
      aparece(s, np, tPr, tQ3, { dy: 6 });
      // Q3 · 4 formas × 12 transportes = 48 versiones
      const tCu = Wd('Q3', 'cuatro') - 0.3, tDo = Wd('Q3', 'doce') - 0.3, tCa = Wd('Q3', 'cuarenta') - 0.3, tAb = Wd('Q3', 'aburrirse') - 0.5;
      const FOR = ['P', 'R', 'I', 'RI'];
      FOR.forEach((L, i) => {
        const G = N.group(g); color(G, i < 3 ? C.rosa : C.suave);
        const x = 470 + i * 120;
        N.el('rect', { x: x - 52, y: 420, width: 104, height: 104, rx: 16, fill: 'rgba(11,19,32,0.9)', stroke: 'currentColor', 'stroke-width': 3 }, G);
        texto(G, L, x, 492, { anchor: 'middle', size: L.length > 1 ? 44 : 56, peso: 800, fill: 'currentColor' });
        pop(s, G, tCu + i * 0.12, fin, x, 472, { k0: .7 });
      });
      const f4 = fraseG(g, [['4 formas', C.blanco]], 650, 590, { size: 30, peso: 800, anchor: 'middle' }); aparece(s, f4, tCu + 0.3, fin, { dy: 4 });
      const x12 = N.group(g); texto(x12, '× 12', 1060, 500, { anchor: 'middle', size: 72, peso: 800, fill: C.blanco }); aparece(s, x12, tDo, fin, { dy: 6 });
      const t12 = fraseG(g, [['transportes', C.blanco]], 1060, 590, { size: 30, peso: 800, anchor: 'middle' }); aparece(s, t12, tDo + 0.2, fin, { dy: 4 });
      const e48 = N.group(g); texto(e48, '= 48', 1450, 500, { anchor: 'middle', size: 88, peso: 800, fill: C.rosa }); aparece(s, e48, tCa, fin, { dy: 6 });
      const v48 = fraseG(g, [['versiones de una misma serie', C.blanco]], 1450, 590, { size: 28, peso: 800, anchor: 'middle' }); aparece(s, v48, tCa + 0.2, fin, { dy: 4 });
      const ms = fraseG(g, [['material de sobra para no aburrirse', C.suave]], CX, 800, { size: 34, peso: 700, italic: true, anchor: 'middle' });
      aparece(s, ms, tAb, fin, { dy: 6 });
    });
  }

  // ================================================================ E · los tres ejercicios del portal
  function escenaEjercicios() {
    const a = F0('E1') - 0.2, b = F0('F1') - 0.25;
    escena('ejercicios', a, b, (s, g) => {
      const fin = b - 0.3;
      const ke = N.group(g); chip(ke, 'EJERCICIOS EN EL PORTAL', CX, 180, { size: 36, anchor: 'middle' });
      pop(s, ke, Wd('E1', 'ejercicios') - 0.3, fin, CX, 180);
      const EJ = [
        ['A · CONSTRUYE', 'tu serie', '12 sonidos sin repetir', Wd('E1', 'construir') - 0.3, Wd('E1', 'asegurandote') - 0.2],
        ['B · COMPLETA', 'una R o una I', 'a la que le faltan notas', Wd('E2', 'completar') - 0.3, Wd('E2', 'faltan') - 0.2],
        ['C · IDENTIFICA', '¿qué variante es?', 'la letra y el número', Wd('E3', 'identificar') - 0.3, Wd('E3', 'letra') - 0.2],
      ];
      EJ.forEach(([ti, l1, l2, t1, t2], i) => {
        const x = 440 + i * 520;
        const G = N.group(g); color(G, C.blanco);
        N.el('rect', { x: x - 220, y: 330, width: 440, height: 360, rx: 24, fill: 'rgba(11,19,32,0.9)', stroke: 'currentColor', 'stroke-width': 3 }, G);
        const K = N.group(G); chip(K, ti, x, 400, { size: 26, anchor: 'middle' });
        texto(G, l1, x, 530, { anchor: 'middle', size: 36, peso: 800, fill: 'currentColor' });
        pop(s, G, t1, fin, x, 510, { k0: .75 });
        const L2 = fraseG(g, [[l2, C.rosa]], x, 600, { size: 28, peso: 700, anchor: 'middle' });
        aparece(s, L2, t2, fin, { dy: 4 });
        resalta(s, G, t1, (i < 2 ? EJ[i + 1][3] : fin) - 0.1);
      });
      // ejemplos pequeños de cada uno: una serie, huecos, «R5»
      const ex1 = fraseG(g, [['1 · 2 · 3 … 12', C.suave]], 440, 650, { size: 26, peso: 700, anchor: 'middle' }); aparece(s, ex1, EJ[0][4] + 0.3, fin, { dy: 4 });
      const ex2 = fraseG(g, [['Fa · Re♭ · _ · Sol♭ · _ …', C.suave]], 960, 650, { size: 26, peso: 700, anchor: 'middle' }); aparece(s, ex2, EJ[1][4] + 0.3, fin, { dy: 4 });
      const ex3 = fraseG(g, [['P3 · R5 · I7…', C.suave]], 1480, 650, { size: 26, peso: 700, anchor: 'middle' }); aparece(s, ex3, EJ[2][4] + 0.3, fin, { dy: 4 });
    });
  }

  // ================================================================ F · repaso final: P · R · I (y RI)
  function escenaRepaso() {
    const a = F0('F1') - 0.2, b = T.acorde + 0.15;
    escena('repaso', a, b, (s, g) => {
      const fin = b - 0.3;
      const kr = N.group(g); chip(kr, 'REPASO FINAL', CX, 150, { size: 36, anchor: 'middle' });
      pop(s, kr, Wd('F1', 'repaso') - 0.3, fin, CX, 150);
      const P = N.group(g); panel(P, 210, 250, 1500, 640, { rx: 24 }); aparece(s, P, Wd('F1', 'repaso') - 0.1, fin, { dy: 0 });
      const FIL = [
        ['P', [['la serie: ', C.blanco], ['12 sonidos sin repetir', C.rosa]], [['transportada tantos semitonos como diga el número', C.suave]], F0('F2') - 0.2, F0('F4') - 0.2],
        ['R', [['retrógrada: ', C.blanco], ['al revés', C.rosa]], [['y el número, en su última nota', C.suave]], F0('F4') - 0.2, F0('F6') - 0.2],
        ['I', [['el espejo: ', C.blanco], ['cada intervalo, en dirección contraria', C.rosa]], null, F0('F6') - 0.2, F0('F7') - 0.2],
        ['RI', [['existe: ', C.suave], ['4 × 12 = 48 variantes', C.suave]], null, F0('F7') - 0.2, fin],
      ];
      FIL.forEach(([L, s1, s2, t1, t2], i) => {
        const y = 350 + i * 145;
        const G = N.group(g); color(G, L === 'RI' ? C.suave : C.rosa);
        texto(G, L, 330, y + 22, { anchor: 'middle', size: L.length > 1 ? 50 : 64, peso: 800, fill: 'currentColor' });
        aparece(s, G, t1, fin, { dy: 6 });
        const F1_ = fraseG(g, s1, 440, y + (s2 ? 6 : 16), { size: 36, peso: 800 }); aparece(s, F1_, t1 + 0.15, fin, { dy: 6 });
        if (s2) { const F2_ = fraseG(g, s2, 440, y + 56, { size: 28, peso: 700 }); aparece(s, F2_, (L === 'P' ? Wd('F3', 'transportar') : Wd('F4', 'numero')) - 0.3, fin, { dy: 4 }); }
      });
    });
  }

  const ORDEN = [escenaAtonal, escenaSerie, escenaVariantes, escenaTransporte, escenaRetro, escenaInversion, escenaRI, escenaEjercicios, escenaRepaso];

  // ================================================================ 0 · TÍTULO INICIAL (norma 5) y FINAL (norma 3): el título llega con el último acorde
  function tituloGrande(g) {
    const L = TITULO.lineas, n = L.length;
    const size = TITULO.size || (n > 1 ? 88 : 104);
    const y1 = n > 1 ? 452 : 528, paso = size * 1.08;
    texto(g, TITULO.kicker, CX, y1 - size - 32, { anchor: 'middle', size: 26, peso: 800, ls: '0.3em', fill: C.rosa });
    L.forEach((l, i) => {
      const t = texto(g, l, CX, y1 + i * paso, { anchor: 'middle', size, peso: 800, ls: '0.04em', fill: C.blanco });
      const w = D.medir(t); if (w > 1720) t.setAttribute('font-size', (size * 1720 / w).toFixed(1));
    });
    const yR = y1 + (n - 1) * paso + 38;
    N.el('rect', { x: CX - 60, y: yR, width: 120, height: 5, rx: 2.5, fill: C.rosa }, g);
    if (TITULO.sub) texto(g, TITULO.sub, CX, yR + 74, { anchor: 'middle', size: 38, peso: 400, fill: '#cbd5e1' });
  }
  function escenaTitulo() {
    const b = F1('TITULO');
    escena('titulo', -1, b, (s, g) => { const gg = N.group(g); tituloGrande(gg); s.on(t => opa(gg, 1 - ease(ramp(t, b - 1.2, b)))); });
  }
  function escenaFinal() {
    const ta = T.acorde;
    escena('final', ta - 0.5, T.dur + 9999, (s, g) => {
      const gg = N.group(g); tituloGrande(gg);
      s.on(t => { const k = t >= ta ? eo(ramp(t, ta, ta + 0.35)) : 0; opa(gg, k); gg.setAttribute('transform', `translate(${CX},540) scale(${(0.97 + 0.03 * k).toFixed(4)}) translate(${-CX},-540)`); });
    });
  }
  function veloFondo(t) {
    const tit = 1 - ease(ramp(t, F1('TITULO') - 1.0, F1('TITULO') + 0.3));
    const fin = ease(ramp(t, T.acorde - 0.05, T.acorde + 0.4));
    return clamp(0.72 - 0.19 * Math.max(tit, fin), 0, 0.92);
  }
  function construir(tiempos) {
    T = tiempos;
    esc.length = 0;
    const capa = document.getElementById('capaEscenas');
    while (capa.firstChild) capa.removeChild(capa.firstChild);
    escenaTitulo();
    for (const f of ORDEN) f();
    escenaFinal();
  }
  function pintar(t) {
    for (const s of esc) {
      const activa = t >= s.a - 0.05 && t <= s.b + 0.05;
      if (!activa) { if (s.g.style.display !== 'none') s.g.style.display = 'none'; continue; }
      s.g.style.display = '';
      for (const f of s.tracks) f(t);
    }
    const velo = document.getElementById('velo');
    if (velo) { const v = veloFondo(t).toFixed(3); if (velo._v !== v) { velo._v = v;   // (29-sep-2026) velo en su propia capa
      if (velo.tagName.toLowerCase() === 'rect') velo.setAttribute('opacity', v); else velo.style.opacity = v; } }
  }
  window.ESCENAS = { construir, pintar, get T() { return T; } };
})();
