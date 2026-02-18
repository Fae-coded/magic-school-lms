import crest from '../assets/StrixhavenCrest.webp';
import './navbar.css';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function NavBar() {
    const { user, logout, isAuthenticated } = useContext(AuthContext);

    return (
        <div className="navbar">
            <img src={crest} alt="Strixhaven University Crest" className="navbar-crest"/>

            {user?.role === "student" && (
                <>
                  <Link to="/student" className="navbar-link">Available Courses</Link>
                  <Link to="/enrolled-courses" className="navbar-link">Your Courses</Link>
                </>
            )}

            {user?.role === "teacher" &&( 
                <>
                  <Link to="/create-course" className="navbar-link">Create Course</Link>
                  <Link to="/teacher" className="navbar-link">Manage Courses</Link>
                  
                </>
            )}

            {user?.role === "admin" && (
                <>
                  <Link to="/create-course" className="navbar-link">Create Course</Link>
                  <Link to="/admin" className="navbar-link">Manage Courses</Link>
                  <Link to="/manage-users" className="navbar-link">Manage Users</Link>
                </>
            )}
            <div className="navbar-login-details">
            {isAuthenticated ? (
                <>
                  <h4 className="navbar-welcome">Welcome {user.username}</h4>
                  <Link className="navbar-logout" onClick={logout}>Logout</Link> 
                </>
            ) : (<Link to="/login-register" className="navbar-login">Login/Register</Link>)}
            </div>
        </div>
    );
}