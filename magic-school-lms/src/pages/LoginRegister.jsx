
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
      <p>Not enrolled yet? 
        <button className="form-link" onClick={()=> setIsLogin(false)}>Register here!</button>
      </p>
      </>
      : 
      <>
      <RegisterForm />
      <p>Enrolled already? 
        <button className="form-link" onClick={()=> setIsLogin(true)}>Login here!</button>
      </p>
      </>
     }
     </div>
  );
}
