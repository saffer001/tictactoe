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

        },
        playerTurn
    };
})();
// Factory function to create the player objects.
function createPlayer(playerName, playerMark) {
    let playerScore = 0;
    return {
        playerName,
        incrementScore: () => playerScore++,
        displayScore: () => playerScore,
    };
};
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
                    incrementScore(playerMark)
                    Board.resetBoard();
            } else if (allCellsAreFilled) {
                    console.log("gameover tie");
                    Board.resetBoard()
                    return allCellsAreFilled;
            }
        },
        //Checks for a tie.
        checkForTie: () => {
            const allCellsAreFilled = Board.returnGridCopy().every(item => item !="□");
            return allCellsAreFilled;
        },
        addMark: (index, playerMark) => {
            if (Board.returnGridCopy()[index] == "□") {
                Board.drawMark(index, playerMark);
                console.log(`marking ${index} with ${playerMark}`);
            } else {
                console.log("Grid already occupied!");
            }
            
        }
    }
})();

const domInteractions = (function() {
    return {
        cellClicked: (element) => {
            if (Board.playerTurn % 2 == 0) {
                Board.playerTurn ++
                console.log("player1 clicked");
                gameMaster.addMark(element.id,"❌")
                element.textContent = Board.returnGrid(element.id)
                console.log(Board.returnGridCopy());
                gameMaster.checkForPlayerWin("❌")
                gameMaster.checkForTie()
                Board.drawGridConsole()
            } else {
                Board.playerTurn++
                console.log("player2 clicked");
                gameMaster.addMark(element.id,"⭕")
                console.log(Board.returnGridCopy());
                element.textContent = Board.returnGrid(element.id)
                gameMaster.checkForPlayerWin("⭕")
                gameMaster.checkForTie()
                Board.drawGridConsole()
            }
        }
    }

})();


const playerOne = createPlayer("Jóska");
const playerTwo = createPlayer("Pista");


console.log(`Player one score is: ${playerOne.displayScore()}, player two score is: ${playerTwo.displayScore()}`);
Board.drawGrid()