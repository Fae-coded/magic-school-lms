import '../components/form.css';
import { useState } from 'react';
// import { useNavigate } from "react-router-dom";

export default function LoginForm() {
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
        console.log('Login successful:', data);
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
      //redirect to dashboard after login
      //handleRedirect();  have function handleRedirect somewhere
      // const navigate = useNavigate();
      // if (data.user.role === 'teacher') {
      //   navigate('/teacher');
      // } else if (data.user.role === 'admin') {
      //   navigate('/admin');
      // } else {
      //   navigate('/student');
      // }
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
                  placeholder="username" 
                  value={formData.username}
                  onChange={handleChange}
                />
              </label>
            <br></br>
              <label>Password:
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
      </div>
    );
}