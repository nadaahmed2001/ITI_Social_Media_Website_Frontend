//AuthContext
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("access_token") || null
  );
  const [user, setUser] = useState(() =>
    authTokens ? jwtDecode(authTokens) : null
  );
  const [loading, setLoading] = useState(true); // 

  const loginUser = (token) => {
    localStorage.setItem("access_token", token);
    setAuthTokens(token);
    setUser(jwtDecode(token));
    console.log("User logged in:", jwtDecode(token)); // Log the user object to the console
  };

  const logoutUser = () => {
    localStorage.removeItem("access_token");
    setAuthTokens(null);
    setUser(null);
  };

  useEffect(() => {
    if (authTokens) {
      try {
        const decoded = jwtDecode(authTokens);
        setUser(decoded);
      } catch (e) {
        logoutUser();
      }
    }
    setLoading(false); //  Done loading
  }, [authTokens]);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, authTokens, loading }}>
      {!loading && children} {/*  Only render children when ready */}
    </AuthContext.Provider>
  );
};

export default AuthContext;
