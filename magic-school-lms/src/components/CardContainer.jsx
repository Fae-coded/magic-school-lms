// CardContainer component to hold multiple Card components
import { Card } from './Card.jsx';


export function CardContainer({ containerTitle }) {
  return (
    <div className="card-container">
        <h1 className="container-title">{containerTitle}</h1>
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
        
    </div>
  );
}