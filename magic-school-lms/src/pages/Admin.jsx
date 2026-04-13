import { Card } from "../components/Card";
import { CardContainer } from '../components/CardContainer.jsx';
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';

export default function AdminDashboard() {
    const { tokens } = useContext(AuthContext)
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
      useEffect(() => {
        if (!tokens?.access) return;

        const fetchCourses = async () => {
          const apiUrl = import.meta.env.VITE_API_URL;
          try {
              const response = await fetch(`${apiUrl}/courses/`,
                {
                    headers: {
                        "Authorization": `Bearer ${tokens?.access}`,
            },
          });
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


  return (
    <CardContainer containerTitle="Manage Courses">
            {loading && <p>Loading courses...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && !error && courses.length === 0 && <p>No courses available</p>}
            {!loading && !error && courses.length > 0 && (
                courses.map((course) => (
                    <Card 
                        key={course.id}
                        title={course.course_title}
                        description={course.course_description}
                        buttonText="Edit Course" onButtonClick={() => navigate(`/edit-course/${course.id}`)}
                        secondButtonText="Delete Course" onSecondButtonClick={() => navigate(`/delete-course/${course.id}`)}
                    />
                ))
            )}
        </CardContainer>      
    );
}