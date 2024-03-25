import React, { Component } from 'react';
import '../CSS/LowerBar.css'; 

// Define the LowerBar component
class LowerBar extends Component {
    constructor(props) {
        super(props);
        this.time = 0;// Initialize the time property
    }

    // Function to check if the message contains the word "winner"
    containsWinner(message) {
        return message.toLowerCase().includes('winner');
    }


    // Render method to display the LowerBar component
    render() {
        return (
            <div className="lower-bar">
                <div className="left-content">
                    <div>Flags Left: {this.props.flagsLeft}</div>{/* Display the number of flags left */}
                </div>
                <div className="center-content">
                    {/* Display the message if it is not an empty string if it contains winner it will be green */}
                    {this.props.message !== '' && (
                        <div className={`message ${this.containsWinner(this.props.message) ? 'winner' : ''}`}>
                            {this.props.message}
                        </div>
                    )}
                    {/* Display the score if it is not 0 */}
                    {this.props.score !== 0 && (
                        <div className="score">{this.props.score}</div>
                    )}
                </div>
                <div className="right-content">
                    <div>{this.props.time}</div> {/* Display the time */}
                </div>
            </div>
        );
    }
}

export default LowerBar;
