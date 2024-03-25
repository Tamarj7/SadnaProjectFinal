import React from 'react';
import "./CSS/LeaderBoardCard.css";

const LeaderBoardCard = ({ Board: { gridSize, topScores } }) => {
    const sortedScores = topScores.sort((a, b) => b.topScore - a.topScore);

    return (
        <div className="leader-board-card" key={gridSize}>
            <div>
                {/* Display top scores */}
                {topScores.map((score, index) => (
                    <p key={index}>
                        <strong>{score.username}</strong>: {score.topScore},
                        <br />
                        Date: {score.date},
                        <br />
                        Mines: {score.numberOfMines}
                    </p>
                ))}
            </div>

            <div>
                {/* Placeholder image */}
                <img
                    src='/icons/LeaderBoardCard.png'
                    alt={gridSize}
                />
            </div>

            <div>
                <span>Grid Size:{gridSize}</span>
            </div>
        </div>
    );
}

export default LeaderBoardCard;
