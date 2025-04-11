import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    return access && refresh ? { access, refresh } : null;
  });

  const [user, setUser] = useState(() => {
    try {
      return authTokens ? jwtDecode(authTokens.access) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true); // ✅ You missed this!

  const loginUser = (access, userInfo) => {
    localStorage.setItem("access_token", access);
    setAuthTokens((prev) => ({ ...prev, access }));
    setUser({
      user_id: userInfo.id,
      is_supervisor: userInfo.is_supervisor,
      is_student: userInfo.is_student,
    });
  };

  const logoutUser = () => {
    localStorage.removeItem("access_token");
    setAuthTokens(null);
    setUser(null);
  };

  useEffect(() => {
    if (authTokens?.access) {
      try {
        const decoded = jwtDecode(authTokens.access);
        setUser({
          user_id: decoded.user_id,
          is_supervisor: decoded.is_supervisor,
          is_student: decoded.is_student,
        });
      } catch (e) {
        logoutUser();
      }
    }
    setLoading(false); // ✅ This is now defined
  }, [authTokens]);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, authTokens, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
