import Users from "./components/Users";
import MyProfile from "./components/MyProfile";
import LeaderBoards from "./components/LeaderBoards";
import About from "./components/About";
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm"; 
import Logout from "./components/Logout"; 
import Game from "./components/Game"; 

const AppRoutes = [
    {
        index: true,
        element: <LoginForm />, // Set the login form as the default route
    },
    {
        path: "/login",
        element: <LoginForm />, // Set the login form as the default route
    },
    {
        path: "/logout",
        element: <Logout />,     // Set the logout component
    },
    {
        path: "/users",
        element: <Users />,     // Set the users table component
    },
    {
        path: "/my-profile",
        element: <MyProfile />, // Set the user profile component
    },
    {
        path: "/leader-boards",
        element: <LeaderBoards />,  // Set the leaderboards component
    },
    {
        path: "/about",
        element: <About />,      // Set the about component
    },
    {
        path: "/register",
        element: <RegistrationForm />,  // Set the registration form component
    },
    {
        path: "/lets-play",
        element: <Game />,      // Set the game component
    },

];

export default AppRoutes;
