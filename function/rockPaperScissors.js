let playerScore = 0;
let computerScore = 0;

function getComputerChoice() {
  const choices = ['rock', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * choices.length)];
}

function play(playerChoice) {
  const resultDiv = document.getElementById('result');
  const scoreboardDiv = document.getElementById('scoreboard');

  let dots = ['🤜', '🤛'];
  let index = 0;
  resultDiv.textContent = `${dots[0]} Matching...`;
  let interval = setInterval(() => {
    resultDiv.textContent = `${dots[index % dots.length]} Matching...`;
    index++;
  }, 300);

  setTimeout(() => {
    clearInterval(interval);
    const computerChoice = getComputerChoice();
    let result = "";

    if (playerChoice === computerChoice) {
      result = `It's a draw! You both chose ${playerChoice}.`;
    } else if (
      (playerChoice === 'rock' && computerChoice === 'scissors') ||
      (playerChoice === 'paper' && computerChoice === 'rock') ||
      (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
      playerScore++;
      result = `You win! ${playerChoice} beats ${computerChoice}.`;
    } else {
      computerScore++;
      result = `You lose! ${computerChoice} beats ${playerChoice}.`;
    }

    resultDiv.textContent = result;
    scoreboardDiv.textContent = `You: ${playerScore} | Computer: ${computerScore}`;
  }, 1500);
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  document.getElementById('result').textContent = 'Choose your move!';
  document.getElementById('scoreboard').textContent = 'You: 0 | Computer: 0';
}