import "./style.css";
import { startGame } from "./game.js";
document.querySelector("#app").innerHTML = `
<div class="shell">
  <header><div><span class="eyebrow">FIRST OIL RPG // BUILD 0.1</span><h1>CRUDLAND: OSTATNIA BARYŁKA</h1></div><button id="reset">NOWA GRA</button></header>
  <section class="hud">
    <div><small>OPERATOR 42</small><strong id="hp">♥ 100/100</strong></div>
    <div><small>EKWIPUNEK</small><strong><span id="barrels">0</span> BBL · <span id="wrench">BRAK KLUCZA</span></strong></div>
    <div><small>RYNEK BRENT</small><strong id="price">67.42 PC ↗</strong></div>
  </section>
  <main><canvas id="game" width="960" height="576"></canvas><div id="toast"></div></main>
  <section class="quest"><div><small>MISJA: CZARNY PORANEK</small><strong id="quest">Porozmawiaj z Brentem</strong></div><div id="save">AUTOMATYCZNY ZAPIS</div></section>
  <section class="controls"><div class="dpad"><button data-key="ArrowUp">▲</button><button data-key="ArrowLeft">◀</button><button data-key="ArrowDown">▼</button><button data-key="ArrowRight">▶</button></div><button class="action" data-key="KeyE">E<br><small>AKCJA</small></button></section>
  <footer>WASD / STRZAŁKI: ruch · E: interakcja · postęp zapisuje się lokalnie</footer>
</div>`;
startGame();