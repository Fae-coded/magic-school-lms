import { createContext, useState } from "react";

const AuthContext = createContext();

const getInitialAuth = () => {
  try {
    const tokens = localStorage.getItem("authTokens");
    const user = localStorage.getItem("user");

    if (tokens && user) {
      return {
        user: JSON.parse(user),
        tokens: JSON.parse(tokens),
      };
    }
  } catch (e) {
    console.error("Failed to parse auth from storage", e);
  }

  return { user: null, tokens: null };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getInitialAuth);

  const login = (user, tokens) => {
    setAuth({ user, tokens });
    localStorage.setItem("authTokens", JSON.stringify(tokens));
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = async () => {
    if (auth.tokens?.refresh) {
      try {
        await fetch("http://localhost:8000/api/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${auth.tokens?.access}`,
          },
          body: JSON.stringify({ refresh: auth.tokens.refresh }),
        });
      } catch (e) {
        console.error("Logout request failed:", e);
      }
    }
    
    setAuth({ user: null, tokens: null });
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider 
       value={{
        user: auth.user,
        tokens: auth.tokens,
        login,
        logout,
        isAuthenticated: !!auth.user,
       }}
       >
        {children}
       </AuthContext.Provider>
  );
};

export default AuthContext;