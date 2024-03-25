// Function to retrieve indices of surrounding cells based on the board size and chosen index
const getSurroundingCellIndices = (boardSize, chosenIndex) => {

    // Extract row and column indices based on the chosen index
    const index = parseInt(chosenIndex);
    const rowIndex = Math.floor(index / boardSize);
    const colIndex = index % boardSize;
    const surroundingIndices = [];

    // Loop to determine the surrounding cell indices
    for (let row = rowIndex - 1; row <= rowIndex + 1; row++) {
        for (let col = colIndex - 1; col <= colIndex + 1; col++) {
            if (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
                surroundingIndices.push(row * boardSize + col);
            }
        }
    }

    return surroundingIndices;// Return the list of surrounding cell indices
};


// Function to generate the game board with mines distributed randomly
const generateGameBoard = (boardSize, minesAmount, chosenCellIndex) => {
    // Initialize variables for game board generation
    const totalCells = boardSize * boardSize;
    const isMinedIndices = new Set();
    const surroundingCells = getSurroundingCellIndices(boardSize, chosenCellIndex);

     // Loop to randomly distribute mines on the game board
    while (isMinedIndices.size < minesAmount) {
        const randomIndex = Math.floor(Math.random() * totalCells);
        if (randomIndex !== chosenCellIndex && !surroundingCells.includes(randomIndex)) {
            isMinedIndices.add(randomIndex);
        }
    }

    // Create the game board array with cell properties
    const gameBoard = Array(totalCells).fill().map((_, index) => ({
        isMined: isMinedIndices.has(index),
        isFlagged: false,
        isRevealed: false,
    }));

    return gameBoard; // Return the generated game board
};

// Function to count the number of surrounding mines for a chosen cell
const countSurroundingMines = (boardSize, cells, chosenIndex) => {
    // Retrieve surrounding cell indices
    const surroundingIndices = getSurroundingCellIndices(boardSize, chosenIndex);
    // Count the number of surrounding mines
    return surroundingIndices.reduce((count, index) => (cells[index].isMined ? count + 1 : count), 0);
};


// Function to retrieve the surrounding cells of a chosen cell
const getSurroundingCells = (boardSize, cells, chosenIndex) => {

    // Extract information about the position of the chosen cell
    const index = parseInt(chosenIndex);
    const isRightColumn = index % boardSize === boardSize - 1;
    const isLeftColumn = index % boardSize === 0;
    const isFirstRow = index < boardSize;
    const isLastRow = index >= boardSize * (boardSize - 1);
    const surroundingCells = [];

    // Retrieve the surrounding cells based on the position of the chosen cell
    if (!isLeftColumn) {
        surroundingCells.push(cells[index - 1]);
    }
    if (!isRightColumn) {
        surroundingCells.push(cells[index + 1]);
    }
    if (!isFirstRow) {
        surroundingCells.push(cells[index - boardSize]);
        if (!isLeftColumn) {
            surroundingCells.push(cells[index - boardSize - 1]);
        }
        if (!isRightColumn) {
            surroundingCells.push(cells[index - boardSize + 1]);
        }
    }
    if (!isLastRow) {
        surroundingCells.push(cells[index + boardSize]);
        if (!isLeftColumn) {
            surroundingCells.push(cells[index + boardSize - 1]);
        }
        if (!isRightColumn) {
            surroundingCells.push(cells[index + boardSize + 1]);
        }
    }
    return surroundingCells;// Return the list of surrounding cells
};


// Exporting the functions for external use
export {
    generateGameBoard,
    countSurroundingMines,
    getSurroundingCells,
};
