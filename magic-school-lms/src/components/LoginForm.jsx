import '../components/form.css';
import { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';

export default function LoginForm() {

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isLoading) {
      return;
    }

    setIsLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        login(data.user, data.tokens);
        setSuccessMessage('Login successful!');
        setTimeout(() => {
        if (data.user.role === 'teacher') {
          navigate('/teacher');
        } else if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
        }, 1000);
      } else {
        setErrorMessage('Login failed. Please try again.');
        setTimeout(() => {      
                  setErrorMessage(null);
                }, 5000);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response?.data);
        setErrorMessage('Login failed. Please check your credentials.');
                setTimeout(() => {      
                  setErrorMessage(null);
                }, 5000);
      }
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <div>
          <h2 className= "form-title">Login</h2>
            <form onSubmit={handleSubmit}>
              <label>Username:
                <br></br>
                <input 
                  type="text" 
                  name= "username"
                  placeholder="Username" 
                  value={formData.username}
                  onChange={handleChange}
                />
              </label>
            <br></br>
              <label>Password:
                <br></br>
                <input 
                  type="password" 
                  name= "password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleChange}
                />
              </label>
            <br></br>
          <button type="submit" disabled={isLoading}>Login</button>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    );
}