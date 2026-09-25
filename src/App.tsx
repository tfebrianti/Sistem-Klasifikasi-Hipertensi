import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import GlobalDialogModal from './components/ui/GlobalDialogModal';

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <GlobalDialogModal />
    </>
  );
}
