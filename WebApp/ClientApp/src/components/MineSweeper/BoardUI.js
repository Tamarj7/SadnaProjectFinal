import React, { Component } from 'react';
import '../CSS/BoardUI.css';


// Define the BoardUI class
class BoardUI extends Component {

    // Method to render individual squares on the board
    renderSquare = (status, onClick, onContextMenu, index) => {
        return (
            <div
                className={'square'}    // Set the class name for the square
                id={`square-${index}`}  // Set the ID attribute
                onClick={onClick}       // Define the onClick event for the square
                onContextMenu={onContextMenu}   // Define the onContextMenu event for the square
            >
                {status.isRevealed && !status.isMined && status.surroundingMines > 0 && status.surroundingMines}
            </div>
        );
    };

    // Method to render the entire game board
    renderBoard = () => {
        const { board, boardSize, gameManager } = this.props;    // Extract necessary props
        const rows = [];

        // Iterate over each row in the board
        for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
            const row = board.slice(rowIndex * boardSize, (rowIndex + 1) * boardSize);
            rows.push(
                <div key={rowIndex} className="board-row">
                    {row.map((square, colIndex) => (
                        <span key={colIndex}>
                            {this.renderSquare(
                                square,
                                (e) => {
                                    e.preventDefault();
                                    gameManager.boardBL.onSquareClick(rowIndex * boardSize + colIndex)      // Handle left mouse click action
                                }, //setting lrft mouse click action
                                (e) => {
                                    e.preventDefault();
                                    gameManager.boardBL.onSquareRightClick(rowIndex * boardSize + colIndex); // setting right click action
                                },
                                rowIndex * boardSize + colIndex // index to the renderSquare function

                            )}
                        </span>
                    ))}
                </div>
            );
        }

        return rows;        // Return the generated rows for the board
    };

    render() {
        const { boardSize } = this.props;      // Extract boardSize from props
        const gridStyle = {
            '--grid-size': `${boardSize}px`, // Set the CSS variable
        };

        // Render the game board
        return (
            <div className="root" style={gridStyle}>
                <div className="board" style={gridStyle}>
                    {this.renderBoard()}
                </div>
            </div>
        );
    }
}
export default BoardUI;