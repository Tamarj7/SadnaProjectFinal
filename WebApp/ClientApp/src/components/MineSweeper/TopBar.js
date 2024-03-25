import React, { Component } from 'react';
import '../CSS/TopBar.css';


// Define the TopBar component
export default class TopBar extends Component {

    // Function to handle the start of the game
    handleStartGame = () => {

        // Extract necessary props and states
        const { gameStarted, boardSize:boardSizeInput } = this.props;
        const onStartButtonClick = this.props.onStartButtonClick;
        const minesAmountInput = this.props.minesAmount;

        // Check the game status and validate input values
        if (gameStarted) {
            this.setState({ gameStarted: false });
        } else {
            if (this.validateBoardSizeInput(boardSizeInput)) {
                if (minesAmountInput >= boardSizeInput * boardSizeInput * 0.05 && minesAmountInput <= boardSizeInput * boardSizeInput * 0.5) {
                    this.props.setGameStarted(true);
                    this.setState({ gameStarted: true });
                    onStartButtonClick(boardSizeInput, minesAmountInput);
                } else {
                    if (minesAmountInput < boardSizeInput * boardSizeInput * 0.05) {
                        alert('Mines amount should be at least 5% of the board size.');
                    } else if (minesAmountInput > boardSizeInput * boardSizeInput * 0.5) {
                        alert('Mines amount should be at most 50% of the board size.');
                    }
                }
            } else {
                alert('Invalid board size input. Please enter a number between 3 and 15');
            }
        }
    };


    // Function to validate the board size input
    validateBoardSizeInput = (boardSize) =>
        boardSize <= 15 && boardSize >= 3 && !isNaN(boardSize);

    // Function to handle the change in mines amount
    handleMinesAmountChange = (e) => {
        const gameStarted = this.props.gameStarted;
        if (!gameStarted) {
            const newMinesAmount = parseInt(e.target.value, 10);
            this.props.setMinesAmount(newMinesAmount);
        }
    };

    // Function to handle the change in board size
    handleBoardSizeChange = (e) => {
        const gameStarted = this.props.gameStarted;
        if (!gameStarted) {
            const newBoardSize = parseInt(e.target.value, 10);
            this.props.setBoardSize(newBoardSize);
            this.setState({ boardSize: newBoardSize });        }
    };

    // Function to initialize the game
    initializeGame = (minesAmount) => {
        this.stopWatch.reset();
        this.setState({
            message: '',
            flagsLeft: minesAmount,
            gameStarted: false,
        });
    };


    // Render the TopBar component
    render() {
        const { boardSize } = this.props;
        return (
            <div className="top-bar">
                <div className="input-container">
                    <label htmlFor="board-size-input">Board Size:</label>
                    <input
                        type="number"
                        id="board-size-input"
                        value={boardSize}
                        onChange={this.handleBoardSizeChange}
                    />
                    <label htmlFor="mines-amount-input">Mines Amount:</label>
                    <input
                        type="number"
                        id="mines-amount-input"
                        value={this.props.minesAmount}
                        onChange={this.handleMinesAmountChange}
                    />
                    <button onClick={this.handleStartGame}>Start Game</button>
                </div>
            </div>
        );
    }
}
