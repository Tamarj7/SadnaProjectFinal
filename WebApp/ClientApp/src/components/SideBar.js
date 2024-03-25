import React, { useState } from 'react';
import "./CSS/SideBar.css"

function Sidebar({ role }) {

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };


    const userTabs = [
        {
            level: 'admin',
            tabs: [
                { name: 'Users', link: '/users', icon: '/icons/AllUsers.png' },
                // Add more tabs for Admin level as needed
            ],
        },
    ];


    const allUsersTabs ={
        tabs: [
            { name: 'Me', link: '/my-profile', icon: '/icons/User.png' },
            { name: 'Lets Play', link: '/lets-play', icon: '/icons/StartGame.png' },
            { name: 'Leader Board', link: '/leader-boards', icon: '/icons/LeaderBoard.png' },
            { name: 'Logout', link: '/logout', icon: '/icons/Logout.png' }, // Use '/logout' as the link

        ],
    };

    const loginTab = { name: 'login', link: '/login', icon: '/icons/Login.png' };

    const buttomTab = { name: 'About', link: '/about', icon: '/icons/About.png' };

    const userLevelTabs = userTabs.find((userTab) => userTab.level === role);

    const combinedTabs = [
        ...(userLevelTabs ? userLevelTabs.tabs : []), // Include userLevelTabs if available
        ...(allUsersTabs.tabs || []), // Include allUsersTabs if available
    ];

    const renderTabs = () => {
        const userLevelTabs = userTabs.find((userTab) => userTab.level === role);


        return (
            <div>
                {combinedTabs.map((tab, index) => (
                    <div key={index} className="tab">
                        <a href={tab.link}>
                            <img src={tab.icon} alt={`Icon for ${tab.name}`} className="tab-icon" />
                            <span className="tab-name">{tab.name}</span>
                        </a>
                    </div>
                ))}
            </div>
        );

    };

    const renderLoginTab = () => {
        const userLevelTabs = userTabs.find((userTab) => userTab.level === role);


        return (
            < div className="tab" >
                <a href={loginTab.link}>
                    <img src={loginTab.icon} alt={`Icon for ${loginTab.name}`} className="tab-icon" />
                    <span className="tab-name">{loginTab.name}</span>
                </a>
            </div >

        );

    };



    const renderButtomTab = () => {
        const userLevelTabs = userTabs.find((userTab) => userTab.level === role);


        return (
            < div className = "tab bottom-tab" >
                <a href={buttomTab.link}>
                    <img src={buttomTab.icon} alt={`Icon for ${buttomTab.name}`} className="tab-icon" />
                    <span className="tab-name">{buttomTab.name}</span>
                </a>
            </div >
            
        );

    };

    return (
        <div
            className={`sidebar ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {role && renderTabs()} {/* Conditionally render the tabs based on the user's role */}
            {!role && renderLoginTab()}
            {renderButtomTab()}
        </div>

    );
}

export default Sidebar;
