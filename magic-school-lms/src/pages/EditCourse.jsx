import { Card } from "../components/Card";

export default function EditCourse() {
  return (
    <div className="edit-course-page">
      <h1>Edit Course Details:</h1>
      <Card 
        title="Edit Course" 
        description="Please update the course description." 
        buttonText="Update Course" 
        secondButtonText="Cancel" />
    </div>
  );
}