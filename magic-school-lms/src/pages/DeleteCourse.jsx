import { Card } from '../components/Card.jsx';
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';

//Page for deleting a course
export default function DeleteCourse() {
  const { tokens, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { id } = useParams();  // Get course ID from URL params
  const [courseTitle, setCourseTitle] = useState();
  const [courseDescription, setCourseDescription] = useState();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);


  // Fetch current course data on mount
  useEffect(() => {
    // if(isLoading) {
    //       return;
    //     }

    //     setIsLoading(true);

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

  const deleteCourse = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/courses/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      });
      if (!response.ok) {
      throw new Error("Failed to delete course");
    }

    setSuccessMessage("Course deleted");

    setTimeout(() => {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/teacher");
      }
    }, 2000);

    } catch (error) {
      console.error("Error deleting course:", error);
      setErrorMessage("Course delete failed. Please try again.");
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
    <div className="delete-course-page">
      <h1>Please confirm you wish to delete this course?</h1>
      <div className="delete-course-card">
      <Card
        title={courseTitle}
        description={courseDescription}
        buttonText="Yes, delete this course"
        onButtonClick={() => deleteCourse(id)} 
        secondButtonText="Cancel"
        onSecondButtonClick={handleCancel} 
        />
        </div>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

// disabled={isLoading}