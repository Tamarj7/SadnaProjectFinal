import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of withRouter

import './CSS/RegistrationForm.css'; // Import the new CSS file

const RegistrationForm = () => {
    // variables for form fields
    const [userName, setUserName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // navigation
    const navigate = useNavigate(); // Use the useNavigate hook to programmatically navigate

    // variables for field validation
    const [usernameValid, setUsernameValid] = useState(true);
    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [phoneValid, setPhoneValid] = useState(true);
    const [passwordMatch, setPasswordMatch] = useState(true);

    // State for showing the response modal
    const [showResponseModal, setShowResponseModal] = useState(false);

    // State for the validation response
    const [validationResponse, setValidationResponse] = useState({ ok: true, errors: [] });

    // Effect to validate password match
    useEffect(() => {
        validatePasswordsMatch(password, confirmPassword);
    }, [password, confirmPassword]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form fields
        const isFormValid =
            usernameValid &&
            firstNameValid &&
            lastNameValid &&
            passwordValid &&
            confirmPasswordValid &&
            emailValid &&
            phoneValid &&
            password === confirmPassword;

        if (isFormValid) {
            // Create a user object to send to the backend
            const user = {
                userName,
                firstName,
                lastName,
                password,
                email,
                phone,
            };

            try {
                // Make a POST request to register the user
                const response = await fetch('/usersDB/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });

                if (response.ok) {
                    // Registration was successful
                    setValidationResponse({ ok: true, errors: [] });
                    resetForm();
                    setShowResponseModal(true);
                    setTimeout(() => { navigate('/login') }, 2000); // 2000 milliseconds = 2 seconds

                } else {
                    const errorData = await response.json();
                    const errors = errorData.errors ? errorData.errors : errorData; // Check if errorData is defined

                    setValidationResponse({ ok: false, errors: errors });
                }

                // Show the response modal
                setShowResponseModal(true);
            } catch (error) {
                console.error('An error occurred during registration', error);
                // Handle unexpected errors here
            }
        } else {
            // Validate and mark invalid fields
            validateFields();
            if (validationResponse.errors && validationResponse.errors.length > 0) {
                alert(validationResponse.errors.join('\n')); // Display all error messages
            }
        }
    };

    // Reset form fields and validation states
    const resetForm = () => {
        setUserName('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setPhone('');
        setUsernameValid(true);
        setFirstNameValid(true);
        setLastNameValid(true);
        setPasswordValid(true);
        setConfirmPasswordValid(true);
        setEmailValid(true);
        setPhoneValid(true);
        setPasswordMatch(true);
    };

    // Validate form fields
    const validateFields = () => {
        setUsernameValid(!!userName);
        setFirstNameValid(!!firstName);
        setLastNameValid(!!lastName);
        setPasswordValid(password.length >= 6); // Minimum password length is 6
        setConfirmPasswordValid(confirmPassword.length >= 6); // Minimum confirm password length is 6
        setEmailValid(!!email);
        setPhoneValid(!!phone);
    };

    // Validate password match
    const validatePasswordsMatch = (password, confirmPassword) => {
        setPasswordMatch(password === confirmPassword);
    };

    // Response modal component
    const ResponseModal = ({ response, onClose }) => {
        // Determine if the modal should be shown based on the presence of errors
        const showModal = !response.ok && response.errors.length > 0;

        return (
            <div className={`response-modal ${showModal ? 'show' : ''}`}>
                <div className="modal-content">
                    {response.ok ? (
                        <p className="success-message">Registration was successful!</p>
                    ) : (
                        <>
                            <h2>Error</h2>
                            <ul>
                                {Object.keys(response.errors).map((field) => (
                                    response.errors[field].map((error, index) => (
                                        <li key={`${field}-${index}`}>{error}</li>
                                    ))
                                ))}
                            </ul>
                        </>
                    )}
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    };

    // Close response modal
    const handleCloseResponseModal = () => {
        setShowResponseModal(false);
    };

    return (
        <div className="registration-form"> {/* Apply the new CSS class */}
            <h1>Registration</h1>
            <form onSubmit={handleSubmit}>
                {/* Form fields */}
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            validatePasswordsMatch(password, confirmPassword); // Call validateFields when the password changes
                        }}
                        minLength="6"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            validatePasswordsMatch(password, confirmPassword); // Call validateFields when the confirm password changes
                        }}
                        minLength="6"
                    />
                    {!passwordMatch && (
                        <p className="password-mismatch-error">Passwords do not match.</p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <button className="login-button" type="submit">
                    Register
                </button>
                {showResponseModal && (
                    <ResponseModal response={validationResponse} onClose={handleCloseResponseModal} />
                )}
            </form>
            <p>
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
};

export default RegistrationForm;
