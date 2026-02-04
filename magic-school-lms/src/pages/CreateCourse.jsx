import { InputCard } from "../components/InputCard.jsx";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// Page for creating a new course
export default function CreateCourse() {
  const [courseTitle, setCourseTitle] = useState("Enter course title here");
  const [courseDescription, setCourseDescription] = useState("Enter course description here");

  const addCourse = async () => {
    const courseDetails = {
      title: courseTitle,
      description: courseDescription,
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/courses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseDetails),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Course created:", data);
        // set((prevCourses) => [...prevCourses, data]);  If using a global state for courses
      }
    } catch (error) {
      console.error("Error creating course:", error);
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

  return (
    <div className="create-course-page">
      <h1>New Course Creation:</h1>
      <InputCard
        title={courseTitle}
        onTitleChange={(e) => setCourseTitle(e.target.value)}
        description={courseDescription}
        onDescriptionChange={(e) => setCourseDescription(e.target.value)}
        buttonText="Create Course"
        onPrimaryClick={addCourse}
        secondButtonText="Cancel"
        onCancelClick={handleCancel}
      />
    </div>
  );
};