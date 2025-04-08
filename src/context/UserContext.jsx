// src/context/UserContext.jsx (Simplified and Corrected)
import React, { createContext, useContext, useMemo } from 'react';
// Removed axios import - fetching happens in App.js

// 1. Create Context
const UserContext = createContext(undefined); // Initialize with undefined

// 2. Create Provider Component
// It receives the fetched user data via the 'user' prop from App.js
export const UserProvider = ({ children, user }) => {
    // useMemo prevents recalculating value unless user prop changes
    const value = useMemo(() => ({ currentUser: user }), [user]);
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// 3. Create and Export Custom Hook
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        // This error means you forgot to wrap a component with UserProvider
        throw new Error('useUser must be used within a UserProvider');
    }
    return context; // Returns the value object: { currentUser: user }
};

// --- NO default export ---