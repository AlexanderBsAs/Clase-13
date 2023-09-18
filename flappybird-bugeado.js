const readline = require('readline');

// Configuración del juego
const gameWidth = 40;
const gameHeight = 20;
const birdSymbol = '🐦';
const pipeSymbol = '█';
const airSymbol = ' ';
const gravity = 1;
const jumpStrength = 2;
const pipeGap = 8;
const pipeSpawnInterval = 8;

let birdPosition = Math.floor(gameHeight / 2);
let birdVelocity = 0;
let pipes = [];
let score = 0;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para dibujar el juego en la terminal
function drawGame() {
  const gameScreen = [];

  // Dibuja el bird
  for (let i = 0; i < gameHeight; i++) {
    gameScreen[i] = Array(gameWidth).fill(airSymbol);
  }
  gameScreen[birdPosition][4] = birdSymbol;

  // Dibuja las tuberías
  for (const pipe of pipes) {
    for (let i = 0; i < gameHeight; i++) {
      if (i < pipe.top || i >= pipe.top + pipeGap) {
        gameScreen[i][pipe.x] = pipeSymbol;
      }
    }
  }

  // Dibuja el marcador
  gameScreen[0][gameWidth - 10] = `Score: ${score}`;

  // Imprime el juego en la terminal
  for (const row of gameScreen) {
    console.log(row.join(''));
  }
}

// Función para actualizar el juego en cada iteración
function updateGame() {
  // Mueve el bird
  birdVelocity += gravity;
  birdPosition += birdVelocity;

  // Genera nuevas tuberías
  if (pipes.length === 0 || pipes[pipes.length - 1].x < gameWidth - pipeSpawnInterval) {
    const pipeTop = Math.floor(Math.random() * (gameHeight - pipeGap));
    pipes.push({ x: gameWidth, top: pipeTop });
  }

  // Mueve las tuberías
  for (const pipe of pipes) {
    pipe.x--;
  }

  // Elimina las tuberías que salieron de la pantalla
  if (pipes.length > 0 && pipes[0].x <= 0) {
    pipes.shift();
    score++;
  }

  // Comprueba colisiones
  if (birdPosition < 0 || birdPosition >= gameHeight) {
    endGame();
    return;
  }

  for (const pipe of pipes) {
    if (
      birdPosition < pipe.top || birdPosition >= pipe.top + pipeGap ||
      pipe.x < 4 || pipe.x >= 4 + birdSymbol.length
    ) {
      continue;
    }
    endGame();
    return;
  }

  drawGame();
  setTimeout(updateGame, 100);
}

// Función para finalizar el juego
function endGame() {
  console.log('\nGame Over! Your score: ' + score);
  rl.close();
}

// Inicia el juego
rl.input.on('keypress', (str, key) => {
  if (key && key.name === 'space') {
    birdVelocity = -jumpStrength;
  }
});

console.clear();
updateGame();
