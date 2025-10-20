import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PreMentorLayout } from "../components/Navigation";

import {
  PreMentorDashboard,
  PreMentorProfile,
  PreMentorSettings,
} from "../pages/PreMentor";
import PreMentorInternshipOpportunities from "../pages/PreMentor/InternshipOpportunities/PreMentorInternshipOpportunities";
import { Tutoring } from "../pages/PreMentor/Tutoring";
import { Earnings } from "../pages/PreMentor/Earnings";
import { CalendarPage } from "../pages/PreMentor/Calendar";

const PreMentorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PreMentorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PreMentorDashboard />} />
        <Route
          path="internships"
          element={<PreMentorInternshipOpportunities />}
        />
        <Route path="profile" element={<PreMentorProfile />} />
        <Route path="settings" element={<PreMentorSettings />} />
        <Route path="tutoring" element={<Tutoring />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="calendar" element={<CalendarPage />} />
      </Route>
    </Routes>
  );
};

export default PreMentorRoutes;
