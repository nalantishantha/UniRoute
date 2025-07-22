import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CounsellorLayout } from "../components/Navigation";

import {
  Dashboard,
  Earnings,
  Feedback,
  Mentoring,
  Profile,
} from "../pages/Counsellor";
import { CalendarPage } from "../pages/UniStudents/Calendar";
import CounsellorSettings from "../pages/Counsellor/Settings/CounsellorSettings";


const CounsellorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CounsellorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="mentoring" element={<Mentoring />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="profile" element={<Profile />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="settings" element={<CounsellorSettings />} />
        {/* <Route
            path="mentoring/student-profile/:studentId"
            element={<StudentProfile />}
          /> */}
      </Route>
    </Routes>
  );
};

export default CounsellorRoutes;

