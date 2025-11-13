import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CounsellorLayout } from "../components/Navigation";

import {
  Dashboard,
  Mentoring,
  Profile,
} from "../pages/Counsellor";
import { CounsellorCalendarPage } from "../pages/Counsellor/Calendar";
import CounsellorSettings from "../pages/Counsellor/Settings/CounsellorSettings";


const CounsellorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CounsellorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="mentoring" element={<Mentoring />} />
        <Route path="calendar" element={<CounsellorCalendarPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<CounsellorSettings />} />
      </Route>
    </Routes>
  );
};

export default CounsellorRoutes;

