// 3D Starfield with perspective + copy-to-clipboard
const cv = document.getElementById('starfield');
const cx = cv.getContext('2d');
let W, H;
let stars = [];
let perspective = 400;  // lower = stronger depth
let speed = 0.4;        // base forward speed
let mouseX = 0, mouseY = 0;

function resize(){
  W = cv.width = window.innerWidth;
  H = cv.height = window.innerHeight;
  const count = Math.min(800, Math.floor((W*H)/2500)); // number of stars based on area
  stars = Array.from({length: count}, () => ({
    x: (Math.random()*2 - 1) * W,
    y: (Math.random()*2 - 1) * H,
    z: Math.random()*1000 + 100,
    r: Math.random()*1.5 + 0.5,
    a: Math.random()*0.6 + 0.3
  }));
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e)=>{
  // mouse offset for parallax
  mouseX = (e.clientX / W - 0.5) * 2; // -1..1
  mouseY = (e.clientY / H - 0.5) * 2;
});

function draw(){
  cx.clearRect(0,0,W,H);

  // faint cosmic glow
  const g = cx.createRadialGradient(W*0.7, H*0.2, 0, W*0.7, H*0.2, Math.max(W,H)*0.8);
  g.addColorStop(0, 'rgba(26,28,73,0.25)');
  g.addColorStop(1, 'rgba(26,28,73,0)');
  cx.fillStyle = g;
  cx.fillRect(0,0,W,H);

  // starfield
  cx.fillStyle = '#ffffff';
  for (let s of stars){
    s.z -= speed * 2; // move towards camera
    if (s.z < 1){
      s.x = (Math.random()*2 - 1) * W;
      s.y = (Math.random()*2 - 1) * H;
      s.z = 1000;
    }

    // perspective projection
    const k = perspective / (s.z);
    const px = W/2 + (s.x + mouseX*120) * k;
    const py = H/2 + (s.y + mouseY*120) * k;
    const pr = s.r * k * 2;

    if (px < 0 || px > W || py < 0 || py > H) continue;

    cx.globalAlpha = Math.min(1, s.a + (1 - s.z/1000)*0.5);
    cx.beginPath();
    cx.arc(px, py, pr, 0, Math.PI*2);
    cx.fill();
  }

  requestAnimationFrame(draw);
}
draw();

// Copy contract
const copyBtn = document.getElementById('copyBtn');
const contractText = document.getElementById('contractText');
const copiedToast = document.getElementById('copiedToast');
if (copyBtn){
  copyBtn.addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText(contractText.textContent.trim());
      copiedToast.style.opacity = 1;
      setTimeout(()=> copiedToast.style.opacity = 0, 1200);
    }catch(e){ alert('Copy failed'); }
  });
}
