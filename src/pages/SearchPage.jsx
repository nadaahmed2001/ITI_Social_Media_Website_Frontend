import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProfiles } from '../components/services/api'; // Adjust path as needed
import { Typography, CircularProgress, Alert, Avatar } from '@mui/material'; // Using MUI components for display

// Define default avatar path
const DEFAULT_USER_AVATAR = '../../src/assets/images/user-default.webp'; 

// Simple component to display each profile result
const ProfileSearchResult = ({ profile }) => (
  <Link
    to={`/profiles/${profile.id}`} // Link to the profile page
    className="flex items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-150 !no-underline w-full"
  >
    <Avatar
      src={profile.profile_picture || DEFAULT_USER_AVATAR}
      alt={profile.username}
      sx={{ width: 40, height: 40, mr: 2 }} // MUI Avatar styling
      imgProps={{ // Add onError directly to img props if needed via Avatar
          onError: (e) => { if (e.target.src !== DEFAULT_USER_AVATAR) e.target.src = DEFAULT_USER_AVATAR; }
      }}
    />
    <div>
      <Typography variant="subtitle1" className="!font-bold !text-black !text-xl">
        { profile.username || "Unknown user"}
      </Typography>
      {profile.role && ( // Display role if available
        <Typography variant="body2" className="!text-gray-400">
          {profile.role}
        </Typography>
      )}
    </div>
  </Link>
);


function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // Get the 'q' parameter from URL

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only search if there's a query parameter
    if (query && query.trim()) {
      const performSearch = async () => {
        setIsLoading(true);
        setError(null);
        setResults([]); // Clear previous results
        console.log(`Searching for profiles matching: "${query}"`);
        try {
          // Call the API function
          const data = await searchProfiles(query.trim());
          // Assuming the API returns an array of profile objects
          console.log("Search results received:", data);
          setResults(Array.isArray(data) ? data : []); // Ensure results is always an array
        } catch (err) {
          console.error("Search failed:", err);
          setError("Failed to load search results. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      performSearch();
    } else {
      // Clear results if query is empty or missing
      setResults([]);
      setIsLoading(false);
      setError(null);
    }
  }, [query]); // Re-run effect whenever the 'q' parameter changes

  return (
    // Basic layout - Adjust container/padding as needed for your app structure
    // Assuming Navbar might be present above this page
    <div className="container mx-auto px-4 py-8 pt-20 text-white"> {/* Added pt-20 for fixed navbar */}

      <Typography variant="h5" component="h1" className="!mb-6 ">
        {/* Display search term if available */}
        {query ? `Search Results for "${query}"` : "Search Profiles"}
      </Typography>

      {isLoading && (
        <div className="text-center py-10">
          <CircularProgress color="inherit" />
          <Typography className="!mt-2 ">Searching...</Typography>
        </div>
      )}

      {error && (
        <Alert severity="error" variant="filled" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!isLoading && !error && (
        <div>
          {/* Check if there was a query but no results */}
          {query && results.length === 0 ? (
            <Typography className="text-center text-gray-400 py-10">
              No profiles found matching "{query}".
            </Typography>
          ) : !query && results.length === 0 ? (
            <Typography className="text-center text-gray-400 py-10">
              Enter a query in the search bar above to find profiles.
            </Typography>
          ) : (
            // Display results in a list or grid
            <div className="space-y-3 max-w-2xl mx-auto !bg-[#ffffff0d] !rounded-lg"> {/* Example list layout */}
              {results.map((profile) => (
                // Render each profile using the helper component
                <ProfileSearchResult key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
