import React from 'react';
import StudentNavbar from './StudentNavbar';

const StudentLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-primary-50">
      <StudentNavbar />
      <main className="pt-4">
        {children}
      </main>
    </div>
  );
};

export default StudentLayout;