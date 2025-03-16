// Select DOM elements
let grid = document.querySelector(".grid");
let popup = document.querySelector(".popup");
let playAgain = document.querySelector(".playAgain");
let startGameButton = document.querySelector(".startGame");
let scoreDisplay = document.querySelector(".scoreDisplay");
let highScoreDisplay = document.querySelector(".highScore");
let startScreen = document.querySelector(".start-screen");
let lossDisplay = document.querySelector(".loss")
let winDisplay = document.querySelector(".wins")
let closeButton = document.querySelector(".close")
let finalScoreDisplay = document.getElementById("finalScore")
let highScoreView = document.getElementById("highScore")
let newHighScoreDisplay = document.querySelector(".newHighScore")

let width = 10;
let currentSnake = [2, 1, 0];
let direction = 1;
let loss = localStorage.getItem("loss") || 0;
let wins = localStorage.getItem("wins") || 0;
let finalScore = 0
let score = 0;
let speed = 0.9;
let intervalTime = 1000;
let interval;
let gameStarted = false;
let highScore = localStorage.getItem("highScore") || 0;

document.addEventListener("DOMContentLoaded", function () {
    highScoreDisplay.textContent = `High Score: ${highScore}`;
    lossDisplay.textContent = `Losses ${loss}`;
    winDisplay.textContent = `Wins ${wins}`

    createBoard();
    playAgain.addEventListener("click", replay);
    startGameButton.addEventListener("click", startGame);
});

// Create Game Board
function createBoard() {
    popup.style.display = "none";
    startScreen.style.display = "flex";
    grid.innerHTML = "";

    for (let i = 0; i < width * width; i++) {
        let div = document.createElement("div");
        grid.appendChild(div);
    }
}

// Start Game
function startGame() {
    if (gameStarted) return;

    gameStarted = true;
    startScreen.style.display = "none";

    let squares = document.querySelectorAll(".grid div");
    resetGame(squares);
    interval = setInterval(moveOutcome, intervalTime);
    document.addEventListener("keydown", control);
}

// Reset Game Settings
function resetGame(squares) {
    clearInterval(interval);
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    intervalTime = 1000;
    direction = 1;
    currentSnake = [2, 1, 0];

    squares.forEach(square => square.classList.remove("snake", "apple"));
    currentSnake.forEach(index => squares[index].classList.add("snake"));

    randomApple(squares);
}

// Move Outcome
function moveOutcome() {
    let squares = document.querySelectorAll(".grid div");

    if (checkForHits(squares)) {
        updateScores();
        lossesAndwins(score)
        gameOver();
        showGameOver(score, highScore)
        return clearInterval(interval);
    }

    moveSnake(squares);
}

// Move Snake
function moveSnake(squares) {
    let tail = currentSnake.pop();
    squares[tail].classList.remove("snake");
    currentSnake.unshift(currentSnake[0] + direction);

    eatApple(squares, tail);
    squares[currentSnake[0]].classList.add("snake");
}

// Check for Collisions
function checkForHits(squares) {
    return (
        currentSnake[0] + width >= width * width && direction === width ||  // Hits bottom
        currentSnake[0] % width === width - 1 && direction === 1 ||  // Hits right
        currentSnake[0] % width === 0 && direction === -1 ||  // Hits left
        currentSnake[0] - width < 0 && direction === -width ||  // Hits top
        squares[currentSnake[0] + direction]?.classList.contains("snake") // Hits itself
    );
}

// Eat Apple
function eatApple(squares, tail) {
    if (squares[currentSnake[0]].classList.contains("apple")) {
        squares[currentSnake[0]].classList.remove("apple");
        squares[tail].classList.add("snake");
        currentSnake.push(tail);

        randomApple(squares);
        score++;
        scoreDisplay.textContent = `Score: ${score}`;

        clearInterval(interval);
        intervalTime *= speed;
        interval = setInterval(moveOutcome, intervalTime);
    }
}

// Generate Random Apple
function randomApple(squares) {
    let appleIndex;
    do {
        appleIndex = Math.floor(Math.random() * squares.length);
    } while (squares[appleIndex].classList.contains("snake"));

    squares[appleIndex].classList.add("apple");
}

// Handle Key Controls
function control(e) {
    if (e.key === "ArrowUp" && direction !== width) {
        direction = -width;
    } else if (e.key === "ArrowDown" && direction !== -width) {
        direction = width;
    } else if (e.key === "ArrowLeft" && direction !== 1) {
        direction = -1;
    } else if (e.key === "ArrowRight" && direction !== -1) {
        direction = 1;
    }
}

//High Score
function updateScores() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    highScoreDisplay.textContent = `High Score ${highScore}`;
}

// check for losses and wins
function lossesAndwins(score) {
    if (score >= 10) {
        wins++;
        localStorage.setItem("wins", wins)
    } else {
        loss++
        localStorage.setItem("loss", loss)
    }

    lossDisplay.textContent = `Losses ${loss}`;
    winDisplay.textContent = `Wins ${wins}`
}

//popup
function showGameOver(score, highScore) {
    finalScore = score;
    if (score > highScore){
        newHighScoreDisplay.textContent = `New High Score, ${score}`
    } else if (score = highScore) {
        newHighScoreDisplay.textContent = `Impressive! You’ve reached the high score again, ${score}`
    } else {
        newHighScoreDisplay.textContent = `Keep playing, you'll be better at it`
    }

    finalScore.textContent = `Your Score: ${finalScore}`
    newHighScoreDisplay.textContent = `${newHighScoreDisplay}`
}

closeButton.addEventListener("click", () => {
    popup.style.display = "none"
})

// Game Over
function gameOver() {
    popup.style.display = "flex";
    gameStarted = false;
}

// Replay Game
function replay() {
    createBoard();
    startScreen.style.display = "flex";
    popup.style.display = "none";
    gameStarted = false;
}
