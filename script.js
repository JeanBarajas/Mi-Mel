/* Texto de la carta. Puedes editarlo aquí sin tocar el diseño. */
const LETTER_TEXT = `No sé si alguna vez encontré la forma exacta de hacerte entender lo mucho que me gustabas. Tal vez no siempre supe demostrarlo de la manera que merecías, pero quiero que tengas algo muy claro: lo que sentí por ti fue real.

Me encantaste. Me gustó tu forma de ser, tu manera de pensar, tu inteligencia, tu independencia y ese lado cariñoso que fui descubriendo poco a poco. Me parecías —y me sigues pareciendo— una mujer preciosa, por fuera y por dentro. Tienes tantas de esas cualidades que siempre he admirado y que quisiera encontrar en una compañera de vida, que más de una vez me imaginé cómo sería compartir contigo mucho más que conversaciones a la distancia.

Y sí, me habría encantado conocerte, abrazarte, salir contigo y descubrir cómo sería estar juntos en persona. No eras simplemente alguien con quien hablaba para pasar el rato. Me ilusionaba saber de ti, compartir mis días contigo y sentirte cerca, incluso estando tan lejos. Me acompañaste durante todo este tiempo de una forma que quizá no alcanzas a dimensionar, y hubo momentos en los que hiciste mis días mucho más bonitos sin siquiera proponértelo.

Si alguna vez te preguntaste qué quería contigo, o si de verdad había un interés de mi parte, quiero despejar esa duda: sí lo había. Me gustabas muchísimo y tenía ilusión de que algún día pudiéramos convertir todo esto en algo real. No puedo decirte que sabía cómo iba a salir, porque la verdad es que nunca tuvimos la oportunidad de descubrirlo, pero sí sé que quería intentarlo y que mi interés no era un juego ni algo pasajero.

También entiendo que la distancia pesa. Barranquilla y Bogotá no son precisamente cerca, y por más bonito que sea lo que uno siente, mantener una conexión así puede volverse difícil. Entiendo que te hayas cansado de sentir que eras tú quien insistía, y no quiero que te quedes con la sensación de que no me importabas o de que estabas sintiendo algo sola. Lamento si mis silencios, mis tiempos o mi manera de estar presente te hicieron dudar de eso. Quizá no supe cuidar esta conexión como debía.

No te escribo para hacerte cambiar de opinión ni para pedirte que te quedes donde ya sientes que debes soltar. Si para ti lo mejor es dejarlo hasta aquí, lo respeto. Solo no quería que te fueras pensando que no significaste nada o que no hubo ilusión de mi parte, porque sería completamente injusto con lo que viví y sentí contigo.

Me encantaría que algún día la vida nos diera la oportunidad de conocernos. No como una promesa ni como una expectativa que tengas que cargar, sino porque genuinamente me gustaría mirarte a los ojos y compartir contigo ese encuentro que tantas veces imaginé.

Gracias por acompañarme durante este tiempo, por tus conversaciones, tu cariño y por todo lo bonito que despertaste en mí. Me quedo con mucho aprecio por ti y con la tranquilidad de haberte dicho la verdad.

Te quiero mucho, mucho, mucho mi Mel. ❤️

Jean`;

const WHISPER_TEXT = "Gracias por haber llegado a mi vida, aunque haya sido a la distancia. ❤️";
const TYPE_SPEED_MS = 22;
const PARAGRAPH_PAUSE_MS = 260;

const openBtn = document.getElementById("openBtn");
const envelope = document.getElementById("envelope");
const letter = document.getElementById("letter");
const letterBody = document.getElementById("letterBody");
const replayBtn = document.getElementById("replay");
const showAllBtn = document.getElementById("showAll");
const letterEnding = document.getElementById("letterEnding");

let typingTimer = null;
let typedIndex = 0;
let whisperEl = null;
let isTyping = false;

const paragraphBreaks = new Set();
for (const match of LETTER_TEXT.matchAll(/\n\n/g)) {
  paragraphBreaks.add(match.index + match[0].length);
}

function clearTyping() {
  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = null;
  isTyping = false;
}

function clearLetter() {
  clearTyping();
  typedIndex = 0;
  letterBody.textContent = "";
  letterEnding.hidden = true;
  if (whisperEl) {
    whisperEl.remove();
    whisperEl = null;
  }
  if (showAllBtn) showAllBtn.hidden = false;
}

function finishLetter() {
  clearTyping();
  letterBody.textContent = LETTER_TEXT;
  letterEnding.hidden = false;
  if (showAllBtn) showAllBtn.hidden = true;
  whisperEl = document.createElement("p");
  whisperEl.className = "closing-whisper";
  whisperEl.textContent = WHISPER_TEXT;
  whisperEl.style.cssText = "margin:18px 0 0;text-align:center;color:#827b73;font-style:italic;font-size:.95rem;";
  letterBody.appendChild(whisperEl);
}

function typeNext() {
  if (typedIndex >= LETTER_TEXT.length) {
    finishLetter();
    return;
  }
  typedIndex += 1;
  letterBody.textContent = LETTER_TEXT.slice(0, typedIndex);

  const pause = paragraphBreaks.has(typedIndex) ? PARAGRAPH_PAUSE_MS : TYPE_SPEED_MS;
  typingTimer = setTimeout(typeNext, pause);
}

function startTyping() {
  clearLetter();
  isTyping = true;
  typingTimer = setTimeout(typeNext, 220);
}

function openLetter() {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  openBtn.setAttribute("aria-expanded", "true");
  openBtn.textContent = "Carta abierta ❤️";
  startTyping();
  window.setTimeout(() => {
    letter.focus({ preventScroll: true });
  }, 500);
}

function replayLetter() {
  if (!envelope.classList.contains("open")) openLetter();
  else startTyping();
  letter.scrollTop = 0;
}

openBtn.addEventListener("click", openLetter);
replayBtn.addEventListener("click", replayLetter);
showAllBtn.addEventListener("click", () => {
  if (!envelope.classList.contains("open")) openLetter();
  finishLetter();
});

/* Cielo de estrellas: ligero y adaptado al tamaño de pantalla. */
(() => {
  const canvas = document.getElementById("stars");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0, height = 0, dpr = 1, stars = [], raf = null, last = 0;
  let comet = null, cometCountdown = 8;

  const random = (min, max) => Math.random() * (max - min) + min;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(170, Math.max(65, Math.floor(width * height / 6500)));
    stars = Array.from({ length: count }, () => ({
      x: random(0, width), y: random(0, height),
      r: random(.35, 1.35), phase: random(0, Math.PI * 2),
      speed: random(.35, 1.0), alpha: random(.25, .8)
    }));
    drawStatic();
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = "#e3e9ff";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function spawnComet() {
    const fromLeft = Math.random() > .5;
    comet = {
      x: fromLeft ? -30 : width + 30,
      y: random(30, height * .55),
      vx: fromLeft ? random(180, 260) : -random(180, 260),
      vy: random(55, 105),
      life: 0,
      duration: random(1.5, 2.2)
    };
  }

  function frame(time) {
    if (!last) last = time;
    const dt = Math.min((time - last) / 1000, .04);
    last = time;
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      star.phase += star.speed * dt;
      ctx.globalAlpha = Math.max(.12, star.alpha * (.55 + .45 * Math.cos(star.phase)));
      ctx.fillStyle = "#e3e9ff";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (comet) {
      comet.life += dt;
      comet.x += comet.vx * dt;
      comet.y += comet.vy * dt;
      const tailX = comet.x - Math.sign(comet.vx) * 95;
      const tailY = comet.y - 35;
      const gradient = ctx.createLinearGradient(comet.x, comet.y, tailX, tailY);
      gradient.addColorStop(0, "rgba(255,255,255,.85)");
      gradient.addColorStop(1, "rgba(180,200,255,0)");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(comet.x, comet.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
      if (comet.life > comet.duration || comet.x < -150 || comet.x > width + 150) comet = null;
    } else {
      cometCountdown -= dt;
      if (cometCountdown <= 0) {
        spawnComet();
        cometCountdown = random(12, 20);
      }
    }

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (reduceMotion || document.hidden || raf) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  resize();
  if (!reduceMotion) start();
  window.addEventListener("resize", () => { stop(); resize(); start(); }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });
})();
