const GameBoard  = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];
    const displayBoard = function() {
        console.log(
            `${board[0]} | ${board[1]} | ${board[2]}\n` +
            `${board[3]} | ${board[4]} | ${board[5]}\n` +
            `${board[6]} | ${board[7]} | ${board[8]}\n`
        );
    }
    const updateBoard = function (index, symbol) {
        if (board[index] === "") {
            board[index] = symbol;
            return true;
        }
        return false
    }
    const reset = function () {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    }

    const getBoard = function () {
        return [...board];
    };

    return {getBoard, displayBoard, updateBoard, reset};
})()

function Player(name, symbol) {
    return {name, symbol};
}

const GameController = (function() {
    let currentPlayer = null;
    let players = [];
    let gameOver = false;

    const startGame = function() {
        players = [Player("Player 1", "X"), Player("Player 2", "O")];
        currentPlayer = players[0];
        gameOver = false;
        GameBoard.reset();
        GameBoard.displayBoard();
    }

    const playTurn = function(index) {
        if (gameOver) return;
        
        const success = GameBoard.updateBoard(index, currentPlayer.symbol);
        if (!success) {
            console.log("Invalid move! Try another spot.");
            return;
        }

        GameBoard.displayBoard();

        if (checkWin(currentPlayer.symbol)) {
            console.log(`${currentPlayer.name} wins!`);
            gameOver = true;
        } else if (!GameBoard.getBoard().includes("")) {
            console.log("It's a draw!");
            gameOver = true;
        } else {
            switchPlayer();
        }

        return true;
    }

    const switchPlayer = function() {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }

    const checkWin = function(symbol) {
        const b = GameBoard.getBoard();
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8], // rows
            [0,3,6], [1,4,7], [2,5,8], // columns
            [0,4,8], [2,4,6]           // diagonals
        ];
        return winPatterns.some(pattern =>
            pattern.every(index => b[index] === symbol)
        );
    }

    const isGameOver = function() {
        return gameOver;
    }

    const getCurrentPlayerName = function() {
        return currentPlayer.name;
    }

    const getStatusMessage = function() {
        if (!gameOver) return "";
        const board = GameBoard.getBoard();
        if (board.includes("")) return `${currentPlayer.name} wins!`;
        return "It's a draw!";
    }

    return {startGame, playTurn, isGameOver, getCurrentPlayerName, getStatusMessage};
})()

const gameBoardElement = document.getElementById("gameBoard");
const statusText = document.getElementById("statusText");
const restartBtn = document.getElementById("restartBtn");

function renderBoard() {
    gameBoardElement.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", () => handleClick(i));
        gameBoardElement.appendChild(cell);
    }
}

GameController.startGame();
renderBoard();
updateUI();

function handleClick(index) {
    if (GameController.playTurn(index)) {
        updateUI();
    }
}

function updateUI() {
    const boardState = GameBoard.getBoard();
    const cells = document.querySelectorAll(".cell");

    boardState.forEach((value, i) => {
        cells[i].textContent = value;
    });

    if (GameController.isGameOver()) {
        statusText.textContent = GameController.getStatusMessage();
    } else {
        statusText.textContent = GameController.getCurrentPlayerName() + "'s turn"
    }
}

restartBtn.addEventListener("click", () => {
    GameController.startGame();
    renderBoard();
    updateUI();
});