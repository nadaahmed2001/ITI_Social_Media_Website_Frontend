import React, {useState} from 'react';
import AppRouter from "./routes/AppRouter";
import NotificationDropdown from "./components/NotificationDropdown";
import { js } from '@eslint/js';
import { UserProvider } from './context/UserContext';


function App() {
  const [user, setUser] = useState(null); 

  return (
    <>
      <UserProvider user={user}>
        <AppRouter /> {/* Handles all routing */}
      </UserProvider>

    </>
  );
}

export default App;
