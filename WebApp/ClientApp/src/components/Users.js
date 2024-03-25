import React, { useState, useEffect, useMemo } from 'react';
import EditUserModal from './EditUserModal';
import NewPassword from './ChangePasswordModal';
import './CSS/Users.css';


const Users = () => {
    const [originalUsers, setOriginalUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordResetModalOpen, setPasswordResetModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);


    const token = sessionStorage.getItem('token');

    const headers = useMemo(() => {
        return {
            Authorization: `Bearer ${token}`,
        };
    }, [token]);

    useEffect(() => {
        setIsLoading(true);
        fetch(`/usersDB`, { headers })
            .then((results) => results.json())
            .then((data) => {
                setOriginalUsers(data);
                setUsers(data);
                setIsLoading(false);
                setTimeout(() => {
                    setSuccessMessage('');
                    setErrorMessage('');
                }, 10000);
            })
            .catch((error) => {
                setErrorMessage('Error loading users. Please try again.');
                setIsLoading(false);
            });
    }, [isModalOpen, headers, successMessage, errorMessage]);

    const searchUsers = (userSearch) => {
        const lowerCaseSearchTerm = userSearch.toLowerCase();
        const filteredUsers = originalUsers.filter((user) =>
            user.userName.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setUsers(filteredUsers);
    };


    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSaveEditUser = async () => {
        try {
            const response = await fetch(`/usersDB/adminEditUser`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingUser),
            });

            handleCloseModal();

            if (response.ok) {
                const data = await response.json();
                setSuccessMessage(data.message);
                setErrorMessage('');
                
            } else {
                const data = await response.json();
                let formattedErrorMessage = 'Error updating user:';
                if (data.errors) {
                    Object.keys(data.errors).forEach((key) => {
                        formattedErrorMessage += ` ${key}: ${data.errors[key]}`;
                    });
                } else {
                    formattedErrorMessage += ` ${data.message}`;
                }
                setErrorMessage(formattedErrorMessage);
            }
        } catch (error) {
            handleCloseModal();
            setErrorMessage('An error occurred while updating user.');
        }
    };


    const handleCloseModal = () => {
        setPasswordResetModalOpen(false);
        setIsModalOpen(false);
        setEditingUser(null); // Reset editedUser when closing the modal
    };

    const handleDeleteUser = async (userName) => {
        // Set the userToDelete state to the user you want to delete
        setUserToDelete(userName);
    };


    const confirmDeleteUser = async () => {
        try {
            const response = await fetch(`/usersDB/deleteUser/${userToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const updatedUsers = users.filter((user) => user.userName !== userToDelete);
                setUsers(updatedUsers);
                setSuccessMessage('User successfully deleted.');
                setErrorMessage('');
            } else {
                const data = await response.json();
                setErrorMessage(`Error deleting user. Please try again. error data:${data}`);
                setSuccessMessage('');
            }

            // Reset the userToDelete state
            setUserToDelete(null);
        } catch (error) {
            setErrorMessage('An error occurred while deleting the user.');
            setSuccessMessage('');
        }
    };

    const handlePasswordReset = (user) => {
        setEditingUser(user);
        setPasswordResetModalOpen(true);
    };

    const handleSaveNewPassword = async () => {
        try {
            const response = await fetch(`/usersDB/passwordResetAdmin`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName: editingUser.userName, Password: newPassword }), // Adjust 'newpassword' to the desired default password
            });

            if (response.ok) {
                setSuccessMessage('Password reset successfully.');
                setErrorMessage('');
            } else {
                const data = await response.json();
                setErrorMessage(`Error resetting password. ${data.message}`);
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('An error occurred while resetting the password.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="user-page">
            <div className="search">
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for username"
                />
                <button onClick={() => searchUsers(searchTerm)}>Search</button>
            </div>

            <h1>User List</h1>
            <table>
                <thead>
                    <tr>
                        <th>userName</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.length ? (
                        users.map((user) => (
                            <tr key={user.userName}>
                                <td>{user.userName}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleEditUser(user)}>Edit</button>
                                    <button onClick={() => handlePasswordReset(user)}>Reset Password</button>
                                    <button onClick={() => handleDeleteUser(user.userName)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <></>
                    )}
                </tbody>
            </table>

            {successMessage && <div className="success">{successMessage}</div>}
            {errorMessage && <div className="error">{errorMessage}</div>}


            {/* Display confirmation dialog for deleting user */}
            {userToDelete && (
                <div className="confirmation-modal">
                    <p>Are you sure you want to delete the user?</p>
                    <button onClick={confirmDeleteUser}>Yes</button>
                    <button onClick={() => setUserToDelete(null)}>No</button>
                </div>
            )}

            {/* Display the EditUser component as a modal when isModalOpen is true */}
            {isModalOpen && (
                <div className="edit-user-modal">
                    <EditUserModal
                        editingUser={editingUser}
                        setEditingUser={setEditingUser}
                        handleSaveEditUser={handleSaveEditUser}
                        handleCloseModal={handleCloseModal}
                    />
                </div>
            )}
            {passwordResetModalOpen && (
                <div className="password-reset-modal">
                    <NewPassword
                        userName={editingUser.userName}
                        setNewPassword={setNewPassword}
                        handleSaveNewPassword={handleSaveNewPassword}
                        handleCloseModal={handleCloseModal}  
                    />
                </div>
            )}

            {isLoading && <div>Loading...</div>}
        </div>
    );
};

export default Users;