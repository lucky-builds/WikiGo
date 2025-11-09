// Admin Route Protection Component

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';
import { ThemeProvider } from '@/contexts/ThemeContext';

export function AdminRoute() {
  const { secret } = useParams();
  const adminSecret = import.meta.env.VITE_ADMIN_SECRET;

  // Check if secret matches
  if (!adminSecret || secret !== adminSecret) {
    // Redirect to home page if secret doesn't match
    return <Navigate to="/" replace />;
  }

  // Render admin dashboard if secret matches
  return (
    <ThemeProvider>
      <AdminDashboard />
    </ThemeProvider>
  );
}

