import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Root from './pages/Root.jsx'
import Home from './pages/Home.jsx';
import Form from './pages/LoginRegister.jsx';
import StudentDashboard from './pages/student.jsx'
import TeacherDashboard from './pages/Teacher.jsx'
import StudentCourses from './pages/StudentCourses.jsx'
import CreateCourse from './pages/CreateCourse.jsx';
import EditCourse from './pages/EditCourse.jsx';
import AdminDashboard from './pages/Admin.jsx';
import ManageUsers from './pages/ManageUsers.jsx';
import App from './App.jsx'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Root />}>
    <Route index element={ <Home /> } />
    <Route path="/login-register" element={ <Form /> } />
    <Route path="/student" element={ <StudentDashboard /> } />
    <Route path="/enrolled-courses" element={ <StudentCourses /> } />
    <Route path="/teacher" element={ <TeacherDashboard /> } />
    <Route path="/create-course" element={ <CreateCourse /> } />
    <Route path="/edit-course" element={ <EditCourse /> } />
    <Route path="/admin" element={ <AdminDashboard /> } />
    <Route path="/manage-users" element={ <ManageUsers /> } />
  
  </Route>
  
));


createRoot(document.getElementById('root')).render(
  <StrictMode>
  {/* <App /> */}
  <RouterProvider router={router} />
  </StrictMode>,
)
