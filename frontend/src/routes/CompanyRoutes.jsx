import { Dashboard,Dashboardedit, Internship, AdPublish,Announcement,Announcementuser,Course,Courseuser,Internshipuser } from '../pages/Company';

export const companyRoutes = [
  {
    path: '/company/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/company/dashboard-edit',
    element: <Dashboardedit />,
  },
  {
    path: '/company/internship',
    element: <Internship />,
  },
  {
    path: '/company/internship-user',
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
    path: '/company/announcement-user',
    element: <Announcementuser />,
  },
  {
    path: '/company/course',
    element: <Course />,
  },
  {
    path: '/company/course-user',
    element: <Courseuser />,
  }
  
];