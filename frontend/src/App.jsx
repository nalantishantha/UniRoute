import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import {
  StudentLayout,
  UniversityStudentLayout,
} from "./components/Navigation";

// Import route components
import AdminRoutes from "./routes/AdminRoutes";
import StudentRoutes from "./routes/StudentRoutes";

// Test Dashboard Components
const StudentDashboard = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-primary-600 mb-4">
      Student Dashboard
    </h1>
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-primary-400">Welcome to your student dashboard!</p>
    </div>
  </div>
);

const UniversityStudentDashboard = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-primary-600 mb-4">
      University Student Dashboard
    </h1>
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-primary-400">
        Welcome to your university student dashboard!
      </p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Student Routes - All student routes handled by StudentRoutes */}
        <Route path="/student/*" element={<StudentRoutes />} />

        {/* University Student Routes */}
        <Route
          path="/university-student/dashboard"
          element={
            <UniversityStudentLayout>
              <UniversityStudentDashboard />
            </UniversityStudentLayout>
          }
        />

        {/* Admin Routes - All admin routes handled by AdminRoutes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
