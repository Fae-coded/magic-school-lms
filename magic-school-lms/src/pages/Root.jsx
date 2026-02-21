import NavBar from '../components/NavBar';
import BackgroundProvider from '../components/BackgroundProvider';
import { Outlet } from 'react-router-dom';

export default function Root() {
    return (
        <div>
            <BackgroundProvider />
            <NavBar />
            <Outlet />
        </div>
    );
}