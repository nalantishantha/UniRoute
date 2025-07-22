import { Internship, AdPublish, Announcement, Announcementuser, Course, Courseuser, Internshipuser } from '../pages/Company';
import Dashboard from '../pages/Company/Dashboard'; // user dashboard
import Dashboardedit from '../pages/Company/Dashboardedit'; // admin dashboard

export const companyRoutes = [
  {
    path: '/company/dashboard',
    element: <Dashboard />, // USER dashboard
  },
  {
    path: '/company/dashboard-edit',
    element: <Dashboardedit />, // ADMIN dashboard
  },
  {
    path: '/company/internship',
    element: <Internship />,
  },
  {
    path: '/company/internshipuser',
    element: <Internshipuser />,
  },
  {
    path: '/company/ad-publish',
    element: <AdPublish />,
  },
  {
    path: '/company/announcement',
    element: <Announcement />,
  },
  {
    path: '/company/announcementuser',
    element: <Announcementuser />,
  },
  {
    path: '/company/course',
    element: <Course />,
  },
  {
    path: '/company/courseuser',
    element: <Courseuser />,
  }
];