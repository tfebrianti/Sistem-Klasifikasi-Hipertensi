import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { usePatientStore } from '../stores/patientStore';
import { usePredictionStore } from '../stores/predictionStore';
import { useSettingsStore } from '../stores/settingsStore';

export default function DashboardLayout() {
  const fetchPatients = usePatientStore((state) => state.fetchPatients);
  const fetchRecords = usePredictionStore((state) => state.fetchRecords);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);

  useEffect(() => {
    fetchPatients();
    fetchRecords();
    fetchSettings();
  }, [fetchPatients, fetchRecords, fetchSettings]);
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Right Column Layout Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Main Application Header TopAppBar */}
        <Header />

        {/* Scrollable Main Content Frame */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#faf8ff] flex flex-col justify-start relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
