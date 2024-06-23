const canvasSize = 400;
const snakeSize = 20;
let snake = [
  { x: 160, y: 200 },
  { x: 140, y: 200 },
  { x: 120, y: 200 },
];
let food = { x: 300, y: 200 };
let score = 0;
let dx = snakeSize;
let dy = 0;
let gameRunning = false;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let playerName = '';

function drawGrid() {
  ctx.strokeStyle = "#e0e0e0";
  for (let x = 0; x <= canvasSize; x += snakeSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasSize);
  }
  for (let y = 0; y <= canvasSize; y += snakeSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvasSize, y);
  }
  ctx.stroke();
}

function drawWalls() {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, canvasSize, canvasSize);
}

function drawSnakePart(snakePart) {
  ctx.fillStyle = "lightgreen";
  ctx.strokestyle = "darkgreen";
  ctx.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
  ctx.strokeRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
}

function update() {
  if (!gameRunning) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (snake[0].x === food.x && snake[0].y === food.y) {
    score += 10;
    food.x = Math.floor(Math.random() * (canvasSize / snakeSize)) * snakeSize;
    food.y = Math.floor(Math.random() * (canvasSize / snakeSize)) * snakeSize;
  } else {
    snake.pop();
  }
}

function checkCollision() {
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x >= canvasSize;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y >= canvasSize;

  if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
    document.getElementById("gameOverMessage").style.display = "block";
    document.getElementById("restartButton").style.display = "block";
    gameRunning = false;
    onGameOver(playerName, score);
  }
}

function gameLoop() {
  setTimeout(function onTick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawWalls();
    drawFood();
    update();
    drawSnake();
    checkCollision();
    if (gameRunning) {
      gameLoop();
    }
  }, 100);
}

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUp = dy === -snakeSize;
  const goingDown = dy === snakeSize;
  const goingRight = dx === snakeSize;
  const goingLeft = dx === -snakeSize;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -snakeSize;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -snakeSize;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = snakeSize;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = snakeSize;
  }
}

document.addEventListener("keydown", changeDirection);

if (!localStorage.getItem("leaderboard")) {
  localStorage.setItem("leaderboard", JSON.stringify([]));
}
let leaderboard = JSON.parse(localStorage.getItem("leaderboard"));

function updateLeaderboard(playerName, score) {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
  let playerIndex = leaderboard.findIndex(entry => entry.name === playerName);

  if (playerIndex !== -1) {
    if (score > leaderboard[playerIndex].score) {
      leaderboard[playerIndex].score = score;
    }
  } else {
    leaderboard.push({ name: playerName, score: score, timestamp: Date.now() });
  }

  leaderboard.sort((a, b) => {
    if (b.score === a.score) {
      return a.timestamp - b.timestamp;
    }
    return b.score - a.score;
  });

  if (leaderboard.length > 10) {
    leaderboard.pop();
  }

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function displayLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    let leaderboardBody = document.getElementById("leaderboardBody");
    leaderboardBody.innerHTML = ""; 
  
    leaderboard.slice(0, 10).forEach((entry, index) => {
      let row = document.createElement("tr");
      let serialCell = document.createElement("td");
      let nameCell = document.createElement("td");
      let scoreCell = document.createElement("td");
  
      serialCell.textContent = index + 1; 
      nameCell.textContent = entry.name;
      scoreCell.textContent = entry.score;
  
      row.appendChild(serialCell);
      row.appendChild(nameCell);
      row.appendChild(scoreCell);
      leaderboardBody.appendChild(row);
    });
  }
  

function onGameOver(playerName, score) {
  updateLeaderboard(playerName, score);
  displayLeaderboard();
  document.getElementById("gameOverMessage").style.display = "block";
  document.getElementById("restartButton").style.display = "block";
}

function showModal() {
  document.getElementById("nameModal").style.display = "flex";
  document.getElementById("gameOverMessage").style.display = "none";
  document.getElementById("restartButton").style.display = "none";
}

function startGame() {
  const playerNameInput = document.getElementById("playerName");
  if (playerNameInput.value.trim() !== "") {
    playerName = playerNameInput.value;
    document.getElementById("nameModal").style.display = "none";
    gameRunning = true;
    snake = [
      { x: 160, y: 200 },
      { x: 140, y: 200 },
      { x: 120, y: 200 },
    ];  
    dx = snakeSize;
    dy = 0;
    score = 0;
    gameLoop();
  } else {
    alert("Please enter your name");
  }
}

window.onload = function() {
  document.getElementById("nameModal").style.display = "flex";
  displayLeaderboard();
};
