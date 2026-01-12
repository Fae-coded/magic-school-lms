import crest from '../assets/StrixhavenCrest.webp';

export default function NavBar() {
    return (
        <div className="navbar">
            <img src={crest} alt="Strixhaven University Crest" className="navbar-crest" />
            <button className="navbar-button">Your Courses</button>
            <h3 className="navbar-welcome">Welcome Student name</h3>
            <button className="navbar-logout">Logout</button>
        </div>
    );
}