import { InputCard } from "../components/InputCard";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Page for editing an existing course
export default function EditCourse() {
  const { pk } = useParams();  // Get course ID from URL params
  const [courseTitle, setCourseTitle] = useState("Current Course Title");
  const [courseDescription, setCourseDescription] = useState("Current Course Description");

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
      }
    } catch (error) {
      console.error("Error editing course:", error);
    }
  };

  const handleCancel = () => {
    setCourseTitle("");
    setCourseDescription("");
    // const navigate = useNavigate();
    // if (user.role === "admin") {
    //   navigate("/admin-dashboard");
    // } else {
    //   navigate("/teacher-dashboard");
    };

    //Navigate back to respective dashboard after course edit confirmed?

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
        //Add a delete button
        />
    </div>
  );
};