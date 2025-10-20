import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Import only what exists
import AdminDashboard from '../pages/Admin/AdminDashboard';
import { UsersList, UserForm, UserView } from '../pages/Admin/Users';
import { StudentsList, StudentForm, StudentView } from '../pages/Admin/Students';
import { UniversityStudentsList, UniversityStudentsForm, UniversityStudentsView } from '../pages/Admin/UniversityStudents';
import { MentorsList, MentorForm, MentorView } from '../pages/Admin/Mentors';
import { TutorsList, TutorForm, TutorView } from '../pages/Admin/Tutors';
import { UniversitiesList, UniversityForm, UniversityView } from '../pages/Admin/Universities';
import { CompaniesList, CompanyForm, CompanyView } from '../pages/Admin/Companies';
import { ProgramsList, ProgramForm, ProgramView } from '../pages/Admin/Programs';
import { JobList, JobDetails, JobForm } from '../pages/Admin/Jobs';
import { EventsList, EventView, EventForm } from '../pages/Admin/Events';
import { Reports, ReportDetails } from '../pages/Admin/Reports'
import { AdminSettings } from '../pages/Admin';
import { RequestsList, RequestDetails } from '../pages/Admin/Requests';
import AdvertisementRequests from '../pages/Admin/Requests/AdvertisementRequests';
import UniversityRequests from '../pages/Admin/Requests/UniversityRequests';
import CompanyRequests from '../pages/Admin/Requests/CompanyRequests';

const AdminRoutes = () => {
  return (
    <ProtectedRoute requiredUserType="admin">
      <Routes>
        {/* Admin Dashboard */}
        <Route path="/dashboard" element={<AdminDashboard />} />
        
        {/* Users Management */}
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/new" element={<UserForm />} />              
        <Route path="/users/:id" element={<UserView />} />              
        <Route path="/users/:id/edit" element={<UserForm />} />         
        
        {/* Students Management */}
        <Route path="/students" element={<StudentsList />} />
        <Route path="/students/new" element={<StudentForm />} />
        <Route path="/students/:id" element={<StudentView />} />
        <Route path="/students/:id/edit" element={<StudentForm />} /> 

        {/* University Students Management */}
        <Route path="/university-students" element={<UniversityStudentsList />} />
        <Route path="/university-students/new" element={<UniversityStudentsForm />} />
        <Route path="/university-students/:id" element={<UniversityStudentsView />} />
        <Route path="/university-students/:id/edit" element={<UniversityStudentsForm />} />

        {/* Mentors Management */}
        <Route path="/mentors" element={<MentorsList />} />
        <Route path="/mentors/new" element={<MentorForm />} />
        <Route path="/mentors/:id" element={<MentorView />} />
        <Route path="/mentors/:id/edit" element={<MentorForm />} />

        {/* Tutors Management */}
        <Route path="/tutors" element={<TutorsList />} />
        <Route path="/tutors/new" element={<TutorForm />} />
        <Route path="/tutors/:id" element={<TutorView />} />
        <Route path="/tutors/:id/edit" element={<TutorForm />} />

        {/* Universities Management */}
        <Route path="/universities" element={<UniversitiesList />} />
        <Route path="/universities/new" element={<UniversityForm />} />
        <Route path="/universities/:id" element={<UniversityView />} />
        <Route path="/universities/:id/edit" element={<UniversityForm />} />

        {/* Companies Management */}
        <Route path="/companies" element={<CompaniesList />} />
        <Route path="/companies/new" element={<CompanyForm />} />
        <Route path="/companies/:id" element={<CompanyView />} />
        <Route path="/companies/:id/edit" element={<CompanyForm />} />

        {/* Programs Management */}
        <Route path="/programs" element={<ProgramsList />} />
        <Route path="/programs/new" element={<ProgramForm />} />
        <Route path="/programs/:id" element={<ProgramView />} />
        <Route path="/programs/:id/edit" element={<ProgramForm />} />

        {/* Jobs Management */}
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/create" element={<JobForm />} />
        <Route path="/jobs/:jobId/edit" element={<JobForm />} />
        <Route path="/jobs/:jobId/view" element={<JobDetails />} />

        {/* Events Management */}
        <Route path="/events" element={<EventsList />} />
        <Route path="/events/new" element={<EventForm />} />
        <Route path="/events/:id" element={<EventView />} />
        <Route path="/events/:id/edit" element={<EventForm />} />

        {/* Requests Management */}
        <Route path="/requests" element={<RequestsList />} />
        <Route path="/requests/advertisements" element={<AdvertisementRequests />} />
        <Route path="/requests/universities" element={<UniversityRequests />} />
        <Route path="/requests/companies" element={<CompanyRequests />} />
        <Route path="/requests/advertisement/:requestId" element={<RequestDetails />} />

        {/* Report Management */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/:reportId" element={<ReportDetails />} />

        {/* Settings */}
        <Route path="/settings" element={< AdminSettings />} />
        
        {/* Redirect /admin to /admin/dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default AdminRoutes;
