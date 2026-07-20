/*=========================================================
    SORRY RIMA V2
    SCRIPT
    PART 1
=========================================================*/

/*=============================
        Elements
=============================*/

const intro = document.getElementById("intro");
const main = document.getElementById("main");
const world = document.getElementById("world");
const ending = document.getElementById("ending");
const doorScene = document.getElementById("doorScene");

const startBtn = document.getElementById("startBtn");
const musicBtn = document.getElementById("musicBtn");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hugBtn = document.getElementById("hugBtn");

const introText = document.getElementById("introText");
const dialogue = document.getElementById("dialogue");

const music = document.getElementById("music");

/*=============================
        Variables
=============================*/

let musicStarted = false;

let noClicks = 0;

let yesScale = 1;

let noScale = 1;

/*=============================
        Messages
=============================*/

const noMessages = [

"طيب فكري تاني 🥺",

"متزعليش مني ❤️",

"أنا آسف جدًا 😔",

"اديني فرصة أخيرة 🤍",

"مش هزعلك تاني 🌹",

"بحبك والله ❤️"

];

/*=============================
        Helpers
=============================*/

function sleep(ms){

return new Promise(resolve=>{

setTimeout(resolve,ms);

});

}

function showScene(scene){

document
.querySelectorAll(".scene")
.forEach(s=>{

s.classList.remove("active");

});

scene.classList.add("active");

}

/*=============================
    Type Writer
=============================*/

async function typeWriter(

element,

text,

speed=35

){

element.textContent="";

for(const char of text){

element.textContent+=char;

await sleep(speed);

}

}

/*=============================
    Intro
=============================*/

async function playIntro(){

await typeWriter(

introText,

`أهلاً بيكي يا ريما سلطان ❤️

الصفحة دي اتعملت مخصوص علشانك...

وأتمنى تسمحيلي أقولك قد إيه أنا آسف...`,

38

);

}

/*=============================
    Music
=============================*/

async function startMusic(){

if(musicStarted) return;

musicStarted=true;

music.volume=.45;

try{

await music.play();

musicBtn.textContent="🔊";

}

catch(e){

console.log(e);

}

}

document.addEventListener(

"click",

()=>{

startMusic();

},

{

once:true

}

);

musicBtn.onclick=()=>{

if(music.paused){

music.play();

musicBtn.textContent="🔊";

}else{

music.pause();

musicBtn.textContent="🔇";

}

};

/*=============================
        Start
=============================*/

startBtn.onclick=()=>{

showScene(main);

};

playIntro();
/*=========================================================
    PART 2
    QUESTION + BUTTON LOGIC
=========================================================*/

/*=============================
        Effects
=============================*/

function randomMessage(){

return noMessages[
Math.floor(
Math.random()*noMessages.length
)
];

}

function createHeart(x,y){

const heart=document.createElement("div");

heart.className="heart";

heart.textContent=
Math.random()>.5 ? "❤️":"💖";

heart.style.left=x+"px";

heart.style.top=y+"px";

document.body.appendChild(heart);

setTimeout(()=>{

heart.remove();

},2400);

}

function createSpark(x,y){

const spark=document.createElement("div");

spark.className="spark";

spark.style.left=x+"px";

spark.style.top=y+"px";

document.body.appendChild(spark);

setTimeout(()=>{

spark.remove();

},1200);

}

function burst(x,y,count=14){

for(let i=0;i<count;i++){

setTimeout(()=>{

createHeart(

x+(Math.random()*80-40),

y+(Math.random()*80-40)

);

createSpark(

x+(Math.random()*80-40),

y+(Math.random()*80-40)

);

},i*35);

}

}

/*=============================
        No Button
=============================*/

noBtn.onclick=()=>{

noClicks++;

yesScale+=0.15;

noScale-=0.10;

if(noScale<0.25){

noScale=.25;

}

yesBtn.style.transform=

`scale(${yesScale})`;

noBtn.style.transform=

`scale(${noScale})`;

dialogue.textContent=

randomMessage();

const r=noBtn.getBoundingClientRect();

burst(

r.left+r.width/2,

r.top+r.height/2,

10

);

/* بعد عدد معين يختفي زر لا */

if(noClicks>=8){

noBtn.style.opacity="0";

noBtn.style.pointerEvents="none";

dialogue.textContent=

"معندكيش مهرب بقى 😂❤️";

}

};

/*=============================
        Yes Button
=============================*/

yesBtn.onclick=()=>{

const r=yesBtn.getBoundingClientRect();

burst(

r.left+r.width/2,

r.top+r.height/2,

26

);

dialogue.textContent=

"شكراً يا أجمل ريما ❤️";

setTimeout(()=>{

showScene(doorScene);

},1800);

};

/*=============================
        Door
=============================*/

doorScene.onclick=()=>{

showScene(world);

startWorld();

};
/*=========================================================
    PART 3
    WORLD + WALK + DIALOGUE
=========================================================*/

/*=============================
        Dialogue
=============================*/

const story=[

"ريما... ❤️",

"أنا كنت بفكر كتير قبل ما أعمل الصفحة دي.",

"لأنك تستحقي اعتذار حقيقي.",

"يمكن غلطت... ويمكن زعلتك.",

"بس عمري ما كان قصدي أشوفك حزينة.",

"كل اللي نفسي فيه إن ابتسامتك ترجع.",

"ولو سامحتيني... هعتبرها أجمل هدية في حياتي. 🌹"

];

/*=============================
        Character
=============================*/

const character=document.getElementById("character");

let walkPosition=-120;

async function walkCharacter(){

character.style.transition="none";

character.style.left="-120px";

await sleep(150);

character.style.transition="left 10s linear";

character.style.left="50%";

await sleep(10000);

}

/*=============================
        Roses
=============================*/

let roseInterval;

function createRose(){

const rose=document.createElement("div");

rose.className="rose";

rose.textContent=Math.random()>.5?"🌹":"🌸";

rose.style.left=Math.random()*100+"vw";

rose.style.fontSize=

20+Math.random()*18+"px";

document.body.appendChild(rose);

setTimeout(()=>{

rose.remove();

},5000);

}

function startRoses(){

roseInterval=setInterval(()=>{

createRose();

},550);

}

function stopRoses(){

clearInterval(roseInterval);

}

/*=============================
        Story
=============================*/

async function playStory(){

for(const line of story){

await typeWriter(

dialogue,

line,

42

);

await sleep(1600);

}

hugBtn.style.display="inline-flex";

hugBtn.classList.add("scaleIn");

}

/*=============================
        World
=============================*/

async function startWorld(){

hugBtn.style.display="none";

dialogue.textContent="";

startRoses();

await walkCharacter();

await playStory();

}

/*=============================
        Hug
=============================*/

hugBtn.onclick=()=>{

stopRoses();

burst(

window.innerWidth/2,

window.innerHeight/2,

40

);

showScene(ending);

};
/*=========================================================
    PART 4
    ENDING + PARTICLES + RESTART
=========================================================*/

/*=============================
        Ending
=============================*/

function showEnding(){

showScene(ending);

ending.innerHTML=`

<div class="glass scaleIn">

<h1>🤍</h1>

<h2>

شكراً يا ريما...

</h2>

<p style="margin-top:20px">

سواء سامحتيني أو لأ...

هفضل أتمنالك كل خير وسعادة.

<br><br>

وأتمنى يكون المكان الصغير ده

رسم ابتسامة على وشك ❤️🌹

</p>

<button id="restartBtn">

إعادة من البداية 🔄

</button>

</div>

`;

const restart=document.getElementById("restartBtn");

restart.onclick=()=>{

location.reload();

};

finalBurst();

}

/*=============================
        Hug
=============================*/

hugBtn.onclick=()=>{

stopRoses();

burst(

window.innerWidth/2,

window.innerHeight/2,

45

);

setTimeout(()=>{

showEnding();

},1200);

};

/*=============================
        Final Burst
=============================*/

function finalBurst(){

let total=0;

const timer=setInterval(()=>{

const x=Math.random()*window.innerWidth;

const y=Math.random()*window.innerHeight;

createHeart(x,y);

createSpark(x,y);

if(Math.random()>.5){

createRose();

}

total++;

if(total>160){

clearInterval(timer);

}

},80);

}

/*=============================
        Floating Background
=============================*/

const bgCanvas=document.getElementById("bgCanvas");

const bgCtx=bgCanvas.getContext("2d");

let particles=[];

function resizeCanvas(){

bgCanvas.width=window.innerWidth;

bgCanvas.height=window.innerHeight;

}

window.addEventListener(

"resize",

resizeCanvas

);

resizeCanvas();

for(let i=0;i<40;i++){

particles.push({

x:Math.random()*bgCanvas.width,

y:Math.random()*bgCanvas.height,

r:1+Math.random()*2,

dx:(Math.random()-.5)*0.3,

dy:(Math.random()-.5)*0.3,

a:.2+Math.random()*.5

});

}

function animateBackground(){

bgCtx.clearRect(

0,

0,

bgCanvas.width,

bgCanvas.height

);

for(const p of particles){

p.x+=p.dx;

p.y+=p.dy;

if(p.x<0)p.x=bgCanvas.width;

if(p.x>bgCanvas.width)p.x=0;

if(p.y<0)p.y=bgCanvas.height;

if(p.y>bgCanvas.height)p.y=0;

bgCtx.beginPath();

bgCtx.arc(

p.x,

p.y,

p.r,

0,

Math.PI*2

);

bgCtx.fillStyle=

`rgba(255,255,255,${p.a})`;

bgCtx.fill();

}

requestAnimationFrame(

animateBackground

);

}

animateBackground();

/*=============================
        Keyboard
=============================*/

document.addEventListener(

"keydown",

e=>{

if(e.key==="Enter"){

if(

ending.classList.contains("active")

){

location.reload();

}

}

});

/*=============================
        Finished
=============================*/

console.log(

"%cMade with ❤️ for Rima",

"font-size:18px;color:#ff4f98;font-weight:bold;"

);