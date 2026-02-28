import { Card } from '../components/Card.jsx';
import { CardContainer } from '../components/CardContainer.jsx';
import { useState, useEffect, useContext } from "react";
import AuthContext from '../context/AuthContext';

export default function StudentCourses() {
    const { tokens } = useContext(AuthContext)    

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!tokens?.access) return;
        
        const fetchStudentCourses = async () => {
        try {
            console.log("Token being sent:", tokens?.access);
            const response = await fetch('http://127.0.0.1:8000/api/students/courses/',
                {
                    headers: {
                        "Authorization": `Bearer ${tokens?.access}`,
            },
        }
    );
            
            if (!response.ok) {
                console.log("response:", response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setCourses(data.courses);
            setError(null);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
            fetchStudentCourses();
        
    }, [tokens]);

    return (
        
            <CardContainer containerTitle="Your Enrolled Courses">
                {loading && <p>Loading courses...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && !error && courses.length > 0 ? (
                courses.map((course) => (
                    <Card 
                        key={course.id}
                        title={course.course_title}
                        description={course.course_description}
                        buttonText="Enrolled"
                        buttonDisabled={true}
                    />
                ))
            ) : (
                <p>No courses available</p>
            )}
            </CardContainer>
    );
}