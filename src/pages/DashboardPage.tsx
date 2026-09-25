import React from 'react';
import PuskesmasCard from '../features/dashboard/components/PuskesmasCard';
import StatsCards from '../features/dashboard/components/StatsCards';
import BPTrendChart from '../features/charts/components/BPTrendChart';
import DiagnosisDonut from '../features/charts/components/DiagnosisDonut';
import AgeDistributionChart from '../features/charts/components/AgeDistributionChart';
import PatientSummaryCard from '../features/dashboard/components/PatientSummaryCard';
import ModelPerformanceTable from '../features/dashboard/components/ModelPerformanceTable';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-3 animate-fadeIn select-none pb-12">
      {/* Puskesmas Profile Banner */}
      <PuskesmasCard />

      {/* SECTION 1: METRICS OVERVIEW */}
      <StatsCards />

      {/* SECTION 2: ADVANCED DATA VISUALIZERS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-4">
        <BPTrendChart />
        <DiagnosisDonut />
      </section>

      {/* SECTION 3: DEMOGRAPHICS & CLINICAL SUMMARIES */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-4">
        <AgeDistributionChart />
        <PatientSummaryCard />
      </section>

      {/* SECTION 4: ML MODEL PERFORMANCE BENCHMARKS */}
      <ModelPerformanceTable />
    </div>
  );
}
