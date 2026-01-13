import { Card } from '../components/Card.jsx';
import { CardContainer } from '../components/CardContainer.jsx';

export default function TeacherDashboard() {
    return (
        
            <CardContainer containerTitle="Your Teaching Courses">
                <Card 
                  title="Course Title"
                  description="Course description"
                  buttonText="Edit Course"
                  secondButtonText="Delete Course"
                />
                <Card 
                  title="Course Title"
                  description="Course description"
                  buttonText="Edit Course"
                  secondButtonText="Delete Course"
                />
                
            </CardContainer>
    );
}