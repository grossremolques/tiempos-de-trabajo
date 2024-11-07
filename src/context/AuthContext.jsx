import { createContext, useState, useContext } from "react";
import Auth from "auth-google-grossremolques";
const apiKey = import.meta.env.VITE_API_KEY;
const clientId = import.meta.env.VITE_CLIENT_ID;
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthContextProvider = ({ children }) => {
  const authGoogle = async () => {
    const auth = await Auth(apiKey, clientId);
    return auth;
  };
  const [auth, setAuth] = useState(null);
  const getAuth = async () => {
    const getAuth = await authGoogle();
    setAuth(getAuth);
  };
  return (
    <AuthContext.Provider value={{ auth, getAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
