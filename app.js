let grid = document.querySelector(".grid");
let popup = document.querySelector(".popup");
let playAgain = document.querySelector(".playAgain");
let startGameButton = document.querySelector(".startGame");
let scoreDisplay = document.querySelector(".scoreDisplay");
let startScreen = document.querySelector(".start-screen");

let width = 10;
let currentIndex = 0;
let appleIndex = 0;
let currentSnake = [2, 1, 0];
let direction = 1;
let score = 0;
let speed = 0.9;
let intervalTime = 1000;
let interval = 0;
let gameStarted = false;

document.addEventListener("DOMContentLoaded", function () {
    createBoard();
    playAgain.addEventListener("click", replay);
    startGameButton.addEventListener("click", startGame);
});

// Create Game Board
function createBoard() {
    popup.style.display = "none";
    startScreen.style.display = "flex"; // Show start screen
    grid.innerHTML = ""; 
    for (let i = 0; i < 100; i++) {
        let div = document.createElement("div");
        grid.appendChild(div);
    }
}

// Start Game when button is clicked
function startGame() {
    if (gameStarted) return; // Prevent multiple clicks
    gameStarted = true;
    startScreen.style.display = "none"; // Hide start screen

    let squares = document.querySelectorAll(".grid div");
    randomApple(squares);
    direction = 1;
    score = 0;
    scoreDisplay.innerHTML = `Score: ${score}`;
    intervalTime = 1000;
    currentSnake = [2, 1, 0];
    currentSnake.forEach(index => squares[index].classList.add("snake"));
    interval = setInterval(moveOutcome, intervalTime);
    document.addEventListener("keydown", control);
}

// Move Outcome
function moveOutcome() {
    let squares = document.querySelectorAll(".grid div");
    if (checkForHits(squares)) {
        gameOver(squares);
        return clearInterval(interval);
    } else {
        moveSnake(squares);
    }
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
    if (
        (currentSnake[0] + width >= width * width && direction === width) ||
        (currentSnake[0] % width === width - 1 && direction === 1) ||
        (currentSnake[0] % width === 0 && direction === -1) ||
        (currentSnake[0] - width < 0 && direction === -width) ||
        squares[currentSnake[0] + direction].classList.contains("snake")
    ) {
        squares[currentSnake[0]].style.backgroundColor = "red";
        return true;
    }
    return false;
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
    do {
        appleIndex = Math.floor(Math.random() * squares.length);
    } while (squares[appleIndex].classList.contains("snake"));
    squares[appleIndex].classList.add("apple");
}

// Handle Key Controls
function control(e) {
    let key = e.key;
    if (key === "ArrowUp" && direction !== width) {
        direction = -width;
    } else if (key === "ArrowDown" && direction !== -width) {
        direction = width;
    } else if (key === "ArrowLeft" && direction !== 1) {
        direction = -1;
    } else if (key === "ArrowRight" && direction !== -1) {
        direction = 1;
    }
}

// Game Over
function gameOver(squares) {
    popup.style.display = "flex";
    gameStarted = false; // Allow restarting the game
}

// Replay Game
function replay() {
    grid.innerHTML = "";
    createBoard();
    startScreen.style.display = "flex"; // Show start screen again
    popup.style.display = "none";
    gameStarted = false;
}
