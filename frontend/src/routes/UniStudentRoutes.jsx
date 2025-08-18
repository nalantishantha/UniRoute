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
  Meetings,
} from "../pages/UniStudents";
import { CalendarPage } from "../pages/UniStudents/Calendar";

import StudentProfile from "../pages/UniStudents/StudentProfile/StudentProfile";
import UniStudentSettings from "../pages/UniStudents/UniStudentSettings/UniStudentSettings";
import UploadVideosPage from "../pages/UniStudents/UploadVideosPage";

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
          <Route path="meetings" element={<Meetings />} />
          <Route path="tutoring" element={<Tutoring />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="profile" element={<Profile />} />
          <Route path="resources" element={<Resources />} />
          <Route path="upload-videos" element={<UploadVideosPage />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="settings" element={<UniStudentSettings />} />
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
