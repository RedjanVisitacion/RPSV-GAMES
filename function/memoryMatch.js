const board = document.getElementById('gameBoard');
const symbols = ['🍎', '🍌', '🍇', '🍉', '🍒', '🍍', '🥝', '🍑'];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let attempts = 0;
const MAX_ATTEMPTS = 15;

const scoreEl = document.getElementById('score');
const attemptsEl = document.getElementById('attempts');
const highScoreEl = document.getElementById('highScore'); // Element to display high score
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
highScoreEl.textContent = `High Score: ${highScore}`;

function startGame() {
  board.innerHTML = '';
  const deck = [...symbols, ...symbols].sort(() => 0.5 - Math.random());

  deck.forEach(symbol => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">❓</div>
        <div class="card-back">${symbol}</div>
      </div>
    `;
    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
  });

  firstCard = null;
  secondCard = null;
  lockBoard = false;
  score = 0;
  attempts = 0;
  scoreEl.textContent = score;
  attemptsEl.textContent = attempts;
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains('matched')) return;
  if (attempts >= MAX_ATTEMPTS) return; // Prevent further actions if limit reached

  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
  attempts++;
  attemptsEl.textContent = attempts;

  const match1 = firstCard.querySelector('.card-back').textContent;
  const match2 = secondCard.querySelector('.card-back').textContent;

  if (match1 === match2) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    score++;
    scoreEl.textContent = score;
    resetTurn();

    // Optional: check if all matches are found
    if (score === symbols.length) {
      setTimeout(() => {
        alert('🎉 You Win!');
        checkHighScore();
        restartGame();
      }, 500);
    }

  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetTurn();
    }, 1000);
  }

  // Game over if attempts reach the max and not all matched
  if (attempts >= MAX_ATTEMPTS && score < symbols.length) {
    setTimeout(() => {
      alert('💀 Game Over! You reached the attempt limit.');
      checkHighScore();
      restartGame();
    }, 600);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function checkHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore); // Save high score to localStorage
    highScoreEl.textContent = `High Score: ${highScore}`;
  }
}

function restartGame() {
  setTimeout(() => {
    startGame(); // Restart the game after game over or win
  }, 1000);
}

startGame();
