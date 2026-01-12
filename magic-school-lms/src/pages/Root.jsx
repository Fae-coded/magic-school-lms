import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';

export default function Root() {
    return (
        <div>
            <NavBar />
            <Outlet />
        </div>
    );
}