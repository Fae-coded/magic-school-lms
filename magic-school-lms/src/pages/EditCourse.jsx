import { InputCard } from "../components/InputCard";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';

// Page for editing an existing course
export default function EditCourse() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { pk } = useParams();  // Get course ID from URL params
  const [courseTitle, setCourseTitle] = useState();
  const [courseDescription, setCourseDescription] = useState();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  // Fetch current course data on mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/courses/${pk}`);
        const data = await response.json();
        setCourseTitle(data.course_title);
        setCourseDescription(data.course_description);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    
    if (pk) {
      fetchCourse();
    }
  }, [pk]);

  const editCourse = async (pk) => {
    const courseDetails = {
      course_title: courseTitle,
      course_description: courseDescription,
    };
    try {
      const response = await fetch(`http://localhost:8000/api/courses/${pk}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseDetails),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Course edited:", data);
        setSuccessMessage("Course updated");
      }
    } catch (error) {
      console.error("Error editing course:", error);
      setErrorMessage("Course update failed. Please try again.");
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
    <div className="edit-course-page">
      <h1>Edit Course Details:</h1>
      <InputCard
        title={courseTitle}
        onTitleChange={(e) => setCourseTitle(e.target.value)}
        description={courseDescription}
        onDescriptionChange={(e) => setCourseDescription(e.target.value)}
        buttonText="Save Changes"
        onPrimaryClick={() => editCourse(pk)}
        secondButtonText="Cancel"
        onCancelClick={handleCancel} 
        successMessage={successMessage}
        errorMessage={errorMessage}
        />
    </div>
  );
};