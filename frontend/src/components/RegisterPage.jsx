import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to role selection page
    navigate('/register', { replace: true });
  }, [navigate]);

  return null; // This component will redirect, so no UI needed
};

export default RegisterPage;