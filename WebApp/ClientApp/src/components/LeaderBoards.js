import React, { useState, useEffect } from 'react';
import LeaderBoardCard from "./LeaderBoardCard.js";

const LeaderBoards = () => {

    const [scores, setScores] = useState([]);

    useEffect(() => {
        fetch(`/topScoresDB`)
            .then((results) => {
                return results.json();
            })
            .then(data => {
                setScores(data);
            })

    }, [])



    return (
        
        
        scores.map((board) => (      //running threw each grid size and generating a leader board card

            <LeaderBoardCard Board={board} />
        ))
    )
} 
export default LeaderBoards;