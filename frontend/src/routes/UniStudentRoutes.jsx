import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import only what exists
import { UniStudentDashboard } from '../pages/UniStudents/Dashboard';


const UniStudentRoutes = () => {
  return (
    <Routes>
      {/* University student Dashboard */}
      <Route path="/dashboard" element={<UniStudentDashboard />} />
    </Routes>
  );
};

export default UniStudentRoutes;
