import '../components/form.css';
import { useState } from 'react';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
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
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            console.log("Response status:", response.status);
            if (response.ok) {
                console.log('Registration successful');
            } else {
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
          <h2 className= "form-title">Register</h2>
            <form onSubmit={handleSubmit}>
              <label>username:
                <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username" />
              </label>
              <br></br>
              <label>Email:
                <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email" 
                />
              </label>
            <br></br>
              <label>Password:
                <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password" 
                />
              </label>
            <br></br>
          <button type="submit" disabled={isLoading}>Register</button>
        </form>
      </div>
    );
}