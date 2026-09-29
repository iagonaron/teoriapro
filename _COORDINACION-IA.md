# Coordinación entre conversaciones de Claude · teoriapro (Teoría PRO)

Iago tiene varias conversaciones de Claude subiendo cambios a este repositorio a la vez
(27-sep-2026: tres; una de ellas va a cambiar la estética del portal). Este fichero es
el punto de encuentro. Empieza por «_» para que la web no lo publique.

## Antes de subir nada (cualquier conversación)
1. Mira el último commit de `main` y lee este fichero.
2. Apunta en el REGISTRO (abajo) fecha y hora, quién eres, qué ficheros vas a tocar y
   «EN CURSO». Sube esa línea antes que tu cambio (un commit solo con este fichero).
3. Edita SIEMPRE sobre la versión del último commit, descargada justo antes. Nunca subas
   un index.html entero hecho a partir de una copia antigua (ni del espejo de Dropbox sin
   comprobar que es igual a GitHub): borrarías el trabajo de otra conversación.
4. Justo antes de confirmar («Commit changes»), comprueba otra vez que `main` no ha cambiado.
   Si ha cambiado, rehaz tu cambio sobre la versión nueva.
5. Toca solo tu parte. Cada bloque añadido va marcado con un comentario «(fecha, Iago) …» y
   un «Para quitarlo: …». No borres ni reescribas bloques de otros; si tu cambio los afecta,
   explícalo aquí.
6. Al terminar: tu línea pasa a «HECHO · commit xxxxxxx», y deja el espejo de Dropbox
   (APPs/LMATHOME GP (github lmpro)/LMPRO/TEORÍA PRO/) igual que GitHub.

## Quién es quién
- «Intros didácticas»: vídeos de introducción (carpeta intros/ y botón ▶ en las tarjetas).
- «Fichas y rediseño»: arreglo URGENTE del guardado de las fichas de alumno (27-sep) y, más adelante,
  la estética nueva solo para las cuentas Tester/Protester (una línea «LM piel» tras `<meta charset>`).
- «Apuntes en fichas»: botones «APUNTES» / «VER VÍDEO» en la ficha del alumno (27-sep). Lo preparó otra
  conversación y lo publica el coordinador.
- (otras conversaciones: añadid aquí vuestro nombre y de qué os ocupáis)

## Dependencias (léelo si cambias la estética o el HTML de las tarjetas)
- Botón ▶ de la tarjeta «Compases» = bloque `ivf-*` al final de index.html (justo antes
  de </body>). Busca `.home-grid .mode-card[data-path="compasespro"]` y usa las variables
  CSS `--gold1`, `--gold2` y `--gold-soft` (con valores de reserva).
  Si cambiáis el HTML de las tarjetas: conservad `data-path` o actualizad `INTROS` en ese
  bloque. Los estilos `.ivf-play` / `.ivf-*` se pueden adaptar a la estética nueva.
  Prueba: pulsar ▶ → la tarjeta gira, crece y arranca el vídeo; ✕, Esc o «Salir» la cierran.
- intros/compases-extranos/ es autónoma (no carga nada del portal): no hace falta tocarla.
- Botones «APUNTES» / «VER VÍDEO» de la ficha del alumno = bloque «(27-sep-2026, Iago) APUNTES EN LAS
  FICHAS» (ApxFicha, entre VER APUNTES e `ivf-*`). Si cambiáis la fila de «No lo sé hacer…» en `pintaAlu`,
  conservad `class="fp-ayuda"` e `id="aluPractica"`. Si añadís una intro a `INTROS`, añadidla también a
  `VIDEO` de ese bloque. Los botones usan la clase `fp-practica` para el tamaño (la estética «LM piel» la
  heredará); el color lo fija `.apxf-btn`.

- (28-sep, Intros didácticas) VÍDEOS DE GRADO ELEMENTAL EN LAS TARJETAS DE REPASO: bloque de ese nombre (clases `ivg-*`,
  el mismo que en teoriaathome) justo antes de </body>. Pone ▶ en `.home-grid .mode-card[data-path=…]` de intervalos,
  inversion, escalas y tonalidades: si cambiáis el HTML de las tarjetas, conservad `data-path` o actualizad `INTROS` en
  ese bloque. «Ir a ejercicios» usa `window.__abrirVista` y, para colocar, `invOuter`/`invTab` y los id `cardESC0-2`
  (escalas) y `cardTA-TC` (tonalidades): si se renombran, actualizad `EJERCICIOS` en ese bloque. El ▶ copia el estilo de
  `.ivf-play` (variables `--gold*`) y el bloque ya trae lo equivalente a «TARJETA QUE GIRA» para `ivg-*`.
  Los vídeos con «prueba: true» solo los ven Tester y Protester (APX.comprobar). El 👍 es el MISMO que en GE (Supabase,
  clave `intros/<carpeta>/index.html`, sin «gp:»). AL PUBLICARLOS (solo cuando Iago lo diga y solo los que tengan 👍):
  «prueba: true» → «alumnos: true» (nunca invitados) y añadirlos a `VIDEO` de «APUNTES EN LAS FICHAS»: intervalos_id e
  intervalos_build → intros/intervalos/, inversion_int_simples → intros/inversion-intervalos/, inversion_int_compuestos →
  intros/inversion-compuestos/, escala_menor → intros/escalas-menores/, escala_mayor → intros/escalas-mayores/,
  escala_otras → intros/otras-escalas/, ton_nombre → intros/indica-la-tonalidad/, ton_armadura →
  intros/indica-la-armadura/, ton_vecinos → intros/tonalidades-vecinas/ (cada una con /index.html).
  Esas carpetas son COPIAS de teoriaathome/intros/ (solo cambia `INTRO_CFG` del index.html: «Salir» e «Ir a ejercicios»
  llevan a este portal): si se cambia uno de esos vídeos en GE, hay que copiarlo aquí también. intros/la-tonalidad/ sale
  la primera en el menú de «Tonalidades» (4 vídeos, como en GE; 29-sep) y también la abre el cartel «▶ La tonalidad»
  de los vídeos de escalas.

## Registro (lo más reciente arriba · hora de Galicia)
- 29-sep 08:39 · Fichas y rediseño · EN CURSO · index.html · ficha del alumno: «No lo sé hacer / tengo dudas» como
  texto + hasta 3 botones con contorno rosa (Apuntes · Vídeo · Practicar ejercicios sueltos) en pintaAlu y en el
  bloque «APUNTES EN LAS FICHAS» (ApxFicha); en las preguntas test (fonógrafo y demás temas del Libro 2GP), «Apuntes»
  (el Libro 2GP en PDF si no hay apuntes web) y «Ver portal interactivo»; ventana «Vamos a practicar esto» con la
  estética nueva (fpModalPracticar); vídeos con 👍 en la ficha (lista propia dentro de ApxFicha: NO toca INTROS, ivg-*,
  ivf-* ni intros/); revisión del profesor: &ej=N centra el ejercicio y rótulo con la estética nueva. Parto de
  c244f8a.
- 29-sep 06:50 · Intros didácticas · HECHO · commit 5725e4c · index.html: en el bloque «VÍDEOS DE GRADO ELEMENTAL EN LAS
  TARJETAS DE REPASO» (ivg-*), «La tonalidad» sale también en el menú de la tarjeta «Tonalidades» (4 vídeos, como en GE;
  lo pide Iago). Solo cambian 2 líneas de ese bloque (INTROS y su comentario). Partí de 1b82288.
- 28-sep 20:33 · Intros didácticas · HECHO · commits 9b5a04c, 24ac2bd, f1f0c11, 40d97e2, 6dc0d38, 62260b2, 19c1911,
  dbc3efc, e305faa, ed6a8a5 y 7465347 (una carpeta de intros/ cada uno) y d915f15 (index.html) · vídeos de Grado Elemental
  TAL CUAL (EN PRUEBA: solo Tester y Protester) en las tarjetas de REPASO «Intervalos», «Inversión», «Escalas» y
  «Tonalidades» · carpetas nuevas intros/intervalos/, intervalos-compuestos/, inversion-intervalos/, inversion-compuestos/,
  indica-la-tonalidad/, indica-la-armadura/, tonalidades-vecinas/, escalas-menores/, escalas-mayores/, otras-escalas/ y
  la-tonalidad/ (esta sin menú) · index.html: solo un bloque nuevo «VÍDEOS DE GRADO ELEMENTAL EN LAS TARJETAS DE REPASO»
  (ivg-*) justo antes de </body>; no toca ivf-*, ni «TARJETA QUE GIRA», ni nada más. Partí de b0c2986.
- 28-sep 09:19 · Fichas y rediseño · HECHO · commit 9ae4de9 · index.html: (1) ficha del alumno, APUNTES: antes una ventana
  «¿Necesitas mirar los apuntes?» y, abiertos, «‹ Volver» bloqueado 1 minuto, sin ✕ (bloque «APUNTES EN LAS FICHAS»;
  solo Protester); (2) VER APUNTES sin la ✕ de la derecha (un <style> al final); (3) tarjeta Compases que gira con ▶:
  un <style> APARTE al final (no toca el bloque ivf-*) que quita el desenfoque y el ▶/«VER APUNTES» de la copia que
  gira, desvanece la cara de delante al girar y hace que la ✕ responda al primer clic con la estética nueva.
- 28-sep 08:46 · Fichas y rediseño · HECHO · commit f67c1b5 · index.html: apuntes nuevos con las respuestas de Iago (?v=2: apuntes.js,
  apuntes-kit.js, apuntes-2gp.js; solo Protester), Cadencias → gp-cadencias (tarjeta y ficha) y la línea «LM piel»
  tras `<meta charset>` (index.html, compases.html, modulacion.html; no hace nada sin la cuenta de prueba). No toca
  las tarjetas, `ivf-*` ni intros/.
- 28-sep 08:20 · Intros didácticas · HECHO · commit a27fb17 · intros/compases-extranos/escenas.js: el rótulo del título
  («GRADO PROFESIONAL · UNIDAD 1») pasa de dorado a rosa (una línea). No toca index.html ni nada más.
- 27-sep 21:57 · Apuntes en fichas · HECHO · commit fbb9132 · index.html: botones «APUNTES» / «VER VÍDEO» / «¿Dudas? Ver
  APUNTES» en la fila de «No lo sé hacer…» de la ficha del alumno (pintaAlu: `class="fp-ayuda"` + 1 línea
  `ApxFicha.pinta`; bloque ApxFicha entre VER APUNTES e `ivf-*`). Misma puerta que VER APUNTES (solo Protester).
  No toca las tarjetas ni el bloque `ivf-*` (reutiliza su intro `intros/compases-extranos/` en un visor propio).
- 27-sep 14:15 · Fichas y rediseño · HECHO · commit 00cf7ad · index.html: FIX guardado de fichas (punto de control completo
  para todos los tipos, ruedas del índice/tonalidades/transporte/enarmonías con la respuesta al volver, «hechos»
  reales). Solo toca funciones de la ficha del alumno; no toca tarjetas ni el bloque `ivf-*`.
- 27-sep 10:20 · Intros didácticas · HECHO · crea este fichero y añade un aviso al
  principio de index.html (solo un comentario, tras `<meta charset>`) · mismo commit
- 27-sep 10:09 · Intros didácticas · HECHO · index.html: bloque `ivf-*` (botón ▶ en la
  tarjeta «Compases») · commit 2a45fe0
- 27-sep 10:07 · Intros didácticas · HECHO · intros/compases-extranos/ (13 ficheros,
  intro de 4:48) · commit cb78844
- «Intros didácticas» sigue ahora con vídeos de Grado Elemental (otro repositorio). En
  teoriapro no tocará nada más sin apuntarlo antes aquí.
