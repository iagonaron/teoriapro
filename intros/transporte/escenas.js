/* =====================================================================
   ESCENAS · Transporte (GP)
   Montado por pipe/escenas_build.py: utilidades comunes (_comun/) + escenas
   propias (transporte/escenas_cuerpo.js). Todo es función pura de t.
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

  // ================================================================ P8 · TRANSPORTE (GP · parte práctica: escrito, mental, diferencias)
  const TITULO = { kicker: 'GRADO PROFESIONAL  ·  TEORÍA', lineas: ['TRANSPORTE'], sub: 'Escrito · Mental · Diferencias' };

  // ---------------------------------------------------------------- utilidades de texto (las de «Escalas Mayores»)
  /** Línea de texto en la que ♭ ♯ ♮ se dibujan con Bravura y → ↑ ↓ son flechas dibujadas. segs: 'texto' o [['trozo', color], …]. */
  function frase(parent, segs, x, y, o) {
    o = o || {};
    const size = o.size || 36, peso = o.peso || 700, esp = size * 0.28;
    const G = N.group(parent, 'frase');
    const GL = { '♭': 'accidentalFlat', '♯': 'accidentalSharp', '♮': 'accidentalNatural' };
    if (typeof segs === 'string') segs = [[segs, o.fill || 'currentColor']];
    let cx = 0, prev = '';
    for (const [str, col] of segs) {
      const sub = () => { const q = N.group(G); if (col && col !== 'currentColor') color(q, col); return q; };
      for (const tr of str.split(/([♭♯♮→↑↓])/)) {
        if (!tr) continue;
        if (GL[tr]) {
          const gl = GL[tr], bem = tr === '♭';
          const pegada = /[A-Za-zÁÉÍÓÚáéíóúñÑ0-9]$/.test(prev);
          const sa = pegada ? size * 0.36 : size * (bem ? 0.31 : 0.29);
          const yo = pegada ? -size * 0.33 : (bem ? -0.7 * sa : -size * 0.36);
          const x0 = cx + size * (pegada ? 0.03 : 0.02);
          N.glyph(sub(), gl, x0, yo, sa);
          cx = x0 + N.M[gl].adv * sa + size * (pegada ? 0.08 : 0.04);
        } else if (tr === '→') {
          flecha(sub(), cx + size * 0.1, -size * 0.34, cx + size * 1.0, -size * 0.34, { w: size * 0.085, cab: size * 0.34 });
          cx += size * 1.1;
        } else if (tr === '↑' || tr === '↓') {
          const xa = cx + size * 0.3, yb = size * 0.02, ya = -size * 0.76;
          if (tr === '↑') flecha(sub(), xa, yb, xa, ya, { w: size * 0.09, cab: size * 0.34 });
          else flecha(sub(), xa, ya, xa, yb, { w: size * 0.09, cab: size * 0.34 });
          cx += size * 0.62;
        } else {
          if (/^\s/.test(tr)) cx += esp;
          const core = tr.trim();
          if (core) { const tt = texto(G, core, cx, 0, { size, peso, fill: col || 'currentColor', italic: o.italic, ls: o.ls }); cx += D.medir(tt); }
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
  /** Varias frases en una misma línea centrada en cx; cada una en su grupo (se animan por separado). */
  function lineaCentrada(parent, partes, cx, y, o) {
    const gs = partes.map(segs => { const w = N.group(parent); return { w, f: frase(w, segs, 0, y, o) }; });
    const gap = o.gap != null ? o.gap : (o.size || 36) * 0.3;
    const tot = gs.reduce((acc, p) => acc + p.f._w, 0) + gap * (gs.length - 1);
    let x = cx - tot / 2;
    for (const p of gs) { p.f.setAttribute('transform', `translate(${x.toFixed(1)},${y})`); p.f._x = x; p.w._f = p.f; x += p.f._w + gap; }
    return gs.map(p => p.w);
  }
  /** Máximo de win() sobre varios tramos [[a, b], …]. */
  function ventanas(t, vs, fi, fo) { let k = 0; for (const [p, q] of vs) k = Math.max(k, win(t, p, q, fi != null ? fi : .3, fo != null ? fo : .3)); return k; }
  /** Rosa mientras t está en alguno de los tramos (de `de` a `a`). */
  function rosaEn(s, g, vs, o) { o = o || {}; const de = o.de || C.blanco, a = o.a || C.rosa, d = o.d || .3; s.on(t => color(g, mezcla(de, a, ventanas(t, vs, d, d)))); }
  const hx3 = c => { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  /** Mezcla de dos colores hex que devuelve otro hex (se puede volver a mezclar). */
  const mixHex = (c1, c2, k) => { const p = hx3(c1), q = hx3(c2); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(k))).toString(16).padStart(2, '0')).join(''); };
  /** Secuencia de colores [[t, color], …] con transición d. */
  function colorSeq(s, g, seq, d) {
    d = d || 0.3;
    s.on(t => {
      let c = seq[0][1];
      for (let i = 1; i < seq.length; i++) { if (t < seq[i][0]) break; c = mezcla(seq[i - 1][1], seq[i][1], ease(ramp(t, seq[i][0], seq[i][0] + d))); }
      color(g, c);
    });
  }
  /** Mueve y escala un grupo (envoltorio) entre dos estados: de (x0, y0, k0) a (x1, y1, k1) entre ta y tb, alrededor de (cx, cy). */
  function viajeA(s, g, cx, cy, ta, tb, dx, dy, k1) {
    s.on(t => {
      const k = ease(ramp(t, ta, tb)), sc = lerp(1, k1 == null ? 1 : k1, k);
      g.setAttribute('transform', `translate(${(cx + dx * k).toFixed(1)},${(cy + dy * k).toFixed(1)}) scale(${sc.toFixed(4)}) translate(${-cx},${-cy})`);
    });
  }

  // ---------------------------------------------------------------- trazos que se dibujan (tachar, escribir)
  /** Trazo que se dibuja de t0 a t0+dur (d = path). Devuelve el path. */
  function trazoAnim(s, parent, d, t0, dur, o) {
    o = o || {};
    const p = N.el('path', { d, fill: 'none', stroke: 'currentColor', 'stroke-width': o.w || 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, parent);
    s.on(t => { const k = ease(ramp(t, t0, t0 + dur)); p.setAttribute('stroke-dashoffset', (1 - k).toFixed(4)); p.style.display = k <= 0.001 ? 'none' : ''; });
    return p;
  }
  /** Aspa fina que tacha una caja [x0, x1] × [y0, y1]: dos trazos seguidos desde t0. Devuelve el grupo (currentColor). */
  function tachaX(s, parent, x0, y0, x1, y1, t0, o) {
    o = o || {};
    const G = N.group(parent, 'tachaX');
    trazoAnim(s, G, `M${x0},${y0} L${x1},${y1}`, t0, 0.28, o);
    trazoAnim(s, G, `M${x1},${y0} L${x0},${y1}`, t0 + 0.26, 0.28, o);
    return G;
  }
  /** Tachón (una raya) sobre [x0, x1] a la altura y. */
  function tachon(s, parent, x0, x1, y, t0, o) {
    o = o || {};
    const G = N.group(parent, 'tachon');
    trazoAnim(s, G, `M${x0},${y + 5} L${x1},${y - 5}`, t0, o.dur || 0.35, { w: o.w || 5 });
    return G;
  }
  /** Lápiz (el de «Otras escalas»): la punta en (0,0). */
  function dibujoLapiz(g) {
    const P = N.group(g); P.setAttribute('transform', 'rotate(-52)');
    N.el('path', { d: 'M0,0 L17,-6.5 L17,6.5 Z', fill: '#e9d3ad', stroke: C.blanco, 'stroke-width': 2, 'stroke-linejoin': 'round' }, P);
    N.el('path', { d: 'M0,0 L6.5,-2.5 L6.5,2.5 Z', fill: C.rosa }, P);
    N.el('rect', { x: 17, y: -6.5, width: 60, height: 13, fill: '#0b1320', stroke: C.blanco, 'stroke-width': 2 }, P);
    N.el('rect', { x: 77, y: -6.5, width: 10, height: 13, fill: '#94a3b8', stroke: C.blanco, 'stroke-width': 2 }, P);
    N.el('rect', { x: 87, y: -6.5, width: 9, height: 13, rx: 3, fill: C.rosa, stroke: C.blanco, 'stroke-width': 2 }, P);
  }
  /** «Se escribe»: el grupo g se descubre de arriba abajo (caja x0..x1 × y0..y1) entre t0 y t0+dur,
   *  con el lápiz siguiendo el borde. Después el grupo queda entero. */
  let nClip = 0;
  function escribe(s, g, x0, y0, x1, y1, t0, dur, o) {
    o = o || {};
    const id = 'clipTr' + (nClip++);
    const defs = N.el('defs', null, g.parentNode);
    const cp = N.el('clipPath', { id, clipPathUnits: 'userSpaceOnUse' }, defs);
    const r = N.el('rect', { x: x0 - 6, y: y0 - 6, width: x1 - x0 + 12, height: 0 }, cp);
    g.setAttribute('clip-path', `url(#${id})`);
    const L = N.group(g.parentNode); dibujoLapiz(L);
    s.on(t => {
      const k = ramp(t, t0, t0 + dur), kk = ease(k);
      const h = (y1 - y0 + 12) * kk;
      r.setAttribute('height', h.toFixed(1));
      if (k >= 1) g.removeAttribute('clip-path'); else g.setAttribute('clip-path', `url(#${id})`);
      opa(g, t < t0 ? 0 : 1);
      const vis = o.lapiz === false ? 0 : win(t, t0 - 0.12, t0 + dur + 0.2, .12, .2);
      opa(L, vis);
      if (vis > 0) {
        const xm = (x0 + x1) / 2 + Math.sin(k * Math.PI * 5) * (x1 - x0) * 0.32;
        L.setAttribute('transform', `translate(${xm.toFixed(1)},${(y0 - 6 + h).toFixed(1)})`);
      }
    });
    return L;
  }

  // ---------------------------------------------------------------- partitura: clave, armadura, 2/4, notas con plicas y barras, divisorias
  const ESPF = { '8': 3.0, q: 4.3, h: 5.6 };          // avance de cada figura (sp)
  const DURQ = { '8': 0.5, q: 1, h: 2 };              // duración en negras
  const DURS = { '8': 0.25, q: 0.5, h: 1.0 };         // lo que suena (s) a ♩ = 120
  const GLA = { '#': 'accidentalSharp', b: 'accidentalFlat', n: 'accidentalNatural' };
  const NB = (p, n, alt, pre) => ({ p, n, alt: alt || null, pre: pre || 0 });
  // los ejemplos del libro (Apuntes 2GP, U9) — mismas notas y ritmo que suenan (pipe/p_transporte.py)
  const MEL_SOL = [[NB('G4', '8'), NB('F#4', '8'), NB('G4', '8'), NB('A4', '8')], [NB('B4', '8'), NB('D5', '8'), NB('C#5', '8', '#'), NB('C5', '8', 'n')], [NB('B4', 'h')]];
  const MEL_FA = [[NB('F4', '8'), NB('E4', '8'), NB('F4', '8'), NB('G4', '8')], [NB('A4', '8'), NB('C5', '8'), NB('B4', '8', 'n'), NB('Bb4', '8', 'b')], [NB('A4', 'h')]];
  const MEL_RE = (pre6) => [[NB('D5', 'q'), NB('C#5', '8'), NB('B4', '8')], [NB('A4', 'q'), NB('B4', '8'), NB('G#4', '8', '#', pre6)], [NB('A4', 'q'), NB('E4', 'q')]];
  const RE_FA = (alt6) => [[NB('F5', 'q'), NB('E5', '8'), NB('D5', '8')], [NB('C5', 'q'), NB('D5', '8'), NB(alt6 === '#' ? 'B#4' : 'B4', '8', alt6 === undefined ? 'n' : alt6, alt6 === null ? 1.15 : 0)], [NB('C5', 'q'), NB('G4', 'q')]];
  const RE_SIB = [[NB('Bb4', 'q'), NB('A4', '8'), NB('G4', '8')], [NB('F4', 'q'), NB('G4', '8'), NB('E4', '8', 'n')], [NB('F4', 'q'), NB('C4', 'q')]];

  /** Pentagrama completo. o: {x, yM, arm:[n, '#'|'b'], compases, xCompas?, xNotas?, minCompas?}.
   *  Devuelve {g, PL (líneas), lineas, CL (clave), AR (armadura: items), BL (bloque: compás + música), CO, MU, notas, vigas, divis, xFin…}.
   *  Cada nota: {g (entrada), c (color), h (cabeza), alt (alteración), st (plica), x, cx, y, pos, arriba, it}. */
  function partitura(parent, o) {
    const sp = SP, yM = o.yM, x = o.x;
    const G = N.group(parent, 'partitura'); color(G, C.blanco);
    const PL = N.group(G, 'lineas');
    const CL = N.group(G, 'clave'); N.claveSol(CL, x + 0.6 * sp, yM, sp);
    const AR = N.group(G, 'armadura');
    const arm = N.armaduraGen(AR, x + 3.9 * sp + 4, yM, sp, o.arm[0], o.arm[1]);
    const BL = N.group(G, 'bloque');
    const xC = o.xCompas != null ? o.xCompas : x + 3.9 * sp + 4 + arm.w + 0.9 * sp;
    const CO = N.group(BL, 'compas');
    const cs = N.compas(CO, { tipo: 'simple', num: '2', den: '4' }, xC, yM, sp);
    const xN = o.xNotas != null ? o.xNotas : xC + cs.w + 1.8 * sp;
    // 1) colocar
    const notas = [], divis = [];
    let cx = xN;
    o.compases.forEach((cm, j) => {
      const x0c = cx; let beat = 0;
      cm.forEach((it, i) => {
        cx += ((it.alt ? 1.15 : 0) + (it.pre || 0)) * sp;
        const pos = N.posSol(it.p);
        notas.push({ it, i: notas.length, compas: j, pos, x: cx, y: yM - pos * sp, beat, cx: cx + 0.59 * sp });
        beat += DURQ[it.n];
        if (i < cm.length - 1) cx += ESPF[it.n] * sp;
      });
      const ult = cm[cm.length - 1];
      let xb = cx + (ESPF[ult.n] - 0.6) * sp;
      const minW = (o.minCompas || 7.5) * sp;
      if (xb - x0c < minW) xb = x0c + minW;
      divis.push(xb);
      cx = xb + 1.6 * sp;
    });
    // 2) plicas: las corcheas de un mismo pulso van unidas; dirección por la suma de posiciones (como VexFlow)
    const grupos = {};
    notas.forEach(e => { e.arriba = e.pos < 0; if (e.it.n === '8') { const k = e.compas + ':' + Math.floor(e.beat + 1e-6); (grupos[k] = grupos[k] || []).push(e); } });
    for (const k in grupos) { const gr = grupos[k]; if (gr.length < 2) continue; const sum = gr.reduce((a, e) => a + e.pos, 0); gr.forEach(e => { e.arriba = sum < 0; e.grupo = gr; }); }
    const MU = N.group(BL, 'musica');
    const E = N.E;
    for (const e of notas) {
      e.g = N.group(MU, 'nota'); e.c = N.group(e.g);
      for (let lp = -3; lp >= e.pos - 1e-6; lp -= 1) N.line(e.c, e.x - E.ledgerExt * sp, yM - lp * sp, e.x + (1.18 + E.ledgerExt) * sp, yM - lp * sp, E.ledger * sp);
      for (let lp = 3; lp <= e.pos + 1e-6; lp += 1) N.line(e.c, e.x - E.ledgerExt * sp, yM - lp * sp, e.x + (1.18 + E.ledgerExt) * sp, yM - lp * sp, E.ledger * sp);
      e.h = N.group(e.c, 'cabeza'); N.glyph(e.h, e.it.n === 'h' ? 'noteheadHalf' : 'noteheadBlack', e.x, e.y, sp);
      if (e.it.alt) { const gl = GLA[e.it.alt]; e.alt = N.group(e.c, 'alt'); e.altX = e.x - (N.M[gl].adv + 0.22) * sp; N.glyph(e.alt, gl, e.altX, e.y, sp); }
      e.plicaX = e.arriba ? e.x + (1.18 - E.stem / 2) * sp : e.x + E.stem / 2 * sp;
      e.yBase = e.arriba ? e.y - 0.168 * sp : e.y + 0.168 * sp;
      let largo = 3.5;
      if (e.arriba && e.pos < -3.5) largo = Math.max(3.5, -e.pos);
      if (!e.arriba && e.pos > 3.5) largo = Math.max(3.5, e.pos);
      e.yPunta = e.arriba ? e.y - largo * sp : e.y + largo * sp;
    }
    const vigas = [];
    for (const k in grupos) {
      const gr = grupos[k]; if (gr.length < 2) continue;
      const arriba = gr[0].arriba;
      const dx = gr[gr.length - 1].plicaX - gr[0].plicaX, dpos = gr[gr.length - 1].pos - gr[0].pos;
      const incl = Math.sign(dpos) * Math.min(Math.abs(dpos) * 0.5, 1.0) * sp;
      const pend = dx > 0 ? -incl / dx : 0;
      const minLargo = 3.5 * sp;
      let c = arriba ? Infinity : -Infinity;
      for (const e of gr) { const yb = e.y + (arriba ? -minLargo : minLargo) - pend * (e.plicaX - gr[0].plicaX); c = arriba ? Math.min(c, yb) : Math.max(c, yb); }
      const yAt = xx => c + pend * (xx - gr[0].plicaX);
      const gb = N.group(MU, 'viga');
      const x1 = gr[0].plicaX - E.stem / 2 * sp, x2 = gr[gr.length - 1].plicaX + E.stem / 2 * sp;
      const h = E.beam * sp * (arriba ? 1 : -1);
      N.el('polygon', { points: `${x1.toFixed(2)},${yAt(x1).toFixed(2)} ${x2.toFixed(2)},${yAt(x2).toFixed(2)} ${x2.toFixed(2)},${(yAt(x2) + h).toFixed(2)} ${x1.toFixed(2)},${(yAt(x1) + h).toFixed(2)}`, fill: 'currentColor' }, gb);
      gr.forEach(e => { e.yPunta = yAt(e.plicaX); });
      vigas.push({ g: gb, idx: gr.map(e => e.i) });
    }
    for (const e of notas) {
      e.st = N.line(e.c, e.plicaX, e.yBase, e.plicaX, e.yPunta, E.stem * sp);
      if (e.it.n === '8' && !e.grupo) {
        const f = e.arriba ? 'flag8thUp' : 'flag8thDown', an = N.M[f].an[e.arriba ? 'stemUpNW' : 'stemDownSW'];
        N.glyph(e.c, f, e.plicaX - E.stem / 2 * sp - an[0] * sp, e.yPunta + an[1] * sp, sp);
      }
      e.yTop = Math.min(e.y - 0.6 * sp, e.yPunta); e.yBot = Math.max(e.y + 0.6 * sp, e.yPunta);
    }
    const DV = N.group(MU, 'divisorias');
    divis.forEach(xb => N.line(DV, xb, yM - 2 * sp, xb, yM + 2 * sp, E.thinBar * sp));
    const xFin = divis[divis.length - 1];
    const lineas = [];
    for (let k = -2; k <= 2; k++) lineas.push(N.line(PL, x, yM + k * sp, xFin, yM + k * sp, E.staffLine * sp));
    return { g: G, PL, lineas, CL, AR, arm, BL, CO, MU, DV, notas, vigas, divis, x, yM, xFin, xN, xC, csW: cs.w };
  }
  /** Colores de las notas de una partitura (una sola pista): fuentes = [f(i, t) → 0..1 rosa]; pulso(i, t) → latido de la cabeza. */
  function luces(s, R, fuentes, o) {
    o = o || {};
    s.on(t => {
      const ks = R.notas.map((e, i) => { let k = 0; for (const f of fuentes) k = Math.max(k, f(i, t) || 0); return clamp(k); });
      const base = o.base ? o.base(t) : C.blanco;
      R.notas.forEach((e, i) => {
        color(e.c, mezcla(base, C.rosa, ks[i]));
        if (o.pulso) {
          const kp = o.pulso(i, t), sc = 1 + 0.18 * kp;
          if (kp > 0.001) e.h.setAttribute('transform', `translate(${e.cx.toFixed(1)},${e.y.toFixed(1)}) scale(${sc.toFixed(4)}) translate(${(-e.cx).toFixed(1)},${(-e.y).toFixed(1)})`);
          else e.h.removeAttribute('transform');
        }
      });
      R.vigas.forEach(v => color(v.g, mezcla(base, C.rosa, Math.max(...v.idx.map(i => ks[i])))));
    });
  }
  /** Fuente de luz: cada nota se enciende con su ataque (marcas S[blq], a partir de la marca «desde»). */
  function suena(blq, R, desde) {
    const ts = (S[blq] || []).slice(desde || 0);
    const n = R.notas.length;
    return (i, t) => {
      const t0 = ts[i]; if (t0 == null) return 0;
      const d = DURS[R.notas[i].it.n] + (i === n - 1 ? 0.45 : 0.08);
      return win(t, t0 - 0.03, t0 + d + 0.12, .05, .22);
    };
  }
  function pulsoSuena(blq, R, desde) {
    const ts = (S[blq] || []).slice(desde || 0);
    return (i, t) => { const t0 = ts[i]; if (t0 == null) return 0; return win(t, t0 - 0.02, t0 + 0.34, .05, .26); };
  }
  /** Las notas de «fuente» se duplican y vuelan (una tras otra, desde ts[i]) hasta su sitio en «destino»:
   *  la copia (con el aspecto de la original) viaja y, al llegar, se convierte en la nota nueva. */
  function vuelan(s, fuente, destino, ts, dur, o) {
    o = o || {};
    const GH = N.group(o.capa || destino.g, 'copias'); color(GH, o.color || C.blanco);
    destino.notas.forEach((d, i) => {
      const f = fuente.notas[i];
      const gh = f.c.cloneNode(true); gh.removeAttribute('style'); GH.appendChild(gh);
      gh.querySelectorAll('[transform]').forEach(n => { if (n.getAttribute('class') === 'cabeza') n.removeAttribute('transform'); });
      const dx = d.x - f.x, dy = d.y - f.y;
      s.on(t => {
        const k = ease(ramp(t, ts[i], ts[i] + dur));
        opa(gh, t < ts[i] ? 0 : ramp(t, ts[i], ts[i] + 0.1) * (1 - ramp(k, 0.82, 1)));
        gh.setAttribute('transform', `translate(${(dx * k).toFixed(1)},${(dy * k - Math.sin(Math.PI * k) * (o.arco || 0)).toFixed(1)})`);
        opa(d.g, ramp(k, 0.8, 1));
      });
    });
    destino.vigas.forEach(v => s.on(t => opa(v.g, Math.min(...v.idx.map(i => ramp(t, ts[i] + dur * 0.8, ts[i] + dur))))));
    return GH;
  }
  /** Chip de tonalidad con dos estados: rosa en los tramos `rosa`, oscuro con borde blanco el resto. */
  function tonChip(s, parent, nota, x, y, ta, tb, rosa, o) {
    o = o || {};
    const W = N.group(parent, 'tonChip'), A = N.group(W), B = N.group(W);
    const size = o.size || 32;
    const a = chipTon(A, nota, 'mayor', x, y, { size, fondo: C.panel, borde: C.blanco });
    chipTon(B, nota, 'mayor', x, y, { size, borde: C.rosa });
    if (ta != null) pop(s, W, ta, tb, x, y, { k0: .6 });
    s.on(t => opa(B, ventanas(t, rosa || [], .3, .4)));
    W._w = a._w; W._h = a._h;
    return W;
  }
  /** Centro de la alteración j de una armadura (para «pop»). */
  function centroArm(A, j, yM, tipo) {
    const it = A.items[j], gl = tipo === 'b' ? 'accidentalFlat' : 'accidentalSharp';
    return [it.x + N.M[gl].adv * SP / 2, yM - it.pos * SP - (tipo === 'b' ? 0.5 * SP : 0)];
  }
  /** Flecha vertical con texto a su derecha (intervalo de transporte). */
  function flechaV(parent, x, y1, y2, txt, o) {
    o = o || {};
    const G = N.group(parent, 'flechaV');
    flecha(G, x, y1, x, y2, { w: o.w || 5, cab: o.cab || 18 });
    if (txt) frase(G, [[txt, 'currentColor']], x + 20, (y1 + y2) / 2 + 12, { size: o.size || 30, peso: 800 });
    return G;
  }

  // ================================================================ A · qué es transportar · el modo no cambia (Re M → Fa M → Si♭ M)
  function escenaDefinicion() {
    const a = F0('A1') - 0.25, b = F0('B1') - 0.25;
    escena('definicion', a, b, (s, g) => {
      const fin = b - 0.3, tA2 = F0('A2') - 0.25, tA3 = F0('A3') - 0.3;
      // ---------- A1 · escribir o interpretar una obra en una tonalidad distinta (más grave o más aguda)
      const kt = N.group(g); chip(kt, 'TRANSPORTAR', CX, 250, { size: 42, anchor: 'middle' });
      pop(s, kt, Wd('A1', 'transportar') - 0.1, tA3 + 0.2, CX, 250);
      const tEs = Wd('A1', 'escribir') - 0.15, tIn = Wd('A1', 'interpretar') - 0.15, tO = Wd('A1', 'o') - 0.1;
      const yI = 410, yL = 520;
      const IE = N.group(g), IEi = N.group(IE); icoLapiz(IEi, CX - 250, yI, 1.35); color(IEi, C.blanco);
      texto(IE, 'escribir', CX - 250, yL, { anchor: 'middle', size: 44, peso: 800, fill: C.blanco });
      aparece(s, IE, tEs, tA2, { dy: 12 });
      rosaEn(s, IEi, [[tEs, tEs + 1.2]]);
      const oo = texto(g, 'o', CX, 480, { anchor: 'middle', size: 40, peso: 700, italic: true, fill: C.suave });
      aparece(s, oo, tO, tA2, { dy: 6 });
      const II = N.group(g), IIi = N.group(II); icoLira(IIi, CX + 250, yI); color(IIi, C.blanco);
      texto(II, 'interpretar', CX + 250, yL, { anchor: 'middle', size: 44, peso: 800, fill: C.blanco });
      aparece(s, II, tIn, tA2, { dy: 12 });
      rosaEn(s, IIi, [[tIn, tIn + 1.2]]);
      const [o1, o2] = lineaCentrada(g, [[['una obra en', C.blanco]], [['otra tonalidad', C.rosa]]], CX, 660, { size: 50, peso: 800, gap: 16 });
      aparece(s, o1, Wd('A1', 'obra') - 0.2, tA2, { dy: 8 });
      aparece(s, o2, Wd('A1', 'tonalidad') - 0.15, tA2, { dy: 8 });
      const gr = fraseG(g, [['↓ más grave', C.blanco]], CX - 230, 790, { size: 42, peso: 800, anchor: 'middle' });
      aparece(s, gr, Wd('A1', 'grave') - 0.2, tA2, { dy: -10 });
      const ag = fraseG(g, [['más aguda ↑', C.blanco]], CX + 230, 790, { size: 42, peso: 800, anchor: 'middle' });
      aparece(s, ag, Wd('A1', 'aguda') - 0.2, tA2, { dy: 10 });
      // ---------- A2 · ¡ojo! el transporte es absoluto: el modo no cambia
      const kj = N.group(g); chip(kj, '¡OJO!', CX, 430, { size: 32, anchor: 'middle', relleno: false });
      pop(s, kj, Wd('A2', 'ojo') - 0.1, tA3, CX, 430);
      const ab = fraseG(g, [['el transporte es ', C.blanco], ['absoluto', C.rosa]], CX, 560, { size: 52, peso: 800, anchor: 'middle' });
      aparece(s, ab, Wd('A2', 'absoluto') - 0.25, tA3, { dy: 8 });
      // «el modo no cambia» se queda: sube y se hace cabecera del ejemplo
      const tMo = Wd('A2', 'modo') - 0.25;
      const MO = N.group(g), MOi = N.group(MO);
      frase(MOi, [['el modo ', C.blanco], ['no cambia', C.rosa]], CX, 676, { size: 58, peso: 800, anchor: 'middle' });
      aparece(s, MO, tMo, fin, { dy: 8 });
      viajeA(s, MOi, CX, 656, tA3 + 0.1, tA3 + 0.9, 0, 140 - 656, 0.72);

      // ---------- A3–A4 · una melodía en Re M (alegre = Mayor), subida (Fa M) y bajada (Si♭ M): sigue siendo Mayor
      const xS = 450, xL = 302, Y = [320, 560, 800];           // Fa M (arriba) · Re M (en medio) · Si♭ M (abajo)
      const sp = SP, xA = xS + 3.9 * sp + 4, xC = xA + 2 * (N.M.accidentalSharp.adv + 0.14) * sp + 0.9 * sp;
      const xN = xC + N.anchoCompas({ tipo: 'simple', num: '2', den: '4' }, sp) + 1.8 * sp;
      const tMel = Wd('A3', 'melodia') - 0.2, tSub = Wd('A4', 'subas') - 0.15, tBaj = Wd('A4', 'bajes') - 0.15;
      const tMay1 = Wd('A4', 'mayor') - 0.15, tSie = Wd('A4', 'siendo') - 0.1, tMay2 = Wd('A4', 'mayor', 2) - 0.15;
      const V = [Wd('A4', 'mayor') + 0, 0, 0];
      const vS = S.SON_DEF_versiones || [F0('SON_DEF') + 0.15, F0('SON_DEF') + 3.65, F0('SON_DEF') + 7.15];
      const fSon = F1('SON_DEF') - 0.5;
      // qué pentagrama suena (para atenuar los otros): versión 0 = Re M (en medio), 1 = Fa M (arriba), 2 = Si♭ M (abajo)
      const suenaV = (v, t) => win(t, vS[v] - 0.25, (v < 2 ? vS[v + 1] - 0.3 : fSon), .2, .3);
      const dim = (v, t) => { let otro = 0; for (let w = 0; w < 3; w++) if (w !== v) otro = Math.max(otro, suenaV(w, t)); return 1 - 0.62 * otro * (1 - suenaV(v, t)); };
      const DEF = [
        { y: Y[1], nota: 'D', arm: [2, '#'], comp: MEL_RE(0), v: 0, t0: tMel, tChip: tMel + 0.3 },
        { y: Y[0], nota: 'F', arm: [1, 'b'], comp: RE_FA(), v: 1, t0: tSub - 0.2, tChip: tSub + 0.35 },
        { y: Y[2], nota: 'Bb', arm: [2, 'b'], comp: RE_SIB, v: 2, t0: tBaj - 0.2, tChip: tBaj + 0.35 },
      ];
      const R = DEF.map(d => {
        const W = N.group(g);
        const P = partitura(W, { x: xS, yM: d.y, arm: d.arm, compases: d.comp, xCompas: xC, xNotas: xN });
        s.on(t => opa(W, win(t, d.t0, fin, .4, .4) * dim(d.v, t)));
        // la etiqueta: tonalidad y modo
        const E = N.group(g);
        s.on(t => opa(E, dim(d.v, t)));
        const ch = tonChip(s, E, d.nota, xL, d.y - 20, d.tChip, fin, [[d.tChip, d.tChip + 1.2], [vS[d.v] - 0.2, vS[d.v] + 3.2]], { size: 32 });
        const my = N.group(E); texto(my, 'Mayor', xL, d.y + 52, { anchor: 'middle', size: 32, peso: 800, italic: true, fill: 'currentColor' });
        const tMy = d.v === 0 ? tMay1 : tSie;
        mostrarEn(s, my, tMy, fin, .35);
        rosaEn(s, my, [[tMy, tMy + 1.4], [tMay2, tMay2 + 1.6], [vS[d.v] - 0.2, vS[d.v] + 3.2]]);
        return { W, P, E, d };
      });
      // «alegre» antes de «Mayor» (en el mismo sitio)
      const al = texto(g, 'alegre', xL, Y[1] + 52, { anchor: 'middle', size: 32, peso: 700, italic: true, fill: C.suave });
      mostrarEn(s, al, Wd('A4', 'alegre') - 0.15, tMay1, .3, .25);
      // la melodía de Re M: entra nota a nota; las otras dos llegan volando (el mismo dibujo, más agudo y más grave)
      const P0 = R[0].P;
      P0.notas.forEach((e, i) => pop(s, e.g, tMel + 0.25 + i * 0.07, 1e9, e.cx, e.y, { k0: .4, fi: .25 }));
      P0.vigas.forEach(v => mostrarEn(s, v.g, tMel + 0.25 + v.idx[1] * 0.07, 1e9, .25));
      vuelan(s, P0, R[1].P, P0.notas.map((_, i) => tSub + i * 0.06), 0.75, { capa: g });
      vuelan(s, P0, R[2].P, P0.notas.map((_, i) => tBaj + i * 0.06), 0.75, { capa: g });
      // latido de las notas que suenan (SON_DEF: 8 + 8 + 8 marcas)
      R.forEach(r => luces(s, r.P, [suena('SON_DEF', r.P, 8 * r.d.v)], { pulso: pulsoSuena('SON_DEF', r.P, 8 * r.d.v) }));
      R.forEach(r => {
        const O = N.group(g), Oi = N.group(O); icoOido(Oi, 0, 0, 0.8); color(Oi, C.rosa);
        const xo = r.P.xFin + 230, v = r.d.v;
        O.setAttribute('transform', `translate(${xo},${r.d.y})`);
        s.on(t => { const k = suenaV(v, t); opa(O, k); Oi.setAttribute('transform', `scale(${(1 + 0.06 * Math.sin(t * 9) * k).toFixed(3)})`); });
      });
      // flechas: subir (3ªm ↑) y bajar (3M ↓)
      const xF = P0.xFin + 70;
      const FS = N.group(g), FB = N.group(g);
      flechaV(FS, xF, Y[1] - 60, Y[0] + 70, '3ªm', { size: 28 }); flechaV(FB, xF, Y[1] + 60, Y[2] - 70, '3M', { size: 28 });
      mostrarEn(s, FS, tSub, fin); mostrarEn(s, FB, tBaj, fin);
      colorSeq(s, FS, [[-1, C.suave], [Wd('A4', 'arriba') - 0.2, C.rosa], [F0('SON_DEF') - 0.2, C.suave]]);
      colorSeq(s, FB, [[-1, C.suave], [Wd('A4', 'abajo') - 0.2, C.rosa], [F0('SON_DEF') - 0.2, C.suave]]);
      // abajo: no son los relativos · subir o bajar «por la fuerza»
      const yB = 960;
      const re = fraseG(g, [['nada que ver con los ', C.suave], ['relativos', C.blanco]], CX, yB, { size: 34, peso: 700, anchor: 'middle' });
      const tRe = Wd('A4', 'relativos') - 0.25, tSu = Wd('A4', 'subir') - 0.25;
      aparece(s, re, tRe, tSu - 0.1, { dy: 6 });
      const wRe = re._f._w, xRe0 = re._f._x;
      const tr = N.group(g); color(tr, C.rosa);
      tachon(s, tr, xRe0 + wRe - D.medir(re._f.lastChild) - 6, xRe0 + wRe + 6, yB - 12, Wd('A4', 'ni') - 0.1);
      mostrarEn(s, tr, tRe, tSu - 0.1, .01, .3);
      const fu = fraseG(g, [['subir o bajar, ', C.blanco], ['por la fuerza', C.rosa]], CX, yB, { size: 34, peso: 800, anchor: 'middle' });
      aparece(s, fu, tSu, F0('SON_DEF') + 0.2, { dy: 6 });
      void V;
    });
  }

  // ---------------------------------------------------------------- iconos propios (línea fina, currentColor)
  /** Cabeza de perfil con un rayo dentro (transporte mental: «darle a la cabeza», reflejos). */
  function icoCabeza(g, cx, cy, s) {
    const G = N.group(g, 'ico'); s = s || 1;
    const P = (x, y) => `${(cx + x * s).toFixed(1)},${(cy + y * s).toFixed(1)}`;
    N.el('path', { d: `M${P(-26, 50)} L${P(-26, 24)} C${P(-50, 6)} ${P(-48, -44)} ${P(-6, -52)} C${P(32, -58)} ${P(52, -30)} ${P(46, -6)} L${P(56, 14)} L${P(46, 17)} L${P(46, 30)} C${P(46, 40)} ${P(36, 42)} ${P(24, 40)} L${P(22, 50)}`,
      fill: 'none', stroke: 'currentColor', 'stroke-width': 5 * s, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, G);
    N.el('path', { d: `M${P(4, -38)} L${P(-12, -6)} L${P(4, -6)} L${P(-6, 22)} L${P(18, -14)} L${P(2, -14)} L${P(14, -38)} Z`, fill: 'currentColor' }, G);
    return G;
  }
  /** Escribir: pentagrama corto con tres cabezas y un lápiz. */
  function icoEscribir(g, x, y, s) {
    const G = N.group(g, 'ico'); s = s || 1;
    for (let k = -2; k <= 2; k++) N.line(G, x - 70 * s, y + k * 13 * s, x + 50 * s, y + k * 13 * s, 2.2 * s, { stroke: 'currentColor' });
    [[-46, 13], [-14, 0], [18, -13]].forEach(([dx, dy]) => N.el('ellipse', { cx: x + dx * s, cy: y + dy * s, rx: 9 * s, ry: 6.5 * s, transform: `rotate(-20 ${x + dx * s} ${y + dy * s})`, fill: 'currentColor' }, G));
    icoLapiz(G, x + 58 * s, y - 34 * s, 0.9 * s);
    return G;
  }
  /** Portátil con una partitura en la pantalla y el cursor. Devuelve {G, cursor}. */
  function icoPortatil(g, cx, cy, s) {
    const G = N.group(g, 'ico'); s = s || 1;
    N.el('rect', { x: cx - 46 * s, y: cy - 34 * s, width: 92 * s, height: 58 * s, rx: 6 * s, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 * s }, G);
    N.el('path', { d: `M${cx - 60 * s},${cy + 32 * s} H${cx + 60 * s} L${cx + 52 * s},${cy + 40 * s} H${cx - 52 * s} Z`, fill: 'currentColor' }, G);
    for (let k = -1; k <= 1; k++) N.line(G, cx - 34 * s, cy - 6 * s + k * 9 * s, cx + 34 * s, cy - 6 * s + k * 9 * s, 1.8 * s, { stroke: 'currentColor', opacity: 0.7 });
    const cur = N.group(G);
    N.el('path', { d: `M${cx + 8 * s},${cy - 2 * s} l${16 * s},${14 * s} l${-7 * s},${1 * s} l${5 * s},${9 * s} l${-4 * s},${2 * s} l${-5 * s},${-9 * s} l${-5 * s},${5 * s} Z`, fill: C.blanco, stroke: '#0b1320', 'stroke-width': 1.5 }, cur);
    return { G, cur };
  }
  /** Montón de hojas de partitura (cada hoja en su grupo, para que entren una tras otra). */
  function icoHojas(g, cx, cy, n, s) {
    s = s || 1;
    const hs = [];
    for (let i = 0; i < n; i++) {
      const H = N.group(g, 'hoja'), dx = (i - (n - 1) / 2) * 9 * s, dy = -(i - (n - 1) / 2) * 7 * s;
      N.el('rect', { x: cx + dx - 22 * s, y: cy + dy - 28 * s, width: 44 * s, height: 56 * s, rx: 4 * s, fill: '#0b1320', stroke: 'currentColor', 'stroke-width': 2.5 * s }, H);
      for (let k = 0; k < 4; k++) N.line(H, cx + dx - 14 * s, cy + dy - 16 * s + k * 10 * s, cx + dx + 14 * s, cy + dy - 16 * s + k * 10 * s, 1.6 * s, { stroke: 'currentColor', opacity: 0.7 });
      hs.push(H);
    }
    return hs;
  }
  /** Reloj (poco tiempo). */
  function icoReloj(g, cx, cy, s) {
    const G = N.group(g, 'ico'); s = s || 1;
    N.el('circle', { cx, cy, r: 40 * s, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 * s }, G);
    N.line(G, cx, cy, cx, cy - 26 * s, 5 * s, { 'stroke-linecap': 'round' });
    N.line(G, cx, cy, cx + 18 * s, cy + 8 * s, 5 * s, { 'stroke-linecap': 'round' });
    N.el('circle', { cx, cy, r: 4 * s, fill: 'currentColor' }, G);
    return G;
  }

  // ---------------------------------------------------------------- piezas comunes de las secciones «escrito» y «mental»
  /** Las dos formas de transportar (ESCRITO · MENTAL). act = 0 | 1: la que se explica (rosa) desde tAct; la otra se atenúa.
   *  A partir de tSale, la activa vuela a la cabecera (y la otra se va). */
  function dosFormas(s, g, act, tIn, tAct, tSale, yC) {
    const W = 440, H = 300, y = yC || 540, xs = [CX - 270, CX + 270];
    const tits = ['ESCRITO', 'MENTAL'];
    xs.forEach((x, i) => {
      const out = N.group(g), mov = N.group(out), G = N.group(mov);
      const R = panel(G, x - W / 2, y - H / 2, W, H, { rx: 24, stroke: '#3a4556', sw: 2 });
      const ic = N.group(G);
      if (i === 0) icoEscribir(ic, x + 6, y - 40, 1.2); else icoCabeza(ic, x, y - 44, 1.05);
      const tt = N.group(G); texto(tt, tits[i], x, y + 100, { anchor: 'middle', size: 44, peso: 800, ls: '0.12em', fill: 'currentColor' });
      pop(s, out, tIn + i * 0.2, tSale + 0.6, x, y, { k0: .75 });
      s.on(t => {
        const k = i === act ? ease(ramp(t, tAct, tAct + 0.4)) : 0;
        R.setAttribute('stroke', mezcla('#3a4556', C.rosa, k)); R.setAttribute('stroke-width', (2 + 1.5 * k).toFixed(2));
        color(tt, mezcla(C.blanco, C.rosa, k)); color(ic, mezcla(C.blanco, C.rosa, k));
        const dimK = i !== act ? ease(ramp(t, tAct, tAct + 0.4)) : 0;
        opa(G, 1 - 0.62 * dimK);
      });
      if (i === act) viajeA(s, mov, x, y, tSale, tSale + 0.6, CX - x, 122 - y, 0.35);
    });
  }
  /** Enunciado centrado: «texto» + chip de intervalo + flecha (dir 1 ↑ / −1 ↓). Devuelve [grupo texto, chip, flecha]. */
  function enunciado(parent, txt, intv, dir, y) {
    const A = N.group(parent), B = N.group(parent), F = N.group(parent);
    const f = frase(A, [[txt, C.blanco]], 0, y + 12, { size: 36, peso: 800 });
    const c = chipInt(B, intv, 0, y, { size: 30, anchor: 'start' });
    const wF = 30, gap = 18, tot = f._w + gap + c._w + 12 + wF;
    const x0 = CX - tot / 2;
    f.setAttribute('transform', `translate(${x0.toFixed(1)},${y + 12})`);
    c.setAttribute('transform', `translate(${(x0 + f._w + gap).toFixed(1)},${y})`);
    const xf = x0 + f._w + gap + c._w + 12 + wF / 2; color(F, C.rosa);
    if (dir > 0) flecha(F, xf, y + 22, xf, y - 24, { w: 5, cab: 16 }); else flecha(F, xf, y - 24, xf, y + 22, { w: 5, cab: 16 });
    A._cx = x0 + f._w / 2; B._cx = x0 + f._w + gap + c._w / 2; F._cx = xf;
    return [A, B, F];
  }
  /** Fila de tarjetas de pasos (abajo); cada una se enciende en su tramo. R = [{n, segs, t0, t1}]. */
  function pasosFila(s, g, R, y, tIn, fin, anchoC) {
    const wC = anchoC || 520, gap = anchoC ? 26 : 34, hC = 92, x0 = CX - (R.length * wC + (R.length - 1) * gap) / 2;
    R.forEach((r, i) => {
      const G = N.group(g), x = x0 + i * (wC + gap);
      const rect = panel(G, x, y - hC / 2, wC, hC, { rx: 18 });
      const num = N.group(G);
      N.el('circle', { cx: x + 50, cy: y, r: 26, fill: 'none', stroke: 'currentColor', 'stroke-width': 3 }, num);
      texto(num, r.n, x + 50, y + 11, { anchor: 'middle', size: 30, peso: 800, fill: 'currentColor' });
      const tt = N.group(G); frase(tt, r.segs, x + 94, y + 11, { size: 29, peso: 800 });
      aparece(s, G, tIn + i * 0.15, fin, { dy: 10 });
      s.on(t => {
        const k = win(t, r.t0, r.t1, .3, .3);
        color(tt, mezcla(C.suave, C.blanco, k)); color(num, mezcla(C.suave, C.rosa, k));
        rect.setAttribute('stroke', mezcla('#3a4556', C.rosa, k)); rect.setAttribute('stroke-width', (1.5 + 1.5 * k).toFixed(2));
      });
    });
  }
  /** Panel de ventajas / desventajas con su rótulo. Devuelve {G, x, y, w, h}. */
  function panelLista(s, g, x, y, w, h, rotulo, ta, fin) {
    const G = N.group(g);
    panel(G, x, y, w, h, { rx: 22, stroke: 'rgba(248,250,252,0.3)', sw: 2 });
    texto(G, rotulo, x + 40, y + 50, { size: 24, peso: 800, ls: '0.22em', fill: C.rosa });
    aparece(s, G, ta, fin, { dy: 12 });
    return { G, x, y, w, h };
  }
  /** Una línea de la lista: ✓ / ✗ y el texto. Los trozos en 'currentColor' van en rosa mientras se dicen (hasta o.tBlanco)
   *  y luego en blanco. Devuelve el grupo (con _w). */
  function itemLista(s, g, ok, segs, x, y, ta, fin, o) {
    o = o || {};
    const G = N.group(g);
    const m = N.group(G); marca(m, ok, x + 16, y - 12, 13);
    const f = frase(G, segs, x + 50, y, { size: o.size || 34, peso: 800 });
    aparece(s, G, ta, fin, { dy: 8 });
    colorSeq(s, G, [[-1, C.rosa], [o.tBlanco != null ? o.tBlanco : ta + 2.5, C.blanco]], .5);
    G._w = 50 + f._w;
    return G;
  }

  // ================================================================ B · transporte escrito: Sol M → (2M ↓) → Fa M; desventajas y ventaja
  function escenaEscrito() {
    const a = F0('B1') - 0.25, b = F0('M1') - 0.3;
    escena('escrito', a, b, (s, g) => {
      const fin = b - 0.3;
      // ---------- B1–B3 · dos formas; la primera, el escrito: reescribir la pieza en la nueva tonalidad
      const tDos = Wd('B1', 'dos') - 0.2, tEsc = Wd('B2', 'escrito') - 0.2, tEj = Wd('B4', 'mira') - 0.2;
      const df = fraseG(g, [['dos formas', C.rosa], [' de transportar', C.blanco]], CX, 280, { size: 48, peso: 800, anchor: 'middle' });
      aparece(s, df, Wd('B1', 'ver') - 0.2, tEj, { dy: 8 });
      dosFormas(s, g, 0, tDos + 0.1, tEsc, tEj);
      const re = fraseG(g, [['reescribir la pieza ', C.blanco], ['en la nueva tonalidad', C.rosa]], CX, 800, { size: 40, peso: 800, anchor: 'middle' });
      aparece(s, re, Wd('B3', 'reescribir') - 0.2, tEj, { dy: 8 });
      const kc = N.group(g); chip(kc, 'TRANSPORTE ESCRITO', CX, 122, { size: 30, anchor: 'middle' });
      pop(s, kc, tEj + 0.35, fin, CX, 122);
      // ---------- B4–B5 · el ejemplo: transportar esta melodía una 2M ↓
      const tB10 = F0('B10') - 0.2, tUp = Wd('B7', 'ahora') - 0.5;
      const BQ = N.group(g);                                     // enunciado + melodía original: centrados mientras están solos; suben al llegar el 2.º pentagrama
      s.on(t => BQ.setAttribute('transform', `translate(0,${(175 * (1 - ease(ramp(t, tUp, tUp + 0.7)))).toFixed(1)})`));
      const [e1, e2, e3] = enunciado(BQ, 'transportar esta melodía una', '2M', -1, 205);
      aparece(s, e1, Wd('B5', 'transportar') - 0.2, tB10, { dy: 6 });
      pop(s, e2, Wd('B5', 'segunda') - 0.15, tB10, e2._cx, 205);
      aparece(s, e3, Wd('B5', 'descendente') - 0.15, tB10, { dy: -8 });
      const xS = 470, xL = 320, yA = 330, yB = 560, sp = SP;
      const xC = xS + 3.9 * sp + 4 + (N.M.accidentalSharp.adv + 0.14) * sp + 0.9 * sp;
      const xN = xC + N.anchoCompas({ tipo: 'simple', num: '2', den: '4' }, sp) + 1.8 * sp;
      const WA = N.group(BQ), WB = N.group(g);
      const PA = partitura(WA, { x: xS, yM: yA, arm: [1, '#'], compases: MEL_SOL, xCompas: xC, xNotas: xN, minCompas: 6 });
      const PB = partitura(WB, { x: xS, yM: yB, arm: [1, 'b'], compases: MEL_FA, xCompas: xC, xNotas: xN, minCompas: 6 });
      const tMira = Wd('B4', 'ejemplo') - 0.2;
      PA.notas.forEach((e, i) => pop(s, e.g, tMira + 0.2 + i * 0.06, 1e9, e.cx, e.y, { k0: .4, fi: .25 }));
      PA.vigas.forEach(v => mostrarEn(s, v.g, tMira + 0.2 + v.idx[1] * 0.06, 1e9, .25));
      // ---------- B6 · paso 1: la tonalidad de partida (Sol M, 1♯)
      const tPri = Wd('B6', 'primero') - 0.2, tTon = Wd('B6', 'tonalidad') - 0.15, tSol = Wd('B6', 'sol') - 0.15;
      const tB7 = F0('B7') - 0.1, tArm = Wd('B7', 'armadura') - 0.15, tB9 = F0('B9') - 0.1;
      const tBaj = Wd('B8', 'bajar') - 0.15, tFa = Wd('B8', 'fa') - 0.15, tBem = Wd('B8', 'bemol') - 0.3;
      pasosFila(s, g, [
        { n: '1', segs: [['tonalidad de partida', 'currentColor']], t0: tPri, t1: tB7 },
        { n: '2', segs: [['armadura nueva', 'currentColor']], t0: tB7, t1: tB9 },
        { n: '3', segs: [['cada nota, una 2M ↓', 'currentColor']], t0: tB9, t1: tB10 },
      ], 790, tPri, tB10);
      rosaEn(s, PA.AR, [[tTon, tSol + 1.4]]);
      tonChip(s, BQ, 'G', xL, yA, tSol, fin, [[tSol, tSol + 1.4]]);
      // ---------- B7–B8 · paso 2: la armadura de la nueva tonalidad (2M ↓ → Fa M → un bemol)
      mostrarEn(s, PB.PL, tUp + 0.6, fin, .4); mostrarEn(s, PB.CL, tUp + 0.6, fin, .4);
      s.on(t => opa(WB, 1 - ease(ramp(t, fin - 0.4, fin))));
      const xAr = PB.arm.items[0].x;
      const hu = N.group(g); color(hu, C.rosa);
      N.el('rect', { x: xAr - 12, y: yB - 2.7 * sp, width: 1.0 * sp + 24, height: 5.4 * sp, rx: 10, fill: C.panel, 'fill-opacity': 0.92, stroke: 'currentColor', 'stroke-width': 3, 'stroke-dasharray': '8 7' }, hu);
      interrogacion(hu, xAr + 0.5 * sp, yB + 21, 58);
      mostrarEn(s, hu, tArm, tBem + 0.1, .3, .3);
      const FL = N.group(g); color(FL, C.rosa);
      flecha(FL, xL, yA + 44, xL, yB - 44, { w: 5, cab: 18 });
      frase(FL, [['2M', 'currentColor']], xL - 22, (yA + yB) / 2 + 12, { size: 32, peso: 800, anchor: 'end' });
      aparece(s, FL, tBaj, fin, { dy: -10 });
      colorSeq(s, FL, [[-1, C.rosa], [tFa + 1.6, C.suave]]);
      tonChip(s, g, 'F', xL, yB, tFa, fin, [[tFa, tFa + 1.4]]);
      opa(PB.AR, 0);
      escribe(s, PB.AR, xAr, yB - 1.9 * sp, xAr + 0.95 * sp, yB + 0.8 * sp, tBem, 0.55);
      rosaEn(s, PB.AR, [[tBem, tBem + 1.8]]);
      // ---------- B9 · paso 3: reescribir la partitura (cada nota, una 2M más abajo)
      const tRe = Wd('B9', 'reescribir') - 0.25;
      mostrarEn(s, PB.CO, tRe, fin, .3);
      mostrarEn(s, PB.DV, tRe + 0.3, fin, .3);
      vuelan(s, PA, PB, PA.notas.map((_, i) => tRe + i * 0.08), 0.75, { capa: g, arco: 30 });
      // sonidos
      const tEsc1 = F1('B9');
      luces(s, PA, [suena('SON_ESC_SOL', PA)], { pulso: pulsoSuena('SON_ESC_SOL', PA) });
      oido(s, BQ, PA.xFin + 70, yA, ['SON_ESC_SOL']); oido(s, g, PB.xFin + 70, yB, ['SON_ESC_FA']);
      // ---------- B10–B13 · desventajas (el panel, centrado mientras está solo; se aparta cuando llega la ventaja)
      const tDes = Wd('B10', 'desventajas') - 0.2, tMol = Wd('B10', 'escribirlo') - 0.2;
      const tVen = Wd('B14', 'ventaja') - 0.2, tToc = Wd('B14', 'tocas') - 0.2, tPen = Wd('B14', 'pensar') - 0.25;
      const tTres = Wd('B11', 'tres') - 0.2, tSin = Wd('B11', 'sinfonia') - 0.2;
      const tPro = Wd('B12', 'programa') - 0.2, tCli = Wd('B12', 'uno') - 0.15, tMan = Wd('B12', 'manuscritas') - 0.25;
      const tOri = Wd('B13', 'original') - 0.2, tUti = Wd('B13', 'utilizar') - 0.2, tDesp = Wd('B13', 'desperdicio') - 0.2;
      const DES = N.group(g);
      s.on(t => DES.setAttribute('transform', `translate(${(335 * (1 - ease(ramp(t, tVen - 0.35, tVen + 0.35)))).toFixed(1)},0)`));
      const PD = panelLista(s, DES, 170, 690, 910, 285, 'DESVENTAJAS', tDes, fin);
      const x0 = PD.x + 40;
      itemLista(s, DES, false, [['escribirlo ', C.blanco], ['de nuevo', 'currentColor']], x0, PD.y + 108, tMol, fin, { tBlanco: tTres - 0.2 });
      const it2 = itemLista(s, DES, false, [['3 compases… ', C.blanco]], x0, PD.y + 164, tTres, fin);
      const s2 = fraseG(DES, [['¿y una ', C.blanco], ['sinfonía entera', 'currentColor'], ['?', C.blanco]], x0 + it2._w + 8, PD.y + 164, { size: 34, peso: 800 });
      aparece(s, s2, tSin, fin, { dy: 8 });
      colorSeq(s, s2, [[-1, C.rosa], [tPro, C.blanco]], .5);
      const xH = PD.x + PD.w - 78, HO = N.group(DES); color(HO, C.suave);
      icoHojas(HO, xH, PD.y + 150, 5, 0.9).forEach((h, i) => pop(s, h, tSin + 0.2 + i * 0.12, fin, xH, PD.y + 150, { k0: .5, fi: .2 }));
      // los tres compases del ejemplo, uno a uno
      PB.divis.forEach((xb, j) => {
        const xa = j === 0 ? PB.xN - 0.8 * sp : PB.divis[j - 1];
        const r = N.el('rect', { x: xa + 4, y: yB - 2 * sp, width: xb - xa - 8, height: 4 * sp, rx: 6, fill: C.rosa, 'fill-opacity': 0.2 }, WB);
        WB.insertBefore(r, WB.firstChild);
        mostrarEn(s, r, tTres + 0.15 + j * 0.16, tSin + 0.2, .15, .4);
      });
      // B12 · en digital, uno o dos clics… pero a mano, imagínate
      const yS2 = PD.y + 210;
      const LP = N.group(DES), LPi = icoPortatil(LP, x0 + 64, yS2 - 10, 0.5); color(LP, C.suave);
      const d1 = fraseG(DES, [['en digital: ', C.suave], ['1 o 2 clics', C.blanco]], x0 + 110, yS2, { size: 27, peso: 700 });
      aparece(s, LP, tPro, fin, { dy: 6 }); aparece(s, d1, tCli, fin, { dy: 6 });
      s.on(t => { const k = Math.max(win(t, tCli, tCli + 0.25, .05, .15), win(t, tCli + 0.32, tCli + 0.57, .05, .15)); LPi.cur.setAttribute('transform', `translate(0,${(3 * k).toFixed(1)})`); });
      const xM = x0 + 110 + d1._f._w + 50;
      const MA = N.group(DES); icoLapiz(MA, xM, yS2 - 9, 0.42); color(MA, C.suave);
      const d2 = fraseG(DES, [['a mano: ', C.suave], ['¡imagínate!', 'currentColor']], xM + 30, yS2, { size: 27, peso: 700 });
      aparece(s, MA, tMan, fin, { dy: 6 }); aparece(s, d2, tMan + 0.1, fin, { dy: 6 });
      colorSeq(s, d2, [[-1, C.rosa], [tOri, C.blanco]], .5);
      // B13 · la partitura original ya no se usa: se tacha · desperdicio de papel
      const TA = N.group(g);
      trazoAnim(s, TA, `M${xS + 40},${yA + 80} L${PA.xFin - 40},${yA - 80}`, tUti, 0.5, { w: 6 });
      mostrarEn(s, TA, tUti, fin, .01, .3);
      colorSeq(s, TA, [[-1, C.rosa], [tVen, C.suave]], .5);
      s.on(t => opa(WA, win(t, tMira, fin, .4, .4) * (1 - 0.6 * ease(ramp(t, tUti + 0.3, tUti + 0.8)))));
      itemLista(s, DES, false, [['desperdicio de ', C.blanco], ['papel', 'currentColor']], x0, PD.y + 258, tDesp, fin, { tBlanco: tVen });
      // ---------- B14 · la ventaja: una vez transportado, tocas y listo
      const PV = panelLista(s, g, 1120, 690, 630, 285, 'VENTAJA', tVen, fin);
      itemLista(s, g, true, [['tocas tu partitura', 'currentColor']], PV.x + 40, PV.y + 125, tToc, fin, { tBlanco: tPen - 0.1 });
      itemLista(s, g, true, [['nada más que ', C.blanco], ['pensar', 'currentColor']], PV.x + 40, PV.y + 195, tPen, fin, { tBlanco: fin + 1 });
      const ok = N.group(g); marca(ok, true, PB.xFin + 56, yB, 20);
      pop(s, ok, tToc + 0.1, fin, PB.xFin + 56, yB, { k0: .4 });
      // colores de la partitura transportada: suena (SON_ESC_FA), «escribirlo de nuevo», «tocas tu partitura»
      luces(s, PB, [suena('SON_ESC_FA', PB), (i, t) => win(t, tMol, tMol + 1.4, .3, .4), (i, t) => win(t, tToc, tToc + 1.6, .3, .4)], { pulso: pulsoSuena('SON_ESC_FA', PB) });
      void tEsc1;
    });
  }

  /** Rayo (reflejos). */
  function icoRayo(g, cx, cy, s) {
    const G = N.group(g, 'ico'); s = s || 1;
    const P = (x, y) => `${(cx + x * s).toFixed(1)},${(cy + y * s).toFixed(1)}`;
    N.el('path', { d: `M${P(8, -46)} L${P(-24, 6)} L${P(-2, 6)} L${P(-12, 46)} L${P(26, -8)} L${P(4, -8)} L${P(18, -46)} Z`, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 * s, 'stroke-linejoin': 'round' }, G);
    return G;
  }

  // ================================================================ M · P · transporte mental (Re M → 3ªm ↑ → Fa M): se tachan armadura y clave;
  //                                     y «Espera un momento»: ¿por qué el Sol♯ de arriba lleva abajo un becuadro?
  function escenaMental() {
    const a = F0('M1') - 0.3, b = F0('D1') - 0.3;
    escena('mental', a, b, (s, g) => {
      const fin = b - 0.3;
      // ---------- M1 · transporte mental: anotaciones en el papel · poco tiempo · mucha cabeza y reflejos
      const tMe = Wd('M1', 'mental') - 0.2, tSale = F0('M2') - 0.15;
      dosFormas(s, g, 1, F0('M1') - 0.25, tMe, tSale, 450);
      const tAno = Wd('M1', 'anotaciones') - 0.2, tPap = Wd('M1', 'papel') - 0.2, tPoco = Wd('M1', 'poco') - 0.2;
      const tCab = Wd('M1', 'cabeza') - 0.25, tRef = Wd('M1', 'reflejos') - 0.2;
      [
        { x: CX - 520, dib: G => icoLapiz(G, CX - 520, 742, 1.05), segs: [['anotaciones ', C.blanco], ['en el papel', 'currentColor']], t0: tAno, tR: tPap },
        { x: CX, dib: G => icoReloj(G, CX, 742, 0.8), segs: [['poco tiempo', 'currentColor']], t0: tPoco, tR: tPoco },
        { x: CX + 520, dib: G => icoRayo(G, CX + 520, 742, 0.85), segs: [['cabeza y ', C.blanco], ['reflejos', 'currentColor']], t0: tCab, tR: tRef },
      ].forEach(it => {
        const G = N.group(g), I = N.group(G); it.dib(I); color(I, C.suave);
        const f = N.group(G); frase(f, it.segs, it.x, 836, { size: 36, peso: 800, anchor: 'middle' });
        aparece(s, G, it.t0, tSale + 0.3, { dy: 10 });
        colorSeq(s, f, [[-1, C.rosa], [it.tR + 1.6, C.blanco]], .4);
        rosaEn(s, I, [[it.t0, it.tR + 1.6]], { de: C.suave });
      });
      const kc = N.group(g); chip(kc, 'TRANSPORTE MENTAL', CX, 122, { size: 30, anchor: 'middle' });
      pop(s, kc, tSale + 0.35, fin, CX, 122);
      // ---------- M2 · el ejemplo: transportar este fragmento una 3ªm ↑ (Re M)
      const tP1 = F0('P1') - 0.25, tCopia = F1('M4') + 0.05, DQ = 175;
      const BQ = N.group(g);                                     // enunciado + original + etiquetas: centrados mientras están solos; suben cuando sale la copia
      s.on(t => BQ.setAttribute('transform', `translate(0,${(DQ * (1 - ease(ramp(t, tCopia, tCopia + 0.75)))).toFixed(1)})`));
      const [e1, e2, e3] = enunciado(BQ, 'transportar este fragmento una', '3ªm', 1, 205);
      aparece(s, e1, Wd('M2', 'transportar') - 0.2, tP1, { dy: 6 });
      pop(s, e2, Wd('M2', 'tercera') - 0.15, tP1, e2._cx, 205);
      aparece(s, e3, Wd('M2', 'ascendente') - 0.15, tP1, { dy: 8 });
      const xS = 450, xL = 300, yA = 345, yB = 590, sp = SP;
      const LC = N.group(BQ);                                  // columna de etiquetas (se atenúa al final)
      const xA = xS + 3.9 * sp + 4, xAe = xA + 2 * (N.M.accidentalSharp.adv + 0.14) * sp;
      const xC = xAe + 0.9 * sp, xN = xC + N.anchoCompas({ tipo: 'simple', num: '2', den: '4' }, sp) + 1.8 * sp;
      const WM = N.group(BQ), WT = N.group(g);
      const PM = partitura(WM, { x: xS, yM: yA, arm: [2, '#'], compases: MEL_RE(1.2), xCompas: xC, xNotas: xN });
      const PT = partitura(WT, { x: xS, yM: yB, arm: [2, '#'], compases: MEL_RE(1.2), xCompas: xC, xNotas: xN });
      const tEj = Wd('M2', 'ejemplo') - 0.2;
      PM.notas.forEach((e, i) => pop(s, e.g, tEj + 0.2 + i * 0.06, 1e9, e.cx, e.y, { k0: .4, fi: .25 }));
      PM.vigas.forEach(v => mostrarEn(s, v.g, tEj + 0.2 + v.idx[1] * 0.06, 1e9, .25));
      // ---------- M3 · aparenta estar en Re M (2♯)
      const tApa = Wd('M3', 'aparenta') - 0.2, tRe = Wd('M3', 're') - 0.15;
      rosaEn(s, PM.AR, [[tApa, tRe + 1.4]]);
      tonChip(s, LC, 'D', xL, yA, tRe, fin, [[tRe, tRe + 1.4]]);
      // ---------- M4 · una 3ªm ↑: Re, Mi, Fa → Fa M
      const tTer = Wd('M4', 'tercera') - 0.2, tFaM = Wd('M4', 'fa', 2) - 0.15;
      const tRMF = [Wd('M4', 're') - 0.1, Wd('M4', 'mi') - 0.1, Wd('M4', 'fa') - 0.1];
      const TM = fraseG(LC, [['3ªm ↑', 'currentColor']], xL, 432, { size: 32, peso: 800, anchor: 'middle' });
      aparece(s, TM, tTer, fin, { dy: 6 });
      colorSeq(s, TM, [[-1, C.rosa], [tFaM + 1.6, C.suave]], .4);
      const CU = N.group(LC); color(CU, C.blanco);
      const cuX = [xL - 62, xL, xL + 62];
      const cuW = ['Re', 'Mi', 'Fa'].map((n, i) => { const G = N.group(CU); texto(G, n, cuX[i], 502, { anchor: 'middle', size: 30, peso: 800, fill: 'currentColor' }); aparece(s, G, tRMF[i], fin, { dy: 6 }); return G; });
      [0, 1].forEach(i => { const G = N.group(CU); texto(G, '·', (cuX[i] + cuX[i + 1]) / 2, 502, { anchor: 'middle', size: 30, peso: 800, fill: C.suave }); mostrarEn(s, G, tRMF[i + 1], fin, .25); });
      const tCon = Wd('M10', 'contar') - 0.2;
      rosaEn(s, cuW[2], [[tRMF[2], tFaM + 1.4], [tCon, tCon + 2.2]]);
      rosaEn(s, cuW[0], [[tCon, tCon + 2.2]]); rosaEn(s, cuW[1], [[tCon, tCon + 2.2]]);
      tonChip(s, LC, 'F', xL, yB, tFaM, fin, [[tFaM, tFaM + 1.4], [Wd('M5', 'fa') - 0.2, Wd('M5', 'fa') + 1.2]]);
      // ---------- M5 · la misma partitura (abajo): se tacha la armadura y se añade la nueva (un bemol)
      s.on(t => { const k = ease(ramp(t, tCopia, tCopia + 0.75)); WT.setAttribute('transform', `translate(0,${((yA + DQ - yB) * (1 - k)).toFixed(1)})`); opa(WT, t < tCopia ? 0 : (0.45 + 0.55 * k) * (t > fin - 0.4 ? 1 - ramp(t, fin - 0.4, fin) : 1)); });
      const tTa = Wd('M5', 'tachamos') - 0.1, tAn = Wd('M5', 'anadimos') - 0.1, tBem = Wd('M5', 'bemol') - 0.25;
      const XA = N.group(WT); tachaX(s, XA, xA - 8, yB - 3.3 * sp, xAe + 4, yB + 1.2 * sp, tTa, { w: 4 });
      colorSeq(s, XA, [[-1, C.rosa], [tTa + 2.2, C.suave]], .5);
      rosaEn(s, PT.AR, [[tTa - 0.2, tTa + 0.5]], { a: C.rosa });
      s.on(t => opa(PT.AR, 1 - 0.55 * ease(ramp(t, tTa + 0.6, tTa + 1.1))));
      // el bloque (compás, notas, divisorias) se aparta: primero para el bemol, luego para la clave
      const D1 = 1.5 * sp, D2 = 3.34 * sp;
      const tCla = Wd('M8', 'ponemos') - 0.1, tFa = Wd('M8', 'fa') - 0.25, tCua = Wd('M8', 'cuarta') - 0.2;
      const k1 = t => ease(ramp(t, tAn, tAn + 0.5)), k2 = t => ease(ramp(t, tCla, tCla + 0.55));
      const dxB = t => D1 * k1(t) + D2 * k2(t);
      s.on(t => { const d = dxB(t); PT.BL.setAttribute('transform', `translate(${d.toFixed(1)},0)`); PT.lineas.forEach(l => l.setAttribute('x2', (PT.xFin + d).toFixed(1))); });
      const FB = N.group(WT), FBi = N.group(FB);
      N.glyph(FBi, 'accidentalFlat', xAe + 0.6 * sp, yB, sp);
      escribe(s, FBi, xAe + 0.6 * sp, yB - 1.8 * sp, xAe + 1.5 * sp, yB + 0.75 * sp, tBem, 0.5);
      const tBaja = tFa + 0.25;
      s.on(t => FB.setAttribute('transform', `translate(${(D2 * k2(t)).toFixed(1)},${(sp * ease(ramp(t, tBaja, tBaja + 0.5))).toFixed(1)})`));
      rosaEn(s, FB, [[tBem, tBem + 2.2], [tBaja - 0.1, tBaja + 1.4]]);
      // ---------- M6 · lo mismo con la clave
      const tCl6 = Wd('M6', 'clave') - 0.2;
      const XC = N.group(WT); tachaX(s, XC, xS + 0.35 * sp, yB - 3.5 * sp, xS + 3.45 * sp, yB + 3.7 * sp, tCl6, { w: 4 });
      colorSeq(s, XC, [[-1, C.rosa], [tCl6 + 2.2, C.suave]], .5);
      rosaEn(s, PT.CL, [[tCl6 - 0.2, tCl6 + 0.5]]);
      s.on(t => opa(PT.CL, 1 - 0.55 * ease(ramp(t, tCl6 + 0.6, tCl6 + 1.1))));
      // ---------- M7 · que las notas escritas se llamen ya de la forma nueva: la primera, Fa
      const tNo = Wd('M7', 'notas') - 0.15, tFor = Wd('M7', 'forma') - 0.2, tPri = Wd('M7', 'primera') - 0.2, tFa1 = Wd('M7', 'fa') - 0.2;
      const NOMS = ['Fa', 'Mi', 'Re', 'Do', 'Re', 'Si♮', 'Do', 'Sol'];
      const TS = S.SON_MEN_FA || PT.notas.map((_, i) => F0('SON_MEN_FA') + 0.15 + i * 0.5);
      const NM = N.group(PT.BL);
      PT.notas.forEach((e, i) => {
        const Q = N.group(NM); texto(Q, '?', e.cx, yB + 128, { anchor: 'middle', size: 30, peso: 800, fill: C.suave });
        const tNom = i === 0 ? tFa1 : TS[i] - 0.05;
        s.on(t => opa(Q, win(t, tFor + i * 0.05, tNom + 0.1, .3, .2)));
        const Nm = N.group(NM); frase(Nm, [[NOMS[i], 'currentColor']], e.cx, yB + 128, { size: 30, peso: 800, anchor: 'middle' });
        s.on(t => opa(Nm, ramp(t, tNom, tNom + 0.25) * (1 - ease(ramp(t, F0('M11') - 0.5, F0('M11'))) + ease(ramp(t, F0('P1') - 0.3, F0('P1') + 0.2)))));
        e.nom = Nm;
      });
      // ---------- M8 · la clave de Fa en 4.ª (la 4.ª línea es Fa) · el bemol baja a la línea del Si · el Sol♯ pasa a Si♮
      const xFc = xAe + 0.7 * sp;
      const FC = N.group(WT), FCi = N.group(FC); N.claveFa(FCi, xFc, yB, sp);
      escribe(s, FCi, xFc, yB - 2.1 * sp, xFc + 2.8 * sp, yB + 1.6 * sp, tFa, 0.6);
      const tAmi = Wd('M9', 'clave') - 0.2;
      rosaEn(s, FCi, [[tFa, tFa + 2.0], [tAmi, tAmi + 2.4]]);
      const L4 = N.group(PT.g); PT.g.insertBefore(L4, PT.CL); color(L4, C.rosa);
      N.line(L4, xFc + 0.4 * sp, yB - sp, PT.notas[0].x + D1 + D2 + 1.2 * sp, yB - sp, 5, { 'stroke-linecap': 'round' });
      mostrarEn(s, L4, tCua, tCua + 1.7, .3, .4);
      // el sostenido del 6.º se tacha (se aparta) y entra el becuadro
      const e6 = PT.notas[5], y6 = e6.y, tSos = F0('SON_MEN_FA') - 0.1;
      const NAT = N.group(e6.c); N.glyph(NAT, 'accidentalNatural', e6.x - (N.M.accidentalNatural.adv + 0.22) * sp, y6, sp);
      s.on(t => opa(NAT, ease(ramp(t, tSos + 0.25, tSos + 0.55))));
      const dxS = -0.824 * sp;
      const xs0 = e6.x - (N.M.accidentalSharp.adv + 0.22) * sp + dxS;
      const TSo = N.group(PT.MU);
      trazoAnim(s, TSo, `M${(xs0 - 3).toFixed(1)},${(y6 + 0.95 * sp).toFixed(1)} L${(xs0 + N.M.accidentalSharp.adv * sp + 3).toFixed(1)},${(y6 - 0.95 * sp).toFixed(1)}`, tSos + 0.1, 0.3, { w: 3.5 });
      const tTach = Wd('P4', 'tachado') - 0.3;
      s.on(t => {
        e6.alt.setAttribute('transform', `translate(${(dxS * ease(ramp(t, tSos, tSos + 0.35))).toFixed(1)},0)`);
        if (t < tSos) { e6.alt.style.color = ''; return; }
        const kR = win(t, tTach, tTach + 1.9, .25, .4);
        color(e6.alt, mezcla(mixHex(C.blanco, C.suave, ease(ramp(t, tSos + 0.2, tSos + 0.6))), C.rosa, kR));
        color(TSo, mezcla(C.suave, C.rosa, kR));
      });
      // sonidos: arriba SON_MEN_RE; abajo SON_MEN_FA (lo que se ve: las mismas líneas, leídas en Fa M)
      const tP2s = Wd('P2', 'sol') - 0.2, tP3n = Wd('P3', 'misma') - 0.2, tP4 = F0('P4') - 0.2;
      oido(s, BQ, PM.xFin + 70, yA, ['SON_MEN_RE']); oido(s, g, PT.xFin + D1 + D2 + 62, yB, ['SON_MEN_FA']);
      luces(s, PM, [suena('SON_MEN_RE', PM), (i, t) => i === 5 ? win(t, tP2s, tP4 + 0.2, .3, .4) : 0], { pulso: pulsoSuena('SON_MEN_RE', PM) });
      luces(s, PT, [suena('SON_MEN_FA', PT), (i, t) => (i === 0 ? win(t, tPri, tFa + 0.6, .3, .4) : 0), (i, t) => win(t, tNo, tNo + 1.1, .25, .35), (i, t) => i === 5 ? win(t, tP3n, tP4 + 0.2, .3, .4) : 0], { pulso: pulsoSuena('SON_MEN_FA', PT) });
      PT.notas.forEach((e, i) => rosaEn(s, e.nom, [[i === 0 ? tFa1 : TS[i] - 0.05, (i === 0 ? tFa1 + 1.6 : TS[i] + 0.45)], [i === 5 ? tP3n : -9, i === 5 ? tP4 + 0.2 : -8]]));
      rosaEn(s, PM.notas[5].alt, [[Wd('P2', 'sostenido') - 0.2, Wd('P2', 'sostenido') + 1.2]], { a: C.rosa });
      // ---------- M9 · un ejemplo amigable: la clave de Fa en 4.ª, la de siempre
      const yT = 880, tM10 = F0('M10') - 0.2;
      const tAmg = Wd('M9', 'amigable') - 0.2, tHab = Wd('M9', 'habituados') - 0.3;
      const [m1, m2, m3] = lineaCentrada(g, [[['ejemplo amigable:', C.blanco]], [['clave de Fa en 4ª', 'currentColor'], [',', C.blanco]], [['¡la de siempre!', C.blanco]]], CX + 26, yT + 12, { size: 38, peso: 800, gap: 12 });
      const mk9 = N.group(g); marca(mk9, true, m1._f._x - 34, yT, 16);
      aparece(s, mk9, tAmg, tM10, { dy: 6 }); aparece(s, m1, tAmg, tM10, { dy: 6 }); aparece(s, m2, tAmi, tM10, { dy: 6 }); aparece(s, m3, tHab, tM10, { dy: 6 });
      colorSeq(s, m2, [[-1, C.rosa], [tHab + 0.8, C.blanco]], .4);
      // ---------- M10 · ¿una clave que no dominas? → contar mentalmente (lo siento…)
      const tNoD = Wd('M10', 'alguna') - 0.25, tSie = Wd('M10', 'siento') - 0.25, tM11 = F0('M11') - 0.3;
      const n1 = fraseG(g, [['¿una clave que no dominas?', C.blanco]], 0, yT + 12, { size: 38, peso: 800 });
      const n2 = fraseG(g, [['→ ', C.suave], ['contar mentalmente', C.rosa]], 0, yT + 12, { size: 38, peso: 800 });
      const totM = 130 + 34 + n1._f._w + 22 + n2._f._w, xm0 = CX - totM / 2;
      n1._f.setAttribute('transform', `translate(${(xm0 + 164).toFixed(1)},${yT + 12})`);
      n2._f.setAttribute('transform', `translate(${(xm0 + 164 + n1._f._w + 22).toFixed(1)},${yT + 12})`);
      const MC = N.group(g); color(MC, C.suave);
      for (let k = -2; k <= 2; k++) N.line(MC, xm0, yT + k * sp, xm0 + 130, yT + k * sp, N.E.staffLine * sp);
      N.glyph(MC, 'cClef', xm0 + 0.6 * sp, yT, sp);
      aparece(s, MC, tNoD, tM11, { dy: 6 });
      aparece(s, n1, tNoD, tM11, { dy: 6 });
      aparece(s, n2, tCon, tM11, { dy: 6 });
      const n3 = fraseG(g, [['lo siento… es la verdad', C.suave]], CX, yT + 64, { size: 28, peso: 700, italic: true, anchor: 'middle' });
      aparece(s, n3, tSie, tM11, { dy: 6 });
      // ---------- M11–M12 · desventajas y ventajas
      const tDes = Wd('M11', 'desventajas') - 0.2, tVen = Wd('M12', 'ventajas') - 0.2;
      const DES = N.group(g);
      s.on(t => DES.setAttribute('transform', `translate(${(335 * (1 - ease(ramp(t, tVen - 0.35, tVen + 0.35)))).toFixed(1)},0)`));
      const PD = panelLista(s, DES, 170, 705, 910, 270, 'DESVENTAJAS', tDes, tP1);
      const x0 = PD.x + 40;
      const tSeg = Wd('M11', 'clave') - 0.25, tDur = Wd('M11', 'duro') - 0.2, tMuy = Wd('M11', 'muy') - 0.15;
      const i1 = itemLista(s, DES, false, [['según la clave: ', C.blanco]], x0, PD.y + 118, tSeg, tP1);
      const i1b = fraseG(DES, [['duro… ', 'currentColor']], x0 + i1._w + 4, PD.y + 118, { size: 34, peso: 800 });
      aparece(s, i1b, tDur, tP1, { dy: 6 }); colorSeq(s, i1b, [[-1, C.rosa], [tMuy, C.blanco]], .3);
      const i1c = fraseG(DES, [['¡o muy duro!', 'currentColor']], x0 + i1._w + 8 + i1b._f._w, PD.y + 118, { size: 34, peso: 800 });
      aparece(s, i1c, tMuy, tP1, { dy: 6 }); colorSeq(s, i1c, [[-1, C.rosa], [tMuy + 2.2, C.blanco]], .4);
      const tHa = Wd('M11', 'habito') - 0.25, tMit = Wd('M11', 'mitad') - 0.25;
      const i2 = itemLista(s, DES, false, [['sin hábito: ', C.blanco]], x0, PD.y + 190, tHa, tP1);
      const i2b = fraseG(DES, [['la mitad de las notas, fuera', 'currentColor']], x0 + i2._w + 4, PD.y + 190, { size: 34, peso: 800 });
      aparece(s, i2b, tMit, tP1, { dy: 6 }); colorSeq(s, i2b, [[-1, C.rosa], [tVen, C.blanco]], .4);
      const PV = panelLista(s, g, 1120, 705, 630, 270, 'VENTAJAS', tVen, tP1);
      const tPar = Wd('M12', 'anotaciones') - 0.3, tCnf = Wd('M12', 'confiar') - 0.25, tRap = Wd('M12', 'rapido') - 0.25, tJus = Wd('M12', 'justo') - 0.3;
      itemLista(s, g, true, [['un par de anotaciones', 'currentColor']], PV.x + 40, PV.y + 104, tPar, tP1, { size: 31, tBlanco: tCnf });
      itemLista(s, g, true, [['confiar en tu habilidad', 'currentColor']], PV.x + 40, PV.y + 152, tCnf, tP1, { size: 31, tBlanco: tRap });
      itemLista(s, g, true, [['muy rápido', 'currentColor']], PV.x + 40, PV.y + 200, tRap, tP1, { size: 31, tBlanco: tJus });
      itemLista(s, g, true, [['si vas justo de tiempo', 'currentColor']], PV.x + 40, PV.y + 248, tJus, tP1, { size: 31, tBlanco: tP1 });
      // ---------- P1–P4 · ¡Espera un momento! arriba Sol♯… abajo, la misma nota con becuadro (y el ♯, tachado)
      const tEs = Wd('P1', 'espera') - 0.2, tP5 = F0('P5') - 0.2;
      const es = fraseG(g, [['¡Espera un momento!', C.rosa]], CX, 217, { size: 44, peso: 800, italic: true, anchor: 'middle' });
      aparece(s, es, tEs, tP5 + 0.2, { dy: 8 });
      const p6 = PM.notas[5], q6 = PT.notas[5];
      const AR6 = N.group(g); color(AR6, C.rosa);
      const xq = q6.x + D1 + D2 + 0.6 * sp;
      N.el('path', { d: `M${p6.cx},${yA + 72} C${p6.cx},${yA + 110} ${xq},${yB - 160} ${xq},${yB - 124}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-dasharray': '2 10' }, AR6);
      const ang = Math.atan2(58, 0), cab = 14;
      N.el('polygon', { points: `${xq},${yB - 116} ${(xq - Math.cos(ang - 0.45) * cab).toFixed(1)},${(yB - 116 - Math.sin(ang - 0.45) * cab).toFixed(1)} ${(xq - Math.cos(ang + 0.45) * cab).toFixed(1)},${(yB - 116 - Math.sin(ang + 0.45) * cab).toFixed(1)}`, fill: 'currentColor' }, AR6);
      mostrarEn(s, AR6, tP3n, tP4 + 0.1, .35, .3);
      const xT = e6.x + D1 + D2 + dxS - (N.M.accidentalSharp.adv + 0.22) * sp + N.M.accidentalSharp.adv * sp / 2;
      const QT = N.group(g); texto(QT, '¿?', xT, yB - 128, { anchor: 'middle', size: 46, peso: 800, fill: C.rosa });
      pop(s, QT, tTach, tP5 + 0.2, xT, yB - 145, { k0: .5 });
      // ---------- P5 · será mejor que te sientes: todavía queda una cosa… y no te va a gustar
      // P2–P3 · se comparan: mientras se habla de «arriba», el de abajo se atenúa (y al revés); con «la misma nota», los dos
      const tArr = Wd('P2', 'arriba') - 0.2, tAb = Wd('P3', 'abajo') - 0.2, tMis = Wd('P3', 'misma') - 0.25;
      const dTop = t => 1 - 0.55 * win(t, tAb, tMis, .3, .3), dBot = t => 1 - 0.55 * win(t, tArr, tAb, .3, .3);
      s.on(t => { const k = 1 - 0.7 * ease(ramp(t, tP5, tP5 + 0.5)); opa(WM, k * dTop(t) * win(t, tEj - 0.2, fin, .4, .4)); opa(LC, k * (1 - ease(ramp(t, fin - 0.4, fin)))); });
      s.on(t => { const k = (1 - 0.7 * ease(ramp(t, tP5, tP5 + 0.5))) * dBot(t); opa(PT.g, k); opa(FB, k); opa(FC, k); opa(XA, k * (t < tTa ? 0 : 1)); opa(XC, k * (t < tCl6 ? 0 : 1)); });
      const tTod = Wd('P5', 'todavia') - 0.2, tGus = Wd('P5', 'gustar') - 0.35;
      const s1 = fraseG(g, [['todavía nos queda ', C.blanco], ['una cosa por ver…', C.rosa]], CX, 860, { size: 42, peso: 800, anchor: 'middle' });
      aparece(s, s1, tTod, fin, { dy: 8 });
      const s2 = fraseG(g, [['…y no te va a gustar', C.suave]], CX, 930, { size: 36, peso: 700, italic: true, anchor: 'middle' });
      aparece(s, s2, tGus, fin, { dy: 8 });
    });
  }

  // ---------------------------------------------------------------- el ejemplo de las diferencias (Re M → 3ªm ↑ → Fa M, escrito)
  const EJ = { xS: 520, xL: 370, yA: 330, yB: 560 };
  /** Los dos pentagramas del ejemplo: arriba Re M (el del libro), abajo Fa M (el transporte escrito) con el 6.º pendiente
   *  (sin alteración; un hueco con «?»). Devuelve {WA, WB, PA, PB, hueco, e6}. */
  function ejemploDif(g) {
    const { xS, yA, yB } = EJ, sp = SP;
    const xC = xS + 3.9 * sp + 4 + 2 * (N.M.accidentalSharp.adv + 0.14) * sp + 0.9 * sp;
    const xN = xC + N.anchoCompas({ tipo: 'simple', num: '2', den: '4' }, sp) + 1.8 * sp;
    const WA = N.group(g), WB = N.group(g);
    const PA = partitura(WA, { x: xS, yM: yA, arm: [2, '#'], compases: MEL_RE(0), xCompas: xC, xNotas: xN });
    const PB = partitura(WB, { x: xS, yM: yB, arm: [1, 'b'], compases: RE_FA(null), xCompas: xC, xNotas: xN });
    const e6 = PB.notas[5];
    const hueco = N.group(PB.MU); color(hueco, C.rosa);
    const hx = e6.x - 1.25 * sp, hw = 1.05 * sp;
    N.el('rect', { x: hx - 5, y: e6.y - 1.45 * sp, width: hw + 10, height: 2.9 * sp, rx: 8, fill: C.panel, 'fill-opacity': 0.94, stroke: 'currentColor', 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, hueco);
    texto(hueco, '?', hx + hw / 2, e6.y + 11, { anchor: 'middle', size: 32, peso: 800, fill: 'currentColor' });
    return { WA, WB, PA, PB, hueco, e6, hx, hw };
  }

  // ================================================================ D · las diferencias: qué son · el ejemplo (Re M → Fa M) escrito paso a paso
  function escenaDiferencias() {
    const a = F0('D1') - 0.3, b = F0('D11') - 0.3;
    escena('diferencias', a, b, (s, g) => {
      const fin = b - 0.3, tD4 = Wd('D4', 'ejemplo') - 0.8;
      // ---------- D1–D3 · al cambiar de tonalidad y armadura, las alteraciones accidentales pueden cambiar: diferencias
      const tDif = Wd('D1', 'diferencias') - 0.25, tEj = Wd('D4', 'ejemplo') - 0.3;
      const KD = N.group(g), KDi = N.group(KD); chip(KDi, 'LAS DIFERENCIAS', CX, 290, { size: 44, anchor: 'middle' });
      pop(s, KD, tDif, 1e9, CX, 290);                            // sigue en la escena siguiente (misma cabecera)
      viajeA(s, KDi, CX, 290, tD4 + 0.1, tD4 + 0.8, 0, 122 - 290, 0.68);
      const tTon = Wd('D2', 'tonalidad') - 0.2, tAlt = Wd('D2', 'alteradas') - 0.2, tMod = Wd('D2', 'modificaciones') - 0.2;
      const tSig = Wd('D2', 'signos') - 0.2, tLla = Wd('D3', 'diferencias') - 0.25;
      const l1 = fraseG(g, [['al cambiar de ', C.blanco], ['tonalidad y armadura', 'currentColor'], ['…', C.blanco]], CX, 440, { size: 42, peso: 800, anchor: 'middle' });
      aparece(s, l1, tTon, tD4, { dy: 8 }); colorSeq(s, l1, [[-1, C.rosa], [tAlt, C.blanco]], .4);
      const l2 = fraseG(g, [['…las notas con ', C.blanco], ['alteración accidental', 'currentColor']], CX, 520, { size: 42, peso: 800, anchor: 'middle' });
      aparece(s, l2, tAlt, tD4, { dy: 8 }); colorSeq(s, l2, [[-1, C.rosa], [tMod + 1.5, C.blanco]], .4);
      // el signo cambia: ♯ → ♮ (dibujados en grande)
      const yG = 700, K = 2.1;
      const GS = N.group(g); N.glyph(GS, 'accidentalSharp', CX - 230 - N.M.accidentalSharp.adv * SP * K / 2, yG + 8, SP, K); color(GS, C.blanco);
      pop(s, GS, tMod, tD4, CX - 230, yG, { k0: .5 });
      const FG = N.group(g); color(FG, C.suave); flecha(FG, CX - 150, yG, CX - 40, yG, { w: 5, cab: 18 });
      mostrarEn(s, FG, tSig, tD4, .3);
      const GN = N.group(g); N.glyph(GN, 'accidentalNatural', CX + 40, yG + 8, SP, K); color(GN, C.rosa);
      pop(s, GN, tSig + 0.2, tD4, CX + 40 + N.M.accidentalNatural.adv * SP * K / 2, yG, { k0: .5 });
      const eq = fraseG(g, [['= ', C.suave], ['diferencias', C.rosa]], CX + 140, yG + 16, { size: 48, peso: 800 });
      aparece(s, eq, tLla, tD4, { dy: 8 });
      // ---------- D4–D5 · empezamos con un ejemplo desde el principio (el del libro, Re M) · transporte escrito
      const X = ejemploDif(g), { PA, PB, WA, WB } = X, { xL, yA, yB } = EJ, sp = SP;
      const tEsc = Wd('D5', 'transporte') - 0.25, tUp = tEsc - 0.3;
      const BQ = N.group(g); BQ.appendChild(WA);                 // el original (y su tonalidad): centrado mientras está solo; sube cuando llega el 2.º pentagrama
      s.on(t => BQ.setAttribute('transform', `translate(0,${(200 * (1 - ease(ramp(t, tUp, tUp + 0.7)))).toFixed(1)})`));
      s.on(t => opa(WA, win(t, tEj, fin, .4, .4)));
      PA.notas.forEach((e, i) => pop(s, e.g, tEj + 0.2 + i * 0.06, 1e9, e.cx, e.y, { k0: .4, fi: .25 }));
      PA.vigas.forEach(v => mostrarEn(s, v.g, tEj + 0.2 + v.idx[1] * 0.06, 1e9, .25));
      luces(s, PA, [suena('SON_DIF_RE', PA)], { pulso: pulsoSuena('SON_DIF_RE', PA) });
      oido(s, BQ, PA.xFin + 70, yA, ['SON_DIF_RE']);
      mostrarEn(s, PB.PL, tUp + 0.6, fin, .4); mostrarEn(s, PB.CL, tUp + 0.6, fin, .4);
      s.on(t => opa(WB, 1 - ease(ramp(t, fin - 0.4, fin))));
      // pasos: 1 armadura de partida · 2 tonalidad nueva · 3 su armadura · 4 las diferencias
      const tP1 = Wd('D6', 'primero') - 0.2, tP2 = F0('D7') - 0.2, tP3 = F0('D8') - 0.2, tP4 = F0('D10') - 0.1, tP9 = F0('D9') - 0.2;
      pasosFila(s, g, [
        { n: '1', segs: [['armadura de partida', 'currentColor']], t0: tP1, t1: tP2 },
        { n: '2', segs: [['tonalidad nueva', 'currentColor']], t0: tP2, t1: tP3 },
        { n: '3', segs: [['su armadura', 'currentColor']], t0: tP3, t1: tP9 },
        { n: '4', segs: [['las diferencias', 'currentColor']], t0: tP4, t1: fin + 1 },
      ], 800, tEsc, fin, 404);
      // D6 · la armadura de partida: dos sostenidos
      const tArm = Wd('D6', 'armadura') - 0.2, tDos = Wd('D6', 'dos') - 0.2;
      rosaEn(s, PA.AR, [[tArm, tDos + 1.6]]);
      tonChip(s, BQ, 'D', xL, yA, tEj + 0.3, fin, [[tArm, tDos + 1.6]]);
      // D7 · la nueva tonalidad: subimos una 3ª → Fa M
      const tSub = Wd('D7', 'subimos') - 0.2, tFa = Wd('D7', 'fa') - 0.15;
      const FL = N.group(g);
      flecha(FL, xL, yA + 44, xL, yB - 44, { w: 5, cab: 18 });
      frase(FL, [['3ªm ↑', 'currentColor']], xL - 24, (yA + yB) / 2 + 12, { size: 30, peso: 800, anchor: 'end' });
      aparece(s, FL, tSub, fin, { dy: -10 });
      colorSeq(s, FL, [[-1, C.rosa], [tFa + 1.6, C.suave]], .4);
      tonChip(s, g, 'F', xL, yB, tFa, fin, [[tFa, tFa + 1.4]]);
      // D8 · entonces, un bemol: lo ponemos en el pentagrama de abajo
      const tBem = Wd('D8', 'poniendo') - 0.1;
      const xAr = PB.arm.items[0].x;
      opa(PB.AR, 0);
      escribe(s, PB.AR, xAr, yB - 1.9 * sp, xAr + 0.95 * sp, yB + 0.8 * sp, tBem, 0.55);
      rosaEn(s, PB.AR, [[Wd('D8', 'bemol') - 0.2, tBem + 1.8]]);
      // D9 · escribimos la partitura de nuevo: cada nota, una 3ªm más arriba (el 6.º, pendiente)
      const tNu = Wd('D9', 'escribimos') - 0.2;
      mostrarEn(s, PB.CO, tNu, fin, .3); mostrarEn(s, PB.DV, tNu + 0.3, fin, .3);
      const ts9 = PA.notas.map((_, i) => tNu + i * 0.08);
      vuelan(s, PA, PB, ts9, 0.75, { capa: g, arco: 26 });
      s.on(t => opa(X.hueco, ramp(t, ts9[5] + 0.75, ts9[5] + 1.0)));
      luces(s, PB, []);
    });
  }

  /** La cabecera «LAS DIFERENCIAS» ya colocada arriba (la misma que deja la escena anterior). */
  function cabeceraDif(g) {
    const KD = N.group(g), KDi = N.group(KD); chip(KDi, 'LAS DIFERENCIAS', CX, 290, { size: 44, anchor: 'middle' });
    KDi.setAttribute('transform', `translate(${CX},122) scale(0.68) translate(${-CX},-290)`);
    return KD;
  }
  const NOM_TON = { 7: 'Do♯ M', 6: 'Fa♯ M', 5: 'Si M', 4: 'Mi M', 3: 'La M', 2: 'Re M', 1: 'Sol M', 0: 'Do M',
    '-1': 'Fa M', '-2': 'Si♭ M', '-3': 'Mi♭ M', '-4': 'La♭ M', '-5': 'Re♭ M', '-6': 'Sol♭ M', '-7': 'Do♭ M' };
  const nivelTxt = L => L > 0 ? L + '♯' : (L < 0 ? (-L) + '♭' : '0');

  // ================================================================ D11–D19 · contar los pasos (2♯ → 1♯ → 0 → 1♭) · la montaña · el círculo en columna
  function escenaPasos() {
    const a = F0('D11') - 0.3, b = F0('N1') - 0.3;
    escena('pasos', a, b, (s, g) => {
      const fin = b - 0.3;
      cabeceraDif(g);
      // ---------- D11–D12 · de una armadura a la otra: 2♯ → 1♯ → 0 → 1♭, tres pasos
      const tMon = Wd('D13', 'mira') - 0.15;
      const tArm = Wd('D11', 'armadura') - 0.2, tOtra = Wd('D11', 'otra') - 0.2;
      const tDos = Wd('D12', 'dos') - 0.2, tPas = Wd('D12', 'pasamos') - 0.1, tUn = Wd('D12', 'un') - 0.15, tTres = Wd('D12', 'tres') - 0.35;
      const FILA = [[2, '#', 'Re M'], [1, '#', 'Sol M'], [0, '#', 'Do M'], [1, 'b', 'Fa M']];
      const LV = [2, 1, 0, -1];
      const wP = 200, gP = 110, xF0 = CX - (4 * wP + 3 * gP) / 2, yF = 420;
      const tFila = [Wd('D11', 'contar') - 0.1, tPas + 0.05, tPas + 0.35, tOtra];
      const volL = [];
      FILA.forEach(([n, tipo, nom], i) => {
        const x = xF0 + i * (wP + gP);
        const G = N.group(g); color(G, C.blanco);
        const P = pentaClave(G, x, yF, wP); N.armaduraGen(G, P.x0 + 4, yF, SP, n, tipo);
        const nm = texto(G, nom, x + wP / 2, 616, { anchor: 'middle', size: 28, peso: 700, fill: C.suave });
        aparece(s, G, tFila[i], tMon, { dy: 8 });
        void nm;
        // el rótulo (2♯, 1♯, 0, 1♭): luego vuela a su escalón de la montaña
        const W = N.group(g), Wi = N.group(W);
        frase(Wi, [[nivelTxt(LV[i]), 'currentColor']], x + wP / 2, 566, { size: 44, peso: 800, anchor: 'middle' });
        volL.push({ W, Wi, x: x + wP / 2, y: 566, L: LV[i], t0: tFila[i] });
      });
      // flechas con 1 · 2 · 3
      [0, 1, 2].forEach(i => {
        const x = xF0 + i * (wP + gP) + wP;
        const F = N.group(g); color(F, C.rosa);
        flecha(F, x + 14, yF, x + gP - 14, yF, { w: 4, cab: 14 });
        mostrarEn(s, F, [tPas, tPas + 0.3, tUn][i], tMon, .25);
        const nn = texto(g, String(i + 1), x + gP / 2, yF - 26, { anchor: 'middle', size: 32, peso: 800, fill: C.rosa });
        mostrarEn(s, nn, tTres + i * 0.22, tMon, .2);
      });
      const k3 = N.group(g); chip(k3, '3 PASOS', CX, 740, { size: 32, anchor: 'middle' });
      pop(s, k3, Wd('D12', 'pasos', 1) > tTres ? tTres + 0.7 : tTres + 0.7, tMon, CX, 740);
      // ---------- D13–D14 · la montaña: sostenidos arriba, Do M a nivel del mar, bemoles en las profundidades
      const yL = L => 540 - 50 * L, dxS = 56, X0 = 300, xs = L => X0 + (7 - L) * dxS;
      let d = `M130,935 L${xs(7)},${yL(7)}`;
      for (let L = 7; L >= -7; L--) { d += ` L${xs(L) + dxS},${yL(L)}`; if (L > -7) d += ` L${xs(L) + dxS},${yL(L - 1)}`; }
      d += ` L${xs(-7) + dxS},935 Z`;
      const tSl = Wd('D15', 'tres', 2) - 0.55, DXM = 330;
      const MT = N.group(g);                                     // la montaña entera: centrada mientras está sola; luego se aparta
      s.on(t => { MT.setAttribute('transform', `translate(${(DXM * (1 - ease(ramp(t, tSl, tSl + 0.6)))).toFixed(1)},0)`); opa(MT, 1 - ease(ramp(t, fin - 0.4, fin))); });
      const MO = N.group(MT);
      N.el('path', { d, fill: 'rgba(148,163,184,0.10)', stroke: 'none' }, MO);
      const MOl = N.group(MO); color(MOl, C.suave);
      trazoAnim(s, MOl, d.replace(' Z', ''), tMon + 0.1, 1.1, { w: 3 });
      mostrarEn(s, MO, tMon, fin, .5);
      // el agua (desde el nivel del mar) y su línea
      const tNiv = Wd('D14', 'nivel') - 0.25, tBem = Wd('D14', 'bemoles') - 0.2, tPro = Wd('D14', 'profundidades') - 0.25;
      const AG = N.group(MT);
      N.el('rect', { x: 100, y: 540, width: 1085, height: 395, rx: 22, fill: 'rgba(96,165,250,0.13)' }, AG);
      let dw = 'M110,540'; for (let x = 110; x <= 1175; x += 30) dw += ` Q${x + 7.5},${534} ${x + 15},540 T${x + 30},540`;
      const AGl = N.group(AG); N.el('path', { d: dw, fill: 'none', stroke: 'currentColor', 'stroke-width': 3, 'stroke-linecap': 'round' }, AGl);
      colorSeq(s, AGl, [[-1, '#7fb2d9'], [tNiv, C.rosa], [tNiv + 1.6, '#7fb2d9']], .4);
      mostrarEn(s, AG, tMon + 0.5, fin, .5);
      const nm0 = fraseG(MT, [['nivel del mar', 'currentColor']], 1170, 522, { size: 30, peso: 800, anchor: 'end' });
      aparece(s, nm0, tNiv, fin, { dy: 6 }); colorSeq(s, nm0, [[-1, C.rosa], [tNiv + 1.8, C.suave]], .4);
      const pr = fraseG(MT, [['profundidades', 'currentColor']], 170, 900, { size: 30, peso: 800, italic: true });
      aparece(s, pr, tPro, fin, { dy: 6 }); colorSeq(s, pr, [[-1, C.rosa], [tPro + 1.8, C.suave]], .4);
      const al = fraseG(MT, [['más alto', 'currentColor']], 150, 250, { size: 30, peso: 800, italic: true });
      aparece(s, al, Wd('D13', 'mas', 2) - 0.2, fin, { dy: 6 }); colorSeq(s, al, [[-1, C.rosa], [Wd('D13', 'alto', 2) + 1.6, C.suave]], .4);
      // los escalones (niveles): rótulo dentro de la montaña, bajo cada peldaño
      const tSos = Wd('D13', 'sostenidos') - 0.2, tMas = Wd('D13', 'mas') - 0.2, tSinA = Wd('D14', 'armadura') - 0.25;
      const tD2 = Wd('D15', 'dos') - 0.2, tB1 = Wd('D15', 'bemol') - 0.2, tBaj = Wd('D15', 'bajado') - 0.1;
      const tCam = Wd('D17', 'camino') - 0.2, tAqui = Wd('D19', 'bajado') - 0.25;
      const ESC = {};
      for (let L = 7; L >= -7; L--) {
        const G = N.group(MT), x = xs(L) + dxS / 2, y = yL(L) + 34;
        frase(G, [[nivelTxt(L), 'currentColor']], x, y, { size: 28, peso: 800, anchor: 'middle' });
        const vuela = LV.indexOf(L) >= 0;
        const tIn = vuela ? tMon + 0.9 : tMon + 0.5 + (7 - Math.abs(L)) * 0.03;
        const rosas = [];
        if (L > 0) rosas.push([tSos + (L - 1) * 0.04, tSos + 1.4], [tMas + (L - 1) * 0.16, Wd('D13', 'alto', 2) + 0.8]);
        if (L === 0) rosas.push([tSinA, tNiv + 1.6]);
        if (L < 0) rosas.push([tBem + (-L - 1) * 0.06, tPro + 1.2]);
        if (L === 2) rosas.push([tD2, tBaj + 0.3]);
        if (L === -1) rosas.push([tB1, fin + 1]);
        if (L <= 2 && L >= -1) rosas.push([tCam + (2 - L) * 0.15, tCam + 2.2], [tAqui + (2 - L) * 0.2, fin + 1]);
        s.on(t => { opa(G, ramp(t, tIn, tIn + 0.3)); color(G, mezcla(C.suave, C.rosa, ventanas(t, rosas, .25, .35))); });
        ESC[L] = { G, x, y };
      }
      // los rótulos de la fila vuelan a su escalón
      volL.forEach(v => {
        g.appendChild(v.W);                                      // por encima de la montaña y del agua
        const dest = ESC[v.L], dx = dest.x + DXM - v.x, dy = dest.y - v.y, k1 = 28 / 44;
        s.on(t => {
          const k = ease(ramp(t, tMon + 0.1, tMon + 0.9));
          opa(v.W, t < v.t0 ? 0 : ramp(t, v.t0, v.t0 + 0.3) * (1 - ramp(t, tMon + 0.88, tMon + 0.92)));
          v.Wi.setAttribute('transform', `translate(${(v.x + dx * k).toFixed(1)},${(v.y + dy * k).toFixed(1)}) scale(${lerp(1, k1, k).toFixed(4)}) translate(${-v.x},${-v.y})`);
          const act = (v.L === 2 && t >= tDos) || (v.L === -1 && t >= tUn) ? 1 : 0;
          color(v.Wi, mezcla(mixHex(C.blanco, C.rosa, act * (1 - k)), C.suave, k));
        });
      });
      // ---------- D15 · de dos sostenidos a un bemol has bajado tres escalones: tres diferencias descendentes
      const BO = N.group(MT), BOi = N.group(BO); N.el('circle', { cx: 0, cy: 0, r: 13, fill: C.rosa, stroke: '#0b1320', 'stroke-width': 3 }, BOi);
      const pB = L => [xs(L) + dxS / 2, yL(L) - 14];
      const saltos = [[2, 1], [1, 0], [0, -1]].map(([p, q], i) => ({ p, q, t0: tBaj + i * 0.38 }));
      s.on(t => {
        let [x, y] = pB(2);
        for (const sl of saltos) if (t >= sl.t0) {
          const k = clamp((t - sl.t0) / 0.34), [x1, y1] = pB(sl.p), [x2, y2] = pB(sl.q);
          x = lerp(x1, x2, k); y = lerp(y1, y2, k) - Math.sin(Math.PI * k) * 34;
        }
        BOi.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
      });
      pop(s, BO, tD2, fin, pB(2)[0], pB(2)[1], { k0: .3 });
      saltos.forEach((sl, i) => {
        const [x, y] = pB(sl.q);
        const n = texto(MT, String(i + 1), x, y - 40, { anchor: 'middle', size: 28, peso: 800, fill: C.rosa });
        mostrarEn(s, n, sl.t0 + 0.3, fin, .2);
      });
      const tDd = Wd('D15', 'tres', 2) - 0.25;
      const XR = 1610;
      const d1 = fraseG(g, [['3 diferencias', C.rosa]], XR, 300, { size: 50, peso: 800, anchor: 'middle' });
      const d2 = fraseG(g, [['descendentes ↓', C.blanco]], XR, 360, { size: 40, peso: 800, anchor: 'middle' });
      const tD18 = F0('D18') - 0.3;
      aparece(s, d1, tDd, tD18, { dy: 8 }); aparece(s, d2, Wd('D15', 'descendentes') - 0.25, tD18, { dy: 8 });
      // ---------- D16–D17 · ¡ojo! descendentes ≠ la melodía baja: aquí la música SUBE una 3ª; lo que baja es el camino
      const tOjo = Wd('D16', 'descendentes') - 0.2, tMel = Wd('D16', 'melodia') - 0.2, tSu = Wd('D16', 'sube') - 0.25, tDes = Wd('D17', 'desciende') - 0.2;
      const PJ = N.group(g); panel(PJ, XR - 200, 430, 400, 330, { rx: 22, stroke: 'rgba(248,250,252,0.3)', sw: 2 });
      aparece(s, PJ, tOjo, tD18, { dy: 10 });
      const o1 = fraseG(g, [['≠ la melodía baja', C.blanco]], XR, 500, { size: 34, peso: 800, anchor: 'middle' });
      aparece(s, o1, tMel, tD18, { dy: 6 });
      const tx1 = N.group(g); chip(tx1, '¡OJO!', XR, 450, { size: 22, anchor: 'middle' }); pop(s, tx1, tOjo, tD18, XR, 450);
      const o2 = fraseG(g, [['la música ', C.blanco], ['↑ sube', C.rosa], [' una 3ª', C.blanco]], XR, 580, { size: 34, peso: 800, anchor: 'middle' });
      aparece(s, o2, tSu, tD18, { dy: 6 });
      const o3 = fraseG(g, [['lo que baja: ', C.blanco], ['el camino ↓', C.rosa]], XR, 670, { size: 34, peso: 800, anchor: 'middle' });
      aparece(s, o3, tDes, tD18, { dy: 6 });
      const o4 = fraseG(g, [['en el mapa de las armaduras', C.suave]], XR, 718, { size: 26, peso: 700, italic: true, anchor: 'middle' });
      aparece(s, o4, Wd('D17', 'mapa') - 0.2, tD18, { dy: 6 });
      // el camino (de 2♯ a 1♭) por los escalones
      let dc = `M${xs(2) + 6},${yL(2) - 3}`;
      for (let L = 2; L > -1; L--) dc += ` L${xs(L) + dxS},${yL(L) - 3} L${xs(L) + dxS},${yL(L - 1) - 3}`;
      dc += ` L${xs(-1) + dxS - 6},${yL(-1) - 3}`;
      const CAM = N.group(MT); color(CAM, C.rosa);
      trazoAnim(s, CAM, dc, tCam, 0.8, { w: 7 });
      s.on(t => opa(CAM, Math.max(win(t, tCam, tCam + 3.0, .05, .5), win(t, tAqui - 0.1, fin + 1, .3, .3))));
      // ---------- D18 · las tonalidades del círculo de quintas, puestas en una columna
      const tCir = Wd('D18', 'circulo') - 0.25, tCol = Wd('D18', 'columna') - 0.2;
      const cx0 = 1570, cy0 = 560, xCol = 1208;
      const CI = N.group(g); color(CI, C.tenue);
      N.el('circle', { cx: cx0, cy: cy0, r: 148, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, CI);
      s.on(t => opa(CI, win(t, tCir, tCol + 0.6, .4, .4)));
      const POS = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, '-1': 11, '-2': 10, '-3': 9, '-4': 8, '-5': 7, '-6': 6, '-7': 5 };
      for (let L = 7; L >= -7; L--) {
        const p = POS[L], ang = -Math.PI / 2 + p * Math.PI / 6, par = (p >= 5 && p <= 7);
        const r = 208;
        const x1 = cx0 + r * Math.cos(ang), y1 = cy0 + r * Math.sin(ang) + 10 + (par ? (L > 0 ? -16 : 16) : 0);
        const W = N.group(g), Wi = N.group(W);
        const f = frase(Wi, [[NOM_TON[L], 'currentColor']], 0, 0, { size: 27, peso: 800 });
        const w = f._w, x2 = xCol, y2 = yL(L) + 10;
        const tv = tCol + (7 - L) * 0.035;
        s.on(t => {
          const k = ease(ramp(t, tv, tv + 0.9));
          const x = lerp(x1 - w / 2, x2, k), y = lerp(y1, y2, k);
          f.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
          opa(W, ramp(t, tCir + (7 - L) * 0.03, tCir + 0.3 + (7 - L) * 0.03) * (1 - ease(ramp(t, fin - 0.4, fin))));
          const rz = L <= 2 && L >= -1 ? win(t, tAqui + (2 - L) * 0.2, fin + 1, .25, .3) : 0;
          color(Wi, mezcla(L === 0 ? C.blanco : C.blanco, C.rosa, rz));
        });
      }
    });
  }

  /** Casilla con una alteración grande (♯ ♮ ♭) centrada en (x, y). Devuelve {G, R}. */
  function casAlt(parent, gl, x, y, o) {
    o = o || {};
    const G = N.group(parent, 'casAlt'), w = o.w || 92, h = o.h || 112, k = o.k || 1.35;
    const R = N.el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 16, fill: C.panel, stroke: 'currentColor', 'stroke-width': 2.5 }, G);
    const m = N.M[gl];
    N.glyph(G, gl, x - m.adv * SP * k / 2, y + (gl === 'accidentalFlat' ? 0.45 : 0.02) * SP * k, SP, k);
    return { G, R };
  }
  /** Fila de nombres de nota en cajitas (orden de bemoles / sostenidos). Devuelve [{G, x, y}]. */
  function filaOrden(parent, nombres, cx, y, o) {
    o = o || {};
    const w = o.w || 96, gap = o.gap || 20, h = o.h || 72, x0 = cx - (nombres.length * w + (nombres.length - 1) * gap) / 2 + w / 2;
    return nombres.map((n, i) => {
      const O = N.group(parent), G = N.group(O), x = x0 + i * (w + gap);
      N.el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 12, fill: C.panel, stroke: 'currentColor', 'stroke-width': 2.5 }, G);
      texto(G, n, x, y + 12, { anchor: 'middle', size: o.size || 34, peso: 800, fill: 'currentColor' });
      return { O, G, x, y };
    });
  }

  // ================================================================ N1–N5 · para qué: qué notas vigilar (Si, Mi, La) y cómo cambiarles la alteración
  function escenaVigilar() {
    const a = F0('N1') - 0.3, b = F0('N6') - 0.3;
    escena('vigilar', a, b, (s, g) => {
      const fin = b - 0.3;
      cabeceraDif(g);
      const ALL = N.group(g);
      const tRes = Wd('N3', 'respira') - 0.25, tPoc = Wd('N4', 'poco') - 0.35;
      s.on(t => opa(ALL, (1 - 0.96 * win(t, tRes, tPoc + 0.2, .5, .5)) * (1 - ease(ramp(t, fin - 0.4, fin)))));
      // ---------- N1 · ¿para qué sirve saber cuántas son y si suben o bajan? para ver qué notas vigilar
      const tCua = Wd('N1', 'cuantas') - 0.2, tSub = Wd('N1', 'suben') - 0.2, tPues = Wd('N1', 'pues') - 0.2;
      const tVig = Wd('N1', 'notas') - 0.2, tAlt = Wd('N1', 'alteradas') - 0.25, tN2 = F0('N2') - 0.25;
      const q1 = fraseG(ALL, [['¿cuántas?', C.blanco]], CX - 200, 420, { size: 44, peso: 800, italic: true, anchor: 'middle' });
      const q2 = fraseG(ALL, [['¿suben o bajan?', C.blanco]], CX + 200, 420, { size: 44, peso: 800, italic: true, anchor: 'middle' });
      aparece(s, q1, tCua, tN2, { dy: 8 }); aparece(s, q2, tSub, tN2, { dy: 8 });
      s.on(t => { const k = 1 - 0.6 * ease(ramp(t, tPues, tPues + 0.4)); color(q1, mixHex(C.blanco, C.suave, 1 - k)); color(q2, mixHex(C.blanco, C.suave, 1 - k)); });
      const OJ = N.group(ALL), OJi = N.group(OJ); icoOjo(OJi, CX - 250, 580, 0.9); color(OJi, C.rosa);
      pop(s, OJ, tVig, tN2, CX - 250, 580, { k0: .5 });
      const vg = fraseG(ALL, [['qué notas ', C.blanco], ['vigilar', C.rosa]], CX - 170, 596, { size: 54, peso: 800 });
      aparece(s, vg, tVig + 0.1, tN2, { dy: 8 });
      const va = fraseG(ALL, [['si tienen ', C.suave], ['alteración accidental', C.blanco]], CX, 690, { size: 34, peso: 700, anchor: 'middle' });
      aparece(s, va, tAlt, tN2, { dy: 6 });
      // ---------- N2 · en el ejemplo: 3 diferencias descendentes → las 3 primeras del orden de bemoles (Si, Mi, La)
      const tTres = Wd('N2', 'tres') - 0.25, tPri = Wd('N2', 'tres', 2) - 0.25, tOrd = Wd('N2', 'orden') - 0.2;
      const tAcc = Wd('N2', 'alteracion') - 0.25, tReb = Wd('N2', 'rebajar') - 0.25;
      const l1 = fraseG(ALL, [['3 diferencias', C.rosa], [' descendentes ↓', C.blanco]], CX, 262, { size: 44, peso: 800, anchor: 'middle' });
      aparece(s, l1, tTres, fin, { dy: 8 });
      const l2 = fraseG(ALL, [['las 3 primeras del ', C.blanco], ['orden de bemoles', 'currentColor']], CX, 336, { size: 36, peso: 800, anchor: 'middle' });
      aparece(s, l2, tPri, fin, { dy: 8 }); colorSeq(s, l2, [[-1, C.blanco], [tOrd, C.rosa], [tOrd + 2.2, C.blanco]], .35);
      const yO = 490;
      const ORD = filaOrden(ALL, ['Si', 'Mi', 'La', 'Re', 'Sol', 'Do', 'Fa'], CX, yO);
      const tSi = Wd('N5', 'si', 2) - 0.15, tMi = Wd('N5', 'mi') - 0.15, tLa = Wd('N5', 'la', 2) - 0.15;
      ORD.forEach((o, i) => {
        pop(s, o.O, tPri + 0.1 + i * 0.07, fin, o.x, o.y, { k0: .6 });
        if (i < 3) {
          const tn = [tSi, tMi, tLa][i];
          s.on(t => { const k = ease(ramp(t, tPri + 0.3, tPri + 0.7)); color(o.G, mezcla(C.suave, C.rosa, k)); });
          const E = N.group(ALL), Ei = N.group(E); icoOjo(Ei, o.x, yO - 72, 0.42); color(Ei, C.rosa);
          pop(s, E, tPri + 0.4 + i * 0.1, fin, o.x, yO - 72, { k0: .4 });
          s.on(t => { const k = 1 + 0.18 * Math.sin(Math.PI * ramp(t, tn, tn + 0.5)); o.G.setAttribute('transform', `translate(${o.x},${o.y}) scale(${k.toFixed(3)}) translate(${-o.x},${-o.y})`); });
        } else color(o.G, C.suave);
      });
      // con alteración accidental → rebajarla (♯ → ♮ → ♭: la inmediatamente inferior)
      const tInf = Wd('N5', 'inmediatamente') - 0.2, tSo = Wd('N5', 'sostenido') - 0.2, tBq = Wd('N5', 'becuadro', 2) - 0.2;
      const r1 = fraseG(ALL, [['con alteración accidental', 'currentColor']], CX - 30, 640, { size: 36, peso: 800, anchor: 'end' });
      aparece(s, r1, tAcc, fin, { dy: 6 });
      colorSeq(s, r1, [[-1, C.blanco], [Wd('N5', 'alteracion') - 0.2, C.rosa], [Wd('N5', 'alteracion') + 1.4, C.blanco]], .3);
      const r2 = fraseG(ALL, [['→ ', C.suave], ['rebajarla', 'currentColor'], [' ↓', C.rosa]], CX, 640, { size: 36, peso: 800 });
      aparece(s, r2, tReb, fin, { dy: 6 });
      colorSeq(s, r2, [[-1, C.rosa], [tReb + 2.4, C.blanco], [tInf, C.rosa], [tInf + 1.2, C.blanco]], .3);
      const LAD = [['accidentalSharp', CX - 330, 790], ['accidentalNatural', CX - 100, 830], ['accidentalFlat', CX + 130, 870]];
      const CA = LAD.map(([gl, x, y], i) => { const c = casAlt(ALL, gl, x, y); pop(s, c.G, tReb + 0.3 + i * 0.15, fin, x, y, { k0: .5 }); return c; });
      const FA = [0, 1].map(i => {
        const F = N.group(ALL);
        arco(F, LAD[i][1] + 56, LAD[i][2] - 30, LAD[i + 1][1] - 56, LAD[i + 1][2] - 30, 34, { w: 4, cab: 14 });
        mostrarEn(s, F, tReb + 0.6, fin, .3);
        return F;
      });
      const inf = fraseG(ALL, [['la inmediatamente ', C.blanco], ['inferior', C.rosa]], CX + 215, 882, { size: 32, peso: 800 });
      aparece(s, inf, tInf, fin, { dy: 6 });
      const vS = [[tSo, tSo + 1.4]], vN = [[Wd('N5', 'becuadro') - 0.25, Wd('N5', 'becuadro') + 1.0], [tBq, tBq + 1.2]], vB = [[Wd('N5', 'bemol') - 0.2, fin + 1]];
      rosaEn(s, CA[0].G, vS); rosaEn(s, CA[1].G, vN); rosaEn(s, CA[2].G, vB);
      rosaEn(s, FA[0], [[tSo + 0.2, tSo + 1.6]], { de: C.suave }); rosaEn(s, FA[1], [[tBq + 0.2, tBq + 1.6]], { de: C.suave });
      // ---------- N3–N4 · respira… es lo último del curso: último esfuerzo · lo explicamos poco a poco
      const RS = N.group(g), RR = N.group(RS); color(RR, C.rosa);
      const ring = N.el('circle', { cx: CX, cy: 500, r: 90, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 }, RR);
      const ring2 = N.el('circle', { cx: CX, cy: 500, r: 90, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, opacity: 0.4 }, RR);
      texto(RS, 'respira…', CX, 512, { anchor: 'middle', size: 40, peso: 800, italic: true, fill: C.blanco });
      s.on(t => {
        opa(RS, win(t, tRes, tPoc + 0.3, .5, .5));
        const f = 0.5 - 0.5 * Math.cos(2 * Math.PI * Math.max(0, t - tRes) / 3.4);
        ring.setAttribute('r', (92 + 34 * f).toFixed(1)); ring2.setAttribute('r', (118 + 50 * f).toFixed(1));
      });
      const ul = fraseG(g, [['es lo ', C.blanco], ['último', C.rosa], [' del curso', C.blanco]], CX, 720, { size: 40, peso: 800, anchor: 'middle' });
      aparece(s, ul, Wd('N3', 'ultimo') - 0.2, tPoc + 0.3, { dy: 8 });
      const ue = fraseG(g, [['¡último esfuerzo!', C.rosa]], CX, 790, { size: 36, peso: 800, italic: true, anchor: 'middle' });
      aparece(s, ue, Wd('N3', 'ultimo', 2) - 0.2, tPoc + 0.3, { dy: 8 });
      const pp = fraseG(g, [['poco a poco', C.suave]], CX, 950, { size: 30, peso: 700, italic: true, anchor: 'middle' });
      aparece(s, pp, Wd('N4', 'explicar') - 0.2, F0('N5') + 0.8, { dy: 6 });
    });
  }

  // ================================================================ N6–N9 · el ejemplo: el Sol♯ transportado es un Si… ¿Si♯? ✗ → Si♮ ✓ (diferencia descendente)
  function escenaSi() {
    const a = F0('N6') - 0.3, b = F0('E1') - 0.3;
    escena('si', a, b, (s, g) => {
      const fin = b - 0.3, sp = SP;
      cabeceraDif(g);
      const tN9 = F0('N9') - 0.25;
      const EX = N.group(g);                                     // el ejemplo, algo más abajo; sube cuando llegan los paneles de N9
      s.on(t => EX.setAttribute('transform', `translate(0,${(70 * (1 - ease(ramp(t, tN9, tN9 + 0.6)))).toFixed(1)})`));
      const X = ejemploDif(EX), { PA, PB, WA, WB, e6 } = X, { xL, yA, yB } = EJ;
      const kDim = t => 1 - 0.72 * ease(ramp(t, tN9, tN9 + 0.5));
      const tReM = Wd('N6', 're') - 0.25, tTra = Wd('N6', 'transportado') - 0.25;
      s.on(t => { const v = win(t, a + 0.1, fin, .45, .4) * kDim(t); opa(WA, v); opa(WB, v * (1 - 0.55 * win(t, tReM, tTra, .3, .3))); });
      const LC = N.group(EX); s.on(t => opa(LC, win(t, a + 0.1, fin, .45, .4) * kDim(t)));
      // N6 · en Re M hay un Sol♯; transportado, ese Sol pasa a llamarse Si
      const tRe = Wd('N6', 're') - 0.2, tSol = Wd('N6', 'sol') - 0.2, tTr = Wd('N6', 'transportado') - 0.2, tLl = Wd('N6', 'si') - 0.25;
      tonChip(s, LC, 'D', xL, yA, null, null, [[tRe, tRe + 1.5]]);
      tonChip(s, LC, 'F', xL, yB, null, null, []);
      const FL = N.group(LC); color(FL, C.suave);
      flecha(FL, xL, yA + 44, xL, yB - 44, { w: 5, cab: 18 });
      frase(FL, [['3ªm ↑', 'currentColor']], xL - 24, (yA + yB) / 2 + 12, { size: 30, peso: 800, anchor: 'end' });
      const p6 = PA.notas[5], p5 = PA.notas[4], q5 = PB.notas[4];
      const tSiS = Wd('N7', 'si') - 0.2, tDem = Wd('N7', 'demasiado') - 0.25, tCor = Wd('N7', 'correspondencia') - 0.25;
      const tMal = (S.SON_SI_MAL || [])[5] || F0('SON_SI_MAL') + 1.9, tBien = (S.SON_SI_BIEN || [])[5] || F0('SON_SI_BIEN') + 1.9;
      const tDD = Wd('N8', 'diferencia') - 0.2, tBec = Wd('N8', 'becuadro') - 0.25;
      luces(s, PA, [(i, t) => i === 5 ? win(t, tSol, tCor - 0.2, .3, .4) : 0]);
      // la flecha del Sol♯ (arriba) al 6.º de abajo
      const AR6 = N.group(EX); color(AR6, C.rosa);
      N.el('path', { d: `M${p6.cx},${yA + 72} C${p6.cx},${yA + 112} ${e6.cx},${yB - 150} ${e6.cx},${yB - 88}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-dasharray': '2 10' }, AR6);
      N.el('polygon', { points: `${e6.cx},${yB - 78} ${e6.cx - 7},${yB - 92} ${e6.cx + 7},${yB - 92}`, fill: 'currentColor' }, AR6);
      mostrarEn(s, AR6, tTr, tSiS - 0.2, .35, .3);
      // el nombre del 6.º de abajo: Si → Si♯ (✗) → Si♮ (✓)
      const yNm = yB + 124;
      const nSi = fraseG(EX, [['Si', C.rosa]], e6.cx, yNm, { size: 34, peso: 800, anchor: 'middle' });
      const nSs = fraseG(EX, [['Si♯', C.rosa]], e6.cx, yNm, { size: 34, peso: 800, anchor: 'middle' });
      const nSn = fraseG(EX, [['Si♮', 'currentColor']], e6.cx, yNm, { size: 34, peso: 800, anchor: 'middle' });
      s.on(t => {
        const d = kDim(t) * win(t, a, fin, .3, .4);
        opa(nSi, win(t, tLl, tSiS + 0.1, .3, .2) * d); opa(nSs, win(t, tSiS, tBec + 0.1, .2, .2) * d); opa(nSn, ramp(t, tBec, tBec + 0.3) * d);
        color(nSn, mezcla(C.rosa, C.blanco, ease(ramp(t, tBien + 1.2, tBien + 1.8))));
      });
      // N7 · no puede ser Si♯: el hueco se llena con un ♯ (escrito)… sonaría demasiado alto
      const gS = N.group(e6.c), gN = N.group(e6.c);
      N.glyph(gS, 'accidentalSharp', e6.x - (N.M.accidentalSharp.adv + 0.22) * sp, e6.y, sp);
      N.glyph(gN, 'accidentalNatural', e6.x - (N.M.accidentalNatural.adv + 0.22) * sp, e6.y, sp);
      s.on(t => { opa(X.hueco, 1 - ramp(t, tSiS, tSiS + 0.25)); opa(gS, ramp(t, tSiS + 0.1, tSiS + 0.35) * (1 - ramp(t, tBec, tBec + 0.25))); opa(gN, ramp(t, tBec + 0.15, tBec + 0.45)); });
      const DA = N.group(EX); color(DA, C.rosa);
      flecha(DA, e6.cx + 62, yB - 64, e6.cx + 62, yB - 124, { w: 4, cab: 14 });
      texto(DA, 'demasiado alto', e6.cx + 84, yB - 84, { size: 30, peso: 800, italic: true, fill: 'currentColor' });
      aparece(s, DA, tDem, tDD, { dy: 6 });
      // la correspondencia interválica: arriba Si–Sol♯ = 3ªm; abajo Re–Si♯ = 3D (✗) → Re–Si♮ = 3ªm (✓)
      const brk = (parent, x1, x2, y) => N.el('path', { d: `M${x1},${y - 10} V${y} H${x2} V${y - 10}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
      const IA = N.group(EX); color(IA, C.blanco);
      brk(IA, p5.cx - 8, p6.cx + 8, yA + 84); texto(IA, '3ªm', (p5.cx + p6.cx) / 2, yA + 122, { anchor: 'middle', size: 30, peso: 800, fill: 'currentColor' });
      s.on(t => opa(IA, win(t, tCor, tN9 + 0.2, .3, .35)));
      const IB = N.group(EX), IBm = N.group(IB), IBb = N.group(IB); color(IB, C.blanco);
      const yIB = yB + 162;
      brk(IB, q5.cx - 8, e6.cx + 8, yIB);
      texto(IBm, '3D', (q5.cx + e6.cx) / 2, yIB + 38, { anchor: 'middle', size: 30, peso: 800, fill: C.rojo });
      marca(IBm, false, (q5.cx + e6.cx) / 2 + 52, yIB + 26, 11);
      texto(IBb, '3ªm', (q5.cx + e6.cx) / 2, yIB + 38, { anchor: 'middle', size: 30, peso: 800, fill: C.blanco });
      marca(IBb, true, (q5.cx + e6.cx) / 2 + 58, yIB + 26, 11);
      s.on(t => { opa(IB, win(t, tCor + 0.3, tN9 + 0.2, .3, .35)); opa(IBm, 1 - ramp(t, tBec, tBec + 0.3)); opa(IBb, ramp(t, tBec + 0.2, tBec + 0.5)); });
      // SON_SI_MAL: suena el Si♯ (= Do): la nota se tacha en rosa · SON_SI_BIEN: Si♮ ✓
      const XX = N.group(EX); color(XX, C.rosa);
      tachaX(s, XX, e6.x - 1.45 * sp, e6.y - 1.25 * sp, e6.x + 1.5 * sp, e6.y + 1.25 * sp, tMal + 0.12, { w: 5 });
      s.on(t => opa(XX, (t < tMal ? 0 : 1) * (1 - ramp(t, tBec - 0.1, tBec + 0.25))));
      const OK = N.group(EX); marca(OK, true, e6.cx + 64, yNm - 12, 15);
      pop(s, OK, tBien + 0.1, tN9, e6.cx + 64, yNm - 12, { k0: .4 });
      luces(s, PB, [suena('SON_SI_MAL', PB), suena('SON_SI_BIEN', PB), (i, t) => i === 5 ? Math.max(win(t, tLl, tSiS + 1.4, .3, .4), win(t, tDD, tBec + 1.2, .3, .4)) : 0],
        { pulso: (i, t) => Math.max(pulsoSuena('SON_SI_MAL', PB)(i, t), pulsoSuena('SON_SI_BIEN', PB)(i, t)) });
      const dd = fraseG(EX, [['diferencia descendente ↓', C.rosa]], e6.cx + 60, yB - 94, { size: 30, peso: 800 });
      aparece(s, dd, tDD, tN9, { dy: 6 });
      oido(s, EX, PB.xFin + 70, yB, ['SON_SI_MAL', 'SON_SI_BIEN']);
      // ---------- N9 · si fueran ascendentes, al revés: orden de sostenidos y una alteración más alta
      const tAsc = Wd('N9', 'ascendentes') - 0.25, tRev = Wd('N9', 'reves') - 0.25, tOs = Wd('N9', 'orden') - 0.25, tMas = Wd('N9', 'mas') - 0.25;
      const yP = 690, hP = 280;
      const PD = N.group(g); panel(PD, 160, yP, 780, hP, { rx: 22, stroke: 'rgba(248,250,252,0.25)', sw: 2 });
      texto(PD, '↓  DESCENDENTES', 200, yP + 50, { size: 24, peso: 800, ls: '0.16em', fill: C.suave });
      frase(PD, [['orden de bemoles: ', C.suave], ['Si · Mi · La…', C.blanco]], 200, yP + 125, { size: 32, peso: 800 });
      frase(PD, [['alteración más baja: ', C.suave], ['♯ → ♮ → ♭', C.blanco]], 200, yP + 205, { size: 32, peso: 800 });
      s.on(t => opa(PD, win(t, tN9 + 0.2, fin, .45, .4) * (1 - 0.45 * ease(ramp(t, tAsc, tAsc + 0.5)))));
      const PU = N.group(g); panel(PU, 980, yP, 780, hP, { rx: 22, stroke: C.rosa, sw: 2 });
      texto(PU, '↑  ASCENDENTES', 1020, yP + 50, { size: 24, peso: 800, ls: '0.16em', fill: C.rosa });
      aparece(s, PU, tAsc, fin, { dy: 10 });
      const u1 = fraseG(g, [['orden de sostenidos: ', C.blanco], ['Fa · Do · Sol…', C.rosa]], 1020, yP + 125, { size: 32, peso: 800 });
      aparece(s, u1, tOs, fin, { dy: 6 });
      const u2 = fraseG(g, [['alteración más alta: ', C.blanco], ['♭ → ♮ → ♯', C.rosa]], 1020, yP + 205, { size: 32, peso: 800 });
      aparece(s, u2, tMas, fin, { dy: 6 });
      const rv = fraseG(g, [['al revés', C.rosa]], CX, yP - 22, { size: 30, peso: 800, italic: true, anchor: 'middle' });
      aparece(s, rv, tRev, fin, { dy: 6 });
    });
  }

  /** Lista con marcas (el modo Resumen). */
  function icoLista(g, cx, cy, s) {
    const G = N.group(g, 'ico'); s = s || 1;
    N.el('rect', { x: cx - 46 * s, y: cy - 52 * s, width: 92 * s, height: 104 * s, rx: 10 * s, fill: 'none', stroke: 'currentColor', 'stroke-width': 4.5 * s }, G);
    for (let i = 0; i < 3; i++) {
      const y = cy - 22 * s + i * 26 * s;
      N.el('polyline', { points: `${cx - 30 * s},${y} ${cx - 23 * s},${y + 7 * s} ${cx - 12 * s},${y - 7 * s}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 * s, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, G);
      N.line(G, cx - 2 * s, y, cx + 32 * s, y, 4 * s, { 'stroke-linecap': 'round' });
    }
    return G;
  }

  // ================================================================ E · en clase, con calma · en el portal, tres tipos de ejercicio: escrito · mental · resumen
  function escenaPortal() {
    const a = F0('E1') - 0.3, b = F0('F1') - 0.3;
    escena('portal', a, b, (s, g) => {
      const fin = b - 0.3;
      const tCla = Wd('E1', 'clases') - 0.25, tCal = Wd('E1', 'calma') - 0.2, tPor = Wd('E1', 'portal') - 0.25, tTres = Wd('E1', 'tres') - 0.2;
      const ED = N.group(g), EDi = N.group(ED); icoEdificio(EDi, CX - 250, 206, 0.55); color(EDi, C.suave);
      const cl = fraseG(g, [['en clase, ', C.blanco], ['con calma', 'currentColor']], CX - 180, 222, { size: 40, peso: 800 });
      aparece(s, ED, tCla, fin, { dy: 8 }); aparece(s, cl, tCla + 0.1, fin, { dy: 8 });
      colorSeq(s, cl, [[-1, C.rosa], [tPor, C.blanco]], .4);
      s.on(t => { const k = ease(ramp(t, tPor, tPor + 0.4)); opa(EDi, 1 - 0.4 * k); });
      const kp = N.group(g); chip(kp, 'EN EL PORTAL: 3 TIPOS DE EJERCICIO', CX, 330, { size: 30, anchor: 'middle' });
      pop(s, kp, tPor, fin, CX, 330);
      // las tres tarjetas
      const tEsc = Wd('E2', 'escrito') - 0.3, tMen = Wd('E2', 'mental') - 0.3, tRes = Wd('E2', 'resumen') - 0.3;
      const W = 460, H = 440, gap = 50, yC = 650, x0 = CX - (3 * W + 2 * gap) / 2;
      const DEF = [
        { tit: 'ESCRITO', ico: (G, x) => icoEscribir(G, x + 6, yC - 70, 1.25), sub: [['transporte ', C.suave], ['escrito', C.blanco]], t: tEsc, t1: tMen },
        { tit: 'MENTAL', ico: (G, x) => icoCabeza(G, x, yC - 74, 1.05), sub: [['transporte ', C.suave], ['mental', C.blanco]], t: tMen, t1: tRes },
        { tit: 'RESUMEN', ico: (G, x) => icoLista(G, x, yC - 74, 0.95), sub: null, t: tRes, t1: fin + 1 },
      ];
      DEF.forEach((d, i) => {
        const x = x0 + W / 2 + i * (W + gap);
        const out = N.group(g), G = N.group(out);
        const R = panel(G, x - W / 2, yC - H / 2, W, H, { rx: 24, stroke: '#3a4556', sw: 2 });
        const tt = N.group(G); texto(tt, d.tit, x, yC - H / 2 + 62, { anchor: 'middle', size: 34, peso: 800, ls: '0.14em', fill: 'currentColor' });
        const ic = N.group(G); d.ico(ic, x);
        if (d.sub) { const sb = fraseG(G, d.sub, x, yC + 70, { size: 32, peso: 800, anchor: 'middle' }); aparece(s, sb, d.t + 0.2, fin, { dy: 6 }); }
        pop(s, out, tTres + i * 0.18, fin, x, yC, { k0: .75 });
        s.on(t => {
          const k = win(t, d.t, d.t1, .3, .3);
          R.setAttribute('stroke', mezcla('#3a4556', C.rosa, k)); R.setAttribute('stroke-width', (2 + 1.5 * k).toFixed(2));
          color(tt, mezcla(C.blanco, C.rosa, k)); color(ic, mezcla(C.suave, C.rosa, k));
        });
        if (i === 2) {
          // el Resumen: armaduras · tonalidad · diferencias · qué notas vigilar
          const L = [['armaduras', 'armaduras'], ['tonalidad', 'tonalidad'], ['diferencias', 'diferencias'], ['qué notas vigilar', 'notas']];
          L.forEach(([txt, pal], j) => {
            const tj = Wd('E2', pal) - 0.25, tn = j < 3 ? Wd('E2', L[j + 1][1]) - 0.25 : Wd('E2', 'pero') - 0.2;
            const f = fraseG(G, [['· ', C.suave], [txt, 'currentColor']], x - 150, yC + 40 + j * 44, { size: 30, peso: 800 });
            aparece(s, f, tj, fin, { dy: 6 });
            colorSeq(s, f, [[-1, C.rosa], [tn, C.blanco]], .3);
          });
        }
      });
      const tSen = Wd('E2', 'sencilla') - 0.25;
      const se = fraseG(g, [['de forma ', C.suave], ['sencilla y simplificada', C.blanco]], x0 + 2 * (W + gap) + W / 2, yC + H / 2 + 50, { size: 28, peso: 700, italic: true, anchor: 'middle' });
      aparece(s, se, tSen, fin, { dy: 6 });
    });
  }

  // ================================================================ F · repaso final (se construye línea a línea)
  function escenaRepaso() {
    const a = F0('F1') - 0.3, b = T.acorde + 0.15;
    escena('repaso', a, b, (s, g) => {
      const fin = b - 0.3;
      const kr = N.group(g); chip(kr, 'REPASO FINAL', CX, 150, { size: 36, anchor: 'middle' });
      pop(s, kr, Wd('F1', 'recapitular') - 0.3, fin, CX, 150);
      const P = N.group(g); panel(P, 200, 240, 1520, 660, { rx: 26, stroke: 'rgba(248,250,252,0.3)', sw: 2 });
      aparece(s, P, Wd('F1', 'recapitular') - 0.1, fin, { dy: 12 });
      const tF3 = F0('F3') - 0.2;
      const FIL = [
        { rot: 'TRANSPORTAR', t0: Wd('F2', 'transportar') - 0.2, t1: Wd('F2', 'podemos') - 0.2,
          partes: [[[['mover la melodía ', C.blanco]], Wd('F2', 'mover') - 0.2], [[['a otra tonalidad', 'currentColor']], Wd('F2', 'tonalidad') - 0.25]] },
        { rot: 'ESCRITO', t0: Wd('F2', 'escrito') - 0.25, t1: Wd('F2', 'mental') - 0.3,
          partes: [[[['más tiempo', 'currentColor']], Wd('F2', 'tiempo') - 0.3], [[['· luego, ', C.suave], ['nada que pensar', 'currentColor']], Wd('F2', 'pensar') - 0.3]] },
        { rot: 'MENTAL', t0: Wd('F2', 'mental') - 0.3, t1: tF3,
          partes: [[[['en un momento, en el papel', 'currentColor']], Wd('F2', 'momento') - 0.3], [[['· ', C.suave], ['mucha concentración', 'currentColor']], Wd('F2', 'concentracion') - 0.3]] },
        { rot: 'DIFERENCIAS', t0: Wd('F3', 'cuidado') - 0.25, t1: Wd('F3', 'tenemos') - 0.2,
          partes: [[[['ojo con las ', C.blanco], ['alteraciones accidentales', 'currentColor']], Wd('F3', 'alteraciones') - 0.25]] },
        { rot: 'VIGILA', ojo: true, t0: Wd('F3', 'tenemos') - 0.2, t1: fin + 1,
          partes: [[[['las notas ', C.blanco], ['sospechosas', 'currentColor']], Wd('F3', 'sospechosas') - 0.25]] },
      ];
      FIL.forEach((f, i) => {
        const y = 340 + i * 118;
        const R = N.group(g);
        const rt = texto(R, f.rot, 290, y, { size: 30, peso: 800, ls: '0.16em', fill: 'currentColor' });
        if (f.ojo) { const O = N.group(R); icoOjo(O, 290 + D.medir(rt) + 50, y - 11, 0.42); }
        aparece(s, R, f.t0, fin, { dy: 8 });
        s.on(t => color(R, mezcla(C.blanco, C.rosa, win(t, f.t0, f.t1, .3, .35))));
        let x = 720;
        f.partes.forEach(([segs, tp], j) => {
          const Fg = fraseG(g, segs, x, y, { size: 38, peso: 800 });
          x += Fg._f._w + 11;
          aparece(s, Fg, tp, fin, { dy: 6 });
          const tBl = j < f.partes.length - 1 ? f.partes[j + 1][1] : f.t1;
          colorSeq(s, Fg, [[-1, C.rosa], [tBl, C.blanco]], .35);
        });
        if (i < FIL.length - 1) { const sep = N.line(g, 280, y + 58, 1640, y + 58, 1.5, { stroke: 'rgba(248,250,252,0.12)' }); mostrarEn(s, sep, FIL[i + 1].t0, fin, .3); }
      });
      const an = fraseG(g, [['¡Mucho ánimo!', C.rosa]], CX, 970, { size: 40, peso: 800, italic: true, anchor: 'middle' });
      aparece(s, an, Wd('F4', 'animo') - 0.35, fin, { dy: 8 });
    });
  }

  const ORDEN = [escenaDefinicion, escenaEscrito, escenaMental, escenaDiferencias, escenaPasos, escenaVigilar, escenaSi, escenaPortal, escenaRepaso];

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
