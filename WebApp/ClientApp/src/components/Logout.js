import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate instead of withRouter

const LogOut = () => {
    const handleLogout = () => {
        // Perform logout actions here, e.g., clear session storage
        sessionStorage.removeItem('token');

        // Redirect the user to the login page or wherever is appropriate
        window.location.href = '/login'; // Redirect to the login page after logout

        // You can return '#' or any other valid URL if you don't want to redirect
        // return '#';
    };

    return (handleLogout());


};

export default LogOut;
