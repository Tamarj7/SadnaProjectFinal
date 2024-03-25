import * as utils from './Utils.js';

// Function to check if the player has won the game
const checkIsWin = (cells, minesAmount) => {
    return cells.filter((cell) => cell.isRevealed && !cell.isMined).length === cells.length - minesAmount;
}

// Define the BoardBL class
export default class BoardBL {
    constructor(
        changeFlagsLeft,
        handleGameEnd,
        handleGameStart,
    ) {
        this.changeFlagsLeft = changeFlagsLeft;
        this.handleGameEnd = handleGameEnd;
        this.handleGameStart = handleGameStart;
        this.flagsLeft = 0;
        this.cells = [];
        this.isFirstClick = true;
        this.gameEnded = true; //using flag var for game ended
    }
    

    // Method to initialize the game board
    initializeBoard = (boardSize, minesAmount) => {
        this.boardSize = boardSize;
        this.minesAmount = minesAmount;
        this.flagsLeft = minesAmount;

        this.updateLowerBar();

        // Initialize the cells using the utility function
        this.cells = utils.generateGameBoard(boardSize, minesAmount);
        return {
            minesAmount: this.minesAmount,
            board: this.cells, // Return the board here
        };
    }

    // Method for initializing the board after the first click
    firstClickInitialization = (chosenCellIndex) => {
        this.cells = utils.generateGameBoard(this.boardSize, this.minesAmount, chosenCellIndex);
        this.isFirstClick = false;
        this.handleGameStart();
        this.gameEnded = false;
    };

    // Method to handle left-click on a square
    onSquareClick = (chosenIndex) => {
        if (this.isFirstClick) {
            this.firstClickInitialization(chosenIndex);
        }
        const { isFlagged, isMined } = this.cells[chosenIndex];
        if (!isFlagged && !this.gameEnded) {
            const surroundingMinesAmount = utils.countSurroundingMines(this.boardSize, this.cells, chosenIndex);
            this.cells[chosenIndex].isRevealed = true;
            this.updateSquareClass(chosenIndex, surroundingMinesAmount);

            if (isMined || checkIsWin(this.cells, this.minesAmount)) {
                this.endGame();
            } else if (surroundingMinesAmount === 0) {
                const surroundingCells = utils.getSurroundingCells(this.boardSize, this.cells, chosenIndex);

                for (let i = 0; i < surroundingCells.length; i++) {
                    if (!surroundingCells[i].isRevealed) {
                        this.onSquareClick(this.cells.indexOf(surroundingCells[i]));
                    }
                }
            }
                
            
        }
        this.updateLowerBar();
    };

    // Method to update the CSS class of a square
    updateSquareClass(chosenIndex, surroundingMinesAmount) {
        const square = document.querySelector(`#square\\-${chosenIndex}`);
        if (square) {
            square.className = 'square'; // Reset the class
            const status = this.cells[chosenIndex];
            if (status.isRevealed && !status.isMined) {
                square.classList.add('revealed');
                if (surroundingMinesAmount !== 0) {
                    square.textContent = surroundingMinesAmount;
                }
            }
            if (status.isFlagged) {
                square.classList.add('flagged');
            }
            else if (status.isMined && status.isRevealed) {
                square.classList.add('mine');
            }
        }
    };

     // Method to handle right-click on a square
    onSquareRightClick = (chosenIndex) => {
        if (!this.isFirstClick && !this.gameEnded) {
            if (!this.cells[chosenIndex].isRevealed) {
                if (!this.cells[chosenIndex].isFlagged) {
                    if (this.flagsLeft>0) {
                        this.cells[chosenIndex].isFlagged = true;
                        this.flagsLeft = this.flagsLeft-1;
                    }
                } else {
                    this.cells[chosenIndex].isFlagged = false;
                    this.flagsLeft = this.flagsLeft +1;
                }
                this.updateSquareClass(chosenIndex);
            }
        }
        this.updateLowerBar();
    };

    // Method to end the game
    endGame = () => {
        this.gameEnded = true;
        this.handleGameEnd(checkIsWin(this.cells, this.minesAmount));
    };

     // Method to update the lower bar
    updateLowerBar = () => {
        this.changeFlagsLeft(this.flagsLeft);
    };



}
