/* ========== ELEMENTOS ========== */
const btn = document.getElementById("btnComenzar");
const cerrar = document.getElementById("cerrarPopup");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const cartaCerrada = document.getElementById("cartaCerrada");
const musica = document.getElementById("musica");

/* ========== CANVAS FUEGOS ========== */
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

let fireworksActive = false;
let particles = [];

/* ========== AJUSTAR CANVAS ========== */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ========== PARTÍCULA ========== */
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 6;
        this.speedY = (Math.random() - 0.5) * 6;
        this.life = 60;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

/* ========== CREAR FUEGO ========== */
function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.6;
    const colors = ["#ffd700", "#ff3d81", "#4cc9f0", "#ffffff"];

    for (let i = 0; i < 40; i++) {
        particles.push(
            new Particle(
                x,
                y,
                colors[Math.floor(Math.random() * colors.length)]
            )
        );
    }
}

/* ========== ANIMAR ========== */
function animateFireworks() {
    if (!fireworksActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.life <= 0) particles.splice(i, 1);
    });

    requestAnimationFrame(animateFireworks);
}

/* ========== INTERVALO FUEGOS ========== */
setInterval(() => {
    if (fireworksActive) createFirework();
}, 800);

/* ========== BOTÓN COMENZAR ========== */
btn.addEventListener("click", () => {
    overlay.classList.add("active");
    document.body.classList.add("locked");

    cartaCerrada.style.display = "flex";
    popup.style.display = "none";

    fireworksActive = true;
    animateFireworks();

    musica.volume = 0;
    musica.play();

    let vol = 0;
    const fadeIn = setInterval(() => {
        if (vol < 0.4) {
            vol += 0.02;
            musica.volume = vol;
        } else {
            clearInterval(fadeIn);
        }
    }, 100);
});

/* ========== ABRIR CARTA ========== */
cartaCerrada.addEventListener("click", () => {
    cartaCerrada.style.display = "none";
    popup.style.display = "block";
});

/* ========== CERRAR TODO ========== */
cerrar.addEventListener("click", () => {
    overlay.classList.remove("active");
    document.body.classList.remove("locked");

    popup.style.display = "none";
    cartaCerrada.style.display = "none";

    fireworksActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let vol = musica.volume;
    const fadeOut = setInterval(() => {
        if (vol > 0) {
            vol -= 0.02;
            musica.volume = vol;
        } else {
            musica.pause();
            musica.currentTime = 0;
            clearInterval(fadeOut);
        }
    }, 100);
});
