let player = document.getElementById("player");
let scoreValue = document.getElementById("score-value");
let bestScoreDisplay = document.getElementById("best-score");
let finalScore = document.getElementById("final-score");
let bestScoreGameOver = document.getElementById("best-score-game-over");
let gameOverScreen = document.getElementById("game-over");
let scoreboardBody = document.getElementById("scoreboard-body");
let playerNameDisplay = document.getElementById("player-name-display");
let activePlayersDisplay = document.getElementById("active-players");

let isJumping = false;
let score = 0;
let bestScore = 0;
let gameRunning = true;
let playerName;

// --- Aktivní hráči (uložené v localStorage) ---
let activePlayers = JSON.parse(localStorage.getItem("activePlayers")) || [];

// Získání nebo zadání jména hráče
function getPlayerName() {
  let name = localStorage.getItem("playerName");
  if (!name) {
    name = prompt("Zadej své jméno:");
    if (!name) name = "Hráč";
    localStorage.setItem("playerName", name);
  }
  return name;
}

// Načtení jména a přidání do aktivních hráčů
playerName = getPlayerName();
playerNameDisplay.textContent = `Jméno hráče: ${playerName}`;
if (!activePlayers.includes(playerName)) {
  activePlayers.push(playerName);
  localStorage.setItem("activePlayers", JSON.stringify(activePlayers));
}
activePlayersDisplay.textContent = `Hráčů právě hraje: ${activePlayers.length}`;

// Získání skóre hráče
let scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || {};
bestScore = scoreboard[playerName] || 0;
bestScoreDisplay.textContent = bestScore;

// Funkce skoku
function triggerJump() {
  if (isJumping || !gameRunning) return;
  isJumping = true;
  player.classList.add("jump");

  setTimeout(() => {
    player.classList.remove("jump");
    isJumping = false;
  }, 500);
}

// Přidávání překážek
function spawnObstacle() {
  if (!gameRunning) return;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.left = "100%";
  document.getElementById("game").appendChild(obstacle);

  let moveInterval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(moveInterval);
      obstacle.remove();
      return;
    }

    let obstacleLeft = parseInt(obstacle.style.left);
    if (isNaN(obstacleLeft)) obstacleLeft = 100;
    obstacleLeft -= 5;
    obstacle.style.left = obstacleLeft + "%";

    // Kolize
    let playerRect = player.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    if (
      playerRect.left < obstacleRect.right &&
      playerRect.right > obstacleRect.left &&
      playerRect.bottom > obstacleRect.top &&
      playerRect.top < obstacleRect.bottom
    ) {
      gameOver();
      clearInterval(moveInterval);
    }

    if (obstacleLeft < -10) {
      clearInterval(moveInterval);
      obstacle.remove();
    }
  }, 20);
}

// Spuštění hry
let obstacleSpawner = setInterval(spawnObstacle, 1500);
let scoreInterval = setInterval(() => {
  if (!gameRunning) return;
  score++;
  scoreValue.textContent = score;
}, 100);

// Game Over
function gameOver() {
  gameRunning = false;
  finalScore.textContent = score;
  gameOverScreen.style.display = "block";

  // Odebrat hráče ze seznamu aktivních
  activePlayers = activePlayers.filter((name) => name !== playerName);
  localStorage.setItem("activePlayers", JSON.stringify(activePlayers));
  activePlayersDisplay.textContent = `Hráčů právě hraje: ${activePlayers.length}`;

  // Skóre
  if (score > bestScore) {
    bestScore = score;
    bestScoreDisplay.textContent = bestScore;
    bestScoreGameOver.textContent = bestScore;

    scoreboard[playerName] = bestScore;
    localStorage.setItem("scoreboard", JSON.stringify(scoreboard));
  } else {
    bestScoreGameOver.textContent = bestScore;
  }

  updateScoreboard();
}

// Aktualizace tabulky skóre
function updateScoreboard() {
  scoreboardBody.innerHTML = "";
  const sorted = Object.entries(scoreboard).sort((a, b) => b[1] - a[1]);
  for (const [name, score] of sorted) {
    const row = document.createElement("tr");
    row.innerHTML = `<td${name === playerName ? ' style="font-weight: bold; color: gold;"' : ''}>${name}</td><td>${score}</td>`;
    scoreboardBody.appendChild(row);
  }
}

// Klávesa pro skok
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    triggerJump();
  }
});

// Inicializace scoreboardu
updateScoreboard();
