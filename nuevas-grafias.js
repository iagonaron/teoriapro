/* =====================================================================================================================
   (6-nov-2026, Iago) NUEVAS GRAFÍAS · ejercicio tipo test con partitura
   ---------------------------------------------------------------------------------------------------------------------
   4 preguntas en una tarjeta (a · b · c · d), 5 variantes de cada una, mezclables (cada ejercicio saca una de cada fila):
     a) ¿Tradicional o moderna?   b) ¿Cuál es moderna?   c) ¿A qué equivale?   d) ¿Qué recurso es?
   Sirve para: el pad «Nuevas grafías» de la portada (vista #view-nuevasgrafias) y el ejercicio del generador de fichas
   (clave test_ng, tramo 'NG'), en digital y en el PDF, con la NORMA del tipo test (no repetir de una semana a otra: cada
   subpregunta tiene su enunciado propio, «Nuevas grafías · a3»…).
   No toca el tipo test de texto: envuelve TEST_MOTOR, fpPintaTest y fpTestPDF (y fpConstruirPDF le pide antes los PNG) y SOLO actúa en los
   ejercicios con _ng. Dibuja con el motor de notación de la intro (intros/nuevas-grafias/: bravura-datos.js,
   notacion.js, grafias.js), que se carga la primera vez que hace falta.
   Para quitarlo: borra este fichero, su <script> del final de index.html y las líneas marcadas «(6-nov-2026) NG».
   ===================================================================================================================== */
(function () {
  'use strict';
  if (window.NG) return;
  var BASE = 'intros/nuevas-grafias/';
  var NS = 'http://www.w3.org/2000/svg';

  // ------------------------------------------------------------------ carga del motor de notación (una vez)
  var _listo = null;
  function carga(src) {
    return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = BASE + src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  }
  function listo() {
    if (_listo) return _listo;
    _listo = Promise.resolve()
      .then(function () { return window.BRAVURA_M ? null : carga('bravura-datos.js'); })
      .then(function () { return window.NOTA ? null : carga('notacion.js'); })
      .then(function () { return (window.NOTA && window.NOTA.ritmo2) ? null : carga('grafias.js'); })
      .then(function () {
        var ff = new FontFace('BravuraIntro', 'url(' + window.BRAVURA_WOFF2 + ')');
        return ff.load().then(function (f) { document.fonts.add(f); });
      });
    return _listo;
  }

  // ------------------------------------------------------------------ el banco (revisado con Iago el 6-nov)
  function L(it, c, o) { return { c: c, it: it, o: o }; }
  var R = {
    bar68qm: L([{ n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { sil: '8' }], ['6', '8'], { enGrupo: { '8': 2.35 } }),
    lig44: L([{ n: '8', barra: 'a' }, { n: '8', barra: 'a', liga: true }, { n: 'q', liga: true }, { n: '8', barra: 'b' }, { n: '8', barra: 'b', liga: true }, { n: 'q' }], ['4', '4']),
    mod44c: L([{ n: '8' }, { n: 'h' }, { n: 'q', p: 1 }], ['4', '4']),
    pun2mc: L([{ n: '32' }, { n: 'q', p: 3 }], ['2', '4'], { espacio: { '32': 3.2 } }),
    abc34: L([{ n: '8', barra: 'a' }, { n: '8', barra: 'a', liga: true }, { n: 'q', liga: true }, { n: '8', barra: 'b' }, { n: '8', barra: 'b' }], ['3', '4']),
    lig34a: L([{ n: '8' }, { n: 'q', p: 1, liga: true }, { n: '8', barra: 'x' }, { n: '8', barra: 'x' }], ['3', '4']),
    mod34c: L([{ n: '8' }, { n: 'h' }, { n: '8' }], ['3', '4']),
    lig68: L([{ n: 'q', p: 1, liga: true }, { n: '8', barra: 'c' }, { n: '8', barra: 'c' }, { n: '8', barra: 'c' }], ['6', '8']),
    mod68c: L([{ n: 'h' }, { n: '8', barra: 'd' }, { n: '8', barra: 'd' }], ['6', '8']),
    pun1tc: L([{ n: '16', barra: 'a' }, { n: '8', barra: 'a', p: 1, liga: true }, { n: 'q' }], ['2', '4'], { enGrupo: { '16': 2.4 }, espacio: { '8': 5.0 } }),
    pun1mc: L([{ n: '16' }, { n: 'q', p: 2 }], ['2', '4'], { espacio: { '16': 3.2 } }),
    bar68pt: L([{ sil: '8' }, { n: '8', barra: 'a' }, { n: '8', barra: 'a' }, { n: '8', barra: 'b' }, { n: '8', barra: 'b' }, { n: '8', barra: 'b' }], ['6', '8'], { enGrupo: { '8': 2.35 } }),
    bar68pm: L([{ sil: '8' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }], ['6', '8'], { enGrupo: { '8': 2.35 } }),
    pun2t: L([{ n: '32', barra: 'b' }, { n: '8', barra: 'b', p: 2, liga: true }, { n: 'q' }], null, { enGrupo: { '32': 2.4 }, espacio: { '8': 5.0 } }),
    pun2m: L([{ n: '32' }, { n: 'q', p: 3 }], null, { espacio: { '32': 3.2 } }),
    bar68rt: L([{ n: 'q' }, { n: '8' }, { n: '8' }, { n: 'q' }], ['6', '8']),
    bar68rm: L([{ n: 'q' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: 'q' }], ['6', '8']),
    lig24: L([{ n: '8', barra: 'a' }, { n: '8', barra: 'a', liga: true }, { n: '8', barra: 'b' }, { n: '8', barra: 'b' }], ['2', '4']),
    mod24: L([{ n: '8' }, { n: 'q' }, { n: '8' }], ['2', '4']),
    qph: L([{ n: 'q', p: 1, liga: true }, { n: 'h' }]),
    p8q: L([{ n: '8', p: 1, liga: true }, { n: 'q' }]),
    c8qqp: L([{ n: '8', liga: true }, { n: 'q', liga: true }, { n: 'q', p: 1 }]),
    pp8q: L([{ n: '8', p: 2, liga: true }, { n: 'q' }]),
    h: L([{ n: 'h' }]), hp: L([{ n: 'h', p: 1 }]), hpp: L([{ n: 'h', p: 2 }]), hppp: L([{ n: 'h', p: 3 }]),
    qp: L([{ n: 'q', p: 1 }]), qpp: L([{ n: 'q', p: 2 }]), qppp: L([{ n: 'q', p: 3 }]),
    c24: { cn: ['2', '4'] }, c34: { cn: ['3', '4'] }, c68: { cn: ['6', '8'] }, c64: { cn: ['6', '4'] },
    f2q: { cf: ['2', 'q', 0] }, f3q: { cf: ['3', 'q', 0] }, f2qp: { cf: ['2', 'q', 1] }
  };
  var TIT = { a: '¿Tradicional o moderna?', b: '¿Cuál es moderna?', c: '¿A qué equivale?', d: '¿Qué recurso es?' };
  var OPS_D = ['Sumar lo ligado', 'Dobles y triples puntillos', 'Barras que saltan pulsos', 'Compás con una figura'];
  var BANCO = {
    a: [
      { r: 'bar68qm', ok: 1, por: 'Moderna: una sola barra cruza el pulso' },
      { r: 'lig44', ok: 0, por: 'Tradicional: los pulsos se ven, con ligaduras' },
      { r: 'pun2mc', ok: 1, por: 'Moderna: triple puntillo, el 2.º pulso no se ve' },
      { r: 'abc34', ok: 0, por: 'Tradicional: los tres pulsos se ven' },
      { r: 'mod44c', ok: 1, por: 'Moderna: lo ligado se ha sumado' }],
    b: [
      { r: ['mod34c', 'lig34a'], ok: 0, por: 'Arriba: lo ligado, sumado (corchea · blanca · corchea)' },
      { r: ['lig68', 'mod68c'], ok: 1, por: 'Abajo: negra con puntillo + corchea, sumadas en una blanca' },
      { r: ['pun1mc', 'pun1tc'], ok: 0, por: 'Arriba: corchea con puntillo + negra = negra con doble puntillo' },
      { r: ['bar68pt', 'bar68pm'], ok: 1, por: 'Abajo: las mismas corcheas, una sola barra' },
      { r: ['c24', 'f2q'], ok: 1, por: 'Abajo: el compás con una figura (2/4 = un 2 sobre una negra)' }],
    c: [
      { r: 'qph', ops: ['hp', 'hpp', 'qppp', 'hppp'], ok: 1, por: 'Negra con puntillo + blanca = blanca con doble puntillo' },
      { r: 'p8q', ops: ['qpp', 'h', 'qp', 'qppp'], ok: 0, por: 'Corchea con puntillo + negra = negra con doble puntillo' },
      { r: 'c8qqp', ops: ['h', 'qppp', 'hp', 'hpp'], ok: 2, por: 'Corchea + negra + negra con puntillo = blanca con puntillo' },
      { r: 'pp8q', ops: ['qpp', 'hp', 'qppp', 'h'], ok: 2, por: 'Corchea con doble puntillo + negra = negra con triple puntillo' },
      { r: 'f2qp', ops: ['c24', 'c34', 'c68', 'c64'], ok: 2, por: 'Dos pulsos de negra con puntillo = 6/8' }],
    d: [
      { r: ['lig68', 'mod68c'], ok: 0, por: 'Hay una figura menos: la ligadura se ha sumado' },
      { r: ['pun2t', 'pun2m'], ok: 1, por: 'Desaparece la ligadura, pero lo que se ve es el triple puntillo' },
      { r: ['bar68rt', 'bar68rm'], ok: 2, por: 'Mismas figuras: una barra une corcheas de dos pulsos' },
      { r: ['c34', 'f3q'], ok: 3, por: '3/4 = un 3 sobre una negra' },
      { r: ['lig24', 'mod24'], ok: 0, por: 'Corchea + corchea ligadas = negra: una figura menos' }]
  };
  // en la misma ficha no van juntas dos que se delatan (una enseña el ritmo o la solución de la otra)
  var CHOCAN = [['b2', 'd1'], ['a3', 'd2'], ['c2', 'b3'], ['c4', 'd2']];
  var FILAS = ['a', 'b', 'c', 'd'];
  function qTexto(f, i) { return 'Nuevas grafías · ' + f + (i + 1); }

  /** Un ejercicio: una variante de cada fila. pen(q) = lo que cuesta repetir esa subpregunta (norma del tipo test). */
  function generar(pen) {
    var mejor = null, mejorC = 1e18, ch = {};
    CHOCAN.forEach(function (p) { ch[p[0] + p[1]] = ch[p[1] + p[0]] = 1; });
    for (var a = 0; a < 5; a++) for (var b = 0; b < 5; b++) for (var c = 0; c < 5; c++) for (var d = 0; d < 5; d++) {
      var v = [a, b, c, d], ids = FILAS.map(function (f, k) { return f + (v[k] + 1); }), coste = Math.random() * 0.5;
      for (var i = 0; i < 4; i++) for (var j = i + 1; j < 4; j++) if (ch[ids[i] + ids[j]]) coste += 1e9;
      if (typeof pen === 'function') FILAS.forEach(function (f, k) { coste += (+pen(qTexto(f, v[k])) || 0); });
      if (coste < mejorC) { mejorC = coste; mejor = v; }
    }
    var qs = FILAS.map(function (f, k) { var it = BANCO[f][mejor[k]]; return { q: qTexto(f, mejor[k]), t: f, v: mejor[k], ok: it.ok }; });
    return { _test: true, _ng: true, tramo: 'NG', titulo: 'Nuevas grafías', qs: qs, resp: [null, null, null, null] };
  }
  function item(q) { return BANCO[q.t][q.v]; }
  function puntua(g) { var ok = 0; (g.qs || []).forEach(function (q, k) { if (g.resp && g.resp[k] === q.ok) ok++; }); return g.qs && g.qs.length ? ok / g.qs.length : 0; }

  // ------------------------------------------------------------------ dibujo (unidades de 0,1 mm: la tarjeta de la ficha mide 174 × 36 mm)
  var ANCHO = 1740, ALTO = 352, GAP = 34, CW = (ANCHO - 3 * GAP) / 4, SP = 17.5;
  var pt = function (p) { return p * 3.528; };
  var TEMAS = {
    papel: { tinta: '#141414', texto: '#1e1e1e', gris: '#5a5a5a', caja: '#505050', sep: '#e6dcbc', sel: '#141414', bien: '#167a3c', mal: '#c0392b', por: '#6b6b6b' },
    oscuro: { tinta: '#f4ecd6', texto: '#fbf7ec', gris: '#c9b978', caja: '#c9b978', sep: 'rgba(212,175,55,.28)', sel: '#e9c96a', bien: '#22c98a', mal: '#ff5a5a', por: '#c9b978' }
  };
  function el(tag, at, p) { var e = document.createElementNS(NS, tag); for (var k in at) if (at[k] != null) e.setAttribute(k, at[k]); if (p) p.appendChild(e); return e; }
  function txt(p, s, x, y, o) {
    o = o || {}; var t = el('text', { x: x, y: y, 'font-size': pt(o.pt || 8.2), 'font-weight': o.b ? 700 : 400, fill: o.c, 'text-anchor': o.a || 'start',
      'font-style': o.i ? 'italic' : null, 'font-family': 'Helvetica Neue,Helvetica,Arial,sans-serif' }, p); t.textContent = s; return t;
  }
  /** Un ritmo, compás o figura centrado en cx (o empezando en cx si izq), sin pasar de maxW. Devuelve su ancho. */
  function rit(p, clave, cx, yMid, maxW, sp, izq, sinDesfase) {
    var N = window.NOTA; sp = sp || SP; var e = R[clave], g = N.group(p), gi = N.group(g), w, x = 0;
    if (e.cn) w = N.compasNum(gi, e.cn[0], e.cn[1], 0, 0, sp).w;
    else if (e.cf) w = N.compasFigura(gi, e.cf[0], e.cf[1], e.cf[2], 0, sinDesfase ? 0 : -1.1 * sp, sp).w;
    else {
      if (e.c) { var c = N.compasNum(gi, e.c[0], e.c[1], 0, 0, sp); x = c.w + 0.9 * sp; }
      var r = N.ritmo2(gi, e.it, x, 0, Object.assign({ sp: sp, alto: 1.6 }, e.o || {})); w = x + r.w;
    }
    var k = Math.min(1, maxW / w);
    g.setAttribute('transform', 'translate(' + (izq ? cx : cx - w * k / 2).toFixed(1) + ',' + yMid + ') scale(' + k.toFixed(3) + ')');
    return w * k;
  }
  function ancho(clave, sp, maxW) { var t = el('g', {}); var s = el('svg', {}); s.appendChild(t); document.body.appendChild(s); var w = rit(t, clave, 0, 0, maxW || 1e9, sp); s.remove(); return w; }

  /**
   * La tarjeta de 4 columnas en un <svg>. o = { tema: 'papel'|'oscuro', resp, marcar: 'nada'|'sol'|'corr', alPulsar(k, j), por: bool }
   * marcar 'sol' = la buena con ✗ verde (solución del PDF) · 'corr' = corrección del alumno (buena en verde, la suya mal en rojo)
   */
  function dibuja(svg, g, o) {
    o = o || {}; var T = TEMAS[o.tema || 'papel'], resp = o.resp || g.resp || [], alto = ALTO + (o.por ? 70 : 0);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox', '0 0 ' + ANCHO + ' ' + alto); svg.style.color = T.tinta;
    var zonas = [];
    for (var i = 1; i < 4; i++) { var xs = i * (CW + GAP) - GAP / 2; el('line', { x1: xs, y1: 6, x2: xs, y2: alto - 6, stroke: T.sep, 'stroke-width': 2.5, 'stroke-dasharray': '8 8' }, svg); }
    (g.qs || []).forEach(function (q, k) {
      var x = k * (CW + GAP), cx = x + CW / 2, v = item(q), col = el('g', {}, svg), mia = resp[k];
      txt(col, String.fromCharCode(97 + k) + ') ' + TIT[q.t], x, 30, { b: 1, c: T.texto });
      // casilla j: su marca según el modo
      function caja(j, bx, by, hit) {
        var gc = el('g', {}, col);
        el('rect', { x: bx, y: by - 27, width: 30, height: 30, fill: 'none', stroke: T.caja, 'stroke-width': 2.8 }, gc);
        var marca = null;
        if (o.marcar === 'sol' && j === q.ok) marca = T.bien;
        else if (o.marcar === 'corr') { if (j === q.ok) marca = T.bien; else if (mia === j) marca = T.mal; }
        else if (mia === j) marca = T.sel;
        if (marca) el('path', { d: 'M' + (bx + 4) + ' ' + (by - 23) + 'L' + (bx + 26) + ' ' + (by - 1) + 'M' + (bx + 26) + ' ' + (by - 23) + 'L' + (bx + 4) + ' ' + (by - 1), stroke: marca, 'stroke-width': 5.5, 'stroke-linecap': 'round' }, gc);
        if (o.alPulsar && hit) {   // la zona que se pulsa va encima de todo (al final)
          var h = el('rect', { x: hit[0], y: hit[1], width: hit[2], height: hit[3], fill: 'transparent', style: 'cursor:pointer' });
          h.addEventListener('click', function () { o.alPulsar(k, j); }); zonas.push(h);
        }
      }
      if (q.t === 'a') {
        rit(col, v.r, cx, 150, CW - 40);
        caja(0, x + 20, 300, [x, 250, CW / 2, 70]); txt(col, 'Tradicional', x + 62, 298, { c: T.texto });
        caja(1, x + 225, 300, [x + CW / 2, 250, CW / 2, 70]); txt(col, 'Moderna', x + 267, 298, { c: T.texto });
      } else if (q.t === 'b') {
        [0, 1].forEach(function (j) { var yy = 165 + j * 140; caja(j, x + 20, yy, [x, yy - 95, CW, 130]); rit(col, v.r[j], x + 70 + (CW - 70) / 2, yy - 20, CW - 90); });
      } else if (q.t === 'c') {
        rit(col, v.r, cx, 125, CW - 60);
        v.ops.forEach(function (key, n) {
          var xx = x + 25 + (n % 2) * (CW / 2), yy = 235 + Math.floor(n / 2) * 100;
          caja(n, xx, yy, [xx - 10, yy - 90, CW / 2 - 10, 100]);
          if (R[key].cn) rit(col, key, xx + 100, yy - 12, 120, 14); else rit(col, key, xx + 100, yy - 40, 120);
        });
      } else {
        if (R[v.r[0]].cn) {   // los compases, uno al lado del otro, con los numeradores a la misma altura
          rit(col, v.r[0], cx - 80, 115, 120, 17); rit(col, v.r[1], cx + 80, 115, 120, 17, false, true);
        } else {
          var w0 = Math.max(ancho(v.r[0], 15, CW - 60), ancho(v.r[1], 15, CW - 60)), xi = cx - w0 / 2;
          rit(col, v.r[0], xi, 92, CW - 60, 15, true); rit(col, v.r[1], xi, 180, CW - 60, 15, true);
        }
        OPS_D.forEach(function (op, j) { var yy = 242 + j * 33; caja(j, x + 10, yy, [x, yy - 30, CW, 33]); txt(col, op, x + 52, yy - 2, { pt: 7.4, c: T.texto }); });
      }
      if (o.por) {   // el porqué, en una o dos líneas
        var pal = v.por.split(' '), lin = '', yL = ALTO + 22;
        pal.forEach(function (w) {
          var prueba = lin ? lin + ' ' + w : w, t = txt(col, prueba, x, yL, { pt: 6.8, i: 1, c: T.por });
          var largo = t.getComputedTextLength ? t.getComputedTextLength() : 0; t.remove();
          if (largo > CW && lin) { txt(col, lin, x, yL, { pt: 6.8, i: 1, c: T.por }); lin = w; yL += 25; } else lin = prueba;
        });
        txt(col, lin, x, yL, { pt: 6.8, i: 1, c: T.por });
      }
    });
    zonas.forEach(function (h) { svg.appendChild(h); });
  }
  function nuevoSvg(host, ancho) {
    var s = el('svg', { xmlns: NS, width: '100%', preserveAspectRatio: 'xMidYMin meet' });
    s.style.display = 'block'; s.style.maxWidth = (ancho || 1100) + 'px'; s.style.margin = '0 auto';
    host.appendChild(s); return s;
  }

  // ------------------------------------------------------------------ digital: montar, corregir (el alumno y el pad)
  function montarEn(host, g) {
    host.innerHTML = '<div class="ng-cargando" style="color:#c9b978;font-size:13px;padding:10px">Cargando…</div>';
    if (!g.resp) g.resp = [null, null, null, null];
    return listo().then(function () {
      host.innerHTML = ''; var s = nuevoSvg(host); g.__corr = false;
      function pinta() { dibuja(s, g, { tema: 'oscuro', alPulsar: g.__corr ? null : function (k, j) { g.resp[k] = j; pinta(); } }); }
      pinta();
    });
  }
  function corregirVisual(host, g) {
    var pc = puntua(g);
    listo().then(function () {
      host.innerHTML = ''; var s = nuevoSvg(host); g.__corr = true;
      dibuja(s, g, { tema: 'oscuro', marcar: 'corr', por: true });
      var ok = Math.round(pc * 4), r = document.createElement('div');
      r.style.cssText = 'text-align:center;font-weight:900;font-size:15px;margin-top:8px;color:' + (pc >= 0.5 ? '#22c98a' : '#ff5a5a');
      r.textContent = 'Aciertos: ' + ok + '/4  ·  ' + Math.round(pc * 100) + '%'; host.appendChild(r);
    });
    return pc;
  }

  // ------------------------------------------------------------------ papel: vista previa del generador y PNG para el PDF
  function pintaPapel(host, spec, resuelto, anchoFijo) {
    host.innerHTML = '';
    var caja = document.createElement('div'); caja.style.cssText = 'background:#fff;border:1px solid #e3d3a0;border-radius:10px;padding:8px 10px'; host.appendChild(caja);
    listo().then(function () { var s = nuevoSvg(caja, anchoFijo || 960); dibuja(s, spec, { tema: 'papel', marcar: resuelto ? 'sol' : 'nada', resp: [] }); });
  }
  var PNG = new WeakMap();   // spec → [png alumno, png solución] (fuera del spec: no se guarda con la ficha)
  function aPng(spec, sol) {
    return listo().then(function () {
      var fuera = document.createElement('div'); fuera.style.cssText = 'position:absolute;left:-9999px;top:0;width:1740px'; document.body.appendChild(fuera);
      var s = el('svg', {}); fuera.appendChild(s);   // (el estilo no va en el <svg>: saldría en la imagen)
      dibuja(s, spec, { tema: 'papel', marcar: sol ? 'sol' : 'nada', resp: [] });
      var st = el('style', {}); st.textContent = '@font-face{font-family:BravuraIntro;src:url(' + window.BRAVURA_WOFF2 + ')}'; s.insertBefore(st, s.firstChild);
      s.setAttribute('width', ANCHO); s.setAttribute('height', ALTO);
      var xml = new XMLSerializer().serializeToString(s); fuera.remove();
      return new Promise(function (res) {
        var img = new Image();
        img.onload = function () {
          var esc = 1.6, c = document.createElement('canvas'); c.width = ANCHO * esc; c.height = ALTO * esc;
          var cx = c.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height); cx.drawImage(img, 0, 0, c.width, c.height);
          res({ data: c.toDataURL('image/png'), w: ANCHO, h: ALTO });
        };
        img.onerror = function () { res(null); };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
      });
    });
  }
  /** Lo llama fpConstruirPDF antes de dibujar (línea «(6-nov-2026) NG»): los PNG de las tarjetas de Nuevas grafías. */
  function prepPDF(esSol, specs) {
    specs = (specs || []).filter(function (sp) { return sp && sp._ng; });
    return Promise.all(specs.map(function (sp) {
      return aPng(sp, !!esSol).then(function (png) { var a = PNG.get(sp) || []; a[esSol ? 1 : 0] = png; PNG.set(sp, a); });
    }));
  }
  function pdf(doc, spec, x, yTop, w, hAvail, esSol, firstIndent) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); doc.setTextColor(30, 30, 30);
    var x0 = x + (firstIndent || 0); doc.text('Nuevas grafías', x0, yTop);
    var tw = doc.getTextWidth('Nuevas grafías'); doc.setFont('helvetica', 'italic'); doc.setFontSize(8.3); doc.setTextColor(120, 120, 120);
    doc.text('Marca una casilla en cada pregunta', x0 + tw + 5, yTop);
    var png = (PNG.get(spec) || [])[esSol ? 1 : 0];
    if (!png) { doc.setFontSize(9); doc.text('(no se pudo dibujar el ejercicio)', x + 4, yTop + 10); return; }
    var top = yTop + 2.5, maxH = Math.max(10, hAvail - 2.5), iw = w - 4, ih = iw * png.h / png.w;
    if (ih > maxH) { iw *= maxH / ih; ih = maxH; }
    doc.addImage(png.data, 'PNG', x + (w - iw) / 2, top, iw, ih);
  }

  // ------------------------------------------------------------------ enganches con el tipo test (solo si _ng)
  function engancha() {
    var T = window.TEST_MOTOR;
    if (T && !T.__ng) {
      var o = { generar: T.generar, enunciado: T.enunciado, montarEn: T.montarEn, corregirVisual: T.corregirVisual, puntua: T.puntua };
      T.generar = function (tramo, pen) { return tramo === 'NG' ? generar(pen) : o.generar.apply(this, arguments); };
      T.enunciado = function (g) { return g && g._ng ? 'Nuevas grafías' : o.enunciado.apply(this, arguments); };
      T.montarEn = function (host, g) { return g && g._ng ? montarEn(host, g) : o.montarEn.apply(this, arguments); };
      T.corregirVisual = function (host, g) { return g && g._ng ? corregirVisual(host, g) : o.corregirVisual.apply(this, arguments); };
      T.puntua = function (g) { return g && g._ng ? puntua(g) : o.puntua.apply(this, arguments); };
      T.__ng = true;
    }
    if (window.BANCO_TEST && !window.BANCO_TEST.NG) {   // para el aviso de la norma («el banco tiene 20»)
      var pr = []; FILAS.forEach(function (f) { BANCO[f].forEach(function (_, i) { pr.push({ q: qTexto(f, i), op: [] }); }); });
      window.BANCO_TEST.NG = { titulo: 'Nuevas grafías', preguntas: pr };
    }
    if (window.fpPintaTest && !window.fpPintaTest.__ng) {
      var oP = window.fpPintaTest;
      window.fpPintaTest = function (host, spec, resuelto, ancho) { return spec && spec._ng ? pintaPapel(host, spec, resuelto, ancho) : oP.apply(this, arguments); };
      window.fpPintaTest.__ng = true;
    }
    if (window.fpTestPDF && !window.fpTestPDF.__ng) {
      var oT = window.fpTestPDF;
      window.fpTestPDF = function (doc, spec) { return spec && spec._ng ? pdf.apply(this, arguments) : oT.apply(this, arguments); };
      window.fpTestPDF.__ng = true;
    }
  }

  // ------------------------------------------------------------------ el pad de la portada (#view-nuevasgrafias)
  var pad = null;
  function nuevoPad() {
    pad = generar(null);
    var sc = document.getElementById('scoreNG'); if (sc) sc.innerHTML = '';
    var h = document.getElementById('answersNG'); if (h) montarEn(h, pad);
  }
  function corregirPad() {
    if (!pad) return;
    var h = document.getElementById('answersNG'), pc = corregirVisual(h, pad);
    var sc = document.getElementById('scoreNG');
    if (sc) sc.innerHTML = '<div style="padding:10px 4px;font-weight:800;color:' + (pc >= 0.5 ? '#22c98a' : '#ff5a5a') + '">' + Math.round(pc * 4) + ' de 4</div>';
  }
  function abrirVista() {
    var p = document.getElementById('view-portal'), v = document.getElementById('view-nuevasgrafias');
    if (!v) return;
    if (p) p.style.display = 'none';
    v.style.display = 'block'; window.scrollTo(0, 0);
    if (!pad) nuevoPad();
  }

  window.NG = { listo: listo, generar: generar, puntua: puntua, montarEn: montarEn, corregirVisual: corregirVisual, dibuja: dibuja,
    pintaPapel: pintaPapel, aPng: aPng, prepPDF: prepPDF, abrirVista: abrirVista, nuevo: nuevoPad, corregir: corregirPad, BANCO: BANCO, R: R, CHOCAN: CHOCAN };
  engancha();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', engancha);
})();
