import '../components/form.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function LoginForm() {

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
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log("Response status:", response.status);

      if (response.ok) {
        localStorage.setItem("accessToken", data.tokens.access);
        localStorage.setItem("refreshToken", data.tokens.refresh);
        localStorage.setItem("role", data.user.role);
        setSuccessMessage('Login successful!');
        if (data.user.role === 'teacher') {
          navigate('/teacher');
        } else if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response?.data);
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