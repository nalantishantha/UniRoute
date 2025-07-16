import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Universities from "./components/Universities";

// Layouts
import { StudentLayout, UniversityStudentLayout } from "./components/Navigation";

// Company pages
import Dashboard from "./pages/Company/Dashboard";
import Courses from "./pages/Company/Course";
import Internships from "./pages/Company/Internship";
import AdPublish from "./pages/Company/AdPublish";

// Route groups
import AdminRoutes from "./routes/AdminRoutes";
import UniStudentRoutes from "./routes/UniStudentRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import { companyRoutes } from "./routes/CompanyRoutes";
import { universityRoutes } from "./routes/UniversityRoutes";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/universities" element={<Universities />} />

        {/* Student Routes */}
        <Route path="/student/*" element={<StudentRoutes />} />

        {/* University Student Routes */}
        <Route path="/university-student/*" element={<UniStudentRoutes />} />
        <Route path="/unistudent/*" element={<UniStudentRoutes />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Company Routes */}
        {companyRoutes.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element} />
        ))}
        <Route path="/company/dashboard" element={<Dashboard />} />
        <Route path="/company/course" element={<Courses />} />
        <Route path="/company/internship" element={<Internships />} />
        <Route path="/company/ad-publish" element={<AdPublish />} />

        {/* University Routes */}
        {universityRoutes.map((route, idx) => (
          <Route key={`uni-${idx}`} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;