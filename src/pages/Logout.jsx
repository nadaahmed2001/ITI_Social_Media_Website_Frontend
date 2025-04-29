import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");

    // Optional: clear other user data (like user info)
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    // Redirect to login
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#1E1E1E]">
      <div className="text-center">
        <svg
          className="animate-spin  h-24 w-24  text-[#7B2326] mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
          Logging out...
        </p>
      </div>
    </div>
  );
}
