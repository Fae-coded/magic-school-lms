import { Link } from 'react-router-dom';
import './Home.css';

//Make sure only not logged in users see this page. 
// Logged in users should be redirected to their dahsboard based on their role.
//Maybe have a check for tokens and role in local storage and then redirect to dashboard if logged in
//or backend redirects somehow?

export default function Home() {
    return (
        <div className= "home-container">
            <h1 >Welcome to Strixhaven University</h1>
            <h3>Whether you are a novice or an archmage, all magical skill sets have a place at Strixhaven!</h3>
            <Link to="/login-register" className="login-register-link">Login or Register here!</Link>
        </div>
    )
}