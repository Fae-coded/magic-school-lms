import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const userRole = localStorage.getItem("role");

    if (!userRole) {
        return <Navigate to="/login-register" replace />;
    }
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return children;
};

export default ProtectedRoute;