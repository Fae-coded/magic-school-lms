import { Card } from "../components/Card";

export default function CreateCourse() {
  return (
    <div className="create-course-page">
      <h1>New Course Creation:</h1>
      <Card 
        title="Create Course" 
        description="Please enter new course description." 
        buttonText="Create Course" 
        secondButtonText="Cancel" />
    </div>
  );
}