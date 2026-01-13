import { Card } from '../components/Card.jsx';
import { CardContainer } from '../components/CardContainer.jsx';

export default function StudentCourses() {
    return (
        
            <CardContainer containerTitle="Your Courses">
                <Card 
                  title="Course Title"
                  description="Course description"
                  buttonText="Enrolled"
                />
                <Card 
                  title="Course Title"
                  description="Course description"
                  buttonText="Enrolled"
                />
                
            </CardContainer>
    );
}