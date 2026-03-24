import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Only use useContext inside a component!
function App() {
  const { user } = useContext(AuthContext); // ✅ inside component

  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />


        {/* Default Route */}
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;