import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UniversityStudentLayout } from "../components/Navigation";
import { ChatProvider } from "../context/ChatContext";

import {
  Dashboard,
  Earnings,
  Feedback,
  Mentoring,
  PreUniCourses,
  Profile,
  Resources,
  Tutoring,
} from "../pages/UniStudents";
import { CalendarPage } from "../pages/UniStudents/Calendar";

import StudentProfile from "../pages/UniStudents/StudentProfile/StudentProfile";

const UniStudentRoutes = () => {
  return (
    <ChatProvider>
      <Routes>
        <Route path="/" element={<UniversityStudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="mentoring" element={<Mentoring />} />
          <Route path="courses" element={<PreUniCourses />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="tutoring" element={<Tutoring />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="profile" element={<Profile />} />
          <Route path="resources" element={<Resources />} />
          <Route path="earnings" element={<Earnings />} />
          <Route
            path="mentoring/student-profile/:studentId"
            element={<StudentProfile />}
          />
        </Route>
      </Routes>
    </ChatProvider>
  );
};

export default UniStudentRoutes;
