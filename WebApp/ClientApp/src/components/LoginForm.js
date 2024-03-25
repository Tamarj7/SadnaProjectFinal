import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate instead of withRouter
import "./CSS/LoginForm.css"

const LoginForm = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Use the useNavigate hook to programmatically navigate

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear messages when the user starts typing
        setErrorMessage('');
        setSuccessMessage('');
    };

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/usersDB/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            
            if (response.ok) { // Login successful
                
                const data = await response.json();     //receiving json answer from server

                sessionStorage.setItem('token', data.token); // Storing the token in local storage

                setSuccessMessage("Login Succesfull"); 
                setTimeout(() => {
                    navigate('/my-profile');
                    window.location.reload();
                }, 1000); // 1000 milliseconds = 1 seconds
            } else {
                // Login failed, handle errors
                const data = await response.json();
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage('An error occurred while logging in.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-form">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <p>
                    Don't have an account?{' '}
                    <Link to="/register">Register here</Link>
                </p>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
            </div>
        </div>
    );
};

export default LoginForm;
