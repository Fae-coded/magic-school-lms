import { Card } from "../components/Card";
import { CardContainer } from "../components/CardContainer";
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';

export default function ManageUsers() {
  const { tokens } = useContext(AuthContext)
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tokens?.access) return;

    const fetchUsers = async () => {
        const apiUrl = import.meta.env.VITE_API_URL;
        try {
            const response = await fetch(`${apiUrl}/users/`,
              {
                headers: {
                        "Authorization": `Bearer ${tokens?.access}`,
            },
          }
        );

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
      };
        fetchUsers();
    }, [tokens]);

  return (
    <CardContainer containerTitle="Manage Users">
      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && users.length > 0 ? (
                users.map((user) => (
                    <Card
                        key={user.id}
                        username={user.username}
                        email={user.email}
                        roleText={user.role}
                        buttonText="Edit User" onButtonClick={() => navigate(`/edit-user/${user.id}`)}
                        secondButtonText="Delete User" onSecondButtonClick={() => navigate(`/delete-user/${user.id}`)}
                    />
                  ))
          ) : (<p>No users found</p>)}
    </CardContainer>
  );
}