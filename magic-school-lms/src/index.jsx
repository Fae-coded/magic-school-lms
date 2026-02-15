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
import DeleteCourse from './pages/DeleteCourse.jsx';
import DeleteUser from './pages/DeleteUser.jsx'
import EditUser from './pages/EditUser.jsx'
import App from './App.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Root />}>
    <Route index element={ <Home /> } />
    <Route path="/login-register" element={ <Form /> } />

    <Route path="/student" element={
      <ProtectedRoute allowedRoles={["student"]}> 
        <StudentDashboard />
      </ProtectedRoute>  } />

    <Route path="/enrolled-courses" element={ 
      <ProtectedRoute allowedRoles={["student"]}>
        <StudentCourses /> 
      </ProtectedRoute>} />

    <Route path="/teacher" element={
      <ProtectedRoute allowedRoles={["teacher"]}>
        <TeacherDashboard /> 
      </ProtectedRoute>} />

    <Route path="/create-course" element={
      <ProtectedRoute allowedRoles={["teacher", "admin"]}>
        <CreateCourse />
      </ProtectedRoute>} />

    <Route path="/edit-course/:id" element={
      <ProtectedRoute allowedRoles={["teacher", "admin"]}>
        <EditCourse />
      </ProtectedRoute>} />

    <Route path= "/delete-course/:id" element= {
      <ProtectedRoute allowedRoles={["teacher", "admin"]}>
        <DeleteCourse/>
      </ProtectedRoute>} />

    <Route path="/admin" element={
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>} />

    <Route path="/manage-users" element={ 
      <ProtectedRoute allowedRoles={["admin"]}>
        <ManageUsers />
      </ProtectedRoute>} />

    <Route path="/edit-user/:id" element={ 
      <ProtectedRoute allowedRoles={["admin"]}>
        <EditUser />
      </ProtectedRoute>} />

    <Route path="/delete-user/:id" element={ 
      <ProtectedRoute allowedRoles={["admin"]}>
        <DeleteUser />
      </ProtectedRoute>} />
  
  </Route>
  
));


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
