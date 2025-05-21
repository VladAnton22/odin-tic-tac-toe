function GameBoard() {
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

    return {board, displayBoard, updateBoard, reset};
}

function Player(name, symbol) {
    return {name, symbol};
}

function GameController() {
    let currentPlayer = null;
    let players = [];
    let gameOver = false;
    let game_board = GameBoard();

    const startGame = function() {
        players = [Player("Alice", "X"), Player("Bob", "O")];
        currentPlayer = players[0];
        gameOver = false;
        game_board.reset();
        game_board.displayBoard();
    }

    const playTurn = function(index) {
        if (gameOver) return;
        
        const success = game_board.updateBoard(index, currentPlayer.symbol);
        if (!success) {
            console.log("Invalid move! Try another spot.");
            return;
        }

        game_board.displayBoard();

        if (checkWin(currentPlayer.symbol)) {
            console.log(`${currentPlayer.name} wins!`);
            gameOver = true;
        } else if (!game_board.board.includes("")) {
            console.log("It's a draw!");
            gameOver = true;
        } else {
            switchPlayer();
        }
    }

    const switchPlayer = function() {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }

    const checkWin = function(symbol) {
        const b = game_board.board;
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8], // rows
            [0,3,6], [1,4,7], [2,5,8], // columns
            [0,4,8], [2,4,6]           // diagonals
        ];
        return winPatterns.some(pattern =>
            pattern.every(index => b[index] === symbol)
        );
    }

    return {startGame, playTurn};
}

let game_controller = GameController();
game_controller.startGame();