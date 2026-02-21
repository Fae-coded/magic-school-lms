
import { useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";
import '../components/form.css';

export default function Form() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="form-container">
      {isLogin ? <> 
      <LoginForm /> 
      <p>Not enrolled yet? <a href="#" className="form-link" onClick={()=> setIsLogin(false)}>Register here!</a></p>
      </>
      : 
      <>
      <RegisterForm />
      <p>Enrolled already? <a href="#" className="form-link" onClick={()=> setIsLogin(true)}>Login here!</a></p>
      </>
     }
     </div>
  );
}
