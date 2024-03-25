import React, { useState, useEffect} from 'react';
import TopBar from './MineSweeper/TopBar';
import BoardUI from './MineSweeper/BoardUI';
import GameManager from './MineSweeper/GameManager';
import LowerBar from './MineSweeper/LowerBar';
import StopWatch from './MineSweeper/StopWatch.js';

const DEFAULT_SIZE_BOARD = 10;

const Game = () => {
    const [gameManager, setGameManager] = useState(null);               //gamemanger variable 
    const [minesAmount, setMinesAmount] = useState(DEFAULT_SIZE_BOARD); // chosen mines amount 
    const [boardSize, setBoardSize] = useState(DEFAULT_SIZE_BOARD);     // chosen board size
    const [gameStarted, setGameStarted] = useState(false);              //showing board
    const [numberFlagsLeft, setNumberFlagsLeft] = useState(0);          // number of flags
    const [message, setMessage] = useState('');                      //wining or losing message
    const [stopwatchStarted, setStopwatchStarted] = useState(false);    //stop watch state
    const [finalTime, setFinalTime] = useState(0);                      // total game time
    const [formattedTime, setFormattedTime] = useState(0);
    const [winner, setWinner] = useState(false);
    const [score, setScore] = useState(0);

    const handleStartGame = (boardSizeInput) => {
        const newGameManager = new GameManager(handleChangeFlagsLeft, handleGameEnd, handleGameStart);
        setGameManager(newGameManager);
        setBoardSize(boardSizeInput);
        newGameManager.startGame(boardSizeInput, minesAmount);
    };

    const handleResetGame = () => {
        setGameStarted(false);
        setGameManager(null);
        setStopwatchStarted(false);
        setMessage('');
        setWinner(false);
        setFinalTime(0);
        setScore(0);
    };

    const handleChangeFlagsLeft = (numberFlagsLeft) => {
        setNumberFlagsLeft(numberFlagsLeft);
    };

    const handleGameStart = () => {
        setStopwatchStarted(true);
    };

    const handleGameEnd = (isWin) => {
        setStopwatchStarted(false); // stoping stopwatch, and saving timer in time var.

        if (isWin) {        // in case of winning
            setWinner(true);
            setMessage("Winner!");
        }
        else {              // in case of losing
            setMessage("Boom! You're Dead");
        }
        
    };

    /*using useEffect in order to ensure that time is updated into finalTime variable*/
    useEffect(() => {
        if (finalTime !== 0 && winner) {    //only if winner
            const token = sessionStorage.getItem('token'); //fetching token from local storage

            const headers = {   //adding token to the JSON request
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            var newscore = calculateScore();
            setScore(newscore);

            fetch('topScoresDB/AddTopScore', {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({
                    username: '', // username will be generated after auth in db conroller side
                    gridSize: boardSize, // Add the grid size
                    topScore: newscore, // Add the calculated score 
                    numberOfMines: minesAmount, // Add the number of mines
                    playingTime: formattedTime, // Add the playing time
                    datePlayed: new Date().toISOString() // Add the current date in the
                })
            })
                .then(response => {
                    if (!response.ok) {
                        setMessage('Winner: Failed to upload Score');
                    }                })
                .catch(error => {
                    setMessage('Winner: Failed to upload Score')
                });

        }
    }, [finalTime ,winner]);

    /**calculation score for game, the calculation is
     *           2                      2
     * boardsize^  *10000 * minesAmount^
     * -----------------------
     *          time 
     */
    const calculateScore = () => {
        const mone = boardSize* 10000 * minesAmount*minesAmount;
        const mechane = finalTime;
        return Math.floor(mone / mechane);
    };

    return (
        <div className="game-container">
            <TopBar
                minesAmount={minesAmount}
                setMinesAmount={setMinesAmount}
                boardSize={boardSize}
                setBoardSize={setBoardSize}
                onStartButtonClick={handleStartGame}
                gameStarted={gameStarted}
                setGameStarted={setGameStarted}
            />
            {gameManager && gameManager.board ? (
                <div>
                    <BoardUI
                        board={gameManager.board}
                        boardSize={boardSize}
                        minesAmount={minesAmount}
                        gameManager={gameManager}
                    />

                    <LowerBar
                        flagsLeft={numberFlagsLeft}
                        message={message}
                        time={<StopWatch
                            stopwatchStarted={stopwatchStarted}
                            setFinalTime={setFinalTime}
                            setFormattedTime={setFormattedTime}
                        />}
                        score={score}
                    />
                </div>
            ) : (
                ''
            )}
            <button onClick={handleResetGame}>Reset Game</button>
        </div>
    );
};

export default Game;
