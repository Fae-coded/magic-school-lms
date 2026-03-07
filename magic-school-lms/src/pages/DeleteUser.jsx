import { Card } from '../components/Card.jsx';
import "../components/InputCardContainer.css";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';

//Page for deleting a user
export default function DeleteUser() {
  const { tokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const { id } = useParams();
  const [userUsername, setUserUsername] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userRole, setUserRole] = useState();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch current user data on mount
  useEffect(() => {
    if (!id || !tokens?.access) return;
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${id}/`,
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

  // Sends DELETE request to delete user
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    setSuccessMessage("User deleted");

    setTimeout(() => {
        navigate("/manage-users");
    }, 2000);

    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage("Failed to delete user. Please try again.");
    }
  };

  // Resets form and navigates back to manage users page
  const handleCancel = () => {
    setUserUsername("");
    setUserEmail("");
    setUserRole("");
    navigate("/manage-users");
    };

  return (
    <div className="delete-user-page">
      <h1>Please confirm you wish to delete this user?</h1>
      <div className="delete-user-card">
      <Card
        username={userUsername}
        email={userEmail}
        roleText= {userRole}
        buttonText="Yes, delete this user"
        onButtonClick={() => deleteUser(id)} 
        secondButtonText="Cancel"
        onSecondButtonClick={handleCancel} 
        />
        </div>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};