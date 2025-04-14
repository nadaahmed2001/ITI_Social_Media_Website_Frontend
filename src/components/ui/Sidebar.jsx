// import React from "react";

// export default function Sidebar({ isDarkMode }) {
//   return (
//     <div
//       className={
//         isDarkMode
//           ? "w-120 bg-gray-1000 text-white rounded-2xl"
//           : "w-120 bg-gray-300 text-gray-200 rounded-2xl"
//       }
//     >
//       {/* First Section (Personal Information) */}
//       <div className="mb-6">
//         <div
//           className={
//             isDarkMode
//               ? "p-4 rounded-2xl bg-[#333] text-center"
//               : "p-4 rounded-2xl bg-[#f9f9f9] text-center"
//           }
//         >
//           {/* Image and Followers / Following */}
//           <div className="flex justify-center items-center mb-4">
//             <div className="flex-1 text-center">
//               <p
//                 className={
//                   isDarkMode ? "text-sm text-white" : "text-sm text-black"
//                 }
//               >
//                 Followers
//               </p>
//               <p
//                 className={
//                   isDarkMode ? "font-bold text-white" : "font-bold text-black"
//                 }
//               >
//                 120
//               </p>
//             </div>
//             <img
//               src="https://via.placeholder.com/100"
//               alt="Profile"
//               className="rounded-full w-24 h-24 object-cover mx-4"
//             />
//             <div className="flex-1 text-center">
//               <p
//                 className={
//                   isDarkMode ? "text-sm text-white" : "text-sm text-black"
//                 }
//               >
//                 Following
//               </p>
//               <p
//                 className={
//                   isDarkMode ? "font-bold text-white" : "font-bold text-black"
//                 }
//               >
//                 80
//               </p>
//             </div>
//           </div>

//           {/* Name and Role */}
//           <p
//             className={
//               isDarkMode
//                 ? "text-xl font-semibold text-white mb-2"
//                 : "text-xl font-semibold text-black mb-2"
//             }
//           >
//             John Doe
//           </p>
//           <p
//             className={
//               isDarkMode
//                 ? "text-sm text-gray-400 mb-4"
//                 : "text-sm text-black mb-4"
//             }
//           >
//             Problem: Full Stack Developer
//           </p>

//           {/* Profile Button */}
//           <button
//             className={
//               isDarkMode
//                 ? "block mb-2 mx-auto w-full p-2 rounded-full bg-[#666] text-white hover:bg-gray-700 transition-colors"
//                 : "block mb-2 mx-auto w-full p-2 rounded-full bg-[#f1f1f1] text-black hover:bg-gray-200 transition-colors"
//             }
//             style={
//               isDarkMode
//                 ? { background: "linear-gradient(to bottom, #666, #444)" }
//                 : { background: "linear-gradient(to bottom, #666, #999)" }
//             }
//             onClick={() => (window.location.href = "/profile")}
//           >
//             Profile
//           </button>
//         </div>
//       </div>

//       {/* Second Section (Filter Section) */}
//       <div className="mb-6">
//         <div
//           className={
//             isDarkMode
//               ? "p-4 rounded-2xl bg-[#333]"
//               : "p-4 rounded-2xl bg-[#f9f9f9]"
//           }
//         >
//           <h3
//             className={
//               isDarkMode
//                 ? "text-center font-semibold text-white mb-4"
//                 : "text-center font-semibold text-black mb-4"
//             }
//           >
//             Filter
//           </h3>

//           {/* Branch Dropdown */}
//           <select
//             className="w-full p-3 rounded-2xl text-white focus:outline-none mb-4 cursor-pointer hover:text-yellow-500 transition-colors"
//             style={{
//               background: isDarkMode
//                 ? "linear-gradient(to bottom, #666, #444)"
//                 : "linear-gradient(to bottom, #666, #999)",
//             }}
//           >
//             <option
//               className="hover:text-yellow-500 transition-colors text-black"
//               value="all"
//             >
//               Branch :
//             </option>
//             <option className="text-black" value="branch1">
//               Branch 1
//             </option>
//             <option className="text-black" value="branch2">
//               Branch 2
//             </option>
//           </select>

//           {/* Category Dropdown */}
//           <select
//             className="w-full p-3 rounded-2xl text-white focus:outline-none"
//             style={{
//               background: isDarkMode
//                 ? "linear-gradient(to bottom, #666, #444)"
//                 : "linear-gradient(to bottom, #666, #999)",
//             }}
//           >
//             <option
//               className="hover:text-yellow-300 transition-colors text-black"
//               value="all"
//             >
//               Category :
//             </option>
//             <option className="text-black" value="category1">
//               Category 1
//             </option>
//             <option className="text-black" value="category2">
//               Category 2
//             </option>
//           </select>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-3">
//         <button className="flex-1 rounded-full bg-[#7B2326] text-black p-2 hover:bg-yellow-500">
//           Search
//         </button>
//         <button className="flex-1 rounded-full bg-red-600 text-white p-2 hover:bg-gray-700">
//           Clear
//         </button>
//       </div>
//     </div>
//   );
// }


import React, {useContext} from "react";
// Import MUI components if you want to use them for consistency
import { Button, Select, MenuItem, Typography, InputLabel, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AuthContext from '../../contexts/AuthContext'; // *** IMPORT AuthContext (Adjust path if needed) ***


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

  // Placeholder data - replace with actual user data from context or props
  const userData = {
    followers: 120,
    following: 80,
    profilePicture: DEFAULT_USER_AVATAR,
    name: "John Doe",
    role: "Full Stack Developer" // Removed "Problem:" prefix
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
    // Apply similar container styling from ChatSidebar
    // Adjusted width (e.g., w-72), height (e.g., h-full or fit content), removed dark mode conditions
    <div className="w-80 text-[#e0e0e0] h-full p-4 mt-4 rounded-lg border border-[#7a2226] bg-[rgba(50,50,50,0.42)] backdrop-blur-sm flex flex-col gap-6">

      {/* First Section (Personal Information) */}
      {/* Use consistent padding/rounding, remove conditional background */}
      <div className="p-4 rounded-lg bg-[rgba(60,60,60,0.5)]"> {/* Slightly different bg for section */}
        {/* Image and Followers / Following */}
        <div className="flex justify-around items-center mb-4 text-center">
          <div className="flex-1">
            <Typography variant="body2" className="!text-sm !text-gray-300">
              Followers
            </Typography>
            <Typography variant="subtitle1" className="!font-bold !text-white">
              {/* Placeholder - follower count likely needs separate fetch/prop */}
              {user?.follower_count || 0}
            </Typography>
          </div>
          <img
            // *** Use user's profile picture from context ***
            src={user?.profile_picture || DEFAULT_USER_AVATAR}
            alt="Profile"
            className="rounded-full w-20 h-20 object-cover mx-2 border-2 border-[#7a2226]"
            onError={(e) => { e.target.src = DEFAULT_USER_AVATAR; }}
          />
          <div className="flex-1">
            <Typography variant="body2" className="!text-sm !text-gray-300">
              Following
            </Typography>
            <Typography variant="subtitle1" className="!font-bold !text-white">
               {/* Placeholder - following count likely needs separate fetch/prop */}
              {user?.following_count || 0}
            </Typography>
          </div>
        </div>

        {/* Name and Role */}
        <Typography variant="h6" className="!text-xl !font-semibold !text-white !text-center !mb-1">
          {/* *** Use user's name from context *** */}
          {user?.username || 'Guest User'}
        </Typography>
        <Typography variant="body2" className="!text-sm !text-gray-400 !text-center !mb-4">
          {/* *** Use user's role/title from context (adjust field name if needed) *** */}
          { user.is_student? 
          ("Student") : ("Supervisor") 
          
          }
          {/* {user?.role || 'No role specified'} */}
        </Typography>

        <Typography variant="body2" className="!text-sm !text-gray-400 !text-center !mb-4">
          {/* *** Use user's role/title from context (adjust field name if needed) *** */}
          Joined: {user?.created_at || "October 2025"}
        </Typography>

        


        {/* Profile Button - Styled like AI Chat button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: '#7a2226', // Primary action color
            color: 'white',
            '&:hover': { backgroundColor: '#5a181b' }, // Darker hover
            borderRadius: '20px', // Consistent rounding
            textTransform: 'none', // Consistent text transform
            py: 0.8 // Adjusted padding
          }}
          onClick={() => navigate('/profile')} // Use navigate for internal links
        >
          Profile
        </Button>
      </div>

      {/* Second Section (Filter Section) */}
      <div className="p-4 rounded-lg bg-[rgba(60,60,60,0.5)]"> {/* Section background */}
        <Typography variant="subtitle1" className="!text-center !font-semibold !text-white !mb-4">
          Filter
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
                color: 'white',
                borderRadius: '8px', // Consistent rounding
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#666', // Border color
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#888',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#7a2226', // Accent color on focus
                },
                '& .MuiSvgIcon-root': { // Icon color
                    color: '#a0a0a0',
                },
                '.MuiSelect-select': {
                    // Background matches ChatSidebar TextField, adjust if needed
                    backgroundColor: 'rgba(24, 25, 25, 0.5)', // Darker input background
                }
            }}
            MenuProps={{ // Style the dropdown menu
                PaperProps: {
                  sx: {
                    backgroundColor: '#333', // Dark menu background
                    color: 'white',
                  },
                },
              }}
          >
            {/* Placeholder Item */}
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
         <Button
            fullWidth
            variant="contained" // Or outlined
            sx={{
                backgroundColor: '#4a4a4a', // Secondary color
                color: 'white',
                '&:hover': { backgroundColor: '#5a5a5a' },
                borderRadius: '20px',
                textTransform: 'none',
                py: 0.8
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
                borderColor: '#6c757d', // Gray border
                color: '#adb5bd', // Gray text
                '&:hover': {
                    backgroundColor: 'rgba(108, 117, 125, 0.1)', // Subtle hover
                    borderColor: '#adb5bd'
                 },
                borderRadius: '20px',
                textTransform: 'none',
                py: 0.8
            }}
            // onClick={handleClear} // Add relevant handler
        >
            Clear
        </Button>
      </div>
    </div>
  );
}