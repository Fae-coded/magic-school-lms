import { Card } from "../components/Card";
import { CardContainer } from '../components/CardContainer.jsx';

export default function AdminDashboard() {
  return (
        
            <CardContainer containerTitle="Courses">
                <Card 
                  title="Course Title"
                  description="Course description"
                  buttonText="Edit Course"
                  secondButtonText="Delete Course"
                />                
            </CardContainer>
    );
}