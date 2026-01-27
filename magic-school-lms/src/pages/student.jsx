import { useState, useEffect } from 'react';
import { Card } from '../components/Card.jsx';
import { CardContainer } from '../components/CardContainer.jsx';

export default function StudentDashboard() {

    // const [isEnrolled, setIsEnrolled] = useState(false); 

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/courses/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCourses(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <CardContainer containerTitle="Available Courses">
            {loading && <p>Loading courses...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && !error && courses.length > 0 ? (
                courses.map((course) => (
                    <Card 
                        key={course.id}
                        title={course.course_title}
                        description={course.course_description}
                        buttonText="Enroll"
                    />
                ))
            ) : (
                !loading && <p>No courses available</p>
            )}
        </CardContainer>        
    );
}