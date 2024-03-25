import React, { useState, useEffect, useRef } from 'react';

// StopWatch component definition
const StopWatch = ({ stopwatchStarted, setFinalTime,setFormattedTime}) => {
    const [timePassed, setTimePassed] = useState(0);
    const intervalRef = useRef(null);

    // Effect hook to start and stop the stopwatch
    useEffect(() => {
        if (stopwatchStarted) {     // Start the stopwatch when stopwatchStarted is true
             
            intervalRef.current = setInterval(() => {
                setTimePassed((prevTime) => {
                    return prevTime + 10;
                });
            }, 10);
        } else {        // Stop the stopwatch when stopwatchStarted is false
            
            clearInterval(intervalRef.current);
            setFormattedTime(formatTime(timePassed));// Format the time when the stopwatch stops
            setFinalTime(timePassed); // Set the final time when the stopwatch stops
        }
        return () => clearInterval(intervalRef.current);// Cleanup function to clear the interval
    }, [stopwatchStarted, setFinalTime, timePassed]);


     // Function to format the time in the HH:MM:SS format
    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const hours = Math.floor(totalSeconds / 3600);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // return the formatted time
    return <div>{formatTime(timePassed)}</div>;
};

// Export the StopWatch component
export default StopWatch;
