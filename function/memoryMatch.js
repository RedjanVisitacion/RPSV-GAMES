const board = document.getElementById('gameBoard');
const symbols = ['🍎', '🍌', '🍇', '🍉', '🍒', '🍍', '🥝', '🍑', '🍈', '🥥', '🍋', '🍓'];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let attempts = 7;
const MAX_ATTEMPTS = 7;
let level = 1;

const scoreEl = document.getElementById('score');
const attemptsEl = document.getElementById('attempts');
const highScoreEl = document.getElementById('highScore');
const levelEl = document.getElementById('level');

let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
highScoreEl.textContent = `High Score: ${highScore}`;

function startGame() {
  board.innerHTML = '';
  score = 0;
  attempts = MAX_ATTEMPTS;
  lockBoard = false;
  firstCard = null;
  secondCard = null;

  const pairs = level + 1;
  const deck = [...symbols.slice(0, pairs), ...symbols.slice(0, pairs)].sort(() => 0.5 - Math.random());

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

  // Update displays
  scoreEl.textContent = score;
  attemptsEl.textContent = attempts;
  if (levelEl) levelEl.textContent = `Level: ${level}`;
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains('matched')) return;
  if (attempts <= 0) return;

  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  const match1 = firstCard.querySelector('.card-back').textContent;
  const match2 = secondCard.querySelector('.card-back').textContent;

  if (match1 === match2) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    score++;
    scoreEl.textContent = score;
    resetTurn();

    const totalPairs = level + 1;
    if (score === totalPairs) {
      setTimeout(() => {
        alert(`🎉 You completed Level ${level}!`);
        level++;
        checkHighScore();
        startGame();
      }, 600);
    }
  } else {
    attempts--;
    attemptsEl.textContent = attempts;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetTurn();
    }, 1000);
  }

  if (attempts <= 0 && score < (level + 1)) {
    setTimeout(() => {
      alert('💀 Game Over! Try again.');
      checkHighScore();
      level = 1;
      startGame();
    }, 700);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function checkHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    highScoreEl.textContent = `High Score: ${highScore}`;
  }
}

startGame();
