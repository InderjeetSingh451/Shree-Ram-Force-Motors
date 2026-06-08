import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Intro from "./pages/Intro";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import StaffList from "./pages/StaffList";
import StaffProfile from "./pages/StaffProfile";
import NewWork from "./pages/NewWork";
import WorkDone from "./pages/WorkDone";
import Contact from "./pages/Contact";

function App() {
  return (
    <AuthProvider>
      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: "#212529",
          border: "1px solid #343a40",
          color: "#e9ecef",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
        }}
      />

      <Routes>
        {/* Splash / Intro */}
        <Route path="/" element={<Intro />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes — wrapped in Layout (Navbar + main) */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/staff" element={<StaffList />} />
          <Route path="/staff/:id" element={<StaffProfile />} />
          <Route path="/new-work" element={<NewWork />} />
          <Route path="/work-done" element={<WorkDone />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
