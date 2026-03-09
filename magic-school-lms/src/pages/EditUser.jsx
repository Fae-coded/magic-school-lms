import { InputCard } from "../components/InputCard";
import "../components/InputCardContainer.css";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';

// Page for editing a user
export default function EditUser() {
  const { tokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const { id } = useParams();
  const [userUsername, setUserUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch current user data on mount
  useEffect(() => {

    if (!id || !tokens?.access) return;
    const fetchUser = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      try {
        const response = await fetch(`${apiUrl}/users/${id}/`,
          {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        }
      }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

        const data = await response.json();
        setUserUsername(data.username);
        setUserEmail(data.email);
        setUserRole(data.role);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    
      fetchUser();
  }, [id, tokens?.access]);


// Updates user information
  const editUser = async (id) => {
    const userDetails = {
      username: userUsername,
      email: userEmail,
      role: userRole
    };
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/users/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens?.access}`,
        },
        body: JSON.stringify(userDetails),
      });
      if (!response.ok) {
        const errors = await response.json();
        Object.keys(errors).forEach(field => {
        const fieldErrors = errors[field];
        const message = Array.isArray(fieldErrors)
        ? fieldErrors[0]
        : fieldErrors;
        setErrorMessage(`${field}: ${message}`);

        setTimeout(() => {          
          setErrorMessage(null);
        }, 5000);
      });
      } else {
        await response.json();
        setSuccessMessage("User updated");
        setTimeout(() => {
          navigate("/manage-users");
        }, 2000);
  }
      
    } catch (error) {
      console.error("Error editing user:", error);
      setErrorMessage("User update failed. Please try again.");
    }
  };

  //Handles cancel button click - resets form and navigates back to previous page
  const handleCancel = () => {
    setUserUsername("");
    setUserEmail("");
    setUserRole("");
    navigate("/manage-users");
    };

  return (
    <div className="edit-user-page">
      <h1>Edit User Details:</h1>
      <InputCard
        username={userUsername}
        onUsernameChange={(e) => setUserUsername(e.target.value)}
        email={userEmail}
        onEmailChange={(e) => setUserEmail(e.target.value)}
        role={userRole}
        onRoleChange={(e) => setUserRole(e.target.value)}
        buttonText="Save Changes"
        onPrimaryClick={() => editUser(id)}
        secondButtonText="Cancel"
        onCancelClick={handleCancel} 
        />
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};