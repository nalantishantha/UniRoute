import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ChatProvider } from "../context/ChatContext";

// Import Student components from the pages/Student directory
import StudentHome from "../pages/Student/StudentHome";
import StudentDashboard from "../pages/Student/StudentDashboard";
import FindMentors from "../pages/Student/FindMentors";
import MentorConnection from "../pages/Student/MentorConnection";
import FindTutors from "../pages/Student/FindTutors";
import TutorBooking from "../pages/Student/TutorBooking";
import NewsFeed from "../pages/Student/NewsFeed";
import ProfilePage from "../pages/Student/ProfilePage";
import EditProfile from "../pages/Student/EditProfile";
import SettingsPage from "../pages/Student/SettingsPage";
import ProfileSetup from "../pages/Student/ProfileSetup";
import ZScoreAnalysis from "../pages/Student/ZScoreAnalysis";
import ProgramMatching from "../pages/Student/ProgramMatching";
import UniversityGuide from "../pages/Student/UniversityGuide";
import CareerCounseling from "../pages/Student/CareerCounseling";
import BookCounselingService from "../pages/Student/BookCounselingService";
import BookCounselorSession from "../pages/Student/BookCounselorSession";
import ScholarshipInfo from "../pages/Student/ScholarshipInfo";
import SuccessStories from "../pages/Student/SuccessStories";

const StudentRoutes = () => {
  return (
    <ChatProvider>
      <Routes>
        {/* Student Home - Landing page for students */}
        <Route path="/home" element={<StudentHome />} />

        {/* Student Dashboard */}
        <Route path="/dashboard" element={<StudentDashboard />} />

        {/* Profile Management */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />

        {/* Academic Services */}
        <Route path="/z-score-analysis" element={<ZScoreAnalysis />} />
        <Route path="/program-matching" element={<ProgramMatching />} />
        <Route path="/university-guide" element={<UniversityGuide />} />

        {/* Support Services */}
        <Route path="/mentors" element={<FindMentors />} />
        <Route path="/mentor-connection" element={<MentorConnection />} />
        <Route path="/tutors" element={<FindTutors />} />
        <Route path="/tutor-booking" element={<TutorBooking />} />
        <Route path="/career-counseling" element={<CareerCounseling />} />
        <Route path="/counseling" element={<CareerCounseling />} />
        <Route
          path="/book-counseling-service/:serviceId"
          element={<BookCounselingService />}
        />
        <Route
          path="/book-counselor-session/:counselorId"
          element={<BookCounselorSession />}
        />

        {/* Information & Resources */}
        <Route path="/news" element={<NewsFeed />} />
        <Route path="/scholarship-info" element={<ScholarshipInfo />} />
        <Route path="/success-stories" element={<SuccessStories />} />

        {/* Redirect /student to /student/home */}
        <Route path="/" element={<Navigate to="/student/home" replace />} />
        <Route path="" element={<Navigate to="/student/home" replace />} />
      </Routes>
    </ChatProvider>
  );
};

export default StudentRoutes;
