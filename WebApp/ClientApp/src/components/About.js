import React, { useState, useEffect } from 'react';
import './CSS/About.css';

const About = () => {

    return (
        <div className="about-page">
            <h1>About Our Project</h1>
            <p>Welcome to our university project website! This project was created by two dedicated students as part of our coursework, and we are excited to share it with you. Here's a little bit about our project:</p>

            <h2>Our Mission</h2>
            <p>Our project aims to showcase our skills and knowledge gained during our time at university. It serves as both a learning experience and a practical application of the concepts we've learned in web development, programming, and software engineering.</p>

            <h2>What You'll Find Here</h2>
            <ul>
                <li><strong>Challenging Games:</strong> Our website features a fun and engaging game called "משחק שולה המוקשים" (Minesweeper). We've implemented all the logic and features you'd expect in a classic Minesweeper game.</li>
                <li><strong>Leaderboard:</strong> Compete with other players and see if you can achieve the highest score on our leaderboard. We've implemented a robust scoring system to keep things competitive.</li>
                <li><strong>User Profiles:</strong> Create your own user profile, track your progress, and see how you stack up against other players in the community.</li>
                <li><strong>Enjoyable Experience:</strong> We've worked hard to create a user-friendly interface that ensures an enjoyable and seamless experience for all our users.</li>
            </ul>

            <h2>Who We Are</h2>
            <p>We are two enthusiastic students who are passionate about programming and web development. This project represents our dedication to honing our skills and applying what we've learned in the classroom to real-world projects.</p>

            <h2>Contact Us</h2>
            <p>If you have any questions, feedback, or suggestions for improvement, please don't hesitate to reach out to us. You can contact us at [your email addresses].</p>

            <p>Thank you for visiting our project website! We hope you have a great time exploring and playing the game.</p>
        </div>
    );
}
export default About;