/* =====================================================================
   ESCENAS · Compases extraños
   Cada escena se construye una vez (SVG) y luego se actualiza con el
   tiempo t del máster de audio: todo es función pura de t, así se puede
   reproducir, saltar a cualquier punto o exportar a vídeo fotograma a
   fotograma sin que nada se descuadre.
   Las marcas de tiempo salen de la narración (frases y palabras).
   ===================================================================== */
(function () {
  'use strict';
  const N = window.NOTA, D = window.DIB, C = D.C;
  const { ramp, ease, eo, lerp, win, clamp, mezcla, texto, panel, chip, flecha, aspa, tick, foto, pos, opa, color } = D;
  const SP = N.SP = 26;                    // tamaño único de toda la grafía (norma 7)
  const W = 1920, H = 1080, CX = 960;

  let T = null;                            // línea de tiempo (frases, bloques)
  const esc = [];                          // escenas

  // ---------------------------------------------------------------- marcas de tiempo
  const F0 = id => T.frase[id] ? T.frase[id].t0 : (T.bloque[id] ? T.bloque[id].t0 : 0);
  const F1 = id => T.frase[id] ? T.frase[id].t1 : (T.bloque[id] ? T.bloque[id].t1 : 0);
  const limpia = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,;:…«»"()]/g, '');
  /** Momento en que se dice la palabra que empieza por `pal` dentro de la frase `id` (n-ésima aparición). */
  function Wd(id, pal, n) {
    const f = T.frase[id]; if (!f) return 0;
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
  /** Aparece en ta (con subida suave) y desaparece en tb. */
  function aparece(s, g, ta, tb, o) {
    o = o || {};
    const dy = o.dy != null ? o.dy : 14, fi = o.fi || .5, fo = o.fo || .5;
    const x0 = o.x || 0, y0 = o.y || 0;
    s.on(t => {
      const v = win(t, ta, tb == null ? 1e9 : tb, fi, fo);
      opa(g, v);
      if (v > 0) pos(g, x0, y0 + (1 - eo(ramp(t, ta, ta + fi))) * dy);
    });
  }
  /** Colorea (currentColor) de blanco a rosa en ta y vuelve en tb (si tb). */
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

  // ================================================================ 0 · TÍTULO INICIAL (norma 5)
  function escenaTitulo() {
    const a = 0, b = F1('TITULO');
    escena('titulo', a - 1, b, (s, g) => {
      const gg = N.group(g);
      tituloGrande(gg);
      s.on(t => opa(gg, 1 - ease(ramp(t, b - 1.2, b))));
    });
  }
  function tituloGrande(g) {
    texto(g, 'GRADO PROFESIONAL  ·  UNIDAD 1', CX, 392, { anchor: 'middle', size: 26, peso: 800, ls: '0.3em', fill: C.rosa });   // (27-sep) sin dorado: rosa
    texto(g, 'COMPASES EXTRAÑOS', CX, 528, { anchor: 'middle', size: 112, peso: 800, ls: '0.05em', fill: C.blanco });
    N.el('rect', { x: CX - 60, y: 566, width: 120, height: 5, rx: 2.5, fill: C.rosa }, g);
    texto(g, 'Mixtos · Decimales · Fraccionarios', CX, 640, { anchor: 'middle', size: 38, peso: 400, fill: '#cbd5e1' });
  }

  // ================================================================ A · EL DICTADO
  function escenaDictado() {
    const a = F0('A1') - 0.3, b = Wd('A7', 'paso') + 0.1;       // sigue a la vista en «algo parecido les pasó…»
    escena('dictado', a, b, (s, g) => {
      const G = N.group(g);
      aparece(s, G, a, b, { dy: 18, fi: .7, fo: .8 });
      panel(G, 150, 250, 1620, 540);
      // --- etiquetas: tonalidad ✓ (Re menor) · armadura ✓ (un bemol) · compás ?
      const yE = 318, tTon = Wd('A2', 'tonalidad') - .1, tArm = Wd('A2', 'armadura') - .1;
      const e1 = etiquetaCheck(G, 'TONALIDAD', 210, yE, true);
      const e2 = etiquetaCheck(G, 'ARMADURA', 210 + e1._w + 22, yE, true);
      const e3 = chip(G, 'COMPÁS  ?', 210 + e1._w + e2._w + 44, yE, { size: 21, relleno: true });
      mostrarEn(s, e1, tTon);
      mostrarEn(s, e2, tArm);
      mostrarEn(s, e3, Wd('A2', 'compas') - .1);
      const ton = texto(G, 'Re menor', 210 + e1._w / 2, 384, { anchor: 'middle', size: 30, peso: 700, fill: 'currentColor' });
      aparece(s, ton, tTon + 0.15, null, { dy: 8, fi: .4 });
      resalta(s, ton, tTon + 0.15, tTon + 1.3, { d: .3 });
      // la armadura, en su pentagrama (pequeño) bajo la etiqueta
      const spm = 13, xm = 210 + e1._w + 22 + e2._w / 2 - 3.5 * spm, ymm = 396;
      const AM = N.group(G, 'armaduraMini');
      N.pentagrama(AM, xm, ymm, 7.0 * spm, spm);
      N.claveSol(AM, xm + 0.45 * spm, ymm, spm);
      const bm = N.group(AM); N.armadura(bm, xm + 4.0 * spm, ymm, spm, 1);
      aparece(s, AM, tArm + 0.15, null, { dy: 8, fi: .4 });
      resalta(s, bm, tArm + 0.15, tArm + 1.3, { d: .3 });
      // --- pentagrama del dictado
      const yM = 620, x0 = 200;
      const ST = N.group(G, 'st');
      N.pentagrama(ST, x0, yM, 1520, SP);
      N.claveSol(ST, x0 + 22, yM, SP);
      const arm = N.group(ST); const ar = N.armadura(arm, x0 + 104, yM, SP, 1);
      s.on(t => opa(arm, ease(ramp(t, tArm + 0.15, tArm + 0.55))));
      resalta(s, arm, tArm + 0.15, tArm + 1.3, { d: .3 });
      // hueco del compás: interrogante / candidatos
      const huecoX = x0 + 104 + ar.w + 18;
      const q = N.group(ST); N.compas(q, { tipo: 'interrogante' }, huecoX, yM, SP); color(q, C.rosa);
      const DD = window.DATOS_INTRO.dictado;
      const mel = N.melodia(ST, DD.notas, huecoX + 112, yM, { sp: SP, espacio: { q: 3.8, '8': 2.6, '16': 2.6 } });
      const s16 = 60 / DD.bpm / 4, t0 = F0('DICTADO') + DD.entrada;
      const notas = mel.notas;
      notas.forEach((n, i) => {
        const ton = t0 + n.t0 * s16, toff = t0 + n.t1 * s16;
        s.on(t => {
          const v = ease(ramp(t, ton - 0.02, ton + 0.1));
          opa(n.g, v);
          if (n.barras) opa(n.barras, 1);
          // la nota que suena, en rosa; luego vuelve a blanco
          const k = Math.max(0, 1 - ramp(t, toff, toff + 0.45)) * (t >= ton ? 1 : 0);
          color(n.g, mezcla(C.blanco, C.rosa, k));
        });
      });
      // las barras de las corcheas aparecen con su segunda nota
      const barrasVistas = new Set();
      notas.forEach((n, i) => { if (n.barras && !barrasVistas.has(n.barras)) { barrasVistas.add(n.barras);
        const ult = notas.filter(m => m.barras === n.barras).pop(); const ton = t0 + ult.t0 * s16;
        s.on(t => { opa(n.barras, ease(ramp(t, ton - 0.02, ton + 0.1))); const k = Math.max(0, 1 - ramp(t, t0 + ult.t1 * s16, t0 + ult.t1 * s16 + .45)) * (t >= ton ? 1 : 0); color(n.barras, mezcla(C.blanco, C.rosa, k)); });
      } });
      // --- divisorias de prueba: dónde caería cada barra de compás
      const xDe = T16 => {
        for (let i = 0; i < notas.length; i++) {
          const n = notas[i], nx = notas[i + 1] ? notas[i + 1].x : n.x + 3 * SP;
          if (Math.abs(T16 - n.t0) < 1e-6) return { x: n.x - 0.85 * SP, corta: null };
          if (T16 > n.t0 && T16 < n.t1) return { x: lerp(n.x + 1.7 * SP, nx - 0.7 * SP, (T16 - n.t0) / (n.t1 - n.t0)), corta: n };
        }
        return null;
      };
      function prueba(num, den, ta, tb, fuerte) {
        const gp = N.group(ST, 'prueba');
        const cs = N.group(gp);
        N.compas(cs, { tipo: 'simple', num: String(num), den: String(den) }, huecoX - 2, yM, SP);
        const per = num * 16 / den;
        const cortes = [];
        for (let k = 1; k * per < 36; k++) {
          const r = xDe(k * per); if (!r) continue;
          const gl = N.group(gp); N.line(gl, r.x, yM - 2 * SP, r.x, yM + 2 * SP, 0.2 * SP);
          if (r.corta) cortes.push({ n: r.corta, x: r.x, gl });
          else gl.style.color = C.blanco;
        }
        const marcas = cortes.map(c => { const m = N.group(gp); aspa(m, c.x, yM - 3.4 * SP, 14, 5); m.style.color = C.rosa; return m; });
        s.on(t => {
          const v = win(t, ta, tb, fuerte ? .3 : .12, fuerte ? .4 : .12);
          opa(gp, v);
          color(cs, fuerte ? C.rosa : C.blanco);
          cortes.forEach(c => color(c.gl, C.rosa));
          const k = ease(ramp(t, ta + (fuerte ? .35 : .1), ta + (fuerte ? .7 : .22)));
          marcas.forEach(m => opa(m, v * k));
          cortes.forEach(c => { if (v > 0.01 && t > ta) color(c.n.g, mezcla(C.blanco, C.rosa, k)); });
        });
        return gp;
      }
      // «…y no te cuadra nada»: pruebas rápidas 2/4, 3/4, 4/4
      const a4 = F0('A4'), a4f = F1('A4') + 1.2;
      const paso = Math.max(0.55, (a4f - a4) / 3);
      prueba(2, 4, a4 + 0.1, a4 + 0.1 + paso, false);
      prueba(3, 4, a4 + 0.1 + paso, a4 + 0.1 + 2 * paso, false);
      prueba(4, 4, a4 + 0.1 + 2 * paso, a4 + 0.1 + 3 * paso, false);
      // «¿Será un 5/8?» … «pero es que tampoco»
      const t58 = Wd('A5', 'cinco'), tFin = F1('A6') + 0.5;
      const p58 = prueba(5, 8, t58 - 0.1, tFin, true);
      const tach = N.group(ST); N.line(tach, huecoX - 14, yM + 1.9 * SP, huecoX + 2.3 * SP, yM - 1.9 * SP, 5, { 'stroke-linecap': 'round' }); tach.style.color = C.rojo;
      const tTamp = Wd('A6', 'tampoco');
      s.on(t => opa(tach, win(t, tTamp, tFin, .25, .4)));
      // el interrogante solo cuando no hay candidato
      s.on(t => {
        const ocupado = (t > a4 + 0.1 && t < a4 + 0.1 + 3 * paso) || (t > t58 - 0.1 && t < tFin);
        opa(q, ocupado ? 0 : 1);
      });
    });
  }
  function etiquetaCheck(parent, str, x, y, ok) {
    const g = chip(parent, str, x, y, { size: 21, relleno: false, borde: 'rgba(255,255,255,.35)', colorTexto: C.texto, extraW: 30 });
    const tk = N.group(g); tick(tk, g._w - 30, 1, 8, 3.5); tk.style.color = C.verde;
    return g;
  }

  // ================================================================ B · BARTÓK Y KODÁLY
  function escenaBartok() {
    const a = Wd('A7', 'compositores') - 0.4, b = F0('B3') + 0.6;
    escena('bartok', a, b, (s, g) => {
      const IMG = window.IMAGENES || {};
      // retratos (si faltan las fotos: ficha tipográfica, sin huecos vacíos)
      const R = N.group(g);
      const hayRetratos = !!(IMG.bartok && IMG.kodaly);
      const ret = (href, nombre, fechas, cx) => {
        const gg = N.group(R);
        if (hayRetratos) {
          foto(gg, href, cx - 190, 200, 380, 470, { filtro: 'grayscale(1) contrast(1.05)' });
          texto(gg, nombre, cx, 728, { anchor: 'middle', size: 34, peso: 800, ls: '0.06em', fill: C.blanco });
          texto(gg, fechas, cx, 770, { anchor: 'middle', size: 24, peso: 400, fill: C.suave });
        } else {
          texto(gg, nombre, cx, 520, { anchor: 'middle', size: 58, peso: 800, ls: '0.05em', fill: C.blanco });
          texto(gg, fechas, cx, 574, { anchor: 'middle', size: 26, peso: 400, fill: '#cbd5e1' });
        }
        return gg;
      };
      const rb = ret(IMG.bartok, 'BÉLA BARTÓK', '1881 – 1945', hayRetratos ? 730 : CX - 350);
      const rk = ret(IMG.kodaly, 'ZOLTÁN KODÁLY', '1882 – 1967', hayRetratos ? 1190 : CX + 350);
      if (!hayRetratos) { const div = N.group(rk); N.el('line', { x1: CX, y1: 462, x2: CX, y2: 590, stroke: 'rgba(255,255,255,.28)', 'stroke-width': 2 }, div); }
      const tComp = Wd('A7', 'compositores') - 0.1;
      aparece(s, rb, tComp, F0('B1') + 0.4, { dy: 16 });
      aparece(s, rk, tComp + 0.25, F0('B1') + 0.4, { dy: 16 });
      // el nombre de cada uno se enciende (rosa) al decirlo
      [[rb, Wd('A7', 'bartok')], [rk, Wd('A7', 'kodaly')]].forEach(([r, tn]) => {
        const nom = r.querySelectorAll('text')[r.querySelectorAll('text').length - 2];
        s.on(t => nom.setAttribute('fill', mezcla(C.blanco, C.rosa, ease(ramp(t, tn - .1, tn + .25)) * (1 - ease(ramp(t, F0('CILINDRO'), F0('CILINDRO') + .6))))));
      });
      // «Escucha.» · recreación del cilindro
      const tc0 = F0('CILINDRO'), tc1 = F1('CILINDRO');
      const O = N.group(g);
      const path = N.el('path', { fill: 'none', stroke: C.rosa, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, O);
      texto(O, 'Recreación de una grabación en cilindro de cera', CX, 930, { anchor: 'middle', size: 23, peso: 400, fill: C.suave });
      const ENV = window.ENVOLVENTE_CILINDRO || null;
      s.on(t => {
        const v = win(t, tc0 - 0.2, tc1 + 0.3, .4, .5);
        opa(O, v);
        if (v <= 0) return;
        let d = ''; const x0 = 560, x1 = 1360, n = 160;
        for (let i = 0; i <= n; i++) {
          const x = lerp(x0, x1, i / n);
          const tt = t - (n - i) * 0.012;                 // la onda «viaja» hacia la derecha
          let amp = 0.25;
          if (ENV) { const k = Math.floor((tt - tc0) * 50); amp = (k >= 0 && k < ENV.length) ? ENV[k] : 0.02; }
          const fin = Math.sin(Math.PI * i / n);
          const y = 850 + Math.sin(tt * 38 + i * 0.9) * 26 * amp * fin + Math.sin(tt * 61 + i * 0.37) * 12 * amp * fin;
          d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
        }
        path.setAttribute('d', d);
      });
      // B1–B2 · el fonógrafo, dibujado con vectores (aparece, gira, suena y se borra)
      const tCil = Math.min(F0('B2') - 0.1, Wd('B1', 'cilindros'));
      fonografoVectorial(s, N.group(g), 968, 592, F0('B1') + 0.35, tCil, F0('B2'), b);
    });
  }

  /** Fonógrafo de cilindro de cera en línea (estilo de la intro). Se dibuja trazo a trazo desde t0,
      el cilindro gira, se enciende en rosa en «cilindros», suena en «¿Te suena?» y se borra antes de tFin. */
  function fonografoVectorial(s, P, cx, cy, t0, tCil, tSuena, tFin) {
    const G = N.group(P); G.setAttribute('transform', `translate(${cx},${cy})`);
    G.style.color = C.blanco;
    const trazos = [];
    const T = (tag, at, a0, a1, parent) => {
      const e = N.el(tag, Object.assign({ fill: 'none', stroke: 'currentColor', 'stroke-width': 3.4, 'stroke-linecap': 'round',
        'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, at), parent || G);
      trazos.push({ e, a0, a1, relleno: at.fill && at.fill !== 'none' });
      return e;
    };
    // caja de madera: zócalo, frente, tapa, patas, panel y cinta decorativa
    T('rect', { x: -312, y: 250, width: 524, height: 16, rx: 3 }, 0.0, 0.5);
    T('rect', { x: -300, y: 60, width: 500, height: 190, rx: 4 }, 0.1, 0.7);
    T('rect', { x: -315, y: 40, width: 530, height: 20, rx: 4 }, 0.2, 0.7);
    T('rect', { x: -296, y: 266, width: 40, height: 10, rx: 2 }, 0.4, 0.7);
    T('rect', { x: 156, y: 266, width: 40, height: 10, rx: 2 }, 0.4, 0.7);
    T('rect', { x: -262, y: 94, width: 424, height: 124, rx: 12, 'stroke-width': 2, opacity: .7 }, 0.3, 0.9);
    T('path', { d: 'M-205,168 C-140,136 -70,190 0,160 C60,134 100,158 125,170', 'stroke-width': 2, opacity: .7 }, 0.5, 1.0);
    // manivela
    T('circle', { cx: 212, cy: 150, r: 8 }, 0.5, 0.8);
    T('path', { d: 'M212,150 L262,188' }, 0.6, 0.9);
    T('rect', { x: 256, y: 186, width: 12, height: 34, rx: 6 }, 0.7, 1.0);
    // soportes, ejes y guía del diafragma
    T('path', { d: 'M-250,40 L-240,-50 L-224,-50 L-214,40' }, 0.6, 1.0);
    T('path', { d: 'M84,40 L94,-50 L110,-50 L120,40' }, 0.6, 1.0);
    T('path', { d: 'M-232,-30 L-215,-30 M75,-30 L102,-30' }, 0.9, 1.1);
    T('path', { d: 'M-244,-104 L104,-104', 'stroke-width': 2.5 }, 0.8, 1.2);
    // el cilindro de cera
    const CIL = N.group(G);
    const cuerpo = N.el('rect', { x: -215, y: -62, width: 290, height: 64, fill: C.rosa, 'fill-opacity': 0 }, CIL);
    const clipId = 'cil' + Math.random().toString(36).slice(2, 7);
    const cp = N.el('clipPath', { id: clipId }, N.el('defs', null, CIL));
    N.el('rect', { x: -215, y: -62, width: 290, height: 64 }, cp);
    const surcos = N.group(CIL); surcos.setAttribute('clip-path', `url(#${clipId})`);
    const lineasS = []; for (let i = 0; i < 23; i++) lineasS.push(N.el('line', { y1: -62, y2: 2, stroke: 'currentColor', 'stroke-width': 1.6, opacity: .45 }, surcos));
    T('path', { d: 'M-215,-62 L75,-62 M-215,2 L75,2' }, 0.8, 1.3, CIL);
    T('ellipse', { cx: -215, cy: -30, rx: 10, ry: 32 }, 0.9, 1.3, CIL);
    T('ellipse', { cx: 75, cy: -30, rx: 10, ry: 32 }, 1.0, 1.4, CIL);
    // diafragma y aguja
    T('circle', { cx: -60, cy: -96, r: 22, fill: '#0b1320' }, 1.1, 1.5);
    T('circle', { cx: -60, cy: -96, r: 9, 'stroke-width': 2 }, 1.3, 1.6);
    T('path', { d: 'M-60,-74 L-60,-62' }, 1.4, 1.6);
    // bocina
    const th = [-56, -120], bell = [235, -340];
    const L = Math.hypot(bell[0] - th[0], bell[1] - th[1]);
    const u = [(bell[0] - th[0]) / L, (bell[1] - th[1]) / L], v = [-u[1], u[0]];
    const P_ = (p, k, w) => [p[0] + (bell[0] - th[0]) * k + v[0] * w, p[1] + (bell[1] - th[1]) * k + v[1] * w];
    const f = n => n.toFixed(1);
    const lado = sg => { const a = P_(th, 0, 9 * sg), c = P_(th, 0.74, 28 * sg), e = P_(th, 1, 128 * sg);
      return `M${f(a[0])},${f(a[1])} Q${f(c[0])},${f(c[1])} ${f(e[0])},${f(e[1])}`; };
    T('path', { d: lado(1) }, 1.3, 2.0);
    T('path', { d: lado(-1) }, 1.35, 2.05);
    const ang = Math.atan2(v[1], v[0]) * 180 / Math.PI;
    T('ellipse', { cx: bell[0], cy: bell[1], rx: 128, ry: 34, transform: `rotate(${ang.toFixed(1)} ${bell[0]} ${bell[1]})`, fill: 'rgba(255,255,255,0.04)' }, 1.7, 2.3);
    const soporte = P_(th, 0.708, -36);
    T('path', { d: `M150,40 L150,${f(soporte[1])}`, 'stroke-width': 2.5 }, 1.4, 1.9);
    // ondas de «¿Te suena?»
    const ondas = [0, 1, 2].map(i => {
      const go = N.group(G);
      const w = N.el('path', { d: 'M0,-78 A26,78 0 0,1 0,78', fill: 'none', stroke: 'currentColor', 'stroke-width': 3, 'stroke-linecap': 'round' }, go);
      return go;
    });
    const angU = Math.atan2(u[1], u[0]) * 180 / Math.PI;
    // etiqueta
    const ch = chip(P, 'FONÓGRAFO · CILINDRO DE CERA', cx, cy + 322, { size: 20, anchor: 'middle' });
    s.on(t => {
      const borr = ease(ramp(t, tFin - 0.95, tFin - 0.15));
      G.setAttribute('opacity', (1 - 0.75 * borr).toFixed(3));        // se borra y a la vez se apaga
      for (const tr of trazos) {
        const k = ease(ramp(t, t0 + tr.a0, t0 + tr.a1));
        tr.e.setAttribute('stroke-dashoffset', (1 - k - borr).toFixed(4));
        if (tr.relleno) tr.e.setAttribute('fill-opacity', (k * (1 - borr)).toFixed(3));
      }
      // el cilindro gira (surcos que se desplazan) y se enciende en «cilindros»
      const vis = ease(ramp(t, t0 + 1.3, t0 + 1.7)) * (1 - borr);
      opa(surcos, vis);
      const desp = ((t - t0) * 30) % 13;
      lineasS.forEach((ln, i) => { const x = -215 + i * 13 + desp; ln.setAttribute('x1', f(x)); ln.setAttribute('x2', f(x)); });
      const kc = ease(ramp(t, tCil - 0.1, tCil + 0.35)) * (1 - borr);
      color(CIL, mezcla(C.blanco, C.rosa, kc));
      cuerpo.setAttribute('fill-opacity', (0.16 * kc).toFixed(3));
      opa(ch, kc);
      // ondas que salen de la bocina en «¿Te suena?»
      ondas.forEach((go, i) => {
        const ph = (t - tSuena - 0.28 * i) / 1.1;
        if (ph < 0 || ph > 2 || borr > 0.5) { opa(go, 0); return; }
        const q = ph % 1, d = 40 + 95 * q;
        opa(go, Math.sin(Math.PI * q) * 0.8 * (ph < 1 ? 1 : 0.6));
        go.setAttribute('transform', `translate(${f(bell[0] + u[0] * d)},${f(bell[1] + u[1] * d)}) rotate(${angU.toFixed(1)}) scale(${(0.8 + 0.45 * q).toFixed(3)})`);
      });
    });
    return G;
  }

  // ================================================================ B3 · del folclore al nacionalismo
  function escenaNacionalismo() {
    const a = F0('B3') - 0.1, b = F0('B4') + 0.5;
    escena('nacionalismo', a, b, (s, g) => {
      const items = [['FOLCLORE HÚNGARO', 'folclore'], ['ANÁLISIS', 'analizar'], ['INSPIRACIÓN', 'inspiracion'], ['MÚSICA NACIONALISTA', 'nacionalista']];
      const tmp = N.group(g); const anchos = items.map(([s1]) => chip(tmp, s1, 0, 0, { size: 26 })._w); tmp.remove();
      const gap = 86; const total = anchos.reduce((x, y) => x + y, 0) + gap * (items.length - 1);
      let x = CX - total / 2; const y = 540;
      items.forEach(([txt, pal], i) => {
        const last = i === items.length - 1;
        const c = chip(g, txt, 0, 0, { size: 26, relleno: true, fondo: last ? C.rosa : C.panel, colorTexto: last ? '#fff' : C.texto });
        if (!last) { c._rect.setAttribute('stroke', 'rgba(255,255,255,.45)'); c._rect.setAttribute('stroke-width', 2); }
        const ta = Wd('B3', pal) - 0.15, xi = x;
        s.on(t => { const v = win(t, ta, b, .45, .5); opa(c, v); pos(c, xi, y + (1 - eo(ramp(t, ta, ta + .45))) * 12); });
        if (!last) {
          const fl = N.group(g); flecha(fl, x + anchos[i] + 16, y, x + anchos[i] + gap - 16, y, { w: 3, cab: 14 }); fl.style.color = C.suave;
          mostrarEn(s, fl, Wd('B3', items[i + 1][1]) - 0.35, b);
        }
        x += anchos[i] + gap;
      });
    });
  }

  /** Sin foto de las aldeas: un camino de puntos que se adentra, aldea a aldea,
      y de cada aldea salen notas cuando se dice «tocaban». */
  function caminoAldeas(s, P, t0, t1, tNotas) {
    const d = 'M300,790 C560,790 600,600 840,610 C1060,620 1060,470 1260,450 C1420,434 1480,350 1640,340';
    const clipId = 'camino' + Math.random().toString(36).slice(2, 7);
    const defs = N.el('defs', null, P), cp = N.el('clipPath', { id: clipId }, defs);
    const rc = N.el('rect', { x: 0, y: 0, width: 0, height: 1080 }, cp);
    const cam = N.el('path', { d, fill: 'none', stroke: 'rgba(255,255,255,.72)', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-dasharray': '0.1 16', 'clip-path': `url(#${clipId})` }, P);
    const L = cam.getTotalLength();
    // x(k) del camino, para saber cuándo llega a cada aldea
    const puntos = []; for (let i = 0; i <= 200; i++) puntos.push(cam.getPointAtLength(L * i / 200));
    const cabeza = N.el('circle', { r: 9, fill: C.rosa }, P);
    const aldeas = [0.30, 0.63, 0.985].map((f, i) => {
      const p = cam.getPointAtLength(L * f);
      const ga = N.group(P);
      const ic = N.group(ga); iconoAldea(ic, 0, 0); ic.setAttribute('transform', 'scale(1.35)'); ic.style.color = C.blanco;
      const notas = [0, 1].map(j => { const gn = N.group(ga); N.glyph(gn, j ? 'noteQuarterUp' : 'note8thUp', 0, 0, 13); gn.style.color = C.rosa; return gn; });
      pos(ga, p.x, p.y - 64);
      return { ga, notas, x: p.x, i };
    });
    texto(P, [['De aldea en aldea, grabando canciones tradicionales', C.texto]], CX, 910, { anchor: 'middle', size: 28, peso: 600 });
    s.on(t => {
      const k = ease(ramp(t, t0, t1));
      const n = Math.round(k * 200), hx = puntos[n].x;
      rc.setAttribute('width', (hx + 12).toFixed(1));
      cabeza.setAttribute('cx', puntos[n].x.toFixed(1)); cabeza.setAttribute('cy', puntos[n].y.toFixed(1));
      opa(cabeza, (k > 0.001 && k < 0.999) ? 1 : 0);
      for (const A of aldeas) {
        opa(A.ga, ease(ramp(hx, A.x - 60, A.x + 10)));
        A.notas.forEach((gn, j) => {
          const ph = t - tNotas - 0.35 * A.i - 0.8 * j;
          if (ph < 0) { opa(gn, 0); return; }
          const f = (ph % 1.6) / 1.6;
          opa(gn, Math.sin(Math.PI * f) * ease(ramp(ph, 0, .3)));
          pos(gn, (j ? 34 : -30) + 10 * Math.sin(f * 3.2), -78 - 70 * f);
        });
      }
    });
  }

  // ================================================================ B4–B5 · aldeas y ritmos imposibles de cuadrar
  function escenaAldeas() {
    const a = F0('B4') - 0.2, b = Wd('B6', 'ejemplo') - 0.05;
    escena('aldeas', a, b, (s, g) => {
      const IMG = window.IMAGENES || {};
      const P = N.group(g);
      const k0 = a, k1 = F0('B5') + 0.8;
      if (IMG.grabacion1907) { const fg = foto(P, IMG.grabacion1907, 502, 150, 916, 700, { filtro: 'grayscale(1) contrast(1.06)' });
        const im = fg._img;
        s.on(t => { const k = ease(ramp(t, k0, k1)); const z = 1 + 0.16 * k; im.setAttribute('transform', `translate(${(960 - 960 * z + 90 * k).toFixed(1)},${(500 - 500 * z + 40 * k).toFixed(1)}) scale(${z.toFixed(4)})`); });
        texto(P, [['Lugareños cantando para el fonógrafo', C.texto]], CX, 910, { anchor: 'middle', size: 28, peso: 600 });
      } else caminoAldeas(s, P, a + 0.3, Wd('B4', 'tradicionales') - 0.3, Wd('B4', 'tocaban') - 0.2);
      s.on(t => opa(P, win(t, a, F0('B5') + 0.6, .6, .7)));
      // «Rítmicas imposibles de cuadrar»: el patrón no cabe en el cuadrado
      const Q = N.group(g);
      const tq = Wd('B5', 'ritmicas') - 0.2;
      const lado = 440, qx = CX - lado / 2 - 70, qy = 540 - lado / 2;
      N.el('rect', { x: qx, y: qy, width: lado, height: lado, rx: 6, fill: C.panel, stroke: C.blanco, 'stroke-width': 3 }, Q);
      const yMid = 540 - 0.2 * SP;
      const rit = N.ritmo(Q, [{ n: '8', barra: 'a' }, { n: '8', barra: 'a' }, { n: 'q' }, { n: '16' }], 0, 0, { sp: SP * 1.25, espacio: { q: 4.0, '8': 2.4, '16': 3 }, grupoEsp: 2.3 });
      const semi = rit.notas[3];
      // ♪♪ ♩ dentro del cuadrado; la semicorchea se sale por la derecha
      const anchoDentro = semi.x;                              // hasta la negra (incluida)
      rit.g.setAttribute('transform', `translate(${(qx + (lado - anchoDentro + 20) / 2 - 10).toFixed(1)},${yMid.toFixed(1)})`);
      pos(semi.g, lado - (qx + (lado - anchoDentro + 20) / 2 - 10 + semi.x - qx) + 60, 0);
      color(semi.g, C.rosa);
      texto(Q, '¡no cuadra!', qx + lado + 110, qy + lado + 58, { anchor: 'middle', size: 28, peso: 700, fill: C.rosa });
      aparece(s, Q, tq, b, { dy: 16 });
    });
  }

  // ================================================================ B6–B7 · el patrón que se repite
  function escenaPatron() {
    const a = F0('B6') + 0.2, b = F0('C1') - 0.05;
    escena('patron', a, b, (s, g) => {
      const pasos = [
        ['Música folclórica', 'de una región', 'musica', iconoAldea],
        ['Grabación', 'de muestras', 'grabacion', iconoMicro],
        ['Transcripción', 'analítica', 'transcripcion', iconoPartitura],
        ['Descubrimiento', 'de métricas inéditas', 'descubrimiento', iconoLupa],
        ['Necesidad', 'de nuevos compases', 'necesidad', iconoCompas],
      ];
      const w = 300, gap = 42, total = pasos.length * w + (pasos.length - 1) * gap;
      const x0 = CX - total / 2, y0 = 380, h = 330;
      // «Este es solo un ejemplo… en otros lugares»: mapa de Europa (Hungría, y luego GB, Alemania, Bulgaria…)
      mapaEuropa(s, g, Wd('B6', 'ejemplo') - 0.05, Wd('B6', 'siempre'),
        [['GB', 'GRAN BRETAÑA', Wd('B6', 'otras') - 0.1], ['DE', 'ALEMANIA', Wd('B6', 'parecidas') - 0.1], ['BG', 'BULGARIA', Wd('B6', 'lugares') - 0.3]],
        Wd('B6', 'lugares') + 0.25);
      const tit = texto(g, 'EL PATRÓN ES SIEMPRE EL MISMO', CX, 300, { anchor: 'middle', size: 26, peso: 800, ls: '0.2em', fill: C.suave });
      mostrarEn(s, tit, Wd('B6', 'siempre') + 0.05, b);
      pasos.forEach(([l1, l2, pal, icono], i) => {
        const x = x0 + i * (w + gap);
        const gp = N.group(g);
        const last = i === pasos.length - 1;
        panel(gp, 0, 0, w, h, { stroke: last ? C.rosa : C.borde, sw: last ? 2.5 : 1.5 });
        texto(gp, String(i + 1), 26, 50, { size: 26, peso: 800, fill: last ? C.rosa : C.suave });
        const ic = N.group(gp); icono(ic, w / 2, 130); ic.style.color = last ? C.rosa : C.blanco;
        texto(gp, l1, w / 2, 250, { anchor: 'middle', size: 25, peso: 700, fill: last ? C.rosa : C.blanco });
        texto(gp, l2, w / 2, 284, { anchor: 'middle', size: 22, peso: 400, fill: C.texto });
        const ta = Wd('B7', pal) - 0.2;
        s.on(t => { const v = win(t, ta, b, .45, .5); opa(gp, v); pos(gp, x, y0 + (1 - eo(ramp(t, ta, ta + .45))) * 14); });
        if (i < pasos.length - 1) {
          const fl = N.group(g); flecha(fl, x + w + 6, y0 + h / 2, x + w + gap - 6, y0 + h / 2, { w: 3, cab: 12 }); fl.style.color = C.suave;
          mostrarEn(s, fl, Wd('B7', pasos[i + 1][2]) - 0.35, b);
        }
      });
    });
  }
  /** Mapa de Europa: aparece en t0 con Hungría en rosa; luego se marcan otros lugares (pin + nombre)
      y, desde tPuntos, se van apagando uno a uno, como unos puntos suspensivos. Se va en tFin. */
  function mapaEuropa(s, parent, t0, tFin, otros, tPuntos) {
    const MP = window.MAPA_EUROPA; if (!MP) return;
    const mx = CX - MP.w / 2, my = 548 - MP.h / 2;
    const GM = N.group(parent);
    const id = 'm' + Math.random().toString(36).slice(2, 7);
    const defs = N.el('defs', null, GM);
    const rg = N.el('radialGradient', { id: id + 'g', cx: .5, cy: .5, r: .62 }, defs);
    N.el('stop', { offset: 0, 'stop-color': '#fff' }, rg); N.el('stop', { offset: .68, 'stop-color': '#fff' }, rg); N.el('stop', { offset: 1, 'stop-color': '#000' }, rg);
    const mk = N.el('mask', { id: id + 'k', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: MP.w, height: MP.h }, defs);
    N.el('rect', { x: 0, y: 0, width: MP.w, height: MP.h, fill: `url(#${id}g)` }, mk);
    const M = N.group(GM); M.setAttribute('mask', `url(#${id}k)`);
    N.el('rect', { x: 0, y: 0, width: MP.w, height: MP.h, fill: '#081628', opacity: 0.82 }, M);   // mar oscuro: el mapa se lee sobre la foto
    const pais = {};
    for (const p of MP.paises) pais[p.id] = N.el('path', { d: p.d, fill: 'rgba(255,255,255,0.09)', stroke: 'rgba(255,255,255,0.42)', 'stroke-width': 1.1, 'stroke-linejoin': 'round' }, M);
    const ISO = { HU: '348', GB: '826', DE: '276', BG: '100' };
    const etiqueta = (gp, txt, col) => {
      const t = texto(gp, txt, 0, -74, { anchor: 'middle', size: 27, peso: 800, ls: '0.1em', fill: col });
      t.setAttribute('stroke', '#081628'); t.setAttribute('stroke-width', 7); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round');
    };
    const marca = (k, txt, col, ta, tb) => {
      const [x, y] = MP.centros[k];
      const gp = N.group(GM), ic = N.group(gp); iconoPin(ic, 0, -30); gp.style.color = col;
      etiqueta(gp, txt, col);
      const pp = pais[ISO[k]];
      s.on(t => {
        const v = win(t, ta, tb, .35, .4); opa(gp, v);
        if (v > 0) pos(gp, x, y - (1 - eo(ramp(t, ta, ta + .35))) * 22);
        if (k !== 'HU') pp.setAttribute('fill', `rgba(255,255,255,${(0.09 + 0.22 * v).toFixed(3)})`);
      });
    };
    // el mapa entero (con un leve acercamiento)
    s.on(t => {
      const v = win(t, t0, tFin, .6, .5); opa(GM, v);
      const z = 1.035 - 0.035 * eo(ramp(t, t0, t0 + 1.2));
      GM.setAttribute('transform', `translate(${CX},548) scale(${z.toFixed(4)}) translate(${-CX + mx},${-548 + my})`);
      const kh = ease(ramp(t, t0 + 0.2, t0 + 0.7));
      pais[ISO.HU].setAttribute('fill', mezcla('#1a2333', C.rosa, kh));
      pais[ISO.HU].setAttribute('fill-opacity', (0.35 + 0.55 * kh).toFixed(3));
    });
    marca('HU', 'HUNGRÍA', C.rosa, t0 + 0.3, tFin);
    otros.forEach(([k, txt, ta], i) => marca(k, txt, C.blanco, ta, tPuntos + 0.3 * i + 0.45));
  }

  /** Lápiz pequeño con la punta en (0,0), inclinado como al escribir. */
  function dibujoLapiz(g) {
    const P = N.group(g); P.setAttribute('transform', 'rotate(-52)');
    N.el('path', { d: 'M0,0 L17,-6.5 L17,6.5 Z', fill: '#e9d3ad', stroke: C.blanco, 'stroke-width': 2, 'stroke-linejoin': 'round' }, P);
    N.el('path', { d: 'M0,0 L6.5,-2.5 L6.5,2.5 Z', fill: C.rosa }, P);
    N.el('rect', { x: 17, y: -6.5, width: 60, height: 13, fill: '#0b1320', stroke: C.blanco, 'stroke-width': 2 }, P);
    N.el('rect', { x: 77, y: -6.5, width: 10, height: 13, fill: '#94a3b8', stroke: C.blanco, 'stroke-width': 2 }, P);
    N.el('rect', { x: 87, y: -6.5, width: 9, height: 13, rx: 3, fill: C.rosa, stroke: C.blanco, 'stroke-width': 2 }, P);
  }

  // --- iconos de línea, mínimos
  function iconoAldea(g, cx, cy) {
    N.el('path', { d: `M${cx - 58},${cy + 40} L${cx - 58},${cy - 4} L${cx - 28},${cy - 30} L${cx + 2},${cy - 4} L${cx + 2},${cy + 40} Z M${cx + 2},${cy + 40} L${cx + 2},${cy + 6} L${cx + 30},${cy - 16} L${cx + 58},${cy + 6} L${cx + 58},${cy + 40} Z`, fill: 'none', stroke: 'currentColor', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    N.glyph(g, 'note8thUp', cx - 40, cy + 26, 11);
  }
  function iconoMicro(g, cx, cy) {   // bocina del fonógrafo + cilindro
    N.el('path', { d: `M${cx - 60},${cy + 20} L${cx - 10},${cy + 8} L${cx + 50},${cy - 40} L${cx + 50},${cy + 56} L${cx - 10},${cy + 18} Z`, fill: 'none', stroke: 'currentColor', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    N.el('rect', { x: cx - 66, y: cy + 30, width: 60, height: 22, rx: 6, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 }, g);
  }
  function iconoPartitura(g, cx, cy) {
    for (let k = -2; k <= 2; k++) N.line(g, cx - 64, cy + k * 12, cx + 40, cy + k * 12, 2.5);
    N.glyph(g, 'noteheadBlack', cx - 40, cy + 6, 12); N.line(g, cx - 40 + 13, cy + 4, cx - 40 + 13, cy - 36, 2.5);
    N.glyph(g, 'noteheadBlack', cx - 6, cy - 6, 12); N.line(g, cx - 6 + 13, cy - 8, cx - 6 + 13, cy - 48, 2.5);
    N.el('path', { d: `M${cx + 34},${cy + 44} L${cx + 64},${cy - 30} L${cx + 74},${cy - 26} L${cx + 44},${cy + 48} Z`, fill: 'none', stroke: 'currentColor', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
  }
  function iconoLupa(g, cx, cy) {
    N.el('circle', { cx: cx - 10, cy: cy - 8, r: 36, fill: 'none', stroke: 'currentColor', 'stroke-width': 4.5 }, g);
    N.line(g, cx + 16, cy + 18, cx + 50, cy + 52, 7, { 'stroke-linecap': 'round' });
    N.glyph(g, 'note8thUp', cx - 24, cy + 8, 10);
  }
  function iconoCompas(g, cx, cy) {
    N.el('rect', { x: cx - 50, y: cy - 58, width: 100, height: 116, rx: 12, fill: 'none', stroke: 'currentColor', 'stroke-width': 3.5, 'stroke-dasharray': '11 8' }, g);
    N.compas(g, { tipo: 'interrogante' }, cx - 15, cy + 2, 13);
  }

  // ================================================================ C · TRES FORMAS DE UNA MISMA REALIDAD
  const TIPOS = [
    { clave: 'MIXTO', spec: { tipo: 'mixto', partes: [{ num: '2', den: '4' }, { num: '1', den: '8' }] }, ritmo: [{ n: 'q' }, { n: 'q' }, { div: 'discontinua', pre: 1.4, post: 1.6 }, { n: '8' }] },
    { clave: 'DECIMAL', spec: { tipo: 'decimal', ent: '2', dec: '5', den: '4' }, ritmo: [{ n: 'q' }, { n: 'q' }, { n: '8' }] },
    { clave: 'FRACCIONARIO', spec: { tipo: 'frac', base: '2', signo: '+', n: '1', d: '2', den: '4' }, ritmo: [{ n: 'q' }, { n: 'q' }, { n: '8' }] },
  ];
  function filaNotacion(parent, spec, items, x, yMid, opt) {
    opt = opt || {};
    const g = N.group(parent, 'fila');
    const c = N.compas(g, spec, x, yMid, SP);
    const r = N.ritmo(g, items, x + c.w + (opt.sep || 2.2) * SP, yMid, { sp: SP, espacio: opt.espacio });
    g._c = c; g._r = r; g._w = c.w + (opt.sep || 2.2) * SP + r.w;
    const ult = r.els[r.els.length - 1];
    const finR = !ult ? r.w : (ult.tipo === 'div' ? ult.x - (x + c.w + (opt.sep || 2.2) * SP) + (ult.clase === 'doble' ? 0.75 : 0.2) * SP
      : ult.x - (x + c.w + (opt.sep || 2.2) * SP) + ((ult.it.n === '8' || ult.it.n === '16' || ult.it.n === '32') ? 1.95 : 1.3) * SP);
    g._wv = c.w + (opt.sep || 2.2) * SP + finR;          // ancho que se ve
    return g;
  }
  function escenaTresFormas() {
    const a = F0('C1') - 0.2, b = F0('D1') - 0.2;
    escena('tres', a, b, (s, g) => {
      const tit = texto(g, 'COMPASES EXTRAÑOS', CX, 250, { anchor: 'middle', size: 64, peso: 800, ls: '0.06em', fill: C.blanco });
      aparece(s, tit, F0('C1') + 0.1, b, { dy: 10 });
      const ch = 400, gap = 56, pad = 60, y0 = 360;
      const tC2 = Wd('C2', 'tres') - 0.2;
      const tMisma = Wd('C2', 'misma');
      // cada tarjeta, a la medida de su ejemplo (la del mixto es la más larga)
      const cards = TIPOS.map((tp, i) => {
        const gc = N.group(g);
        const rect = panel(gc, 0, 0, 100, ch);
        const f = filaNotacion(gc, tp.spec, tp.ritmo, 0, 0, { sep: 1.8, espacio: { q: 3.6, '8': 3 } });
        const cw = Math.max(440, Math.round(f._wv + 2 * pad));
        rect.setAttribute('width', cw);
        chip(gc, tp.clave, cw / 2, 56, { size: 22, anchor: 'middle', relleno: false, borde: 'rgba(255,255,255,.4)', colorTexto: C.texto });
        pos(f, (cw - f._wv) / 2, 250);
        resalta(s, f._r.g, tMisma, F1('C2') + 1.2);
        return { gc, cw };
      });
      let xc = CX - (cards.reduce((acc, c) => acc + c.cw, 0) + 2 * gap) / 2;
      cards.forEach((c, i) => {
        c.x = xc; xc += c.cw + gap;
        const ta = tC2 + i * 0.35;
        s.on(t => { const v = win(t, ta, b, .5, .5); opa(c.gc, v); pos(c.gc, c.x, y0 + (1 - eo(ramp(t, ta, ta + .5))) * 16); });
      });
      // «=» entre tarjetas
      for (let i = 0; i < 2; i++) {
        const eq = texto(g, '=', cards[i].x + cards[i].cw + gap / 2, y0 + 262, { anchor: 'middle', size: 64, peso: 300, fill: C.rosa });
        mostrarEn(s, eq, tMisma + 0.2, F1('C2') + 1.2);
      }
      const lema = texto(g, [['tres formas de escribir ', C.texto], ['la misma realidad', C.rosa]], CX, 850, { anchor: 'middle', size: 34, peso: 600 });
      mostrarEn(s, lema, tMisma, b);
    });
  }

  // ================================================================ indicador de apartados (arriba a la derecha)
  function indicador() {
    const a = F1('C3') - 0.3, b = F0('COLA') + 0.3;
    escena('indicador', a, b, (s, g) => {
      const nombres = [['MIXTOS', 'D1', 'E1'], ['DECIMALES', 'E1', 'F1'], ['FRACCIONARIOS', 'F1', 'G1']];
      let x = 1830;
      const chips = [];
      for (let i = nombres.length - 1; i >= 0; i--) {
        const [nm, ta, tb] = nombres[i];
        const c = chip(g, nm, x, 70, { size: 16, anchor: 'end', relleno: false, borde: 'rgba(255,255,255,.28)', colorTexto: C.suave });
        chips[i] = c; x -= c._w + 12;
        const r = c._rect, tx = c._txt;
        s.on(t => {
          const k = win(t, F0(ta) - 0.2, F0(tb) - 0.2, .35, .35);
          r.setAttribute('fill', k > .5 ? C.rosa : 'none');
          r.setAttribute('stroke', k > .5 ? C.rosa : 'rgba(255,255,255,.28)');
          tx.setAttribute('fill', k > .5 ? '#fff' : (t > F0(tb) ? C.texto : C.suave));
        });
      }
      s.on(t => opa(g, win(t, a, b, .6, .6)));
    });
  }

  // ================================================================ D · MIXTOS
  function tituloSeccion(nombre, id, hasta) {
    const a = F0(id) + 0.25, b = hasta;          // entra cuando la escena anterior ya se ha ido
    escena('tit-' + nombre, a, b, (s, g) => {
      const t = texto(g, nombre, CX, 560, { anchor: 'middle', size: 104, peso: 800, ls: '0.08em', fill: C.blanco });
      const r = N.el('rect', { x: CX - 60, y: 598, width: 120, height: 5, rx: 2.5, fill: C.rosa }, g);
      s.on(tt => opa(g, win(tt, a, b, .45, .45)));
    });
  }
  function escenaMixtos() {
    tituloSeccion('MIXTOS', 'D1', F0('D2') + 0.2);
    // D2 · mixto = mezcla  (MIXTO centrado; al decir «mezcla» se aparta y entra «= MEZCLA»)
    escena('mezcla', F0('D2'), F1('D2') + 0.6, (s, g) => {
      const b = F1('D2') + 0.6;
      const t1 = texto(g, 'MIXTO', 0, 560, { anchor: 'middle', size: 96, peso: 800, ls: '0.06em', fill: C.blanco });
      const t2 = N.group(g);
      const tEq = texto(t2, '=', 0, 560, { anchor: 'start', size: 96, peso: 300, fill: C.suave });
      const tMz = texto(t2, 'MEZCLA', 0, 560, { anchor: 'start', size: 96, peso: 800, ls: '0.06em', fill: C.rosa });
      const wEq = D.medir(tEq); tMz.setAttribute('x', (wEq + 44).toFixed(1));
      const w1 = D.medir(t1) + 0.06 * 96 * 5, w2 = wEq + 44 + D.medir(tMz), gap = 70, tot = w1 + gap + w2;
      const tMix = Wd('D2', 'mixto') - 0.2, tMez = Wd('D2', 'mezcla') - 0.15;
      s.on(t => {
        const k = ease(ramp(t, tMez, tMez + 0.45));
        opa(t1, win(t, tMix, b, .35, .4));
        t1.setAttribute('x', lerp(CX, CX - tot / 2 + w1 / 2, k).toFixed(1));
        opa(t2, win(t, tMez, b, .35, .4));
        t2.setAttribute('transform', `translate(${(CX - tot / 2 + w1 + gap + (1 - k) * 30).toFixed(1)},0)`);
      });
    });
    // D3–D5 · denominadores distintos · amalgama vs mixto
    const a = F0('D3') - 0.1, b = Wd('D6', 'como') - 0.25;   // sigue en «no se puede ni pretende unificarse»
    escena('amalgama', a, b, (s, g) => {
      const tAm = Wd('D4', 'amalgama') - 0.2;
      const pw = 870, ph = 470, py = 300;
      // panel MIXTO (derecha cuando aparece la amalgama; centrado antes)
      const PM = N.group(g);
      panel(PM, 0, 0, pw, ph);
      chip(PM, 'MIXTO', pw / 2, 52, { size: 22, anchor: 'middle' });
      const fm = filaNotacion(PM, { tipo: 'mixto', partes: [{ num: '2', den: '4' }, { num: '1', den: '8' }] }, [{ n: 'q' }, { n: 'q' }, { div: 'discontinua', pre: 1.3, post: 1.6 }, { n: '8' }, { div: 'doble', pre: 0.9, post: 0 }], 0, 0, { sep: 1.9, espacio: { q: 3.2 } });
      pos(fm, (pw - fm._w) / 2, 215);
      const capM = texto(PM, 'denominadores distintos', pw / 2, 420, { anchor: 'middle', size: 30, peso: 700, fill: C.rosa });
      const tDen = Wd('D3', 'denominadores') - 0.1;
      mostrarEn(s, capM, tDen, b);
      const dens = fm._c.partes.terminos.map(tm => tm.partes.den);
      dens.forEach(d => resalta(s, d, tDen, null));
      // barras de pulso bajo cada nota
      const pulsos = (fila, durs, y) => {
        const gp = N.group(fila);
        fila._r.notas.forEach((n, i) => {
          const w = durs[i] * SP * 0.95;
          const r = N.el('rect', { x: n.x, y: y, width: w, height: 10, rx: 5, fill: 'currentColor' }, N.group(gp));
          n.pulso = r.parentNode;
        });
        return gp;
      };
      const pm = pulsos(fm, [3.0, 3.0, 1.5], 3.3 * SP);
      // panel AMALGAMA (izquierda)
      const PA = N.group(g);
      panel(PA, 0, 0, pw, ph);
      chip(PA, 'AMALGAMA', pw / 2, 52, { size: 22, anchor: 'middle', relleno: false, borde: 'rgba(255,255,255,.45)', colorTexto: C.texto });
      const fa = filaNotacion(PA, { tipo: 'mixto', partes: [{ num: '2', den: '4' }, { num: '3', den: '4' }] }, [{ n: 'q' }, { n: 'q' }, { div: 'discontinua', pre: 1.3, post: 1.6 }, { n: 'q' }, { n: 'q' }, { n: 'q' }, { div: 'doble', pre: 0.9, post: 0 }], 0, 0, { sep: 1.9, espacio: { q: 3.2 } });
      pos(fa, (pw - fa._w) / 2, 215);
      const capA = texto(PA, 'mismo denominador', pw / 2, 420, { anchor: 'middle', size: 30, peso: 700, fill: C.blanco });
      const tMismo = Wd('D5', 'mismo') - 0.1;
      mostrarEn(s, capA, tMismo, b);
      fa._c.partes.terminos.map(tm => tm.partes.den).forEach(d => resalta(s, d, tMismo, null, { a: C.blanco, de: C.blanco }));
      const pa = pulsos(fa, [3.0, 3.0, 3.0, 3.0, 3.0], 3.3 * SP);
      const tPulso = Wd('D5', 'pulso') - 0.1, tAqui = Wd('D5', 'aqui') - 0.1;
      mostrarEn(s, pa, tPulso, b); mostrarEn(s, pm, tPulso + 0.25, b);
      color(pa, C.blanco); color(pm, C.blanco);
      resalta(s, fm._r.notas[2].pulso, tAqui, null);
      resalta(s, fm._r.notas[2].g, tAqui, null);
      // colocación: el mixto va centrado hasta que aparece la amalgama
      // guiar la vista: el lado del que NO se habla se vuelve semitransparente
      const tHablaA = F0('D5') - 0.1;
      s.on(t => {
        const k = ease(ramp(t, tAm, tAm + 0.7));
        const kA = ease(ramp(t, tHablaA, tHablaA + 0.45)) - ease(ramp(t, tAqui - 0.1, tAqui + 0.35));   // se habla de la amalgama
        const kM = ease(ramp(t, tAqui - 0.1, tAqui + 0.35));                                          // «Aquí no»: se habla del mixto
        const vM = win(t, a, b, .5, .5) * (1 - 0.7 * kA);
        opa(PM, vM); pos(PM, lerp(CX - pw / 2, CX + 14, k), py + (1 - eo(ramp(t, a, a + .5))) * 14);
        const vA = win(t, tAm + 0.2, b, .5, .5) * (1 - 0.7 * kM);
        opa(PA, vA); pos(PA, CX - pw - 14, py + (1 - eo(ramp(t, tAm + .2, tAm + .7))) * 14);
      });
    });
    // D6 · agua y aceite · alternarlos
    escena('agua', F0('D6') - 0.1, F0('D7') + 0.3, (s, g) => {
      const a = F0('D6') - 0.1, b = F0('D7') + 0.3;
      const tAg = Wd('D6', 'agua') - 0.1, tAlt = Wd('D6', 'interesante') - 0.2;
      // vaso
      const V = N.group(g);
      const vx = 300, vy = 300, vw = 300, vh = 420;
      const aceite = N.el('path', { fill: C.aceite, opacity: .85 }, V);
      const agua = N.el('path', { fill: C.agua, opacity: .85 }, V);
      N.el('path', { d: `M${vx},${vy} L${vx + 22},${vy + vh} L${vx + vw - 22},${vy + vh} L${vx + vw},${vy}`, fill: 'none', stroke: C.blanco, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, V);
      texto(V, 'aceite', vx + vw + 30, vy + 150, { size: 28, peso: 700, fill: C.aceite });
      texto(V, 'agua', vx + vw + 30, vy + 330, { size: 28, peso: 700, fill: C.agua });
      const cA = N.group(V); N.compas(cA, { tipo: 'simple', num: '1', den: '8' }, vx + vw / 2 - 22, vy + 150, SP); color(cA, '#1a1200');
      const cB = N.group(V); N.compas(cB, { tipo: 'simple', num: '2', den: '4' }, vx + vw / 2 - 24, vy + 320, SP); color(cB, '#08213f');
      s.on(t => {
        const v = win(t, tAg, b, .5, .5); opa(V, v); if (v <= 0) return;
        const yI = vy + 230, yT = vy + 70;
        const ola = x => Math.sin(x * 0.045 + t * 2.2) * 6;
        const xl = y => lerp(vx, vx + 22, (y - vy) / vh), xr = y => lerp(vx + vw, vx + vw - 22, (y - vy) / vh);
        let dI = ''; const n = 24;
        for (let i = 0; i <= n; i++) { const x = lerp(xl(yI), xr(yI), i / n); dI += (i ? 'L' : 'M') + x.toFixed(1) + ',' + (yI + ola(x)).toFixed(1); }
        agua.setAttribute('d', dI + ` L${xr(vy + vh).toFixed(1)},${vy + vh} L${xl(vy + vh).toFixed(1)},${vy + vh} Z`);
        let dT = ''; for (let i = 0; i <= n; i++) { const x = lerp(xl(yT), xr(yT), i / n); dT += (i ? 'L' : 'M') + x.toFixed(1) + ',' + (yT + ola(x + 40) * 0.6).toFixed(1); }
        aceite.setAttribute('d', dT + ` L${xr(yI).toFixed(1)},${yI} ` + Array.from({ length: n + 1 }, (_, i) => { const x = lerp(xr(yI), xl(yI), i / n); return 'L' + x.toFixed(1) + ',' + (yI + ola(x)).toFixed(1); }).join(' ') + ' Z');
      });
      // alternancia: largo · largo · corto
      const A = N.group(g);
      // ♩ ♩ ⋮ ♪ | ♩ ♩ ⋮ ♪ | ♩ ♩ ⋮ ♪ |  — discontinua entre el agua (2/4) y el aceite (1/8); continua entre compases
      const disc = () => ({ div: 'discontinua', pre: 0.9, post: 1.2 }), barra = (post) => ({ div: 'simple', pre: 1.2, post });
      const f = N.ritmo(A, [{ n: 'q' }, { n: 'q' }, disc(), { n: '8' }, barra(1.3), { n: 'q' }, { n: 'q' }, disc(), { n: '8' }, barra(1.3), { n: 'q' }, { n: 'q' }, disc(), { n: '8' }, barra(0)], 0, 0, { sp: SP, espacio: { q: 2.9, '8': 2.2 } });
      const xA = 820;
      const barras = f.notas.map((nn, i) => { const gb = N.group(A); const w = (i % 3 === 2 ? 1.1 : 2.3) * SP; N.el('rect', { x: nn.x, y: 3.3 * SP, width: w, height: 10, rx: 5, fill: 'currentColor' }, gb); return gb; });
      const lab = texto(A, [['largo · largo · ', C.agua], ['corto', C.aceite]], 0, 5.6 * SP, { size: 28, peso: 700 });
      s.on(t => {
        const v = win(t, tAlt, b, .5, .5); opa(A, v); if (v <= 0) return;
        pos(A, xA, 470 + (1 - eo(ramp(t, tAlt, tAlt + .5))) * 14);
        const ciclo = 1.35, ph = ((t - tAlt) % ciclo + ciclo) % ciclo;       // pulso que recorre el patrón
        const tt = [0, .5, 1.0];
        f.notas.forEach((nn, i) => {
          const j = i % 3, grupo = Math.floor(i / 3);
          const on = (Math.floor((t - tAlt) / ciclo) % 3 === grupo) && ph >= tt[j] && ph < (j < 2 ? tt[j + 1] : ciclo);
          const c = j === 2 ? C.aceite : C.agua;                           // negras = agua (azul) · corchea = aceite (amarillo)
          color(nn.g, on ? mezcla(c, '#ffffff', .25) : c);
          color(barras[i], on ? mezcla(c, '#ffffff', .25) : mezcla(c, '#0b1320', .45));
        });
      });
    });
    // D7–D10 · los ejemplos del PDF que él lee (2/4+1/8 y 2/4+3/16) + la línea discontinua
    escena('ejemplosMixtos', F0('D7') - 0.1, F0('E1') - 0.1, (s, g) => {
      const a = F0('D7') - 0.1, b = F0('E1') - 0.1;
      const P = N.group(g);
      panel(P, 330, 250, 1260, 560);
      mostrarEn(s, P, a, b, .5, .5);
      const filas = [
        { id: 'D7', spec: { tipo: 'mixto', partes: [{ num: '2', den: '4' }, { num: '1', den: '8' }] }, it: [{ n: '8' }], neg: 'negras', seg: 'corchea' },
        { id: 'D8', spec: { tipo: 'mixto', partes: [{ num: '2', den: '4' }, { num: '3', den: '16' }] }, it: [{ n: '16', barra: 'a' }, { n: '16', barra: 'a' }, { n: '16', barra: 'a' }], neg: 'negras', seg: 'semicorcheas' },
      ];
      const tGps = Wd('D10', 'gps') - 0.2, tDisc = Wd('D10', 'discontinua') - 0.2;
      filas.forEach((fz, i) => {
        const y = 420 + i * 250;
        const items = [{ n: 'q' }, { n: 'q' }, { div: 'discontinua', pre: 2.0, post: 2.2 }].concat(fz.it).concat([{ div: 'doble', pre: fz.it.length > 1 ? 3.8 : 5.2, post: 0 }]);
        const f = filaNotacion(g, fz.spec, items, 0, 0, { sep: 3.0, espacio: { q: 5.0 } });
        pos(f, 470, y);
        const ta = F0(fz.id) - 0.15;
        s.on(t => opa(f, win(t, ta, b, .45, .5)));
        const fin = F1(fz.id) + 0.4;
        // «dos negras…»: primera parte · «…una corchea / tres semicorcheas»: segunda parte
        const tNeg = Wd(fz.id, fz.neg) - 0.15, tSeg = Wd(fz.id, fz.seg) - 0.15;
        const term1 = f._c.partes.terminos[0].g, term2 = f._c.partes.terminos[1].g;
        const n1 = f._r.notas.slice(0, 2).map(n => n.g), n2 = f._r.notas.slice(2);
        [term1].concat(n1).forEach(e => resalta(s, e, tNeg, tSeg));
        [term2].concat(n2.map(n => n.g)).concat(n2[0].barras ? [n2[0].barras] : []).forEach(e => resalta(s, e, tSeg, fin));
        // línea discontinua: rosa y «GPS» al final
        const disc = f._r.els.find(e => e.tipo === 'div' && e.clase === 'discontinua');
        resalta(s, disc.g, tDisc, null);
        const pin = N.group(f); iconoPin(pin, disc.x, -3.9 * SP); pin.style.color = C.rosa;
        s.on(t => { const v = win(t, tGps + i * 0.12, b, .35, .4); opa(pin, v); if (v > 0) pin.setAttribute('transform', `translate(0,${(-(1 - eo(ramp(t, tGps + i * .12, tGps + i * .12 + .4))) * 18).toFixed(1)})`); });
      });
    });
  }
  function iconoPin(g, x, y) {
    N.el('path', { d: `M${x},${y + 30} C${x - 6},${y + 18} ${x - 20},${y + 8} ${x - 20},${y - 6} A20,20 0 1,1 ${x + 20},${y - 6} C${x + 20},${y + 8} ${x + 6},${y + 18} ${x},${y + 30} Z`, fill: 'currentColor' }, g);
    N.el('circle', { cx: x, cy: y - 6, r: 7, fill: '#0b1320' }, g);
  }

  // ================================================================ E · DECIMALES
  function escenaDecimales() {
    tituloSeccion('DECIMALES', 'E1', F0('E2') - 0.15);
    escena('decimales', F0('E2') - 0.15, F0('F1') + 0.2, (s, g) => {
      const a = F0('E2') - 0.15, b = F0('F1') + 0.2;
      const P = N.group(g); panel(P, 260, 210, 1400, 700); mostrarEn(s, P, a, b, .5, .5);
      // fila 1: 2’5 / 4  ♩ ♩ ♪
      const y1 = 400;
      const f1 = filaNotacion(g, { tipo: 'decimal', ent: '2', dec: '5', den: '4' }, [{ n: 'q' }, { n: 'q' }, { n: '8' }], 0, 0, { sep: 3.2, espacio: { q: 5.2 } });
      pos(f1, 520, y1);
      const pn = f1._c.partes;
      const tNum = Wd('E2', 'numerador') - 0.1, tDec = Wd('E2', 'decimales') - 0.1, tEj = Wd('E2', 'ejemplo') - 0.1;
      s.on(t => opa(pn.num, 1));
      // al principio solo el compás; las notas llegan con «dos negras y media»
      const tNeg = Wd('E3', 'negras') - 0.2, tMedia = Wd('E3', 'media') - 0.1, tCorch = Wd('E3', 'corchea') - 0.1;
      s.on(t => opa(f1, win(t, Math.max(tNum - 0.3, a + 0.2), b, .45, .5)));
      f1._r.notas.forEach((n, i) => s.on(t => opa(n.g, ease(ramp(t, (i < 2 ? tNeg + i * 0.25 : tCorch), (i < 2 ? tNeg + i * 0.25 : tCorch) + .3)))));
      resalta(s, pn.num, tNum, tDec);
      const cN = pn.cajaNum;
      const lblN = N.group(g);
      texto(lblN, 'numerador', 520 + cN.x - 48, y1 + cN.y + cN.h / 2 + 9, { anchor: 'end', size: 28, peso: 700, fill: C.rosa });
      flecha(lblN, 520 + cN.x - 42, y1 + cN.y + cN.h / 2, 520 + cN.x - 10, y1 + cN.y + cN.h / 2, { w: 3, cab: 11 });
      lblN.style.color = C.rosa;
      mostrarEn(s, lblN, tNum, Wd('E3', 'creo') - 0.2);
      resalta(s, pn.apos, tDec, null); resalta(s, pn.dec, tDec, null);
      // cuentas bajo las notas: 1 · 1 · ½
      const cuentas = ['1', '1', '½'];
      f1._r.notas.forEach((n, i) => {
        const c = texto(f1, cuentas[i], n.x + 0.6 * SP, 4.2 * SP, { anchor: 'middle', size: 30, peso: 700, fill: i === 2 ? C.rosa : C.suave });
        mostrarEn(s, c, i < 2 ? tNeg + i * 0.25 : tMedia);
      });
      resalta(s, f1._r.notas[2].g, tCorch, null);
      // «media negra = corchea»
      const eq1 = N.group(g);
      ecuacion(eq1, [['txt', '½'], ['fig', 'q'], ['txt', '='], ['fig', '8']], 1180, y1 + 10);
      revelaEnOrden(s, eq1._partes, tCorch + 0.1, 0.3, b);
      // fila 2: 2’25 / 4  ♩ ♩ 𝅘𝅥𝅯
      const y2 = 700;
      const tSemi = Wd('E4', 'semicorchea') - 0.1, tCalc = Wd('E4', 'veinticinco') - 0.25;
      const f2 = filaNotacion(g, { tipo: 'decimal', ent: '2', dec: '25', den: '4' }, [{ n: 'q' }, { n: 'q' }, { n: '16' }], 0, 0, { sep: 3.2, espacio: { q: 5.2 } });
      pos(f2, 520 - (f2._c.w - f1._c.w) / 2, y2);
      s.on(t => opa(f2._c.g, win(t, tCalc, b, .4, .5)));
      f2._r.notas.forEach((n, i) => s.on(t => opa(n.g, win(t, tSemi + (i < 2 ? 0 : 0.35), b, .35, .5))));
      resalta(s, f2._c.partes.apos, tCalc, null); resalta(s, f2._c.partes.dec, tCalc, null);
      resalta(s, f2._r.notas[2].g, tSemi + 0.35, null);
      const cu2 = ['1', '1', '¼'];
      f2._r.notas.forEach((n, i) => { const c = texto(f2, cu2[i], n.x + 0.6 * SP, 4.2 * SP, { anchor: 'middle', size: 30, peso: 700, fill: i === 2 ? C.rosa : C.suave }); mostrarEn(s, c, tSemi + (i < 2 ? 0 : 0.35)); });
      const eq2 = N.group(g);
      ecuacion(eq2, [['txt', '¼'], ['fig', 'q'], ['txt', '='], ['fig', '16']], 1180, y2 + 10);
      revelaEnOrden(s, eq2._partes, tSemi + 0.5, 0.3, b);
      // eco del dictado: ♪♪ ♩ 𝅘𝅥𝅯 cabe justo en 2’25/4
      const eco = N.group(g);
      const er = N.ritmo(eco, [{ n: '8', barra: 'e' }, { n: '8', barra: 'e' }, { n: 'q' }, { n: '16' }], 0, 0, { sp: SP * 0.62, espacio: { q: 4.4, '8': 2.6, '16': 3 }, grupoEsp: 2.4 });
      texto(eco, 'el ritmo del dictado', -26, 22, { anchor: 'end', size: 22, peso: 400, fill: C.suave });
      pos(eco, 1380, 842);
      mostrarEn(s, eco, F0('E5') - 0.2, b);
      color(eco, C.rosaClaro);
    });
  }
  /** Pequeña «ecuación» con figuras: [['txt','½'],['fig','q'],['txt','='],['fig','8']] */
  function ecuacion(g, partes, x, y) {
    let cx = x; g._partes = [];
    for (const [k, v] of partes) {
      const gp = N.group(g); g._partes.push(gp);
      if (k === 'txt') { const t = texto(gp, v, cx, y + 16, { size: 44, peso: 700, fill: v === '=' ? C.suave : C.rosa }); cx += D.medir(t) + 16; }
      else { N.figura(gp, v, cx, y + 20, SP); gp.style.color = C.rosa; cx += N.anchoFigura(v) * SP + 18; }
    }
    g._w = cx - x;
    return cx - x;
  }
  /** Muestra las partes de una ecuación poco a poco, de izquierda a derecha. */
  function revelaEnOrden(s, partes, t0, paso, tb) {
    partes.forEach((gp, i) => {
      const ta = t0 + i * paso;
      s.on(t => { const v = win(t, ta, tb, .3, .4); opa(gp, v); if (v > 0) pos(gp, -12 * (1 - eo(ramp(t, ta, ta + .3))), 0); });
    });
  }

  // ================================================================ F · FRACCIONARIOS
  function escenaFraccionarios() {
    tituloSeccion('FRACCIONARIOS', 'F1', F0('F2') + 0.05);
    // F2–F8 · de decimal a fracción · la confusión típica
    escena('fracciones', F0('F2') + 0.05, F0('F9') + 0.2, (s, g) => {
      const a = F0('F2') + 0.05, b = F0('F9') + 0.2;
      const P = N.group(g); panel(P, 160, 220, 1600, 680); mostrarEn(s, P, a, b, .5, .5);
      const cuid = chip(g, '¡CUIDADO!', CX, 292, { size: 20, anchor: 'middle', relleno: false });
      mostrarEn(s, cuid, Wd('F2', 'cuidado') - 0.2, F0('F3') + 1.0);
      const y = 520;
      // --- grupo izquierdo (lo que SÍ es): se centra y, cuando llega la confusión, se aparta a la izquierda
      const L = N.group(g);
      const tDecimal = Wd('F3', 'decimal') - 0.1, tMorph = Wd('F3', 'dos', 2) - 0.1;
      const tMas = Math.max(Wd('F3', 'mas') - 0.1, tMorph + 0.65), tMedio = Wd('F3', 'medio') + 0.15;
      // 2’5/4 → 2½/4: el 2 se aparta a la izquierda, el ’5 se va y aparece el ½
      const dec = N.group(L); const cDec = N.compas(dec, { tipo: 'decimal', ent: '2', dec: '5', den: '4' }, 0.7 * SP, y, SP);
      const fr = N.group(L); const cFr = N.compas(fr, { tipo: 'frac', base: '2', signo: '+', n: '1', d: '2', den: '4' }, 0, y, SP);
      const pd = cDec.partes, pf = cFr.partes;
      const dxE = pf.oBase.x - pd.oEnt.x, dxD = pf.oDen.x - pd.oDen.x;
      const fc = pf.cajaFrac, fcx = fc.x + fc.w / 2, fcy = fc.y + fc.h / 2;
      resalta(s, pd.apos, tDecimal, null); resalta(s, pd.dec, tDecimal, null);
      resalta(s, pf.frac, tMas, null);
      s.on(t => {
        // «como dos…»: el 2 se aparta a la izquierda (el ’5 sigue ahí, para que nunca se lea un 2/4)
        const kM = ease(ramp(t, tMorph, tMorph + 0.6));
        // «…más un medio»: el ’5 se va y en su sitio aparece el ½
        const kF = ease(ramp(t, tMas - 0.1, tMas + 0.25));
        const vIn = win(t, F0('F2') + 0.3, b, .4, .5);
        opa(dec, kF < 1 ? vIn : 0);
        pd.ent.setAttribute('transform', `translate(${(dxE * kM).toFixed(2)},0)`);
        pd.den.setAttribute('transform', `translate(${(dxD * kM).toFixed(2)},0)`);
        pd.ent.setAttribute('opacity', kM < 1 ? 1 : 0); pd.den.setAttribute('opacity', kM < 1 ? 1 : 0);
        [pd.apos, pd.dec].forEach(e => { e.setAttribute('opacity', (1 - kF).toFixed(3)); e.setAttribute('transform', `translate(${(10 * kF).toFixed(1)},${(-6 * kF).toFixed(1)})`); });
        opa(fr, kM >= 1 ? vIn : 0);
        const kN = eo(ramp(t, tMas, tMas + 0.45)), z = 0.55 + 0.45 * kN;
        pf.frac.setAttribute('opacity', ramp(t, tMas, tMas + 0.3).toFixed(3));
        pf.frac.setAttribute('transform', `translate(${fcx},${fcy}) scale(${z.toFixed(3)}) translate(${-fcx},${-fcy})`);
      });
      // «2 + ½», a la altura del numerador (a la izquierda, para no confundirlo con el denominador)
      const lab = texto(L, [['2 + ', C.texto], ['½', C.rosa]], -40, y - SP + 12, { anchor: 'end', size: 34, peso: 700 });
      mostrarEn(s, lab, tMedio, F0('F5') - 0.1);
      // ritmo y pulsos
      const tPul = Wd('F4', 'pulsos') - 0.2, tMed = Wd('F4', 'medio') - 0.1, tDen = Wd('F4', 'denominador') - 0.1;
      const rg = N.group(L);
      const xr = cFr.w + 2.8 * SP;
      const r = N.ritmo(rg, [{ n: 'q' }, { n: 'q' }, { n: '8' }], xr, y, { sp: SP, espacio: { q: 4.6 } });
      mostrarEn(s, rg, tPul, b);
      const cu = ['1', '1', '½'];
      r.notas.forEach((n, i) => { const c = texto(rg, cu[i], n.x + 0.6 * SP, y + 4.2 * SP, { anchor: 'middle', size: 30, peso: 700, fill: i === 2 ? C.rosa : C.suave }); mostrarEn(s, c, i < 2 ? tPul + i * .2 : tMed); });
      resalta(s, r.notas[2].g, tMed, null);
      // «…el valor del denominador»: solo una flecha que lo señala
      resalta(s, pf.den, tDen, F0('F5'));
      const flD = N.group(L); flecha(flD, -96, y + SP, pf.oDen.x - 12, y + SP, { w: 3.5, cab: 13 }); flD.style.color = C.rosa;
      mostrarEn(s, flD, tDen, F0('F5') - 0.1);
      const anchoL = xr + r.w;
      // F5–F6 · ¿otra figura? ¿otro compás? (óvalo sobre el numerito)
      const tNum = Wd('F6', 'numerito') - 0.2, tFig = Wd('F6', 'figura') - 0.2, tOtro = Wd('F6', 'compas', 2) - 0.2;
      const cf = pf.cajaFrac;
      const circ = N.el('ellipse', { cx: cf.x + cf.w / 2, cy: cf.y + cf.h / 2, rx: cf.w / 2 + 16, ry: cf.h / 2 + 12, fill: 'none', stroke: C.rosa, 'stroke-width': 3.5 }, L);
      mostrarEn(s, circ, tNum, F0('F7') + 0.1);
      const q1 = texto(L, '¿otra figura?', xr, y - 3.9 * SP, { size: 26, peso: 600, fill: C.suave, italic: true });
      const q2 = texto(L, '¿otro compás?', xr + 190, y - 3.9 * SP, { size: 26, peso: 600, fill: C.suave, italic: true });
      mostrarEn(s, q1, tFig, F0('F7') + 0.1); mostrarEn(s, q2, tOtro, F0('F7') + 0.1);
      // F7 · «Siempre hay el típico que ve esto…»: todo medio transparente y luego lo que él ve (2/4 + 1/2)
      const tTipico = Wd('F7', 'tipico') - 0.1, tPiensa = Wd('F7', 'piensa') - 0.1, tBlanca = Wd('F7', 'blanca') - 0.1;
      const tNo = Wd('F8', 'esto') - 0.1, tTam = Wd('F8', 'tamanos') - 0.3;
      const xIzq = 260, xCen = CX - anchoL / 2;
      s.on(t => {
        const k = ease(ramp(t, tPiensa - 0.2, tPiensa + 0.5)); pos(L, lerp(xCen, xIzq, k), 0);
        const dim = ease(ramp(t, tTipico, tTipico + 0.45)) - ease(ramp(t, tNo, tNo + 0.4));
        L.setAttribute('opacity', (1 - 0.7 * dim).toFixed(3));
      });
      const R = N.group(g);
      const xR = 930;
      const cm = N.compas(R, { tipo: 'mixto', partes: [{ num: '2', den: '4' }, { num: '1', den: '2' }] }, xR, y, SP);
      const rm = N.ritmo(R, [{ n: 'q' }, { n: 'q' }, { div: 'discontinua', pre: 1.5, post: 1.8 }, { n: 'h' }, { div: 'doble', pre: 2.2, post: 0 }], xR + cm.w + 2.2 * SP, y, { sp: SP, espacio: { q: 4.0, h: 4.4 } });
      const anchoR = cm.w + 2.2 * SP + rm.w;
      resalta(s, cm.partes.terminos[1].g, tPiensa + 0.6, null);
      // «…le añade una blanca»: la blanca se escribe a lápiz y luego queda la de verdad
      const hb = rm.notas[2];
      const lap = N.group(R); lap.style.color = C.rosa;
      const cont = N.el('path', { d: N.CONTORNO.noteheadHalf, transform: `translate(${hb.x},${hb.y}) scale(${SP})`, fill: 'none', stroke: 'currentColor',
        'stroke-width': 2.6, 'vector-effect': 'non-scaling-stroke', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, lap);
      const plicaL = N.el('line', { x1: hb.plicaX, y1: hb.yPlicaBase, x2: hb.plicaX, y2: hb.yPlicaTop, stroke: 'currentColor', 'stroke-width': N.E.stem * SP,
        'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, lap);
      const Lc = cont.getTotalLength();
      const lapiz = N.group(R); dibujoLapiz(lapiz);
      opa(hb.g, 0);
      s.on(t => {
        const k1 = ramp(t, tBlanca, tBlanca + 0.6), k2 = ramp(t, tBlanca + 0.6, tBlanca + 0.9);
        cont.setAttribute('stroke-dashoffset', (1 - k1).toFixed(4));
        plicaL.setAttribute('stroke-dashoffset', (1 - k2).toFixed(4));
        opa(lap, t < tBlanca - 0.02 ? 0 : 1 - ramp(t, tBlanca + 1.0, tBlanca + 1.3));
        let px, py;
        if (k1 < 1) { const p = cont.getPointAtLength(Lc * k1); px = hb.x + p.x * SP; py = hb.y + p.y * SP; }
        else { px = hb.plicaX; py = lerp(hb.yPlicaBase, hb.yPlicaTop, k2); }
        opa(lapiz, win(t, tBlanca - 0.2, tBlanca + 1.15, .2, .25));
        lapiz.setAttribute('transform', `translate(${px.toFixed(1)},${py.toFixed(1)})`);
        opa(hb.g, ease(ramp(t, tBlanca + 0.85, tBlanca + 1.15)));
      });
      resalta(s, hb.g, tBlanca, null);
      // F8 · «esto no es un compás mixto» · diferencia de tamaños
      const xx = N.group(g); aspa(xx, xR + anchoR / 2, y, 118, 8); xx.style.color = C.rojo;
      s.on(t => { opa(xx, win(t, tNo, b, .3, .5) * 0.9); opa(R, win(t, tPiensa, b, .45, .5) * (1 - 0.55 * ease(ramp(t, tNo, tNo + .4)))); });
      const lblOk = chip(L, 'FRACCIONARIO', anchoL / 2, 338, { size: 18, anchor: 'middle' });
      const lblNo = chip(g, 'NO ES UN MIXTO', xR + anchoR / 2, 338, { size: 18, anchor: 'middle', relleno: false, borde: C.rojo, colorTexto: C.rojo });
      mostrarEn(s, lblOk, tNo, b); mostrarEn(s, lblNo, tNo + 0.3, b);
      // tamaños: recuadro fino alrededor de la fracción pequeña y del «1/2» grande
      const caja = (parent, bb, txt, arriba) => {
        const cg = N.group(parent);
        N.el('rect', { x: bb.x - 10, y: bb.y - 8, width: bb.w + 20, height: bb.h + 16, rx: 8, fill: 'none', stroke: 'currentColor', 'stroke-width': 3 }, cg);
        texto(cg, txt, bb.x + bb.w / 2, arriba ? bb.y - 22 : bb.y + bb.h + 44, { anchor: 'middle', size: 24, peso: 700, fill: C.rosa });
        cg.style.color = C.rosa;
        mostrarEn(s, cg, tTam, b);
        return cg;
      };
      caja(L, cf, 'pequeño', true);
      caja(R, cm.partes.terminos[1].caja, 'grande', false);
    });
    // F9 · ¡FRACCIONARIO!
    // (la palabra se queda en F10: «…los fraccionarios también pueden escribirse restando»)
    const tFinPal = Wd('F11', 'ritmo') - 0.3;
    escena('palabra', F0('F9') - 0.1, tFinPal, (s, g) => {
      const tP = Wd('F9', 'fraccionario') - 0.25, tSube = Wd('F10', 'fraccionarios') - 0.3;
      const tPeq = Wd('F9', 'pequeno') - 0.05, tFrac = Wd('F9', 'fraccion') - 0.1;
      // «El número pequeño es una fracción, no un compás»: 2/4 y 1/2 del mismo tamaño…
      // …y el 1/2 se hace pequeño, se pone en horizontal y se coloca como la fracción de 2½/4
      const yM = 430, M = N.group(g);
      const specT = { tipo: 'frac', base: '2', signo: '+', n: '1', d: '2', den: '4' };
      const wT = N.anchoCompas(specT, SP), xT = CX - wT / 2;
      const w24 = N.anchoCompas({ tipo: 'simple', num: '2', den: '4' }, SP), w12 = N.anchoCompas({ tipo: 'simple', num: '1', den: '2' }, SP);
      const hueco = 1.4 * SP, xS = CX - (w24 + hueco + w12) / 2;
      const g24 = N.group(M), c24 = N.compas(g24, { tipo: 'simple', num: '2', den: '4' }, xS, yM, SP);
      const g12 = N.group(M), c12 = N.compas(g12, { tipo: 'simple', num: '1', den: '2' }, xS + w24 + hueco, yM, SP);
      const gT = N.group(M), cT = N.compas(gT, specT, xT, yM, SP);
      color(g12, C.rosa); color(cT.partes.frac, C.rosa);
      const mueve = (el, o, d, s1) => (k) => {
        const x = lerp(o.x, d.x, k), y = lerp(o.y, d.y, k), z = lerp(1, s1, k);
        el.setAttribute('transform', `translate(${x.toFixed(2)},${y.toFixed(2)}) scale(${z.toFixed(4)}) translate(${(-o.x).toFixed(2)},${(-o.y).toFixed(2)})`);
      };
      const m2 = mueve(c24.partes.num, c24.partes.oNum, cT.partes.oBase, 1), m4 = mueve(c24.partes.den, c24.partes.oDen, cT.partes.oDen, 1);
      const m1 = mueve(c12.partes.num, c12.partes.oNum, cT.partes.oN, cT.partes.oN.s), mD = mueve(c12.partes.den, c12.partes.oDen, cT.partes.oD, cT.partes.oD.s);
      s.on(t => {
        const v = win(t, F0('F9') - 0.1, F0('F10') + 0.3, .45, .45); opa(M, v);
        const k = ease(ramp(t, tPeq, tPeq + 1.1));
        m2(k); m4(k); m1(k); mD(k);
        const fin = k >= 1;
        opa(g24, fin ? 0 : 1); opa(g12, fin ? 0 : 1); opa(gT, fin ? 1 : 0);
        cT.partes.fs.setAttribute('opacity', '1');
      });
      // la barra de la fracción aparece al final del movimiento (dibujada sobre los grupos que se mueven)
      const barra = N.group(M); N.glyph(barra, 'timeSigFractionalSlash', cT.partes.oN.x + N.M.timeSig1.adv * cT.partes.oN.s * SP - 0.08 * SP, cT.partes.oN.y, SP, cT.partes.oN.s);
      color(barra, C.rosa);
      s.on(t => { const k = ramp(t, tPeq + 0.75, tPeq + 1.1); opa(barra, ramp(t, tPeq + 1.1, tPeq + 1.2) >= 1 ? 0 : k); });
      const cap = texto(g, 'Es una fracción, no un compás', CX, 600, { anchor: 'middle', size: 40, peso: 600, fill: C.texto });
      mostrarEn(s, cap, tFrac, tP - 0.1, .4, .35);
      const t2 = texto(g, [['FRACCION', C.rosa], ['ARIO', C.blanco]], CX, 660, { anchor: 'middle', size: 128, peso: 800, ls: '0.04em' });
      s.on(t => {
        const v = win(t, tP, tFinPal, .3, .4); opa(t2, v);
        const k = eo(ramp(t, tP, tP + .35)), dy = -190 * ease(ramp(t, tSube, tSube + .6));
        t2.setAttribute('transform', `translate(0,${dy.toFixed(1)}) translate(${CX},660) scale(${(0.9 + 0.1 * k).toFixed(3)}) translate(${-CX},-660)`);
      });
    });
    // F10–F11 · restando: «casi un 4/4» → «escribir 4/4» → «restarle lo que falta»
    const tFinResta = Wd('G1', 'toca') - 0.1;              // la ecuación se queda un momento mientras dice «Venga, ahora…»
    escena('resta', F0('F10') - 0.1, tFinResta, (s, g) => {
      const a = F0('F10') - 0.1, b = tFinResta;
      const tRes = Wd('F10', 'restando') - 0.2;
      const menos = N.group(g);
      texto(menos, '−', CX, 700, { anchor: 'middle', size: 200, peso: 300, fill: C.rosa });
      texto(menos, 'restando', CX, 790, { anchor: 'middle', size: 34, peso: 700, ls: '0.06em', fill: C.texto });
      aparece(s, menos, tRes, tFinPal, { dy: 12, fi: .35, fo: .4 });
      const P = N.group(g); panel(P, 260, 220, 1400, 660); mostrarEn(s, P, Wd('F11', 'ritmo') - 0.3, b, .5, .5);
      const y = 560, xL = 470;
      const tCasi = Wd('F11', 'casi') - 0.2, tEsc = Wd('F11', 'escribir') - 0.1;
      const tRest = Wd('F11', 'restarle') - 0.1, tFalta = Wd('F11', 'falta') - 0.1, tFin = F1('F11');
      // compases: 4/4 (al decir «escribir … cuatro por cuatro») → 4 −¼ / 4 (al decir «restarle»)
      const t44 = N.group(g); N.compas(t44, { tipo: 'simple', num: '4', den: '4' }, xL + 14, y, SP);
      const cf = N.group(g); const cFr = N.compas(cf, { tipo: 'frac', base: '4', signo: '-', n: '1', d: '4', den: '4' }, xL, y, SP);
      s.on(t => { opa(t44, win(t, tEsc, tRest + 0.25, .35, .3)); opa(cf, win(t, tRest, b, .3, .5)); });
      resalta(s, cFr.partes.frac, tRest + 0.1, null);
      // el ritmo «casi 4/4»: ♩ ♩ ♩ ♪. y la semicorchea que falta
      const xr = xL + cFr.w + 3 * SP;
      const rg = N.group(g);
      const rp = N.ritmo(rg, [{ n: 'q' }, { n: 'q' }, { n: 'q' }, { n: '8', punto: true }, { hueco: 2.2 }, { div: 'doble', pre: 1.0, post: 0 }], xr, y, { sp: SP, espacio: { q: 5 } });
      mostrarEn(s, rg, Wd('F11', 'ritmo') + 0.1, b);
      // «…el ritmo de uno de los aldeanos»: la aldea de antes, en la esquina
      const ald = N.group(g), ai = N.group(ald); iconoAldea(ai, 0, 0); ai.setAttribute('transform', 'scale(0.9)'); ald.style.color = C.suave;
      pos(ald, 352, 306); mostrarEn(s, ald, Wd('F11', 'aldeanos') - 0.2, b);
      const fx = rp.notas[3].x + 3.1 * SP;
      const fant = N.group(g);
      N.el('ellipse', { cx: fx + 0.59 * SP, cy: y + 1 * SP, rx: 0.62 * SP, ry: 0.46 * SP, fill: 'none', stroke: 'currentColor', 'stroke-width': 2.5, 'stroke-dasharray': '5 4', transform: `rotate(-20 ${fx + 0.59 * SP} ${y + SP})` }, fant);
      N.line(fant, fx + 1.12 * SP, y + 0.85 * SP, fx + 1.12 * SP, y - 2.5 * SP, 2, { 'stroke-dasharray': '5 4' });
      // …con los dos corchetes de la semicorchea, también en discontinua
      const anF = N.M.flag16thUp.an.stemUpNW;
      N.el('path', { d: N.CONTORNO.flag16thUp, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'vector-effect': 'non-scaling-stroke',
        'stroke-dasharray': '4 3', 'stroke-linejoin': 'round',
        transform: `translate(${(fx + 1.12 * SP - N.E.stem / 2 * SP - anF[0] * SP).toFixed(2)},${(y - 2.5 * SP + anF[1] * SP).toFixed(2)}) scale(${SP})` }, fant);
      const lf = texto(fant, 'falta', fx + 0.6 * SP, y + 3.7 * SP, { anchor: 'middle', size: 26, peso: 700, fill: C.rosa });
      mostrarEn(s, fant, tCasi + 0.4, b);
      s.on(t => { const k = ease(ramp(t, tFalta, tFalta + .35)); color(fant, mezcla('#64748b', C.rosa, k)); opa(lf, k); });
      const eq = N.group(g); ecuacion(eq, [['txt', '−¼'], ['fig', 'q'], ['txt', '='], ['fig', '16']], 470, 800);
      const nota = N.group(eq); texto(nota, '(la que falta)', 470 + eq._w + 14, 818, { size: 28, peso: 400, fill: C.suave });
      revelaEnOrden(s, eq._partes.concat([nota]), tFalta + 0.45, 0.34, b);
    });
  }

  // ================================================================ G · CIERRE
  function escenaCierre() {
    escena('cierre', Wd('G1', 'toca') - 0.1, F0('COLA') + 1.2, (s, g) => {
      const a = Wd('G1', 'toca') - 0.1, b = F0('COLA') + 1.2;
      const nombres = ['MIXTOS', 'DECIMALES', 'FRACCIONARIOS'];
      const tmp = N.group(g); const ws = nombres.map(n => chip(tmp, n, 0, 0, { size: 30 })._w); tmp.remove();
      const gap = 34, tot = ws.reduce((x, y) => x + y) + gap * 2; let x = CX - tot / 2;
      nombres.forEach((n, i) => {
        const c = chip(g, n, 0, 0, { size: 30 }); const ta = a + i * 0.25, xi = x;
        s.on(t => { const v = win(t, ta, b, .45, .9); opa(c, v); pos(c, xi, 520 + (1 - eo(ramp(t, ta, ta + .45))) * 14); });
        x += ws[i] + gap;
      });
      const t2 = texto(g, '¡A por los ejercicios!', CX, 640, { anchor: 'middle', size: 40, peso: 600, fill: C.texto });
      mostrarEn(s, t2, Wd('G1', 'ejercicios') - 0.2, b, .4, .9);
    });
  }

  // ================================================================ FINAL (norma 3): el título llega con el último acorde
  function escenaFinal() {
    const ta = T.acorde;
    escena('final', ta - 0.5, T.dur + 9999, (s, g) => {
      const gg = N.group(g);
      tituloGrande(gg);
      s.on(t => { const k = t >= ta ? eo(ramp(t, ta, ta + 0.35)) : 0; opa(gg, k); gg.setAttribute('transform', `translate(${CX},540) scale(${(0.97 + 0.03 * k).toFixed(4)}) translate(${-CX},-540)`); });
    });
  }

  // ================================================================ fondo: velo según el momento (norma 4)
  function veloFondo(t) {
    const tit = 1 - ease(ramp(t, F1('TITULO') - 1.0, F1('TITULO') + 0.3));
    const fin = ease(ramp(t, T.acorde - 0.05, T.acorde + 0.4));
    const foto = Math.max(win(t, F0('B1'), F0('B3') + 0.3, .6, .6), win(t, F0('B4'), F0('B5') + 0.6, .6, .6));
    let v = 0.70 - 0.17 * Math.max(tit, fin) + 0.08 * foto;
    return clamp(v, 0, 0.92);
  }

  // ================================================================ construir todo
  function construir(tiempos) {
    T = tiempos;
    esc.length = 0;
    const capa = document.getElementById('capaEscenas');
    while (capa.firstChild) capa.removeChild(capa.firstChild);
    escenaTitulo(); escenaDictado(); escenaBartok(); escenaNacionalismo(); escenaAldeas(); escenaPatron();
    escenaTresFormas(); indicador(); escenaMixtos(); escenaDecimales(); escenaFraccionarios(); escenaCierre(); escenaFinal();
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
