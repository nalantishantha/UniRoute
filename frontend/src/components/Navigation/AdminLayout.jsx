import React from 'react';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="pt-4">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;