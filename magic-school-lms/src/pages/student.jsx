import { useState, useEffect, useContext } from 'react';
import { Card } from '../components/Card.jsx';
import { CardContainer } from '../components/CardContainer.jsx';
import AuthContext from '../context/AuthContext.jsx';

export default function StudentDashboard() {

    const { tokens } = useContext(AuthContext)
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (!tokens?.access) return;

        const fetchCourses = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/courses/',
                {
                    headers: {
                        "Authorization": `Bearer ${tokens?.access}`,
            },
        }
    )
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

        fetchCourses();
    }, [tokens]);

    

    const onButtonClick= async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/courses/${id}/enroll/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokens?.access}`
                },
            });
            if (response.ok) {
                setCourses(prev => 
                    prev.map(course =>
                        course.id === id ?
                        {...course, is_enrolled: true}:
                        course
                    )
                );
                setTimeout(() => {
                    setSuccessMessage('Enrollment successful!');
                }, 2000);
                                            
            } else {
                setErrorMessage('Failed to enroll');
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response);
                setErrorMessage('Enrollment failed. Please try again.');
            }
        } 
    };

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
                        buttonText={course.is_enrolled ? "Enrolled" : "Enroll"} 
                        buttonDisabled= {course.is_enrolled}  
                        onButtonClick={() => onButtonClick(course.id)}
                    />
                ))
            ) : (
                <p>No courses available</p>
            )}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </CardContainer>        
    );
}