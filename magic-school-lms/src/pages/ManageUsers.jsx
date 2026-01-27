import { Card } from "../components/Card";
import { CardContainer } from "../components/CardContainer";
import { useState, useEffect } from 'react';

export default function ManageUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/');
          if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data);
            setError(null);
          } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
      }


  return (
    <CardContainer containerTitle="Manage Users">
      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && users.length > 0 ? (
                users.map((user) => (
                    <Card
                        key={user.id}
                        title={user.username}
                        description={user.email}
                        buttonText="Edit User"
                        secondButtonText="Delete User"
                    />
                  ))
          ) : (<p>No users found.</p>)}
    </CardContainer>
  );
}