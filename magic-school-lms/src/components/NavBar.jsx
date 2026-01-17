import crest from '../assets/StrixhavenCrest.webp';
import './navbar.css';
import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <div className="navbar">
            <img src={crest} alt="Strixhaven University Crest" className="navbar-crest" />
            <button className="navbar-button">Your Courses</button>
            <h4 className="navbar-welcome">Welcome Student name</h4>
            <Link to="/login-register" className="navbar-login">Login/Register</Link>
        </div>
    );
}