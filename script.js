// Starfield with 3D parallax + mobile optimization
const cvs = document.getElementById('stars');
const ctx = cvs.getContext('2d', { alpha: true });
let w, h, stars = [];
let tiltX = 0, tiltY = 0, t = 0;

function resize(){
  w = cvs.width = window.innerWidth * devicePixelRatio;
  h = cvs.height = window.innerHeight * devicePixelRatio;
  cvs.style.width = window.innerWidth + 'px';
  cvs.style.height = window.innerHeight + 'px';

  const base = Math.floor((window.innerWidth * window.innerHeight) / 9000);
  const count = Math.min(400, Math.max(90, base)); // mobile-safe
  stars = Array.from({length: count}, () => ({
    x: Math.random()*w,
    y: Math.random()*h,
    z: Math.random()*0.9 + 0.1, // depth
    s: Math.random()*1.2 + 0.3,  // size
    spd: Math.random()*0.6 + 0.2 // speed
  }));
}
resize();
window.addEventListener('resize', resize);

// Parallax from pointer
function handleMove(e){
  const cx = (e.touches ? e.touches[0].clientX : e.clientX) - window.innerWidth/2;
  const cy = (e.touches ? e.touches[0].clientY : e.clientY) - window.innerHeight/2;
  tiltX = cx / (window.innerWidth/2);
  tiltY = cy / (window.innerHeight/2);
}
window.addEventListener('mousemove', handleMove, {passive:true});
window.addEventListener('touchmove', handleMove, {passive:true});

function draw(){
  t += 0.016;
  // radial night glow
  ctx.clearRect(0,0,w,h);
  const rg = ctx.createRadialGradient(w*0.5, h*0.1, 0, w*0.5, h*0.1, Math.max(w,h)*0.9);
  rg.addColorStop(0, 'rgba(10,25,60,.45)');
  rg.addColorStop(1, 'rgba(8,13,31,1)');
  ctx.fillStyle = rg;
  ctx.fillRect(0,0,w,h);

  // stars
  for(const s of stars){
    const px = s.x + tiltX * (1.2 - s.z) * 30;
    const py = s.y + tiltY * (1.2 - s.z) * 30 + t * s.spd * 18;
    const y = (py % h);
    ctx.globalAlpha = 0.7 + Math.sin((t*2 + s.x*0.0008))*0.3;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px, y, s.s * s.z * devicePixelRatio, 0, Math.PI*2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();

// Copy contract
document.getElementById('copyBtn')?.addEventListener('click', () => {
  const text = document.getElementById('contractText').textContent.trim();
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    const old = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = old, 1200);
  });
});
