import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PreMentorLayout } from "../components/Navigation";

import {
  PreMentorDashboard,
  PreMentorProfile,
  PreMentorSettings,
} from "../pages/PreMentor";

const PreMentorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PreMentorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PreMentorDashboard />} />
        <Route path="profile" element={<PreMentorProfile />} />
        <Route path="settings" element={<PreMentorSettings />} />
      </Route>
    </Routes>
  );
};

export default PreMentorRoutes;