// Mimi Moons animated starfield + floating mascot
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let w, h, stars = [];
let img = new Image();
img.src = 'logo.png'; // senin Mimi Moons karakterin

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  stars = Array.from({ length: Math.min(350, Math.floor((w * h) / 5000)) }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.4 + 0.3,
    s: Math.random() * 0.6 + 0.2,
    a: Math.random() * 0.8 + 0.2
  }));
}
window.addEventListener('resize', resize);
resize();

let tiltX = 0, tiltY = 0;
window.addEventListener('mousemove', (e) => {
  tiltX = (e.clientX - w / 2) / (w / 2);
  tiltY = (e.clientY - h / 2) / (h / 2);
});

let t = 0;
function draw() {
  ctx.clearRect(0, 0, w, h);

  // Background glow
  const g = ctx.createRadialGradient(w * 0.7, h * 0.2, 0, w * 0.7, h * 0.2, Math.max(w, h) * 0.8);
  g.addColorStop(0, 'rgba(26,28,73,0.25)');
  g.addColorStop(1, 'rgba(26,28,73,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Stars
  ctx.save();
  ctx.translate(tiltX * 6, tiltY * 6);
  for (const s of stars) {
    ctx.globalAlpha = s.a;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    s.x += s.s * 0.25;
    if (s.x > w + 4) s.x = -4;
  }
  ctx.restore();

  // Floating Mimi Moons mascot
  const size = Math.min(w, h) * 0.25; // logo boyutu
  const floatX = w / 2 + Math.sin(t * 0.6) * 30;
  const floatY = h / 2 + Math.cos(t * 0.4) * 20;
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.shadowColor = 'rgba(213,180,101,0.5)';
  ctx.shadowBlur = 40;
  ctx.drawImage(img, floatX - size / 2, floatY - size / 2, size, size);
  ctx.restore();

  t += 0.01;
  requestAnimationFrame(draw);
}
draw();
