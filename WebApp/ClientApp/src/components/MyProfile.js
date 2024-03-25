import React, { useState, useEffect, useMemo } from 'react';
import './CSS/MyProfile.css';
import EditUserModal from './EditUserModal';
import ChangePasswordModal from './ChangePasswordModal'; // Import the NewPasswordInput component


const UserProfile = () => {
    const [editingUser, setEditingUser] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState();
    const token = sessionStorage.getItem('token');


    const headers = useMemo(() => {
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }, [token]);

    useEffect(() => {
        fetch(`/usersDB/profile`, { headers })
            .then((results) => results.json())
            .then((data) => {
                setEditingUser(data);
            });
    }, [headers, errorMessage]);

    const handleSaveEditUser = () => {
        fetch('/usersDB/profileEdit', {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(editingUser),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error updating user profile.');
                }
            })
            .then((data) => {
                setSuccessMessage(data.message);
                setErrorMessage('');
                handleCloseModal();
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setSuccessMessage('');
                handleCloseModal();
            });
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setIsPassModalOpen(false);
        setErrorMessage('');
    };

    const handleSaveNewPassword = () => {
        fetch('/usersDB/passwordReset', {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ userName:editingUser.userName, password: newPassword }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error resetting password.');
                }
            })
            .then((data) => {
                setSuccessMessage(data.message);
                setErrorMessage('');
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setSuccessMessage('');
            });    };

    return (
        <div className="edit-user-page">
            <h2>User Details: {editingUser.userName}</h2>
            <form>
                <div className="edit-user-page-field">
                    <div className="form-group">
                        <label>First Name:</label>
                        <input type="text" value={editingUser.firstName} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Last Name:</label>
                        <input type="text" value={editingUser.lastName} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input type="text" value={editingUser.email} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Phone:</label>
                        <input type="text" value={editingUser.phone} readOnly />
                    </div>
                </div>

                <div className="edit-user-buttons">
                    <button type="button" onClick={() => setIsEditModalOpen(true)}>
                        Edit
                    </button>
                    <button type="button" onClick={() => setIsPassModalOpen(true)}>
                        Reset Password
                    </button>
                </div>

                {successMessage && <div className="success">{successMessage}</div>}
                {errorMessage && <div className="error">{errorMessage}</div>}
            </form>

            {isEditModalOpen && ( // Render the modal conditionally based on the state
                <EditUserModal
                    editingUser={editingUser}
                    setEditingUser={setEditingUser}
                    handleSaveEditUser={handleSaveEditUser}
                    handleCloseModal={handleCloseModal} // Update to close the modal
                />
            )}

            {isPassModalOpen && ( // Render the password reset modal conditionally based on the state
                <ChangePasswordModal
                    userName={editingUser.userName}
                    setNewPassword= {setNewPassword}
                    handleSaveNewPassword={handleSaveNewPassword}
                    handleCloseModal={handleCloseModal}                />
            )}
        </div>
    );
};

export default UserProfile;
