import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Sidebar from './components/SideBar.js';
import './components/CSS/App.css';

const App = () => {


    const [role, setRole] = useState(null);  // State to store the user's role

    const token = sessionStorage.getItem('token'); // Get the user's token from local storage


     // UseEffect to authenticate the user and set the user's role, this will be used to set the sidebar options
    useEffect(() => {
        fetch('/authenticate', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
        })
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((data) => {
                setRole(data.role); // Set the user's role in state
            })
            .catch((error) => {
                console.error('Fetch Error:', error);
                setRole(null);      // Set the role to null in case of an error
            });
    }, [token]); // Include 'token' in the dependency array

    // UseEffect to handle sidebar mouse events
    useEffect(() => {
        const sidebar = document.querySelector('.sidebar');

        
        const handleMouseEnter = () => {        // Handle mouse enter event
            document.body.classList.add('sidebar-hovered');
        };

        const handleMouseLeave = () => {        // Handle mouse leave event
            document.body.classList.remove('sidebar-hovered');
        };

        // Add event listeners for mouse enter and leave
        sidebar.addEventListener('mouseenter', handleMouseEnter);
        sidebar.addEventListener('mouseleave', handleMouseLeave);

        // Remove event listeners when the component unmounts
        return () => {
            sidebar.removeEventListener('mouseenter', handleMouseEnter);
            sidebar.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []); 




    return (
        <Router>
            <div className="app">

                {/* Render the Sidebar component with the user's role */}
                <Sidebar role={role} /> 
                {/* Map AppRoutes to Route components */}
                <Routes>
                    {AppRoutes.map((route, index) => {
                        const { element, ...rest } = route;
                        return <Route key={index} {...rest} element={element} />;
                    })}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
