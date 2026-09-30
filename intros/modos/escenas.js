/* =====================================================================
   ESCENAS · Modos (GP)
   Montado por pipe/escenas_build.py: utilidades comunes (_comun/) + escenas
   propias (modos/escenas_cuerpo.js). Todo es función pura de t.
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

  // ================================================================ P2 · MODOS (GP)
  const TITULO = { kicker: 'GRADO PROFESIONAL  ·  TEORÍA', lineas: ['MODOS'], sub: 'Familia · Armadura · Nota característica' };

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
          const gl = ALT_GL[tr], bem = tr === '♭', pegada = /[A-Za-zÁÉÍÓÚáéíóúñÑ0-9]$/.test(prev);
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
  /** Los tres pasos arriba (el que toca, en rosa). */
  const PASOS = ['FAMILIA', 'ARMADURA', 'NOTA CARACTERÍSTICA'];
  function pasos(s, g, activo, y, tIn, fin) {
    const W = [300, 300, 440], gap = 26, tot = W.reduce((a, b) => a + b, 0) + gap * 2;
    let x = CX - tot / 2;
    PASOS.forEach((tit, i) => {
      const G = N.group(g), on = i === activo, w = W[i], h = 76;
      panel(G, x, y, w, h, { rx: 16, stroke: on ? C.rosa : '#3a4556', sw: on ? 3 : 1.5 });
      const num = N.group(G); color(num, on ? C.rosa : C.suave);
      N.el('circle', { cx: x + 40, cy: y + h / 2, r: 21, fill: 'none', stroke: 'currentColor', 'stroke-width': 3 }, num);
      texto(num, String(i + 1), x + 40, y + h / 2 + 9, { anchor: 'middle', size: 25, peso: 800, fill: 'currentColor' });
      texto(G, tit, x + 76, y + h / 2 + 8, { size: 22, peso: 800, ls: '0.08em', fill: on ? C.blanco : C.suave });
      aparece(s, G, tIn + i * 0.1, fin, { dy: 8 });
      x += w + gap;
    });
  }
  /** Receta paso a paso (a la derecha): filas numeradas que aparecen cuando se dicen. */
  function receta(s, g, x, y, filas, fin) {
    const P = N.group(g); panel(P, x, y, 520, 60 + filas.length * 86, { rx: 22 });
    aparece(s, P, filas[0].t - 0.3, fin, { dy: 8 });
    filas.forEach((f, i) => {
      const G = N.group(g), yy = y + 70 + i * 86;
      const num = N.group(G); color(num, C.rosa);
      N.el('circle', { cx: x + 48, cy: yy - 10, r: 20, fill: 'none', stroke: 'currentColor', 'stroke-width': 3 }, num);
      texto(num, String(i + 1), x + 48, yy - 1, { anchor: 'middle', size: 23, peso: 800, fill: 'currentColor' });
      frase(G, f.segs, x + 86, yy, { size: 32, peso: 800 });
      aparece(s, G, f.t, fin, { dy: 6 });
    });
  }
  /** Escala de Re en su pentagrama con armadura: notas (redondas) + grados debajo. Devuelve {notas:[{g, cx, y}], grados:[g]}. */
  function escalaRe(s, g, x, yM, ancho, nArm, tipoArm, notas, t0, fin, destacar) {
    const PE = N.group(g); aparece(s, PE, t0 - 0.2, fin, { dy: 0 });
    const A = pentaArm(PE, x, yM, ancho, nArm, tipoArm);
    const x0 = A.xLibre + 40, paso = (x + ancho - x0 - 60) / (notas.length - 1);
    const out = [], grados = [];
    notas.forEach((n, i) => {
      const W = N.group(g), xn = x0 + i * paso;
      const r = N.redonda(W, n, xn, yM, SP);
      out.push({ g: W, cx: xn + r.w / 2, y: r.y, alt: r.alt });
      pop(s, W, t0 + i * 0.07, fin, xn + r.w / 2, r.y, { k0: .5 });
      const gr = N.group(g); const esD = destacar.includes(i + 1);
      texto(gr, String(i + 1), xn + r.w / 2, yM + 5.2 * SP, { anchor: 'middle', size: 30, peso: 800, fill: 'currentColor' });
      color(gr, esD ? C.rosa : C.suave); aparece(s, gr, t0 + 0.3 + i * 0.05, fin, { dy: 4 });
      grados.push(gr);
    });
    return { notas: out, grados, A, arm: A.A };
  }
  /** Las notas se encienden al sonar (S[blq] = una marca por nota). */
  function suenaEscala(s, notas, blq, destacadas) {
    const ts = S[blq] || []; if (!ts.length) return;
    notas.forEach((n, i) => {
      if (ts[i] == null) return;
      const base = (destacadas || []).includes(i + 1) ? C.rosa : C.blanco;
      s.on(t => { if (t >= ts[0] - 0.1) color(n.g, mezcla(base, i ? C.rosa : C.rosa, Math.max(win(t, ts[i] - 0.03, ts[i] + 0.4, .04, .2), base === C.rosa ? 1 : 0))); });
    });
  }

  // ================================================================ I · los modos: escalas con carácter · sobre Re · tres pasos
  const MODOS7 = ['jónico', 'dórico', 'frigio', 'lidio', 'mixolidio', 'eólico', 'locrio'];
  function escenaIntro() {
    const a = F0('I1') - 0.1, b = F0('P1') - 0.2;
    escena('intro', a, b, (s, g) => {
      const fin = b - 0.3;
      const k = N.group(g); chip(k, 'MODOS', CX, 160, { size: 40, anchor: 'middle' });
      pop(s, k, Wd('I1', 'modos') - 0.2, fin, CX, 160);
      const es = fraseG(g, [['son ', C.suave], ['escalas', C.rosa], [': combinaciones de ', C.suave], ['tonos', C.blanco], [' y ', C.suave], ['semitonos', C.blanco]], CX, 262, { size: 38, peso: 800, anchor: 'middle' });
      aparece(s, es, Wd('I1', 'escalas') - 0.2, fin, { dy: 8 });
      // I2 · muy antiguos… y hoy: jazz, cine, videojuegos
      const an = fraseG(g, [['muy antiguos, ', C.blanco], ['reinterpretados', C.rosa]], CX, 360, { size: 34, peso: 700, italic: true, anchor: 'middle' });
      aparece(s, an, Wd('I2', 'antiguos') - 0.2, fin, { dy: 6 });
      [['jazz', 690], ['cine', 960], ['videojuegos', 1230]].forEach(([w, x]) => {
        const G = N.group(g); chip(G, w.toUpperCase(), x, 440, { size: 24, anchor: 'middle', relleno: false });
        pop(s, G, Wd('I2', w) - 0.15, fin, x, 440);
      });
      // I3 · cada uno, su carácter: las siete tarjetas
      const tCa = Wd('I3', 'caracter') - 0.3, wT = 214, gT = 16, x0 = CX - (7 * wT + 6 * gT) / 2;
      MODOS7.forEach((m, i) => {
        const x = x0 + i * (wT + gT), G = N.group(g);
        const r = panel(G, x, 560, wT, 96, { rx: 18 });
        texto(G, m, x + wT / 2, 618, { anchor: 'middle', size: 30, peso: 800, italic: true, fill: C.blanco });
        pop(s, G, tCa + i * 0.12, fin, x + wT / 2, 608);
        const tu = Wd('I3', 'triste') + 0.1 + i * 0.1;
        s.on(t => { const kk = win(t, tu, tu + 0.9, .2, .5); r.setAttribute('stroke', mezcla('#3a4556', C.rosa, kk)); r.setAttribute('stroke-width', (1.5 + 2 * kk).toFixed(2)); });
      });
      const ta = fraseG(g, [['no todo es ', C.suave], ['triste', C.blanco], [' o ', C.suave], ['alegre', C.blanco]], CX, 740, { size: 36, peso: 800, anchor: 'middle' });
      aparece(s, ta, Wd('I3', 'triste') - 0.4, fin, { dy: 6 });
      // I4 · sobre Re · tres pasos
      const re = fraseG(g, [['en el libro, todos sobre ', C.suave], ['Re', C.rosa]], CX, 840, { size: 38, peso: 800, anchor: 'middle' });
      aparece(s, re, Wd('I4', 're') - 0.25, fin, { dy: 6 });
      const tp = fraseG(g, [['un método de ', C.suave], ['3 pasos', C.rosa]], CX, 910, { size: 38, peso: 800, anchor: 'middle' });
      aparece(s, tp, Wd('I4', 'metodo') - 0.2, fin, { dy: 6 });
    });
  }

  // ================================================================ P · paso 1: la familia (Mayor o menor)
  function escenaFamilias() {
    const a = F0('P1') - 0.2, b = F0('Q1') - 0.2;
    escena('familias', a, b, (s, g) => {
      const fin = b - 0.3;
      pasos(s, g, 0, 130, a + 0.1, fin);
      const col = (x, tit, t) => {
        const G = N.group(g); panel(G, x, 300, 560, 520, { rx: 24 });
        texto(G, tit[0], x + 280, 372, { anchor: 'middle', size: 30, peso: 800, ls: '0.1em', fill: C.suave });
        texto(G, tit[1], x + 280, 430, { anchor: 'middle', size: 52, peso: 800, fill: C.rosa });
        aparece(s, G, t, fin, { dy: 10 });
      };
      col(360, ['FAMILIA', 'Mayor'], Wd('P1', 'mayor') - 0.3);
      col(1000, ['FAMILIA', 'menor'], Wd('P1', 'menor') - 0.3);
      [['jónico', 'jonico'], ['lidio', 'lidio'], ['mixolidio', 'mixolidio']].forEach(([m, w], i) => {
        const G = N.group(g); texto(G, m, 640, 530 + i * 80, { anchor: 'middle', size: 44, peso: 800, italic: true, fill: C.blanco });
        aparece(s, G, Wd('P2', w) - 0.15, fin, { dy: 8 });
      });
      [['dórico', 'dorico'], ['frigio', 'frigio'], ['eólico', 'eolico']].forEach(([m, w], i) => {
        const G = N.group(g); texto(G, m, 1280, 530 + i * 80, { anchor: 'middle', size: 44, peso: 800, italic: true, fill: C.blanco });
        aparece(s, G, Wd('P3', w) - 0.15, fin, { dy: 8 });
      });
      const lo = fraseG(g, [['locrio', C.suave], ['  (luego)', C.suave]], 1280, 770, { size: 36, peso: 800, italic: true, anchor: 'middle' });
      aparece(s, lo, Wd('P4', 'locrio') - 0.2, fin, { dy: 8 });
    });
  }

  // ================================================================ Q · paso 2: la armadura de la tonalidad Mayor o menor
  function escenaArmadura() {
    const a = F0('Q1') - 0.2, b = F0('R1') - 0.2;
    escena('armadura', a, b, (s, g) => {
      const fin = b - 0.3;
      pasos(s, g, 1, 130, a + 0.1, fin);
      const ar = fraseG(g, [['armadura de la tonalidad ', C.blanco], ['Mayor o menor', C.rosa], [' de esa nota', C.blanco]], CX, 300, { size: 38, peso: 800, anchor: 'middle' });
      aparece(s, ar, Wd('Q1', 'armadura') - 0.2, fin, { dy: 8 });
      // Re dórico → familia menor → Re m → 1♭
      const y = 440;
      const c1 = N.group(g); chip(c1, 'Re dórico', 520, y, { size: 34, anchor: 'middle', relleno: false, ls: '0.02em' });
      pop(s, c1, Wd('Q2', 'dorico') - 0.2, fin, 520, y);
      const f1 = N.group(g); color(f1, C.suave); flecha(f1, 650, y, 770, y, { w: 4, cab: 14 }); mostrarEn(s, f1, Wd('Q2', 'familia') - 0.2, fin);
      const c2 = fraseG(g, [['familia ', C.suave], ['menor', C.rosa]], 900, y + 13, { size: 36, peso: 800, anchor: 'middle' });
      aparece(s, c2, Wd('Q2', 'familia') - 0.1, fin, { dy: 6 });
      const f2 = N.group(g); color(f2, C.suave); flecha(f2, 1040, y, 1160, y, { w: 4, cab: 14 }); mostrarEn(s, f2, Wd('Q2', 'armadura') - 0.2, fin);
      const c3 = N.group(g); chipTon(c3, 'D', 'menor', 1290, y, { size: 34 });
      pop(s, c3, Wd('Q2', 're', 2) - 0.2, fin, 1290, y);
      // el pentagrama con la armadura de Re menor: un bemol
      const yM = 690, PE = N.group(g);
      aparece(s, PE, Wd('Q2', 'armadura') - 0.1, fin, { dy: 0 });
      const A = pentaArm(PE, 700, yM, 520, 1, 'b');
      A.A.items.forEach(it => { color(it.g, C.rosa); pop(s, it.g, Wd('Q2', 'bemol') - 0.2, fin, it.x + 10, yM - it.pos * SP, { k0: .3 }); });
      const ub = fraseG(g, [['1♭', C.rosa]], 1320, yM + 14, { size: 48, peso: 800 });
      aparece(s, ub, Wd('Q2', 'bemol') - 0.1, fin, { dy: 6 });
    });
  }

  // ================================================================ R · paso 3: la nota característica (y la chuleta de los siete)
  // (30-sep-2026, Iago) «prefiero que los ordenes así: jónico, dórico, frigio, lidio, mixolidio, eólico, locrio»
  // (antes, por familias: jónico, lidio, mixolidio, eólico, dórico, frigio, locrio)
  const CHULETA = [
    { m: 'jónico', f: 'Mayor', n: [['—', C.suave]] },
    { m: 'dórico', f: 'menor', n: [['6ª ', C.blanco], ['↑', C.rosa]] },
    { m: 'frigio', f: 'menor', n: [['2ª ', C.blanco], ['↓', C.rosa]] },
    { m: 'lidio', f: 'Mayor', n: [['4ª ', C.blanco], ['↑', C.rosa]] },
    { m: 'mixolidio', f: 'Mayor', n: [['7ª ', C.blanco], ['↓', C.rosa]] },
    { m: 'eólico', f: 'menor', n: [['—', C.suave]] },
    { m: 'locrio', f: 'menor', n: [['2ª ', C.blanco], ['↓', C.rosa], ['  y  ', C.suave], ['5ª ', C.blanco], ['↓', C.rosa]] },
  ];
  function escenaNota() {
    const a = F0('R1') - 0.2, b = F0('E1') - 0.2;
    escena('nota', a, b, (s, g) => {
      const fin = b - 0.3;
      pasos(s, g, 2, 130, a + 0.1, fin);
      const de = fraseG(g, [['la que lo hace ', C.suave], ['distinto', C.rosa], [' de su escala Mayor o menor', C.suave]], CX, 290, { size: 34, peso: 800, anchor: 'middle' });
      aparece(s, de, Wd('R1', 'distinto') - 0.2, fin, { dy: 8 });
      // la chuleta: modo · 1 familia · 2 nota característica
      const x0 = 470, yT = 360, wT = 980, fH = 64;
      const P = N.group(g); panel(P, x0, yT, wT, 90 + CHULETA.length * fH, { rx: 22 });
      aparece(s, P, Wd('R2', 'dos') - 0.3, fin, { dy: 10 });
      const tTi = Wd('R2', 'tipo') - 0.2, tNo = Wd('R2', 'nota') - 0.2;
      const cab = (txt, x, t, anchor) => { const G = N.group(g); texto(G, txt, x, yT + 58, { anchor: anchor || 'middle', size: 22, peso: 800, ls: '0.12em', fill: 'currentColor' }); color(G, C.suave); aparece(s, G, Wd('R2', 'dos') - 0.1, fin, { dy: 4 }); return G; };
      cab('MODO', x0 + 60, 0, 'start');
      const hF = cab('1 · FAMILIA', x0 + 470), hN = cab('2 · NOTA CARACTERÍSTICA', x0 + 790);
      s.on(t => { color(hF, mezcla(C.suave, C.rosa, win(t, tTi, tNo - 0.1, .3, .3))); color(hN, mezcla(C.suave, C.rosa, win(t, tNo, fin + 1, .3, .3))); });
      CHULETA.forEach((c, i) => {
        const y = yT + 120 + i * fH, G = N.group(g);
        texto(G, c.m, x0 + 60, y, { size: 34, peso: 800, italic: true, fill: C.blanco });
        const fam = N.group(G); texto(fam, c.f, x0 + 470, y, { anchor: 'middle', size: 32, peso: 800, fill: 'currentColor' });
        const nc = N.group(G); frase(nc, c.n, x0 + 790, y, { size: 32, peso: 800, anchor: 'middle' });
        s.on(t => { color(fam, mezcla(C.blanco, C.rosa, win(t, tTi + i * 0.05, tNo - 0.1, .3, .3))); opa(nc, 0.35 + 0.65 * ease(ramp(t, tNo + i * 0.06, tNo + 0.3 + i * 0.06))); });
        aparece(s, G, Wd('R2', 'dos') + i * 0.08, fin, { dy: 6 });
      });
    });
  }

  // ================================================================ E · Re dórico: menor con la 6ª subida (Si♮)
  function escenaDorico() {
    const a = F0('E1') - 0.2, b = F0('E4') - 0.2;
    escena('dorico', a, b, (s, g) => {
      const fin = b - 0.3;
      const k = N.group(g); chip(k, 'Re dórico', CX, 150, { size: 38, anchor: 'middle', ls: '0.02em' });
      pop(s, k, Wd('E1', 'dorico') - 0.2, fin, CX, 150);
      const yM = 470, tE = Wd('E2', 're') - 0.1;
      const E = escalaRe(s, g, 170, yM, 1000, 1, 'b', ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5'], tE, fin, [6]);
      const si = E.notas[5];
      // el Si: primero bemol por la armadura, luego con becuadro
      const tSi = Wd('E3', 'si', 1) - 0.15, tBe = Wd('E3', 'bemol') - 0.2, tBc = Wd('E3', 'becuadro') - 0.2;
      s.on(t => { if (t < (S.SON_DOR_ESC || [1e9])[0] - 0.1) color(si.g, mezcla(C.blanco, C.rosa, ease(ramp(t, tSi, tSi + 0.3)))); });
      E.arm.items.forEach(it => s.on(t => color(it.g, mezcla(C.blanco, C.rosa, win(t, tBe, tBc, .25, .3)))));
      const bec = N.group(g); color(bec, C.rosa); N.glyph(bec, 'accidentalNatural', si.cx - 22 - (N.M.accidentalNatural.adv + 0.22) * SP, si.y, SP);
      pop(s, bec, tBc, fin, si.cx - 30, si.y, { k0: .3 });
      const lb = fraseG(g, [['Si♭', C.suave], [' → ', C.suave], ['Si♮', C.rosa]], si.cx, yM - 4.2 * SP, { size: 34, peso: 800, anchor: 'middle' });
      aparece(s, lb, tBc, fin, { dy: 6 });
      receta(s, g, 1250, 300, [
        { segs: [['familia ', C.suave], ['menor', C.blanco]], t: Wd('E2', 'menor') - 0.2 },
        { segs: [['armadura: ', C.suave], ['1♭', C.blanco], [' (Re m)', C.suave]], t: Wd('E3', 'armadura') - 0.2 },
        { segs: [['6ª ', C.blanco], ['↑', C.rosa], ['  →  ', C.suave], ['Si♮', C.rosa]], t: Wd('E3', 'subirlo') - 0.2 },
      ], fin);
      suenaEscala(s, E.notas, 'SON_DOR_ESC', [6]);
      oido(s, g, CX - 300, yM + 290, ['SON_DOR_ESC']);
    });
  }

  // ================================================================ E4 · Re lidio: Mayor con la 4ª subida (Sol♯)
  function escenaLidio() {
    const a = F0('E4') - 0.2, b = F0('L1') - 0.2;
    escena('lidio', a, b, (s, g) => {
      const fin = b - 0.3;
      const k = N.group(g); chip(k, 'Re lidio', CX, 150, { size: 38, anchor: 'middle', ls: '0.02em' });
      pop(s, k, Wd('E4', 'lidio') - 0.2, fin, CX, 150);
      const yM = 470, tAr = Wd('E4', 'armadura') - 0.2, tSo = Wd('E4', 'sostenido') - 0.25;
      const E = escalaRe(s, g, 170, yM, 1000, 2, '#', ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5'], tAr, fin, [4]);
      const sol = E.notas[3];
      const sos = N.group(g); color(sos, C.rosa); N.glyph(sos, 'accidentalSharp', sol.cx - 22 - (N.M.accidentalSharp.adv + 0.22) * SP, sol.y, SP);
      pop(s, sos, tSo, fin, sol.cx - 30, sol.y, { k0: .3 });
      s.on(t => { if (t < (S.SON_LID_ESC || [1e9])[0] - 0.1) color(sol.g, mezcla(C.blanco, C.rosa, ease(ramp(t, Wd('E4', 'cuarto') - 0.1, Wd('E4', 'cuarto') + 0.3)))); });
      const lb = fraseG(g, [['Sol', C.suave], [' → ', C.suave], ['Sol♯', C.rosa]], sol.cx, yM - 4.2 * SP, { size: 34, peso: 800, anchor: 'middle' });
      aparece(s, lb, tSo, fin, { dy: 6 });
      receta(s, g, 1250, 300, [
        { segs: [['familia ', C.suave], ['Mayor', C.blanco]], t: Wd('E4', 'mayor', 1) - 0.2 },
        { segs: [['armadura: ', C.suave], ['2♯', C.blanco], [' (Re M)', C.suave]], t: tAr },
        { segs: [['4ª ', C.blanco], ['↑', C.rosa], ['  →  ', C.suave], ['Sol♯', C.rosa]], t: Wd('E4', 'caracteristica') - 0.2 },
      ], fin);
      suenaEscala(s, E.notas, 'SON_LID_ESC', [4]);
      oido(s, g, CX - 300, yM + 290, ['SON_LID_ESC']);
    });
  }

  // ================================================================ L · Re locrio: menor con la 2ª y la 5ª bajadas (Mi♭, La♭)
  function escenaLocrio() {
    const a = F0('L1') - 0.2, b = F0('T1') - 0.2;
    escena('locrio', a, b, (s, g) => {
      const fin = b - 0.3;
      const k = N.group(g); chip(k, 'Re locrio', CX, 150, { size: 38, anchor: 'middle', ls: '0.02em' });
      pop(s, k, Wd('L1', 'locrio') - 0.2, fin, CX, 150);
      const yM = 470, t0 = Wd('L1', 'menor', 1) - 0.2;
      const tSe = Wd('L1', 'segundo') - 0.2, tQu = Wd('L1', 'quinto', 2) - 0.2;
      const E = escalaRe(s, g, 170, yM, 1000, 1, 'b', ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5'], t0, fin, [2, 5]);
      [[E.notas[1], tSe], [E.notas[4], tQu]].forEach(([n, tt]) => {
        const G = N.group(g); color(G, C.rosa); N.glyph(G, 'accidentalFlat', n.cx - 22 - (N.M.accidentalFlat.adv + 0.22) * SP, n.y, SP);
        pop(s, G, tt, fin, n.cx - 30, n.y, { k0: .3 });
        s.on(t => { if (t < (S.SON_LOC_ESC || [1e9])[0] - 0.1) color(n.g, mezcla(C.blanco, C.rosa, ease(ramp(t, tt, tt + 0.3)))); });
      });
      // la 5ª disminuida: ni siquiera hay quinta justa
      const di = fraseG(g, [['5ª ', C.blanco], ['disminuida', C.rosa], [': sin 5ª justa', C.suave]], 670, yM + 250, { size: 34, peso: 800, anchor: 'middle' });
      aparece(s, di, Wd('L1', 'disminuido') - 0.2, Wd('L1', 'receta') - 0.2, { dy: 6 });
      receta(s, g, 1250, 300, [
        { segs: [['familia ', C.suave], ['menor', C.blanco]], t: Wd('L1', 'menor', 2) - 0.2 },
        { segs: [['2ª ', C.blanco], ['↓', C.rosa], ['  →  ', C.suave], ['Mi♭', C.rosa], ['  (como el frigio)', C.suave]], t: tSe },
        { segs: [['5ª ', C.blanco], ['↓', C.rosa], ['  →  ', C.suave], ['La♭', C.rosa]], t: tQu },
      ], fin);
      [['inestable', 'inestable', 520], ['tensión', 'tension', 830], ['cine de terror', 'terror', 1160]].forEach(([w, key, x]) => {
        const G = N.group(g); chip(G, w.toUpperCase(), x, yM + 330, { size: 24, anchor: 'middle', relleno: false });
        pop(s, G, Wd('L1', key) - 0.2, fin, x, yM + 330);
      });
      suenaEscala(s, E.notas, 'SON_LOC_ESC', [2, 5]);
      oido(s, g, 1490, 680, ['SON_LOC_ESC']);
    });
  }

  // ================================================================ T · en el portal: otras tónicas, el mismo método
  function escenaPortal() {
    const a = F0('T1') - 0.2, b = F0('S1') - 0.2;
    escena('portal', a, b, (s, g) => {
      const fin = b - 0.3;
      const k = N.group(g); chip(k, 'EN EL PORTAL', CX, 200, { size: 32, anchor: 'middle' });
      pop(s, k, Wd('T1', 'portal') - 0.2, fin, CX, 200);
      [['E', 'mixolidio'], ['G', 'dórico'], ['B', 'frigio'], ['F', 'lidio'], ['A', 'locrio']].forEach(([n, m], i) => {
        const x = 420 + i * 270, G = N.group(g);
        const sz = 34, NM = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' };
        chip(G, `${NM[n]} ${m}`, x, 420, { size: 28, anchor: 'middle', relleno: false, ls: '0.02em' });
        pop(s, G, Wd('T1', 'distintas') - 0.2 + i * 0.15, fin, x, 420);
      });
      const mi = fraseG(g, [['otras tónicas, ', C.suave], ['el mismo método', C.rosa]], CX, 560, { size: 42, peso: 800, anchor: 'middle' });
      aparece(s, mi, Wd('T1', 'metodo') - 0.3, fin, { dy: 8 });
      pasos(s, g, -1, 680, Wd('T1', 'metodo') - 0.1, fin);
    });
  }

  // ================================================================ S · lo que más importa: escúchalos (dórico · lidio · frigio)
  const COLORES = [
    { m: 'dórico', blq: 'SON_DOR', pal: [['nostalgia', 'nostalgia', 'S2'], ['misterio', 'misterio', 'S2'], ['Stranger Things', 'stranger', 'S2']], ac: [['Re m', C.blanco], ['  →  ', C.suave], ['Sol', C.blanco]] },
    { m: 'lidio', blq: 'SON_LID', pal: [['magia', 'magia', 'S3'], ['fantasía', 'fantasia', 'S3']], ac: [['Re', C.blanco], ['  →  ', C.suave], ['Mi', C.blanco]] },
    { m: 'frigio', blq: 'SON_FRI', pal: [['flamenco', 'flamenco', 'S4']], ac: [['Re m', C.blanco], ['  →  ', C.suave], ['Mi♭', C.blanco]] },
  ];
  function escenaEscucha() {
    const a = F0('S1') - 0.2, b = F0('F1') - 0.2;
    escena('escucha', a, b, (s, g) => {
      const fin = b - 0.3;
      const te = fraseG(g, [['la teoría, ', C.suave], ['muy bien', C.blanco], ['… pero', C.suave]], CX, 170, { size: 36, peso: 800, anchor: 'middle' });
      aparece(s, te, Wd('S1', 'teoria') - 0.3, Wd('S2', 'escucharlos'), { dy: 6 });
      const es = N.group(g), Oi = N.group(es); icoOido(Oi, CX - 190, 170, 0.8); color(Oi, C.rosa);
      frase(es, [['¡escúchalos!', C.rosa]], CX - 130, 186, { size: 48, peso: 800 });
      aparece(s, es, Wd('S2', 'escucharlos') - 0.2, fin, { dy: 8 });
      const co = fraseG(g, [['cada modo, ', C.suave], ['su color', C.blanco]], CX, 270, { size: 34, peso: 800, italic: true, anchor: 'middle' });
      aparece(s, co, Wd('S2', 'color') - 0.3, fin, { dy: 6 });
      COLORES.forEach((c, i) => {
        /* (29-sep-2026, Iago) «no quiero que pongas aquí lo de Re → Mi ni nada de eso de notas»: la tarjeta lleva solo el
           nombre del modo y sus palabras (antes, debajo del nombre, los acordes de c.ac); más baja y con las palabras más
           arriba. Para quitarlo: h = 420, volver a poner frase(G, c.ac, x + w / 2, y + 138, …) y las palabras en y + 230. */
        const x = 330 + i * 440, y = 340, w = 400, h = 380, G = N.group(g);
        const r = panel(G, x, y, w, h, { rx: 24 });
        texto(G, c.m, x + w / 2, y + 74, { anchor: 'middle', size: 52, peso: 800, italic: true, fill: C.blanco });
        aparece(s, G, Wd(c.pal[0][2], c.m.normalize('NFD').replace(/[̀-ͯ]/g, '')) - 0.3, fin, { dy: 10 });
        const blq = T.bloque[c.blq];
        s.on(t => { const kk = blq ? win(t, blq.t0 - 0.1, blq.t1, .2, .4) : 0; r.setAttribute('stroke', mezcla('#3a4556', C.rosa, kk)); r.setAttribute('stroke-width', (1.5 + 3 * kk).toFixed(2)); });
        c.pal.forEach(([w2, key, fr], j) => {
          const P = N.group(g); texto(P, w2, x + w / 2, y + 180 + j * 62, { anchor: 'middle', size: 36, peso: 800, fill: C.rosa, italic: true });
          aparece(s, P, Wd(fr, key) - 0.2, fin, { dy: 6 });
        });
        const O = N.group(g), Oi2 = N.group(O); icoOido(Oi2, x + w - 46, y + 46, 0.55); color(Oi2, C.rosa);
        s.on(t => opa(O, blq ? win(t, blq.t0 - 0.1, blq.t1, .2, .3) : 0));
      });
      // S5 · tus palabras
      const tPa = Wd('S5', 'palabras') - 0.3;
      const tu = N.group(g); panel(tu, 560, 800, 800, 110, { rx: 22, stroke: C.rosa, sw: 2.5 });
      const Li = N.group(tu); icoLapiz(Li, 640, 855, 0.9); color(Li, C.rosa);
      frase(tu, [['¿y a ti? ', C.blanco], ['tus palabras', C.rosa], [' son tu referencia', C.blanco]], 700, 868, { size: 34, peso: 800 });
      aparece(s, tu, tPa, fin, { dy: 8 });
    });
  }

  // ================================================================ F · repaso: la receta de dos ingredientes
  function escenaRepaso() {
    const a = F0('F1') - 0.1, b = T.acorde + 0.15;
    escena('repaso', a, b, (s, g) => {
      const fin = b - 0.3;
      const k = N.group(g); chip(k, 'REPASO', CX, 170, { size: 32, anchor: 'middle', relleno: false });
      pop(s, k, Wd('F1', 'repaso') - 0.1, fin, CX, 170);
      const re = fraseG(g, [['cada modo = ', C.suave], ['una receta', C.blanco], [' con ', C.suave], ['2 ingredientes', C.rosa]], CX, 290, { size: 40, peso: 800, anchor: 'middle' });
      aparece(s, re, Wd('F1', 'receta') - 0.2, fin, { dy: 8 });
      const ing = (x, n, segs, t) => {
        const G = N.group(g); panel(G, x, 380, 560, 240, { rx: 26, stroke: C.rosa, sw: 2.5 });
        const nm = N.group(G); color(nm, C.rosa);
        N.el('circle', { cx: x + 280, cy: 450, r: 34, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 }, nm);
        texto(nm, n, x + 280, 464, { anchor: 'middle', size: 38, peso: 800, fill: 'currentColor' });
        frase(G, segs, x + 280, 560, { size: 42, peso: 800, anchor: 'middle' });
        aparece(s, G, t, fin, { dy: 10 });
      };
      ing(360, '1', [['Mayor', C.blanco], [' o ', C.suave], ['menor', C.blanco]], Wd('F1', 'referencia') - 0.2);
      const mas = fraseG(g, [['+', C.suave]], CX, 522, { size: 60, peso: 800, anchor: 'middle' });
      aparece(s, mas, Wd('F1', 'notas') - 0.3, fin, { dy: 6 });
      ing(1000, '2', [['nota característica', C.blanco]], Wd('F1', 'notas') - 0.2);
      const so = fraseG(g, [['la teoría, ', C.suave], ['¡solucionada!', C.rosa]], CX, 760, { size: 44, peso: 800, anchor: 'middle' });
      aparece(s, so, Wd('F2', 'teorica') - 0.3, fin, { dy: 8 });
    });
  }

  const ORDEN = [escenaIntro, escenaFamilias, escenaArmadura, escenaNota, escenaDorico, escenaLidio, escenaLocrio, escenaPortal, escenaEscucha, escenaRepaso];

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
    if (TITULO.subSegs) {   // (30-sep-2026) subtítulo por trozos con su tamaño: [[texto, factor], …] (el código 8 5 4 3 3 3 2 de la
      const G = N.group(g); let x = 0;              //  serie armónica, con los «tres pequeños» más pequeños)
      TITULO.subSegs.forEach(([tx, k]) => { const t_ = texto(G, tx, x, yR + 74, { size: 38 * (k || 1), peso: 400, fill: '#cbd5e1' }); x += D.medir(t_); });
      G.setAttribute('transform', `translate(${(CX - x / 2).toFixed(1)},0)`);
    } else if (TITULO.sub) texto(g, TITULO.sub, CX, yR + 74, { anchor: 'middle', size: 38, peso: 400, fill: '#cbd5e1' });
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
