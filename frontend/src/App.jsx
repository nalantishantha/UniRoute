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
<<<<<<< HEAD
import AdminRoutes from "./routes/AdminRoutes";
import UniStudentRoutes from "./routes/UniStudentRoutes";
=======
import AdminRoutes from './routes/AdminRoutes';
// import AdminRoutes from './routes/AdminRoutes';
// import AdminRoutes from './routes/AdminRoutes';
// import AdminRoutes from './routes/AdminRoutes';
// import AdminRoutes from './routes/AdminRoutes';
>>>>>>> 80de35d7b0e7a34b7e36b844b57c9f8c3b359328

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
        {/* Public Routes
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> */}

        {/* Uni student Routes */}
        {/* <Route path="/" element={
          <UniStudentLayout>
            <UniStudentDashboard />
          </UniStudentLayout>
        } /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          }
        />

        {/* University Student Routes */}
        {/* <Route
          path="/university-student/dashboard"
          element={
            <UniversityStudentLayout>
              <UniversityStudentDashboard />
            </UniversityStudentLayout>
          }
        /> */}

        <Route path="/university-student/*" element={<UniStudentRoutes />} />

        {/* Admin Routes - All admin routes handled by AdminRoutes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/*Uni Student Routes */}

        <Route path="/unistudent/*" element={<UniStudentRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
