import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user } = useContext(AuthContext);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    let errorMessage = "";
    let redirectPath = null;

    // If no user is logged in, redirect to login page
    if (!user) {
        errorMessage = "You do not have permission to view this page. Redirecting to login.";
        redirectPath = "/login-register";
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        const roleMap = {
            student: { path: "/student", suffix: "student dashboard." },
            teacher: { path: "/teacher", suffix: "teacher dashboard." },
            admin: { path: "/admin", suffix: "admin dashboard." },
        };
    // If user role is not in allowedRoles, redirect to their dashboard
        const destination = roleMap[user.role] || { path: "/", suffix: "home page." };
        redirectPath = destination.path;
        errorMessage = `You do not have permission to view this page. Redirecting to ${destination.suffix}`;
    }

    useEffect(() => {
        if (!redirectPath) return;

        const timer = setTimeout(() => {
            setShouldRedirect(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, [redirectPath]);

    if (shouldRedirect && redirectPath) {
        return <Navigate to={redirectPath} replace />;
    }

    if (redirectPath) {
        return <p className="error-message">{errorMessage}</p>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;