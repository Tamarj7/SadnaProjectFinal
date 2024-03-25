import React, { useState, useEffect } from 'react';
import './CSS/ChangePasswordModal.css';

const NewPassword = ({ userName, setNewPassword, handleCloseModal, handleSaveNewPassword }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const minLength = 6; // Minimum password length

    // validating the passwords. both need to be matched and 6 string in length
    const validatePasswordsMatch = (password, confirmPassword) => {
        const match = password === confirmPassword;
        const validLength = password.length >= minLength && confirmPassword.length >= minLength;
        setPasswordMatch(match && validLength);
        if (match && validLength) {
            setNewPassword(password);
        }
    };

    //validating the password
    useEffect(() => {
        validatePasswordsMatch(password, confirmPassword);
    }, [password, confirmPassword]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };



    const handleSaveClick = () => {
        if (passwordMatch) {
            handleCloseModal();
            handleSaveNewPassword();
        } else {
            alert('Please ensure passwords match and are at least 6 characters long.');
        }
    };

    return (
        <div className="change-password-modal">
            <h2>{userName}: New Pass</h2>
            <form>
                <div className="password-field">
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <div className="password-field">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                    {!passwordMatch && (
                        <p className="password-mismatch-error">Passwords do not match or are less than 6 characters.</p>
                    )}
                </div>
                <div className="password-buttons">
                    <button type="button" onClick={handleSaveClick}>
                        Save
                    </button>
                    <button type="button" onClick={handleCloseModal}>
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewPassword;
