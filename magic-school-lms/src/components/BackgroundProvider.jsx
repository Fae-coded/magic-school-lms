import { useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function BackgroundProvider() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const body = document.body;
    body.classList.remove('bg-student', 'bg-teacher', 'bg-admin');
    
    // Add the appropriate class based on user role
    if (user?.role) {
      body.classList.add(`bg-${user.role}`);
    } else {
    // Default background for non-logged in users
      body.classList.add('bg-home'); 
    }
  }, [user]);

  return null;
}