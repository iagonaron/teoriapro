/* =====================================================================
   ESCENAS · Modulación (GP)
   Montado por pipe/escenas_build.py: utilidades comunes (_comun/) + escenas
   propias (modulacion/escenas_cuerpo.js). Todo es función pura de t.
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

  // ================================================================ P7 · MODULACIÓN DIATÓNICA (GP · Teoría PRO)
  const TITULO = { kicker: 'GRADO PROFESIONAL  ·  TEORÍA', lineas: ['MODULACIÓN DIATÓNICA'], sub: 'Armaduras · Tonalidad A · Acorde puente · Tonalidad B' };

  // ---------------------------------------------------------------- utilidades de texto (♭ ♯ ♮ de Bravura y → dibujada)
  const ALT_GL = { '♭': 'accidentalFlat', '♯': 'accidentalSharp', '♮': 'accidentalNatural' };
  /** Línea de texto: ♭ ♯ ♮ pegados a la letra (como en los nombres de nota) y → dibujada.
   *  segs = 'texto' o [['trozo', color], …]. Devuelve el grupo (con _w y _x). */
  function frase(parent, segs, x, y, o) {
    o = o || {};
    const size = o.size || 36, peso = o.peso || 700, esp = size * 0.28;
    const G = N.group(parent, 'frase');
    if (typeof segs === 'string') segs = [[segs, o.fill || 'currentColor']];
    let cx = 0, prev = '';
    for (const [str, col] of segs) {
      const sub = () => { const q = N.group(G); if (col && col !== 'currentColor') color(q, col); return q; };
      for (const tr of str.split(/([♭♯♮→])/u)) {
        if (!tr) continue;
        if (ALT_GL[tr]) {
          const gl = ALT_GL[tr], bem = tr === '♭', pegada = /[A-Za-zÁÉÍÓÚáéíóúñÑ0-9]$/.test(prev) || !!ALT_GL[prev];
          const sa = pegada ? size * 0.36 : size * (bem ? 0.31 : 0.29);
          const yo = pegada ? -size * 0.33 : (bem ? -0.7 * sa : -size * 0.36);
          const xg = cx + size * (pegada ? 0.05 : 0.02);
          N.glyph(sub(), gl, xg, yo, sa);
          cx = xg + N.M[gl].adv * sa + size * 0.05;
        } else if (tr === '→') {
          flecha(sub(), cx + size * 0.12, -size * 0.34, cx + size * 1.0, -size * 0.34, { w: size * 0.085, cab: size * 0.34 });
          cx += size * 1.12;
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
  /** Varias frases en UNA línea (centrada en x, o desde x si o.izq); cada una en su grupo para que aparezcan por orden. */
  function linea(parent, partes, x, y, o) {
    o = o || {};
    const gs = partes.map(segs => { const w = N.group(parent); return { w, f: frase(w, segs, 0, y, o) }; });
    const gap = o.gap != null ? o.gap : (o.size || 36) * 0.28;
    const tot = gs.reduce((acc, p) => acc + p.f._w, 0) + gap * (gs.length - 1);
    let cx = o.izq ? x : x - tot / 2;
    for (const p of gs) { p.f.setAttribute('transform', `translate(${cx.toFixed(1)},${y})`); p.f._x = cx; p.w._f = p.f; cx += p.f._w + gap; }
    return gs.map(p => p.w);
  }
  /** Las partes de una línea aparecen en los instantes ts (y se van en tOut). */
  function lineaEn(s, parent, partes, x, y, ts, tOut, o) {
    const L = linea(parent, partes, x, y, o);
    L.forEach((w, i) => aparece(s, w, ts[Math.min(i, ts.length - 1)], tOut, { dy: 6, fi: .35, fo: .35 }));
    return L;
  }
  /** Máximo de win() sobre varios tramos [[a, b], …]. */
  function ventanas(t, vs, fi, fo) { let k = 0; for (const [p, q] of vs) k = Math.max(k, win(t, p, q, fi != null ? fi : .3, fo != null ? fo : .3)); return k; }
  /** Color de un grupo: de `de` a `a` según k(t). */
  function tinte(s, g, fk, de, a) { s.on(t => color(g, mezcla(de || C.blanco, a || C.rosa, clamp(fk(t))))); }
  const enRosa = vs => t => ventanas(t, vs, .12, .35);

  // ---------------------------------------------------------------- «escrito»: cortinilla de izquierda a derecha (por etapas)
  let nClip = 0;
  /** W (grupo SIN transform) se revela de x0 hacia la derecha: etapas = [[t, xFin, dur], …] (G → G7: dos etapas). */
  function escribe(s, W, x0, y0, y1, etapas) {
    const id = 'clipMod' + (nClip++);
    const defs = N.el('defs', null, W.parentNode);
    const cp = N.el('clipPath', { id, clipPathUnits: 'userSpaceOnUse' }, defs);
    const r = N.el('rect', { x: x0, y: y0, width: 0, height: y1 - y0 }, cp);
    W.setAttribute('clip-path', `url(#${id})`);
    s.on(t => {
      let x = x0;
      for (const [ta, x1, d] of etapas) { const k = ease(ramp(t, ta, ta + (d || 0.4))); if (k <= 0) break; x = lerp(x, x1, k); }
      r.setAttribute('width', Math.max(0, x - x0).toFixed(1));
      opa(W, t < etapas[0][0] - 0.01 ? 0 : 1);
    });
  }
  /** Tachón que se dibuja sobre [x0, x1] a la altura y. */
  function tachon(s, parent, x0, x1, y, t0, tOut) {
    const G = N.group(parent, 'tachon'); color(G, C.rosa);
    const p = N.el('path', { d: `M${x0},${y + 4} L${x1},${y - 4}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 5, 'stroke-linecap': 'round' }, G);
    const L = Math.hypot(x1 - x0, 8); p.setAttribute('stroke-dasharray', L.toFixed(1));
    s.on(t => { p.setAttribute('stroke-dashoffset', (L * (1 - ease(ramp(t, t0, t0 + 0.35)))).toFixed(1)); opa(G, t < t0 ? 0 : win(t, t0, tOut == null ? 1e9 : tOut, .01, .3)); });
    return G;
  }

  // ---------------------------------------------------------------- etiquetas de tonalidad que viajan («Tonalidad A» → «Do M» → fila de grados)
  function etiquetaDoble(parent, t1, t2, size) {
    const G = N.group(parent, 'etiqueta'), h = size * 1.9;
    const R = N.el('rect', { x: -60, y: -h / 2, width: 120, height: h, rx: 14, fill: C.panel, stroke: 'currentColor', 'stroke-width': 2.5 }, G);
    const A = fraseG(G, [[t1, 'currentColor']], 0, size * 0.36, { size, peso: 800, anchor: 'middle' });
    const B = fraseG(G, [[t2 || t1, 'currentColor']], 0, size * 0.36, { size, peso: 800, anchor: 'middle' });
    return { g: G, R, A, B, wA: A._f._w + size * 1.3, wB: B._f._w + size * 1.3, h };
  }
  /** kf = [[t, x, y, esc, dur], …] → [x, y, esc] en t (cada tramo empieza en su t). */
  function kfEval(kf, t) {
    let x = kf[0][1], y = kf[0][2], sc = kf[0][3];
    for (let i = 1; i < kf.length; i++) {
      const [ti, xi, yi, si, di] = kf[i], k = ease(ramp(t, ti, ti + (di || 0.6)));
      if (k <= 0) break;
      x = lerp(x, xi, k); y = lerp(y, yi, k); sc = lerp(sc, si, k);
    }
    return [x, y, sc];
  }
  /** o = {tIn, tOut, tSwap, kf, rosa:[[a,b]…], tenue:[[a,b]…], size} */
  function chipViajero(s, parent, t1, t2, o) {
    const W = N.group(parent), E = etiquetaDoble(W, t1, t2, o.size || 30);
    s.on(t => {
      const v = win(t, o.tIn, o.tOut == null ? 1e9 : o.tOut, .35, .4) * (1 - 0.62 * ventanas(t, o.tenue || [], .3, .3));
      opa(W, v); if (v <= 0) return;
      const [x, y, sc] = kfEval(o.kf, t), kp = lerp(0.8, 1, eo(ramp(t, o.tIn, o.tIn + 0.35)));
      W.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${(sc * kp).toFixed(4)})`);
      const k = o.tSwap != null ? ease(ramp(t, o.tSwap, o.tSwap + 0.4)) : (t2 ? 1 : 0);
      opa(E.A, 1 - k); opa(E.B, k);
      const w = lerp(E.wA, E.wB, k); E.R.setAttribute('x', (-w / 2).toFixed(1)); E.R.setAttribute('width', w.toFixed(1));
      color(E.g, mezcla(C.blanco, C.rosa, ventanas(t, o.rosa || [], .25, .35)));
    });
    return W;
  }

  // ---------------------------------------------------------------- los cuatro pasos del método (arriba)
  const PASOS = [['0', 'ARMADURAS'], ['1', 'ASENTAR A'], ['2', 'PUENTE'], ['3', 'ASENTAR B']];
  /** act = [[paso, t0, t1], …]: activo (rosa) entre t0 y t1; los ya hechos quedan en blanco, los que faltan en gris. */
  function filaPasos(s, g, y, tIn, act) {
    const w = 300, h = 60, gap = 24, x0 = CX - (4 * w + 3 * gap) / 2;
    const G = N.group(g); aparece(s, G, tIn, null, { dy: 10 });
    PASOS.forEach(([n, tit], i) => {
      const x = x0 + i * (w + gap), P = N.group(G);
      const r = panel(P, x, y, w, h, { rx: 14 });
      const nu = N.group(P); N.el('circle', { cx: x + 36, cy: y + h / 2, r: 19, fill: 'none', stroke: 'currentColor', 'stroke-width': 3 }, nu);
      texto(nu, n, x + 36, y + h / 2 + 8, { anchor: 'middle', size: 22, peso: 800, fill: 'currentColor' });
      const tt = N.group(P); texto(tt, tit, x + 68, y + h / 2 + 8, { size: 22, peso: 800, ls: '0.08em', fill: 'currentColor' });
      s.on(t => {
        let k = 0, hecho = false;
        for (const [j, a, b] of act) { if (j === i) k = Math.max(k, win(t, a, b, .3, .3)); if (j > i && t >= a) hecho = true; }
        const base = hecho ? C.blanco : C.suave;
        color(nu, mezcla(base, C.rosa, k)); color(tt, mezcla(base, C.blanco, k));
        r.setAttribute('stroke', mezcla('#3a4556', C.rosa, k)); r.setAttribute('stroke-width', (1.5 + 1.5 * k).toFixed(2));
      });
    });
    return G;
  }

  // ---------------------------------------------------------------- casillas, cifrado, grados y acordes a cuatro voces
  const WN = N.M.noteheadWhole.adv * SP;                   // ancho de la cabeza de redonda
  const GEO = { yG: 186, hG: 108, bw: 146, sx: 280, sw: 1320, yS: 452, yRA: 828, yRB: 888, yCap: 962, xLab: 330 };
  GEO.yF = GEO.yS + 9 * SP;
  const COLS7 = [450, 620, 790, 960, 1130, 1300, 1470];
  const OIDO = [1712, (GEO.yS + GEO.yF) / 2];
  /** Casilla (como en el portal): recuadro con su número arriba a la izquierda; centrada en x = 0 (local). */
  function casilla(parent, num, y, w, h) {
    const G = N.group(parent, 'casilla');
    const M_ = N.group(G); color(M_, '#3a4556');
    const rect = N.el('rect', { x: -w / 2, y, width: w, height: h, rx: 14, fill: C.panel, stroke: 'currentColor', 'stroke-width': 2 }, M_);
    const nu = N.group(G); color(nu, C.suave);
    if (num !== '') texto(nu, String(num), -w / 2 + 13, y + 25, { size: 19, peso: 800, fill: 'currentColor' });
    return { g: G, marco: M_, rect, num: nu, w, h, y };
  }
  function marcoEn(s, cas, fk) { s.on(t => { const k = clamp(fk(t)); color(cas.marco, mezcla('#3a4556', C.rosa, k)); cas.rect.setAttribute('stroke-width', (2 + 1.5 * k).toFixed(2)); }); }
  /** Cifrado como en el portal: letra, «−» (menor) y «7» (más pequeño, como en los apuntes). Centrado en x (forma final).
   *  o.alt7: el «−» y el «7» comparten sitio (B− → B7). Devuelve {g, letra, menos, siete, x0, w, wSin7}. */
  function cifraG(parent, cif, x, y, size, o) {
    o = o || {};
    const G = N.group(parent, 'cifra');
    const L = N.group(G), tl = texto(L, cif[0], 0, 0, { size, peso: 800, fill: 'currentColor' }), wl = D.medir(tl);
    const conM = cif.includes('−') || !!o.alt7, con7 = cif.includes('7') || !!o.alt7;
    let M_ = null, S7 = null, wm = 0, w7 = 0;
    if (conM) { M_ = N.group(G); const tm = texto(M_, '−', wl + size * 0.04, 0, { size, peso: 700, fill: 'currentColor' }); wm = size * 0.04 + D.medir(tm); }
    if (con7) { S7 = N.group(G); const x7 = wl + (conM && !o.alt7 ? wm : 0) + size * 0.05; const t7 = texto(S7, '7', x7, 0, { size: size * 0.7, peso: 800, fill: 'currentColor' }); w7 = x7 - wl + D.medir(t7); }
    const w = wl + (o.alt7 ? Math.max(wm, w7) : (conM ? wm : 0) + (con7 ? w7 : 0));
    const x0 = x - w / 2;
    G.setAttribute('transform', `translate(${x0.toFixed(1)},${y})`);
    return { g: G, letra: L, menos: M_, siete: S7, x0, w, wSin7: wl + (conM && !o.alt7 ? wm : 0) };
  }
  /** Grado en romanos («V7»: el 7 en su grupo, para escribirlo después). Centrado en x. */
  function gradoG(parent, txt, x, y, size) {
    const G = N.group(parent, 'grado'), t7 = /7$/.test(txt), base = t7 ? txt.slice(0, -1) : txt;
    const B = N.group(G), tb = texto(B, base, 0, 0, { size, peso: 800, fill: 'currentColor' }), wb = D.medir(tb);
    let S7 = null, w = wb;
    if (t7) { S7 = N.group(G); const tt = texto(S7, '7', wb + size * 0.03, 0, { size, peso: 800, fill: 'currentColor' }); w = wb + size * 0.03 + D.medir(tt); }
    const x0 = x - w / 2; G.setAttribute('transform', `translate(${x0.toFixed(1)},${y})`);
    return { g: G, base: B, siete: S7, x0, w, wb };
  }
  /** Acorde a cuatro voces, notas = [bajo, tenor, contralto, soprano] (como en EJEMPLOS del proyecto):
   *  S y A en clave de Sol (sis.yS); T y B en clave de Fa (sis.yF). Centrado en x = 0 (local). arm = {F:'#'…}: lo que
   *  pone la armadura (solo se escriben las alteraciones que no pone ella). Cada voz: o (mover) › g (pop/color). */
  function acordeSATB(parent, notas, sis, arm) {
    const G = N.group(parent, 'acordeSATB'), x = -WN / 2;
    const v = notas.map((n, i) => {
      const O = N.group(G, 'voz'), W = N.group(O), fa = i < 2, yM = fa ? sis.yF : sis.yS;
      const r = N.redonda(W, n, x, yM, SP, { clave: fa ? 'fa' : undefined, alteracion: false });
      const m = /^([A-G])([#b]?)(\d)$/.exec(n), de = (arm && arm[m[1]]) || '';
      let alt = null;
      if (m[2] !== de) {
        const gl = m[2] === '#' ? 'accidentalSharp' : (m[2] === 'b' ? 'accidentalFlat' : 'accidentalNatural');
        alt = N.group(W, 'alt'); N.glyph(alt, gl, x - (N.M[gl].adv + 0.22) * SP, r.y, SP);
      }
      const led = [...r.g.children].filter(e => e.tagName === 'line');
      return { n, o: O, g: W, y: r.y, alt, led, fa };
    });
    return { g: G, v };
  }
  /** Armadura en los dos pentagramas de un sistema (cada alteración, en su grupo). */
  function armaduraSis(parent, sis, x, n, tipo) {
    const G = N.group(parent, 'armadura'), bem = tipo === 'b';
    const POS = bem ? N.POS_BEM : N.POS_SOS, gl = bem ? 'accidentalFlat' : 'accidentalSharp';
    const items = []; let cx = x;
    for (let i = 0; i < n; i++) {
      const gi = N.group(G, 'alt');
      N.glyph(gi, gl, cx, sis.yS - POS[i] * SP, SP);
      N.glyph(gi, gl, cx, sis.yF - (POS[i] - 1) * SP, SP);
      items.push({ g: gi, x: cx, pos: POS[i] });
      cx += (N.M[gl].adv + 0.14) * SP;
    }
    return { g: G, w: cx - x, items };
  }
  /** Destello del acorde j del bloque blq mientras suena. */
  function flash(blq, j) {
    const ts = S[blq] || [], t0 = ts[j];
    if (t0 == null) return () => 0;
    const d = j === ts.length - 1 ? 2.0 : Math.max(0.5, ts[j + 1] - t0 - 0.08);
    return t => win(t, t0 - 0.03, t0 + d, .05, .3);
  }
  const maxK = fs => t => { let k = 0; for (const f of fs) k = Math.max(k, f(t)); return k; };
  /** Anima un acorde: aparición (tAp, o tNota por voz), rosa al aparecer y en o.rosa, destellos (o.luz = [fn…]) y rosa por voz (o.voz[i]). */
  function animaAcorde(s, acd, o) {
    acd.v.forEach((n, i) => {
      const tAp = o.tNota ? o.tNota[i] : o.tAp;
      if (tAp != null) pop(s, n.g, tAp, null, 0, n.y, { k0: .4 });
      const vs = (o.rosa || []).concat((o.voz && o.voz[i]) || []).concat(tAp != null && o.fresco !== false ? [[tAp, tAp + (o.fresco || 0.9)]] : []);
      const luz = o.luz || [];
      s.on(t => { let k = ventanas(t, vs, .08, .35); for (const f of luz) k = Math.max(k, f(t)); color(n.g, mezcla(C.blanco, C.rosa, k)); });
    });
  }
  /** Columna del tablero: la casilla (en la capa de casillas) y el acorde con sus grados (en la capa de columnas). */
  function columna(capCas, capCol, j, ac, sis, o) {
    o = o || {};
    const cx = o.x != null ? o.x : COLS7[j];
    const CB = N.group(capCas); CB.setAttribute('transform', `translate(${cx},0)`);
    const cas = casilla(CB, o.num != null ? o.num : j + 1, GEO.yG, o.bw || GEO.bw, GEO.hG);
    const SYw = N.group(CB), sym = cifraG(SYw, ac.cif, 0, GEO.yG + 72, 52, { alt7: o.alt7 });
    const CA = N.group(capCol); CA.setAttribute('transform', `translate(${cx},0)`);
    const acd = acordeSATB(CA, ac.notas, sis, o.arm);
    const GAw = N.group(CA), gA = ac.gA ? gradoG(GAw, ac.gA, 0, GEO.yRA, 36) : null;
    const GBw = N.group(CA), gB = ac.gB ? gradoG(GBw, ac.gB, 0, GEO.yRB, 36) : null;
    return { CB, CA, cas, SYw, sym, acd, GAw, gA, GBw, gB, cx };
  }
  /** El cifrado de la casilla se escribe (t0; con t7 el 7 va después) y se pone rosa en `rosa` y con los destellos `luz`. */
  function animaCifra(s, c, t0, t7, rosa, luz) {
    const m = c.sym, y0 = GEO.yG + 8, y1 = GEO.yG + GEO.hG - 4;
    if (t0 != null) escribe(s, c.SYw, m.x0 - 6, y0, y1, t7 != null ? [[t0, m.x0 + m.wSin7 + 3, 0.35], [t7, m.x0 + m.w + 6, 0.3]] : [[t0, m.x0 + m.w + 6, 0.4]]);
    s.on(t => { let k = ventanas(t, rosa || [], .1, .35); for (const f of luz || []) k = Math.max(k, f(t)); color(m.g, mezcla(C.blanco, C.rosa, k)); });
  }
  /** Grado que se escribe (t0; el 7 en t7), rosa en `rosa`, semitransparente en `tenue`. */
  function animaGrado(s, W, gr, y, t0, t7, rosa, tenue) {
    if (!gr) return;
    if (t0 != null) escribe(s, W, gr.x0 - 6, y - 36, y + 12, t7 != null ? [[t0, gr.x0 + gr.wb + 2, 0.3], [t7, gr.x0 + gr.w + 6, 0.3]] : [[t0, gr.x0 + gr.w + 6, 0.35]]);
    s.on(t => { color(gr.g, mezcla(C.blanco, C.rosa, ventanas(t, rosa || [], .1, .35))); opa(gr.g, 1 - 0.62 * ventanas(t, tenue || [], .3, .3)); });
  }
  /** Banda rosa translúcida que abarca una columna entera (el acorde puente: casilla, acorde y sus dos grados). */
  function banda(parent, w, y0, y1) {
    const G = N.group(parent, 'banda'); color(G, C.rosa);
    const R = N.el('rect', { x: -w / 2, y: y0, width: w, height: y1 - y0, rx: 20, fill: 'currentColor', 'fill-opacity': 0.08, stroke: 'currentColor', 'stroke-width': 2, 'stroke-opacity': 0.75 }, G);
    G._r = R;
    return G;
  }
  /** Etiqueta «puente» junto al número de la casilla (como en el portal). */
  function etiquetaPuente(s, c, t0) {
    const W = N.group(c.CB), x = -c.cas.w / 2 + 34;
    const G = N.group(W); color(G, C.rosa); texto(G, 'puente', x, GEO.yG + 25, { size: 18, peso: 800, fill: 'currentColor' });
    escribe(s, W, x - 4, GEO.yG + 6, GEO.yG + 32, [[t0, x + 70, 0.35]]);
    return W;
  }
  /** Dos pentagramas con la armadura de cada tonalidad (paso cero). Devuelve {L, R} con sus piezas. */
  function pentasArmadura(parent, yM, nB, tipoB) {
    const mk = (x, n) => {
      const G = N.group(parent);
      const P = pentaClave(G, x, yM, 520);
      const A = N.armaduraGen(G, P.x0 + 4, yM, SP, n, tipoB);
      return { G, P, A, x };
    };
    return { L: mk(300, 0), R: mk(1100, nB) };
  }

  // ---------------------------------------------------------------- los ejemplos (las mismas notas que suenan: pipe/p_modulacion.py → EJEMPLOS)
  const C_ = ['C3', 'G3', 'E4', 'C5'], F_ = ['F2', 'A3', 'F4', 'C5'], G7_ = ['G2', 'G3', 'F4', 'B4'];
  const CAD = [{ cif: 'C', gA: 'I', notas: C_ }, { cif: 'F', gA: 'IV', notas: F_ }, { cif: 'G7', gA: 'V7', notas: G7_ }, { cif: 'C', gA: 'I', notas: C_ }];
  const EJ1 = CAD.concat([   // el ejemplo del libro (= «Ejemplo resuelto» del portal): C – F – G7 – C – E− – D7 – G
    { cif: 'E−', gA: 'III', gB: 'VI', notas: ['E3', 'G3', 'E4', 'B4'] },
    { cif: 'D7', gB: 'V7', notas: ['D3', 'A3', 'F#4', 'C5'] },
    { cif: 'G', gB: 'I', notas: ['G2', 'G3', 'G4', 'B4'] }]);
  const EJ2 = CAD.concat([   // segundo ejemplo: C – F – G7 – C – A− – B7 – E−
    { cif: 'A−', gA: 'VI', gB: 'IV', notas: ['A2', 'A3', 'E4', 'C5'] },
    { cif: 'B7', gB: 'V7', notas: ['B2', 'F#3', 'D#4', 'A4'] },
    { cif: 'E−', gB: 'I', notas: ['E2', 'E3', 'E4', 'G4'] }]);

  // ================================================================ A–F · modular, el enunciado y el ejemplo del libro (Do M → Sol M), paso a paso
  function escenaEjemplo() {
    const a = F0('A1') - 0.1, b = F0('G1') - 0.2;
    escena('ejemplo', a, b, (s, g) => {
      s.on(t => opa(g, win(t, a, b, .3, .4)));
      const CFo = N.group(g), CSi = N.group(g), CCo = N.group(g), CCa = N.group(g), CTx = N.group(g);
      // ---------- tiempos (palabras de la narración)
      const tVid = Wd('A1', 'video') - 0.2, tMod = Wd('A1', 'modular') - 0.1, tVia = Wd('A1', 'viajar') - 0.1, tOtr = Wd('A1', 'otra') - 0.15;
      const tMet = Wd('A2', 'metodo') - 0.2, tSie = Wd('A2', 'siete') - 0.1, tBlo = Wd('A2', 'bloque') - 0.1;
      const tDia = Wd('A3', 'modulacion') - 0.15;
      const tPor = Wd('B1', 'portal') - 0.2, tPri = Wd('B1', 'primera') - 0.15, tUlt = Wd('B1', 'ultima') - 0.15;
      const tTA = Wd('B1', 'tonalidad', 1) - 0.3, tTB = Wd('B1', 'tonalidad', 2) - 0.3;
      const tLib = Wd('B2', 'ejemplo') - 0.2, tC = Wd('B2', 'c') - 0.1, tG = Wd('B2', 'g') - 0.1;
      const tDo = Wd('B3', 'do') - 0.1, tSol = Wd('B3', 'sol') - 0.1;
      const tUp = Wd('C1', 'paso') - 0.2, tCero = Wd('C1', 'cero') - 0.2, tArm = Wd('C1', 'armaduras') - 0.2;
      const tC2 = Wd('C2', 'do') - 0.15, tSin = Wd('C2', 'sin') - 0.1, tC3 = Wd('C3', 'sol') - 0.15, tSos = Wd('C3', 'un') - 0.1;
      const tNota = Wd('C4', 'nota') - 0.2, tFa = Wd('C4', 'fa') - 0.1, tNat = Wd('C5', 'natural') - 0.1, tSos2 = Wd('C6', 'sostenido') - 0.1;
      const tD1 = Wd('D1', 'paso') - 0.1, tTonA = Wd('D2', 'tonalidad') - 0.1, tCad = Wd('D2', 'cadencia') - 0.2;
      const tI1 = Wd('D2', 'primero') - 0.1, tIV = Wd('D2', 'cuarto') - 0.1, tV = Wd('D2', 'quinto') - 0.1, t7 = Wd('D2', 'septima') - 0.1, tI2 = Wd('D2', 'primero', 2) - 0.1;
      const tE1 = Wd('E1', 'paso') - 0.2, tCin = Wd('E2', 'cinco') - 0.2, tPue = Wd('E2', 'puerta') - 0.2, tCom = Wd('E2', 'acorde') - 0.2;
      const tEvi = Wd('E2', 'evitar') - 0.2, tLle = Wd('E2', 'llevan') - 0.1, tE3 = F0('E3') - 0.1;
      const tE3a = Wd('E3', 'dos') - 0.2, tE3b = Wd('E3', 'hay') - 0.1, tE4 = Wd('E4', 'libro') - 0.2, tMi = Wd('E4', 'mi') - 0.1;
      const tE5do = Wd('E5', 'do') - 0.1, tIII = Wd('E5', 'tercer') - 0.1, tE5sol = Wd('E5', 'sol') - 0.1, tVI = Wd('E5', 'sexto') - 0.1;
      const tF1 = Wd('F1', 'paso') - 0.2, tTonB = Wd('F1', 'tonalidad') - 0.1;
      const tSie7 = Wd('F2', 'siete') - 0.2, tTon7 = Wd('F2', 'tonica') - 0.1, tSolF = Wd('F2', 'sol') - 0.1, tAsi = Wd('F3', 'asi') - 0.1;
      const tSeis = Wd('F3', 'seis') - 0.2, tDom = Wd('F3', 'dominante') - 0.1, t7F = Wd('F3', 'septima') - 0.1, tRe7 = Wd('F3', 're') - 0.1;
      const tM1 = F0('SON_MOD1'), tM1f = F1('SON_MOD1');

      // ---------- A1 · «En el vídeo de modulación…»: modular = viajar de una tonalidad a otra
      const kv = tarjetaEnlace(CTx, CX, 430, { tipo: 'video', titulo: 'Modulación', enlace: false, centro: true });
      pop(s, kv, tVid, tMet + 0.3, CX, 430);
      const P0 = [610, 640], Pc = [CX, 470], P2 = [1310, 640];
      const ARC = N.group(CTx); color(ARC, C.suave);
      const arcP = trazo(ARC, `M${P0[0]},${P0[1]} Q${Pc[0]},${Pc[1]} ${P2[0]},${P2[1]}`, { w: 4 });
      const DOT = N.group(CTx); color(DOT, C.rosa); N.el('circle', { cx: 0, cy: 0, r: 12, fill: 'currentColor' }, DOT);
      s.on(t => {
        const k = ease(ramp(t, tVia + 0.1, tOtr + 0.1)), v = win(t, tVia, tMet + 0.3, .25, .4);
        trazoK(arcP, k); opa(ARC, v); opa(DOT, v);
        const u = 1 - k, x = u * u * P0[0] + 2 * u * k * Pc[0] + k * k * P2[0], y = u * u * P0[1] + 2 * u * k * Pc[1] + k * k * P2[1];
        DOT.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
      });
      lineaEn(s, CTx, [[['modular', C.rosa]], [['=', C.suave]], [['viajar de una tonalidad a otra', C.blanco]]], CX, 860, [tMod, tVia, tVia + 0.1], tMet - 0.05, { size: 40, peso: 800 });
      // ---------- A2 · nuestro método: siete casillas, bloque a bloque
      lineaEn(s, CTx, [[['nuestro método:', C.blanco]], [['7 casillas,', C.rosa]], [['bloque a bloque', C.blanco]]], CX, 860, [tMet, tSie, tBlo], tDia - 0.05, { size: 40, peso: 800 });
      // ---------- A3 · la modulación diatónica
      const kd = N.group(CTx); chip(kd, 'MODULACIÓN DIATÓNICA', CX, 850, { size: 34, anchor: 'middle' });
      pop(s, kd, tDia, tPor + 0.4, CX, 850);

      // ---------- las casillas (suben a su sitio en el paso cero)
      const yG0 = 420, dyG = yG0 - GEO.yG;
      s.on(t => CCa.setAttribute('transform', `translate(0,${(dyG * (1 - ease(ramp(t, tUp, tUp + 0.8)))).toFixed(1)})`));
      const SI = N.group(CSi), sis = sistema(SI, GEO.sx, GEO.yS, GEO.sw, { sep: 9 * SP });
      aparece(s, SI, tD1 + 0.95, null, { dy: 10 });
      const cols = EJ1.map((ac, j) => columna(CCa, CCo, j, ac, sis));
      cols.forEach((c, j) => pop(s, c.cas.g, tSie + j * 0.18, null, 0, GEO.yG + GEO.hG / 2, { k0: .6 }));
      const LZ = S.SON_CAD ? [0, 1, 2, 3].map(j => flash('SON_CAD', j)) : [];
      const LZ1 = EJ1.map((_, j) => flash('SON_MOD1', j));
      const luzDe = j => (j < 4 ? [LZ[j], LZ1[j]] : [LZ1[j]]).filter(Boolean);
      // marcos
      const MAR = [
        [[tPri, tSol + 1.3], [tI1, tI1 + 0.6]], [[tIV, tIV + 0.9]], [[tV, t7 + 0.9]], [[tI2, tI2 + 1.0]],
        [[tCin, tF1]], [[tSeis, tM1]], [[tUlt, tSol + 1.3], [tSie7, tSeis]]];
      cols.forEach((c, j) => marcoEn(s, c.cas, maxK([enRosa(MAR[j])].concat(luzDe(j)))));
      // cifrados (se escriben)
      const SYt = [[tC, null, [[tC, tC + 2.0], [tI1, tI1 + 0.7]]], [tIV, null, [[tIV, tIV + 0.9]]], [tV, t7, [[tV, t7 + 1.0]]], [tI2, null, [[tI2, tI2 + 1.0]]],
        [tMi, null, [[tMi, tMi + 1.6]]], [tRe7, null, [[tRe7, tRe7 + 1.4]]], [tG, null, [[tG, tG + 2.0], [tSolF, tSolF + 1.2]]]];
      cols.forEach((c, j) => animaCifra(s, c, SYt[j][0], SYt[j][1], SYt[j][2], luzDe(j)));
      // acordes (en el sistema) · el Fa se enciende al hablar de la nota conflictiva · el Fa♯ del D7, en rosa
      const faE2 = [[tLle, tE3]];
      animaAcorde(s, cols[0].acd, { tAp: tI1, luz: luzDe(0) });
      animaAcorde(s, cols[1].acd, { tAp: tIV, luz: luzDe(1), voz: [faE2, [], faE2, []] });
      animaAcorde(s, cols[2].acd, { tNota: [tV, tV, t7, tV], luz: luzDe(2), voz: [[], [], faE2, []] });
      animaAcorde(s, cols[3].acd, { tAp: tI2, luz: luzDe(3) });
      animaAcorde(s, cols[4].acd, { tAp: tMi, luz: luzDe(4) });
      animaAcorde(s, cols[5].acd, { tAp: tRe7, luz: luzDe(5), voz: [[], [], [[tRe7, tM1f]], []] });
      animaAcorde(s, cols[6].acd, { tAp: tSolF, luz: luzDe(6) });
      // grados: fila A (Do M) y fila B (Sol M)
      const tenA = [[tE5sol, tE5sol + 1.9]], tenB = [[tE5do, tE5sol - 0.1]];
      const GA = [[tI1, null, [[tI1, tI1 + 0.8]]], [tIV, null, [[tIV, tIV + 0.9]]], [tV, t7, [[tV, t7 + 0.9]]], [tI2, null, [[tI2, tI2 + 1.0]]], [tIII, null, [[tIII, tIII + 1.1]]]];
      GA.forEach(([t0, tt7, r], j) => animaGrado(s, cols[j].GAw, cols[j].gA, GEO.yRA, t0, tt7, r, tenA));
      animaGrado(s, cols[4].GBw, cols[4].gB, GEO.yRB, tVI, null, [[tVI, tVI + 1.2]], tenB);
      animaGrado(s, cols[5].GBw, cols[5].gB, GEO.yRB, tDom, t7F, [[tDom, t7F + 1.0]], tenB);
      animaGrado(s, cols[6].GBw, cols[6].gB, GEO.yRB, tTon7, null, [[tTon7, tTon7 + 1.4]], tenB);
      // el puente: casilla 5, «puente» y la banda que abarca la columna entera
      etiquetaPuente(s, cols[4], tPue);
      const BA = N.group(CFo); BA.setAttribute('transform', `translate(${COLS7[4]},0)`);
      const ba = banda(BA, 166, GEO.yG - 12, GEO.yRB + 24); mostrarEn(s, ba, tPue, null, .4);

      // ---------- B · el enunciado del portal: te dan la primera y la última (la tónica de A y la de B)
      const kp = N.group(CTx); chip(kp, 'EN EL PORTAL', CX, 250, { size: 32, anchor: 'middle' });
      pop(s, kp, tPor, tLib + 0.2, CX, 250);
      const kl = N.group(CTx); chip(kl, 'EJEMPLO DEL LIBRO', CX, 250, { size: 32, anchor: 'middle' });
      pop(s, kl, tLib, tUp + 0.2, CX, 250);
      lineaEn(s, CTx, [[['te dan', C.blanco]], [['la primera', C.rosa]], [['y', C.blanco]], [['la última', C.rosa]]], CX, 860, [tPri - 0.25, tPri, tUlt - 0.1, tUlt], tDo - 0.1, { size: 40, peso: 800 });
      lineaEn(s, CTx, [[['de', C.suave]], [['Do M', C.blanco]], [['a', C.suave]], [['Sol M', C.blanco]]], CX, 860, [tDo, tDo, tSol - 0.05, tSol], tUp + 0.1, { size: 40, peso: 800 });
      // las dos tonalidades: de «regiones» del viaje a etiquetas bajo la 1.ª y la última casilla, a títulos de sus
      // pentagramas (paso cero) y, por fin, a rótulos de las filas de grados
      const yU = GEO.yG + GEO.hG + 82;         // bajo las casillas (ya arriba)
      chipViajero(s, CTx, 'Tonalidad A', 'Do M', {
        tIn: tVia - 0.2, tSwap: tDo,
        kf: [[0, 450, 660, 1.35], [tTA, 450, yU + dyG, 1, 0.7], [tUp, 450, yU, 1, 0.8], [tC2, 560, 540, 1, 0.6], [tD1 + 0.1, GEO.xLab, GEO.yRA - 12, 0.8, 0.8]],
        rosa: [[tTA, tTA + 1.3], [tDo, tDo + 1.0], [tC2, F1('C2') + 0.2], [F0('C5') - 0.05, F1('C5') + 0.1], [tTonA, tCad + 0.9], [tE5do, tE5sol - 0.1]],
        tenue: [[tC3 - 0.1, F1('C3') + 0.3], [F0('C6') - 0.1, F1('C6') + 0.2], [tE5sol, tE5sol + 1.9]],
      });
      chipViajero(s, CTx, 'Tonalidad B', 'Sol M', {
        tIn: tOtr, tSwap: tSol,
        kf: [[0, 1470, 660, 1.35], [tTB, 1470, yU + dyG, 1, 0.7], [tUp, 1470, yU, 1, 0.8], [tC3, 1360, 540, 1, 0.6], [tD1 + 0.3, GEO.xLab, GEO.yRB - 12, 0.8, 0.8]],
        rosa: [[tTB, tTB + 1.3], [tSol, tSol + 1.0], [tC3, F1('C3') + 0.2], [F0('C6') - 0.05, F1('C6') + 0.1], [tE5sol, F1('E5') + 0.3], [tTonB, tTonB + 1.2]],
        tenue: [[tC2 - 0.1, F1('C2') + 0.3], [F0('C5') - 0.1, F1('C5') + 0.2], [tD1 + 0.9, Wd('E2', 'comun') - 0.2], [tE5do, tE5sol - 0.1]],
      });

      // ---------- C · paso cero: las armaduras (Do M: sin alteraciones · Sol M: un sostenido) y la nota conflictiva, Fa
      filaPasos(s, CTx, 96, tUp + 0.25, [[0, tCero, tD1], [1, tD1, tE1], [2, tE1, tF1], [3, tF1, b + 1]]);
      const yM0 = 650, yLab = yM0 + 2 * SP + 64;
      const PA = pentasArmadura(CFo, yM0, 1, '#');
      const tenL = [[tC3 - 0.1, F1('C3') + 0.3], [F0('C6') - 0.1, F1('C6') + 0.2]], tenR = [[tC2 - 0.1, F1('C2') + 0.3], [F0('C5') - 0.1, F1('C5') + 0.2]];
      [[PA.L, tenL], [PA.R, tenR]].forEach(([P, ten]) => s.on(t => {
        const v = win(t, tArm, tD1 + 0.45, .45, .45) * (1 - 0.62 * ventanas(t, ten, .3, .3));
        opa(P.G, v); if (v > 0) P.G.setAttribute('transform', `translate(0,${((1 - eo(ramp(t, tArm, tArm + 0.45))) * 12).toFixed(1)})`);
      }));
      const sos = PA.R.A.items[0];
      color(sos.g, C.blanco);
      pop(s, sos.g, tSos, null, sos.x + N.M.accidentalSharp.adv * SP / 2, yM0 - sos.pos * SP, { k0: .3 });
      tinte(s, sos.g, enRosa([[tSos, tSos + 1.5], [tSos2, tSos2 + 1.7]]));
      const lSin = fraseG(PA.L.G, [['sin alteraciones', 'currentColor']], PA.L.P.x0 + 30, yLab, { size: 28, peso: 700, anchor: 'middle' });
      aparece(s, lSin, tSin, null, { dy: 6 }); tinte(s, lSin, enRosa([[tSin, tSin + 1.3]]), C.suave);
      const lSos = fraseG(PA.R.G, [['un sostenido', 'currentColor']], PA.R.P.x0 + 30, yLab, { size: 28, peso: 700, anchor: 'middle' });
      aparece(s, lSos, tSos + 0.05, null, { dy: 6 }); tinte(s, lSos, enRosa([[tSos, tSos + 1.4]]), C.suave);
      // la nota conflictiva: Fa (natural en Do M, sostenido en Sol M por la armadura); suena al nombrarla
      lineaEn(s, CTx, [[['nota conflictiva:', C.blanco]], [['Fa', C.rosa]]], CX, 890, [tNota, tFa], tD1, { size: 40, peso: 800 });
      [[PA.L, tNat, 'Fa♮', 0], [PA.R, tSos2, 'Fa♯', 1]].forEach(([P, t0, nom, i]) => {
        const xN = P.x + 350, NG = N.group(P.G), r = N.redonda(NG, 'F4', xN, yM0, SP, { alteracion: false });
        pop(s, NG, t0, null, xN + r.w / 2, r.y, { k0: .4 });
        const tc = (S.CONFL || [])[i];
        tinte(s, NG, maxK([enRosa([[t0, t0 + 1.8]]), tc != null ? (t => win(t, tc - 0.03, tc + 0.9, .05, .3)) : (() => 0)]));
        const L = fraseG(P.G, [[nom, 'currentColor']], xN + r.w / 2, yLab, { size: 34, peso: 800, anchor: 'middle' });
        aparece(s, L, t0, null, { dy: 6 }); tinte(s, L, enRosa([[t0, t0 + 1.8]]));
      });

      // ---------- D · paso uno: asentar la tonalidad A con la cadencia básica (I – IV – V7 – I)
      lineaEn(s, CTx, [[['cadencia básica', C.rosa]], [['en', C.suave]], [['Do M', C.blanco]]], CX, GEO.yCap, [tCad, tCad + 0.3, tCad + 0.3], tE1, { size: 38, peso: 800 });
      // ---------- E · paso dos: la casilla 5, el puente (acorde común sin la nota conflictiva)
      lineaEn(s, CTx, [[['acorde común', C.rosa]], [['a las dos tonalidades', C.blanco]]], CX, GEO.yCap, [tCom, tCom + 0.35], tEvi, { size: 38, peso: 800 });
      lineaEn(s, CTx, [[['evita la nota conflictiva:', C.blanco]], [['Fa', C.rosa]]], CX, GEO.yCap, [tEvi, Wd('E2', 'conflictiva') - 0.1], tE3, { size: 38, peso: 800 });
      lineaEn(s, CTx, [[['2 alteraciones de diferencia', C.blanco]], [['→', C.suave]], [['2 notas conflictivas', C.rosa]]], CX, GEO.yCap, [tE3a, tE3b, tE3b], tE4 - 0.05, { size: 38, peso: 800 });
      lineaEn(s, CTx, [[['en el libro:', C.blanco]], [['Mi m', C.rosa]]], CX, GEO.yCap, [tE4, tMi], tF1, { size: 38, peso: 800 });
      // ---------- F · paso tres: asentar la tonalidad B (casilla 7 = la tónica; casilla 6 = su dominante con 7ª)
      lineaEn(s, CTx, [[['casilla 7:', C.blanco]], [['la tónica', C.rosa]]], CX, GEO.yCap, [tTon7 - 0.15, tTon7], tAsi, { size: 38, peso: 800 });
      lineaEn(s, CTx, [[['casilla 6:', C.blanco]], [['su dominante, con 7ª', C.rosa]]], CX, GEO.yCap, [tSeis, tDom], tM1 - 0.05, { size: 38, peso: 800 });
      lineaEn(s, CTx, [[['Do M', C.blanco]], [['→', C.suave]], [['Sol M', C.rosa]]], CX, GEO.yCap, [tM1, tM1 + 0.2, tM1 + 0.4], null, { size: 38, peso: 800 });
      oido(s, CTx, OIDO[0], OIDO[1], ['SON_CAD', 'SON_MOD1']);
    });
  }

  // ================================================================ G · tres aclaraciones
  function escenaAclaraciones() {
    const a = F0('G1') - 0.2, b = F0('H1') - 0.2;
    escena('aclaraciones', a, b, (s, g) => {
      s.on(t => opa(g, win(t, a, b, .35, .4)));
      const tG1 = Wd('G1', 'aclaraciones') - 0.3;
      const t1 = F0('G2') - 0.1, t2 = F0('G5') - 0.1, t3 = F0('G9') - 0.1;
      // ---------- las tres tarjetas arriba: el título de cada una se escribe cuando le toca
      const TIT = ['Dominante con 7ª', 'Dominante siempre Mayor', 'Los demás: mira la armadura'];
      const TT = [t1, t2, t3], TE = [t2, t3, b + 1];
      const w = 500, gap = 30, x0 = CX - (3 * w + 2 * gap) / 2, y = 96, h = 70;
      TIT.forEach((tit, i) => {
        const x = x0 + i * (w + gap), G = N.group(g);
        const r = panel(G, x, y, w, h, { rx: 16 });
        const nu = N.group(G); N.el('circle', { cx: x + 38, cy: y + h / 2, r: 21, fill: 'none', stroke: 'currentColor', 'stroke-width': 3 }, nu);
        texto(nu, String(i + 1), x + 38, y + h / 2 + 9, { anchor: 'middle', size: 25, peso: 800, fill: 'currentColor' });
        const Tw = N.group(G), TC = N.group(Tw), tf = frase(TC, tit, x + 76, y + h / 2 + 10, { size: 27, peso: 800 });
        escribe(s, Tw, x + 70, y + 6, y + h - 6, [[TT[i], x + 80 + tf._w, 0.6]]);
        pop(s, G, tG1 + i * 0.15, null, x + w / 2, y + h / 2, { k0: .85 });
        s.on(t => {
          const k = win(t, TT[i], TE[i], .3, .3), hecho = t >= TE[i];
          const base = hecho ? C.blanco : C.suave;
          r.setAttribute('stroke', mezcla('#3a4556', C.rosa, k)); r.setAttribute('stroke-width', (1.5 + 1.5 * k).toFixed(2));
          color(nu, mezcla(base, C.rosa, k)); color(TC, mezcla(base, C.blanco, k));
        });
      });
      const ah = fraseG(g, [['te ahorran ', C.blanco], ['muchos errores', C.rosa]], CX, 540, { size: 46, peso: 800, anchor: 'middle' });
      aparece(s, ah, Wd('G1', 'ahorran') - 0.2, t1 - 0.1, { dy: 8 });
      const fj = fraseG(g, [['fíjate bien', C.suave]], CX, 620, { size: 36, peso: 700, italic: true, anchor: 'middle' });
      aparece(s, fj, Wd('G1', 'fijate') - 0.2, t1 - 0.1, { dy: 6 });

      // ---------- 1 · los acordes de dominante, con 7ª (G → G7): estilo, tensión, lo más utilizado · sin ella, −½ punto
      const A1 = N.group(g); s.on(t => opa(A1, win(t, t1, t2, .35, .35)));
      const tDo1 = Wd('G3', 'dominante') - 0.15, tSe1 = Wd('G3', 'septima') - 0.1, tOlv = Wd('G4', 'olvidas') - 0.1;
      const xC1 = 740, yC1 = 350, wC1 = 250, hC1 = 200;
      const C1 = N.group(A1); C1.setAttribute('transform', `translate(${xC1},0)`);
      const cas1 = casilla(C1, '', yC1, wC1, hC1);
      pop(s, cas1.g, t1 + 0.3, null, 0, yC1 + hC1 / 2, { k0: .8 });
      marcoEn(s, cas1, enRosa([[tDo1, tSe1 + 1.2]]));
      const S1w = N.group(C1), sy1 = cifraG(S1w, 'G7', 0, yC1 + 138, 112);
      escribe(s, S1w, sy1.x0 - 8, yC1 + 10, yC1 + hC1 - 8, [[tDo1, sy1.x0 + sy1.wSin7 + 4, 0.35], [tSe1, sy1.x0 + sy1.w + 8, 0.35]]);
      tinte(s, sy1.letra, enRosa([[tDo1, tDo1 + 1.0]])); tinte(s, sy1.siete, enRosa([[tSe1, tSe1 + 1.6], [tOlv, t2]]));
      s.on(t => opa(sy1.siete, 1 - 0.8 * ease(ramp(t, tOlv, tOlv + 0.4))));
      const G1w = N.group(C1), gr1 = gradoG(G1w, 'V7', 0, yC1 + hC1 + 92, 60);
      escribe(s, G1w, gr1.x0 - 8, yC1 + hC1 + 30, yC1 + hC1 + 110, [[tDo1 + 0.1, gr1.x0 + gr1.wb + 3, 0.3], [tSe1 + 0.1, gr1.x0 + gr1.w + 8, 0.3]]);
      tinte(s, gr1.g, enRosa([[tDo1 + 0.1, tSe1 + 1.2]]));
      const RAZ = [['cuestión de ', 'estilo', Wd('G3', 'cuestion') - 0.2], ['aporta ', 'tensión', Wd('G3', 'tension') - 0.25], ['lo más ', 'utilizado', Wd('G3', 'utilizado') - 0.3]];
      RAZ.forEach(([p1, p2, t0], i) => {
        const L = linea(A1, [[[p1.trim(), C.blanco]], [[p2, 'currentColor']]], 1060, 412 + i * 84, { size: 40, peso: 800, izq: true });
        L.forEach(w_ => aparece(s, w_, t0, null, { dy: 6 }));
        tinte(s, L[1], enRosa([[t0, (i < 2 ? RAZ[i + 1][2] : Wd('G3', 'vale')) - 0.05]]));
      });
      lineaEn(s, A1, [[['en el portal:', C.blanco]], [['sin 7ª', C.rosa]], [['→', C.suave]], [['−½ punto', C.rosa]]], CX, 790, [Wd('G4', 'portal') - 0.2, tOlv, Wd('G4', 'medio') - 0.25, Wd('G4', 'medio') - 0.1], null, { size: 40, peso: 800 });

      // ---------- 2 · la dominante, siempre Mayor: en Mi m, el V «sin hacer nada más» (Si m, sin sensible) → la letra + 7 (Si7)
      const A2 = N.group(g); s.on(t => opa(A2, win(t, t2, t3, .35, .35)));
      const tDom2 = Wd('G5', 'dominante') - 0.2, tMay2 = Wd('G5', 'mayor') - 0.1, tDig = Wd('G5', 'diga') - 0.2, tG6 = F0('G6');
      const tMen = Wd('G6', 'menor') - 0.15, tQui = Wd('G6', 'quinto') - 0.1, tMen2 = Wd('G6', 'menor', 2) - 0.1, tSen = Wd('G6', 'sin') - 0.1;
      const tFue = Wd('G7', 'fuera') - 0.15, tG8 = F0('G8') - 0.1, tQ8 = Wd('G8', 'quinto') - 0.2, tLet = Wd('G8', 'letra') - 0.1, tS7 = Wd('G8', '7') - 0.1;
      const tDo8 = Wd('G8', 'dominante') - 0.1, tTri = Wd('G8', 'triada') - 0.1, tSol8 = Wd('G8', 'solucionado') - 0.3;
      // la regla: primero grande, en el centro; al empezar el ejemplo baja a su sitio
      const RG = N.group(A2), RG1 = N.group(RG);
      lineaEn(s, RG1, [[['la dominante:', C.blanco]], [['siempre', C.blanco]], [['Mayor', C.rosa]]], CX, 0, [tDom2, tMay2 - 0.3, tMay2], null, { size: 50, peso: 800 });
      const RG2 = fraseG(RG, [['diga lo que diga la armadura', C.suave]], CX, 74, { size: 36, peso: 700, italic: true, anchor: 'middle' });
      aparece(s, RG2, tDig, tG6 + 0.2, { dy: 6 });
      s.on(t => {
        const k = ease(ramp(t, tG6, tG6 + 0.8)), y_ = lerp(520, GEO.yCap, k), sc = lerp(1, 0.76, k);
        RG.setAttribute('transform', `translate(${CX},${y_.toFixed(1)}) scale(${sc.toFixed(4)}) translate(${-CX},0)`);
        opa(RG, 1 - ease(ramp(t, tFue - 0.3, tFue)));
      });
      // «fuera de estilo» (mientras, la regla se aparta)
      const FU = N.group(A2), fuL = linea(FU, [[['V menor:', C.blanco]], [['fuera de estilo', C.rosa]]], CX, GEO.yCap, { size: 38, peso: 800 });
      fuL.forEach(w_ => aparece(s, w_, tFue, tG8 + 0.3, { dy: 6 }));
      // el sistema en Mi m (1♯) con i – v – i (luego i – V7 – i)
      const COLS3 = [780, 960, 1140];
      const S2 = N.group(A2), sis2 = sistema(S2, 563, 450, 709, { sep: 9 * SP });
      armaduraSis(S2, sis2, sis2.x0 + 4, 1, '#');
      aparece(s, S2, tMen, null, { dy: 10 });
      const lab2 = chipViajero(s, A2, 'Mi m', null, { tIn: tMen, kf: [[0, 666, GEO.yRA - 12, 0.8]], rosa: [[tMen, tMen + 1.4]] });
      void lab2;
      const yC2 = 228, hC2 = 100;
      const AC2 = [
        { cif: 'E−', g: 'I', notas: ['E3', 'G3', 'E4', 'B4'], t: tMen + 0.3 },
        { cif: 'B−', g: 'V7', notas: ['B2', 'F#3', 'D#4', 'A4'], t: tQui },           // se dibuja Si7 y se «recoloca» como Si m
        { cif: 'E−', g: 'I', notas: ['E2', 'E3', 'E4', 'G4'], t: F1('G6') - 0.25 },  // se dibuja el final de SON_V7
      ];
      const LZV = [0, 1, 2].map(j => flash('SON_VMEN', j)), LZ7 = [0, 1, 2].map(j => flash('SON_V7', j));
      const C2 = AC2.map((ac, j) => {
        const CB = N.group(A2); CB.setAttribute('transform', `translate(${COLS3[j]},0)`);
        const cas = casilla(CB, '', yC2, 150, hC2);
        pop(s, cas.g, ac.t - 0.2, null, 0, yC2 + hC2 / 2, { k0: .7 });
        const SYw = N.group(CB), sym = cifraG(SYw, ac.cif, 0, yC2 + 68, 50, { alt7: j === 1 });
        escribe(s, SYw, sym.x0 - 6, yC2 + 8, yC2 + hC2 - 6, [[ac.t, sym.x0 + sym.w + 8, 0.4]]);
        const acd = acordeSATB(CB, ac.notas, sis2, { F: '#' });
        const GW = N.group(CB), gr = gradoG(GW, ac.g, 0, GEO.yRA, 36);
        escribe(s, GW, gr.x0 - 6, GEO.yRA - 36, GEO.yRA + 12, j === 1 ? [[ac.t, gr.x0 + gr.wb + 2, 0.3], [tS7, gr.x0 + gr.w + 6, 0.3]] : [[ac.t, gr.x0 + gr.w + 6, 0.35]]);
        return { CB, cas, SYw, sym, acd, GW, gr };
      });
      C2.forEach((c, j) => {
        const luz = [LZV[j], LZ7[j]];
        const rs = j === 1 ? [[tQui, tQui + 1.2], [tQ8, tS7 + 1.6]] : [[AC2[j].t, AC2[j].t + 0.9]];
        marcoEn(s, c.cas, maxK([enRosa(rs)].concat(luz)));
        s.on(t => { let k = ventanas(t, rs, .1, .35); for (const f of luz) k = Math.max(k, f(t)); color(c.sym.g, mezcla(C.blanco, C.rosa, k)); color(c.gr.g, mezcla(C.blanco, C.rosa, ventanas(t, rs, .1, .35))); });
        animaAcorde(s, c.acd, { tAp: AC2[j].t, luz, fresco: 0.9 });
      });
      // B−: el «−» se enciende al decir «menor» y se va al quedarse «solo la letra»; luego se escribe el 7
      const sB = C2[1].sym;
      s.on(t => { opa(sB.menos, 1 - ease(ramp(t, tLet, tLet + 0.4))); color(sB.menos, mezcla(C.blanco, C.rosa, ventanas(t, [[tMen2, tLet + 0.4]], .1, .2))); });
      const S7w = N.group(sB.g); S7w.appendChild(sB.siete);
      s.on(t => opa(S7w, ease(ramp(t, tS7, tS7 + 0.3))));
      // la transformación Si m → Si7: la soprano baja de Si a La (la 7.ª) y la contralto recibe el ♯ (la sensible)
      const vB = C2[1].acd.v, vE = C2[2].acd.v, tMov = tDo8, tMovE = tSol8;
      const soB = vB[3], alB = vB[2];
      s.on(t => { const k = ease(ramp(t, tMov, tMov + 0.6)); soB.o.setAttribute('transform', `translate(0,${(-0.5 * SP * (1 - k)).toFixed(1)})`); });
      if (alB.alt) { color(alB.alt, C.rosa); pop(s, alB.alt, tMov + 0.2, null, -WN / 2 - 16, alB.y, { k0: .3 }); }
      const sensR = [[tSen, tSen + 1.6], [tMov + 0.2, b + 1]];
      tinte(s, alB.g, maxK([enRosa(sensR), LZV[1], LZ7[1]]));
      tinte(s, soB.g, maxK([enRosa([[tMov, tMov + 1.4]]), LZV[1], LZ7[1]]));
      // Mi m final: de Mi3 Sol3 Mi4 Si4 (tras Si m) a Mi2 Mi3 Mi4 Sol4 (tras Si7): el bajo baja una 8.ª; tenor y soprano, una 3.ª
      const dE = [(sis2.yF - 0.5 * SP) - vE[0].y, (sis2.yF - 1.5 * SP) - vE[1].y, 0, sis2.yS - vE[3].y];
      vE.forEach((v, i) => {
        if (!dE[i]) return;
        s.on(t => { const k = ease(ramp(t, tMovE, tMovE + 0.7)); v.o.setAttribute('transform', `translate(0,${(dE[i] * (1 - k)).toFixed(1)})`); v.led.forEach(l => l.setAttribute('opacity', ramp(k, 0.75, 1).toFixed(3))); });
      });
      // anotaciones bajo el V: «menor · sin sensible» → tachado → «Mayor · sensible: Re♯»
      const an1 = linea(A2, [[['menor', C.rosa]], [['·', C.suave]], [['sin sensible', C.rosa]]], COLS3[1], GEO.yRA + 50, { size: 28, peso: 800 });
      aparece(s, an1[0], tMen2, tTri + 0.9, { dy: 5 }); aparece(s, an1[1], tSen, tTri + 0.9, { dy: 5 }); aparece(s, an1[2], tSen, tTri + 0.9, { dy: 5 });
      tachon(s, A2, an1[0]._f._x - 6, an1[2]._f._x + an1[2]._f._w + 6, GEO.yRA + 50 - 10, tDo8, tTri + 0.9);
      const an2 = linea(A2, [[['Mayor', C.rosa]], [['·', C.suave]], [['sensible: Re♯', C.rosa]]], COLS3[1], GEO.yRA + 50, { size: 28, peso: 800 });
      aparece(s, an2[0], tTri + 0.2, null, { dy: 5 }); aparece(s, an2[1], tTri + 0.4, null, { dy: 5 }); aparece(s, an2[2], tTri + 0.4, null, { dy: 5 });
      const X_ = N.group(A2); marca(X_, false, COLS3[1] + 75, yC2 + 4, 16);
      pop(s, X_, tFue, tQ8, COLS3[1] + 75, yC2 + 4, { k0: .3 });
      // «la letra y el 7» · «el 7 → dominante = tríada Mayor»
      lineaEn(s, A2, [[['cuando toque un V:', C.blanco]], [['la letra', C.rosa]], [['+', C.suave]], [['7', C.rosa]]], CX, GEO.yCap, [tQ8, tLet, tS7 - 0.1, tS7], tDo8 - 0.1, { size: 38, peso: 800 });
      lineaEn(s, A2, [[['el 7 →', C.blanco]], [['dominante', C.rosa]], [['= tríada', C.blanco]], [['Mayor', C.rosa]]], CX, GEO.yCap, [tDo8, tDo8, tTri, tTri + 0.3], null, { size: 38, peso: 800 });
      oido(s, A2, 1400, (sis2.yS + sis2.yF) / 2, ['SON_VMEN', 'SON_V7']);

      // ---------- 3 · los demás: mira la armadura · el puente coincide en las dos
      const A3 = N.group(g); s.on(t => opa(A3, win(t, t3, b, .35, .35)));
      const tDe = Wd('G9', 'demas') - 0.25, tMm = Wd('G9', 'mayores') - 0.2, tMir = Wd('G10', 'mira') - 0.2, tArm3 = Wd('G10', 'armadura') - 0.1;
      const tPu3 = Wd('G11', 'acorde') - 0.1, tIg = Wd('G11', 'igual') - 0.2, tMir2 = Wd('G11', 'mires') - 0.1, tCoi = Wd('G11', 'coincidir') - 0.15;
      lineaEn(s, A3, [[['los demás acordes:', C.blanco]], [['¿Mayores o menores?', C.rosa]]], CX, 300, [tDe, tMm], null, { size: 44, peso: 800 });
      lineaEn(s, A3, [[['→', C.suave]], [['mira la armadura', C.rosa]]], CX, 380, [tMir, tMir], null, { size: 44, peso: 800 });
      const yM3 = 620, PS = pentasArmadura(A3, yM3, 1, '#');
      [PS.L, PS.R].forEach(P => aparece(s, P.G, t3 + 0.4, null, { dy: 10 }));
      const ts3 = [PS.L.A.items, PS.R.A.items];
      ts3[1].forEach(it => tinte(s, it.g, enRosa([[tArm3, tArm3 + 1.6]])));
      chipViajero(s, A3, 'Do M', null, { tIn: t3 + 0.5, kf: [[0, 560, 510, 1]], rosa: [[tIg, tMir2 + 0.1]], tenue: [[tMir2 + 0.1, tCoi - 0.1]] });
      chipViajero(s, A3, 'Sol M', null, { tIn: t3 + 0.6, kf: [[0, 1360, 510, 1]], rosa: [[tMir2 + 0.1, tCoi - 0.1]], tenue: [[tIg, tMir2 + 0.1]] });
      // el puente: Mi – Sol – Si en las dos armaduras → Mi m en las dos
      [[PS.L, 610], [PS.R, 1400]].forEach(([P, xT], i) => {
        const TR = N.group(A3), wn = WN;
        ['E4', 'G4', 'B4'].forEach((n, k) => { const NG = N.group(TR); const r = N.redonda(NG, n, xT - wn / 2, yM3, SP, { alteracion: false }); pop(s, NG, tPu3 + k * 0.08, null, xT, r.y, { k0: .4 }); });
        const kS = i === 0 ? [[tIg, tMir2 + 0.1]] : [[tMir2 + 0.1, tCoi - 0.1]];
        tinte(s, TR, enRosa(kS.concat([[tCoi, tCoi + 1.6]])));
        const L = fraseG(A3, [['Mi m', 'currentColor']], xT, yM3 + 2 * SP + 70, { size: 38, peso: 800, anchor: 'middle' });
        aparece(s, L, tCoi, null, { dy: 6 }); tinte(s, L, enRosa([[tCoi, tCoi + 1.6]]));
      });
      const EQ = fraseG(A3, [['=', C.rosa]], CX, yM3 + 18, { size: 72, peso: 800, anchor: 'middle' });
      pop(s, EQ, tCoi, null, CX, yM3, { k0: .5 });
      lineaEn(s, A3, [[['el puente:', C.blanco]], [['coincide en las dos', C.rosa]]], CX, 880, [tPu3, tCoi], null, { size: 40, peso: 800 });
    });
  }

  // ================================================================ H · segundo ejemplo: Do M → Mi m (puente La m · Si7 con el Re♯ sensible)
  function escenaSegundo() {
    const a = F0('H1') - 0.2, b = F0('P1') - 0.2;
    escena('segundo', a, b, (s, g) => {
      s.on(t => opa(g, win(t, a, b, .35, .4)));
      const CFo = N.group(g), CSi = N.group(g), CCo = N.group(g), CCa = N.group(g), CTx = N.group(g);
      const tOtro = Wd('H1', 'otro') - 0.2, tDo = Wd('H1', 'do') - 0.1, tMi = Wd('H1', 'mi') - 0.1;
      const tUp = Wd('H2', 'armaduras') - 0.3, tDo2 = Wd('H2', 'do') - 0.15, tNad = Wd('H2', 'nada') - 0.1, tMi2 = Wd('H2', 'mi') - 0.15, tUn = Wd('H2', 'un') - 0.1;
      const tD = Wd('H3', 'cadencia') - 0.3, tDoA = Wd('H3', 'do', 1) - 0.1, tSiem = Wd('H3', 'siempre') - 0.2;
      const tI1 = Wd('H3', 'do', 2) - 0.1, tIV = Wd('H3', 'fa') - 0.1, tV7 = Wd('H3', 'sol') - 0.1, tI2 = Wd('H3', 'do', 3) - 0.1;
      const tH4 = F0('H4') - 0.1, tPue = Wd('H4', 'puente') - 0.2, tTen = Wd('H4', 'tenga') - 0.2, tFa = Wd('H4', 'fa') - 0.1, tH5 = F0('H5') - 0.1;
      const tLa = Wd('H5', 'la') - 0.1, tSex = Wd('H5', 'sexto') - 0.1, tDo5 = Wd('H5', 'do') - 0.1, tCua = Wd('H5', 'cuarto') - 0.1, tMi5 = Wd('H5', 'mi') - 0.1;
      const tH6 = F0('H6') - 0.1, tCer = Wd('H6', 'cerrar') - 0.2, tMi6 = Wd('H6', 'mi') - 0.1, tDom = Wd('H6', 'dominante') - 0.1, tSi7 = Wd('H6', 'si') - 0.1;
      const tEj = Wd('H6', 'ejemplo') - 0.2, tSiN = Wd('H6', 'si', 2) - 0.05, tReN = Wd('H6', 're') - 0.05, tFaN = Wd('H6', 'fa') - 0.05, tLaN = Wd('H6', 'la') - 0.05;
      const tMay = Wd('H6', 'mayor') - 0.1, tAun = Wd('H6', 'aunque') - 0.1, tM2 = F0('SON_MOD2'), tM2f = F1('SON_MOD2');
      const BN = S.B7_NOTAS || [tSiN, tReN, tFaN, tLaN];
      // ---------- H1 · otro ejemplo: de Do M a Mi m
      const ko = N.group(CTx); chip(ko, 'OTRO EJEMPLO', CX, 250, { size: 32, anchor: 'middle' });
      pop(s, ko, tOtro, tUp + 0.2, CX, 250);
      lineaEn(s, CTx, [[['de', C.suave]], [['Do M', C.blanco]], [['a', C.suave]], [['Mi m', C.blanco]]], CX, 860, [tDo, tDo, tMi - 0.05, tMi], tUp + 0.1, { size: 40, peso: 800 });
      const yG0 = 420, dyG = yG0 - GEO.yG;
      s.on(t => CCa.setAttribute('transform', `translate(0,${(dyG * (1 - ease(ramp(t, tUp, tUp + 0.8)))).toFixed(1)})`));
      const SI = N.group(CSi), sis = sistema(SI, GEO.sx, GEO.yS, GEO.sw, { sep: 9 * SP });
      aparece(s, SI, tD + 0.95, null, { dy: 10 });
      const cols = EJ2.map((ac, j) => columna(CCa, CCo, j, ac, sis));
      cols.forEach((c, j) => pop(s, c.cas.g, a + 0.15 + j * 0.06, null, 0, GEO.yG + GEO.hG / 2, { k0: .7 }));
      const LZ = EJ2.map((_, j) => flash('SON_MOD2', j));
      const MAR = [[[tDo, tDo + 1.4], [tI1, tI1 + 0.5]], [[tIV, tIV + 0.8]], [[tV7, tV7 + 1.0]], [[tI2, tI2 + 1.0]], [[tPue, tH6]], [[tDom, tM2]], [[tMi, tMi + 1.4], [tCer, tDom]]];
      cols.forEach((c, j) => marcoEn(s, c.cas, maxK([enRosa(MAR[j]), LZ[j]])));
      const SYt = [[tDo, [[tDo, tDo + 1.6]]], [tIV, [[tIV, tIV + 0.8]]], [tV7, [[tV7, tV7 + 1.0]]], [tI2, [[tI2, tI2 + 1.0]]], [tLa, [[tLa, tLa + 1.6]]], [tSi7, [[tSi7, tSi7 + 1.4]]], [tMi, [[tMi, tMi + 1.6], [tMi6, tMi6 + 1.0]]]];
      cols.forEach((c, j) => animaCifra(s, c, SYt[j][0], null, SYt[j][1], [LZ[j]]));
      const faH4 = [[tFa, tH5]];
      animaAcorde(s, cols[0].acd, { tAp: tI1, luz: [LZ[0]] });
      animaAcorde(s, cols[1].acd, { tAp: tIV, luz: [LZ[1]], voz: [faH4, [], faH4, []] });
      animaAcorde(s, cols[2].acd, { tAp: tV7, luz: [LZ[2]], voz: [[], [], faH4, []] });
      animaAcorde(s, cols[3].acd, { tAp: tI2, luz: [LZ[3]] });
      animaAcorde(s, cols[4].acd, { tAp: tLa, luz: [LZ[4]] });
      // Si7: cada nota, en rosa al nombrarla (Si, Re♯, Fa♯, La); el Re♯ (la sensible) se queda en rosa
      const fin7 = BN[3] + 1.1;
      animaAcorde(s, cols[5].acd, { tAp: tSi7, luz: [LZ[5]], voz: [[[BN[0], fin7]], [[BN[2], fin7]], [[BN[1], b + 1]], [[BN[3], fin7]]] });
      animaAcorde(s, cols[6].acd, { tAp: tMi6, luz: [LZ[6]] });
      const tenA = [[tMi5, tMi5 + 1.4]], tenB = [[tDo5, tMi5 - 0.1]];
      const GA = [[tI1, [[tI1, tI1 + 0.6]]], [tIV, [[tIV, tIV + 0.8]]], [tV7, [[tV7, tV7 + 1.0]]], [tI2, [[tI2, tI2 + 1.0]]], [tSex, [[tSex, tSex + 1.2]]]];
      GA.forEach(([t0, r], j) => animaGrado(s, cols[j].GAw, cols[j].gA, GEO.yRA, t0, null, r, tenA));
      animaGrado(s, cols[4].GBw, cols[4].gB, GEO.yRB, tCua, null, [[tCua, tCua + 1.2]], tenB);
      animaGrado(s, cols[5].GBw, cols[5].gB, GEO.yRB, tDom, null, [[tDom, tDom + 1.2]], tenB);
      animaGrado(s, cols[6].GBw, cols[6].gB, GEO.yRB, tMi6, null, [[tMi6, tMi6 + 1.0]], tenB);
      etiquetaPuente(s, cols[4], tPue);
      const BA = N.group(CFo); BA.setAttribute('transform', `translate(${COLS7[4]},0)`);
      const ba = banda(BA, 166, GEO.yG - 12, GEO.yRB + 24); mostrarEn(s, ba, tPue, null, .4);
      // ---------- las dos tonalidades (bajo la 1.ª y la última casilla → pentagramas con su armadura → filas de grados)
      const yU = GEO.yG + GEO.hG + 82;
      chipViajero(s, CTx, 'Do M', null, {
        tIn: tDo, kf: [[0, 450, yU + dyG, 1], [tUp, 450, yU, 1, 0.8], [tDo2, 560, 540, 1, 0.6], [tD + 0.1, GEO.xLab, GEO.yRA - 12, 0.8, 0.8]],
        rosa: [[tDo, tDo + 1.0], [tDo2, tNad + 0.9], [tDoA, tDoA + 1.2], [tDo5, tMi5 - 0.1]], tenue: [[tMi2 - 0.1, F1('H2') + 0.3], [tMi5, tMi5 + 1.4]],
      });
      chipViajero(s, CTx, 'Mi m', null, {
        tIn: tMi, kf: [[0, 1470, yU + dyG, 1], [tUp, 1470, yU, 1, 0.8], [tMi2, 1360, 540, 1, 0.6], [tD + 0.3, GEO.xLab, GEO.yRB - 12, 0.8, 0.8]],
        rosa: [[tMi, tMi + 1.0], [tMi2, F1('H2') + 0.2], [tMi5, tMi5 + 1.4], [tMi6, tMi6 + 1.2]], tenue: [[tDo2 - 0.1, tMi2 - 0.1], [tD + 0.9, tPue], [tDo5, tMi5 - 0.1]],
      });
      filaPasos(s, CTx, 96, tUp + 0.25, [[0, tUp + 0.3, tD], [1, tD, tH4], [2, tH4, tH6], [3, tH6, b + 1]]);
      const yM0 = 650, yLab = yM0 + 2 * SP + 64;
      const PA = pentasArmadura(CFo, yM0, 1, '#');
      const tenL = [[tMi2 - 0.1, F1('H2') + 0.3]], tenR = [[tDo2 - 0.1, tMi2 - 0.1]];
      [[PA.L, tenL], [PA.R, tenR]].forEach(([P, ten]) => s.on(t => {
        const v = win(t, tUp + 0.2, tD + 0.45, .45, .45) * (1 - 0.62 * ventanas(t, ten, .3, .3));
        opa(P.G, v); if (v > 0) P.G.setAttribute('transform', `translate(0,${((1 - eo(ramp(t, tUp + 0.2, tUp + 0.65))) * 12).toFixed(1)})`);
      }));
      const sos = PA.R.A.items[0];
      pop(s, sos.g, tUn, null, sos.x + N.M.accidentalSharp.adv * SP / 2, yM0 - sos.pos * SP, { k0: .3 });
      tinte(s, sos.g, enRosa([[tUn, tUn + 1.5]]));
      const lSin = fraseG(PA.L.G, [['sin alteraciones', 'currentColor']], PA.L.P.x0 + 30, yLab, { size: 28, peso: 700, anchor: 'middle' });
      aparece(s, lSin, tNad, null, { dy: 6 }); tinte(s, lSin, enRosa([[tNad, tNad + 1.2]]), C.suave);
      const lSos = fraseG(PA.R.G, [['un sostenido', 'currentColor']], PA.R.P.x0 + 30, yLab, { size: 28, peso: 700, anchor: 'middle' });
      aparece(s, lSos, tUn + 0.05, null, { dy: 6 }); tinte(s, lSos, enRosa([[tUn, tUn + 1.3]]), C.suave);
      // ---------- rótulos de abajo, paso a paso
      const yC = GEO.yCap, oC = { size: 38, peso: 800 };
      lineaEn(s, CTx, [[['cadencia en Do M:', C.blanco]], [['la de siempre', C.rosa]]], CX, yC, [tD + 0.4, tSiem], tH4, oC);
      lineaEn(s, CTx, [[['puente:', C.blanco]], [['sin la nota Fa', C.rosa]]], CX, yC, [tPue, tTen], tH5 - 0.05, oC);
      lineaEn(s, CTx, [[['La m', C.rosa]], [['nos sirve', C.blanco]]], CX, yC, [tLa, tLa + 0.5], tH6 - 0.05, oC);
      lineaEn(s, CTx, [[['cerrar en Mi m:', C.blanco]], [['su dominante, Si7', C.rosa]]], CX, yC, [tCer, tDom], tEj - 0.05, oC);
      lineaEn(s, CTx, [[['como en la aclaración 2', C.suave]]], CX, yC, [tEj], tSiN - 0.15, { size: 38, peso: 700, italic: true });
      lineaEn(s, CTx, [[['Si', C.blanco]], [['·', C.suave]], [['Re♯', C.rosa]], [['·', C.suave]], [['Fa♯', C.blanco]], [['·', C.suave]], [['La', C.blanco]], [['=', C.suave]], [['Mayor', C.rosa]], [['(aunque estemos en Mi m)', C.suave]]],
        CX, yC, [tSiN, tReN - 0.1, tReN, tFaN - 0.1, tFaN, tLaN - 0.1, tLaN, tMay - 0.1, tMay, tAun], null, oC);
      oido(s, CTx, OIDO[0], OIDO[1], ['SON_MOD2']);
      void tM2f;
    });
  }

  // ================================================================ P · en el portal: nota, alteración, tipo y botón de 7.ª
  function escenaPortal() {
    const a = F0('P1') - 0.2, b = F0('R1') - 0.2;
    escena('portal', a, b, (s, g) => {
      s.on(t => opa(g, win(t, a, b, .35, .4)));
      const tPo = Wd('P1', 'portal') - 0.2, tCa = Wd('P1', 'casilla') - 0.2, tNo = Wd('P1', 'nota') - 0.1, tAl = Wd('P1', 'alteracion') - 0.1;
      const tTi = Wd('P1', 'tipo') - 0.1, tDo = Wd('P1', 'dominante') - 0.1, tBo = Wd('P1', 'boton') - 0.1, tSe = Wd('P1', 'septima') - 0.1;
      const k = N.group(g); chip(k, 'EN EL PORTAL', CX, 140, { size: 32, anchor: 'middle' });
      pop(s, k, tPo, null, CX, 140);
      // las casillas del ejercicio (la 6, seleccionada)
      const CIF = ['C', 'F', 'G7', 'C', 'E−', 'D7', 'G'], XS = CIF.map((_, j) => CX + (j - 3) * 150), yG = 216, hG = 100;
      CIF.forEach((cif, j) => {
        const CB = N.group(g); CB.setAttribute('transform', `translate(${XS[j]},0)`);
        const cas = casilla(CB, j + 1, yG, 130, hG);
        pop(s, cas.g, a + 0.2 + j * 0.05, null, 0, yG + hG / 2, { k0: .8 });
        const SYw = N.group(CB), sym = cifraG(SYw, cif, 0, yG + 68, 46);
        if (j === 4) { const W = N.group(CB), P = N.group(W); color(P, C.rosa); texto(P, 'puente', -65 + 30, yG + 25, { size: 17, peso: 800, fill: 'currentColor' }); aparece(s, W, a + 0.3, null, { dy: 0 }); }
        if (j === 5) {
          marcoEn(s, cas, t => win(t, tCa, b + 1, .3, .3));
          escribe(s, SYw, sym.x0 - 6, yG + 8, yG + hG - 6, [[tNo + 0.15, sym.x0 + sym.wSin7 + 3, 0.35], [tSe + 0.1, sym.x0 + sym.w + 6, 0.3]]);
          tinte(s, sym.g, enRosa([[tNo + 0.15, b + 1]]));
        } else aparece(s, SYw, a + 0.3 + j * 0.05, null, { dy: 0 });
      });
      // el editor: nota · alteración · tipo (+ 7ª)
      const P = N.group(g); panel(P, 330, 360, 1260, 390, { rx: 22 }); aparece(s, P, tCa, null, { dy: 10 });
      const FIL = [
        { lab: 'NOTA', y: 450, t: tNo, opc: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'], w: 96, sel: 1 },
        { lab: 'ALTERACIÓN', y: 560, t: tAl, opc: ['accidentalDoubleFlat', 'accidentalFlat', 'accidentalNatural', 'accidentalSharp', 'accidentalDoubleSharp'], w: 96, sel: 2, gl: true },
        { lab: 'TIPO', y: 670, t: tTi, opc: ['Mayor', 'menor', 'dism.', '7ª (dom.)'], w: 150, sel: 0 },
      ];
      FIL.forEach((f, i) => {
        const G = N.group(g); aparece(s, G, tCa + 0.15 + i * 0.12, null, { dy: 8 });
        const L = N.group(G); texto(L, f.lab, 390, f.y + 9, { size: 24, peso: 800, ls: '0.12em', fill: 'currentColor' });
        const tFin = i < 2 ? FIL[i + 1].t : tDo;
        s.on(t => color(L, t < f.t ? C.suave : mezcla(C.blanco, C.rosa, win(t, f.t, tFin, .15, .35))));
        let x = 660;
        f.opc.forEach((op, j) => {
          const w = (op === '7ª (dom.)') ? 190 : f.w;
          if (op === '7ª (dom.)') x += 30;
          const B = N.group(G), h = 58;
          N.el('rect', { x, y: f.y - h / 2, width: w, height: h, rx: 12, fill: C.panel, stroke: '#3a4556', 'stroke-width': 2 }, B);
          const ON = N.el('rect', { x, y: f.y - h / 2, width: w, height: h, rx: 12, fill: C.rosa }, B);
          if (f.gl) {
            const m = N.M[op], sp = 26, xg = x + w / 2 - m.adv * sp / 2, yc = f.y + ((m.sw[1] + m.ne[1]) / 2) * sp;
            const Gg = N.group(B); color(Gg, C.blanco); N.glyph(Gg, op, xg, yc, sp);
          } else texto(B, op, x + w / 2, f.y + 10, { anchor: 'middle', size: 28, peso: 800, fill: C.blanco });
          const tOn = op === '7ª (dom.)' ? tBo : (j === f.sel ? f.t + 0.15 : null);
          s.on(t => opa(ON, tOn == null ? 0 : ease(ramp(t, tOn, tOn + 0.25))));
          x += w + 16;
        });
      });
      const dm = fraseG(g, [['si es una dominante: ', C.blanco], ['el botón de 7ª', C.rosa]], CX, 850, { size: 38, peso: 800, anchor: 'middle' });
      aparece(s, dm, tDo, null, { dy: 8 });
    });
  }

  // ================================================================ R · repaso final
  function escenaRepaso() {
    const a = F0('R1') - 0.2, b = F0('O1') - 0.2;
    escena('repaso', a, b, (s, g) => {
      s.on(t => opa(g, win(t, a, b, .35, .4)));
      const k = N.group(g); chip(k, 'REPASO', CX, 170, { size: 34, anchor: 'middle' });
      pop(s, k, Wd('R1', 'recapitulando') - 0.2, null, CX, 170);
      const P = N.group(g); panel(P, 300, 250, 1320, 620, { rx: 26, stroke: 'rgba(248,250,252,0.3)', sw: 2 }); aparece(s, P, a + 0.2, null, { dy: 10 });
      const tL = [Wd('R1', 'armaduras') - 0.3, Wd('R2', 'empezamos') - 0.2, Wd('R3', 'casilla') - 0.2, Wd('R4', 'final') - 0.3];
      const FIL = [
        { n: '0', p: [[['las', C.blanco]], [['armaduras', 'currentColor']], [['y la', C.blanco]], [['nota conflictiva', 'currentColor']]], ts: [tL[0], tL[0], Wd('R1', 'nota') - 0.3, Wd('R1', 'nota') - 0.2] },
        { n: '1', p: [[['cadencia en A:', C.blanco]], [['I – IV – V7 – I', 'currentColor']]], ts: [tL[1], Wd('R2', 'proceso') - 0.2] },
        { n: '2', p: [[['casilla 5 =', C.blanco]], [['puente', 'currentColor']], [['(común, sin la nota conflictiva)', C.suave]]], ts: [tL[2], Wd('R3', 'puente') - 0.2, Wd('R3', 'comun') - 0.3] },
        { n: '3', p: [[['al final:', C.blanco]], [['V7 – I', 'currentColor']], [['en B', C.blanco]]], ts: [tL[3], Wd('R4', 'quinto') - 0.2, Wd('R4', 'quinto') - 0.1] },
      ];
      FIL.forEach((f, i) => {
        const y = 370 + i * 135, t0 = f.ts[0], t1 = i < 3 ? tL[i + 1] : b + 1;
        const nu = N.group(g); N.el('circle', { cx: 410, cy: y - 14, r: 30, fill: 'none', stroke: 'currentColor', 'stroke-width': 3.5 }, nu);
        texto(nu, f.n, 410, y - 2, { anchor: 'middle', size: 34, peso: 800, fill: 'currentColor' });
        pop(s, nu, t0, null, 410, y - 14, { k0: .6 }); tinte(s, nu, t => win(t, t0, t1, .2, .4), C.suave);
        const L = linea(g, f.p, 475, y, { size: 42, peso: 800, izq: true });
        L.forEach((w_, j) => { aparece(s, w_, f.ts[Math.min(j, f.ts.length - 1)], null, { dy: 6 }); tinte(s, w_, t => win(t, t0, t1, .2, .4)); });
      });
    });
  }

  // ================================================================ O · ocho casillas: la que se añade va tras el puente (IV – V7 – I en B)
  function escenaOcho() {
    const a = F0('O1') - 0.2, b = F0('T1') - 0.2;
    escena('ocho', a, b, (s, g) => {
      s.on(t => opa(g, win(t, a, b, .35, .4)));
      const CFo = N.group(g), CSi = N.group(g), CCo = N.group(g), CCa = N.group(g), CTx = N.group(g);
      const tCosa = Wd('O1', 'olvidado') - 0.2, tSie = Wd('O1', 'siete') - 0.2, tOcho = Wd('O1', 'ocho') - 0.15;
      const tAna = Wd('O1', 'anadimos') - 0.2, tPue = Wd('O1', 'puente') - 0.2;
      const tLug = Wd('O2', 'lugar') - 0.2, tQP = Wd('O2', 'quinto') - 0.2, tIVo = Wd('O2', 'cuarto') - 0.1, tVo = Wd('O2', 'quinto', 2) - 0.1, tIo = Wd('O2', 'primero') - 0.1;
      const OCHO = [
        CAD[0], CAD[1], CAD[2], CAD[3],
        { cif: 'E−', gA: 'III', gB: 'VI', notas: ['E3', 'G3', 'E4', 'B4'] },
        { cif: 'C', gB: 'IV', notas: ['C3', 'G3', 'E4', 'C5'], nueva: true },
        { cif: 'D7', gB: 'V7', notas: ['D3', 'F#3', 'D4', 'C5'], antes: ['D3', 'A3', 'F#4', 'C5'], tc: tVo },
        { cif: 'G', gB: 'I', notas: ['G2', 'G3', 'D4', 'B4'], antes: ['G2', 'G3', 'G4', 'B4'], tc: tIo },
      ];
      const X7 = [0, 1, 2, 3, 4, null, 5, 6].map(j => j == null ? null : COLS7[j]);
      const X8 = [445, 593, 741, 889, 1037, 1185, 1333, 1481];
      const kM = t => ease(ramp(t, tAna, tAna + 1.0));
      const SI = N.group(CSi), sis = sistema(SI, GEO.sx, GEO.yS, GEO.sw, { sep: 9 * SP });
      aparece(s, SI, a + 0.1, null, { dy: 0 });
      const LZ = OCHO.map((_, j) => flash('SON_OCHO', j));
      const BA = N.group(CFo), ba = banda(BA, 166, GEO.yG - 12, GEO.yRB + 24);
      const cols = OCHO.map((ac, f) => {
        const c = columna(CCa, CCo, f, ac, sis, { x: X8[f], num: f >= 6 ? f : f + 1 });
        if (ac.antes) { c.old = acordeSATB(c.CA, ac.antes, sis); }
        if (f >= 6) {       // número de la casilla: 6 → 7 y 7 → 8 al entrar la nueva
          const n2 = N.group(c.cas.num); texto(n2, String(f + 1), -GEO.bw / 2 + 13, GEO.yG + 25, { size: 19, peso: 800, fill: 'currentColor' });
          const n1 = c.cas.num.firstChild;
          s.on(t => { const k = ease(ramp(t, tAna + 0.4, tAna + 0.8)); opa(n1, 1 - k); opa(n2, k); });
        }
        return c;
      });
      const tagP = etiquetaPuente(s, cols[4], a - 1);
      // posiciones: de 7 a 8 columnas (las dos últimas se apartan y la nueva entra tras el puente)
      s.on(t => {
        const k = kM(t);
        cols.forEach((c, f) => {
          const x = f === 5 ? X8[5] : lerp(X7[f], X8[f], k);
          c.CB.setAttribute('transform', `translate(${x.toFixed(1)},0)`); c.CA.setAttribute('transform', `translate(${x.toFixed(1)},0)`);
          const w = lerp(GEO.bw, 128, k); c.cas.rect.setAttribute('x', (-w / 2).toFixed(1)); c.cas.rect.setAttribute('width', w.toFixed(1));
          c.cas.num.setAttribute('transform', `translate(${((GEO.bw - w) / 2).toFixed(1)},0)`);
          if (f === 4) {
            BA.setAttribute('transform', `translate(${x.toFixed(1)},0)`); const wb = lerp(166, 146, k); ba._r.setAttribute('x', (-wb / 2).toFixed(1)); ba._r.setAttribute('width', wb.toFixed(1));
            tagP.firstChild.setAttribute('transform', `translate(${((GEO.bw - w) / 2).toFixed(1)},0)`);
          }
        });
      });
      // casillas: todas a la vista (el ejemplo del libro), la nueva aparece vacía (con «+») al apartarse las otras
      cols.forEach((c, f) => {
        if (f === 5) {
          pop(s, c.cas.g, tAna + 0.5, null, 0, GEO.yG + GEO.hG / 2, { k0: .5 });
          marcoEn(s, c.cas, maxK([enRosa([[tAna + 0.5, tIVo + 1.2]]), LZ[f]]));
          animaCifra(s, c, tIVo, null, [[tIVo, tIVo + 1.2]], [LZ[f]]);
          const MAS = N.group(c.CB); color(MAS, C.rosa); texto(MAS, '+', 0, GEO.yG + 76, { anchor: 'middle', size: 60, peso: 700, fill: 'currentColor' });
          s.on(t => opa(MAS, win(t, tAna + 0.6, tIVo + 0.1, .3, .25)));
          animaAcorde(s, c.acd, { tAp: tIVo, luz: [LZ[f]] });
          animaGrado(s, c.GBw, c.gB, GEO.yRB, tIVo, null, [[tIVo, tIVo + 1.0]]);
          return;
        }
        pop(s, c.cas.g, a + 0.15, null, 0, GEO.yG + GEO.hG / 2, { k0: .9 });
        const rm = f === 4 ? [[tPue, tPue + 1.4]] : (f >= 6 ? [[tQP, tQP + 1.6], [f === 6 ? tVo : tIo, (f === 6 ? tVo : tIo) + 0.8]] : []);
        marcoEn(s, c.cas, maxK([enRosa(rm), LZ[f]]));
        aparece(s, c.SYw, a + 0.15, null, { dy: 0 });
        s.on(t => color(c.sym.g, mezcla(C.blanco, C.rosa, Math.max(ventanas(t, rm, .1, .35), LZ[f](t)))));
        animaGrado(s, c.GAw, c.gA, GEO.yRA, null, null, []);
        animaGrado(s, c.GBw, c.gB, GEO.yRB, null, null, rm);
        aparece(s, c.GAw, a + 0.15, null, { dy: 0 }); aparece(s, c.GBw, a + 0.15, null, { dy: 0 });
        if (!c.old) { animaAcorde(s, c.acd, { luz: [LZ[f]], fresco: false }); aparece(s, c.acd.g, a + 0.15, null, { dy: 0 }); return; }
        // D7 y G: la conducción cambia (voces que se mueven a su sitio nuevo)
        animaAcorde(s, c.acd, { luz: [LZ[f]], fresco: false, rosa: [[OCHO[f].tc, OCHO[f].tc + 0.9]] });
        animaAcorde(s, c.old, { fresco: false });
        aparece(s, c.acd.g, a + 0.15, null, { dy: 0 }); aparece(s, c.old.g, a + 0.15, null, { dy: 0 });
        c.acd.v.forEach((v, i) => {
          const vo = c.old.v[i], tc = OCHO[f].tc;
          if (OCHO[f].notas[i] === OCHO[f].antes[i]) { opa(vo.o, 0); return; }
          const dy = vo.y - v.y;
          s.on(t => {
            const kk = ease(ramp(t, tc, tc + 0.5));
            v.o.setAttribute('transform', `translate(0,${(dy * (1 - kk)).toFixed(1)})`); opa(v.o, kk);
            vo.o.setAttribute('transform', `translate(0,${(-dy * kk).toFixed(1)})`); opa(vo.o, 1 - kk);
          });
        });
      });
      mostrarEn(s, ba, a + 0.15, null, .3);
      chipViajero(s, CTx, 'Do M', null, { tIn: a + 0.15, kf: [[0, GEO.xLab, GEO.yRA - 12, 0.8]] });
      chipViajero(s, CTx, 'Sol M', null, { tIn: a + 0.15, kf: [[0, GEO.xLab, GEO.yRB - 12, 0.8]] });
      // arriba: «una cosa más» → «7 casillas → 8 casillas»
      const kc = N.group(CTx); chip(kc, 'UNA COSA MÁS', CX, 125, { size: 30, anchor: 'middle' });
      pop(s, kc, tCosa, tSie, CX, 125);
      lineaEn(s, CTx, [[['7 casillas', C.blanco]], [['→', C.suave]], [['8 casillas', C.rosa]]], CX, 140, [tSie, tOcho, tOcho], null, { size: 40, peso: 800 });
      lineaEn(s, CTx, [[['la nueva:', C.blanco]], [['tras el puente', C.rosa]]], CX, 1000 - 38, [tAna + 0.3, tPue], tLug - 0.05, { size: 38, peso: 800 });
      lineaEn(s, CTx, [[['en lugar de', C.suave]], [['V7 – I', C.blanco]], [['→', C.suave]], [['IV – V7 – I', C.rosa]]], CX, GEO.yCap, [tLug, tQP, tIVo - 0.1, tIVo], null, { size: 38, peso: 800 });
      oido(s, CTx, OIDO[0], OIDO[1], ['SON_OCHO']);
    });
  }

  // ================================================================ T · el truco del IV (mismo modo que la tónica) · las quintas, Mayores y con 7.ª
  function escenaTruco() {
    const a = F0('T1') - 0.2, b = F0('Z1') - 0.2;
    escena('truco', a, b, (s, g) => {
      s.on(t => opa(g, win(t, a, b, .35, .4)));
      const tTr = F0('T1') - 0.05, tIV = Wd('T1', 'cuarto') - 0.2, tMis = Wd('T1', 'mismo') - 0.2, tTon = Wd('T1', 'tonica') - 0.2;
      const tDm = Wd('T2', 'do') - 0.2, tFm = Wd('T2', 'fa') - 0.15, tT3 = F0('T3') - 0.1, tDM = Wd('T3', 'do') - 0.2, tFM = Wd('T3', 'fa') - 0.15;
      const tT4 = F0('T4') - 0.1, tCom = Wd('T4', 'comprobar') - 0.2, tArm = Wd('T4', 'armadura') - 0.1, tAta = Wd('T4', 'pequeno') - 0.2;
      const tQui = Wd('T5', 'quintas') - 0.2, tQ5 = Wd('T5', 'quinto') - 0.15, tMay = Wd('T5', 'mayor') - 0.1, tSep = Wd('T5', 'septima') - 0.1;
      const k = N.group(g); chip(k, 'ÚLTIMO TRUCO', CX, 118, { size: 32, anchor: 'middle' });
      pop(s, k, tTr, null, CX, 118);
      // la regla: grande en el centro mientras la dice; sube a su sitio cuando llegan los ejemplos
      const FO = N.group(g);
      lineaEn(s, FO, [[['IV', C.rosa]], [['→ del mismo modo que la', C.blanco]], [['tónica', C.rosa]]], CX, 0, [tIV, tMis, tTon], null, { size: 42, peso: 800 });
      s.on(t => { const kk = ease(ramp(t, tDm - 0.3, tDm + 0.5)), y_ = lerp(520, 205, kk), sc = lerp(1.3, 1, kk); FO.setAttribute('transform', `translate(${CX},${y_.toFixed(1)}) scale(${sc.toFixed(4)}) translate(${-CX},0)`); });
      const da = fraseG(g, [['da igual en qué tonalidad estés', C.suave]], CX, 620, { size: 36, peso: 700, italic: true, anchor: 'middle' });
      aparece(s, da, Wd('T1', 'da') - 0.2, tDm - 0.1, { dy: 6 });
      // dos sistemas: Do m (3♭) y Do M; en cada uno I – IV (y luego V7)
      const SIS = [
        { sx: 248, cols: [510, 650, 790], ton: 'Do m', arm: { B: 'b', E: 'b', A: 'b' }, n: 3, ac: [['C−', 'I', ['C3', 'G3', 'Eb4', 'C5']], ['F−', 'IV', ['F2', 'Ab3', 'F4', 'C5']], ['G7', 'V7', ['G2', 'G3', 'F4', 'B4']]], ts: [tDm + 0.3, tFm, tQ5], blq: 'SON_IVMEN', tIn: tDm, ten: [[tT3, F1('SON_IVMAY') + 0.1]] },
        { sx: 1064, cols: [1326, 1466, 1606], ton: 'Do M', arm: null, n: 0, ac: [['C', 'I', ['C3', 'G3', 'E4', 'C5']], ['F', 'IV', ['F2', 'A3', 'F4', 'C5']], ['G7', 'V7', ['G2', 'G3', 'F4', 'B4']]], ts: [tDM + 0.3, tFM, tQ5], blq: 'SON_IVMAY', tIn: tDM, ten: [] },
      ];
      const yS = 460;
      SIS.forEach((d, i) => {
        const G = N.group(g); s.on(t => opa(G, win(t, d.tIn, b + 1, .4, .3) * (1 - 0.62 * ventanas(t, d.ten, .3, .3))));
        const SI = N.group(G), sis = sistema(SI, d.sx, yS, 644, { sep: 9 * SP });
        const AR = d.n ? armaduraSis(SI, sis, sis.x0 + 4, d.n, 'b') : null;
        if (AR) tinte(s, AR.g, enRosa([[tArm, tArm + 1.8]]));
        chipViajero(s, G, d.ton, null, { tIn: d.tIn, kf: [[0, (d.sx + d.sx + 644) / 2, 285, 1]], rosa: [[d.tIn, d.tIn + 1.4]] });
        d.ac.forEach(([cif, gr, notas], j) => {
          const CA = N.group(G); CA.setAttribute('transform', `translate(${d.cols[j]},0)`);
          const t0 = d.ts[j], luz = j < 2 ? [flash(d.blq, j)] : [];
          const acd = acordeSATB(CA, notas, sis, d.arm);
          const alt7 = j === 2 && i === 0 ? [[tMay, b + 1]] : [];      // el Si♮ (sensible) de Do m: Mayor
          animaAcorde(s, acd, { tAp: t0, luz, voz: [[], [], [], alt7], fresco: j === 1 ? 1.4 : 0.9 });
          const SYw = N.group(CA), sym = cifraG(SYw, cif, 0, yS - 2 * SP - 40, 42);
          escribe(s, SYw, sym.x0 - 6, yS - 2 * SP - 80, yS - 2 * SP - 20, [[t0, sym.x0 + sym.w + 6, 0.4]]);
          tinte(s, sym.g, maxK([enRosa([[t0, t0 + (j === 1 ? 1.4 : 0.9)]])].concat(luz)));
          const GW = N.group(CA), grd = gradoG(GW, gr, 0, sis.yF + 2 * SP + 64, 34);
          escribe(s, GW, grd.x0 - 6, sis.yF + 2 * SP + 30, sis.yF + 2 * SP + 76, [[t0, grd.x0 + grd.w + 6, 0.35]]);
          tinte(s, grd.g, enRosa([[t0, t0 + (j === 1 ? 1.4 : 0.9)]]));
        });
      });
      const oC = { size: 38, peso: 800 };
      lineaEn(s, g, [[['Do m', C.blanco]], [['→ IV =', C.suave]], [['Fa m', C.rosa]]], CX, 920, [tDm, tFm - 0.1, tFm], tT3, oC);
      lineaEn(s, g, [[['Do M', C.blanco]], [['→ IV =', C.suave]], [['Fa M', C.rosa]]], CX, 920, [tDM, tFM - 0.1, tFM], tT4, oC);
      lineaEn(s, g, [[['compruébalo con la', C.blanco]], [['armadura', C.rosa]]], CX, 920, [tCom, tArm], tAta - 0.05, oC);
      lineaEn(s, g, [[['un pequeño', C.blanco]], [['atajo', C.rosa]]], CX, 920, [tAta, tAta + 0.2], tQui - 0.05, oC);
      lineaEn(s, g, [[['las quintas,', C.blanco]], [['sin pensar:', C.suave]]], CX, 920, [tQui, tQui + 0.5], tQ5 - 0.05, oC);
      lineaEn(s, g, [[['V', C.rosa]], [['=', C.suave]], [['Mayor', C.rosa]], [['y con', C.blanco]], [['7ª', C.rosa]]], CX, 920, [tQ5, tMay - 0.1, tMay, tSep - 0.1, tSep], null, oC);
      oido(s, g, CX, 580, ['SON_IVMEN', 'SON_IVMAY']);
    });
  }

  // ================================================================ Z · es normal que haya dudas: le dedicaremos más cariño
  function escenaDespedida() {
    const a = F0('Z1') - 0.2, b = T.acorde + 0.15;
    escena('despedida', a, b, (s, g) => {
      const fin = b - 0.3;
      s.on(t => opa(g, win(t, a, fin, .35, .45)));
      lineaEn(s, g, [[['es normal que haya', C.blanco]], [['dudas', C.rosa]]], CX, 420, [Wd('Z1', 'normal') - 0.3, Wd('Z1', 'dudas') - 0.2], null, { size: 50, peso: 800 });
      lineaEn(s, g, [[['un contenido', C.blanco]], [['totalmente nuevo', C.rosa]]], CX, 530, [Wd('Z1', 'contenido') - 0.3, Wd('Z1', 'totalmente') - 0.2], null, { size: 50, peso: 800 });
      lineaEn(s, g, [[['le vamos a dedicar', C.blanco]], [['más cariño', C.rosa]]], CX, 640, [Wd('Z1', 'dedicar') - 0.4, Wd('Z1', 'mas') - 0.2], null, { size: 50, peso: 800 });
      const H = N.group(g); color(H, C.rosa);
      N.el('path', { d: `M${CX},${800} C${CX - 60},${760} ${CX - 70},${700} ${CX - 30},${690} C${CX - 10},${686} ${CX},${700} ${CX},${712} C${CX},${700} ${CX + 10},${686} ${CX + 30},${690} C${CX + 70},${700} ${CX + 60},${760} ${CX},${800} Z`, fill: 'none', stroke: 'currentColor', 'stroke-width': 5, 'stroke-linejoin': 'round' }, H);
      pop(s, H, Wd('Z1', 'carino') - 0.2, null, CX, 745, { k0: .5 });
    });
  }

  const ORDEN = [escenaEjemplo, escenaAclaraciones, escenaSegundo, escenaPortal, escenaRepaso, escenaOcho, escenaTruco, escenaDespedida];

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
