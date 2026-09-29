/* =====================================================================
   ESCENAS · Cadencias (GP)
   Montado por pipe/escenas_build.py: utilidades comunes (_comun/) + escenas
   propias (cadencias-pro/escenas_cuerpo.js). Todo es función pura de t.
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

  // ================================================================ P6 · CADENCIAS (GP · 2º GP): auténtica, plagal, semicadencia y rota · perfecta e imperfecta
  const TITULO = { kicker: 'GRADO PROFESIONAL  ·  TEORÍA', lineas: ['CADENCIAS'], sub: 'Auténtica · Plagal · Semicadencia · Rota · Perfecta · Imperfecta' };

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
  // escrituras «solo si cambia» (la escena de los corales toca muchos elementos por fotograma)
  function setO(el, v) { v = clamp(v); const r = v.toFixed(3); if (el._o !== r) { el._o = r; el.setAttribute('opacity', r); el.style.display = v <= 0.001 ? 'none' : ''; } }
  function setC(el, c) { if (el._c !== c) { el._c = c; el.style.color = c; } }
  function setT(el, x, y) { const r = `translate(${x.toFixed(1)},${y.toFixed(1)})`; if (el._t !== r) { el._t = r; el.setAttribute('transform', r); } }

  /** Grado con su cifrado: 'V⁷', 'I⁶', 'ii⁶', 'I⁶₄' (6 sobre 4), 'vi'… La cifra, pequeña y arriba.
   *  anchor: 'base' (el número romano centrado en x; la cifra cuelga a la derecha) · 'start' · centrado (por defecto). */
  const CIFRA = { '⁶': '6', '⁷': '7', '₄': '4' };
  function grado(parent, str, x, y, o) {
    o = o || {};
    const size = o.size || 40, peso = o.peso || 800, fill = o.fill || 'currentColor';
    const G = N.group(parent, 'grado');
    let base = '', sup = '', sub = '';
    for (const ch of str) { if (ch === '⁶' || ch === '⁷') sup += CIFRA[ch]; else if (ch === '₄') sub += CIFRA[ch]; else base += ch; }
    const tb = texto(G, base, 0, 0, { size, peso, fill });
    const wb = D.medir(tb);
    const fs = Math.round(size * 0.54), xc = wb + size * 0.05;
    let wc = 0;
    if (sup) { const t1 = texto(G, sup, xc, -size * 0.40, { size: fs, peso, fill }); wc = Math.max(wc, D.medir(t1)); }
    if (sub) { const t2 = texto(G, sub, xc, size * 0.08, { size: fs, peso, fill }); wc = Math.max(wc, D.medir(t2)); }
    const w = wb + (wc ? size * 0.05 + wc : 0);
    const ax = o.anchor === 'start' ? x : (o.anchor === 'base' ? x - wb / 2 : x - w / 2);
    G.setAttribute('transform', `translate(${ax.toFixed(1)},${y})`);
    G._w = w; G._wb = wb; G._x = ax;
    return G;
  }
  /** «V → I» grande: los grados en rosa, la flecha en blanco, centrado en x. Devuelve {g, A, B, F, w, xB, wB}. */
  function formula(parent, izq, der, x, y, o) {
    o = o || {};
    const size = o.size || 56, fl = o.fl || 86, gap = size * 0.36;
    const G = N.group(parent, 'formula');
    const A = N.group(G), F = N.group(G), B = N.group(G);
    const a = grado(A, izq, 0, y, { size, anchor: 'start' });
    const b = grado(B, der, 0, y, { size, anchor: 'start' });
    const w = a._w + gap + fl + gap + b._w, x0 = x - w / 2, xB = x0 + a._w + 2 * gap + fl;
    a.setAttribute('transform', `translate(${x0.toFixed(1)},${y})`);
    b.setAttribute('transform', `translate(${xB.toFixed(1)},${y})`);
    color(A, o.colA || C.rosa); color(B, o.colB || C.rosa); color(F, C.blanco);
    flecha(F, x0 + a._w + gap, y - size * 0.34, x0 + a._w + gap + fl, y - size * 0.34, { w: 5, cab: 18 });
    return { g: G, A, B, F, w, x0, xB, wB: b._w };
  }
  /** Signo de puntuación grande: '.' y ',' dibujados (en la fuente salen diminutos); el resto, texto. (x, y) = base. */
  function puntoGrande(parent, ch, x, y, size) {
    size = size || 140; const r = size * 0.13;
    if (ch === '.') return N.el('circle', { cx: x, cy: y - r, r, fill: 'currentColor' }, parent);
    if (ch === ',') {
      const G = N.group(parent);
      N.el('circle', { cx: x, cy: y - r, r, fill: 'currentColor' }, G);
      N.el('path', { d: `M${x + r * 0.95},${y - r * 0.9} C${x + r * 1.1},${y + r * 1.2} ${x - r * 0.2},${y + r * 2.1} ${x - r * 1.0},${y + r * 2.4} C${x - r * 0.1},${y + r * 1.5} ${x + r * 0.2},${y + r * 0.6} ${x - r * 0.1},${y - r * 0.2} Z`, fill: 'currentColor' }, G);
      return G;
    }
    return texto(parent, ch, x, y, { anchor: 'middle', size, peso: 800, fill: 'currentColor' });
  }
  function icoOjoCerrado(g, cx, cy, s) {
    const G = N.group(g, 'ico'); s = s || 1;
    N.el('path', { d: `M${cx - 60 * s},${cy - 6 * s} C${cx - 30 * s},${cy + 30 * s} ${cx + 30 * s},${cy + 30 * s} ${cx + 60 * s},${cy - 6 * s}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 6 * s, 'stroke-linecap': 'round' }, G);
    for (const [dx, dy] of [[-40, 18], [-14, 26], [14, 26], [40, 18]]) N.line(G, cx + dx * s, cy + dy * s, cx + dx * 1.15 * s, cy + (dy + 18) * s, 4.5 * s, { 'stroke-linecap': 'round' });
    return G;
  }
  function icoPlaneta(g, cx, cy, s) {
    const G = N.group(g, 'ico'); s = s || 1;
    N.el('circle', { cx, cy, r: 34 * s, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 * s }, G);
    N.el('ellipse', { cx, cy, rx: 62 * s, ry: 16 * s, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 * s, transform: `rotate(-18 ${cx} ${cy})` }, G);
    return G;
  }
  /** Tuerca (hexágono con agujero), centrada en (0,0): se coloca y se gira desde fuera. */
  function icoTuerca(g, s) {
    const G = N.group(g, 'ico'); s = s || 1;
    const R = 34 * s;
    const pts = Array.from({ length: 6 }, (_, i) => { const a = i * Math.PI / 3; return `${(R * Math.cos(a)).toFixed(1)},${(R * Math.sin(a)).toFixed(1)}`; }).join(' ');
    N.el('polygon', { points: pts, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 * s, 'stroke-linejoin': 'round' }, G);
    N.el('circle', { cx: 0, cy: 0, r: 13 * s, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 * s }, G);
    return G;
  }
  /** Onda que se abre desde (x, y) en el instante t0 (para señalar una nota concreta). */
  function onda(s, parent, x, y, ts, o) {
    o = o || {};
    const O = N.group(parent, 'onda'); color(O, o.col || C.rosa);
    const c = N.el('circle', { cx: x, cy: y, r: 16, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 }, O);
    s.on(t => {
      let k = -1;
      for (const t0 of [].concat(ts)) if (t >= t0 && t <= t0 + 0.75) k = (t - t0) / 0.75;
      if (k < 0) { setO(O, 0); return; }
      c.setAttribute('r', (16 + 30 * eo(k)).toFixed(1)); setO(O, 0.95 * (1 - k));
    });
    return O;
  }

  // ================================================================ LOS CORALES a cuatro voces (Sol M, 4/4, cuatro compases)
  // Tal cual en Teoría PRO → «Cadencias · Ejemplos · 2º GP» y en pipe/p_cadencias_pro.py (CORALES): cada voz 'nota:figura'
  // (w redonda, h blanca, q negra), '|' entre compases, '~' ligadura con la siguiente, '>' cabeza corrida a la derecha.
  // Plicas: soprano y tenor hacia arriba; contralto y bajo hacia abajo. La cadencia = los dos últimos acordes (desde la negra 10).
  const CORALES = {
    SON_AUT: { grados: ['I', 'V⁶', 'I⁶', 'IV', 'V', 'V⁷', 'I'],
      S: 'b/4:h a/4:h~ | a/4:q g/4:q g/4:h> | f#/4:h f#/4:h | g/4:w', A: 'd/4:h d/4:h | d/4:h f#/4:q e/4:q | d/4:h d/4:h | d/4:w',
      T: 'd/4:q c/4:q d/4:q c/4:q | d/4:h c/4:h | a/3:h c/4:h | b/3:w', B: 'g/2:h f#/2:h | b/2:h c/3:h | d/3:h d/3:h | g/3:w' },
    SON_AUI: { grados: ['I', 'vi', 'IV', 'ii⁶', 'V', 'V⁶', 'I'],
      S: 'b/4:h b/4:h | d/5:q c/5:q a/4:h | f#/4:h d/4:h | d/4:w', A: 'd/4:h e/4:q d/4:q | e/4:h e/4:h | d/4:h d/4:h | d/4:w',
      T: 'g/3:h g/3:h | g/3:h a/3:h | a/3:h a/3:h | b/3:w', B: 'g/3:h e/3:h | c/3:h c/3:h | d/3:h f#/3:h | g/3:w' },
    SON_PLA: { grados: ['I', 'V⁶', 'I', 'V⁷', 'I', 'IV', 'I'],
      S: 'b/4:h a/4:h | g/4:h~ g/4:q f#/4:q | g/4:h g/4:h | g/4:w', A: 'd/4:h d/4:h | d/4:q c/4:q d/4:q c/4:q | d/4:h e/4:h | d/4:w',
      T: 'd/4:h d/4:q c/4:q | b/3:h c/4:h | b/3:h c/4:h | b/3:w', B: 'g/3:h f#/3:h | g/3:h d/3:h | g/3:h c/4:h | g/3:w' },
    SON_PLI: { grados: ['I', 'V⁶', 'I', 'V⁷', 'I', 'IV', 'I⁶'],
      S: 'b/4:h a/4:h | b/4:h c/5:h | b/4:h c/5:h | d/5:w', A: 'd/4:h d/4:h | d/4:q e/4:q f#/4:h | g/4:h g/4:h | g/4:w',
      T: 'd/4:q c/4:q d/4:h | d/4:h d/4:h | d/4:h e/4:h | d/4:w', B: 'g/3:h f#/3:h | g/3:h d/3:h | g/3:h c/4:h | b/3:w' },
    SON_SEM: { grados: ['I', 'V⁶', 'I⁶', 'IV', 'ii⁶', 'IV', 'V'],
      S: 'd/5:h d/5:h | d/5:h c/5:q b/4:q | c/5:h c/5:h | a/4:w', A: 'b/4:h a/4:h~ | a/4:q g/4:q g/4:h | a/4:h g/4:h | f#/4:w',
      T: 'd/4:h d/4:h | d/4:h f#/4:q e/4:q | e/4:h e/4:h | d/4:w', B: 'g/3:h f#/3:h | b/3:h c/4:h | c/4:h c/4:h | d/4:w' },
    SON_ROT: { grados: ['I', 'vi', 'IV', 'ii⁶', 'V', 'V⁷', 'vi'],
      S: 'b/4:h b/4:h | d/5:q c/5:q a/4:h | a/4:h c/5:h | b/4:w', A: 'd/4:h e/4:h | e/4:h e/4:h | f#/4:h f#/4:h | g/4:w',
      T: 'g/3:h> g/3:h | g/3:h a/3:h | a/3:h a/3:h | g/3:w', B: 'g/3:q f#/3:q e/3:q d/3:q | c/3:h c/3:h | d/3:h d/3:h | e/3:w' },
    // la adivinanza (coral nuevo, mismo formato): I – I⁶ – IV – ii⁶ – I⁶₄ – V⁷ – vi
    SON_QUIZ: { grados: ['I', 'I⁶', 'IV', 'ii⁶', 'I⁶₄', 'V⁷', 'vi'],
      S: 'b/4:h d/5:h | c/5:h a/4:h | g/4:h f#/4:h | g/4:w', A: 'g/4:h g/4:h | g/4:h e/4:h | d/4:h c/4:h | b/3:w',
      T: 'd/4:h d/4:h | e/4:h c/4:h | b/3:h a/3:h | g/3:w', B: 'g/2:h b/2:h | c/3:h c/3:h | d/3:h d/3:h | e/3:w' },
  };
  const VOCES = ['S', 'A', 'T', 'B'];
  const FIG = { w: 4, h: 2, q: 1 };
  const CAB = { w: 'noteheadWhole', h: 'noteheadHalf', q: 'noteheadBlack' };
  function leeVoz(str) {
    const out = []; let q = 0;
    for (const comp of str.split('|')) for (const tok of comp.trim().split(/\s+/)) {
      const m = /^([a-g])([#b]?)\/(\d):([whq])(~?)(>?)$/.exec(tok);
      if (!m) throw new Error('nota mal escrita: ' + tok);
      out.push({ n: m[1].toUpperCase() + m[2] + m[3], fig: m[4], q, d: FIG[m[4]], liga: !!m[5], der: !!m[6] });
      q += FIG[m[4]];
    }
    return out;
  }
  /** Colocación común de todos los corales (el sistema no se mueve en todo el vídeo). */
  function lay() {
    const x0 = 196, yS = 428, sep = 12.5 * SP, yF = yS + sep;               // entre pentagramas ≈ 8,5 sp (como en la hoja)
    const xa = x0 + 3.9 * SP + 4;                                             // el Fa♯ de la armadura
    const xTS = xa + N.M.accidentalSharp.adv * SP + 0.9 * SP;                // el 4/4
    const wTS = N.anchoCompas({ tipo: 'simple', num: '4', den: '4' }, SP);
    const QW = 73, PAD = [1.45 * SP, 1.1 * SP, 1.1 * SP, 1.75 * SP];
    const mS = [xTS + wTS], bar = [];
    for (let k = 0; k < 3; k++) { const b = mS[k] + PAD[k] + 4 * QW - 0.34 * QW; bar.push(b); mS.push(b); }
    const xHead = q => { const k = Math.min(3, Math.floor(q / 4)); return mS[k] + PAD[k] + (q - 4 * k) * QW; };
    const wW = N.M.noteheadWhole.adv * SP, wH = N.M.noteheadHalf.adv * SP;
    const xFin = xHead(12) + wW + 2.3 * SP;                                   // doble barra final
    const xEnd = xFin + 0.98 * SP;
    const cx6 = xHead(10) + wH / 2, cx7 = xHead(12) + wW / 2;               // centros de los dos acordes de la cadencia
    const cajaX0 = xHead(10) - 38, cajaX1 = xHead(12) + wW + 38;
    const cajaY0 = yS - 2 * SP - 60, cajaY1 = yF + 2 * SP + 46;
    return { x0, yS, sep, yF, xa, xTS, wTS, QW, mS, bar, xHead, xFin, xEnd, wW, wH, cx6, cx7, cajaX0, cajaX1, cajaY0, cajaY1,
      yGrado: cajaY1 + 46, yEtiq: cajaY1 + 92 };
  }
  /** Sistema del coral: clave de Sol y de Fa, llave, Fa♯ en los dos, 4/4, barras de compás y doble barra final. */
  function sistemaCoral(parent, L) {
    const S_ = sistema(parent, L.x0, L.yS, L.xEnd - L.x0, { sep: L.sep });
    const AR = N.group(S_.g, 'armadura');
    N.glyph(AR, 'accidentalSharp', L.xa, L.yS - 2 * SP, SP);
    N.glyph(AR, 'accidentalSharp', L.xa, L.yF - 1 * SP, SP);
    N.compas(S_.g, { tipo: 'simple', num: '4', den: '4' }, L.xTS, L.yS, SP);
    N.compas(S_.g, { tipo: 'simple', num: '4', den: '4' }, L.xTS, L.yF, SP);
    const y1 = L.yS - 2 * SP, y2 = L.yF + 2 * SP;
    L.bar.forEach(x => N.line(S_.g, x, y1, x, y2, N.E.thinBar * SP));
    N.line(S_.g, L.xFin, y1, L.xFin, y2, N.E.thinBar * SP);
    N.el('rect', { x: (L.xFin + 0.48 * SP).toFixed(1), y: y1, width: (0.5 * SP).toFixed(1), height: y2 - y1, fill: 'currentColor' }, S_.g);
    S_.ar = AR;
    return S_;
  }
  /** Dibuja un coral: cada nota en su grupo (W: se desplaza · H: cabeza y plica, se colorea · LG: líneas adicionales).
   *  Devuelve {G, notas:[…], ligas:[…]}. */
  function dibujaCoral(parent, c, L) {
    const G = N.group(parent, 'coral');
    const LGs = N.group(G, 'adicionales'), NS_ = N.group(G, 'notas'), LI = N.group(G, 'ligaduras');
    const notas = [];
    for (const v of VOCES) {
      const fa = v === 'T' || v === 'B', arriba = v === 'S' || v === 'T', yM = fa ? L.yF : L.yS;
      const lista = leeVoz(c[v]);
      lista.forEach((e, i) => {
        const pos = fa ? N.posFa(e.n) : N.posSol(e.n), y = yM - pos * SP;
        const cabN = CAB[e.fig], wCab = N.M[cabN].adv * SP;
        const x = L.xHead(e.q) + (e.der ? L.wH : 0);
        const LG = N.group(LGs, 'ad');
        for (let lp = 3; lp <= pos + 1e-6; lp++) N.line(LG, x - N.E.ledgerExt * SP, yM - lp * SP, x + wCab + N.E.ledgerExt * SP, yM - lp * SP, N.E.ledger * SP);
        for (let lp = -3; lp >= pos - 1e-6; lp--) N.line(LG, x - N.E.ledgerExt * SP, yM - lp * SP, x + wCab + N.E.ledgerExt * SP, yM - lp * SP, N.E.ledger * SP);
        const W = N.group(NS_, 'nota ' + v), H = N.group(W, 'cab');
        N.glyph(H, cabN, x, y, SP);
        if (e.fig !== 'w') {
          if (arriba) N.line(H, x + wCab - N.E.stem / 2 * SP, y - 0.168 * SP, x + wCab - N.E.stem / 2 * SP, y - 3.5 * SP, N.E.stem * SP);
          else N.line(H, x + N.E.stem / 2 * SP, y + 0.168 * SP, x + N.E.stem / 2 * SP, y + 3.5 * SP, N.E.stem * SP);
        }
        notas.push(Object.assign({}, e, { v, i, x, y, pos, wCab, cx: x + wCab / 2, W, H, LG, arriba, fa, cad: e.q >= 10, qA: e.q, qE: e.q + e.d }));
      });
    }
    // cadenas de ligadura (suenan como una sola nota)
    for (const v of VOCES) {
      const vs = notas.filter(e => e.v === v);
      for (let i = 1; i < vs.length; i++) if (vs[i - 1].liga && vs[i - 1].n === vs[i].n) vs[i].qA = vs[i - 1].qA;
      for (let i = vs.length - 2; i >= 0; i--) if (vs[i].liga && vs[i].n === vs[i + 1].n) vs[i].qE = vs[i + 1].qE;
    }
    const ligas = [];
    for (const e of notas) if (e.liga) {
      const f = notas.find(m => m.v === e.v && m.q === e.q + e.d);
      if (!f) continue;
      const dir = e.arriba ? -1 : 1, ym = e.y + dir * 0.55 * SP;
      const x1 = e.x + e.wCab + (e.arriba ? 0.2 : 0.1) * SP, x2 = f.x - 0.12 * SP, xm = (x1 + x2) / 2;
      const Hh = 0.5 * SP, Tt = 0.16 * SP;
      const P = N.group(LI, 'liga');
      N.el('path', { d: `M${x1.toFixed(1)},${ym.toFixed(1)} Q${xm.toFixed(1)},${(ym + dir * 2 * Hh).toFixed(1)} ${x2.toFixed(1)},${ym.toFixed(1)} Q${xm.toFixed(1)},${(ym + dir * 2 * (Hh - Tt)).toFixed(1)} ${x1.toFixed(1)},${ym.toFixed(1)} Z`, fill: 'currentColor' }, P);
      ligas.push({ g: P, de: e, a: f });
    }
    return { G, notas, ligas };
  }
  /** Parejas entre un coral y el siguiente: misma voz, tiempo y figura → 'igual' (misma nota: se queda) o 'mueve'
   *  (otra altura: la cabeza se desliza); el resto se funde. */
  function emparejar(A, B) {
    for (const nb of B.notas) {
      const na = A.notas.find(n => n.v === nb.v && n.q === nb.q && n.fig === nb.fig);
      if (!na) continue;
      const tipo = (na.n === nb.n && Math.abs(na.x - nb.x) < 0.5) ? 'igual' : 'mueve';
      nb.ant = na; nb.tipo = tipo; na.tipoSig = tipo;
    }
  }
  const DLY = q => 0.07 * q;                                  // los cambios barren de izquierda a derecha
  /** Anima un coral: entrada (escrito o transformado desde el anterior), salida, color (estado + lo que suena).
   *  o = { tIn, tOut, escribe, siguiente, fin, rosa(t, e) → 0…1, dim(t, e) → 0…1, NG (negras del bloque), blq0 } */
  function animaCoral(s, K, o) {
    s.on(t => {
      const act = t >= o.tIn - 0.15 && t <= (o.siguiente ? o.tOut + 1.3 : 1e9);
      if (!act) { setO(K.G, 0); return; }
      setO(K.G, 1);
      for (const e of K.notas) {
        const dI = o.tIn + DLY(e.q), dO = o.tOut + DLY(e.q);
        let op = 1, opL = 1, dx = 0, dy = 0;
        if (o.escribe) { op = eo(ramp(t, dI, dI + 0.35)); opL = op; dy = (1 - op) * 12; }
        else if (e.tipo === 'igual') { op = opL = t >= dI ? 1 : 0; }
        else if (e.tipo === 'mueve') {
          op = t >= dI ? 1 : 0; const k = ease(ramp(t, dI, dI + 0.55));
          dx = (e.ant.x - e.x) * (1 - k); dy = (e.ant.y - e.y) * (1 - k);
          opL = ramp(t, dI + 0.35, dI + 0.6);
        } else { op = opL = ease(ramp(t, dI, dI + 0.4)); }
        if (o.siguiente) {
          if (e.tipoSig === 'igual') { if (t >= dO) op = opL = 0; }
          else if (e.tipoSig === 'mueve') { if (t >= dO) op = 0; opL = Math.min(opL, 1 - ramp(t, dO, dO + 0.3)); }
          else { const k = ease(ramp(t, dO, dO + 0.35)); op *= 1 - k; opL *= 1 - k; }
        }
        if (o.fin != null) { const k = 1 - ease(ramp(t, o.fin - 0.4, o.fin)); op *= k; opL *= k; }
        const dm = o.dim ? o.dim(t, e) : 1;
        setO(e.W, op * dm); setO(e.LG, opL * dm); setT(e.W, dx, dy);
        // color: estado (blanco … rosa) y, mientras suena el ejemplo, cada nota se enciende con su ataque
        let k = o.rosa ? o.rosa(t, e) : 0;
        if (o.NG) {
          const tA = o.NG[e.qA], tE = e.qE <= 12 ? o.NG[e.qE] : o.NG[12] + 2.5;
          const son = win(t, tA - 0.04, tE + 0.1, 0.06, 0.28), sup = win(t, o.blq0 - 0.35, tE + 0.1, 0.3, 0.28);
          k = Math.max(k * (1 - sup), son);
        }
        e.col = mezcla(C.blanco, C.rosa, clamp(k));
        setC(e.H, e.col);
      }
      for (const L_ of K.ligas) {
        const e = L_.de, dI = o.tIn + DLY(e.q), dO = o.tOut + DLY(e.q);
        let op = o.escribe ? eo(ramp(t, dI + 0.1, dI + 0.45)) : ease(ramp(t, dI + 0.5, dI + 0.8));
        if (o.siguiente) op *= 1 - ramp(t, dO - 0.05, dO + 0.2);
        if (o.fin != null) op *= 1 - ease(ramp(t, o.fin - 0.4, o.fin));
        setO(L_.g, op * (o.dim ? o.dim(t, e) : 1)); setC(L_.g, e.col);
      }
    });
  }
  /** Caja rosa de la cadencia (los dos últimos acordes). */
  function cajaCadencia(parent, L) {
    const G = N.group(parent, 'caja'); color(G, C.rosa);
    N.el('rect', { x: L.cajaX0, y: L.cajaY0, width: L.cajaX1 - L.cajaX0, height: L.cajaY1 - L.cajaY0, rx: 22, fill: 'currentColor', 'fill-opacity': 0.1, stroke: 'currentColor', 'stroke-width': 3 }, G);
    return G;
  }
  /** Rótulo bajo el bajo de un acorde de la cadencia («fundamental» / «invertido»), del tamaño que quepa. */
  function etiquetaBajo(parent, txt, x, y, wMax) {
    const G = N.group(parent, 'etiqueta'); color(G, C.rosa);
    const t = texto(G, txt, x, y, { anchor: 'middle', size: 26, peso: 700, italic: true, fill: 'currentColor' });
    const w = D.medir(t); if (w > wMax) t.setAttribute('font-size', (26 * wMax / w).toFixed(1));
    return G;
  }

  // ================================================================ I · la música respira: las cadencias son su puntuación
  function escenaIntro() {
    const a = F0('I1') - 0.1, b = F0('B1') - 0.25;
    escena('intro', a, b, (s, g) => {
      const fin = b - 0.3, yT = 230;
      const tRe = Wd('I1', 'respira') - 0.5, tCa = Wd('I2', 'cadencias') - 0.3, tPu = Wd('I3', 'puntuacion') - 0.3;
      const tFr = Wd('I3', 'frases') - 0.2, tRp = Wd('I4', 'repaso') - 0.3, tVu = Wd('I4', 'vuelta') - 0.3;
      // una melodía en tres frases, con respiraciones entre ellas
      const FR3 = [
        'M185,410 C265,330 335,350 395,380 S505,450 595,400',
        'M695,400 C765,310 855,320 915,370 S1035,430 1125,380',
        'M1225,380 C1305,300 1385,350 1455,370 S1595,420 1735,430',
      ];
      const fins = [[595, 400], [1125, 380], [1735, 430]];
      // (la melodía y su rótulo empiezan centrados en la pantalla y suben cuando llegan las tarjetas)
      const DY0 = 190, TOP = N.group(g);
      s.on(t => setT(TOP, 0, DY0 * (1 - ease(ramp(t, tFr - 0.2, tFr + 0.6)))));
      const ON = N.group(TOP); color(ON, C.blanco);
      const ps = FR3.map(d => trazo(ON, d, { w: 7 }));
      const tMe = F0('I1') + 0.15;                  // la melodía se dibuja con sus primeras palabras
      s.on(t => { ps.forEach((p, i) => trazoK(p, ramp(t, tMe + i * 0.45, tMe + 0.6 + i * 0.45))); opa(ON, win(t, tMe, tFr + 0.4, .2, .5)); });
      // palabras clave (una línea que va cambiando)
      const L1 = fraseG(TOP, [['la música ', C.blanco], ['respira', C.rosa]], CX, yT, { size: 48, peso: 800, anchor: 'middle' });
      aparece(s, L1, tRe, tCa, { dy: 8 });
      const L2 = fraseG(TOP, [['se detiene: ', C.blanco], ['las cadencias', C.rosa]], CX, yT, { size: 48, peso: 800, anchor: 'middle' });
      aparece(s, L2, tCa + 0.1, tPu, { dy: 8 });
      const L3 = fraseG(TOP, [['como la ', C.blanco], ['puntuación', C.rosa]], CX, yT, { size: 48, peso: 800, anchor: 'middle' });
      aparece(s, L3, tPu + 0.1, tRp, { dy: 8 });
      // I3 · tres tarjetas: los puntos de respiración vuelan a su tarjeta y se convierten en la puntuación
      const PU = [
        { ch: '.', tx: 'cierra del todo', tT: Wd('I3', 'cierran') - 0.2, t0: Wd('I3', 'punto') - 0.35, nm: [['auténtica · plagal', C.rosa]] },
        { ch: ',', tx: 'se queda esperando', tT: Wd('I3', 'esperando') - 0.3, t0: Wd('I3', 'coma') - 0.35, nm: [['semicadencia', C.rosa]] },
        { ch: '¡!', tx: 'final inesperado', tT: Wd('I3', 'inesperada') - 0.45, t0: Wd('I3', 'inesperada') - 0.3, nm: [['rota', C.rosa]] },
      ];
      const wC = 440, gC = 40, xC = CX - (3 * wC + 2 * gC) / 2, yC = 490, hC = 290, yMk = yC + 160;
      PU.forEach((p, i) => {
        const x = xC + i * (wC + gC), cx = x + wC / 2;
        const P = N.group(g); panel(P, x, yC, wC, hC, { rx: 24 });
        pop(s, P, tFr + i * 0.15, fin, cx, yC + hC / 2, { k0: .9 });
        const M_ = N.group(g); color(M_, C.rosa); puntoGrande(M_, p.ch, cx, yMk, 150);
        mostrarEn(s, M_, p.t0 + 0.4, fin, .2, .4);
        const tx = texto(g, p.tx, cx, yC + 240, { anchor: 'middle', size: 32, peso: 800, fill: C.blanco });
        aparece(s, tx, p.tT, fin, { dy: 6 });
        // I4 · «ya los conoces»: sus nombres, escritos bajo cada tarjeta
        const nm = fraseG(g, p.nm, cx, yC + hC + 64, { size: 36, peso: 800, anchor: 'middle' });
        aparece(s, nm, Wd('I4', 'conoces') - 0.3 + i * 0.3, fin, { dy: 8 });
        // el punto de respiración de la melodía (aparece con «cadencias») vuela hasta su tarjeta
        const [fx, fy] = fins[i], r1 = 150 * 0.13, ty = p.ch === '¡!' ? yMk - 50 : yMk - r1;
        const D_ = N.group(TOP); color(D_, C.rosa);
        const dot = N.el('circle', { cx: 0, cy: 0, r: 14, fill: 'currentColor' }, D_);
        s.on(t => {
          const vis = win(t, tCa + i * 0.15, p.t0 + 0.55, .3, .2);
          opa(D_, vis); if (vis <= 0) return;
          const k = ease(ramp(t, p.t0, p.t0 + 0.45));
          const x_ = lerp(fx, cx, k), y_ = lerp(fy, ty, k) - Math.sin(Math.PI * k) * 70;
          D_.setAttribute('transform', `translate(${x_.toFixed(1)},${y_.toFixed(1)})`);
          dot.setAttribute('r', lerp(14, p.ch === '¡!' ? 10 : r1, k).toFixed(1));
        });
      });
      // I4 · «un repaso y una vuelta de tuerca»
      const L4 = fraseG(g, [['un repaso ', C.blanco], ['y una vuelta de tuerca', C.rosa]], CX - 50, yT, { size: 48, peso: 800, anchor: 'middle' });
      const L4a = L4._f, wL4 = L4a._w;
      s.on(t => {
        opa(L4, win(t, tRp, fin, .4, .4));
        // «y una vuelta de tuerca» entra con sus palabras
        const k2 = ease(ramp(t, tVu, tVu + 0.4));
        L4a.childNodes.forEach((n, j) => { if (j >= 1) n.setAttribute('opacity', k2.toFixed(3)); });
      });
      const TU = N.group(g); color(TU, C.rosa);
      const TUi = icoTuerca(TU, 1.05);
      const xTu = CX - 50 + wL4 / 2 + 70;
      s.on(t => {
        opa(TU, win(t, tVu, fin, .3, .4));
        const ang = 60 * ease(ramp(t, tVu + 0.2, tVu + 1.0));
        TU.setAttribute('transform', `translate(${xTu.toFixed(1)},${yT - 17}) rotate(${ang.toFixed(1)})`);
      });
      void TUi;
    });
  }

  // ================================================================ B · A · P · S · R · los seis corales (el sistema se queda; los corales se transforman)
  function escenaCorales() {
    const a = F0('B1') - 0.25, b = F0('G1') + 0.3;
    escena('corales', a, b, (s, g) => {
      const fin = b - 0.3, L = lay(), RX = 1662, RX0 = 1508;
      // --- momentos
      const tB = F0('B1') + 0.15;
      const tBa = Wd('B1', 'bajo') - 0.25, tUl = Wd('B1', 'ultimos') - 0.3, tB2 = F0('B2') - 0.1;
      const tCam = Wd('B2', 'camino') - 0.3, tDes = Wd('B2', 'desenlace') - 0.3, tB3 = F0('B3') - 0.1, tSol = Wd('B3', 'sol') - 0.3;
      const tA1 = F0('A1') - 0.15;
      const tM = [Wd('A4', 'inversiones') - 0.35, F0('P1') - 0.1, Wd('P3', 'imperfecta') - 0.3, F0('S1') - 0.15, F0('R1') - 0.15];
      const tFoco1 = Wd('A3', 'estado') - 0.35, tFoco3 = Wd('P3', 'estado') - 0.35;
      // --- cabecera: el tipo de cadencia (chip) y su fórmula
      const CH = [
        ['CÓMO RECONOCERLAS', Wd('B1', 'reconocerlas') - 0.3, tA1],
        ['CADENCIA AUTÉNTICA', Wd('A1', 'autentica') - 0.3, tM[1]],
        ['CADENCIA PLAGAL', Wd('P1', 'plagal') - 0.3, tM[3]],
        ['SEMICADENCIA', Wd('S1', 'semicadencia') - 0.3, tM[4]],
        ['CADENCIA ROTA', Wd('R1', 'rota') - 0.3, fin],
      ];
      CH.forEach(([tx, t0, t1]) => { const k = N.group(g); chip(k, tx, CX, 146, { size: 36, anchor: 'middle' }); pop(s, k, t0, t1, CX, 146); });
      const yFo = 250;
      const FO = [
        ['V', 'I', Wd('A1', 'dominante') - 0.25, Wd('A1', 'tonica') - 0.25, tM[1]],
        ['IV', 'I', Wd('P1', 'subdominante') - 0.25, Wd('P1', 'tonica') - 0.25, tM[3]],
        ['…', 'V', Wd('S1', 'detiene') - 0.25, Wd('S1', 'dominante') - 0.25, tM[4]],
      ];
      FO.forEach(([i1, i2, t1, t2, t3]) => {
        const F = formula(g, i1, i2, CX, yFo, { size: 56 });
        mostrarEn(s, F.A, t1, t3, .35, .35); mostrarEn(s, F.F, t2 - 0.1, t3, .35, .35); mostrarEn(s, F.B, t2, t3, .35, .35);
      });
      // la rota: «V → I»… ¡pero va al vi! (la I se tacha y se escribe vi; la fórmula se recentra)
      {
        const tDo = Wd('R2', 'dominante') - 0.25, tTo = Wd('R2', 'tonica') - 0.25, tPe = Wd('R2', 'pero') - 0.1, tSx = Wd('R2', 'sexto') - 0.25;
        const R = N.group(g);
        const F = formula(R, 'V', 'I', CX, yFo, { size: 56, colB: C.suave });
        const V6 = N.group(R); color(V6, C.rosa);
        const gv = grado(V6, 'vi', F.xB + F.wB + 40, yFo, { size: 56, anchor: 'start' });
        const TA = N.group(R); color(TA, C.rosa);
        const tach = trazo(TA, `M${(F.xB - 10).toFixed(1)},${yFo - 8} L${(F.xB + F.wB + 10).toFixed(1)},${yFo - 36}`, { w: 6 });
        mostrarEn(s, F.A, tDo, fin, .35, .35); mostrarEn(s, F.F, tTo - 0.1, fin, .35, .35); mostrarEn(s, F.B, tTo, fin, .35, .35);
        mostrarEn(s, TA, tPe, fin, .1, .35); dibuja(s, [tach], tPe, 0.35);
        mostrarEn(s, V6, tSx, fin, .35, .35);
        s.on(t => opa(F.B, win(t, tTo, fin, .35, .35) * (1 - 0.45 * ramp(t, tSx, tSx + 0.4))));
        desliza(s, R, tSx, tSx + 0.45, -(gv._w + 40) / 2, 0);
      }
      // --- el sistema (persistente) y la etiqueta de la tonalidad
      const SI = N.group(g); color(SI, C.blanco);
      const sis = sistemaCoral(SI, L);
      aparece(s, SI, a + 0.15, fin, { dy: 10 });
      s.on(t => color(sis.ar, mezcla(C.blanco, C.rosa, win(t, tSol, tA1 + 0.3, .3, .5))));
      const KS = N.group(g);
      texto(KS, 'Sol M', L.xa + 13, L.yS - 2 * SP - 50, { anchor: 'middle', size: 26, peso: 800, fill: 'currentColor' });
      s.on(t => { opa(KS, win(t, tSol, fin, .35, .4)); color(KS, mezcla(C.suave, C.rosa, win(t, tSol, tA1 + 0.3, .3, .5))); });
      // --- la caja de la cadencia (persistente desde «los dos últimos acordes»)
      const CJ = cajaCadencia(g, L);
      g.insertBefore(CJ, SI);
      const dimCad = t => 1 - 0.62 * win(t, tCam, tDes, .35, .35);
      const dimCam = t => 1 - 0.62 * win(t, tDes, tB3, .35, .35);
      s.on(t => setO(CJ, win(t, tUl, fin, .4, .4) * dimCad(t)));
      // --- los seis corales
      const ORD = ['SON_AUT', 'SON_AUI', 'SON_PLA', 'SON_PLI', 'SON_SEM', 'SON_ROT'];
      const K = ORD.map(k => dibujaCoral(g, CORALES[k], L));
      for (let i = 1; i < K.length; i++) emparejar(K[i - 1], K[i]);
      const cadRosa = (t0) => (t, e) => e.cad ? win(t, t0, 1e9, .35, .3) : 0;
      const conFoco = (base, f0, f1) => (t, e) => {
        const fo = win(t, f0, f1, .35, .35);
        if (e.cad) { const c_ = base(t, e); return e.v === 'B' ? Math.max(c_, fo) : c_ * (1 - fo); }
        return base(t, e);
      };
      const CFG = [
        { tIn: tB, tOut: tM[0], escribe: true,
          rosa: (t, e) => {
            const b_ = e.v === 'B' && !e.cad ? win(t, tBa, tB2, .3, .35) : 0;
            if (!e.cad) return b_;
            const fo = win(t, tFoco1, 1e9, .35, .35), c_ = Math.max(win(t, tUl, 1e9, .35, .3), e.v === 'B' ? win(t, tBa, tB2, .3, .35) : 0);
            return e.v === 'B' ? Math.max(c_, fo) : c_ * (1 - fo);
          },
          dim: (t, e) => e.cad ? dimCad(t) : dimCam(t) },
        { tIn: tM[0], tOut: tM[1], rosa: conFoco(cadRosa(0), 0, tM[1] - 0.15) },
        { tIn: tM[1], tOut: tM[2], rosa: conFoco(cadRosa(0), tFoco3, 1e9) },
        { tIn: tM[2], tOut: tM[3], rosa: conFoco(cadRosa(0), 0, tM[3] - 0.15) },
        { tIn: tM[3], tOut: tM[4], rosa: cadRosa(0) },
        { tIn: tM[4], tOut: fin, fin, rosa: cadRosa(0) },
      ];
      CFG.forEach((c, i) => {
        c.siguiente = i < CFG.length - 1;
        const blq = ORD[i];
        if (S[blq + '_negras'] && T.bloque[blq]) { c.NG = S[blq + '_negras']; c.blq0 = T.bloque[blq].t0; }
        animaCoral(s, K[i], c);
      });
      oido(s, g, RX, 372, ORD);
      // --- grados de los dos acordes de la cadencia (rosa) · se cambian con los corales
      const GR = ORD.map(k => [5, 6].map(j => { const G_ = N.group(g); color(G_, C.rosa); grado(G_, CORALES[k].grados[j], j === 5 ? L.cx6 : L.cx7, L.yGrado, { size: 40, anchor: 'base' }); return G_; }));
      const tGr = [
        [Wd('A1', 'quinto') - 0.25, Wd('A1', 'primero') - 0.25], null,
        [Wd('P1', 'cuarto') - 0.25, Wd('P1', 'primero') - 0.25], null,
        [Wd('S1', 'dominante') - 0.45, Wd('S1', 'dominante') - 0.25],
        [Wd('R2', 'dominante') - 0.25, Wd('R2', 'sexto') - 0.25],
      ];
      /** Rótulos que cambian con los corales: si en el siguiente dice lo mismo, se queda; si no, se funden. */
      function relevo(items, entrada, qs) {
        items.forEach((par, i) => par.forEach((G_, j) => {
          if (!G_) return;
          const q = qs[j], cIn = CFG[i], tIn = entrada[i] ? entrada[i][j] : cIn.tIn + DLY(q);
          const nx = i < items.length - 1 ? items[i + 1][j] : null;
          const mismo = nx && G_._txt === nx._txt && (!entrada[i + 1] || entrada[i + 1][j] == null);
          const heredado = i > 0 && !entrada[i] && items[i - 1][j] && items[i - 1][j]._txt === G_._txt;
          const tOut = cIn.siguiente ? CFG[i + 1].tIn + DLY(q) : fin;
          s.on(t => {
            let v = heredado ? (t >= tIn ? 1 : 0) : ease(ramp(t, tIn, tIn + 0.35));
            if (cIn.siguiente) v *= mismo ? (t < tOut ? 1 : 0) : 1 - ease(ramp(t, tOut, tOut + 0.35));
            else v *= 1 - ease(ramp(t, fin - 0.4, fin));
            setO(G_, v);
          });
        }));
      }
      ORD.forEach((k, i) => GR[i].forEach((G_, j) => { G_._txt = CORALES[k].grados[5 + j]; }));
      relevo(GR, tGr, [10, 12]);
      // --- perfecta / imperfecta: el BAJO de los dos acordes, con su estado («fundamental» / «invertido»)
      const wMax = L.cx7 - L.cx6 - 18;
      const ETQ = [
        ['fundamental', 'fundamental'], ['invertido', 'fundamental'], ['fundamental', 'fundamental'], ['fundamental', 'invertido'], null, null,
      ].map(par => par ? par.map((tx, j) => { const G_ = etiquetaBajo(g, tx, j ? L.cx7 : L.cx6, L.yEtiq, wMax); G_._txt = tx; return G_; }) : [null, null]);
      const tEt = [
        [Wd('A3', 'fundamental') - 0.3, Wd('A3', 'fundamental') - 0.15], null,
        [Wd('P3', 'fundamental') - 0.3, Wd('P3', 'fundamental') - 0.15], null, null, null,
      ];
      relevo(ETQ, tEt, [10, 12]);
      // A4 · «si uno de los dos… o los dos…»: se señalan los bajos · P3 · «…está en inversión»
      const bajo = (i, q) => K[i].notas.find(e => e.v === 'B' && e.q === q);
      onda(s, g, bajo(0, 10).cx, bajo(0, 10).y, [Wd('A4', 'uno') - 0.05]);
      onda(s, g, bajo(0, 10).cx, bajo(0, 10).y, [Wd('A4', 'dos', 2) - 0.1]);
      onda(s, g, bajo(0, 12).cx, bajo(0, 12).y, [Wd('A4', 'dos', 2) - 0.1]);
      onda(s, g, bajo(3, 12).cx, bajo(3, 12).y, [Wd('P3', 'inversion') - 0.1]);

      // --- B · cómo reconocerlas: el bajo y los dos últimos acordes; el camino y el desenlace
      const EB = fraseG(g, [['el bajo', 'currentColor']], RX0, L.yF + 12, { size: 42, peso: 800 });
      const EB2 = fraseG(g, [['la voz más grave', C.blanco]], RX0, L.yF + 56, { size: 28, peso: 700 });
      aparece(s, EB, tBa, tA1, { dy: 6 }); aparece(s, EB2, Wd('B1', 'grave') - 0.3, tA1, { dy: 6 });
      s.on(t => color(EB._f, mezcla(C.suave, C.rosa, win(t, tBa, tB2, .3, .4))));
      const UL = fraseG(g, [['los dos', 'currentColor']], RX0, L.yS - 8, { size: 36, peso: 800 });
      const UL2 = fraseG(g, [['últimos acordes', 'currentColor']], RX0, L.yS + 36, { size: 36, peso: 800 });
      [UL, UL2].forEach(G_ => { aparece(s, G_, tUl, tA1, { dy: 6 }); s.on(t => color(G_._f, mezcla(C.suave, C.rosa, win(t, tUl, tB2, .3, .4)))); });
      const yEt = L.cajaY0 - 20;
      const xC0 = L.xHead(0) - 6, xC1 = L.xHead(8) + L.wH + 6;
      const CA = N.group(g);
      N.el('path', { d: `M${xC0},${yEt + 10} V${yEt} H${xC1} V${yEt + 10}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 3.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, CA);
      frase(CA, [['el camino', 'currentColor']], (xC0 + xC1) / 2, yEt - 16, { size: 32, peso: 800, anchor: 'middle' });
      s.on(t => { opa(CA, win(t, tCam, tB3 + 0.3, .35, .4)); color(CA, mezcla(C.suave, C.rosa, win(t, tCam, tDes, .3, .35))); });
      const DE = fraseG(g, [['el desenlace', C.rosa]], (L.cajaX0 + L.cajaX1) / 2, yEt - 16, { size: 32, peso: 800, anchor: 'middle' });
      aparece(s, DE, tDes, tB3 + 0.3, { dy: 6 });

      // --- columna derecha: el carácter de cada cadencia
      // (cada columna, en un envoltorio que pasa a segundo plano cuando se habla de perfecta/imperfecta)
      const capa = t0 => { const W = N.group(g); s.on(t => W.setAttribute('opacity', (1 - 0.6 * ease(ramp(t, t0, t0 + 0.4))).toFixed(3))); return W; };
      const COL = (P_, txt, y, o) => fraseG(P_, txt, RX, y, Object.assign({ size: 30, peso: 800, anchor: 'middle' }, o || {}));
      const marca_ = (P_, ch, y, size) => { const G_ = N.group(P_); color(G_, C.rosa); puntoGrande(G_, ch, RX, y, size); return G_; };
      // la definición de cada una, con sus palabras (deja el sitio a lo que viene después)
      [
        [[['de la ', C.blanco], ['dominante', C.rosa]], [['a la ', C.blanco], ['tónica', C.rosa]], Wd('A1', 'dominante') - 0.3, Wd('A1', 'tonica') - 0.3, Wd('A2', 'conclusiva') - 0.3],
        [[['de la ', C.blanco], ['subdominante', C.rosa]], [['a la ', C.blanco], ['tónica', C.rosa]], Wd('P1', 'subdominante') - 0.3, Wd('P1', 'tonica') - 0.3, Wd('P2', 'concluye') - 0.3],
        [[['se detiene en', C.blanco]], [['la ', C.blanco], ['dominante', C.rosa]], Wd('S1', 'detiene') - 0.3, Wd('S1', 'dominante') - 0.3, Wd('S2', 'medias') - 0.3],
      ].forEach(([s1, s2, t1, t2, t3]) => {
        const d1 = COL(g, s1, 470), d2 = COL(g, s2, 514);
        aparece(s, d1, t1, t3, { dy: 6 }); aparece(s, d2, t2, t3, { dy: 6 });
      });
      // auténtica: la más conclusiva, el punto final
      {
        const t1 = Wd('A2', 'conclusiva') - 0.3, t2 = Wd('A2', 'punto') - 0.3, tOut = tM[1], W = capa(Wd('A3', 'perfecta') - 0.3);
        const c1 = COL(W, [['la más conclusiva', C.blanco]], 470), m = marca_(W, '.', 590, 150), c2 = COL(W, [['punto final', C.rosa]], 660, { size: 34 });
        aparece(s, c1, t1, tOut, { dy: 6 }); pop(s, m, t2, tOut, RX, 570, { k0: .4 }); aparece(s, c2, t2 + 0.2, tOut, { dy: 6 });
      }
      // perfecta / imperfecta (auténtica y plagal)
      const tPer = [[Wd('A3', 'perfecta') - 0.3, Wd('A4', 'imperfecta') - 0.3, tM[1]], [Wd('P3', 'perfecta') - 0.3, Wd('P3', 'imperfecta') - 0.3, tM[3]]];
      tPer.forEach(([t1, t2, t3], i) => {
        const P1w = N.group(g), P1_ = N.group(P1w), c1 = chip(P1_, 'PERFECTA', RX, 780, { size: 30, anchor: 'middle', relleno: false });
        const P2_ = N.group(g); chip(P2_, 'IMPERFECTA', RX, 780, { size: 30, anchor: 'middle', relleno: false });
        pop(s, P1_, t1, t2 + 0.1, RX, 780); pop(s, P2_, t2 + 0.1, t3, RX, 780);
        // (auténtica) el coral se invierte antes de decir «imperfecta»: «perfecta» se tacha en ese momento
        if (i === 0 && tM[0] < t2 - 0.5) {
          const TX = N.group(g); color(TX, C.rosa);
          const tr = trazo(TX, `M${(RX - c1._w / 2 - 8).toFixed(1)},${790} L${(RX + c1._w / 2 + 8).toFixed(1)},${770}`, { w: 5 });
          mostrarEn(s, TX, tM[0], t2 + 0.1, .1, .3); dibuja(s, [tr], tM[0], 0.4);
          s.on(t => P1w.setAttribute('opacity', (1 - 0.5 * ease(ramp(t, tM[0], tM[0] + 0.4))).toFixed(3)));
        }
      });
      // plagal: también concluye, más tranquila, más suave
      {
        const t1 = Wd('P2', 'concluye') - 0.3, t2 = Wd('P2', 'tranquila') - 0.3, t3 = Wd('P2', 'suave') - 0.3, tOut = tM[3], W = capa(Wd('P3', 'perfecta') - 0.3);
        const c1 = COL(W, [['también concluye', C.blanco]], 470), m = marca_(W, '.', 580, 110);
        const c2 = COL(W, [['más tranquila', C.rosa]], 650, { size: 32 }), c3 = COL(W, [['más suave', C.rosa]], 694, { size: 32 });
        aparece(s, c1, t1, tOut, { dy: 6 }); pop(s, m, t1 + 0.3, tOut, RX, 565, { k0: .4 }); aparece(s, c2, t2, tOut, { dy: 6 }); aparece(s, c3, t3, tOut, { dy: 6 });
      }
      // semicadencia: se queda a medias, como una coma · no apetece aplaudir todavía · muy fácil de reconocer
      {
        const t1 = Wd('S2', 'medias') - 0.3, t2 = Wd('S2', 'coma') - 0.3, t3 = Wd('S2', 'aplaudir') - 0.3, t4 = Wd('S2', 'facil') - 0.3, tOut = tM[4];
        const c1 = COL(g, [['se queda a medias', C.blanco]], 470), m = marca_(g, ',', 570, 150);
        const c2 = COL(g, [['¡no apetece aplaudir', C.rosa]], 690, { size: 28, italic: true }), c3 = COL(g, [['todavía!', C.rosa]], 730, { size: 28, italic: true });
        const c4 = fraseG(g, [['muy fácil de reconocer', C.blanco]], RX + 20, 816, { size: 26, peso: 700, anchor: 'middle' });
        const TK = N.group(g); color(TK, C.verde); tick(TK, RX + 20 - c4._f._w / 2 - 24, 806, 13, 5);
        aparece(s, c1, t1, tOut, { dy: 6 }); pop(s, m, t2, tOut, RX, 550, { k0: .4 });
        aparece(s, c2, t3, tOut, { dy: 6 }); aparece(s, c3, t3 + 0.25, tOut, { dy: 6 });
        aparece(s, TK, t4, tOut, { dy: 4 }); aparece(s, c4, t4 + 0.1, tOut, { dy: 4 });
      }
      // rota: ¡Mi menor! · una sorpresa, un impacto muy chulo
      {
        const tMi = Wd('R3', 'mi') - 0.3, t1 = Wd('R3', 'sorpresa') - 0.3, t2 = Wd('R3', 'impacto') - 0.3;
        const KM = N.group(g); chip(KM, 'Mi m', (L.cajaX0 + L.cajaX1) / 2, L.cajaY0 - 38, { size: 30, anchor: 'middle', ls: '0.04em' });
        pop(s, KM, tMi, fin, (L.cajaX0 + L.cajaX1) / 2, L.cajaY0 - 38);
        const c1 = COL(g, [['¡sorpresa!', C.rosa]], 470, { size: 34 }), m = marca_(g, '¡!', 610, 130), c2 = COL(g, [['un impacto', C.blanco]], 690), c3 = COL(g, [['muy chulo', C.blanco]], 730);
        aparece(s, c1, t1, fin, { dy: 6 }); pop(s, m, Wd('R2', 'pero') - 0.1, fin, RX, 570, { k0: .4 });   // la sorpresa llega con «pero…»
        aparece(s, c2, t2, fin, { dy: 6 }); aparece(s, c3, t2 + 0.25, fin, { dy: 6 });
      }
    });
  }

  // ================================================================ G · ejemplos muy simplificados… es todo un mundillo: partitura y oído
  function escenaMundo() {
    const a = F0('G1') - 0.1, b = F0('F1') - 0.2;
    escena('mundo', a, b, (s, g) => {
      const fin = b - 0.3;
      const tEj = Wd('G1', 'ejemplos') - 0.3, tMu = Wd('G1', 'mundillo') - 0.35, tTe = Wd('G1', 'teorico') - 0.3, tPa = Wd('G1', 'partitura') - 0.3;
      const tAu = Wd('G1', 'auditivo') - 0.3, tPo = Wd('G1', 'portal') - 0.3, tFo = Wd('G1', 'formas') - 0.35;
      // (las dos frases empiezan centradas en la pantalla y suben cuando llegan las tarjetas)
      const SUBE = N.group(g);
      s.on(t => setT(SUBE, 0, 250 * (1 - ease(ramp(t, tTe - 0.35, tTe + 0.35)))));
      const l1 = fraseG(SUBE, [['aquí: ', C.suave], ['ejemplos muy simplificados', C.blanco]], CX, 220, { size: 42, peso: 800, anchor: 'middle' });
      aparece(s, l1, tEj, fin, { dy: 8 });
      const l2 = fraseG(SUBE, [['las cadencias: ', C.suave], ['todo un mundillo', C.rosa]], CX - 50, 300, { size: 42, peso: 800, anchor: 'middle' });
      aparece(s, l2, tMu, fin, { dy: 8 });
      const PL = N.group(SUBE); color(PL, C.rosa); icoPlaneta(PL, CX - 50 + l2._f._w / 2 + 90, 284, 0.62);
      pop(s, PL, tMu + 0.2, fin, CX - 50 + l2._f._w / 2 + 90, 284, { k0: .4 });
      // reconocerlas de dos formas: viendo la partitura · con el oído
      const TA = [
        { x: CX - 290, t0: tTe, t1: tAu, ico: (G_, x, y) => icoOjo(G_, x, y, 1.0), l1: 'a nivel teórico', l2: 'viendo la partitura', t2: tPa },
        { x: CX + 290, t0: tAu, t1: tPo, ico: (G_, x, y) => icoOido(G_, x, y, 1.25), l1: 'a nivel auditivo' },
      ];
      TA.forEach(c => {
        const G_ = N.group(g), w = 500, h = 330, x = c.x - w / 2, y = 400;
        const P = panel(G_, x, y, w, h, { rx: 24 });
        const I_ = N.group(G_); c.ico(I_, c.x, y + 105);
        const t1 = texto(G_, c.l1, c.x, y + 222, { anchor: 'middle', size: 36, peso: 800, fill: 'currentColor' });
        if (c.l2) { const t2 = texto(G_, c.l2, c.x, y + 272, { anchor: 'middle', size: 28, peso: 700, italic: true, fill: C.suave }); mostrarEn(s, t2, c.t2, fin, .3, .3); }
        pop(s, G_, c.t0, fin, c.x, y + h / 2, { k0: .9 });
        s.on(t => {
          const k = Math.max(win(t, c.t0, c.t1, .3, .3), win(t, tFo, fin + 1, .3, .3));
          color(G_, mezcla(C.blanco, C.rosa, k)); P.setAttribute('stroke', mezcla2('#3a4556', C.rosa, k)); P.setAttribute('stroke-width', (1.5 + 1.5 * k).toFixed(2));
        });
        void t1;
      });
      const kp = N.group(g); chip(kp, 'PRACTICA EN EL PORTAL', CX, 830, { size: 32, anchor: 'middle' });
      pop(s, kp, tPo, fin, CX, 830);
      const df = fraseG(g, [['de las dos formas', C.rosa]], CX, 910, { size: 34, peso: 800, italic: true, anchor: 'middle' });
      aparece(s, df, tFo, fin, { dy: 6 });
    });
  }

  // ================================================================ F · repaso final (y lo más nuevo: perfecta e imperfecta)
  function escenaRepaso() {
    const a = F0('F1') - 0.2, b = F0('Q1') - 0.2;
    escena('repaso', a, b, (s, g) => {
      const fin = b - 0.3;
      const k = N.group(g); chip(k, 'REPASO FINAL', CX, 150, { size: 36, anchor: 'middle' });
      pop(s, k, Wd('F1', 'repasando') - 0.3, fin, CX, 150);
      const P = N.group(g); panel(P, 250, 250, 1420, 640, { rx: 26, stroke: 'rgba(248,250,252,0.3)', sw: 2 });
      aparece(s, P, Wd('F1', 'repasando') - 0.1, fin, { dy: 10 });
      const tNu = Wd('F4', 'nuevo') - 0.35;
      const FIL = [
        { nm: 'Auténtica', fo: ['V', 'I'], pu: '.', t0: Wd('F1', 'autentica') - 0.3, tF: Wd('F1', 'quinto') - 0.3, t1: Wd('F1', 'plagal') - 0.3, tag: Wd('F4', 'autenticas') - 0.3 },
        { nm: 'Plagal', fo: ['IV', 'I'], pu: '.', t0: Wd('F1', 'plagal') - 0.3, tF: Wd('F1', 'cuarto') - 0.3, t1: F0('F2') - 0.2, tag: Wd('F4', 'plagales') - 0.3 },
        { nm: 'Semicadencia', fo: ['…', 'V'], pu: ',', tx: 'se queda en el quinto', t0: Wd('F2', 'semicadencia') - 0.3, tF: Wd('F2', 'quinto') - 0.3, t1: F0('F3') - 0.2 },
        { nm: 'Rota', fo: ['V', 'vi'], pu: '¡!', tx: 'un final sorprendente', t0: Wd('F3', 'rota') - 0.3, tF: Wd('F3', 'sexto') - 0.3, tT: Wd('F3', 'sorprendente') - 0.3, t1: F0('F4') - 0.2 },
      ];
      const xNm = 360, xFo = 890, xPu = 1080, xTx = 1150;
      FIL.forEach((f, i) => {
        const y = 370 + i * 140;
        // F4 · lo más nuevo: la semicadencia y la rota quedan en segundo plano (envoltorio de la fila)
        const R_ = N.group(g);
        if (i >= 2) s.on(t => R_.setAttribute('opacity', (1 - 0.6 * ease(ramp(t, tNu, tNu + 0.4))).toFixed(3)));
        const G = N.group(R_);
        const nm = N.group(G); texto(nm, f.nm, xNm, y + 14, { size: 44, peso: 800, fill: 'currentColor' });
        aparece(s, G, f.t0, fin, { dy: 8 });
        s.on(t => color(nm, mezcla(C.blanco, C.rosa, win(t, f.t0, f.t1, .3, .3))));
        const F = N.group(R_); formula(F, f.fo[0], f.fo[1], xFo, y + 16, { size: 46, fl: 70 });
        const PU = N.group(F); color(PU, C.rosa); puntoGrande(PU, f.pu, xPu, y + 26, f.pu === '¡!' ? 64 : 104);
        aparece(s, F, f.tF, fin, { dy: 8 });
        if (f.tx) { const T_ = fraseG(R_, [[f.tx, C.suave]], xTx, y + 12, { size: 32, peso: 700 }); aparece(s, T_, f.tT || f.tF + 0.2, fin, { dy: 6 }); }
        if (f.tag) {
          const TG = N.group(g);
          const c1 = chip(TG, 'perfecta', xTx, y, { size: 28, relleno: false, ls: '0.04em' });
          chip(TG, 'imperfecta', xTx + c1._w + 18, y, { size: 28, relleno: false, ls: '0.04em' });
          aparece(s, TG, f.tag, fin, { dy: 6 });
        }
      });
      const kn = N.group(g); chip(kn, 'LO MÁS NUEVO', xTx + 170, 296, { size: 24, anchor: 'middle' });
      pop(s, kn, tNu, fin, xTx + 170, 296);
    });
  }

  // ================================================================ Q · cierra los ojos, escucha: ¿qué cadencia es? (suena, piensa… ¡la rota!)
  function escenaQuiz() {
    const a = F0('Q1') - 0.2, b = T.acorde + 0.15;
    escena('quiz', a, b, (s, g) => {
      const fin = b - 0.3, L = lay(), RX = 1662;
      const NG = S.SON_QUIZ_negras || [], BQ = T.bloque.SON_QUIZ;
      const tOj = Wd('Q1', 'ojos') - 0.4, tCad = Wd('Q1', 'cadencia') - 0.3, tAb = Wd('Q2', 'abrir') - 0.3, tRo = Wd('Q2', 'rota') - 0.3, tEj = Wd('Q3', 'ejercicios') - 0.4;
      const tSon0 = NG[0] != null ? NG[0] : BQ.t0 + 0.15, tSon1 = NG[12] != null ? NG[12] + 2.5 : BQ.t0 + 10.3;
      const tC0 = tSon1 + 0.15, tC1 = Math.min(tC0 + 3.0, F0('Q2') - 0.15);
      // cabecera: ojos cerrados · ¿qué cadencia es? → ojos abiertos · ¡la rota!
      const pr = fraseG(g, [['¿Qué cadencia es?', C.blanco]], CX + 70, 165, { size: 54, peso: 800, anchor: 'middle' });
      aparece(s, pr, tCad, tRo, { dy: 8 });
      const xOj = CX + 70 - pr._f._w / 2 - 110;
      const OJ = N.group(g); color(OJ, C.rosa); icoOjoCerrado(OJ, xOj, 131, 0.95);
      pop(s, OJ, tOj, tAb + 0.2, xOj, 146, { k0: .5 });
      const OA = N.group(g); color(OA, C.rosa); icoOjo(OA, xOj, 146, 0.85);
      pop(s, OA, tAb + 0.2, tRo, xOj, 146, { k0: .5 });
      const kr = N.group(g); chip(kr, 'CADENCIA ROTA', CX, 146, { size: 36, anchor: 'middle' });
      pop(s, kr, tRo, fin, CX, 146);
      const fo = formula(g, 'V⁷', 'vi', CX, 250, { size: 56 });
      aparece(s, fo.g, tRo + 0.25, fin, { dy: 8 });
      // el coral: se escribe mientras suena (cada nota, con su ataque) y se queda
      const SI = N.group(g); color(SI, C.blanco);
      sistemaCoral(SI, L);
      aparece(s, SI, a + 0.2, fin, { dy: 10 });
      const CJ = cajaCadencia(g, L); g.insertBefore(CJ, SI);
      mostrarEn(s, CJ, tRo, fin, .4, .4);
      const Kq = dibujaCoral(g, CORALES.SON_QUIZ, L);
      s.on(t => {
        for (const e of Kq.notas) {
          const tA = NG[e.qA] != null ? NG[e.qA] : tSon0 + e.qA * 0.6, tE = e.qE <= 12 ? (NG[e.qE] != null ? NG[e.qE] : tA + 1.2) : tSon1;
          const op = eo(ramp(t, tA - 0.06, tA + 0.12)) * (1 - ease(ramp(t, fin - 0.4, fin)));
          setO(e.W, op); setO(e.LG, op); setT(e.W, 0, (1 - op) * 10);
          const k = Math.max(win(t, tA - 0.04, tE + 0.1, 0.06, 0.28), e.cad ? win(t, tRo, 1e9, .35, .3) : 0);
          e.col = mezcla(C.blanco, C.rosa, k); setC(e.H, e.col);
        }
        for (const L_ of Kq.ligas) { const e = L_.de, tA = NG[e.q] || tSon0; setO(L_.g, eo(ramp(t, tA, tA + 0.3)) * (1 - ease(ramp(t, fin - 0.4, fin)))); setC(L_.g, e.col); }
      });
      // el oído, solo mientras suena
      {
        const O = N.group(g), Oi = N.group(O); icoOido(Oi, 0, 0, 0.9); color(Oi, C.rosa);
        O.setAttribute('transform', `translate(${RX},372)`);
        s.on(t => { const k = win(t, tSon0 - 0.2, tSon1, .25, .35); opa(O, k); Oi.setAttribute('transform', `scale(${(1 + 0.06 * Math.sin(t * 9) * k).toFixed(3)})`); });
      }
      // piensa… 3 · 2 · 1 (anillo que se vacía)
      {
        const CU = N.group(g); color(CU, C.rosa);
        const yC = 600, R = 70;
        N.el('circle', { cx: RX, cy: yC, r: R, fill: 'none', stroke: C.tenue, 'stroke-width': 8 }, CU);
        const ar = N.el('circle', { cx: RX, cy: yC, r: R, fill: 'none', stroke: 'currentColor', 'stroke-width': 8, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1', transform: `rotate(-90 ${RX} ${yC})` }, CU);
        const num = texto(CU, '3', RX, yC + 30, { anchor: 'middle', size: 86, peso: 800, fill: C.blanco });
        const pi = texto(CU, 'piensa…', RX, yC + R + 62, { anchor: 'middle', size: 34, peso: 700, italic: true, fill: C.blanco });
        s.on(t => {
          opa(CU, win(t, tC0 - 0.2, tC1 + 0.35, .3, .35));
          const k = clamp((t - tC0) / (tC1 - tC0));
          ar.setAttribute('stroke-dashoffset', k.toFixed(4));
          num.textContent = String(Math.max(1, 3 - Math.floor(k * 3 - 1e-6)));
        });
        void pi;
      }
      // la solución: los grados bajo los dos últimos acordes; ¡Mi menor!
      [[5, L.cx6], [6, L.cx7]].forEach(([j, x], i) => { const G_ = N.group(g); color(G_, C.rosa); grado(G_, CORALES.SON_QUIZ.grados[j], x, L.yGrado, { size: 40, anchor: 'base' }); mostrarEn(s, G_, tRo + 0.1 + i * 0.25, fin, .35, .4); });
      const KM = N.group(g); chip(KM, 'Mi m', (L.cajaX0 + L.cajaX1) / 2, L.cajaY0 - 38, { size: 30, anchor: 'middle', ls: '0.04em' });
      pop(s, KM, tRo + 0.5, fin, (L.cajaX0 + L.cajaX1) / 2, L.cajaY0 - 38);
      // (columna derecha) la marca de la rota, como en el repaso · y a practicar
      const MK = N.group(g); color(MK, C.rosa); puntoGrande(MK, '¡!', RX, 610, 130);
      pop(s, MK, tRo + 0.35, fin, RX, 570, { k0: .4 });
      const ej = fraseG(g, [['¡a hacer', C.rosa]], RX, 710, { size: 36, peso: 800, anchor: 'middle' });
      const ej2 = fraseG(g, [['ejercicios!', C.rosa]], RX, 756, { size: 36, peso: 800, anchor: 'middle' });
      aparece(s, ej, tEj, fin, { dy: 8 }); aparece(s, ej2, tEj + 0.15, fin, { dy: 8 });
    });
  }

  const ORDEN = [escenaIntro, escenaCorales, escenaMundo, escenaRepaso, escenaQuiz];

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
