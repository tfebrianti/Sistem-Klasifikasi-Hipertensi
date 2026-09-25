import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import ClassificationPage from '../pages/ClassificationPage';
import HistoryPage from '../pages/HistoryPage';
import PatientsPage from '../pages/PatientsPage';
import SettingsPage from '../pages/SettingsPage';
import EvaluationPage from '../pages/EvaluationPage';
import NotFoundPage from '../pages/NotFoundPage';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../layouts/ProtectedRoute';

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'sistem-klasifikasi',
        element: <ClassificationPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
      {
        path: 'patients',
        element: <PatientsPage />,
      },
      {
        path: 'evaluasi',
        element: <EvaluationPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
