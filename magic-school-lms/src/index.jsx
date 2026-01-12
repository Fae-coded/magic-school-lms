import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Root from './pages/Root.jsx'
import StudentDashboard from './pages/student.jsx'
import App from './App.jsx'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Root />}>
    <Route path="/student" element={ <StudentDashboard /> } />
  </Route>
  
));


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
<RouterProvider router={router} />
  </StrictMode>,
)
