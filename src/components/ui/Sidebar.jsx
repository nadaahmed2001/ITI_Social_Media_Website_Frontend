import React, {useContext} from "react";
import { Button, Select, MenuItem, Typography, InputLabel, FormControl } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AuthContext from '../../contexts/AuthContext'; // *** IMPORT AuthContext (Adjust path if needed) ***
import { motion } from 'framer-motion';

// Default avatar if needed
const DEFAULT_USER_AVATAR = '../../src/assets/images/user-default.webp';

export default function Sidebar() { // Removed isDarkMode prop


  const { user, loading: authLoading } = useContext(AuthContext); // Destructure user and loading state

// console.log(user)


  const navigate = useNavigate(); // Initialize navigate




  if (authLoading) {
    return (
        <div className="w-72 text-[#e0e0e0] h-full p-4 rounded-lg border border-[#7a2226] bg-[rgba(50,50,50,0.42)] backdrop-blur-sm flex justify-center items-center">
            <Typography sx={{ color: 'white' }}>Loading...</Typography>
            {/* Or use a CircularProgress component */}
        </div>
    );
}

  return (
    <div className="w-78 h-full p-6 rounded-lg border-2 border-[#7a2226]/20 bg-white/90 backdrop-blur-lg flex flex-col gap-6 shadow-xl shadow-[#7a2226]/10 hover:shadow-[#7a2226]/15 transition-all duration-300">
    <div className="p-6 rounded-xl bg-gradient-to-br from-white to-[#fafafa] hover:shadow-md transition-shadow duration-300">
    <div className="flex justify-around items-center mb-4 text-center">
          <div className="flex-1">
            <Link
                to={user.id ? `/profiles/${user.id}/followers` : '#'} // Link only if ID exists
                className="flex-1 no-underline text-center"
                style={{ textDecoration: 'none' }}
              >
                <Typography variant="caption" className="!text-sm !text-[#718096] !font-medium text-center">
                  Followers
                </Typography>
                
                <Typography variant="subtitle1" className="!font-bold !text-[#7B2227]">
                  {user.followers_count}
                </Typography>
            </Link>
          </div>
        
          <div className="relative group mx-2">
            <img
              // *** Use user's profile picture from context ***
              src={user?.profile_picture || DEFAULT_USER_AVATAR}
              alt="Profile"
              className="rounded-full w-18 h-18 object-cover border-3 border-[#7a2226]/10 hover:border-[#7a2226]/30 transition-all duration-300 shadow-sm "
              onError={(e) => { e.target.src = DEFAULT_USER_AVATAR; }}
            />
          </div>

          <div className="flex-1">
            <Link
                to={user.id ? `/profiles/${user.id}/following` : '#'} 
                className="flex-1 no-underline text-center"
                style={{ textDecoration: 'none' }}
              >
                <Typography variant="caption" className="!text-sm !text-[#718096] !font-medium text-center">
                  Following
                </Typography>

                <Typography variant="subtitle1" className="!font-bold !text-[#7B2227]">
                  {user.following_count}
                </Typography>
            </Link>
          </div>
      
      
      </div>

        {/* Name and Role */}
        <div className="space-y-2 mb-6">
          <Typography variant="h5" className="!text-2xl !font-bold !text-[#2d3748] !text-center">
            {user?.username || 'Guest User'}
          </Typography>
          <div className="flex items-center justify-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${user?.is_student ? 'bg-[#7a2226]' : 'bg-[#c53030]'} animate-pulse`} />
          <Typography variant="body2" className="!!text-sm !text-[#718096] !font-medium">
            { user.is_student? 
            ("Student") : ("Supervisor") 
            }
          </Typography>
        </div>
    </div>
        <Typography variant="body2" className="!text-sm !text-gray-400 !text-center !mb-4">
          Joined: {
            (() => {
              // Check if user.created exists
              if (!user?.created) {
                return "October 2024";
              }
              try {
                // Create a Date object from the string
                const date = new Date(user.created);

                // Check if the date object is valid
                if (isNaN(date.getTime())) {
                    console.warn("Invalid date format received for user.created:", user.created);
                    return "October 2024"; // Fallback for invalid date format
                }

                // Format the date to "Month Year" (e.g., "April 2025")
                // 'long' gives the full month name. Use 'short' for abbreviated (e.g., "Apr").
                return date.toLocaleDateString(undefined, { // 'undefined' uses the user's default locale
                  year: 'numeric',
                  month: 'long',
                });
              } catch (error) {
                // Fallback in case of any unexpected error during parsing/formatting
                console.error("Error formatting join date:", error);
                return "October 2024";
              }
            })() // Immediately invoke the function expression
          }
        </Typography>
        
        {/* Profile Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #7a2226 0%, #a53d3d 100%)',
            color: 'white',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 5px 15px rgba(122, 34, 38, 0.2)'
            },
            borderRadius: '12px',
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onClick={() => navigate('/profile')} 
        >
          View Profile
        </Button>
      </div>

    
    </div>
  );
}