import React from 'react';
import AppRouter from "./routes/AppRouter";
import NotificationDropdown from "./components/NotificationDropdown";
import { js } from '@eslint/js';
function App() {
  return (
    <>

      <AppRouter /> {/* Handles all routing */}
    </>
  );
}

export default App;

// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import PostForm from "./components/PostForm";
// import PostList from "./components/PostList";
// import NotificationDropdown from "./components/NotificationDropdown";
// import { js } from '@eslint/js';

// const App = () => {
//   return (
//     <Router>
//       <div>
//         <h1>Social App</h1>
//         {/* <NotificationDropdown /> */}
//         <PostForm />
//         <PostList />
//       </div>
//     </Router>
//   );
// };

// export default App;
