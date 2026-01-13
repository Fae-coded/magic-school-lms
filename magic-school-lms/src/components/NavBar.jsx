import crest from '../assets/StrixhavenCrest.webp';
import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <div className="navbar">
            <img src={crest} alt="Strixhaven University Crest" className="navbar-crest" />
            <button className="navbar-button">Your Courses</button>
            <h3 className="navbar-welcome">Welcome Student name</h3>
            <Link to="/login-register" className="navbar-login">Login/Register</Link>
        </div>
    );
}