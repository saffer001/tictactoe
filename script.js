//IIFE creating the game board grid.
const Board = (function() {
    let playerTurn = 0;
    const grid = ["□","□","□","□","□","□","□","□","□"];
    return {
        //Draw the grid in the console for testing purposes.
        drawGridConsole: () => {console.log(`
        ${grid[0]}  ${grid[1]}  ${grid[2]}
        ${grid[3]}  ${grid[4]}  ${grid[5]}
        ${grid[6]}  ${grid[7]}  ${grid[8]}`)},
        //Adds a certain mark to the grid to a certain index.
        drawMark: (gridIndex, playerMark) => {
            grid[gridIndex] = playerMark; 
        },
        //Draws the grid of divs in the DOM and attaches event listeners.
        drawGrid: () => {
            const gameArea = document.getElementById("gameAreaDiv")
            gameArea.innerHTML = ""
            for (i = 0; i<9; i++) {
                let htmlGridCell = document.createElement("div");
                htmlGridCell.id = i;
                htmlGridCell.addEventListener("click", () => {
                    domInteractions.cellClicked(htmlGridCell)
                })
                gameArea.appendChild(htmlGridCell);
            };
        },
        //Returns the value of a grid cell.
        returnGrid: (index) => grid[index],
        //Returns a copy of the current grid status.
        returnGridCopy: () => [...grid],
        resetBoard: () => {
            Board.playerTurn = 0;
            let arrayResetValue = "□";
            grid.fill(arrayResetValue);
            Board.drawGrid()
            GameControls.updateCurrentPlayerDisplay()
        },
        playerTurn
    };
})();

const GameControls = (function() {
    const playerOneScoreDisplay = document.getElementById("p-player1Score");
    const playerTwoScoreDisplay = document.getElementById("p-player2Score");
    const currentPlayerDisplay = document.getElementById("p-currentPlayer");
    const resetButton = document.getElementById("button-resetButton")
    return {
        updateScoresDisplay: () => {
            playerOneScoreDisplay.textContent = `❌ score: ${players.displayPlayerOneScore()}`
            playerTwoScoreDisplay.textContent = `⭕ score: ${players.displayPlayerTwoScore()}`
        },
        updateCurrentPlayerDisplay: (nextMove) => {
            if (Board.playerTurn % 2 == 0) {
                currentPlayerDisplay.textContent = `Next move is for ❌`
            } else {
                currentPlayerDisplay.textContent = `Next move is for ⭕`
            }
        },
        resetGame: () => {
            resetButton.addEventListener("click", () => {
                Board.resetBoard()
                players.resetScores()
                GameControls.updateScoresDisplay()
            })
        }
    }
       
})();
//IIFE to create the players and track scores.
const players = (function() {
    let playerOneScore = 0
    let playerTwoScore = 0
    return {
        incrementPlayerOneScore: () => playerOneScore++,
        incrementPlayerTwoScore: () => playerTwoScore++,
        displayPlayerOneScore: () => playerOneScore,
        displayPlayerTwoScore: () => playerTwoScore,
        resetScores: () => {
            playerOneScore = 0;
            playerTwoScore = 0;
        }

    }
})();

//IIFE to handle game flow
const gameMaster = (function() {
    return {
        // Check for every possible winning combination. 
        checkForPlayerWin: (playerMark) => {
            const allCellsAreFilled = Board.returnGridCopy().every(item => item !="□");
            if ((Board.returnGrid(0) == playerMark && Board.returnGrid(1) == playerMark && Board.returnGrid(2) == playerMark) ||
                (Board.returnGrid(3) == playerMark && Board.returnGrid(4) == playerMark && Board.returnGrid(5) == playerMark) ||
                (Board.returnGrid(6) == playerMark && Board.returnGrid(7) == playerMark && Board.returnGrid(8) == playerMark) ||
                (Board.returnGrid(0) == playerMark && Board.returnGrid(3) == playerMark && Board.returnGrid(6) == playerMark) ||
                (Board.returnGrid(1) == playerMark && Board.returnGrid(4) == playerMark && Board.returnGrid(7) == playerMark) ||
                (Board.returnGrid(2) == playerMark && Board.returnGrid(5) == playerMark && Board.returnGrid(8) == playerMark) ||
                (Board.returnGrid(0) == playerMark && Board.returnGrid(4) == playerMark && Board.returnGrid(8) == playerMark) ||
                (Board.returnGrid(6) == playerMark && Board.returnGrid(4) == playerMark && Board.returnGrid(2) == playerMark)) {
                    console.log(`gameover, playerwin, winner is ${playerMark}`); // for testing only
                    if (playerMark == "❌") {
                        players.incrementPlayerOneScore()
                        alert("❌ scored a point!")
                        GameControls.updateScoresDisplay()
                    } else {
                        players.incrementPlayerTwoScore()
                        alert("⭕ scored a point!")
                        GameControls.updateScoresDisplay()
                    }
                    Board.resetBoard();
            } else if (allCellsAreFilled) {
                    alert("It's a tie!")
                    //console.log("gameover tie");
                    Board.resetBoard()
                    return allCellsAreFilled;
            }
        },
        // Adds a mark of a player to a certain index in the grid.
        addMark: (index, playerMark) => {
            if (Board.returnGridCopy()[index] == "□") {
                Board.drawMark(index, playerMark);
                //console.log(`marking ${index} with ${playerMark}`);
                Board.playerTurn++
                //console.log(`Current player turn: ${Board.playerTurn}`);
            } else {
                //console.log("Grid already occupied!");
            }
            
        }
    }
})();

const domInteractions = (function() {
    return {
        cellClicked: (element) => {
            if (Board.playerTurn % 2 == 0) {
                //console.log("player1 clicked");
                gameMaster.addMark(element.id,"❌")
                element.textContent = Board.returnGrid(element.id)
                //console.log(Board.returnGridCopy());
                gameMaster.checkForPlayerWin("❌")
                GameControls.updateCurrentPlayerDisplay()
                Board.drawGridConsole()
            } else {
                //console.log("player2 clicked");
                gameMaster.addMark(element.id,"⭕")
                //console.log(Board.returnGridCopy());
                element.textContent = Board.returnGrid(element.id)
                gameMaster.checkForPlayerWin("⭕")
                GameControls.updateCurrentPlayerDisplay()
                Board.drawGridConsole()
            }
        }
    }

})();

Board.drawGrid()
GameControls.updateScoresDisplay()
GameControls.updateCurrentPlayerDisplay()
GameControls.resetGame()