const paddle = document.getElementById('paddle');
    const ball = document.getElementById('ball');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('highScore');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    let ballX = 0, ballY = 0, ballSpeed = 3, score = 0;
    let isRunning = false, isPaused = false;
    let animationId;
    let highScore = localStorage.getItem('ctb_highScore') || 0;

    highScoreDisplay.textContent = 'High Score: ' + highScore;

    function movePaddle(x) {
      let paddleX = Math.min(Math.max(x - paddle.offsetWidth / 2, 0), window.innerWidth - paddle.offsetWidth);
      paddle.style.left = paddleX + 'px';
    }

    document.addEventListener('mousemove', (e) => movePaddle(e.clientX));

    // Touch support for mobile
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        movePaddle(e.touches[0].clientX);
      }
    });

    function resetBall() {
      ballX = Math.random() * (window.innerWidth - ball.offsetWidth);
      ballY = 0;
      ballSpeed += 0.2;
    }

    function updateBall() {
      if (!isRunning || isPaused) return;

      ballY += ballSpeed;
      const paddleRect = paddle.getBoundingClientRect();
      const ballRect = ball.getBoundingClientRect();

      if (ballY + ball.offsetHeight >= window.innerHeight - 20) {
        if (
          ballRect.left + ballRect.width >= paddleRect.left &&
          ballRect.left <= paddleRect.right
        ) {
          score++;
          scoreDisplay.textContent = 'Score: ' + score;
          if (score > highScore) {
            highScore = score;
            localStorage.setItem('ctb_highScore', highScore);
            highScoreDisplay.textContent = 'High Score: ' + highScore;
          }
          resetBall();
        } else {
          alert('Game Over! Your score: ' + score);
          location.reload();
          return;
        }
      }

      ball.style.top = ballY + 'px';
      ball.style.left = ballX + 'px';

      animationId = requestAnimationFrame(updateBall);
    }

    startBtn.onclick = () => {
      if (!isRunning) {
        resetBall();
        isRunning = true;
        isPaused = false;
        updateBall();
      }
    };

    pauseBtn.onclick = () => {
      if (!isRunning) return;
      isPaused = !isPaused;
      pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
      if (!isPaused) updateBall();
      else cancelAnimationFrame(animationId);
    };