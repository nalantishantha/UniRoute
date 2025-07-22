import { Dashboard,Dashboarduser,AdPublish, AcademicContent,AcademicContentuser, Announcement,Announcementuser,Manageportfolio,Manageportfoliouser,Mentoruni } from '../pages/University';

export const universityRoutes = [
  {
    path: '/university/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/university/dashboarduser',
    element: <Dashboarduser />,
  },
  {
    path: '/university/ad-publish',
    element: <AdPublish />,
  },
  {
    path: '/university/academic-content',
    element: <AcademicContent />,
  },
  {
    path: '/university/academic-content-user',
    element: <AcademicContentuser />,
  },
  {
    path: '/university/announcement',
    element: <Announcement />,
  },
  {
    path: '/university/announcement-user',
    element: <Announcementuser />,
  },
  {
    path: '/university/manage-portfolio',
    element: <Manageportfolio />,
  },
  {
    path: '/university/manage-portfolio-user',
    element: <Manageportfoliouser />,
  },
  {
    path: '/university/mentoruni',
    element: <Mentoruni />,
  }
];