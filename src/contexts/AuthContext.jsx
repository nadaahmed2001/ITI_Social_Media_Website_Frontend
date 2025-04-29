// //AuthContext
// import { createContext, useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authTokens, setAuthTokens] = useState(() =>
//     localStorage.getItem("access_token") || null
//   );

//   const [user, setUser] = useState(() =>
//     authTokens ? jwtDecode(authTokens) : null
//   );
//   const [loading, setLoading] = useState(true); // 

//   const loginUser = (token) => {
//     localStorage.setItem("access_token", token);
//     setAuthTokens(token);
//     setUser(jwtDecode(token));
//     console.log("User logged in:", jwtDecode(token)); // Log the user object to the console
//   };

//   const logoutUser = () => {
//     localStorage.removeItem("access_token");
//     setAuthTokens(null);
//     setUser(null);
//   };

//   useEffect(() => {
//     if (authTokens) {
//       try {
//         const decoded = jwtDecode(authTokens);
//         setUser(decoded);
//       } catch (e) {
//         console.log(e)
//         logoutUser();
//       }
//     }
//     setLoading(false); //  Done loading
//   }, [authTokens]);

//   return (
//     <AuthContext.Provider value={{ user, loginUser, logoutUser, authTokens, loading }}>
//       {!loading && children} {/*  Only render children when ready */}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;


import { createContext, useEffect, useState } from "react";
import { getAccount } from "../services/api"; // Adjust path if needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("access_token") || null
  );
  // Initialize user state to null, will be populated by API call
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  const loginUser = (token) => {
    localStorage.setItem("access_token", token);
    setAuthTokens(token);
  };

  const logoutUser = () => {
    localStorage.removeItem("access_token");
    setAuthTokens(null);
    setUser(null);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      // Only attempt fetch if there's a token
      if (authTokens) {
        try {
          // 2. Call getAccount() API to fetch full user details
          const response = await getAccount(); 
          setUser(response.data); // 3. Set user state with the FULL data from API
          // console.log("Full user data set in AuthContext:", response.data);
        } catch (error) {
          // This likely means the token is invalid/expired OR API failed
          console.error("Failed to fetch user account data:", error);
          logoutUser(); // Log out if fetching fails
        } finally {
          setLoading(false); // Finished loading attempt
        }
      } else {
        // No token exists, ensure user is null and finish loading
        setUser(null); 
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [authTokens]); // Re-run this effect when authTokens change (login/logout)

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, authTokens, loading }}>
      {children} 
    </AuthContext.Provider>
  );
};

export default AuthContext;