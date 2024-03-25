import React from 'react';
import './CSS/EditUserModal.css';


const EditUserModal = ({
    editingUser,
    setEditingUser,
    handleSaveEditUser,
    handleCloseModal,
}) => {
    return (
        <div className="edit-user-contentt">
            <div className="edit-user">
                <h2>Edit User: {editingUser.userName}</h2>
                <form>
                    <div className="edit-user-field">
                        <label>First Name:</label>
                        <input
                            type="text"
                            value={editingUser.firstName}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, firstName: e.target.value })
                            }
                        />
                    </div>
                    <div className="edit-user-field">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={editingUser.lastName}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, lastName: e.target.value })
                            }
                        />
                    </div>
                    <div className="edit-user-field">
                        <label>Email:</label>
                        <input
                            type="text"
                            value={editingUser.email}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, email: e.target.value })
                            }
                        />
                    </div>
                    <div className="edit-user-field">
                        <label>Phone:</label>
                        <input
                            type="text"
                            value={editingUser.phone}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, phone: e.target.value })
                            }
                        />
                    </div>
                    {/* Conditionally render the Role field if admin*/}
                    {editingUser.role && (
                        <div className="edit-user-field">
                            <label>Role:</label>
                            <select
                                value={editingUser.role}
                                onChange={(e) =>
                                    setEditingUser({ ...editingUser, role: e.target.value })
                                }
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    )}
                    <div className="edit-user-buttons">
                        <button type="button" onClick={handleSaveEditUser}>
                            Save
                        </button>
                        <button type="button" onClick={handleCloseModal}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
