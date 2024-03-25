import BoardBL from './BoardBL.js';

// Define the GameManager class
class GameManager {
    // Constructor for the GameManager class
    constructor(
        changeflagsLeft,
        handleGameEnd,
        handleGameStart,
    ) {
        this.changeflagsLeft = changeflagsLeft; // Initialize the changeflagsLeft property
        this.handleGameEnd = handleGameEnd;     // Initialize the handleGameEnd property
        this.handleGameStart = handleGameStart; // Initialize the handleGameStart property

        // Create an instance of the BoardBL class
        this.boardBL = new BoardBL(
            this.changeflagsLeft,
            this.handleGameEnd,
            this.handleGameStart,
        );
    }

     // Method to start the game
    startGame = (boardSize, minesAmount) => {
        const { board } = this.boardBL.initializeBoard(boardSize, minesAmount);
        this.board = board; // Initialize the board 
    };


}

export default GameManager;
