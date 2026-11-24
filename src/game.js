const W=960,H=576,T=48;
const walls=[{x:0,y:0,w:960,h:48},{x:0,y:528,w:960,h:48},{x:0,y:0,w:48,h:576},{x:912,y:0,w:48,h:576},{x:144,y:96,w:192,h:48},{x:624,y:96,w:192,h:48},{x:144,y:384,w:144,h:48},{x:672,y:384,w:144,h:48},{x:432,y:192,w:96,h:48}];
const items=[{id:"wrench",x:215,y:330,type:"wrench"},{id:"b1",x:360,y:120,type:"barrel"},{id:"b2",x:745,y:330,type:"barrel"},{id:"b3",x:540,y:455,type:"barrel"}];
const npc={x:780,y:190}; const pump={x:120,y:205,w:96,h:96};
let canvas,ctx,keys={},state,last=0,toastTimer=0;
const fresh=()=>({x:470,y:330,hp:100,barrels:0,wrench:false,talked:false,pump:false,collected:[],quest:"Porozmawiaj z Brentem"});
function load(){try{return {...fresh(),...JSON.parse(localStorage.getItem("crudland-save")||"{}")}}catch{return fresh()}}
function save(){localStorage.setItem("crudland-save",JSON.stringify(state));updateUI()}
function updateUI(){document.querySelector("#hp").textContent=`♥ ${state.hp}/100`;document.querySelector("#barrels").textContent=state.barrels;document.querySelector("#wrench").textContent=state.wrench?"KLUCZ 36":"BRAK KLUCZA";document.querySelector("#quest").textContent=state.quest}
function say(text,ms=4300){const t=document.querySelector("#toast");t.textContent=text;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),ms)}
function rectHit(x,y,w,h,r){return x<r.x+r.w&&x+w>r.x&&y<r.y+r.h&&y+h>r.y}
function blocked(x,y){const r={x,y,w:28,h:30};return walls.some(a=>rectHit(x,y,28,30,a))||rectHit(x,y,28,30,pump)}
function near(x,y,tx,ty,d=70){return Math.hypot(x-tx,y-ty)<d}
function interact(){
 if(near(state.x,state.y,npc.x,npc.y,76)){state.talked=true;state.quest=state.wrench?"Zbierz 3 baryłki":"Znajdź Klucz 36";say("BRENT: Operatorze, pompa 17 umarła. Znajdź Klucz 36 i trzy baryłki.\nDobra wiadomość: rynek wzrósł o 0,03. Prawdopodobnie.");save();return}
 const available=items.find(i=>!state.collected.includes(i.id)&&near(state.x,state.y,i.x,i.y,58));
 if(available){state.collected.push(available.id);if(available.type==="wrench"){state.wrench=true;state.quest="Zbierz 3 baryłki";say("ZDOBYTO: KLUCZ 36. Pachnie rdzą i odpowiedzialnością.")}else{state.barrels++;state.quest=state.barrels<3?`Zbierz baryłki: ${state.barrels}/3`:"Uruchom pompę";say(`ZEBRANO BARYŁKĘ: ${state.barrels}/3`)}save();return}
 if(near(state.x,state.y,pump.x+48,pump.y+48,115)){if(!state.talked)say("Pompa milczy. Najpierw porozmawiaj z krukiem.");else if(!state.wrench)say("POTRZEBNY: Klucz 36.");else if(state.barrels<3)say(`ZA MAŁO PALIWA: ${state.barrels}/3 baryłki.`);else if(!state.pump){state.pump=true;state.quest="Platforma 17 uruchomiona!";say("POMPA 17: ONLINE.\nProdukcja: 120 BBL/D. Coś zastukało wewnątrz baryłki...",6000);save()}else say("Pompa pracuje. Zdecydowanie zbyt głośno.");return}
 say("Tu nie ma z czym wejść w interakcję.",1800)
}
function drawTile(x,y,c1,c2){ctx.fillStyle=c1;ctx.fillRect(x,y,T,T);ctx.strokeStyle=c2;ctx.strokeRect(x+.5,y+.5,T-1,T-1);ctx.fillStyle="#ffffff08";ctx.fillRect(x+5,y+5,4,4)}
function draw(){
 ctx.fillStyle="#06151a";ctx.fillRect(0,0,W,H);
 for(let y=0;y<H;y+=T)for(let x=0;x<W;x+=T){const edge=x<T||x>=W-T||y<T||y>=H-T;if(edge){ctx.fillStyle=(x+y+Date.now()/350|0)%2?"#081e26":"#0c2730";ctx.fillRect(x,y,T,T);ctx.fillStyle="#2d626b55";ctx.fillRect(x+8,y+12,30,3)}else drawTile(x,y,"#263337","#3c4b4d")}
 ctx.fillStyle="#6b451f";walls.slice(1).forEach(w=>{ctx.fillRect(w.x,w.y,w.w,w.h);ctx.fillStyle="#b7782c";ctx.fillRect(w.x,w.y,w.w,5);ctx.fillStyle="#6b451f"});
 // hazard stripes
 ctx.fillStyle="#d6a52c";for(let x=80;x<880;x+=48)ctx.fillRect(x,510,24,7);
 // pump
 ctx.fillStyle=state.pump?"#357f57":"#713f35";ctx.fillRect(pump.x,pump.y,pump.w,pump.h);ctx.fillStyle="#101719";ctx.fillRect(pump.x+18,pump.y+20,60,55);ctx.fillStyle=state.pump?"#75ff99":"#ff5b43";ctx.beginPath();ctx.arc(pump.x+48,pump.y+48,12,0,Math.PI*2);ctx.fill();ctx.fillStyle="#d6a52c";ctx.fillText("POMPA 17",pump.x+12,pump.y+92);
 // items
 items.filter(i=>!state.collected.includes(i.id)).forEach(i=>{if(i.type==="barrel"){ctx.fillStyle="#c48924";ctx.fillRect(i.x-15,i.y-21,30,42);ctx.fillStyle="#2a2317";ctx.fillRect(i.x-15,i.y-12,30,4);ctx.fillRect(i.x-15,i.y+10,30,4);ctx.fillStyle="#f3d16e";ctx.fillText("OIL",i.x-10,i.y+4)}else{ctx.strokeStyle="#d6d3bc";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(i.x-17,i.y+18);ctx.lineTo(i.x+17,i.y-18);ctx.stroke();ctx.lineWidth=1}});
 // Brent
 ctx.fillStyle="#111619";ctx.beginPath();ctx.arc(npc.x,npc.y,19,0,Math.PI*2);ctx.fill();ctx.fillStyle="#d9b737";ctx.fillRect(npc.x+13,npc.y-4,17,6);ctx.fillStyle="#f1d45d";ctx.fillRect(npc.x+3,npc.y-9,4,4);ctx.fillStyle="#8ca6a0";ctx.fillText("BRENT",npc.x-23,npc.y+38);
 // player shadow and body
 ctx.fillStyle="#0008";ctx.beginPath();ctx.ellipse(state.x+14,state.y+29,18,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#d2a83c";ctx.fillRect(state.x+5,state.y+7,18,21);ctx.fillStyle="#879b9b";ctx.fillRect(state.x+4,state.y,20,11);ctx.fillStyle="#172126";ctx.fillRect(state.x+7,state.y+4,14,4);ctx.fillStyle="#e4c15c";ctx.fillText("42",state.x+7,state.y+23);
 if(state.pump){ctx.fillStyle="#f1b22c";ctx.fillRect(68,62,7,26);ctx.fillStyle="#ff7433aa";ctx.beginPath();ctx.moveTo(71,62);ctx.quadraticCurveTo(53,45,71,26);ctx.quadraticCurveTo(88,44,71,62);ctx.fill()}
}
function update(dt){let dx=0,dy=0;if(keys.ArrowLeft||keys.KeyA)dx--;if(keys.ArrowRight||keys.KeyD)dx++;if(keys.ArrowUp||keys.KeyW)dy--;if(keys.ArrowDown||keys.KeyS)dy++;if(dx&&dy){dx*=.707;dy*=.707}const speed=150;const nx=state.x+dx*speed*dt,ny=state.y+dy*speed*dt;if(!blocked(nx,state.y))state.x=nx;if(!blocked(state.x,ny))state.y=ny}
function loop(t){const dt=Math.min((t-last)/1000,.033);last=t;update(dt);draw();requestAnimationFrame(loop)}
export function startGame(){canvas=document.querySelector("#game");ctx=canvas.getContext("2d");ctx.imageSmoothingEnabled=false;ctx.font="12px monospace";state=load();updateUI();say("SYSTEM: Podejdź do Brenta i naciśnij E.");addEventListener("keydown",e=>{keys[e.code]=true;if(e.code==="KeyE")interact()});addEventListener("keyup",e=>keys[e.code]=false);document.querySelectorAll("[data-key]").forEach(b=>{const k=b.dataset.key;b.addEventListener("pointerdown",e=>{e.preventDefault();keys[k]=true;if(k==="KeyE")interact()});["pointerup","pointercancel","pointerleave"].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false))});document.querySelector("#reset").onclick=()=>{if(confirm("Usunąć zapis i zacząć od nowa?")){localStorage.removeItem("crudland-save");state=fresh();save();say("NOWA GRA: Platforma 17")}};setInterval(()=>{if(Math.random()<.5){const p=(66+Math.random()*3).toFixed(2);document.querySelector("#price").textContent=`${p} PC ${p>67.42?"↗":"↘"}`}},3500);requestAnimationFrame(loop)}