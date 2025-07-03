import React from 'react';
import UniversityStudentNavbar from './UniversityStudentNavbar';

const UniversityStudentLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-primary-50">
      <UniversityStudentNavbar />
      <main className="pt-4">
        {children}
      </main>
    </div>
  );
};

export default UniversityStudentLayout;