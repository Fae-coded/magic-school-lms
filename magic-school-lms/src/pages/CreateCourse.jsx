import { InputCard } from "../components/InputCard.jsx";
import "../components/InputCardContainer.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';

// Page for creating a new course
export default function CreateCourse() {
  const { tokens, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  //Sends POST request to create a new course
  const addCourse = async () => {
    const courseDetails = {
      course_title: courseTitle,
      course_description: courseDescription,
    };
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/courses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens?.access}`,
        },
        body: JSON.stringify(courseDetails),
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
        setSuccessMessage("Course created!");
        setTimeout(() => {
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/teacher");
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      setErrorMessage("Course creation failed. Please try again.");
    }
  };

  //Handles cancel button click - resets form and navigates back to previous pages
  const handleCancel = () => {
    setCourseTitle("");
    setCourseDescription("");
    
    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/teacher");
    };
  };

  return (
    <div className="create-course-page">
      <h1>New Course Creation:</h1>
      <InputCard
        title={courseTitle}
        onTitleChange={(e) => setCourseTitle(e.target.value)}
        description={courseDescription}
        onDescriptionChange={(e) => setCourseDescription(e.target.value)}
        buttonText="Create Course" onPrimaryClick={addCourse}
        secondButtonText="Cancel" onCancelClick={handleCancel}
      />
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};