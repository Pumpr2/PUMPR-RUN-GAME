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
let obstacleSpeed = 3;

const playerName = prompt("Zadej své jméno:")?.trim() || "Hráč";
let scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || {};
let bestScore = scoreboard[playerName] || 0;
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

      scoreboard[playerName] = bestScore;
      localStorage.setItem("scoreboard", JSON.stringify(scoreboard));
    }
  }
}, 100);

function triggerJump(force = false) {
  if ((!isJumping && running) || force) {
    isJumping = true;
    player.classList.add("jump");
    setTimeout(() => {
      if (running) {
        player.classList.remove("jump");
        isJumping = false;
      }
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

  if (obstacleSpeed > 1.5) {
    obstacleSpeed -= 0.05;
  }

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.animation = `move ${obstacleSpeed}s linear forwards`;
  game.appendChild(obstacle);

  const moveInterval = setInterval(() => {
    if (!running) {
      clearInterval(moveInterval);
      return;
    }

    const playerRect = player.getBoundingClientRect();
    const obsRect = obstacle.getBoundingClientRect();

    const buffer = 10;
    const horizontalOverlap = playerRect.right > obsRect.left && playerRect.left < obsRect.right;
    const verticalOverlap = playerRect.bottom > obsRect.top + buffer;
    const overlap = horizontalOverlap && verticalOverlap;

    if (overlap) {
      clearInterval(scoreInterval);
      clearInterval(moveInterval);
      clearInterval(obstacleInterval);
      running = false;

      triggerJump(true);

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

const obstacleInterval = setInterval(() => {
  if (running) {
    createObstacle();
  }
}, 1500);
