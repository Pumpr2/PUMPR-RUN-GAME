const player = document.getElementById("player");
const game = document.getElementById("game");
const scoreEl = document.getElementById("score-value");
const finalScore = document.getElementById("final-score");
const gameOverBox = document.getElementById("game-over");

let isJumping = false;
let score = 0;
let running = true;

const scoreInterval = setInterval(() => {
  if (running) {
    score++;
    sessionStorage.setItem("score", score);
    scoreEl.textContent = score;
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

    if (
      obsRect.left < playerRect.right &&
      obsRect.right > playerRect.left &&
      obsRect.bottom > playerRect.top
    ) {
      clearInterval(scoreInterval);
      running = false;
      finalScore.textContent = score;
      gameOverBox.style.display = "block";
    }

    if (obsRect.right < 0) {
      clearInterval(moveInterval);
      obstacle.remove();
    }
  }, 20);
}

setInterval(createObstacle, 2000);
