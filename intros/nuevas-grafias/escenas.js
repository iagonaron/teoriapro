/* =====================================================================
   ESCENAS · Nuevas grafías (2.º GP · Unidad 4)
   Cada escena se construye una vez (SVG) y luego se actualiza con el
   tiempo t del máster de audio: todo es función pura de t.
   Las marcas de tiempo salen de la narración (frases y palabras).
   Ejemplos fieles a los Apuntes de 2.º GP (pp. 16–18).
   ===================================================================== */
(function () {
  'use strict';
  const N = window.NOTA, D = window.DIB, C = D.C;
  const { ramp, ease, eo, lerp, win, clamp, mezcla, texto, panel, chip, flecha, tick, pos, opa, color } = D;
  const SP = N.SP = 24;                    // tamaño único de toda la grafía (norma 7)
  const W = 1920, H = 1080, CX = 960;
  const FT = D.FT;

  let T = null;
  const esc = [];

  // ---------------------------------------------------------------- marcas de tiempo
  const F0 = id => T.frase[id] ? T.frase[id].t0 : (T.bloque[id] ? T.bloque[id].t0 : 0);
  const F1 = id => T.frase[id] ? T.frase[id].t1 : (T.bloque[id] ? T.bloque[id].t1 : 0);
  const hay = id => !!(T.frase[id] || T.bloque[id]);
  const limpia = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,;:…«»"()—\-]/g, '');
  function Wd(id, pal, n) {
    const f = T.frase[id]; if (!f) return 0;
    const p = limpia(pal); let k = 0;
    for (const [w, t] of f.palabras) if (limpia(w).startsWith(p)) { k++; if (k === (n || 1)) return t; }
    console.warn('palabra no encontrada', id, pal, n); return f.t0;
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
    const x0 = o.x || 0, y0 = o.y || 0;
    s.on(t => {
      const v = win(t, ta, tb == null ? 1e9 : tb, fi, fo);
      opa(g, v);
      if (v > 0) pos(g, x0, y0 + (1 - eo(ramp(t, ta, ta + fi))) * dy);
    });
  }
  /** Colorea (currentColor) de blanco a rosa en [ta, tb]. Un mismo elemento puede tener varias ventanas: manda la más encendida. */
  function resalta(s, g, ta, tb, o) {
    if (!g) return;
    o = o || {};
    if (!g._resV) {
      const V = g._resV = [];
      s.on(t => {
        let k = 0, de = C.blanco, a2 = C.rosa;
        for (const v of V) {
          let kk = ease(ramp(t, v.ta, v.ta + v.d));
          if (v.tb != null) kk = Math.min(kk, 1 - ease(ramp(t, v.tb, v.tb + v.d)));
          if (kk > k) { k = kk; de = v.de; a2 = v.a; }
        }
        color(g, mezcla(de, a2, k));
      });
    }
    g._resV.push({ ta, tb, d: o.d || .35, de: o.de || C.blanco, a: o.a || C.rosa });
  }
  function mostrarEn(s, g, ta, tb, fi, fo) { s.on(t => opa(g, win(t, ta, tb == null ? 1e9 : tb, fi || .35, fo || .35))); }
  /** Opacidad «de guiar la vista»: lo que no se nombra se queda semitransparente. tramos = [[ta, tb, nivel], …] */
  function atenua(s, g, tramos) {
    s.on(t => {
      let v = 1;
      for (const [ta, tb, nivel] of tramos) {
        const k = Math.min(ease(ramp(t, ta, ta + .4)), tb == null ? 1 : 1 - ease(ramp(t, tb, tb + .4)));
        v = Math.min(v, 1 - (1 - nivel) * k);
      }
      g.setAttribute('opacity', v.toFixed(3));
    });
  }
  /** Colorea en rosa una lista de grupos a la vez. */
  const resaltaVarios = (s, gs, ta, tb, o) => gs.filter(Boolean).forEach(g => resalta(s, g, ta, tb, o));

  // ================================================================ 0 · TÍTULO (norma 5)
  function tituloGrande(g) {
    texto(g, 'GRADO PROFESIONAL  ·  UNIDAD 4', CX, 392, { anchor: 'middle', size: 26, peso: 800, ls: '0.3em', fill: C.rosa });
    texto(g, 'NUEVAS GRAFÍAS', CX, 528, { anchor: 'middle', size: 112, peso: 800, ls: '0.05em', fill: C.blanco });
    N.el('rect', { x: CX - 60, y: 566, width: 120, height: 5, rx: 2.5, fill: C.rosa }, g);
    texto(g, 'Ligaduras · Puntillos · Barrado · Compases', CX, 640, { anchor: 'middle', size: 38, peso: 400, fill: '#cbd5e1' });
  }
  function escenaTitulo() {
    const b = F1('TITULO');
    escena('titulo', -1, b, (s, g) => {
      const gg = N.group(g); tituloGrande(gg);
      s.on(t => opa(gg, 1 - ease(ramp(t, b - 1.2, b))));
    });
  }

  // ================================================================ A · LOS TRES COMPASES (a, b, c)
  // Libro, p. 16–17: el mismo ritmo (corchea · blanca · corchea) escrito en 3/4, en 6/8 y «a lo mínimo».
  function escenaABC() {
    const a = F0('I1') - 0.3, b = F0('R0') + 0.15;
    escena('abc', a, b, (s, g) => {
      const G = N.group(g); aparece(s, G, a, b, { dy: 16, fi: .7, fo: .6 });
      panel(G, 170, 190, 1580, 640);
      const yM = 470, x0 = 230;
      const ST = N.group(G, 'sistema');
      const PG = N.pentagrama(ST, x0, yM, 1460, SP);
      N.claveSol(ST, x0 + 18, yM, SP);
      const F4 = { altoNota: 1.5, espacio: { '8': 3.1, q: 4.2, h: 5.8 }, enGrupo: { '8': 2.6 } };
      // a) 3/4 · corchea, corchea⌒negra⌒corchea, corchea
      const RA = N.group(ST, 'a');
      const ra = N.ritmo2(RA, [
        { hueco: 2.6, marca: 'cifra' },
        { n: '8', barra: 'a1', id: 'n1' }, { n: '8', barra: 'a1', liga: true, id: 'n2' }, { n: 'q', liga: true, id: 'n3' },
        { n: '8', barra: 'a2', id: 'n4' }, { n: '8', barra: 'a2', id: 'n5' },
        { div: 'simple', pre: 1.1, post: 0.6 },
      ], x0 + 3.9 * SP, yM, Object.assign({ sp: SP }, F4));
      const xb = x0 + 3.9 * SP + ra.w;
      const RB = N.group(ST, 'b');
      const rb = N.ritmo2(RB, [
        { hueco: 2.6, marca: 'cifra' },
        { n: '8', id: 'n1' }, { n: 'q', liga: true, id: 'n2' }, { n: 'q', id: 'n3' }, { n: '8', id: 'n4' },
        { div: 'simple', pre: 1.1, post: 1.2 },
      ], xb, yM, Object.assign({ sp: SP }, F4));
      const xc = xb + rb.w;
      const RC = N.group(ST, 'c');
      const rc = N.ritmo2(RC, [
        { n: '8', id: 'n1' }, { n: 'h', id: 'n2' }, { n: '8', id: 'n3' },
        { div: 'final', pre: 1.1, post: 0 },
      ], xc, yM, Object.assign({ sp: SP }, F4, { espacio: { '8': 5.0, h: 6.6 } }));
      const xFin = xc + rc.w + 0.7 * SP;
      // el pentagrama se recorta justo tras la doble barra final
      PG.lineas.forEach(l => l.setAttribute('x2', xFin.toFixed(1)));
      // letras a) b) c)
      const etq = [[RA, ra, 'a)'], [RB, rb, 'b)'], [RC, rc, 'c)']];
      const centros = [];
      etq.forEach(([Gx, r, l], i) => {
        const xi = i === 0 ? x0 + 3.9 * SP : (i === 1 ? xb : xc);
        texto(Gx, l, xi + 0.2 * SP, yM - 3.7 * SP, { size: 30, peso: 800, fill: 'currentColor' });
        centros.push(xi + r.w / 2 - 0.3 * SP);
      });
      // cifras de compás (llegan cuando se nombran)
      const cA = N.compasNum(RA, '3', '4', ra.marcas.cifra.x + 0.25 * SP, yM, SP);
      const cB = N.compasNum(RB, '6', '8', rb.marcas.cifra.x + 0.25 * SP, yM, SP);
      const t34 = Wd('I3', 'tres') - 0.05, t68 = Wd('I3', 'seis') - 0.05;
      mostrarEn(s, cA.g, t34); resalta(s, cA.g, t34, t34 + 1.4);
      mostrarEn(s, cB.g, t68); resalta(s, cB.g, t68, t68 + 1.4);
      // marcas de pulso (como en el libro): 3 en a), 2 en b)
      const yP = yM + 3.35 * SP;
      const pulsos = (Gx, notas) => { const gp = N.group(Gx, 'pulsos'); notas.forEach(n => N.line(gp, n.x + 0.59 * SP, yP, n.x + 0.59 * SP, yP + 1.05 * SP, 0.16 * SP)); return gp; };
      const pA = pulsos(RA, [ra.marcas.n1, ra.marcas.n3, ra.marcas.n4]);
      const pB = pulsos(RB, [rb.marcas.n1, rb.marcas.n3]);
      mostrarEn(s, pA, t34 + 0.35); mostrarEn(s, pB, t68 + 0.35);
      const tAgr = Wd('I4', 'agrupan') - 0.1;
      resaltaVarios(s, [pA, pB], tAgr, Wd('T1', 'prioridad'));
      // ¿? bajo cada compás mientras se pregunta
      const tQ = Wd('I2', 'compas') - 0.05;
      const qs = centros.map((cx, i) => { const q = texto(G, '¿?', cx, yM + 5.6 * SP, { anchor: 'middle', size: 40, peso: 800, fill: C.rosa }); return q; });
      mostrarEn(s, qs[0], tQ, t34); mostrarEn(s, qs[1], tQ + 0.12, t68); mostrarEn(s, qs[2], tQ + 0.24, Wd('I3', 'seguro'));
      const tC = Wd('M1', 'c') - 0.1;
      // (6-nov, Iago) diez segundos para pensarlo, con su cuenta atrás (bloque PIENSA, sin voz)
      if (hay('PIENSA')) {
        const p0 = F0('PIENSA') + 0.3, p1 = p0 + 10, CR = N.group(G, 'cuenta');
        const cxr = CX, cyr = 736, rr = 46, circ = 2 * Math.PI * rr;
        N.el('circle', { cx: cxr, cy: cyr, r: rr, fill: 'none', stroke: 'rgba(255,255,255,0.14)', 'stroke-width': 8 }, CR);
        const arco = N.el('circle', { cx: cxr, cy: cyr, r: rr, fill: 'none', stroke: C.rosa, 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-dasharray': circ.toFixed(1), transform: `rotate(-90 ${cxr} ${cyr})` }, CR);
        const num = texto(CR, '10', cxr, cyr + 16, { anchor: 'middle', size: 44, peso: 800, fill: C.blanco });
        texto(CR, 'PIÉNSALO', cxr, cyr + 92, { anchor: 'middle', size: 20, peso: 800, ls: '0.3em', fill: C.suave });
        s.on(t => {
          const v = win(t, p0 - 0.4, p1 + 0.4, .35, .4); opa(CR, v); if (!v) return;
          arco.setAttribute('stroke-dashoffset', (circ * ramp(t, p0, p1)).toFixed(1));
          const n = String(Math.max(1, Math.ceil(p1 - t))); if (num.textContent !== n) num.textContent = n;
        });
      }
      const qc2 = texto(G, '¿?', centros[2], yM + 5.6 * SP, { anchor: 'middle', size: 40, peso: 800, fill: C.rosa });
      mostrarEn(s, qc2, Wd('M1', 'ninguna') - 0.1, Wd('M1', 'minimo'));
      // guiar la vista: lo que no se nombra, semitransparente
      const tMin = Wd('M1', 'minimo');
      // (5-nov, Iago) los tres iguales mientras se escuchan y se pregunta; luego, solo el que se nombra:
      // «en el a) y en el b)» → a y b · «En el a), tres por cuatro» → a · «En el b), seis por ocho» → b · los pulsos y la
      // notación tradicional → a y b · «¿Y el c)?» → c
      const tAB = Wd('I3', 'seguro') - 0.1, tSoloA = Wd('I3', 'en', 3) - 0.1, tSoloB = Wd('I3', 'en', 4) - 0.1, tPul = F0('I4') - 0.1;
      atenua(s, RA, [[tSoloB, tPul, 0.3], [tC, b, 0.3]]);
      atenua(s, RB, [[tSoloA, tSoloB, 0.3], [tC, b, 0.3]]);
      atenua(s, RC, [[tAB, tC, 0.3]]);
      // mientras suenan (SON_ABC), la nota que suena en rosa
      const son = F0('SON_ABC') + 0.35, neg = 60 / 84;      // 84 negras por minuto (como lo toca el piano)
      const sonar = (r, ids, durs, t0) => { let tt = t0; ids.forEach((id, i) => { const n = r.marcas[id]; const a0 = tt, a1 = tt + durs[i] * neg; resalta(s, n.g, a0, a1 - 0.05, { d: .08 }); if (n.barras) resalta(s, n.barras, a0, a1 - 0.05, { d: .08 }); tt = a1; }); return tt; };
      // a) suena: c, c⌒n⌒c (= blanca), c → la ligadura se oye como una sola nota
      let tt = son;
      [[ra, ['n1'], [0.5]], [ra, ['n2', 'n3', 'n4'], [0.5, 1, 0.5]], [ra, ['n5'], [0.5]]].forEach(([r, ids, d]) => { tt = sonar(r, ids, d, tt); });
      tt += 0.5 * neg;
      [[rb, ['n1'], [0.5]], [rb, ['n2', 'n3'], [1, 1]], [rb, ['n4'], [0.5]]].forEach(([r, ids, d]) => { tt = sonar(r, ids, d, tt); });
      tt += 0.5 * neg;
      sonar(rc, ['n1', 'n2', 'n3'], [0.5, 2, 0.5], tt);
      // ligaduras en rosa mientras suena su nota larga
      // c) nombra sus figuras: CORCHEA · BLANCA · CORCHEA
      const tCor1 = Wd('M1', 'corchea', 1), tBla = Wd('M1', 'blanca', 1), tCor2 = Wd('M1', 'corchea', 2);
      [['n1', 'CORCHEA', tCor1], ['n2', 'BLANCA', tBla], ['n3', 'CORCHEA', tCor2]].forEach(([id, txt, ta]) => {
        const n = rc.marcas[id];
        resalta(s, n.g, ta - 0.05, b);
        const l = texto(G, txt, n.x + 0.6 * SP, yM + 4.4 * SP, { anchor: 'middle', size: 17, peso: 800, ls: '0.1em', fill: C.rosa });
        mostrarEn(s, l, ta - 0.05, F0('M3') + 0.2);
      });
      // NOTACIÓN TRADICIONAL · AGRUPA POR PULSOS (sobre a y b)
      const tTr = Wd('T1', 'tradicional') - 0.1;
      const ch1 = chip(G, 'NOTACIÓN TRADICIONAL  ·  AGRUPA POR PULSOS', (x0 + xc) / 2 + 40, 262, { size: 22, anchor: 'middle' });
      mostrarEn(s, ch1, tTr, tC);
      // NUEVAS GRAFÍAS = ESCRITURA MODERNA (sobre c)
      const tNG = Wd('M2', 'nuevas') - 0.1;
      const ch2 = chip(G, 'NUEVAS GRAFÍAS  =  ESCRITURA MODERNA', 0, 262, { size: 22 }); pos(ch2, Math.min(centros[2] - ch2._w / 2, 1720 - ch2._w), 262);
      mostrarEn(s, ch2, tNG, b);
      // EL COMPÁS NO ES RELEVANTE · MÍNIMA EXPRESIÓN GRÁFICA · NOTACIÓN MINIMALISTA (de izquierda a derecha)
      const lemas = [['EL COMPÁS NO ES RELEVANTE', Wd('M3', 'relevante')], ['MÍNIMA EXPRESIÓN GRÁFICA', Wd('M3', 'minima')], ['NOTACIÓN MINIMALISTA', Wd('M3', 'minimalista')]];
      const tmp = N.group(G); const ws = lemas.map(([l]) => chip(tmp, l, 0, 0, { size: 20, relleno: false })._w); tmp.remove();
      const gap = 26; let xl = CX - (ws.reduce((p, q) => p + q) + gap * 2) / 2;
      lemas.forEach(([l, ta], i) => {
        const c = chip(G, l, xl, 752, { size: 20, relleno: false });
        mostrarEn(s, c, ta - 0.15, b); xl += ws[i] + gap;
      });
      // «finde»: el bocadillo de chat que se encoge (fin de semana → finde)
      if (hay('M4')) {
        const tq = Wd('M4', 'fin') - 0.15, tFinM4 = F1('M4') + 0.5;
        const B = N.group(G, 'chat');
        const caja = N.el('rect', { x: 0, y: -36, width: 300, height: 72, rx: 30, fill: C.rosa }, B);
        const t1 = texto(B, 'fin de semana', 28, 12, { size: 34, peso: 600, fill: '#fff' });
        const t2 = texto(B, 'finde', 28, 12, { size: 34, peso: 800, fill: '#fff' });
        const tEnc = Wd('M4', 'abreviada') - 0.15;
        s.on(t => {
          const v = win(t, tq, tFinM4, .35, .4); opa(B, v);
          const k = ease(ramp(t, tEnc, tEnc + 0.7));
          caja.setAttribute('width', lerp(300, 148, k).toFixed(1));
          opa(t1, 1 - ramp(t, tEnc, tEnc + 0.35)); opa(t2, ramp(t, tEnc + 0.3, tEnc + 0.65));
          pos(B, CX - lerp(150, 74, k), 650);
        });
      }
    });
  }

  // ================================================================ B · LOS CUATRO RECURSOS
  const RECURSOS = ['LIGADURAS', 'PUNTILLOS', 'BARRADO', 'COMPASES'];
  function escenaIndice() {
    const a = Wd('R0', 'cuatro') - 0.2, b = F0('D1') + 0.1;
    escena('indice', a, b, (s, g) => {
      const tmp = N.group(g); const ws = RECURSOS.map(n => chip(tmp, n, 0, 0, { size: 26 })._w); tmp.remove();
      const gap = 30, tot = ws.reduce((p, q) => p + q) + gap * 3;
      const ids = ['R1', 'R2', 'R3', 'R4'];
      let x = CX - tot / 2;
      RECURSOS.forEach((n, i) => {
        const lleno = chip(g, n, 0, 0, { size: 26 });
        const vacio = chip(g, n, 0, 0, { size: 26, relleno: false });
        const xi = x, ta = a + i * 0.22;
        const tR = F0(ids[i]) - 0.1, tFin = i < 3 ? F0(ids[i + 1]) - 0.1 : F0('D1');
        s.on(t => {
          const v = win(t, ta, b, .45, .5);
          // primero, en grande en el centro; con R1 suben arriba
          const k = ease(ramp(t, F0('R1') - 0.5, F0('R1') + 0.2));
          const y = lerp(540, 132, k) + (1 - eo(ramp(t, ta, ta + .45))) * 14;
          const act = Math.min(ease(ramp(t, tR, tR + .3)), 1 - ease(ramp(t, tFin, tFin + .3)));
          const ant = t < F0('R1') - 0.5 ? 1 : act;          // al principio, todos llenos
          opa(lleno, v * ant); opa(vacio, v * (1 - ant) * (t >= F0('R1') - 0.5 ? 1 : 0));
          pos(lleno, xi, y); pos(vacio, xi, y);
        });
        x += ws[i] + gap;
      });
    });
  }

  /** Marco común de cada recurso: panel, cabeceras «Escritura tradicional / moderna» y los «=». */
  function marcoRecurso(G, filasY) {
    panel(G, 170, 205, 1580, 700);
    texto(G, 'ESCRITURA TRADICIONAL', 600, 270, { anchor: 'middle', size: 21, peso: 800, ls: '0.18em', fill: C.suave });
    texto(G, 'ESCRITURA MODERNA', 1370, 270, { anchor: 'middle', size: 21, peso: 800, ls: '0.18em', fill: C.suave });
    const iguales = filasY.map(y => texto(G, '=', 995, y + 16, { anchor: 'middle', size: 64, peso: 300, fill: C.suave }));
    return iguales;
  }
  /** Una fila de ritmo, con cifra de compás opcional delante. */
  function fila(parent, items, x, yMid, cifra, opt) {
    const g = N.group(parent, 'fila');
    let cx = x, c = null;
    if (cifra) { c = N.compasNum(g, cifra[0], cifra[1], cx, yMid, SP); cx += c.w + 0.9 * SP; }
    const r = N.ritmo2(g, items, cx, yMid, Object.assign({ sp: SP, alto: 1.6 }, opt || {}));
    return { g, r, c, w: cx - x + r.w };
  }

  // ---------------------------------------------------------------- 1 · LIGADURAS
  /* (6-nov, Iago: «quiero que haya una animación de cada ritmo… que esté más tiempo en pantalla cada uno de los ritmos pasados a
     moderno») Tras la frase de las ligaduras viene el bloque LIG, sin voz: cada ritmo, uno a uno, SUENA (al piano, como lo dibuja),
     se pasa a moderno (una copia viaja y se funde en su fila moderna) y vuelve a sonar igual. Los tiempos los comparte mezcla.py. */
  const NEG = 60 / 84;
  const LIG_PLAN = [   // [inicio (s del bloque), duraciones que suenan (negras), grupos de notas que suenan juntas (ligadas)]
    { t: 0.0, durT: [0.5, 2, 0.5], grT: [[0], [1, 2], [3]], durM: [0.5, 2, 0.5] },
    { t: 7.4, durT: [0.5, 2, 0.5], grT: [[0], [1, 2], [3]], durM: [0.5, 2, 0.5] },
    { t: 14.8, durT: [0.5, 2, 1.5], grT: [[0], [1, 2, 3], [4, 5]], durM: [0.5, 2, 1.5] },
  ];
  window.LIG_PLAN = LIG_PLAN;
  function escenaLigaduras() {
    const a = F0('R1') - 0.2, b = F0('R2') - 0.1;
    escena('ligaduras', a, b, (s, g) => {
      const G = N.group(g); aparece(s, G, a, b, { dy: 16, fi: .6, fo: .45 });
      const Y = [372, 498, 650, 800];
      const ig = marcoRecurso(G, [435, 650, 800]);
      // 3/4 (dos maneras) = corchea · blanca · corchea
      const f1 = fila(G, [{ n: '8' }, { n: 'q', p: 1, liga: true }, { n: '8', barra: 'x' }, { n: '8', barra: 'x' }], 350, Y[0], ['3', '4']);
      const f2 = fila(G, [{ n: '8', barra: 'y' }, { n: '8', barra: 'y', liga: true }, { n: 'q', p: 1 }, { n: '8' }], 350 + f1.c.w + 0.9 * SP, Y[1], null);
      const xl = 350 + Math.max(f1.w, f2.w + f1.c.w + 0.9 * SP) + 18;
      const llave = N.group(G);
      N.el('path', { d: `M${xl},${Y[0] - 50} q18,0 18,34 v52 q0,14 14,16 q-14,2 -14,16 v52 q0,34 -18,34`, fill: 'none', stroke: 'currentColor', 'stroke-width': 3 }, llave);
      const m12 = fila(G, [{ n: '8' }, { n: 'h' }, { n: '8' }], 1190, 435, null);
      // 4/4
      const f3 = fila(G, [{ n: '8', barra: 'a' }, { n: '8', barra: 'a', liga: true }, { n: 'q', liga: true }, { n: '8', barra: 'b' }, { n: '8', barra: 'b', liga: true }, { n: 'q' }], 350, Y[2], ['4', '4']);
      const m3 = fila(G, [{ n: '8' }, { n: 'h' }, { n: 'q', p: 1 }], 1190, Y[2], null);
      // 6/8 (la que se nombra)
      const f4 = fila(G, [{ n: 'q', p: 1, liga: true, id: 'nc' }, { n: '8', barra: 'c', id: 'c1' }, { n: '8', barra: 'c' }, { n: '8', barra: 'c' }], 350, Y[3], ['6', '8']);
      const m4 = fila(G, [{ n: 'h', id: 'bl' }, { n: '8', barra: 'd' }, { n: '8', barra: 'd' }], 1190, Y[3], null);
      const tElim = Wd('R1', 'eliminarlas') - 0.1, tSola = Wd('R1', 'sola') - 0.1;
      [f1.g, f2.g, llave, f3.g, f4.g].forEach((x, i) => mostrarEn(s, x, a + 0.3 + Math.min(i, 3) * 0.12));
      [f1, f2, f3, f4].forEach(f => f.r.ligas.forEach(l => resalta(s, l.g, tElim, tSola + 0.6)));
      // «Mira: en seis por ocho…» (con la voz): la fila del 6/8 se transforma
      const t68 = Wd('R1', 'seis') - 0.1, tNeg = Wd('R1', 'negra') - 0.05, tLiga = Wd('R1', 'ligada', 2) - 0.05,
            tCor = Wd('R1', 'corchea') - 0.05, tBla = Wd('R1', 'blanca') - 0.1;
      const L0 = F0('LIG'), L1 = F1('LIG');
      const nc = f4.r.marcas.nc, c1 = f4.r.marcas.c1;
      resalta(s, nc.g, tNeg, L0); resalta(s, nc.ligaG, tLiga, L0); resalta(s, c1.g, tCor, L0);
      viaja(s, G, f4.r.g, m4.r.notas[0].x - f4.r.notas[0].x, 0, tBla - 0.25);
      mostrarEn(s, m4.g, tBla + 0.55); mostrarEn(s, ig[2], tBla + 0.3);
      resalta(s, m4.r.marcas.bl.g, tBla + 0.55, L0);
      // las filas que no se nombran, semitransparentes; el foco va pasando fila a fila
      const filas = [
        { tr: [f1.g], mo: m12, ig: ig[0], f: f1 },
        { tr: [f2.g], mo: m12, ig: ig[0], f: f2 },
        { tr: [f3.g], mo: m3, ig: ig[1], f: f3 },
      ];
      const foco = LIG_PLAN.map((p, i) => [L0 + p.t, L0 + (LIG_PLAN[i + 1] ? LIG_PLAN[i + 1].t : 23.6)]);
      const atenuaSalvo = (els, mios) => atenua(s, els, [[t68, L0 + 0.2, 0.28]].concat(foco.filter((w, i) => mios.indexOf(i) < 0).map(w => [w[0], w[1] - 0.1, 0.25])));
      atenuaSalvo(f1.g, [0]); atenuaSalvo(llave, [0, 1]); atenuaSalvo(f2.g, [1]); atenuaSalvo(f3.g, [2]);
      atenuaSalvo(m12.g, [0, 1]); atenuaSalvo(ig[0], [0, 1]); atenuaSalvo(m3.g, [2]); atenuaSalvo(ig[1], [2]);
      [f4.g, m4.g, ig[2]].forEach(x => atenua(s, x, [[L0, L0 + 23.4, 0.25]]));
      // cada fila: suena lo tradicional (las ligadas, juntas), viaja a moderno y suena lo moderno
      LIG_PLAN.forEach((p, i) => {
        const F = filas[i], T0 = L0 + p.t, notasT = F.f.r.notas, notasM = F.mo.r.notas;
        let tt = T0 + 0.5;
        p.grT.forEach((gr, j) => { const d = p.durT[j] * NEG; gr.forEach(n => { resalta(s, notasT[n].g, tt, tt + d - 0.08, { d: .08 }); if (notasT[n].barras) resalta(s, notasT[n].barras, tt, tt + d - 0.08, { d: .08 }); if (notasT[n].ligaG) resalta(s, notasT[n].ligaG, tt, tt + d - 0.08, { d: .08 }); }); tt += d; });
        const tTr = tt + 0.3;
        viaja(s, G, F.f.r.g, F.mo.r.notas[0].x - F.f.r.notas[0].x, i === 1 ? 435 - Y[1] : (i === 0 ? 435 - Y[0] : 0), tTr);
        if (i !== 1) { mostrarEn(s, F.mo.g, tTr + 0.8); mostrarEn(s, F.ig, tTr + 0.5); }
        tt = tTr + 1.6;
        p.durM.forEach((dn, j) => { const d = dn * NEG; resalta(s, notasM[j].g, tt, tt + d - 0.08, { d: .08 }); tt += d; });
      });
    });
  }
  /** Una copia de la fila viaja (dx, dy) hacia su versión moderna y se funde por el camino, en rosa. */
  function viaja(s, G, fuente, dx, dy, ta) {
    const v = N.group(G, 'viaje'); v.appendChild(fuente.cloneNode(true)); color(v, C.rosa);
    s.on(t => {
      const k = ease(ramp(t, ta, ta + 1.0)), on = t >= ta && t <= ta + 1.0;
      opa(v, on ? (1 - k * 0.85) : 0);
      if (on) v.setAttribute('transform', `translate(${(dx * k).toFixed(1)},${(dy * k).toFixed(1)})`);
    });
  }

  // ---------------------------------------------------------------- 2 · PUNTILLOS
  function escenaPuntillos() {
    const a = F0('R2') - 0.15, b = F0('R3') - 0.1;
    escena('puntillos', a, b, (s, g) => {
      const G = N.group(g); aparece(s, G, a, b, { dy: 16, fi: .5, fo: .45 });
      const Y = [430, 600, 770];
      const ig = marcoRecurso(G, Y);
      const T1 = [
        [{ n: '16', barra: 'a' }, { n: '8', barra: 'a', p: 1, liga: true, id: 'cp' }, { n: 'q', id: 'ng' }],
        [{ n: '32', barra: 'b' }, { n: '8', barra: 'b', p: 2, liga: true }, { n: 'q' }],
        [{ n: '32', barra: 'c' }, { n: '8', barra: 'c', p: 2, liga: true }, { n: 'h', p: 1 }],
      ];
      const T2 = [[{ n: '16' }, { n: 'q', p: 2, id: 'm' }], [{ n: '32' }, { n: 'q', p: 3, id: 'm' }], [{ n: '32' }, { n: 'h', p: 4, id: 'm' }]];
      const tr = T1.map((it, i) => fila(G, it, 470, Y[i], null, { enGrupo: { '16': 2.4, '32': 2.4 }, espacio: { '8': 5.0 } }));
      const mo = T2.map((it, i) => fila(G, it, 1240, Y[i], null, { espacio: { '16': 3.2, '32': 3.2 } }));
      tr.forEach((f, i) => mostrarEn(s, f.g, a + 0.3 + i * 0.12));
      // doble · triple · cuádruple: aparece cada fila moderna y sus puntillos, uno a uno, en rosa
      const tD = Wd('R2', 'doble') - 0.1, tTr = Wd('R2', 'triple') - 0.1, tCu = Wd('R2', 'cuadruple') - 0.1;
      [tD, tTr, tCu].forEach((ta, i) => {
        const f = mo[i], m = f.r.marcas.m;
        mostrarEn(s, ig[i], ta - 0.2);
        // la cabeza y la plica primero; los puntillos de uno en uno
        const sinP = [m.cabeza, m.plica, m.corchete].filter(Boolean);
        const otras = f.r.notas.filter(n => n !== m);
        s.on(t => { const v = ease(ramp(t, ta - 0.2, ta + 0.15)); otras.forEach(n => opa(n.g, v)); sinP.forEach(x => x.setAttribute('opacity', v.toFixed(3))); });
        m.puntos.forEach((p, k) => { const tp = ta + 0.12 + k * 0.16; s.on(t => p.setAttribute('opacity', ease(ramp(t, tp, tp + 0.12)).toFixed(3))); });
        resalta(s, m.g, ta, ta + 1.3);
      });
      // «Esta corchea con puntillo, ligada a una negra… negra con doble puntillo»
      const tEs = Wd('R2', 'corchea') - 0.1, tLig = Wd('R2', 'ligada') - 0.05, tNeg2 = Wd('R2', 'negra', 2) - 0.1;
      [tr[1].g, tr[2].g, mo[1].g, mo[2].g, ig[1], ig[2]].forEach(x => atenua(s, x, [[tEs, null, 0.28]]));
      const cp = tr[0].r.marcas.cp, ng = tr[0].r.marcas.ng;
      resalta(s, cp.g, tEs); resalta(s, cp.ligaG, tLig); resalta(s, ng.g, tLig + 0.15);
      resalta(s, mo[0].r.marcas.m.g, tNeg2);
    });
  }

  // ---------------------------------------------------------------- 3 · BARRADO
  function escenaBarrado() {
    const a = F0('R3') - 0.15, b = F0('R4') - 0.1;
    escena('barrado', a, b, (s, g) => {
      const G = N.group(g); aparece(s, G, a, b, { dy: 16, fi: .5, fo: .45 });
      const Y = [470, 700];
      const ig = marcoRecurso(G, Y);
      // 6/8 (libro, p. 18): silencio de semicorchea, corcheas y semicorcheas agrupadas por pulsos…
      const t1 = fila(G, [{ sil: '16' }, { n: '8', barra: 'a' }, { n: '8', barra: 'a' }, { n: '16', barra: 'a', liga: true },
        { n: '16', barra: 'b' }, { n: '8', barra: 'b' }, { n: '8', barra: 'b' }, { n: '16', barra: 'b' }, { div: 'simple', pre: 0.9, post: 0 }], 300, Y[0], ['6', '8'], { enGrupo: { '8': 2.35, '16': 2.1 } });
      // … y, en moderno, una sola barra para todo el compás
      const m1 = fila(G, [{ sil: '16' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '8', barra: 'm' }, { n: '16', barra: 'm' }, { div: 'simple', pre: 0.9, post: 0 }], 1110, Y[0], ['6', '8'], { enGrupo: { '8': 2.35, '16': 2.1 } });
      // 2/4: negra, silencio de corchea, corchea con acento | dos corcheas, negra
      const t2 = fila(G, [{ n: 'q' }, { sil: '8' }, { n: '8', acento: true }, { div: 'simple', pre: 0.7, post: 0.9 }, { n: '8', barra: 'c' }, { n: '8', barra: 'c' }, { n: 'q' }, { div: 'simple', pre: 0.6, post: 0 }], 300, Y[1], ['2', '4'], { espacio: { q: 3.7, '8': 3.0 }, silencio: { '8': 2.0 } });
      // moderno: la barra de las corcheas cruza la línea divisoria
      const m2 = fila(G, [{ n: 'q' }, { sil: '8' }, { n: '8', barra: 'd' }, { div: 'simple', pre: 0.55, post: 0.55, marca: 'dv' }, { n: '8', barra: 'd' }, { n: '8', barra: 'd' }, { n: 'q' }, { div: 'simple', pre: 0.6, post: 0 }], 1110, Y[1], ['2', '4'], { espacio: { q: 3.7, '8': 3.0 }, silencio: { '8': 2.0 } });
      [t1.g, t2.g].forEach((x, i) => mostrarEn(s, x, a + 0.3 + i * 0.12));
      const tRes = Wd('R3', 'respetan') - 0.1, tUn = Wd('R3', 'unen') - 0.1, tSal = Wd('R3', 'saltan') - 0.1;
      mostrarEn(s, m1.g, tRes); mostrarEn(s, ig[0], tRes);
      mostrarEn(s, m2.g, tSal - 0.2); mostrarEn(s, ig[1], tSal - 0.2);
      // las barras de la izquierda (por pulsos) y la de la derecha (todo el compás)
      resaltaVarios(s, Object.values(t1.r.barras), tRes, tUn);
      resalta(s, m1.r.barras.m, tUn, tSal);
      atenua(s, t2.g, [[tUn, tSal - 0.2, 0.3]]);
      // «… e incluso se saltan la línea divisoria»
      atenua(s, t1.g, [[tSal, null, 0.28]]); atenua(s, m1.g, [[tSal, null, 0.28]]); atenua(s, ig[0], [[tSal, null, 0.28]]);
      resalta(s, m2.r.barras.d, tSal + 0.1); resalta(s, m2.r.marcas.dv.g, tSal + 0.1);
    });
  }

  // ---------------------------------------------------------------- 4 · COMPASES
  function escenaCompases() {
    const a = F0('R4') - 0.15, b = F0('D1') - 0.1;
    escena('compases', a, b, (s, g) => {
      const G = N.group(g); aparece(s, G, a, b, { dy: 16, fi: .5, fo: .45 });
      panel(G, 170, 205, 1580, 700);
      const yM = 560, SPc = 40;            // las cifras, algo más grandes para que se lean bien de lejos
      const grupos = [];
      // A · 2/4 = 2 sobre negra
      const xA = 300, xB = 720, xC = 1250;
      const mk = (x, piezas) => {
        let cx = x; const out = [];
        piezas.forEach((p, i) => {
          if (i) { const e = texto(G, '=', cx + 34, yM + 22, { anchor: 'middle', size: 70, peso: 300, fill: C.suave }); out.push({ g: e, igual: true }); cx += 72; }
          const r = p.fig ? N.compasFigura(G, p.num, p.fig, p.p || 0, cx, yM, SPc) : N.compasNum(G, p.num, p.den, cx, yM, SPc);
          out.push(r); cx += r.w + 6;
        });
        return out;
      };
      const A = mk(xA, [{ num: '2', den: '4' }, { num: '2', fig: 'q' }]);
      const B = mk(xB, [{ num: '6', den: '8' }, { num: '6', fig: '8' }, { num: '2', fig: 'q', p: 1 }]);
      const Cc = mk(xC, [{ num: '6', den: '4' }, { num: '6', fig: 'q' }, { num: '2', fig: 'h', p: 1 }]);
      const tAb = Wd('R4', 'abajo') - 0.1, tFig = Wd('R4', 'figura') - 0.1;
      const t24 = Wd('R4b', 'dos', 1) - 0.1, t2n = Wd('R4b', 'dos', 2) - 0.1;
      const t68 = Wd('R4b', 'seis', 1) - 0.1, t6c = Wd('R4b', 'seis', 2) - 0.1, t2p = Wd('R4b', 'dos', 3) - 0.1;
      // A aparece ya con «Abajo»: el 4 de abajo, en rosa; con «la figura», la negra en su lugar
      mostrarEn(s, A[0].g, tAb); resalta(s, A[0].den, tAb, tFig + 0.6);
      mostrarEn(s, A[1].g, tFig); mostrarEn(s, A[2].g, tFig); resalta(s, A[2].fig, tFig, t24);
      resalta(s, A[2].g, t2n, t68);
      // B, de izquierda a derecha
      mostrarEn(s, B[0].g, t68); mostrarEn(s, B[1].g, t6c); mostrarEn(s, B[2].g, t6c); resalta(s, B[2].fig, t6c, t2p);
      mostrarEn(s, B[3].g, t2p); mostrarEn(s, B[4].g, t2p); resalta(s, B[4].fig, t2p);
      // C (sin nombrarla): llega al final, semitransparente
      const tCfin = F1('R4b') - 0.2;
      Cc.forEach(x => { mostrarEn(s, x.g, tCfin); atenua(s, x.g, [[tCfin - 1, null, 0.4]]); });
      // A se atenúa mientras se explica B
      A.forEach(x => atenua(s, x.g, [[t68, null, 0.4]]));
      // letras A · B · C del libro
      [['A', xA], ['B', xB], ['C', xC]].forEach(([l, x], i) => {
        const e = texto(G, l, x - 50, yM - 110, { size: 30, peso: 800, fill: C.suave });
        mostrarEn(s, e, [tAb, t68, tCfin][i]);
        if (i === 2) atenua(s, e, [[tCfin - 1, null, 0.4]]);
      });
    });
  }

  // ================================================================ C · LA IDEA DE COMPÁS SE DESINTEGRA
  /* (6-nov, Iago: «quiero que la imagen la vayas adaptando a todo lo que digo») Cada cosa que se nombra llega a la imagen:
     «Todo esto» → los cuatro recursos · tresillos, cinquillos, septillos → cada grupo sustituye a una negra · ritmos asimétricos →
     un compás de 7/8 (2+2+3) · cambios constantes de tempo → una indicación distinta en cada compás · acentos irregulares →
     acentos fuera de los tiempos fuertes · «desintegrando la idea de compás» → se borran las divisorias y las cifras ·
     «el ritmo se ha liberado» → las notas se sueltan · SIMETRÍA → ASIMETRÍA. */
  function escenaDesintegra() {
    const a = F0('D1') - 0.15, b = F0('F1') - 0.1;
    escena('desintegra', a, b, (s, g) => {
      const G = N.group(g); aparece(s, G, a, b, { dy: 16, fi: .5, fo: .5 });
      panel(G, 170, 200, 1580, 680);
      const yM = 590;
      // «Todo esto»: los cuatro recursos, arriba
      const tTodo = Wd('D1', 'todo') - 0.1, tGru = Wd('D1', 'grupos') - 0.1;
      ['LIGADURAS', 'PUNTILLOS', 'BARRADO', 'COMPASES'].forEach((n, i) => {
        const gi = N.group(G); const x = 560 + i * 266;
        iconoRecurso(gi, n, x, 304);
        texto(gi, n, x, 372, { anchor: 'middle', size: 16, peso: 800, ls: '0.16em', fill: C.suave });
        mostrarEn(s, gi, tTodo + i * 0.15); atenua(s, gi, [[tGru, null, 0.3]]);
      });
      // la línea: cinco compases
      const it = [
        { n: 'q' }, { n: 'q', acento: true, id: 'ac1' }, { n: 'q' }, { n: 'q' }, { div: 'simple', pre: 0.9, post: 1.1, marca: 'd0' },
        { n: '8', barra: 't', id: 'tre' }, { n: '8', barra: 't' }, { n: '8', barra: 't' }, { n: 'q' }, { n: 'q' }, { n: 'q' }, { div: 'simple', pre: 0.9, post: 1.1, marca: 'd1' },
        { n: '16', barra: 'c', id: 'cin' }, { n: '16', barra: 'c' }, { n: '16', barra: 'c' }, { n: '16', barra: 'c' }, { n: '16', barra: 'c' }, { n: 'q' }, { n: 'q', acento: true, id: 'ac2' }, { n: 'q' }, { div: 'simple', pre: 0.9, post: 1.1, marca: 'd2' },
        { n: 'q' }, { n: '16', barra: 's', id: 'sep' }, { n: '16', barra: 's' }, { n: '16', barra: 's' }, { n: '16', barra: 's' }, { n: '16', barra: 's' }, { n: '16', barra: 's' }, { n: '16', barra: 's' }, { n: 'q' }, { n: 'q' }, { div: 'simple', pre: 0.9, post: 0.5, marca: 'd3' },
        { hueco: 2.4, marca: 'c78' },
        { n: '8', barra: 'u', id: 'as' }, { n: '8', barra: 'u' }, { n: '8', barra: 'v', acento: true, id: 'ac3' }, { n: '8', barra: 'v' }, { n: '8', barra: 'w' }, { n: '8', barra: 'w' }, { n: '8', barra: 'w', acento: true, id: 'ac4' }, { div: 'final', pre: 0.9, post: 0, marca: 'd4' },
      ];
      const FG = N.group(G, 'linea');
      const F = fila(FG, it, 0, yM, ['4', '4'], { enGrupo: { '16': 1.5, '8': 2.0 }, espacio: { q: 2.8, '8': 2.6 } });
      const r = F.r;
      const c78 = N.compasNum(FG, '7', '8', r.marcas.c78.x + 0.3 * SP, yM, SP);
      const esc = Math.min(1, 1480 / F.w); FG.setAttribute('transform', `translate(${(CX - F.w * esc / 2).toFixed(1)},${(yM * (1 - esc)).toFixed(1)}) scale(${esc.toFixed(4)})`);
      const xs = x => CX - F.w * esc / 2 + x * esc;          // x de la línea → x de la pantalla
      const num = (id, n, cuantos) => {
        const a0 = r.marcas[id]; const idx = r.notas.indexOf(a0); const ult = r.notas[idx + cuantos - 1];
        const xm = (a0.plicaX + ult.plicaX) / 2, y = a0.yPlicaTop - 0.75 * SP;
        const gq = N.group(FG, 'tupla'); texto(gq, String(n), xm, y, { anchor: 'middle', size: 26, peso: 800, italic: true, fill: 'currentColor' });
        // la negra «de siempre» que había en ese pulso (se va cuando llega el grupo)
        const neg = N.group(FG, 'negra'); N.ritmo2(neg, [{ n: 'q' }], xm - 0.7 * SP, yM, { sp: SP, alto: 1.6 });
        return { gq, neg, notas: r.notas.slice(idx, idx + cuantos) };
      };
      const tre = num('tre', 3, 3), cin = num('cin', 5, 5), sep = num('sep', 7, 7);
      const tT = Wd('D1', 'tresillos') - 0.1, tC = Wd('D1', 'cinquillos') - 0.1, tS = Wd('D1', 'septillos') - 0.1;
      [[tre, tT], [cin, tC], [sep, tS]].forEach(([q, ta]) => {
        const gs = [q.gq].concat(q.notas.map(n => n.g)).concat(q.notas[0].barras ? [q.notas[0].barras] : []);
        gs.forEach(x => { mostrarEn(s, x, ta, null, .3); resalta(s, x, ta, ta + 1.4); });
        mostrarEn(s, q.neg, a - 1, ta, .2, .3);
      });
      // ritmos asimétricos: el 7/8 (2 + 2 + 3) llega entero
      const tAsim = Wd('D1', 'asimetricos') - 0.1;
      const as = r.notas.slice(r.notas.indexOf(r.marcas.as), r.notas.indexOf(r.marcas.as) + 7);
      const asG = [c78.g, r.marcas.d4.g].concat(as.map(n => n.g)).concat(Array.from(new Set(as.map(n => n.barras))));
      asG.forEach(x => { mostrarEn(s, x, tAsim, null, .3); resalta(s, x, tAsim, tAsim + 1.6); });
      mostrarEn(s, r.marcas.d3.g, tAsim, null, .3);
      const suma = texto(FG, '2 + 2 + 3', (as[0].plicaX + as[6].plicaX) / 2, as[0].yPlicaTop - 0.9 * SP, { anchor: 'middle', size: 24, peso: 800, fill: C.rosa });
      mostrarEn(s, suma, tAsim + 0.3);
      // cambios constantes de tempo: una indicación distinta encima de cada compás
      const tTempo = Wd('D1', 'tempo') - 0.15;
      const inicios = [r.notas[0], r.marcas.tre, r.marcas.cin, r.notas[r.notas.indexOf(r.marcas.sep) - 1], r.marcas.as];
      ['60', '132', '76', '108', '66'].forEach((v, i) => {
        const gt = N.group(G); const x = xs(inicios[i].x) - 6, y = 470;
        N.figura(gt, 'q', x, y, SP * 0.8); texto(gt, '= ' + v, x + 34, y - 2, { size: 26, peso: 700, fill: 'currentColor' });
        mostrarEn(s, gt, tTempo + i * 0.28, null, .25); resalta(s, gt, tTempo + i * 0.28, tTempo + i * 0.28 + 1.2);
      });
      // acentos irregulares
      const tAc = Wd('D1', 'acentos') - 0.1;
      ['ac1', 'ac2', 'ac3', 'ac4'].forEach((k, i) => { const n = r.marcas[k]; mostrarEn(s, n.acento, tAc + i * 0.2, null, .25); resalta(s, n.acento, tAc + i * 0.2, tAc + 1.6); });
      // «desintegrando poco a poco la idea de compás»: las divisorias y las cifras se van, una a una
      const tDes = Wd('D1', 'desintegrando') - 0.1;
      ['d0', 'd1', 'd2', 'd3', 'd4'].forEach((k, i) => { const d = r.marcas[k]; const ta = tDes + i * 0.4; s.on(t => { if (t >= ta) opa(d.g, 1 - ease(ramp(t, ta, ta + 0.7))); }); });
      [F.c.g, c78.g].forEach(x => s.on(t => { if (t >= tDes + 1.6) opa(x, 1 - ease(ramp(t, tDes + 1.6, tDes + 2.3))); }));
      // «el ritmo se ha liberado»: cada nota (o cada grupo con su barra) se suelta un poco, a su aire
      const tLib = Wd('D1', 'liberado') - 0.2;
      const unidades = []; const vistos = new Set();
      r.notas.forEach(n => {
        if (vistos.has(n)) return;
        if (n.barras) { const gr = r.notas.filter(m => m.barras === n.barras); gr.forEach(m => vistos.add(m)); const tq = [tre, cin, sep].find(q => q.notas[0] === gr[0]); unidades.push(gr.map(m => m.g).concat([n.barras]).concat(tq ? [tq.gq] : [])); }
        else { vistos.add(n); unidades.push([n.g]); }
      });
      unidades.forEach((u, i) => {
        const dx = (Math.sin(i * 2.17) * 0.6) * SP, dy = (Math.cos(i * 1.63) * 0.6) * SP;
        s.on(t => { const k = ease(ramp(t, tLib, tLib + 1.6)); const tr = `translate(${(dx * k).toFixed(1)},${(dy * k).toFixed(1)})`; u.forEach(x => x.setAttribute('transform', tr)); });
      });
      // SIMETRÍA → ASIMETRÍA
      const tSim = Wd('D1', 'simetria') - 0.1, tAsi = Wd('D1', 'asimetria') - 0.1;
      const s1 = texto(G, 'SIMETRÍA', 800, 800, { anchor: 'end', size: 44, peso: 800, ls: '0.08em', fill: C.texto });
      const fl = flecha(G, 840, 786, 1000, 786, { w: 4, cab: 18 }); color(fl, C.rosa);
      const s2 = texto(G, 'ASIMETRÍA', 1040, 800, { anchor: 'start', size: 44, peso: 800, ls: '0.08em', fill: C.rosa });
      mostrarEn(s, s1, tSim); mostrarEn(s, fl, tAsi - 0.2); mostrarEn(s, s2, tAsi);
    });
  }

  // ================================================================ D · REPASO
  function iconoRecurso(G, tipo, cx, cy) {
    const g = N.group(G, 'icono ' + tipo);
    if (tipo === 'LIGADURAS') N.ritmo2(g, [{ n: 'q', p: 1, liga: true }, { n: '8' }], cx - 2.4 * SP, cy, { sp: SP });
    if (tipo === 'PUNTILLOS') N.ritmo2(g, [{ n: 'q', p: 3 }], cx - 1.2 * SP, cy, { sp: SP });
    if (tipo === 'BARRADO') N.ritmo2(g, [{ n: '8', barra: 'k' }, { div: 'simple', pre: 0.55, post: 0.55 }, { n: '8', barra: 'k' }, { n: '8', barra: 'k' }], cx - 2.8 * SP, cy, { sp: SP, alto: 1.6, enGrupo: { '8': 2.0 } });
    if (tipo === 'COMPASES') N.compasFigura(g, '2', 'q', 1, cx - 0.7 * SP, cy - 1.5 * SP, SP);
    return g;
  }
  function escenaRepaso() {
    const a = F0('F1') - 0.15, b = F0('Q0') + 0.2;
    escena('repaso', a, b, (s, g) => {
      const G = N.group(g); aparece(s, G, a, b, { dy: 16, fi: .5, fo: .5 });
      panel(G, 270, 180, 1380, 720);
      texto(G, 'REPASO', CX, 250, { anchor: 'middle', size: 24, peso: 800, ls: '0.3em', fill: C.rosa });
      const l1 = N.group(G), l2 = N.group(G);
      texto(l1, [['TRADICIONAL', C.blanco], ['  =  ', C.suave], ['PULSOS', C.rosa]], CX, 350, { anchor: 'middle', size: 52, peso: 800, ls: '0.04em' });
      texto(l2, [['MODERNA', C.blanco], ['  =  ', C.suave], ['LO MÍNIMO', C.rosa]], CX, 450, { anchor: 'middle', size: 52, peso: 800, ls: '0.04em' });
      const tTr = Wd('F1', 'tradicional') - 0.1, tNu = Wd('F1', 'nuevas') - 0.1;
      mostrarEn(s, l1, tTr); mostrarEn(s, l2, tNu);
      // los cuatro recursos: se encienden al nombrarlos
      const pal = [['LIGADURAS', 'ligado'], ['PUNTILLOS', 'puntillos'], ['BARRADO', 'barras'], ['COMPASES', 'figura']];
      const xs = [480, 800, 1120, 1440], yI = 650;
      const tRec = Wd('F2', 'recursos') - 0.1;
      pal.forEach(([n, w], i) => {
        const gi = N.group(G);
        N.el('rect', { x: xs[i] - 135, y: yI - 115, width: 270, height: 230, rx: 16, fill: 'rgba(255,255,255,0.03)', stroke: C.borde, 'stroke-width': 1.5 }, gi);
        const ic = iconoRecurso(gi, n, xs[i], yI - 20);
        const et = texto(gi, n, xs[i], yI + 88, { anchor: 'middle', size: 20, peso: 800, ls: '0.16em', fill: 'currentColor' });
        const ta = Wd('F2', w) - 0.1;
        mostrarEn(s, gi, tRec + i * 0.15);
        atenua(s, gi, [[tRec, ta, 0.35]]);
        resalta(s, gi, ta, ta + 1.4);
      });
    });
  }

  // ================================================================ E · AHORA TÚ (retos sin voz)
  const RETO_CFG = () => window.RETOS || { entrada: 1.2, pregunta: 1.3, cuenta: 5, solucion: 2.9 };
  function escenaAhoraTu() {
    const a = Wd('Q0', 'toca') - 0.2, b = T.acorde + 0.1;
    escena('ahoratu', a, b, (s, g) => {
      const t1 = texto(g, 'AHORA TÚ', CX, 540, { anchor: 'middle', size: 96, peso: 800, ls: '0.06em', fill: C.blanco });
      N.el('rect', { x: CX - 60, y: 580, width: 120, height: 5, rx: 2.5, fill: C.rosa }, g);
      texto(g, 'El reto de las nuevas grafías', CX, 650, { anchor: 'middle', size: 36, peso: 400, fill: '#cbd5e1' });
      aparece(s, g, a, b, { dy: 14, fi: .5, fo: .45 });
    });
  }
  /** Opción (A, B o una palabra) con su recuadro; devuelve {g, caja, w}. */
  function opcion(G, letra, x, y, w, h) {
    const g = N.group(G, 'opcion');
    const caja = N.el('rect', { x, y, width: w, height: h, rx: 16, fill: 'rgba(255,255,255,0.04)', stroke: 'rgba(255,255,255,0.22)', 'stroke-width': 2 }, g);
    if (letra) texto(g, letra, x + 26, y + 46, { size: 30, peso: 800, fill: C.suave });
    return { g, caja };
  }
  function escenaRetos() {
    const R = RETO_CFG();
    const t0 = F0('RETO') + R.entrada, paso = R.pregunta + R.cuenta + R.solucion;
    const PREG = [
      { titulo: '¿Cuál está escrito con nuevas grafías?', tipo: 'ab' },
      { titulo: '¿Qué recurso es?', tipo: 'recurso' },
      { titulo: '¿Tradicional o moderna?', tipo: 'tm' },
      { titulo: '¿Qué compás es?', tipo: 'compas' },
    ];
    PREG.forEach((P, i) => {
      const ta = t0 + i * paso, tc = ta + R.pregunta, ts = tc + R.cuenta, tb = ts + R.solucion;
      escena('reto' + (i + 1), ta - 0.1, tb + 0.05, (s, g) => {
        const G = N.group(g); aparece(s, G, ta, tb, { dy: 14, fi: .45, fo: .4 });
        panel(G, 170, 150, 1580, 790);
        texto(G, `RETO ${i + 1} DE 4`, 230, 222, { size: 22, peso: 800, ls: '0.24em', fill: C.rosa });
        texto(G, P.titulo, CX, 318, { anchor: 'middle', size: 50, peso: 800, fill: C.blanco });
        // cuenta atrás (anillo que se vacía y número)
        const CR = N.group(G, 'cuenta');
        const cxr = 1620, cyr = 222, rr = 44, circ = 2 * Math.PI * rr;
        N.el('circle', { cx: cxr, cy: cyr, r: rr, fill: 'none', stroke: 'rgba(255,255,255,0.14)', 'stroke-width': 8 }, CR);
        const arco = N.el('circle', { cx: cxr, cy: cyr, r: rr, fill: 'none', stroke: C.rosa, 'stroke-width': 8, 'stroke-linecap': 'round',
          'stroke-dasharray': circ.toFixed(1), transform: `rotate(-90 ${cxr} ${cyr})` }, CR);
        const numT = texto(CR, '5', cxr, cyr + 15, { anchor: 'middle', size: 44, peso: 800, fill: C.blanco });
        s.on(t => {
          const k = ramp(t, tc, ts);
          arco.setAttribute('stroke-dashoffset', (circ * k).toFixed(1));
          const n = Math.max(1, Math.ceil(R.cuenta - (t - tc) - 1e-6));
          const txt = t < tc ? String(R.cuenta) : (t >= ts ? '' : String(n));
          if (numT.textContent !== txt) numT.textContent = txt;
          opa(CR, t >= ts + 0.3 ? 1 - ramp(t, ts + 0.3, ts + 0.6) : 1);
        });
        const solucion = (o, ok) => {
          s.on(t => {
            const k = ease(ramp(t, ts, ts + 0.35));
            if (ok) { o.caja.setAttribute('stroke', mezcla('#94a3b8', C.rosa, k)); o.caja.setAttribute('stroke-width', (2 + 2 * k).toFixed(1)); o.caja.setAttribute('fill', `rgba(236,72,153,${(0.04 + 0.12 * k).toFixed(3)})`); color(o.g, mezcla(C.blanco, C.rosa, k)); }
            else o.g.setAttribute('opacity', (1 - 0.6 * k).toFixed(3));
          });
        };
        const nota = (str) => { const e = texto(G, str, CX, 880, { anchor: 'middle', size: 30, peso: 600, fill: C.texto }); mostrarEn(s, e, ts + 0.25, null, .35); return e; };
        if (P.tipo === 'ab') {
          // A: 6/8 tradicional (negra con puntillo ligada a corchea + dos corcheas) · B: lo mismo con nuevas grafías
          const oA = opcion(G, 'A', 260, 420, 660, 330), oB = opcion(G, 'B', 1000, 420, 660, 330);
          fila(oA.g, [{ n: 'q', p: 1, liga: true }, { n: '8', barra: 'c' }, { n: '8', barra: 'c' }, { n: '8', barra: 'c' }], 400, 600, ['6', '8']);
          fila(oB.g, [{ n: 'h' }, { n: '8', barra: 'd' }, { n: '8', barra: 'd' }], 1210, 600, null);
          solucion(oA, false); solucion(oB, true);
          nota('B · lo ligado se suma: negra con puntillo + corchea = blanca');
        } else if (P.tipo === 'recurso') {
          // corchea con puntillo ligada a negra → negra con doble puntillo
          const ej = N.group(G);
          fila(ej, [{ n: '16', barra: 'a' }, { n: '8', barra: 'a', p: 1, liga: true }, { n: 'q' }], 560, 500, null, { enGrupo: { '16': 2.4 }, espacio: { '8': 5.0 } });
          texto(ej, '=', 995, 516, { anchor: 'middle', size: 64, peso: 300, fill: C.suave });
          fila(ej, [{ n: '16' }, { n: 'q', p: 2 }], 1160, 500, null, { espacio: { '16': 3.2 } });
          const ops = RECURSOS; const wO = 320, gap = 30, x0 = CX - (4 * wO + 3 * gap) / 2;
          ops.forEach((n, k) => {
            const o = opcion(G, null, x0 + k * (wO + gap), 640, wO, 100);
            texto(o.g, n, x0 + k * (wO + gap) + wO / 2, 701, { anchor: 'middle', size: 26, peso: 800, ls: '0.14em', fill: 'currentColor' });
            solucion(o, n === 'PUNTILLOS');
          });
          nota('Puntillos · la ligadura desaparece: negra con doble puntillo');
        } else if (P.tipo === 'tm') {
          const ej = N.group(G);
          fila(ej, [{ n: 'q' }, { sil: '8' }, { n: '8', barra: 'd' }, { div: 'simple', pre: 0.55, post: 0.55 }, { n: '8', barra: 'd' }, { n: '8', barra: 'd' }, { n: 'q' }, { div: 'simple', pre: 0.6, post: 0 }], 700, 500, ['2', '4']);
          const wO = 420, x0 = CX - (2 * wO + 40) / 2;
          [['TRADICIONAL', false], ['MODERNA', true]].forEach(([n, ok], k) => {
            const o = opcion(G, null, x0 + k * (wO + 40), 640, wO, 100);
            texto(o.g, n, x0 + k * (wO + 40) + wO / 2, 701, { anchor: 'middle', size: 28, peso: 800, ls: '0.14em', fill: 'currentColor' });
            solucion(o, ok);
          });
          nota('Moderna · la barra de las corcheas se salta la línea divisoria');
        } else if (P.tipo === 'compas') {
          const ej = N.group(G);
          N.compasFigura(ej, '2', 'q', 1, 930, 500, 34);
          const ops = [['2', '4'], ['6', '8'], ['3', '4']]; const wO = 240, gap = 40, x0 = CX - (3 * wO + 2 * gap) / 2;
          ops.forEach(([nu, de], k) => {
            const o = opcion(G, null, x0 + k * (wO + gap), 640, wO, 170);
            N.compasNum(o.g, nu, de, x0 + k * (wO + gap) + wO / 2 - 0.75 * 30, 725, 30);
            solucion(o, nu === '6');
          });
          nota('6/8 · dos pulsos de negra con puntillo');
        }
      });
    });
  }

  // ================================================================ F · DESPEDIDA Y FINAL (norma 3)
  function escenaDespedida() {
    if (!hay('Q9')) return;
    const a = F0('Q9') - 0.2, b = F0('COLA') + 1.2;
    escena('despedida', a, b, (s, g) => {
      const e = texto(g, '¡Nos vemos en clase!', CX, 560, { anchor: 'middle', size: 54, peso: 700, fill: C.texto });
      aparece(s, e, Wd('Q9', 'nos') - 0.2, b, { dy: 10, fi: .5, fo: .9 });
    });
  }
  function escenaFinal() {
    const ta = T.acorde;
    escena('final', ta - 0.5, T.dur + 9999, (s, g) => {
      const gg = N.group(g); tituloGrande(gg);
      s.on(t => { const k = t >= ta ? eo(ramp(t, ta, ta + 0.35)) : 0; opa(gg, k); gg.setAttribute('transform', `translate(${CX},540) scale(${(0.97 + 0.03 * k).toFixed(4)}) translate(${-CX},-540)`); });
    });
  }

  // ================================================================ fondo: velo según el momento (norma 4)
  function veloFondo(t) {
    const tit = 1 - ease(ramp(t, F1('TITULO') - 1.0, F1('TITULO') + 0.3));
    const fin = ease(ramp(t, T.acorde - 0.05, T.acorde + 0.4));
    return clamp(0.72 - 0.17 * Math.max(tit, fin), 0, 0.92);
  }

  function construir(tiempos) {
    T = tiempos;
    esc.length = 0;
    const capa = document.getElementById('capaEscenas');
    while (capa.firstChild) capa.removeChild(capa.firstChild);
    escenaTitulo(); escenaABC(); escenaIndice(); escenaLigaduras(); escenaPuntillos(); escenaBarrado(); escenaCompases();
    escenaDesintegra(); escenaRepaso(); escenaAhoraTu(); escenaFinal();
  }
  function pintar(t) {
    for (const s of esc) {
      const activa = t >= s.a - 0.05 && t <= s.b + 0.05;
      if (!activa) { if (s.g.style.display !== 'none') s.g.style.display = 'none'; continue; }
      s.g.style.display = '';
      for (const f of s.tracks) f(t);
    }
    const velo = document.getElementById('velo');
    if (velo) { const v = veloFondo(t).toFixed(3); if (velo._v !== v) { velo._v = v; velo.style.opacity = v; } }
  }
  window.ESCENAS = { construir, pintar, get T() { return T; } };
})();
