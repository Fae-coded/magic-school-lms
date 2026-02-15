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
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

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
                setSuccessMessage('Registration successful!');
                setTimeout(() => {
                  window.location.reload() 
                }, 2000);

                            
            } else {
                setErrorMessage('Registration failed. Please try again.');
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response);
                setErrorMessage('Registration failed. Please check your credentials.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
          <h2 className= "form-title">Register</h2>
            <form onSubmit={handleSubmit}>
              <label>Username:
                <br></br>
                <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username" />
              </label>
              <br></br>
              <label>Email:
                <br></br>
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
                <br></br>
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
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    );
}