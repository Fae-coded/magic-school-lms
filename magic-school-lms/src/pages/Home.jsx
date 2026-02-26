import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
    return (
        <div className= "home-container">
            <h1 >Welcome to Strixhaven University</h1>
            <h3>Whether you are a novice or an archmage, all magical skill sets have a place at Strixhaven!</h3>
            <Link to="/login-register" className="login-register-link">Login or Register here!</Link>
        </div>
    )
}