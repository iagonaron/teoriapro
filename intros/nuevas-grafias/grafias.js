/* =====================================================================
   GRAFÍAS · ampliación del motor de notación para «Nuevas grafías»
   (ligaduras, silencios, varios puntillos, barras secundarias y medias
   barras, acentos, barras que cruzan la divisoria y compases con figura).
   Usa window.NOTA (notacion.js) y la misma Bravura. Todo en sp.
   ===================================================================== */
(function () {
  'use strict';
  const N = window.NOTA, E = N.E, M = N.M, el = N.el;
  const NBEAMS = { '8': 1, '16': 2, '32': 3, '64': 4 };
  const FLAG_UP = { '8': 'flag8thUp', '16': 'flag16thUp', '32': 'flag32ndUp' };
  const REST = { q: 'restQuarter', '8': 'rest8th', '16': 'rest16th' };
  const adv = (name, s) => M[name].adv * (s || 1);

  /**
   * Ritmo «de libro» con plicas arriba. items:
   *  {n:'h'|'q'|'8'|'16'|'32', p:nPuntillos, barra:'clave', liga:true (a la siguiente nota), acento:true, id}
   *  {sil:'q'|'8'|'16', barra?}  silencio (dentro de un grupo, la barra no lo toca)
   *  {div:'simple'|'final'|'doble', pre, post}   divisoria (una barra de corcheas puede cruzarla)
   *  {hueco:sp, marca:'nombre'}  espacio reservado (p. ej. para una cifra de compás que llega después)
   * opt: {sp, altoNota (sp bajo la línea central), espacio:{…}, enGrupo:{…}, alto (alto de la divisoria, sp)}
   */
  function ritmo2(parent, items, x, yMid, opt) {
    opt = opt || {}; const sp = opt.sp || N.SP;
    const ESP = Object.assign({ h: 6.2, q: 4.6, '8': 3.6, '16': 3.0, '32': 2.8 }, opt.espacio || {});
    const GR = Object.assign({ q: 3.2, '8': 2.5, '16': 2.15, '32': 2.0 }, opt.enGrupo || {});
    const SIL = Object.assign({ q: 2.6, '8': 2.3, '16': 2.3 }, opt.silencio || {});
    const DOT = 0.5;
    const yN = yMid + (opt.altoNota != null ? opt.altoNota : 1.0) * sp;
    const g = N.group(parent, 'ritmo2');
    const els = [], notas = [], marcas = {};
    let cx = x;
    const sigNota = i => { for (let j = i + 1; j < items.length; j++) { if (items[j].n) return items[j]; if (items[j].sil && items[j].barra) return items[j]; if (items[j].div) continue; if (items[j].hueco != null) return null; } return null; };
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.hueco != null) { const e = { tipo: 'hueco', x: cx, w: it.hueco * sp, it }; els.push(e); if (it.marca) marcas[it.marca] = e; cx += it.hueco * sp; continue; }
      if (it.div) {
        const pre = it.pre != null ? it.pre : 1.3, post = it.post != null ? it.post : 1.6;
        cx += pre * sp;
        const e = { tipo: 'div', clase: it.div, x: cx, g: N.group(g, 'div ' + it.div), it };
        els.push(e); if (it.marca) marcas[it.marca] = e;
        cx += (it.div === 'final' || it.div === 'doble' ? (E.barSep + 0.5) * sp : 0) + post * sp;
        continue;
      }
      if (it.sil) {
        const e = { tipo: 'sil', it, x: cx, g: N.group(g, 'silencio') };
        e.glifo = N.glyph(e.g, REST[it.sil], cx, yMid + (it.sil === 'q' ? 0 : 0), sp);
        els.push(e); if (it.id) marcas[it.id] = e;
        cx += (it.barra ? SIL[it.sil] * 0.85 : SIL[it.sil]) * sp;
        continue;
      }
      const e = { tipo: 'nota', it, x: cx, y: yN, dur: it.n, g: N.group(g, 'nota') };
      els.push(e); notas.push(e); if (it.id) marcas[it.id] = e;
      const nx = sigNota(i);
      const mismo = it.barra && nx && nx.barra === it.barra;
      cx += ((mismo ? GR[it.n] : ESP[it.n]) + (it.p || 0) * DOT) * sp;
    }
    // cabezas, puntillos, plicas
    for (const e of notas) {
      const n = e.it.n;
      e.cabeza = N.glyph(e.g, n === 'h' ? 'noteheadHalf' : (n === 'w' ? 'noteheadWhole' : 'noteheadBlack'), e.x, e.y, sp);
      const largo = (n === '32' ? 4.1 : 3.5);
      e.plicaX = e.x + (1.18 - E.stem / 2) * sp;
      e.yPlicaBase = e.y - 0.168 * sp;
      e.yPlicaTop = e.y - largo * sp;
      e.puntos = [];
      const dyP = opt.puntoDy != null ? opt.puntoDy : 0;
      for (let k = 0; k < (e.it.p || 0); k++) e.puntos.push(N.glyph(e.g, 'augmentationDot', e.x + (1.18 + 0.36 + k * DOT) * sp, e.y + dyP * sp, sp));
      e.xFin = e.x + (1.18 + (e.it.p ? 0.36 + e.it.p * DOT : 0)) * sp;
    }
    // grupos con barra
    const grupos = {};
    for (const e of notas) if (e.it.barra) (grupos[e.it.barra] = grupos[e.it.barra] || []).push(e);
    const barras = {};
    for (const k in grupos) {
      const gr = grupos[k];
      const maxB = Math.max(...gr.map(e => NBEAMS[e.it.n] || 1));
      const yTop = Math.min(...gr.map(e => e.yPlicaTop)) - (maxB >= 3 ? 0.35 : 0) * sp;
      const gb = N.group(g, 'barras');
      const rect = (x1, x2, y) => el('rect', { x: +x1.toFixed(2), y: +y.toFixed(2), width: +(x2 - x1).toFixed(2), height: +(E.beam * sp).toFixed(2), fill: 'currentColor' }, gb);
      const L = (e) => e.plicaX - E.stem / 2 * sp, R = (e) => e.plicaX + E.stem / 2 * sp;
      if (gr.length === 1) {   // una sola nota «con barra»: corchete normal
        gr[0].it._sola = true;
      } else {
        rect(L(gr[0]), R(gr[gr.length - 1]), yTop);
        for (let b = 1; b < maxB; b++) {
          const y = yTop + b * (E.beam + E.beamGap) * sp;
          let i = 0;
          while (i < gr.length) {
            if ((NBEAMS[gr[i].it.n] || 1) <= b) { i++; continue; }
            let j = i; while (j + 1 < gr.length && (NBEAMS[gr[j + 1].it.n] || 1) > b) j++;
            if (j > i) rect(L(gr[i]), R(gr[j]), y);
            else {           // media barra: hacia dentro del grupo
              const st = 1.15 * sp;
              if (i === 0) rect(L(gr[i]), L(gr[i]) + st, y);
              else rect(R(gr[i]) - st, R(gr[i]), y);
            }
            i = j + 1;
          }
        }
      }
      gr.forEach(e => { if (!e.it._sola) { e.yPlicaTop = yTop; e.barras = gb; } });
      barras[k] = gb;
    }
    for (const e of notas) {
      const n = e.it.n;
      if (n !== 'w') e.plica = N.line(e.g, e.plicaX, e.yPlicaBase, e.plicaX, e.yPlicaTop, E.stem * sp);
      if ((!e.it.barra || e.it._sola) && FLAG_UP[n]) {
        const f = FLAG_UP[n]; const an = M[f].an.stemUpNW;
        e.corchete = N.glyph(e.g, f, e.plicaX - E.stem / 2 * sp - an[0] * sp, e.yPlicaTop + an[1] * sp, sp);
      }
      if (e.it.acento) {
        const ya = e.y + 1.45 * sp, xa = e.x + 0.1 * sp;
        e.acento = N.group(e.g, 'acento');
        el('polyline', { points: `${xa.toFixed(1)},${(ya - 0.32 * sp).toFixed(1)} ${(xa + 1.05 * sp).toFixed(1)},${ya.toFixed(1)} ${xa.toFixed(1)},${(ya + 0.32 * sp).toFixed(1)}`,
          fill: 'none', stroke: 'currentColor', 'stroke-width': (0.13 * sp).toFixed(2), 'stroke-linejoin': 'miter' }, e.acento);
      }
    }
    // ligaduras (por debajo: plicas arriba)
    const ligas = [];
    for (let i = 0; i < notas.length; i++) {
      const e = notas[i]; if (!e.it.liga || !notas[i + 1]) continue;
      const f = notas[i + 1];
      const gl = N.group(g, 'ligadura');
      const x1 = e.x + 0.62 * sp, x2 = f.x + 0.56 * sp, y = e.y + 0.62 * sp;
      ligadura(gl, x1, x2, y, sp);
      const o = { g: gl, de: e, a: f }; ligas.push(o); e.ligaG = gl;
    }
    // divisorias
    const alto = opt.alto != null ? opt.alto : 2;
    const yA = yMid - alto * sp, yB = yMid + alto * sp;
    for (const e of els.filter(e => e.tipo === 'div')) {
      if (e.clase === 'simple') e.linea = N.line(e.g, e.x, yA, e.x, yB, E.thinBar * sp);
      else if (e.clase === 'doble') { N.line(e.g, e.x, yA, e.x, yB, E.thinBar * sp); N.line(e.g, e.x + (E.barSep + E.thinBar) * sp, yA, e.x + (E.barSep + E.thinBar) * sp, yB, E.thinBar * sp); }
      else if (e.clase === 'final') { N.line(e.g, e.x, yA, e.x, yB, E.thinBar * sp); el('rect', { x: +(e.x + E.barSep * sp).toFixed(2), y: +yA.toFixed(2), width: +(0.5 * sp).toFixed(2), height: +(yB - yA).toFixed(2), fill: 'currentColor' }, e.g); }
    }
    return { g, w: cx - x, els, notas, ligas, barras, marcas, yN };
  }

  /** Ligadura con forma de media luna, por debajo de las cabezas. */
  function ligadura(parent, x1, x2, y, sp) {
    const L = x2 - x1, d = Math.min(1.25, 0.5 + L / sp * 0.06) * sp, th = 0.17 * sp;
    const p = `M${x1.toFixed(1)},${y.toFixed(1)} C${(x1 + L * 0.25).toFixed(1)},${(y + d).toFixed(1)} ${(x2 - L * 0.25).toFixed(1)},${(y + d).toFixed(1)} ${x2.toFixed(1)},${y.toFixed(1)} ` +
              `C${(x2 - L * 0.25).toFixed(1)},${(y + d - th).toFixed(1)} ${(x1 + L * 0.25).toFixed(1)},${(y + d - th).toFixed(1)} ${x1.toFixed(1)},${y.toFixed(1)} Z`;
    return el('path', { d: p, fill: 'currentColor' }, parent);
  }

  /** Cifra de compás de dígitos (centro vertical en yc). Devuelve el ancho en px. */
  function cifra(parent, str, x, yc, sp, s) {
    let cx = x;
    for (const ch of String(str)) { N.glyph(parent, 'timeSig' + ch, cx, yc, sp, s); cx += adv('timeSig' + ch, s) * sp; }
    return cx - x;
  }
  const anchoCifra = (str, s) => { let w = 0; for (const ch of String(str)) w += adv('timeSig' + ch, s); return w; };

  /**
   * Compás «nuevo»: el número arriba y, abajo, la figura que vale cada pulso (negra, corchea, negra con puntillo…).
   * fig: 'q' | '8' | 'h' ; puntos: 0/1. Devuelve {g, w, num, fig}.
   */
  function compasFigura(parent, num, fig, puntos, x, yMid, sp) {
    /* (6-nov, Iago) la figura con la PLICA HACIA ABAJO (como las notas agudas): así no se mete en el número de arriba.
       Cabeza justo debajo del número, plica a la izquierda bajando; la corchea, con su corchete hacia abajo. */
    sp = sp || N.SP;
    const g = N.group(parent, 'compasFigura');
    const s = 0.85, cab = fig === 'h' ? 'noteheadHalf' : 'noteheadBlack';
    const wCab = adv(cab, s), wf = wCab + (fig === '8' ? 0.55 * s : 0) + (puntos ? 0.62 : 0), wn = anchoCifra(num);
    const w = Math.max(wn, wf);
    const gn = N.group(g, 'num'); cifra(gn, num, x + (w - wn) / 2 * sp, yMid - sp, sp);
    const gf = N.group(g, 'fig');
    const xf = x + (w - wf) / 2 * sp, yh = yMid + 1.0 * sp;   // (6-nov) aire entre el número y la cabeza
    N.glyph(gf, cab, xf, yh, sp, s);
    const xp = xf + E.stem / 2 * sp, y0 = yh + 0.168 * s * sp, y1 = yh + (fig === '8' ? 3.7 : 3.2) * sp;   // (6-nov) la corchea, más larga: que el corchete no toque la cabeza
    N.line(gf, xp, y0, xp, y1, E.stem * sp);
    if (fig === '8') { const an = M.flag8thDown.an.stemDownSW; N.glyph(gf, 'flag8thDown', xp - E.stem / 2 * sp - an[0] * s * sp, y1 + an[1] * s * sp, sp, s); }
    if (puntos) N.glyph(gf, 'augmentationDot', xf + (wCab + 0.22) * sp, yh - 0.02 * sp, sp);
    return { g, w: w * sp, num: gn, fig: gf };
  }
  /** Compás de siempre (2/4, 6/8…). */
  function compasNum(parent, num, den, x, yMid, sp) {
    sp = sp || N.SP;
    const g = N.group(parent, 'compasNum');
    const wn = anchoCifra(num), wd = anchoCifra(den), w = Math.max(wn, wd);
    const gn = N.group(g, 'num'), gd = N.group(g, 'den');
    cifra(gn, num, x + (w - wn) / 2 * sp, yMid - sp, sp);
    cifra(gd, den, x + (w - wd) / 2 * sp, yMid + sp, sp);
    return { g, w: w * sp, num: gn, den: gd };
  }

  Object.assign(N, { ritmo2, ligadura, compasFigura, compasNum, anchoCifra2: anchoCifra });
})();
