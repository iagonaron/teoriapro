/* =====================================================================
   ESCENAS · Acordes avanzados (GP)
   Montado por pipe/escenas_build.py: utilidades comunes (_comun/) + escenas
   propias (acordes-avanzados/escenas_cuerpo.js). Todo es función pura de t.
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

  // ================================================================ P5 · ACORDES AVANZADOS · el cifrado americano (GP)
  const TITULO = { kicker: 'GRADO PROFESIONAL  ·  TEORÍA', lineas: ['ACORDES AVANZADOS'], sub: 'Cifrado americano · Tríadas · Cuatríadas' };

  // ---------------------------------------------------------------- disposición común de las escenas de acordes
  const XS = 500, YB = 640, SB = 150;        // símbolo grande: centro x, línea base y cuerpo de la letra
  const YM = 600, PX = 860, PW = 660;        // pentagrama de los diez acordes (todos sobre Re4)

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
  /** Palabra EXACTA (sin tildes ni puntuación), n-ésima vez que aparece en la frase. */
  function Wx(id, pal, n) {
    const f = T.frase[id]; if (!f) { console.warn('frase no encontrada', id); return 0; }
    const p = limpia(pal); let k = 0;
    for (const [w, t] of f.palabras) if (limpia(w) === p) { k++; if (k === (n || 1)) return t; }
    console.warn('palabra exacta no encontrada', id, pal, n); return f.t0;
  }
  /** Valor que cambia en los instantes dados, con transición suave de d s. keys = [[t, v], …]. */
  function pista(keys, d) {
    d = d || 0.45;
    return t => { let v = keys[0][1]; for (let i = 1; i < keys.length; i++) v += (keys[i][1] - keys[i - 1][1]) * ease(ramp(t, keys[i][0], keys[i][0] + d)); return v; };
  }
  /** Máximo de varias ventanas [[a, b], …] (entrada y salida suaves). */
  const ventanas = (t, L, fi, fo) => L.reduce((mx, [a, b]) => Math.max(mx, win(t, a, b, fi || .25, fo || .4)), 0);

  // ---------------------------------------------------------------- el cifrado americano, DIBUJADO (el subconjunto de Bravura no trae los csym)
  /** Métricas del cifrado según el cuerpo sz de la letra (Helvetica/Arial: altura de mayúscula ≈ 0,716). */
  function mS(sz) {
    const H = 0.716 * sz, r = 0.112 * sz, sw = 0.052 * sz;
    return { sz, H, g: 0.05 * sz, g2: 0.035 * sz, lw: 0.085 * sz, dw: 0.38 * sz, dy: -0.36 * sz,
      r, sw, cy: -H + r + sw / 2, tw: 0.36 * sz, th: 0.31 * sz, s7: 0.64 * sz, y7: -H + 0.716 * 0.64 * sz, sus: 0.5 * sz };
  }
  const f1 = v => v.toFixed(1);
  /** «-» a media altura de la letra (x = inicio). */
  const dGuion = (x, m) => `M${f1(x + m.lw / 2)},${f1(m.dy)} L${f1(x + m.dw - m.lw / 2)},${f1(m.dy)}`;
  /** Trazo vertical del «+» (cruza el guion por su centro). */
  const dVertical = (x, m) => `M${f1(x + m.dw / 2)},${f1(m.dy - m.dw / 2 + m.lw / 2)} L${f1(x + m.dw / 2)},${f1(m.dy + m.dw / 2 - m.lw / 2)}`;
  /** Circulito volado «°» (empieza arriba y da la vuelta). */
  const dCirculo = (x, m) => {   // dos medios arcos (un solo arco de 360° es ambiguo y el navegador puede dibujar el círculo de arriba)
    const cx = f1(x + m.r + m.sw / 2), r = f1(m.r), y0 = f1(m.cy - m.r), y1 = f1(m.cy + m.r);
    return `M${cx},${y0} A${r},${r} 0 0 1 ${cx},${y1} A${r},${r} 0 0 1 ${cx},${y0}`;
  };
  /** Barra del «ø» (círculo tachado). */
  const dBarra = (x, m) => { const cx = x + m.r + m.sw / 2, e = 1.45 * m.r; return `M${f1(cx - e)},${f1(m.cy + e)} L${f1(cx + e)},${f1(m.cy - e)}`; };
  /** Triángulo volado «Δ». */
  const dTriangulo = (x, m) => { const y0 = -m.H + m.sw / 2, y1 = -m.H + m.th; return `M${f1(x + m.tw / 2)},${f1(y0)} L${f1(x + m.tw)},${f1(y1)} L${f1(x)},${f1(y1)} Z`; };
  /** Cifrado estático: 'D', 'D-', 'D+', 'D°', 'Dsus4', 'D7', 'D-7', 'DΔ', 'Dø', 'D°7' (y lo mismo con otras letras).
   *  (x, yB) = inicio (o centro / final con o.anchor) y línea base. Letra y calidad en currentColor (o.colL / o.colQ).
   *  Devuelve el grupo con _w, _L, _Q, _wL (ancho de la letra) y _qx (donde empieza la calidad). */
  function simbolo(parent, spec, x, yB, sz, o) {
    o = o || {};
    const m = mS(sz), W = N.group(parent, 'cifrado');
    const L = N.group(W, 'letra'), Q = N.group(W, 'calidad');
    if (o.colL) color(L, o.colL); if (o.colQ) color(Q, o.colQ);
    const tl = texto(L, spec[0], 0, 0, { size: sz, peso: 800, fill: 'currentColor' });
    const wL = D.medir(tl);
    let cx = wL, rest = spec.slice(1), gap = m.g;
    const tr = (d, w) => N.el('path', { d, fill: 'none', stroke: 'currentColor', 'stroke-width': w.toFixed(2), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, Q);
    const c0 = rest[0];
    if (c0 === '-' || c0 === '+') { cx += gap; tr(dGuion(cx, m), m.lw); if (c0 === '+') tr(dVertical(cx, m), m.lw); cx += m.dw; rest = rest.slice(1); gap = m.g2; }
    else if (c0 === '°' || c0 === 'ø') {
      cx += gap; const off = c0 === 'ø' ? 0.45 * m.r : 0;
      tr(dCirculo(cx + off, m), m.sw); if (c0 === 'ø') tr(dBarra(cx + off, m), m.sw);
      cx += c0 === 'ø' ? 2.9 * m.r + m.sw : 2 * m.r + m.sw; rest = rest.slice(1); gap = m.g2;
    }
    else if (c0 === 'Δ') { cx += gap; tr(dTriangulo(cx, m), m.sw); cx += m.tw; rest = rest.slice(1); gap = m.g2; }
    else if (rest.startsWith('sus4')) { cx += 0.6 * gap; const t4 = texto(Q, 'sus4', cx, 0, { size: m.sus, peso: 700, fill: 'currentColor' }); cx += D.medir(t4); rest = rest.slice(4); gap = m.g2; }
    if (rest[0] === '7') { cx += gap; const t7 = texto(Q, '7', cx, m.y7, { size: m.s7, peso: 800, fill: 'currentColor' }); cx += D.medir(t7); }
    const ax = o.anchor === 'middle' ? x - cx / 2 : (o.anchor === 'end' ? x - cx : x);
    W.setAttribute('transform', `translate(${ax.toFixed(1)},${yB.toFixed(1)})`);
    W._w = cx; W._x = ax; W._L = L; W._Q = Q; W._wL = wL; W._qx = wL + m.g;
    return W;
  }
  /** Trazo (pathLength 1) con tramos de vida [[ta, tb, dur]]: se dibuja en [ta, ta+dur], se ve hasta tb y sale en 0,3 s. */
  function trazoTramos(s, p, tramos) {
    s.on(t => {
      let v = 0, k = 0;
      for (const [ta, tb, dur] of tramos) if (t >= ta && t <= tb + 0.3) { v = t <= tb ? 1 : 1 - ease(ramp(t, tb, tb + 0.3)); k = ease(ramp(t, ta, ta + dur)); }
      p.setAttribute('opacity', v.toFixed(3)); trazoK(p, k); p.style.display = (v <= 0.001 || k <= 0.001) ? 'none' : '';
    });
  }
  let nClip = 0;
  /** Grupo que «se escribe» de izquierda a derecha (recorte que se destapa). Caja (x0, y0, w, h) en coordenadas locales;
   *  tramos [[ta, tb, dur]] como en trazoTramos. */
  function escrito(s, parent, x0, y0, w, h, tramos) {
    const id = 'aavClip' + (nClip++);
    const cp = N.el('clipPath', { id }, N.el('defs', null, parent));
    const R = N.el('rect', { x: x0, y: y0, width: 0, height: h }, cp);
    const G = N.group(parent, 'escrito', { 'clip-path': `url(#${id})` });
    s.on(t => {
      let v = 0, k = 0;
      for (const [ta, tb, dur] of tramos) if (t >= ta && t <= tb + 0.3) { v = t <= tb ? 1 : 1 - ease(ramp(t, tb, tb + 0.3)); k = ramp(t, ta, ta + dur); }
      R.setAttribute('width', (w * k).toFixed(1)); opa(G, v);
    });
    return G;
  }
  // ---------------------------------------------------------------- llaves laterales y rótulos (como en «Acordes»)
  /** Camino de una llave a un lado del acorde, de y1 a y2: 'izq' «{» (punta a la izquierda) o 'der' «}». */
  function llaveD(x, y1, y2, lado, w) {
    w = w || 30; const s_ = lado === 'izq' ? -1 : 1;
    const xc = x + s_ * w * 0.5, xp = x + s_ * w, ym = (y1 + y2) / 2, r = Math.min(10, (y2 - y1) / 4);
    return `M${f1(x)},${f1(y1)} Q${f1(xc)},${f1(y1)} ${f1(xc)},${f1(y1 + r)} L${f1(xc)},${f1(ym - r)} Q${f1(xc)},${f1(ym)} ${f1(xp)},${f1(ym)} Q${f1(xc)},${f1(ym)} ${f1(xc)},${f1(ym + r)} L${f1(xc)},${f1(y2 - r)} Q${f1(xc)},${f1(y2)} ${f1(x)},${f1(y2)}`;
  }
  /** Texto sobre una pastilla oscura. lado 'izq': el texto acaba en x; 'der': empieza en x. */
  function pastilla(parent, txt, x, y, lado, o) {
    o = o || {};
    const G = N.group(parent, 'pastilla'), size = o.size || 40;
    const f = frase(G, txt, 0, 0, { size, peso: 800 }), w = f._w, h = size * 1.1, pad = 12;
    const x0 = lado === 'izq' ? x - w : x;
    f.setAttribute('transform', `translate(${x0.toFixed(1)},${(y + size * 0.36).toFixed(1)})`);
    G.insertBefore(N.el('rect', { x: x0 - pad, y: y - h / 2 - 2, width: w + 2 * pad, height: h + 4, rx: 12, fill: C.panel, 'fill-opacity': 0.92 }), f);
    G._w = w;
    return G;
  }
  /** Pastilla con un cifrado dentro (el rótulo de la tríada en las cuatríadas). */
  function pastillaSimb(parent, spec, x, y, lado, sz) {
    const G = N.group(parent, 'pastilla');
    const R = N.el('rect', {}, G);
    const sb = simbolo(G, spec, x, y + sz * 0.36, sz, { anchor: lado === 'izq' ? 'end' : 'start' });
    const w = sb._w, h = sz * 1.1, pad = 12, x0 = lado === 'izq' ? x - w : x;
    for (const [k, v] of Object.entries({ x: x0 - pad, y: y - h / 2 - 2, width: w + 2 * pad, height: h + 4, rx: 12, fill: C.panel, 'fill-opacity': 0.92 })) R.setAttribute(k, v);
    G._w = w;
    return G;
  }
  /** Rótulos que se relevan (fundido) junto a una llave. items = [[ta, tb, contenido, rosa?]]; contenido = texto o {simb};
   *  rosa = segundos en rosa al entrar (1,6 por defecto) o lista de ventanas. posf(t) → [x, y] del ancla. */
  function rotulos(s, parent, items, lado, posf, o) {
    o = o || {};
    return items.map(([ta, tb, c, ro]) => {
      const W = N.group(parent, 'rotulo'), In = N.group(W);
      const P = typeof c === 'string' ? pastilla(In, c, 0, 0, lado, { size: o.size || 40 }) : pastillaSimb(In, c.simb, 0, 0, lado, o.sizeS || 42);
      const VR = Array.isArray(ro) ? ro : [[ta, ta + (ro || 1.6)]];
      s.on(t => {
        const v = win(t, ta, tb, .3, .3); opa(W, v); if (v <= 0) return;
        const [x, y] = posf(t); W.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
        color(In, mezcla(C.blanco, C.rosa, ventanas(t, VR)));
      });
      W._P = P; W._VR = VR;
      return W;
    });
  }
  /** Nombres de las notas en casillas fijas (no bailan si cambia uno). ts = entrada de cada uno; tb = salida (o lista). */
  function nombresFila(s, parent, txts, cx, y, ts, tb, o) {
    o = o || {};
    const n = txts.length, paso = o.paso || 132, size = o.size || 38, G = N.group(parent, 'nombres');
    const TB = i => Array.isArray(tb) ? tb[i] : tb;
    txts.forEach((tx, i) => {
      if (!tx) return;
      const x = cx + (i - (n - 1) / 2) * paso;
      const W = fraseG(G, [[tx, 'currentColor']], x, y, { size, peso: 800, anchor: 'middle' });
      aparece(s, W, ts[i], TB(i), { dy: 6, fi: .3, fo: .3 });
      const fija = (o.rosa || []).includes(i);
      s.on(t => color(W, fija ? C.rosa : mezcla(C.blanco, C.rosa, win(t, ts[i], ts[i] + 0.9, .15, .4))));
      if (i > 0 && !o.sinPuntos) {
        const P = N.group(G); texto(P, '·', x - paso / 2, y, { anchor: 'middle', size, peso: 800, fill: C.suave });
        aparece(s, P, ts[i] - 0.05, Math.min(TB(i), TB(i - 1)), { dy: 0, fi: .3, fo: .3 });
      }
    });
    return G;
  }
  /** Fórmula centrada en cx: partes [{t: texto | s: cifrado, c: color, ta}]; cada una aparece en su ta y todas se van en tb. */
  function formula(s, parent, partes, cx, y, sz, tb) {
    const G = N.group(parent, 'formula'), gap = 0.26 * sz;
    const items = partes.map(p => {
      const W = N.group(G), In = N.group(W);
      let w;
      if (p.s) { const sb = simbolo(In, p.s, 0, 0, sz); w = sb._w; color(In, p.c || C.blanco); }
      else { const f = frase(In, [[p.t, p.c || C.blanco]], 0, 0, { size: sz, peso: p.peso || 800 }); w = f._w; }
      return { W, In, w, p };
    });
    const tot = items.reduce((acc, it) => acc + it.w, 0) + gap * (items.length - 1);
    let x = cx - tot / 2;
    items.forEach(it => { it.In.setAttribute('transform', `translate(${x.toFixed(1)},${y})`); x += it.w + gap; aparece(s, it.W, it.p.ta, tb, { dy: 6 }); });
    return G;
  }
  /** Línea centrada hecha de trozos que aparecen cada uno a su tiempo: partes = [[segs, ta], …]. */
  function lineaPartes(s, parent, partes, cx, y, tb, o) {
    o = o || {};
    const G = N.group(parent, 'linea'), fo = { size: o.size || 36, peso: o.peso || 800, italic: o.italic };
    const tz = partes.map(([segs]) => { const W = N.group(G); const f = frase(W, segs, 0, y, fo); return { W, f, w: f._w }; });
    const tot = tz.reduce((acc, z) => acc + z.w, 0); let x = cx - tot / 2;
    tz.forEach((z, i) => { z.f.setAttribute('transform', `translate(${x.toFixed(1)},${y})`); x += z.w; aparece(s, z.W, partes[i][1], tb, { dy: 6 }); });
    // (29-sep) mientras se construye, lo que ya se ve queda centrado: cada trozo nuevo empuja a los anteriores
    if (tz.length > 1) s.on(t => { let w = 0; tz.forEach((z, i) => { w += z.w * ease(ramp(t, partes[i][1], partes[i][1] + 0.4)); }); G.setAttribute('transform', `translate(${((tot - w) / 2).toFixed(1)},0)`); });
    G._tz = tz;
    return G;
  }
  /** Trozos de texto seguidos, cada uno en su grupo (para colorearlos aparte). Devuelve los grupos (con _w). */
  function trozos(parent, segs, x, y, o) {
    let cx = x;
    return segs.map(([tx, col]) => { const G = N.group(parent); const f = frase(G, [[tx, 'currentColor']], cx, y, o); color(G, col); cx += f._w; G._w = f._w; return G; });
  }

  // ================================================================ I · el cifrado americano: una letra y un símbolo (y en las canciones de internet)
  function escenaIntro() {
    const a = F0('I1') - 0.2, b = F0('L1') - 0.2;
    escena('intro', a, b, (s, g) => {
      const fin = b - 0.3, tHe = Wx('I2', 'de') - 0.1, tOut = tHe + 0.5;
      const wN = N.M.noteheadWhole.adv * SP;
      // I1 · CIFRADO AMERICANO: el acorde (Re Fa La Do) en su pentagrama…
      const yM = 550, px = 320, pw = 540;
      const k = N.group(g); chip(k, 'CIFRADO AMERICANO', CX, 270, { size: 36, anchor: 'middle' });
      pop(s, k, Wd('I1', 'cifrado') - 0.2, tOut, CX, 270);
      const PE = N.group(g); aparece(s, PE, Wd('I1', 'cifrado') - 0.1, tOut, { dy: 0 });
      pentaClave(PE, px, yM, pw);
      const xAc = Math.round((px + 3.9 * SP + px + pw) / 2 - wN / 2);
      const AC = acorde(PE, ['D4', 'F4', 'A4', 'C5'], xAc, yM);
      AC.notas.forEach((n, j) => pop(s, n.g, Wd('I1', 'americano') - 0.1 + j * 0.08, tOut, n.cx, n.y, { k0: .4 }));
      const lA = fraseG(g, [['acorde', C.blanco]], xAc + wN / 2, 745, { size: 40, peso: 800, anchor: 'middle' });
      aparece(s, lA, Wd('I1', 'acordes') - 0.15, tOut, { dy: 6 });
      // …y, «minimalista», su cifrado: las notas vuelan y se convierten en D-7
      const XSi = 1390, YBi = yM + 0.36 * 170, tMin = Wd('I1', 'minimalista') - 0.3;
      const SY = N.group(g); const sb = simbolo(SY, 'D-7', XSi, YBi, 170, { anchor: 'middle' });
      pop(s, SY, tMin + 0.55, tOut, XSi, yM, { k0: .6 });
      AC.notas.forEach((n, j) => {
        const F = N.group(g), Fi = N.group(F); N.glyph(Fi, 'noteheadWhole', -wN / 2, 0, SP); color(F, C.rosa);
        const t0 = tMin + j * 0.07, t1 = t0 + 0.75;
        s.on(t => {
          const v = t < t0 || t > t1 ? 0 : 1 - ease(ramp(t, t1 - 0.25, t1)); opa(F, v); if (v <= 0) return;
          const kk = ease(ramp(t, t0, t1)), x = lerp(n.cx, XSi, kk), y = lerp(n.y, yM, kk) - Math.sin(Math.PI * kk) * 80;
          F.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${lerp(1, 0.55, kk).toFixed(3)})`);
        });
      });
      const EQ = N.group(g); texto(EQ, '=', (px + pw + XSi - sb._w / 2) / 2, yM + 30, { anchor: 'middle', size: 90, peso: 700, fill: C.suave });
      aparece(s, EQ, tMin + 0.75, tOut, { dy: 0 });
      const lM = fraseG(g, [['minimalista', C.rosa]], XSi, 745, { size: 40, peso: 800, anchor: 'middle' });
      aparece(s, lM, tMin + 0.6, Wd('I2', 'consiste') - 0.1, { dy: 6 });
      lineaPartes(s, g, [[[['muy común en la ', C.blanco]], Wd('I1', 'muy') - 0.1], [[['música moderna', C.rosa]], Wd('I1', 'musica') - 0.1]], CX, 880, Wd('I2', 'consiste') - 0.1);
      // I2 · una LETRA y un SÍMBOLO: el cifrado se separa en sus dos partes (llave y rótulo bajo cada una)
      const tLe = Wx('I2', 'letra') - 0.15, tSm = Wx('I2', 'simbolo') - 0.15, SEP = 56;
      s.on(t => sb._Q.setAttribute('transform', `translate(${(SEP * ease(ramp(t, tLe - 0.25, tLe + 0.2))).toFixed(1)},0)`));
      const xL0 = sb._x, xQ0 = sb._x + sb._qx + SEP, xQ1 = sb._x + sb._w + SEP;
      const brk = (x0, x1, y) => `M${f1(x0)},${f1(y - 12)} L${f1(x0)},${f1(y)} L${f1(x1)},${f1(y)} L${f1(x1)},${f1(y - 12)}`;
      const parte = (x0, x1, txt, ta) => {
        const G = N.group(g);
        N.el('path', { d: brk(x0, x1, YBi + 34), fill: 'none', stroke: 'currentColor', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, G);
        texto(G, txt, (x0 + x1) / 2, YBi + 92, { anchor: 'middle', size: 38, peso: 800, fill: 'currentColor' });
        aparece(s, G, ta, tOut, { dy: 6 });
        return G;
      };
      const PL = parte(xL0 + 4, xL0 + sb._wL - 4, 'letra', tLe), PQ = parte(xQ0, xQ1, 'símbolo', tSm);
      s.on(t => {
        const kL = win(t, tLe, tSm, .2, .3), kQ = win(t, tSm, tOut, .2, .3);
        color(PL, mezcla(C.blanco, C.rosa, kL)); color(sb._L, mezcla(C.blanco, C.rosa, kL));
        color(PQ, mezcla(C.blanco, C.rosa, kQ)); color(sb._Q, mezcla(C.blanco, C.rosa, kQ));
      });
      // «si vas a buscar en Google una canción con sus acordes…»: buscador y la letra con sus acordes
      const tBu = Wx('I2', 'buscar') - 0.2, tAco = Wx('I2', 'acordes') - 0.15;
      // (el buscador aparece centrado y sube cuando llega la letra de la canción)
      const SBm = N.group(g), SBg = N.group(SBm); aparece(s, SBg, tBu, fin, { dy: 8 });
      s.on(t => SBm.setAttribute('transform', `translate(0,${(290 * (1 - ease(ramp(t, tAco - 0.35, tAco + 0.3)))).toFixed(1)})`));
      N.el('rect', { x: CX - 380, y: 206, width: 760, height: 86, rx: 18, fill: C.panel, stroke: 'rgba(248,250,252,0.35)', 'stroke-width': 2 }, SBg);
      const lu = N.group(SBg); icoLupa(lu, CX - 322, 252, 0.5); color(lu, C.suave);
      const tq = texto(SBg, '', CX - 272, 262, { size: 34, peso: 600, fill: C.blanco });
      const QQ = 'canción con acordes';
      s.on(t => { const n = Math.round(QQ.length * ramp(t, tBu + 0.25, tAco)); if (tq._n !== n) { tq._n = n; tq.textContent = QQ.slice(0, n); } });
      const CA = N.group(g); pop(s, CA, tAco, fin, CX, 580, { k0: .9 });
      panel(CA, 640, 330, 640, 500, { rx: 22 });
      texto(CA, 'LETRA Y ACORDES', 690, 386, { size: 20, peso: 800, ls: '0.22em', fill: C.suave });
      const LETRA = [
        [['D', 'Cae la tar'], ['B-', 'de sobre el mar,']],
        [['G', 'y tu voz vuel'], ['A7', 've a sonar.']],
        [['D', 'Canta con'], ['B-', 'migo esta can'], ['G', 'ción,']],
        [['A7', 'que no se ol'], ['D', 'vida el corazón.']],
      ];
      const SIM = [];
      LETRA.forEach((lin, i) => {
        const yl = 490 + i * 96; let x = 690;
        lin.forEach(([ch, tx]) => {
          const tt = texto(CA, tx, x, yl, { size: 34, peso: 500, fill: C.blanco });
          const Sy = N.group(CA); simbolo(Sy, ch, x, yl - 46, 32); SIM.push(Sy);
          x += D.medir(tt);
        });
      });
      // «…no te encuentres pentagramas» (tachado) «sino estos símbolos» (en rosa)
      const tPe = Wx('I2', 'pentagramas') - 0.3, tEs = Wx('I2', 'estos') - 0.1, tSi = Wx('I2', 'simbolos') - 0.2;
      const PG = N.group(g); aparece(s, PG, tPe, fin, { dy: 8 });
      const pg = pentaClave(PG, 170, 560, 300);
      N.melodia(PG, [{ p: 'G4', n: 'q' }, { p: 'B4', n: 'q' }, { p: 'D5', n: 'q' }], pg.x0 + 22, 560, { espacio: { q: 2.6 } });
      const tpg = texto(PG, 'pentagramas', 320, 690, { anchor: 'middle', size: 36, peso: 800, fill: C.blanco });
      const wpg = D.medir(tpg);
      const TX = N.group(g); color(TX, C.rosa);
      const px_ = trazo(TX, `M${f1(320 - wpg / 2 - 10)},${f1(678)} L${f1(320 + wpg / 2 + 10)},${f1(676)}`, { w: 5 });
      trazoTramos(s, px_, [[tPe + 0.45, fin, 0.35]]);
      s.on(t => opa(PG, win(t, tPe, fin, .3, .3) * (1 - 0.55 * ease(ramp(t, tPe + 0.5, tPe + 0.9)))));
      SIM.forEach((Sy, i) => s.on(t => color(Sy, mezcla(C.blanco, C.rosa, ease(ramp(t, tEs + i * 0.07, tEs + i * 0.07 + 0.3))))));
      const SL = N.group(g); color(SL, C.rosa); aparece(s, SL, tSi, fin, { dy: 6 });
      flecha(SL, 1505, 575, 1320, 575, { w: 4, cab: 16 });
      texto(SL, 'símbolos', 1610, 588, { anchor: 'middle', size: 40, peso: 800, fill: 'currentColor' });
      // I3 · así que… conviene saberlo
      lineaPartes(s, g, [[[['así que… ', C.suave]], Wx('I3', 'asi') - 0.1], [[['conviene ', C.blanco], ['saberlo', C.rosa]], Wx('I3', 'conviene') - 0.1]], CX, 912, fin);
    });
  }

  // ================================================================ L · las letras: de la A a la G (A = La… en este caso, el acorde de La)
  function escenaLetras() {
    const a = F0('L1') - 0.25, b = F0('T1') - 0.05;
    escena('letras', a, b, (s, g) => {
      const tVu = F1('L1') + 0.05, tLl = tVu + 0.85, fo = tVu + 0.45;
      const k = N.group(g); chip(k, 'LAS LETRAS', CX, 300, { size: 34, anchor: 'middle' });
      pop(s, k, Wd('L1', 'primero') + 0.1, fo, CX, 300);
      const LET = ['A', 'B', 'C', 'D', 'E', 'F', 'G'], NOM = ['La', 'Si', 'Do', 'Re', 'Mi', 'Fa', 'Sol'];
      const wT = 150, gap = 24, x0 = CX - (7 * wT + 6 * gap) / 2, yT = 510;
      const XT = i => x0 + wT / 2 + i * (wT + gap);
      const tMarcos = Wd('L1', 'letras') - 0.05, tA = Wx('L1', 'a') - 0.15, tPri = Wd('L1', 'primera') - 0.1;
      const tLa = Wx('L1', 'la', 5) - 0.1, tAc = Wx('L1', 'acorde') - 0.15, tRe = F1('L1') - 0.45;
      const FIG = LET.map((L, i) => {
        const G = N.group(g), x = XT(i);
        const R = panel(G, x - wT / 2, yT - wT / 2, wT, wT, { rx: 18, stroke: C.borde, sw: 2 });
        aparece(s, G, tMarcos + i * 0.05, fo, { dy: 8 });
        const Lg = N.group(G); texto(Lg, L, x, yT + 0.36 * 96, { anchor: 'middle', size: 96, peso: 800, fill: 'currentColor' });
        const tL = tA + i * 0.08;
        s.on(t => opa(Lg, i === 3 && t >= tVu ? 0 : ease(ramp(t, tL, tL + 0.25))));
        const Nm = fraseG(g, [[NOM[i], 'currentColor']], x, yT + wT / 2 + 62, { size: 40, peso: 800, anchor: 'middle' });
        aparece(s, Nm, i === 0 ? tLa : tLa + 0.2 + i * 0.12, fo - (i === 3 ? 0.2 : 0), { dy: 6 });
        const rosa = i === 0 ? [[tPri, tRe]] : (i === 3 ? [[tRe, b + 1]] : []);
        s.on(t => {
          const kk = ventanas(t, rosa, .3, .3);
          color(Lg, mezcla(C.blanco, C.rosa, kk)); color(Nm, mezcla(C.blanco, C.rosa, kk));
          R.setAttribute('stroke', kk > 0.02 ? mezcla('#3a4556', C.rosa, kk) : C.borde); R.setAttribute('stroke-width', (2 + kk).toFixed(2));
        });
        return { G, x };
      });
      lineaPartes(s, g, [[[['A', C.rosa], [' = ', C.suave]], tAc - 0.1], [[['acorde', C.rosa], [' de La', C.blanco]], tAc]], CX, 800, fo, { size: 42 });
      // la D vuela hasta su sitio de símbolo grande (todos los acordes del vídeo, sobre Re)
      const tmp = texto(g, 'D', 0, 0, { size: SB, peso: 800 }); const wD = D.medir(tmp); tmp.remove();
      const xF = XS - wD / 2, sc0 = 96 / SB, xD = XT(3) - wD * sc0 / 2, yD = yT + 0.36 * 96;
      const V = N.group(g); color(V, C.rosa); texto(V, 'D', xF, YB, { size: SB, peso: 800, fill: 'currentColor' });
      s.on(t => {
        if (t < tVu) { opa(V, 0); return; }
        opa(V, 1);
        const kk = ease(ramp(t, tVu, tLl)), cx = lerp(xD, xF, kk), cy = lerp(yD, YB, kk) - Math.sin(Math.PI * kk) * 40, sc = lerp(sc0, 1, kk);
        V.setAttribute('transform', `translate(${cx.toFixed(1)},${cy.toFixed(1)}) scale(${sc.toFixed(4)}) translate(${(-xF).toFixed(1)},${(-YB).toFixed(1)})`);
      });
      void FIG;
    });
  }

  // ================================================================ T · S · C · los diez acordes sobre Re: el mismo pentagrama se va transformando
  function escenaAcordes() {
    const a = F0('T1') - 0.3, b = F0('B1') - 0.2;
    escena('acordes', a, b, (s, g) => {
      const fin = b - 0.3, FIN = 1e9;
      const wN = N.M.noteheadWhole.adv * SP;
      const xAc = Math.round((PX + 3.9 * SP + PX + PW) / 2 - wN / 2), xMid = xAc + wN / 2;
      const yN = n => YM - N.posSol(n) * SP;
      const yD = yN('D4'), yF = yN('F4'), yG = yN('G4'), yA = yN('A4'), yC = yN('C5');
      const xR0 = xAc + wN + 10, yRb = yD + 0.62 * SP;
      // ---- tiempos (palabras exactas de la narración)
      const tLetra = Wx('T1', 'es') + 0.2, tAco = Wx('T1', 'acorde') - 0.1, t3a = Wx('T1', 'tercera') - 0.1, t5a = Wx('T1', 'quinta') - 0.1;
      const tGu = Wx('T2', 'guion') - 0.1, tMen = Wx('T2', 'menor') - 0.15;
      const tMa = Wx('T3', 'mas') - 0.1, tAum = Wx('T3', 'aumentado') - 0.15, t3c = Wx('T3', 'tercera') - 0.1, t5c = Wx('T3', 'quinta') - 0.1;
      const tCi = Wx('T4', 'circulito') - 0.1, tDis = Wx('T4', 'disminuido') - 0.15, t3d = Wx('T4', 'tercera') - 0.1, t5d = Wx('T4', 'quinta') - 0.1;
      const tQui = Wx('S1', 'quiza') - 0.1, tAnt = Wx('S1', 'anteriores') - 0.25, tSu = Wx('S1', 'sus4') - 0.25;
      const tNo = Wx('S1', 'hay') - 0.05, tLug = Wx('S1', 'lugar') - 0.05, t4J = Wx('S1', 'cuarta') - 0.1, t5s = Wx('S1', 'quinta') - 0.1;
      const tSus = Wx('S2', 'suspendido') - 0.15, tRes4 = Wx('S4', 'resolver') - 0.1;
      const RS = S.SON_SUSRES || [F0('SON_SUSRES') + 0.15, F0('SON_SUSRES') + 1.6], tRe = RS[1] - 0.05;
      const tCua = Wx('C1', 'cuatriadas') - 0.2, tUna = Wx('C1', 'triada') - 0.15, tMas1 = Wx('C1', 'mas') - 0.1, tSep = Wx('C1', 'septima') - 0.1, tRel = Wx('C1', 'relacion') - 0.15;
      const t7 = Wx('C2', 'd7') - 0.15, tMay2 = Wx('C2', 'mayor') - 0.15, tMas2 = Wx('C2', 'mas') - 0.1, tSe2 = Wx('C2', 'septima') - 0.1, tSm2 = Wx('C2', 'menor') - 0.1, tDom = Wx('C2', 'dominante') - 0.15;
      const tMe = Wx('C3', 'menor') - 0.15, tAm3 = Wx('C3', 'acorde') - 0.1, tC3 = Wx('C3', 'menor', 2) - 0.1, tSe3 = Wx('C3', 'septima', 2) - 0.1;
      const tAp = F0('C5') - 0.2, tVu = F1('C5') + 0.45;
      const tTr = Wx('C6', 'triangulo') - 0.15, tC6a = Wx('C6', 'mayor') - 0.1, tMas6 = Wx('C6', 'mas') - 0.1, tSe6 = Wx('C6', 'septima') - 0.1, tC6b = Wx('C6', 'mayor', 2) - 0.1;
      const tCc = Wx('C9', 'circulo') - 0.1, tTa = Wx('C9', 'tachado') - 0.1, tC9a = Wx('C9', 'disminuido') - 0.1, tSe9 = Wx('C9', 'septima') - 0.1, tC9b = Wx('C9', 'menor') - 0.1, tSemi = Wx('C9', 'semidisminuido') - 0.15;
      const tC7 = Wx('C10', 'circulito') - 0.1, tSi = Wx('C10', 'siete') - 0.15, tDi10 = Wx('C10', 'disminuido') - 0.1, tSe10 = Wx('C10', 'septima') - 0.1, tC10 = Wx('C10', 'disminuida') - 0.1;

      // todo lo principal va en M: se aparta durante el consejo (C5) y al final
      const M = N.group(g, 'principal');
      s.on(t => opa(M, (1 - win(t, tAp, tVu, .45, .45)) * (1 - ease(ramp(t, fin, b)))));

      // ---- fila de fichas arriba (las cinco tríadas; luego las cinco cuatríadas): la que se explica, en rosa
      const FX = i => 786 + i * 150, FY = 272;
      const fila = (rot, specs, tIn, tOut, tFill, tCur, dimF) => {
        const R = N.group(M, 'fila'); mostrarEn(s, R, tIn, tOut, .4, .4);
        texto(R, rot, FX(0) - 96, FY + 9, { anchor: 'end', size: 24, peso: 800, ls: '0.2em', fill: C.suave });
        return specs.map((sp, i) => {
          const x = FX(i);
          N.el('rect', { x: x - 66, y: FY - 42, width: 132, height: 84, rx: 14, fill: 'none', stroke: C.tenue, 'stroke-width': 2, 'stroke-dasharray': '7 7' }, R);
          const F = N.group(R, 'ficha'), Fi = N.group(F);
          const RR = N.el('rect', { x: x - 66, y: FY - 42, width: 132, height: 84, rx: 14, fill: C.panel, stroke: C.suave, 'stroke-width': 2.5 }, Fi);
          simbolo(Fi, sp, x, FY + 0.36 * 44, 44, { anchor: 'middle' });
          pop(s, Fi, tFill[i], null, x, FY, { k0: .7 });
          s.on(t => {
            const kk = ventanas(t, tCur[i], .3, .3);
            color(F, mezcla(C.blanco, C.rosa, kk)); RR.setAttribute('stroke', mezcla(C.suave, C.rosa, kk));
            if (dimF) opa(F, dimF(i, t));
          });
          return F;
        });
      };
      fila('TRÍADAS', ['D', 'D-', 'D+', 'D°', 'Dsus4'], a + 0.2, tCua + 0.2,
        [a + 0.4, tGu, tMa, tCi + 0.2, tSu + 0.1],
        [[[a + 0.4, tGu], [tRe, FIN]], [[tGu, tMa]], [[tMa, tCi]], [[tCi, tSu]], [[tSu, tRe]]],
        (i, t) => i === 4 ? 1 : 1 - 0.62 * win(t, tAnt, i === 0 ? tRe : FIN, .4, .4));
      const QM = N.group(M); texto(QM, '?', FX(4), FY + 17, { anchor: 'middle', size: 48, peso: 800, fill: C.rosa }); mostrarEn(s, QM, tQui, tSu + 0.15, .3, .25);
      fila('CUATRÍADAS', ['D7', 'D-7', 'DΔ', 'Dø', 'D°7'], tCua, FIN,
        [t7, tMe, tTr + 0.1, tCc + 0.1, tSi],
        [[[t7, tMe]], [[tMe, tTr]], [[tTr, tCc]], [[tCc, tC7]], [[tC7, FIN]]], null);

      // ---- el símbolo grande: una sola «D» que se va transformando (se recentra al crecer)
      const m = mS(SB);
      const WS = N.group(M, 'simbolo');
      const Lg = N.group(WS); const tDl = texto(Lg, 'D', 0, 0, { size: SB, peso: 800, fill: 'currentColor' });
      const wD = D.medir(tDl), q0 = wD + m.g, oO = 0.45 * m.r;
      const Qg = N.group(WS);
      const pGu = trazo(Qg, dGuion(q0, m), { w: m.lw }), pVe = trazo(Qg, dVertical(q0, m), { w: m.lw });
      const GCi = N.group(Qg), dxCi = pista([[0, oO], [tC7, 0]], 0.4);   // el círculo del ø vuelve a su sitio al quitar la barra (°7)
      s.on(t => GCi.setAttribute('transform', `translate(${dxCi(t).toFixed(2)},0)`));
      const pCiT = trazo(Qg, dCirculo(q0, m), { w: m.sw }), pCiC = trazo(GCi, dCirculo(q0, m), { w: m.sw });
      const pBa = trazo(Qg, dBarra(q0 + oO, m), { w: m.sw }), pTri = trazo(Qg, dTriangulo(q0, m), { w: m.sw });
      trazoTramos(s, pGu, [[tGu, tCi, 0.45], [tMe, tTr - 0.1, 0.45]]);      // «-» (y la raya del «+»)
      trazoTramos(s, pVe, [[tMa, tCi, 0.4]]);                               // «+»
      trazoTramos(s, pCiT, [[tCi + 0.2, tSu, 0.5]]);                        // «°»
      trazoTramos(s, pTri, [[tTr + 0.1, tCc - 0.05, 0.6]]);                 // «Δ»
      trazoTramos(s, pCiC, [[tCc, FIN, 0.5]]);                              // «ø» → «°7»
      trazoTramos(s, pBa, [[tTa, tC7, 0.35]]);
      const xSu = wD + 0.6 * m.g;
      const tm1 = texto(Qg, 'sus4', 0, 0, { size: m.sus, peso: 700 }); const wSu = D.medir(tm1); tm1.remove();
      const tm2 = texto(Qg, '7', 0, 0, { size: m.s7, peso: 800 }); const w7 = D.medir(tm2); tm2.remove();
      const ESu = escrito(s, Qg, xSu - 3, -m.H - 12, wSu + 8, m.H + 30, [[tSu + 0.1, tRe, 0.6]]);
      texto(ESu, 'sus4', xSu, 0, { size: m.sus, peso: 700, fill: 'currentColor' });
      const x7a = wD + m.g, x7b = q0 + m.dw + m.g2, x7c = q0 + 2 * m.r + m.sw + m.g2;
      const x7 = pista([[0, x7a], [tMe, x7b], [tSi - 0.6, x7c]], 0.4);
      const W7 = N.group(Qg);
      const E7 = escrito(s, W7, -3, m.y7 - 0.8 * m.s7, w7 + 8, 0.95 * m.s7, [[t7, tTr - 0.1, 0.35], [tSi, FIN, 0.35]]);
      texto(E7, '7', 0, m.y7, { size: m.s7, peso: 800, fill: 'currentColor' });
      s.on(t => W7.setAttribute('transform', `translate(${x7(t).toFixed(1)},0)`));
      const wDm = q0 + m.dw, wDs = xSu + wSu, wD7 = x7a + w7, wDm7 = x7b + w7, wDT = q0 + m.tw;
      const wDc = q0 + oO + 2 * m.r + m.sw, wDb = q0 + 2.9 * m.r + m.sw, wDo7 = x7c + w7, wDo = q0 + 2 * m.r + m.sw;
      const anchoS = pista([[0, wD], [tGu, wDm], [tCi, wDo], [tSu, wDs], [tRe, wD], [t7, wD7], [tMe, wDm7], [tTr, wDT], [tCc, wDc], [tTa, wDb], [tC7, wDo], [tSi, wDo7]], 0.45);
      s.on(t => {
        WS.setAttribute('transform', `translate(${(XS - anchoS(t) / 2).toFixed(1)},${YB})`);
        color(Lg, mezcla(C.blanco, C.rosa, win(t, a - 1, tLetra, .1, .45)));
        color(Qg, mezcla(C.blanco, C.rosa, ventanas(t, [[tGu, tGu + 2.6], [tMa, tMa + 2.4], [tCi, tCi + 2.6], [tSu, tSu + 3.0], [t7, t7 + 2.4], [tMe, tMe + 2.2], [tTr, tTr + 2.4], [tCc, tTa + 2.4], [tC7, tSi + 2.4]])));
      });
      // nombre de la tríada bajo el símbolo
      const nombreT = (txt, ta, tb) => { const G = fraseG(M, [[txt, 'currentColor']], XS, 732, { size: 44, peso: 800, anchor: 'middle' }); mostrarEn(s, G, ta, tb, .3, .3); s.on(t => color(G, mezcla(C.blanco, C.rosa, win(t, ta, ta + 1.8, .25, .4)))); return G; };
      nombreT('Mayor', Wx('T1', 'mayor') - 0.15, tGu + 0.1);         // (el nombre viejo se va en cuanto cambia el símbolo)
      nombreT('menor', tMen, tMa + 0.1);
      nombreT('aumentado', tAum, tCi + 0.1);
      nombreT('disminuido', tDis, tSu + 0.1);
      nombreT('suspendido', tSus, tRe);
      nombreT('Mayor', tRe, F0('C1') + 0.3);
      // cuatríadas: la fórmula (tríada + 7ª) y el nombre
      const FYc = 732, NYc = 808;
      formula(s, M, [{ t: 'tríada', c: C.blanco, ta: tUna }, { t: '+', c: C.suave, ta: tMas1, peso: 700 }, { t: '7ª', c: C.rosa, ta: tSep }], XS, FYc, 50, t7 - 0.1);
      formula(s, M, [{ t: '=', c: C.suave, ta: tMay2, peso: 700 }, { s: 'D', c: C.blanco, ta: tMay2 }, { t: '+', c: C.suave, ta: tMas2, peso: 700 }, { t: '7ªm', c: C.rosa, ta: tSe2 }], XS, FYc, 50, F0('C3') - 0.1);
      formula(s, M, [{ t: '=', c: C.suave, ta: tAm3, peso: 700 }, { s: 'D-', c: C.blanco, ta: tAm3 }, { t: '+', c: C.suave, ta: tSe3, peso: 700 }, { t: '7ªm', c: C.rosa, ta: tSe3 }], XS, FYc, 50, F0('C6') - 0.1);
      formula(s, M, [{ t: '=', c: C.suave, ta: tC6a, peso: 700 }, { s: 'D', c: C.blanco, ta: tC6a }, { t: '+', c: C.suave, ta: tMas6, peso: 700 }, { t: '7M', c: C.rosa, ta: tSe6 }], XS, FYc, 50, F0('C9') - 0.1);
      formula(s, M, [{ t: '=', c: C.suave, ta: tC9a, peso: 700 }, { s: 'D°', c: C.blanco, ta: tC9a }, { t: '+', c: C.suave, ta: tSe9, peso: 700 }, { t: '7ªm', c: C.rosa, ta: tC9b }], XS, FYc, 50, F0('C10') - 0.1);
      formula(s, M, [{ t: '=', c: C.suave, ta: tDi10, peso: 700 }, { s: 'D°', c: C.blanco, ta: tDi10 }, { t: '+', c: C.suave, ta: tSe10, peso: 700 }, { t: '7D', c: C.rosa, ta: tC10 }], XS, FYc, 50, FIN);
      const nombreC = (txt, ta, tb) => { const G = fraseG(M, [[txt, 'currentColor']], XS, NYc, { size: 34, peso: 800, anchor: 'middle' }); mostrarEn(s, G, ta, tb, .3, .3); s.on(t => color(G, mezcla(C.blanco, C.rosa, win(t, ta, ta + 1.8, .25, .4)))); return G; };
      nombreC('séptima de dominante', tDom, F0('C3') - 0.1);
      nombreC('menor séptima', Wx('C3', 're') - 0.1, F0('C6') - 0.1);
      nombreC('Mayor séptima', tC6b + 0.1, F0('C9') - 0.1);
      nombreC('semidisminuido', tSemi, F0('C10') - 0.1);
      nombreC('séptima disminuida', tC10 + 0.1, FIN);

      // ---- el pentagrama y las cuatro notas (Re · 3ª · 5ª · 7ª), que se mueven y cambian de alteración
      const PE = N.group(M, 'penta'); aparece(s, PE, a + 0.15, null, { dy: 0 }); pentaClave(PE, PX, YM, PW);
      const cabeza = () => { const P = N.group(M, 'nota'), I = N.group(P); N.glyph(I, 'noteheadWhole', 0, 0, SP); return { P, I }; };
      const nR = cabeza(), nT = cabeza(), nQ = cabeza(), nS = cabeza();
      const yT = pista([[0, yF], [tLug, yG], [tRe, yF]], 0.55);             // la 3ª: Fa → Sol (sus4) → Fa♯ (resuelve)
      const dxQ = pista([[0, 0], [tLug, 0.98 * wN], [tRe, 0]], 0.55);       // Sol–La es una 2ª: el La se aparta a la derecha
      s.on(t => {
        nR.P.setAttribute('transform', `translate(${xAc},${f1(yD)})`);
        nT.P.setAttribute('transform', `translate(${xAc},${yT(t).toFixed(1)})`);
        nQ.P.setAttribute('transform', `translate(${(xAc + dxQ(t)).toFixed(1)},${f1(yA)})`);
        nS.P.setAttribute('transform', `translate(${xAc},${f1(yC)})`);
      });
      pop(s, nR.I, tAco, null, wN / 2, 0, { k0: .4 }); pop(s, nT.I, t3a, null, wN / 2, 0, { k0: .4 });
      pop(s, nQ.I, t5a, null, wN / 2, 0, { k0: .4 }); pop(s, nS.I, tSep, null, wN / 2, 0, { k0: .3 });
      s.on(t => opa(nT.P, 1 - 0.65 * win(t, tNo, tLug + 0.3, .3, .35)));   // «aquí no hay tercera»
      /** Alteración animada: claves [[t, '#'|'b'|'', columna]] (columna 1 = más a la izquierda, como en acorde()). */
      const altAnim = (yf, claves) => {
        const G = N.group(M, 'alt'), GL = { '#': 'accidentalSharp', b: 'accidentalFlat' }, E = {};
        for (const kk in GL) { E[kk] = N.group(G); N.glyph(E[kk], GL[kk], 0, 0, SP); }
        const xc = (kk, c) => xAc - (N.M[GL[kk]].adv + 0.22) * SP - c * 1.2 * SP;
        s.on(t => {
          let i = -1; for (let j = 0; j < claves.length; j++) if (t >= claves[j][0]) i = j;
          const cur = i >= 0 ? claves[i] : [0, '', 0], prev = i >= 1 ? claves[i - 1] : [0, '', 0];
          const kk = i >= 0 ? ease(ramp(t, cur[0], cur[0] + 0.35)) : 1, y = yf(t);
          for (const al in E) {
            let v = 0, x = 0;
            if (al === cur[1] && al === prev[1]) { v = 1; x = lerp(xc(al, prev[2]), xc(al, cur[2]), kk); }
            else if (al === cur[1]) { v = kk; x = xc(al, cur[2]); }
            else if (al === prev[1]) { v = 1 - kk; x = xc(al, prev[2]); }
            opa(E[al], v); if (v > 0) E[al].setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
          }
        });
        return G;
      };
      const AT = altAnim(yT, [[a, '', 0], [t3a, '#', 0], [tMen, '', 0], [t3c, '#', 0], [t5c, '#', 1], [t3d, '', 0], [tRe, '#', 0], [tC3, '', 0], [tC6a, '#', 0], [tC6b, '#', 1], [tC9a, '', 0]]);
      const AQ = altAnim(() => yA, [[a, '', 0], [t5c, '#', 0], [t5d, 'b', 0], [t5s, '', 0], [tC9a, 'b', 1], [tC9b, 'b', 0], [tC10, 'b', 1]]);
      const AS_ = altAnim(() => yC, [[a, '', 0], [tC6b, '#', 0], [tC9b, '', 0], [tC10, 'b', 0]]);
      // colores: rosa lo que se explica y lo que suena
      const SON = ['SON_D', 'SON_DMEN', 'SON_DAUM', 'SON_DDIS', 'SON_SUS', 'SON_D7', 'SON_DM7', 'SON_DMAJ7', 'SON_DSEMI', 'SON_DDIM7'];
      const kSuena = (i, t) => {
        let kk = 0;
        for (const blq of SON) {
          const ts = S[blq]; if (!ts) continue; const nn = ts.length - 1; if (i >= nn) continue;
          kk = Math.max(kk, win(t, ts[i] - 0.03, ts[i] + 0.35, .05, .25), win(t, ts[nn] - 0.03, ts[nn] + 1.1, .05, .4));
        }
        if (i < 3) kk = Math.max(kk, win(t, RS[0] - 0.03, RS[1] + 1.3, .05, .45));
        return kk;
      };
      const ROSA = [
        [[tAco, tAco + 1.0]],
        [[t3a, t3a + 1.0], [tMen, tMen + 1.2], [t3c, t3c + 1.0], [t3d, t3d + 1.0], [tLug, t4J + 1.2], [tRes4, RS[0]], [tRe - 0.1, tRe + 1.3], [tC3, tC3 + 1.0], [tC6a, tC6a + 1.0], [tC9a, tC9a + 1.0]],
        [[t5a, t5a + 1.0], [t5c, t5c + 1.0], [t5d, t5d + 1.0], [t5s, t5s + 1.0], [tC9a, tC9a + 1.0]],
        [[tSep, tSep + 2.2], [tSe2, tSe2 + 1.2], [tC6b, tC6b + 1.0], [tC9b, tC9b + 1.0], [tC10, FIN]],
      ];
      [[nR, null], [nT, AT], [nQ, AQ], [nS, AS_]].forEach(([n, al], i) => s.on(t => {
        const c = mezcla(C.blanco, C.rosa, Math.max(ventanas(t, ROSA[i]), kSuena(i, t)));
        color(n.I, c); if (al) color(al, c);
      }));
      // ---- llaves: tríadas → 3ª (izquierda) y 5ª (derecha); cuatríadas → la tríada (izquierda) y la 7ª (derecha)
      // (la de la izquierda se arrima a las alteraciones que haya en cada momento: 0, 1 o 2 columnas)
      const A1s = (0.996 + 0.22) * SP, A1b = (0.904 + 0.22) * SP, A2 = 1.2 * SP;
      const xLt = pista([[0, -A1s], [tMen, 0], [t3c, -A1s], [t5c, -A1s - A2], [t3d, -A1s], [t5d, -A1b], [t5s, 0], [tRe, -A1s], [tC3, 0],
        [tC6a, -A1s], [tC6b, -A1s - A2], [tC9a, -A1b - A2], [tC9b, -A1b], [tC10, -A1b - A2]].map(([t, v]) => [t, xAc - 12 + v]), 0.35);
      const llave = () => { const G = N.group(M, 'llave'); const p = N.el('path', { fill: 'none', stroke: 'currentColor', 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, G); return { G, p }; };
      const L3 = llave(), L5 = llave(), LT = llave(), L7 = llave();
      const xR = t => xR0 + dxQ(t), y3 = t => yT(t) - 0.62 * SP;
      s.on(t => { const xl = xLt(t); L3.p.setAttribute('d', llaveD(xl, y3(t), yRb, 'izq')); L5.p.setAttribute('d', llaveD(xR(t), yA - 0.62 * SP, yRb, 'der')); LT.p.setAttribute('d', llaveD(xl, yA - 0.62 * SP, yRb, 'izq')); });
      L7.p.setAttribute('d', llaveD(xR0, yC - 0.62 * SP, yRb, 'der'));
      mostrarEn(s, L3.G, t3a, tUna + 0.3); mostrarEn(s, L5.G, t5a, tUna + 0.3); mostrarEn(s, LT.G, tUna, FIN); mostrarEn(s, L7.G, tSep, FIN);
      const it3 = [[t3a, tMen, '3M'], [tMen, t3c, '3ªm'], [t3c, t3d, '3M'], [t3d, tLug + 0.2, '3ªm'], [t4J, tRe, '4J'], [tRe, tUna + 0.3, '3M']];
      const R3 = rotulos(s, M, it3, 'izq', t => [xLt(t) - 44, (y3(t) + yRb) / 2]);
      const it5 = [[t5a, t5c, '5J'], [t5c, t5d, '5A'], [t5d, t5s, '5D'], [t5s, tUna + 0.3, '5J']];
      rotulos(s, M, it5, 'der', t => [xR(t) + 44, (yA - 0.62 * SP + yRb) / 2]);
      const itT = [[tUna, tC3, { simb: 'D' }, [[tUna, tUna + 1.4], [tRel, tRel + 1.8]]], [tC3, tC6a, { simb: 'D-' }], [tC6a, tC9a, { simb: 'D' }], [tC9a, FIN, { simb: 'D°' }]];
      rotulos(s, M, itT, 'izq', t => [xLt(t) - 44, (yA - 0.62 * SP + yRb) / 2], { sizeS: 42 });
      const it7 = [[tSep, tSm2, '7ª', 2.2], [tSm2, tC6b, '7ªm'], [tC6b, tC9b, '7M'], [tC9b, tC10, '7ªm'], [tC10, FIN, '7D', 1e9]];
      rotulos(s, M, it7, 'der', () => [xR0 + 44, (yC - 0.62 * SP + yRb) / 2]);
      const rosaDe = its => its.map(([ta, , , ro]) => Array.isArray(ro) ? ro : [[ta, ta + (ro || 1.6)]]).flat();
      const V3 = rosaDe(it3), V5 = rosaDe(it5), VT = rosaDe(itT), V7 = rosaDe(it7);
      s.on(t => {
        color(L3.G, mezcla(C.blanco, C.rosa, ventanas(t, V3))); color(L5.G, mezcla(C.blanco, C.rosa, ventanas(t, V5)));
        color(LT.G, mezcla(C.blanco, C.rosa, ventanas(t, VT))); color(L7.G, mezcla(C.blanco, C.rosa, ventanas(t, V7)));
      });
      // «Aquí no hay tercera»: se tachan la nota y su rótulo
      const tach = (d, ta, tb) => { const G = N.group(M, 'tachon'); color(G, C.rosa); const p = trazo(G, d, { w: 5 }); trazoTramos(s, p, [[ta, tb, 0.3]]); return G; };
      tach(`M${f1(xAc - 12)},${f1(yF + 16)} L${f1(xAc + wN + 12)},${f1(yF - 16)}`, tNo, tLug);
      const wl = R3[3]._P._w, ym3 = (yF - 0.62 * SP + yRb) / 2, xl3 = xLt(tNo) - 44;
      tach(`M${f1(xl3 - wl - 12)},${f1(ym3 + 4)} L${f1(xl3 + 12)},${f1(ym3 - 4)}`, tNo + 0.15, tLug);

      // ---- nombres de las notas bajo el pentagrama
      const nomT = (txts, ts, tb, o) => nombresFila(s, M, txts, xMid, 792, ts.map(x => x - 0.1), tb, o);
      nomT(['Re', 'Fa♯', 'La'], [Wx('T1', 're'), Wx('T1', 'fa'), Wx('T1', 'la', 2)], F0('T2') - 0.1);
      nomT(['Re', 'Fa', 'La'], [Wx('T2', 're'), Wx('T2', 'fa'), Wx('T2', 'la', 2)], F0('T3') - 0.1);
      nomT(['Re', 'Fa♯', 'La♯'], [Wx('T3', 're'), Wx('T3', 'fa'), Wx('T3', 'la', 2)], F0('T4') - 0.1);
      nomT(['Re', 'Fa', 'La♭'], [Wx('T4', 're'), Wx('T4', 'fa'), Wx('T4', 'la', 3)], F0('S1') - 0.1);
      nomT(['Re', 'Sol', 'La'], [Wx('S1', 're'), Wx('S1', 'sol'), Wx('S1', 'la', 2)], [tUna, tRe, tUna]);
      nomT(['', 'Fa♯', ''], [0, tRe + 0.1, 0], [0, tUna, 0], { sinPuntos: true });
      const nomC = (txts, ts, tb, o) => nombresFila(s, M, txts, xMid, 792, ts.map(x => x - 0.1), tb, Object.assign({ paso: 124 }, o || {}));
      nomC(['Re', 'Fa♯', 'La', 'Do'], [Wx('C2', 're'), Wx('C2', 'fa'), Wx('C2', 'la'), Wx('C2', 'do')], F0('C3') - 0.1);
      nomC(['Re', 'Fa', 'La', 'Do'], [Wx('C3', 're', 2), Wx('C3', 'fa'), Wx('C3', 'la'), Wx('C3', 'do')], F0('C6') - 0.1);
      nomC(['Re', 'Fa♯', 'La', 'Do♯'], [Wx('C6', 're'), Wx('C6', 'fa'), Wx('C6', 'la'), Wx('C6', 'do')], F0('C9') - 0.1);
      nomC(['Re', 'Fa', 'La♭', 'Do'], [0, 1, 2, 3].map(i => tSemi + 0.3 + i * 0.15), F0('C10') - 0.1);
      nomC(['Re', 'Fa', 'La♭', 'Do♭'], [0, 1, 2, 3].map(i => tC10 + 0.35 + i * 0.15), FIN, { rosa: [3] });
      // «todas las terceras son menores»: 3ªm entre nota y nota
      const tTe = Wx('C10', 'terceras') - 0.1;
      [0, 1, 2].forEach(i => {
        const G = fraseG(M, [['3ªm', C.rosa]], xMid + (i - 1) * 124, 840, { size: 26, peso: 800, anchor: 'middle' });
        aparece(s, G, tTe + i * 0.2, FIN, { dy: 4 });
      });

      // ---- comentarios (una línea abajo)
      const ley = (partes, tb, o) => lineaPartes(s, M, partes, CX, 915, tb, o);
      ley([[[['la forma moderna', C.suave]], Wx('T4', 'forma') - 0.1]], F0('S1') - 0.2, { italic: true });
      ley([[[['no hay 3ª', C.rosa]], tNo]], tLug);
      ley([[[['en su lugar, una ', C.blanco], ['4ª justa', C.rosa]], tLug + 0.1]], t5s + 1.3);
      ley([[[['música pop', C.blanco]], Wx('S3', 'pop') - 0.3], [[['  ·  ', C.suave], ['bandas sonoras', C.blanco]], Wx('S3', 'bandas') - 0.1]], F1('S3') + 0.3);
      ley([[[['tensión', C.blanco]], Wx('S4', 'tension') - 0.15], [[[' azucarada', C.rosa]], Wx('S4', 'azucarada') - 0.15]], tRes4 - 0.1);
      ley([[[['quiere resolver en la ', C.blanco], ['3ª', C.rosa]], tRes4]], tRe - 0.1);
      ley([[[['4ª', C.blanco], [' → ', C.suave], ['3ª', C.rosa]], tRe]], F0('C1') + 0.2);
      ley([[[['sonoridad menor', C.blanco]], Wx('C4', 'sonoridad') - 0.15], [[['  ·  ', C.suave], ['una dimensión más', C.rosa]], Wx('C4', 'dimension') - 0.15]], tAp + 0.3);
      ley([[[['una dimensión más', C.rosa]], Wx('C7', 'dimension') - 0.15]], Wx('C8', 'gourmet') - 0.25);
      ley([[[['más gourmet', C.blanco]], Wx('C8', 'gourmet') - 0.2], [[['  ·  ', C.suave], ['modo premium', C.rosa]], Wx('C8', 'modo') - 0.1]], F0('C9') - 0.1);
      ley([[[['todo va mal… ', C.suave]], Wx('C9', 'todo') - 0.1], [[['pero la ', C.blanco], ['7ª', C.rosa], [' es menor', C.blanco]], Wx('C9', 'septima', 2) - 0.1]], F0('C10') - 0.2);
      ley([[[['…no podría ser más deprimente', C.suave]], Wx('C10', 'podria') - 0.3]], FIN, { italic: true });

      // ---- C5 · el consejo (lo demás se aparta)
      const AP = N.group(g, 'aparte'), fin5 = tVu - 0.25;
      const tA1 = Wx('C5', 'no') - 0.15, tA2 = Wx('C5', 'recurso') - 0.2, tQ = Wx('C5', 'simples') - 0.35, tLim = Wx('C5', 'recursos') - 0.2, tApr = Wx('C5', 'aprovecha') - 0.2;
      // (el bloque se mantiene centrado en vertical mientras crece: sube un poco con cada línea nueva)
      const APm = N.group(AP);
      const alto = pista([[0, 0], [tA2, 110], [Wx('C5', 'interpretar') - 0.2, 190], [tQ, 310], [tApr, 410]], 0.5);
      s.on(t => APm.setAttribute('transform', `translate(0,${(555 - alto(t) / 2 - 380).toFixed(1)})`));
      const capa = (ta, tDim) => { const Dm = N.group(APm); s.on(t => opa(Dm, 1 - 0.6 * ease(ramp(t, tDim, tDim + 0.4)))); return Dm; };
      const d1 = capa(tA1, tA2), d2 = capa(tA2, tQ), d3 = capa(tQ, tApr), d4 = capa(tApr, FIN);
      aparece(s, fraseG(d1, [['no solo ', C.suave], ['un ejercicio de teoría', C.blanco]], CX, 380, { size: 44, peso: 800, anchor: 'middle' }), tA1, fin5, { dy: 8 });
      aparece(s, fraseG(d2, [['un ', C.blanco], ['recurso', C.rosa], [' más', C.blanco]], CX, 490, { size: 64, peso: 800, anchor: 'middle' }), tA2, fin5, { dy: 8 });
      lineaPartes(s, d2, [[[['para ', C.suave], ['interpretar', C.blanco]], Wx('C5', 'interpretar') - 0.2], [[['  ·  ', C.suave], ['componer', C.blanco]], Wx('C5', 'componer') - 0.15]], CX, 570, fin5, { size: 38 });
      lineaPartes(s, d3, [[[['acordes simples, tríadas', C.blanco]], tQ], [[[' → ', C.suave], ['recursos limitados', C.suave]], tLim]], CX, 690, fin5, { size: 40 });
      aparece(s, fraseG(d4, [['aprovecha estos recursos', C.rosa]], CX, 790, { size: 52, peso: 800, anchor: 'middle' }), tApr, fin5, { dy: 8 });

      // ---- el oído mientras suenan los ejemplos
      oido(s, g, 1650, YM, [...SON, 'SON_SUSRES']);
    });
  }

  // ================================================================ B · un apunte: el blues (la séptima de dominante como reposo) y Mozart
  function escenaBlues() {
    const a = F0('B1') - 0.2, b = F0('E1') - 0.2;
    escena('blues', a, b, (s, g) => {
      const fin = b - 0.3;
      const tB2 = F0('B2') - 0.2, tPa = Wd('B2', 'paradojas') - 0.3, tB3 = F0('B3') - 0.25;
      const tBlu = Wd('B1', 'blues') - 0.25, tSD = Wd('B1', 'septima') - 0.2;
      // B1 · UN APUNTE: el blues usa siempre la séptima de dominante
      // (el cartel empieza centrado y sube cuando llega «blues»)
      const kA = N.group(g), kAi = N.group(kA); chip(kAi, 'UN APUNTE', CX, 380, { size: 32, anchor: 'middle' });
      pop(s, kAi, Wd('B1', 'apunte') - 0.3, tB2, CX, 380);
      s.on(t => kA.setAttribute('transform', `translate(0,${(170 * (1 - ease(ramp(t, tBlu - 0.35, tBlu + 0.3)))).toFixed(1)})`));
      const bl = N.group(g); texto(bl, 'blues', CX, 540, { anchor: 'middle', size: 130, peso: 800, italic: true, fill: C.blanco });
      aparece(s, bl, tBlu, tB2, { dy: 10 });
      const R1 = N.group(g); aparece(s, R1, tSD, tB2, { dy: 8 });
      const s1 = simbolo(R1, 'D7', 0, 0, 90, { colL: C.blanco, colQ: C.rosa });
      const f1_ = frase(R1, [['séptima de dominante', C.rosa]], 0, 0, { size: 48, peso: 800 });
      const w1 = s1._w + 44 + f1_._w, x1 = CX - w1 / 2;
      s1.setAttribute('transform', `translate(${f1(x1)},708)`); f1_.setAttribute('transform', `translate(${f1(x1 + s1._w + 44)},${f1(708 - 16)})`);
      // B2 · las paradojas de la vida
      const pa = fraseG(g, [['las paradojas de la vida', C.blanco]], CX, 560, { size: 56, peso: 800, italic: true, anchor: 'middle' });
      aparece(s, pa, tPa, tB3 + 0.1, { dy: 8 });
      // B3 · Clasicismo y Romanticismo (D7 = tensión → reposo) | blues (D7 = el reposo mismo)
      const tTo = Wd('B3', 'todos') - 0.3, tBl3 = Wx('B3', 'blues') - 0.2, fCol = tTo + 0.1;
      // (la columna del Clasicismo empieza centrada y se aparta a la izquierda cuando llega la del blues)
      const IZm = N.group(g), IZ = N.group(IZm), DE = N.group(g);
      s.on(t => IZm.setAttribute('transform', `translate(${(400 * (1 - ease(ramp(t, tBl3 - 0.55, tBl3 + 0.1)))).toFixed(1)},0)`));
      lineaPartes(s, IZ, [[[['Clasicismo', C.blanco]], Wd('B3', 'clasicismo') - 0.25], [[[' · Romanticismo', C.blanco]], Wd('B3', 'romanticismo') - 0.2]], 560, 440, fCol, { size: 38 });
      const tD7 = Wx('B3', 'septima') - 0.2, tTen = Wx('B3', 'tension') - 0.2, tRep = Wx('B3', 'reposo') - 0.3;
      const IZd = N.group(IZ);
      const gI = N.group(IZd); aparece(s, gI, tD7, fCol, { dy: 8 });
      const sI = simbolo(gI, 'D7', 0, 0, 100);
      const sG = N.group(IZd); aparece(s, sG, tRep, fCol, { dy: 8 });
      const sI2 = simbolo(sG, 'G', 0, 0, 100);
      const wIz = sI._w + 130 + sI2._w, xi = 560 - wIz / 2;
      sI.setAttribute('transform', `translate(${f1(xi)},620)`); sI2.setAttribute('transform', `translate(${f1(xi + sI._w + 130)},620)`);
      const fl = N.group(sG); color(fl, C.suave); flecha(fl, xi + sI._w + 28, 584, xi + sI._w + 104, 584, { w: 4, cab: 16 });
      const te = fraseG(IZd, [['tensión', C.rosa]], xi + sI._w / 2, 712, { size: 38, peso: 800, anchor: 'middle' }); aparece(s, te, tTen, fCol, { dy: 6 });
      s.on(t => IZd.setAttribute('transform', `translate(${((wIz - sI._w) / 2 * (1 - ease(ramp(t, tRep - 0.1, tRep + 0.35)))).toFixed(1)},0)`));
      const re = fraseG(IZd, [['reposo', C.blanco]], xi + sI._w + 130 + sI2._w / 2, 712, { size: 38, peso: 800, anchor: 'middle' }); aparece(s, re, tRep + 0.1, fCol, { dy: 6 });
      const hb = fraseG(DE, [['blues', C.blanco]], 1360, 440, { size: 40, peso: 800, italic: true, anchor: 'middle' }); aparece(s, hb, tBl3, fCol, { dy: 6 });
      const gD = N.group(DE); aparece(s, gD, Wx('B3', 'es') - 0.2, fCol, { dy: 8 });
      simbolo(gD, 'D7', 1360, 620, 100, { anchor: 'middle' });
      const rd = fraseG(DE, [['el ', C.blanco], ['reposo', C.rosa], [' mismo', C.blanco]], 1360, 712, { size: 38, peso: 800, anchor: 'middle' }); aparece(s, rd, Wx('B3', 'reposo', 2) - 0.25, fCol, { dy: 6 });
      const dv = N.group(g); N.line(dv, 960, 395, 960, 735, 2, { stroke: C.tenue }); mostrarEn(s, dv, tBl3, fCol);
      s.on(t => opa(IZ, 1 - 0.65 * win(t, tBl3, fin + 1, .4, .3)));
      // «todos los acordes son con séptima de dominante»: el blues de doce compases (I7 · IV7 · V7)
      const PROG = ['D7', 'D7', 'D7', 'D7', 'G7', 'G7', 'D7', 'D7', 'A7', 'G7', 'D7', 'D7'];
      const GX = j => 560 + j * 200, GY = [490, 610, 730];
      const tSe2 = Wx('B3', 'septima', 2) - 0.15, tMo = Wd('B4', 'mozart') - 0.3, tBs = Wd('B5', 'bluesero') - 0.15;
      const MB = S.SON_BLUES || [], t0B = F0('SON_BLUES');
      const RJw = N.group(g), RJ = N.group(RJw); aparece(s, RJ, tTo, fin, { dy: 8 });
      s.on(t => opa(RJw, 1 - 0.6 * win(t, tMo - 0.2, t0B + 0.05, .4, .3)));
      GY.forEach((y, r) => {
        for (let j = 0; j <= 4; j++) {
          if (r === 2 && j === 4) { N.line(RJ, GX(4) - 12, y - 45, GX(4) - 12, y + 45, 2.5, { stroke: C.suave }); N.el('rect', { x: GX(4) - 6, y: y - 45, width: 8, height: 90, fill: C.suave }, RJ); }
          else N.line(RJ, GX(j), y - 45, GX(j), y + 45, 2.5, { stroke: C.suave });
        }
      });
      PROG.forEach((ch, kk) => {
        const r = Math.floor(kk / 4), j = kk % 4, x = GX(j) + 100 - (r === 2 && j === 3 ? 6 : 0), y = GY[r];
        const G = N.group(RJ);
        const H = N.el('rect', { x: x - 84, y: y - 40, width: 168, height: 80, rx: 12, fill: C.rosa, 'fill-opacity': 0.16, stroke: C.rosa, 'stroke-width': 2.5 }, G);
        const sb = simbolo(G, ch, x, y + 0.36 * 56, 56, { anchor: 'middle', colL: C.blanco });
        pop(s, G, tTo + 0.1 + kk * 0.05, null, x, y, { k0: .6 });
        const m0 = MB[kk] != null ? MB[kk] : t0B + 0.12 + kk * 0.38, m1 = kk === 11 ? m0 + 1.3 : m0 + 0.38;
        s.on(t => {
          const on = win(t, m0 - 0.03, m1, .05, .12);
          opa(H, on); color(sb._L, mezcla(C.blanco, C.rosa, on));
          color(sb._Q, mezcla(C.blanco, C.rosa, Math.max(on, win(t, tSe2, tMo - 0.1, .3, .4))));
        });
      });
      lineaPartes(s, g, [[[['todos con ', C.blanco], ['séptima de dominante', C.rosa]], tTo + 0.2]], CX, 330, tMo - 0.15, { size: 40 });
      // B4–B5 · ¿qué pensaría Mozart…? Sería bluesero
      lineaPartes(s, g, [[[['¿Qué pensaría ', C.suave], ['Mozart', C.blanco], ['?', C.suave]], tMo]], CX - 160, 334, fin, { size: 48, italic: true });
      const STw = N.group(g), STr = N.group(STw); STr.setAttribute('transform', `rotate(-7 ${CX + 300} 322)`);
      chip(STr, '¡bluesero!', CX + 300, 322, { size: 34, anchor: 'middle', ls: '0.04em' });
      pop(s, STw, tBs, fin, CX + 300, 322, { k0: .5 });
      oido(s, g, 1560, 610, ['SON_BLUES']);
      void R1;
    });
  }

  // ================================================================ E · los ejercicios del portal: identificar y construir (con permiso del sus4)
  function escenaEjercicios() {
    const a = F0('E1') - 0.2, b = F0('F1') - 0.2;
    escena('ejercicios', a, b, (s, g) => {
      const fin = b - 0.3, wN = N.M.noteheadWhole.adv * SP;
      const k = N.group(g); chip(k, 'EJERCICIOS EN EL PORTAL', CX, 200, { size: 34, anchor: 'middle' });
      pop(s, k, Wd('E1', 'portal') - 0.3, fin, CX, 200);
      const tId = Wd('E1', 'identificar') - 0.25, tCo = Wd('E1', 'construirlo') - 0.25;
      // las dos tarjetas llegan con «dos tipos de ejercicio»; su contenido, al nombrar cada uno (y la nombrada, con borde rosa)
      const tDos = Wd('E1', 'dos') - 0.2, tE2 = F0('E2') - 0.1;
      const tarjeta = (x, tit, t0, tOn, tOff) => {
        const Fr = N.group(g); pop(s, Fr, t0, fin, x, 490, { k0: .85 });
        const R = panel(Fr, x - 340, 290, 680, 400, { rx: 22 });
        const K = N.group(Fr); chip(K, tit, x, 340, { size: 26, anchor: 'middle' });
        s.on(t => { const kk = win(t, tOn, tOff, .3, .4); R.setAttribute('stroke', kk > 0.02 ? mezcla('#3a4556', C.rosa, kk) : C.borde); R.setAttribute('stroke-width', (1.5 + 1.5 * kk).toFixed(2)); });
        const Co = N.group(Fr); return Co;
      };
      // tarjeta 1 · IDENTIFICA: un acorde en el pentagrama → ¿qué cifrado es?
      const T1g = tarjeta(560, 'IDENTIFICA', tDos, tId, tCo); aparece(s, T1g, tId, fin, { dy: 6 });
      pentaClave(T1g, 290, 490, 540);
      const x1 = Math.round((290 + 3.9 * SP + 830) / 2 - wN / 2);
      acorde(T1g, ['G4', 'B4', 'D5', 'F5'], x1, 490);
      N.el('rect', { x: 480, y: 588, width: 160, height: 66, rx: 12, fill: 'none', stroke: C.suave, 'stroke-width': 2.5, 'stroke-dasharray': '8 7' }, T1g);
      texto(T1g, '?', 560, 635, { anchor: 'middle', size: 42, peso: 800, fill: C.rosa });
      // tarjeta 2 · CONSTRUYE: Eø → Mi · Sol · Si♭ · Re, apiladas por terceras
      const T2g = tarjeta(1360, 'CONSTRUYE', tDos + 0.2, tCo, tE2); aparece(s, T2g, tCo, fin, { dy: 6 });
      simbolo(T2g, 'Eø', 1118, 490 + 0.36 * 64, 64, { anchor: 'middle' });
      pentaClave(T2g, 1190, 490, 470);
      const x2 = 1420, AC2 = acorde(T2g, ['E4', 'G4', 'Bb4', 'D5'], x2, 490);
      const tNo = Wx('E2', 'notas') - 0.15;
      AC2.notas.forEach((n, j) => pop(s, n.g, tNo + j * 0.3, fin, n.cx, n.y, { k0: .4 }));
      color(AC2.notas[0].g, C.rosa);
      const lp = N.group(g); icoLapiz(lp, 1590, 450, 0.8); color(lp, C.suave); mostrarEn(s, lp, tCo + 0.3, tNo, .3, .3);
      const tFu = Wx('E2', 'fundamental', 2) - 0.2, tTe = Wx('E2', 'todo') - 0.15;
      const lf = fraseG(g, [['fundamental', C.rosa]], x2 + wN / 2, 612, { size: 26, peso: 800, anchor: 'middle' }); aparece(s, lf, tFu, fin, { dy: 4 });
      // «todo por terceras»: escalera de 3ª entre nota y nota, a la derecha
      AC2.notas.slice(0, 3).forEach((n, i) => {
        const n2 = AC2.notas[i + 1], x = x2 + wN + 14 + i * 50, G = N.group(g); color(G, C.rosa);
        N.el('path', { d: `M${f1(x)},${f1(n.y)} L${f1(x + 8)},${f1(n.y)} L${f1(x + 8)},${f1(n2.y)} L${f1(x)},${f1(n2.y)}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, G);
        texto(G, '3ª', x + 14, (n.y + n2.y) / 2 + 8, { size: 22, peso: 800, fill: 'currentColor' });
        aparece(s, G, tTe + i * 0.18, fin, { dy: 0 });
      });
      // estado fundamental · posición cerrada
      const c1 = N.group(g); chip(c1, 'estado fundamental', 750, 782, { size: 28, anchor: 'middle', relleno: false, ls: '0.04em' });
      pop(s, c1, Wx('E2', 'estado') - 0.2, fin, 750, 782);
      const c2 = N.group(g); chip(c2, 'posición cerrada', 1170, 782, { size: 28, anchor: 'middle', relleno: false, ls: '0.04em' });
      pop(s, c2, Wx('E2', 'posicion') - 0.2, fin, 1170, 782);
      // «…todo por terceras»* — *con permiso del sus4 (que no se enfade)
      lineaPartes(s, g, [[[['todo por terceras', C.rosa]], tTe], [[['*', C.rosa]], Wx('E3', 'perdoname') - 0.1]], CX, 872, fin, { size: 40 });
      const tPe = Wx('E4', 'permiso') - 0.3, tSu = Wx('E4', 'sus4') - 0.2, tEn = Wx('E4', 'enfade') - 0.45;
      const NP = N.group(g); aparece(s, NP, tPe, fin, { dy: 6 });
      const fp = frase(NP, [['* con permiso del ', C.suave]], 0, 0, { size: 30, peso: 700, italic: true });
      const SuW = N.group(g); aparece(s, SuW, tSu, fin, { dy: 6 });
      const SuR = N.group(SuW); const ss = simbolo(SuR, 'Dsus4', 0, 0, 34, { colL: C.blanco, colQ: C.rosa });
      const wf = fp._w + ss._w, xf = CX - wf / 2;
      fp.setAttribute('transform', `translate(${f1(xf)},944)`); ss.setAttribute('transform', `translate(${f1(xf + fp._w)},944)`);
      const cxs = xf + fp._w + ss._w / 2, cys = 932;
      s.on(t => { const kk = ramp(t, tEn, tEn + 1.0); SuR.setAttribute('transform', `rotate(${(7 * Math.sin(kk * Math.PI * 4) * (1 - kk)).toFixed(2)} ${f1(cxs)} ${cys})`); });
    });
  }

  // ================================================================ F · repaso: tríadas (3ª y 5ª) · cuatríadas (tríada + 7ª)
  function escenaRepaso() {
    const a = F0('F1') - 0.1, b = T.acorde + 0.15;
    escena('repaso', a, b, (s, g) => {
      const fin = b - 0.3;
      const P = N.group(g); aparece(s, P, a + 0.1, fin, { dy: 12 });
      panel(P, 190, 190, 1540, 660, { rx: 26, stroke: 'rgba(248,250,252,0.3)', sw: 2 });
      const kR = N.group(g); chip(kR, 'REPASO', CX, 190, { size: 28, anchor: 'middle' });
      pop(s, kR, Wd('F1', 'recapitulando') - 0.25, fin, CX, 190);
      const tTr = Wd('F1', 'triadas') - 0.2, t3 = Wd('F1', 'tercera') - 0.15, t5 = Wd('F1', 'quinta') - 0.15;
      const tCu = Wd('F2', 'cuatriadas') - 0.2, tTa = Wx('F2', 'triada') - 0.15, tSe = Wx('F2', 'septima') - 0.1;
      const tRef = Wd('F2', 'referencia') - 0.2, tSim = Wd('F3', 'simbolo') - 0.15, tMed = Wd('F3', 'medir') - 0.15;
      lineaPartes(s, g, [[[['Tríadas', C.blanco]], tTr], [[[':  ', C.suave], ['3ª', C.rosa]], t3], [[[' y ', C.suave], ['5ª', C.rosa]], t5]], 575, 286, fin, { size: 46 });
      lineaPartes(s, g, [[[['Cuatríadas', C.blanco]], tCu], [[[':  ', C.suave], ['tríada', C.blanco]], tTa], [[[' + ', C.suave], ['7ª', C.rosa]], tSe]], 1345, 286, fin, { size: 46 });
      const sep = N.group(g); N.line(sep, 960, 240, 960, 800, 2, { stroke: C.tenue }); mostrarEn(s, sep, tCu, fin);
      const yF = i => 392 + i * 94;
      const TRI = [['D', '3M', '5J'], ['D-', '3ªm', '5J'], ['D+', '3M', '5A'], ['D°', '3ªm', '5D'], ['Dsus4', '4J', '5J']];
      const CUA = [['D7', 'D', '7ªm'], ['D-7', 'D-', '7ªm'], ['DΔ', 'D', '7M'], ['Dø', 'D°', '7ªm'], ['D°7', 'D°', '7D']];
      const REF = { 'D': 0, 'D-': 1, 'D°': 3 };
      const symT = [];
      TRI.forEach(([sp, i3, i5], i) => {
        const y = yF(i), tA = t3 - 0.3 + i * 0.16;
        const G = N.group(g); aparece(s, G, tA, fin, { dy: 8 });
        const Sy = N.group(G); simbolo(Sy, sp, 400, y, 54, { anchor: 'middle' }); symT.push(Sy);
        const [g3, gd, g5] = trozos(G, [[i3, C.blanco], ['  ·  ', C.suave], [i5, C.blanco]], 520, y, { size: 42, peso: 800 });
        void gd;
        const esRef = Object.values(REF).includes(i);
        s.on(t => {
          color(g3, mezcla(C.blanco, C.rosa, Math.max(win(t, t3, t3 + 1.4, .25, .4), ease(ramp(t, tMed, tMed + 0.4)))));
          color(g5, mezcla(C.blanco, C.rosa, Math.max(win(t, t5, t5 + 1.4, .25, .4), ease(ramp(t, tMed, tMed + 0.4)))));
          color(Sy, mezcla(C.blanco, C.rosa, Math.max(esRef ? win(t, tRef, tRef + 1.9, .3, .4) : 0, win(t, tSim, tMed + 0.3, .3, .4))));
        });
      });
      CUA.forEach(([sp, tri, i7], i) => {
        const y = yF(i), tA = tSe + 0.1 + i * 0.16;
        const G = N.group(g); aparece(s, G, tA, fin, { dy: 8 });
        const Sy = N.group(G); simbolo(Sy, sp, 1170, y, 54, { anchor: 'middle' });
        let x = 1290;
        const eq = N.group(G); const fe = frase(eq, [['=', C.suave]], x, y, { size: 42, peso: 700 }); x += fe._w + 16;
        const Tr = N.group(G); const st = simbolo(Tr, tri, x, y, 44); x += st._w + 16;
        const pl = N.group(G); const fp = frase(pl, [['+', C.suave]], x, y, { size: 42, peso: 700 }); x += fp._w + 16;
        const I7 = N.group(G); frase(I7, [[i7, 'currentColor']], x, y, { size: 42, peso: 800 });
        s.on(t => {
          color(Tr, mezcla(C.blanco, C.rosa, win(t, tRef, tRef + 1.9, .3, .4)));
          color(I7, mezcla(C.blanco, C.rosa, Math.max(win(t, tSe, tSe + 1.6, .25, .4), ease(ramp(t, tMed, tMed + 0.4)))));
          color(Sy, mezcla(C.blanco, C.rosa, win(t, tSim, tMed + 0.3, .3, .4)));
        });
      });
      lineaPartes(s, g, [[[['cada símbolo', C.rosa]], tSim], [[[' → ', C.suave], ['qué medir', C.blanco]], tMed]], CX, 926, fin, { size: 42 });
      void symT; void tTa;
    });
  }

  const ORDEN = [escenaIntro, escenaLetras, escenaAcordes, escenaBlues, escenaEjercicios, escenaRepaso];

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
