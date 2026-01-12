import { Card } from '../components/Card.jsx';
import { CardContainer } from '../components/CardContainer.jsx';

export default function StudentDashboard() {
    return (
        
            <CardContainer containerTitle="Available Courses">
                <Card 
                  title="Course Title"
                  description="Course description"
                  buttonText="Enroll"
                />
                <Card 
                  title="Course Title"
                  description="Course description"
                  buttonText="Enroll"
                />
                
            </CardContainer>
    );
}