import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initializeSessionGuard } from "./utils/auth";
import RouteGuard from "./components/common/RouteGuard";
import LandingPage from "./components/LandingPage";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import LoginPage from "./components/LoginPage";
import RoleSelectionPage from "./components/RoleSelectionPage";
import StudentRegisterPage from "./components/StudentRegisterPage";
import UniversityStudentRegisterPage from "./components/UniversityStudentRegisterPage";
import UniversityRegisterPage from "./components/UniversityRegisterPage";
import CompanyRegisterPage from "./components/CompanyRegisterPage";
import Universities from "./components/Universities";

// Test pages
import MentorAvailabilityTest from "./pages/Test/MentorAvailabilityTest";

// Video Call
import VideoCallPage from "./pages/VideoCall/VideoCallPage";

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
import CounsellorRoutes from "./routes/CounsellorRoutes";

function App() {
  useEffect(() => {
    // Initialize session guard to prevent back button access after logout
    initializeSessionGuard();
  }, []);

  return (
    <Router>
      <RouteGuard>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RoleSelectionPage />} />
          <Route path="/register/student" element={<StudentRegisterPage />} />
          <Route path="/register/university-student" element={<UniversityStudentRegisterPage />} />
          <Route path="/register/university" element={<UniversityRegisterPage />} />
          <Route path="/register/company" element={<CompanyRegisterPage />} />
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
          <Route path="/company/dashboard-edit" element={<Dashboard />} />
          <Route path="/company/course" element={<Courses />} />
          <Route path="/company/internship" element={<Internships />} />
          <Route path="/company/ad-publish" element={<AdPublish />} />

          {/* University Routes */}
          {universityRoutes.map((route, idx) => (
            <Route key={`uni-${idx}`} path={route.path} element={route.element} />
          ))}

          {/*Counsellor Routes */}
          <Route path="/counsellor/*" element={<CounsellorRoutes />} />

          {/* Video Call Route - Standalone for all user types */}
          <Route path="/video-call" element={<VideoCallPage />} />

          {/* Test Routes */}
          <Route path="/test/mentor-availability" element={<MentorAvailabilityTest />} />
        </Routes>
    </RouteGuard>
    </Router >
  );
}

export default App;