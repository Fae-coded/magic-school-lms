import { InputCard } from "../components/InputCard";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';

// Page for editing an existing course
export default function EditCourse() {
  const { tokens, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { id } = useParams();  // Get course ID from URL params
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);


  // Fetch current course data on mount
  useEffect(() => {

    if (!id || !tokens?.access) return;
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/courses/${id}/`,
          {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        }
      }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch course");
      }

        const data = await response.json();
        setCourseTitle(data.course_title);
        setCourseDescription(data.course_description);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    
      fetchCourse();
  }, [id, tokens?.access]);

  const editCourse = async (id) => {
    const courseDetails = {
      course_title: courseTitle,
      course_description: courseDescription,
    };
    try {
      const response = await fetch(`http://localhost:8000/api/courses/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens?.access}`,
        },
        body: JSON.stringify(courseDetails),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Course edited:", data);
        setSuccessMessage("Course updated");
        setTimeout(() => {
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/teacher");
          }
        }, 2000);
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
        onPrimaryClick={() => editCourse(id)}
        secondButtonText="Cancel"
        onCancelClick={handleCancel} 
        />
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};