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

  // State for dropdowns if using controlled MUI Selects
  const [branch, setBranch] = React.useState('all');
  const [category, setCategory] = React.useState('all');

  const handleBranchChange = (event) => {
    setBranch(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };



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

    
      <div className="p-6 rounded-xl bg-gradient-to-br from-white to-[#fafafa] hover:shadow-md transition-shadow duration-300"> 
        <Typography variant="h6" className="!text-center !font-bold !text-[#7a2226] !mb-6 !text-xl">
          Filter Options
        </Typography>

        {/* Branch Dropdown - Using MUI Select */}
        <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
           {/* Optional Label */}
           {/* <InputLabel id="branch-select-label" sx={{color: '#a0a0a0'}}>Branch</InputLabel> */}
           <Select
            labelId="branch-select-label"
            id="branch-select"
            value={branch}
            onChange={handleBranchChange}
            // label="Branch" // Uncomment if using InputLabel
            displayEmpty // Allows showing placeholder text
            sx={{
              '& .MuiSelect-select': {
                py: 1.5,
                borderRadius: '12px',
                background: 'rgba(122, 34, 38, 0.05)',
                border: '1px solid rgba(122, 34, 38, 0.1)',
                color: '#2d3748',
                '&:hover': {
                  borderColor: '#7a2226'
                }
              },
              '& .MuiSvgIcon-root': {
                color: '#7a2226'
              }
            }}
            MenuProps={{ // Style the dropdown menu
                PaperProps: {
                  sx: {
                    background: '#ffffff',
              borderRadius: '12px',
              marginTop: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              '& .MuiMenuItem-root': {
                color: '#2d3748',
                '&:hover': {
                  background: 'rgba(122, 34, 38, 0.05)'
                }
              }
                  },
                },
              }}
          >
          
            <MenuItem disabled value="all" sx={{ fontStyle: 'italic', color: '#a0a0a0' }}>
              Branch :
            </MenuItem>
            {/* Replace with actual branch options */}
            <MenuItem value="branch1">Branch 1</MenuItem>
            <MenuItem value="branch2">Branch 2</MenuItem>
          </Select>
        </FormControl>

        {/* Category Dropdown - Using MUI Select */}
        <FormControl fullWidth variant="outlined" size="small">
          {/* <InputLabel id="category-select-label" sx={{color: '#a0a0a0'}}>Category</InputLabel> */}
          <Select
            labelId="category-select-label"
            id="category-select"
            value={category}
            onChange={handleCategoryChange}
            // label="Category"
            displayEmpty
            sx={{
                color: 'white',
                borderRadius: '8px',
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#666',
                },
                 '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#888',
                },
                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#7a2226',
                },
                 '& .MuiSvgIcon-root': {
                    color: '#a0a0a0',
                },
                 '.MuiSelect-select': {
                    backgroundColor: 'rgba(24, 25, 25, 0.5)',
                }
            }}
             MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#333',
                    color: 'white',
                  },
                },
              }}
          >
             <MenuItem disabled value="all" sx={{ fontStyle: 'italic', color: '#a0a0a0' }}>
              Category :
            </MenuItem>
             {/* Replace with actual category options */}
            <MenuItem value="category1">Category 1</MenuItem>
            <MenuItem value="category2">Category 2</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto pt-4"> {/* Push buttons towards bottom if container has flex-col */}
        {/* Search Button - Example secondary style */}
        <div className="flex gap-4 mt-6">
         <Button
            fullWidth
            variant="contained" // Or outlined
            sx={{
              background: 'rgba(122, 34, 38, 0.9)',
              color: 'white',
              '&:hover': {
                background: 'rgba(122, 34, 38, 1)',
                transform: 'translateY(-2px)'
              },
               flex: 1,
          py: 1.5,
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease'
            }}
            // onClick={handleSearch} // Add relevant handler
        >
            Search
        </Button>
        {/* Clear Button - Example tertiary/danger style */}
        <Button
            fullWidth
            variant="outlined" // Or contained with red bg
            sx={{
              borderColor: '#e2e8f0',
              color: '#718096',
              '&:hover': {
                borderColor: '#cbd5e0',
                background: 'rgba(203, 213, 224, 0.05)'
              },
              flex: 1,
              py: 1.5,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
            // onClick={handleClear} // Add relevant handler
        >
            Clear
        </Button>
      </div>
    </div>
    </div>
  );
}