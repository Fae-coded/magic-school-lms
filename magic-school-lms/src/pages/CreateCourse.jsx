import { InputCard } from "../components/InputCard.jsx";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';

// Page for creating a new course
export default function CreateCourse() {
  const { tokens, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courseTitle, setCourseTitle] = useState("Enter course title here");
  const [courseDescription, setCourseDescription] = useState("Enter course description here");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const addCourse = async () => {
    const courseDetails = {
      course_title: courseTitle,
      course_description: courseDescription,
    };
    try {
      console.log("Access token:", tokens?.access);
      const response = await fetch("http://127.0.0.1:8000/api/courses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens?.access}`,
        },
        body: JSON.stringify(courseDetails),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Course created:", data);
        setSuccessMessage("Course created!");
        // set((prevCourses) => [...prevCourses, data]);  If using a global state for courses
      } else {
        console.log("Backend error:", data);
        setErrorMessage("Course creation failed.");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      setErrorMessage("Course creation failed. Please try again.");
    }
  };

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