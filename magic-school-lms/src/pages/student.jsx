import { Card } from '../components/Card.jsx';
import { CardContainer } from '../components/CardContainer.jsx';
// import { useState } from 'react';

export default function StudentDashboard() {

    // const [isEnrolled, setIsEnrolled] = useState(false); 

    return (
        
            <CardContainer containerTitle="Available Courses">
                <Card 
                  title="Speaking the Same Language: Overview of Magical Notation"
                  description="Students will learn how to solve common magical cyphers or use magic to comprehend text that is alien to them."
                  buttonText= "Enroll"
                  // {isEnrolled ? "Enrolled" : "Enroll"}
                  // onButtonClick={isEnrolled ? null : () => setIsEnrolled(true)}
                />
                <Card 
                  title="SLAM Poetry: Devastating Your Enemies with Magical Insults"
                  description="Students will either learn how to taunt opponents, or actually cause harm via vicious mockery"
                  buttonText="Enroll"
                />
                
            </CardContainer>
    );
}