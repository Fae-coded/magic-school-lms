
import { useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";


export default function Form() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? <> 
      <LoginForm /> 
      <p>Not enrolled yet? <a href="#" onClick={()=> setIsLogin(false)}>Register here!</a></p>
      </>
      : 
      <>
      <RegisterForm />
      <p>Enrolled already? <a href="#" onClick={()=> setIsLogin(true)}>Login here!</a></p>
      </>
     }
     </div>
  );
}
