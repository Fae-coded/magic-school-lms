import AuthContext from '../context/AuthContext.jsx';

const MockAuthProvider = ({ children, auth = {} }) => {
  const value = {
    user: auth.user ?? null,
    tokens: auth.tokens ?? null,
    login: () => {},
    logout: () => {},
    isAuthenticated: !!auth.user,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default MockAuthProvider;
