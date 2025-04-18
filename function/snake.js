const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    let gameStarted = false;
    let snake, direction, food, score, speed, gameOver, isPaused, gameLoop;

    document.getElementById("highScore").innerText = "High Score: " + (localStorage.getItem("highScore") || 0);

    function startGame() {
      if (!gameStarted) {
        gameStarted = true;
        document.getElementById("startBtn").classList.add("hidden");
        document.getElementById("restartBtn").classList.remove("hidden");
        document.getElementById("pauseBtn").classList.remove("hidden");
        restartGame();
      }
    }

    function restartGame() {
      snake = [{ x: 200, y: 200 }];
      direction = "RIGHT";
      food = randomFood();
      score = 0;
      speed = 200;
      gameOver = false;
      isPaused = false;

      document.getElementById("score").innerText = "Score: " + score;
      document.getElementById("gameOverMsg").style.display = "none";
      document.getElementById("pauseBtn").innerText = "Pause";

      if (gameLoop) clearInterval(gameLoop);
      gameLoop = setInterval(() => {
        update(); draw();
      }, speed);
    }

    function draw() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "red";
      ctx.fillRect(food.x, food.y, 20, 20);

      ctx.fillStyle = "lime";
      snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 20, 20));
    }

    function update() {
      if (gameOver || isPaused) return;

      let head = { ...snake[0] };
      if (direction === "UP") head.y -= 20;
      if (direction === "DOWN") head.y += 20;
      if (direction === "LEFT") head.x -= 20;
      if (direction === "RIGHT") head.x += 20;

      if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        gameOver = true;
        document.getElementById("gameOverMsg").style.display = "block";
        if (score > (localStorage.getItem("highScore") || 0)) {
          localStorage.setItem("highScore", score);
        }
        return;
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").innerText = "Score: " + score;
        food = randomFood();
        speed = Math.max(50, 200 - score * 5);
        clearInterval(gameLoop);
        gameLoop = setInterval(() => { update(); draw(); }, speed);
      } else {
        snake.pop();
      }
    }

    function randomFood() {
      return {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
      };
    }

    function changeDirection(event) {
      if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
      if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
      if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
      if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    }

    function setDirection(dir) {
      if ((dir === "UP" && direction !== "DOWN") ||
          (dir === "DOWN" && direction !== "UP") ||
          (dir === "LEFT" && direction !== "RIGHT") ||
          (dir === "RIGHT" && direction !== "LEFT")) {
        direction = dir;
      }
    }

    function togglePause() {
      if (gameOver) return;
      isPaused = !isPaused;
      document.getElementById("pauseBtn").innerText = isPaused ? "Resume" : "Pause";
    }

    document.addEventListener("keydown", changeDirection);