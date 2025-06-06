const player = document.getElementById("player");
const game = document.getElementById("game");
const scoreEl = document.getElementById("score-value");
const bestScoreEl = document.getElementById("best-score");
const finalScore = document.getElementById("final-score");
const bestScoreGameOverEl = document.getElementById("best-score-game-over");
const gameOverBox = document.getElementById("game-over");

let isJumping = false;
let score = 0;
let running = true;

let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
bestScoreEl.textContent = bestScore;
bestScoreGameOverEl.textContent = bestScore;

const scoreInterval = setInterval(() => {
  if (running) {
    score++;
    scoreEl.textContent = score;

    if (score > bestScore) {
      bestScore = score;
      bestScoreEl.textContent = bestScore;
      bestScoreGameOverEl.textContent = bestScore;
      localStorage.setItem("bestScore", bestScore);
    }
  }
}, 100);

function triggerJump() {
  if (!isJumping) {
    isJumping = true;
    player.classList.add("jump");
    setTimeout(() => {
      player.classList.remove("jump");
      isJumping = false;
    }, 500);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    triggerJump();
  }
});

document.addEventListener("touchstart", () => {
  triggerJump();
}, { passive: true });

function createObstacle() {
  if (!running) return;
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.left = "100%";
  game.appendChild(obstacle);

  const moveInterval = setInterval(() => {
    const playerRect = player.getBoundingClientRect();
    const obsRect = obstacle.getBoundingClientRect();

    // Zlepšená kolizní detekce s rezervou nahoře
    const buffer = 10; // Rezerva (např. 10 px)

    const horizontalOverlap = playerRect.right > obsRect.left && playerRect.left < obsRect.right;
    const verticalOverlap = playerRect.bottom > obsRect.top + buffer;

    const overlap = horizontalOverlap && verticalOverlap;

    if (overlap) {
      clearInterval(scoreInterval);
      running = false;
      finalScore.textContent = score;
      bestScoreGameOverEl.textContent = bestScore;
      gameOverBox.style.display = "block";
    }

    if (obsRect.right < 0) {
      clearInterval(moveInterval);
      obstacle.remove();
    }
  }, 20);
}

setInterval(createObstacle, 2000);
