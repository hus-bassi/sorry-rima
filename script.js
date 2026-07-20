(() => {
"use strict";

/* =========================================================
   UTIL
   ========================================================= */
const $ = (sel) => document.querySelector(sel);
const rand = (a,b) => Math.random()*(b-a)+a;

function showScene(id){
  document.querySelectorAll(".scene").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}

/* =========================================================
   CURSOR GLOW + CLICK RIPPLE + SPARKLES
   ========================================================= */
const cursorGlow = $("#cursorGlow");
window.addEventListener("mousemove", (e) => {
  cursorGlow.style.left = e.clientX + "px";
  cursorGlow.style.top  = e.clientY + "px";
  if (Math.random() < 0.06) spawnSparkle(e.clientX, e.clientY);
});

function spawnSparkle(x,y){
  const s = document.createElement("div");
  s.textContent = "✨";
  s.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:${rand(10,16)}px;
    z-index:9998;pointer-events:none;transform:translate(-50%,-50%);
    animation: floatUp 1s ease-out forwards;`;
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 1000);
}

window.addEventListener("pointerdown", (e) => {
  const r = document.createElement("div");
  r.className = "ripple";
  r.style.left = e.clientX + "px";
  r.style.top = e.clientY + "px";
  r.style.width = r.style.height = "16px";
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 700);
});

/* =========================================================
   AMBIENT BACKGROUND CANVAS (stars, dust, bokeh)
   ========================================================= */
const bgCanvas = $("#bgCanvas");
const bgCtx = bgCanvas.getContext("2d");
function resizeCanvas(c){ c.width = innerWidth; c.height = innerHeight; }
resizeCanvas(bgCanvas);

const stars = Array.from({length:90}, () => ({
  x: Math.random()*innerWidth, y: Math.random()*innerHeight*0.7,
  r: rand(.6,1.8), tw: rand(0,Math.PI*2), speed: rand(.01,.03)
}));
const bokeh = Array.from({length:16}, () => ({
  x: Math.random()*innerWidth, y: Math.random()*innerHeight,
  r: rand(30,90), hue: Math.random() < .5 ? "255,111,165" : "201,166,255",
  drift: rand(-.12,.12), o: rand(.03,.09)
}));

function loopBg(){
  bgCtx.clearRect(0,0,bgCanvas.width, bgCanvas.height);
  bokeh.forEach(b => {
    b.x += b.drift;
    if (b.x < -100) b.x = bgCanvas.width+100;
    if (b.x > bgCanvas.width+100) b.x = -100;
    const g = bgCtx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
    g.addColorStop(0, `rgba(${b.hue},${b.o})`);
    g.addColorStop(1, `rgba(${b.hue},0)`);
    bgCtx.fillStyle = g;
    bgCtx.beginPath(); bgCtx.arc(b.x,b.y,b.r,0,Math.PI*2); bgCtx.fill();
  });
  stars.forEach(s => {
    s.tw += s.speed;
    const alpha = 0.4 + Math.sin(s.tw)*0.4;
    bgCtx.fillStyle = `rgba(255,255,255,${Math.max(0,alpha)})`;
    bgCtx.beginPath(); bgCtx.arc(s.x,s.y,s.r,0,Math.PI*2); bgCtx.fill();
  });
  requestAnimationFrame(loopBg);
}
loopBg();
window.addEventListener("resize", () => resizeCanvas(bgCanvas));

/* =========================================================
   MUSIC TOGGLE
   ========================================================= */
const music = $("#bgMusic");
const musicBtn = $("#musicToggle");
let musicOn = false;
musicBtn.addEventListener("click", () => {
  musicOn = !musicOn;
  musicBtn.classList.toggle("playing", musicOn);
  musicBtn.querySelector(".music-icon").textContent = musicOn ? "🔊" : "🎵";
  if (musicOn){ music.play().catch(()=>{}); } else { music.pause(); }
});

/* =========================================================
   PETALS (scene 1 background)
   ========================================================= */
const petalsLayer = $("#petalsLayer");
const petalEmojis = ["🌸","🌹","💮","🥀"];
function spawnPetal(){
  const p = document.createElement("div");
  p.className = "petal";
  p.textContent = petalEmojis[Math.floor(Math.random()*petalEmojis.length)];
  p.style.left = rand(0,100) + "%";
  p.style.setProperty("--drift", rand(-80,80)+"px");
  p.style.animationDuration = rand(7,14) + "s";
  p.style.fontSize = rand(14,26) + "px";
  petalsLayer.appendChild(p);
  setTimeout(() => p.remove(), 15000);
}
let petalInterval = setInterval(spawnPetal, 450);
for (let i=0;i<10;i++) setTimeout(spawnPetal, i*120);

/* =========================================================
   SAKURA + FIREFLIES (scene 3)
   ========================================================= */
const sakuraLayer = $("#sakuraLayer");
function spawnSakura(){
  const s = document.createElement("div");
  s.className = "sakura";
  s.textContent = "🌸";
  s.style.left = rand(0,100) + "%";
  s.style.setProperty("--drift", rand(-60,60)+"px");
  s.style.animationDuration = rand(6,11) + "s";
  sakuraLayer.appendChild(s);
  setTimeout(() => s.remove(), 12000);
}
setInterval(() => { if($("#scene-world").classList.contains("active")) spawnSakura(); }, 600);

const fireflyLayer = $("#fireflies");
for (let i=0;i<18;i++){
  const f = document.createElement("div");
  f.className = "firefly";
  f.style.left = rand(0,100) + "%";
  f.style.top = rand(40,85) + "%";
  f.style.animationDuration = rand(6,12)+"s, "+rand(2,4)+"s";
  fireflyLayer.appendChild(f);
}

/* =========================================================
   SCENE 0 — INTRO SEQUENCE
   ========================================================= */
const introText = $("#introText");
function typeLine(el, text, speed=55){
  return new Promise((resolve) => {
    el.textContent = "";
    el.style.opacity = 1;
    let i = 0;
    const t = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length){ clearInterval(t); resolve(); }
    }, speed);
  });
}
function fadeOut(el, dur=600){
  return new Promise((resolve) => {
    el.style.transition = `opacity ${dur}ms ease`;
    el.style.opacity = 0;
    setTimeout(resolve, dur);
  });
}

async function runIntro(){
  await new Promise(r => setTimeout(r, 3200)); // glow + heartbeat moment
  await typeLine(introText, "فيه رسالة...");
  await new Promise(r => setTimeout(r, 900));
  await fadeOut(introText, 500);
  introText.style.opacity = 0;
  await new Promise(r => setTimeout(r, 300));
  await typeLine(introText, "من شخص بيحبك جداً.");
  await new Promise(r => setTimeout(r, 1200));
  await fadeOut(introText, 700);
  await new Promise(r => setTimeout(r, 300));
  showScene("#scene-main");
}
runIntro();

/* =========================================================
   SCENE 1 — MAIN CARD LOGIC
   ========================================================= */
const btnNo = $("#btnNo");
const btnYes = $("#btnYes");
const cardQuestion = $("#cardQuestion");
const glassCard = document.querySelector(".glass-card");

const noMessages = [
  "🥺 طب فكري تاني",
  "💔 أنا زعلان",
  "😢 بلاش كده",
  "🥹 آخر فرصة",
  "😭 والله آسف",
  "💔 قلبي بيتكسر",
  "🥺 أنا ندمان",
  "❤️ اديني فرصة"
];
let noClicks = 0;

function floatMessage(text, x, y){
  const m = document.createElement("div");
  m.className = "floaty-msg";
  m.textContent = text;
  m.style.left = x + "px";
  m.style.top = y + "px";
  document.body.appendChild(m);
  setTimeout(() => m.remove(), 1700);
}
function spawnTear(x,y){
  const t = document.createElement("div");
  t.className = "tear-emoji";
  t.textContent = "😢";
  t.style.left = (x + rand(-30,30)) + "px";
  t.style.top = y + "px";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1500);
}
function spawnBrokenHeart(x,y){
  const b = document.createElement("div");
  b.className = "broken-heart";
  b.textContent = "💔";
  b.style.left = (x + rand(-40,40)) + "px";
  b.style.top = (y + rand(-10,20)) + "px";
  document.body.appendChild(b);
  setTimeout(() => b.remove(), 1500);
}
function popSound(){
  try{
    const ctx = popSound.ctx || (popSound.ctx = new (window.AudioContext||window.webkitAudioContext)());
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(500, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(180, ctx.currentTime+.12);
    g.gain.setValueAtTime(.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+.15);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime+.15);
  }catch(e){ /* audio not available */ }
}

function moveNoRandomly(){
  const w = btnNo.offsetWidth, h = btnNo.offsetHeight;
  const maxX = innerWidth - w - 20, maxY = innerHeight - h - 20;
  btnNo.classList.add("fleeing");
  btnNo.style.left = rand(20, Math.max(20,maxX)) + "px";
  btnNo.style.top = rand(80, Math.max(80,maxY)) + "px";
}

btnNo.addEventListener("click", (e) => {
  noClicks++;
  const rect = btnNo.getBoundingClientRect();
  const x = rect.left + rect.width/2, y = rect.top;

  floatMessage(noMessages[(noClicks-1) % noMessages.length], x, y);
  spawnTear(x, y+20);
  spawnBrokenHeart(x, y+10);
  popSound();

  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 400);

  // shrink NO, grow YES gradually
  const noScale = Math.max(0.35, 1 - noClicks*0.08);
  const yesScale = Math.min(1.9, 1 + noClicks*0.11);
  btnNo.style.transform = `scale(${noScale})`;
  btnYes.style.transform = `scale(${yesScale})`;

  if (noClicks >= 5){
    moveNoRandomly();
  }

  if (noClicks >= 8){
    btnYes.classList.add("mega");
    btnNo.style.opacity = "0.55";
  }
});

// keep NO fleeing from cursor once it started roaming
window.addEventListener("mousemove", (e) => {
  if (noClicks < 5 || !btnNo.classList.contains("fleeing")) return;
  const rect = btnNo.getBoundingClientRect();
  const dx = e.clientX - (rect.left+rect.width/2);
  const dy = e.clientY - (rect.top+rect.height/2);
  const dist = Math.hypot(dx,dy);
  if (dist < 130) moveNoRandomly();
});

/* =========================================================
   BURST CANVAS (rose petals, hearts, confetti, sparkles)
   ========================================================= */
const burstCanvas = $("#burstCanvas");
const burstCtx = burstCanvas.getContext("2d");
resizeCanvas(burstCanvas);
window.addEventListener("resize", () => resizeCanvas(burstCanvas));

let burstParticles = [];
const burstEmoji = ["🌹","💖","✨","🎉","💛","🦋","💫","🌸"];
function createBurst(count=180){
  for (let i=0;i<count;i++){
    burstParticles.push({
      x: burstCanvas.width/2, y: burstCanvas.height/2,
      vx: rand(-9,9), vy: rand(-13,-2),
      g: rand(.15,.32),
      rot: rand(0,360), vr: rand(-6,6),
      size: rand(16,30),
      emoji: burstEmoji[Math.floor(Math.random()*burstEmoji.length)],
      life: 0, maxLife: rand(90,160)
    });
  }
}
function loopBurst(){
  burstCtx.clearRect(0,0,burstCanvas.width, burstCanvas.height);
  burstParticles.forEach(p => {
    p.vy += p.g*0.06;
    p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
    const alpha = Math.max(0, 1 - p.life/p.maxLife);
    burstCtx.save();
    burstCtx.globalAlpha = alpha;
    burstCtx.translate(p.x,p.y);
    burstCtx.rotate(p.rot*Math.PI/180);
    burstCtx.font = p.size + "px sans-serif";
    burstCtx.textAlign = "center";
    burstCtx.fillText(p.emoji, 0, 0);
    burstCtx.restore();
  });
  burstParticles = burstParticles.filter(p => p.life < p.maxLife);
  requestAnimationFrame(loopBurst);
}
loopBurst();

/* =========================================================
   YES BUTTON — CINEMATIC SEQUENCE
   ========================================================= */
btnYes.addEventListener("click", async () => {
  btnYes.disabled = true; btnNo.disabled = true;

  const flash = $("#flashWhite");
  burstCanvas.classList.add("show");
  createBurst(220);
  setTimeout(() => createBurst(140), 250);
  setTimeout(() => createBurst(100), 550);

  flash.classList.add("go");
  await new Promise(r => setTimeout(r, 1000));

  showScene("#scene-door");
  await new Promise(r => setTimeout(r, 900));

  const doorLeft = $("#doorLeft"), doorRight = $("#doorRight"), doorLight = $("#doorLight");
  doorLeft.classList.add("open");
  doorRight.classList.add("open");
  await new Promise(r => setTimeout(r, 700));
  doorLight.classList.add("on");
  await new Promise(r => setTimeout(r, 2200));

  showScene("#scene-world");
  await new Promise(r => setTimeout(r, 300));
  burstCanvas.classList.remove("show");
  runWorldDialogue();
});

/* =========================================================
   SCENE 3 — WORLD DIALOGUE (typewriter)
   ========================================================= */
const dialogueBox = $("#dialogueBox");
const dialogueText = $("#dialogueText");
const btnHug = $("#btnHug");
const character = $("#character");
const eyeL = $("#eyeL"), eyeR = $("#eyeR");

const lines = [
  "أهلاً بيكي يا ريما سلطان ❤️",
  "أنا آسف.",
  "يمكن غلطت.",
  "بس عمري ما كنت أقصد أزعلك.",
  "وجودك بالنسبالي نعمة.",
  "وأوعدك...",
  "عمري ما أزعلك تاني.",
  "وهفضل أحاول أخليكي تضحكي كل يوم.",
  "لأنك أغلى إنسانة عندي.",
  "بحبك جداً ❤️"
];

async function typeInBox(text, speed=48){
  dialogueText.textContent = "";
  let i = 0;
  return new Promise((resolve) => {
    const t = setInterval(() => {
      dialogueText.textContent += text[i]; i++;
      if (i >= text.length){ clearInterval(t); resolve(); }
    }, speed);
  });
}

async function runWorldDialogue(){
  await new Promise(r => setTimeout(r, 2600)); // wait for walk-in
  dialogueBox.classList.add("show");
  for (const line of lines){
    await typeInBox(line);
    await new Promise(r => setTimeout(r, 1100));
  }
  btnHug.classList.add("show");
}

// character eyes follow cursor subtly
window.addEventListener("mousemove", (e) => {
  const rect = character.getBoundingClientRect();
  const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
  const dx = Math.max(-3, Math.min(3, (e.clientX-cx)/120));
  const dy = Math.max(-2, Math.min(2, (e.clientY-cy)/160));
  eyeL.style.transform = `translate(${dx}px, ${dy}px)`;
  eyeR.style.transform = `translate(${dx}px, ${dy}px)`;
});

/* =========================================================
   HUG BUTTON -> ENDING
   ========================================================= */
btnHug.addEventListener("click", async () => {
  btnHug.disabled = true;
  character.classList.add("hugging");
  burstCanvas.classList.add("show");
  createBurst(160);

  const heartRain = setInterval(() => {
    if (Math.random() < .8) createFloatingHeart();
  }, 90);

  dialogueBox.classList.add("show");
  await typeInBox("شكراً إنك سامحتيني ❤️", 55);

  await new Promise(r => setTimeout(r, 2600));
  clearInterval(heartRain);

  showScene("#scene-end");
});

function createFloatingHeart(){
  const h = document.createElement("div");
  h.textContent = "❤️";
  h.style.cssText = `position:fixed; left:${rand(0,100)}vw; bottom:-40px; font-size:${rand(16,30)}px;
    z-index:400; pointer-events:none; animation: heartRise ${rand(4,7)}s linear forwards;`;
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 7200);
}
const styleTag = document.createElement("style");
styleTag.textContent = `@keyframes heartRise{ to{ transform: translateY(-110vh) rotate(20deg); opacity:0; } }`;
document.head.appendChild(styleTag);

})();
