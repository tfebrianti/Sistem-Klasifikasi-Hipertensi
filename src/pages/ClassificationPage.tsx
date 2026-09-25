import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ClinicalForm from '../features/prediction/components/ClinicalForm';
import PredictionResult from '../features/prediction/components/PredictionResult';
import { usePrediction } from '../features/prediction/hooks/usePrediction';

export default function ClassificationPage() {
  const {
    usia,
    setUsia,
    gender,
    setGender,
    berat,
    setBerat,
    tinggi,
    setTinggi,
    sistolik,
    setSistolik,
    diastolik,
    setDiastolik,
    bmi,
    
    patientType,
    selectedPatientId,
    patientName,
    isSaved,
    setPatientType,
    setSelectedPatientId,
    setPatientName,
    selectRegisteredPatient,

    currentResult,
    currentConfidence,
    accuracyDT,
    accuracyRF,
    isClassifying,
    handleClassify,
    handleSaveNewPatient,
    handleReset,
  } = usePrediction();

  const location = useLocation();
  const navigate = useNavigate();
  const importedPatient = location.state?.patient;
  const handledPatientIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (importedPatient) {
      if (handledPatientIdRef.current !== importedPatient.id) {
        handledPatientIdRef.current = importedPatient.id;
        selectRegisteredPatient(importedPatient);
        // Clear router state via React Router so reloads or back/forward do not repeat
        navigate(location.pathname, { replace: true, state: null });
      }
    } else {
      handledPatientIdRef.current = null;
    }
  }, [importedPatient, selectRegisteredPatient, navigate, location.pathname]);

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn select-none">
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 px-4 py-4 items-stretch">
        {/* Clinicial Input Calculator (Left 7 Columns) */}
        <div className="xl:col-span-7 h-full">
          <ClinicalForm
            usia={usia}
            setUsia={setUsia}
            gender={gender}
            setGender={setGender}
            berat={berat}
            setBerat={setBerat}
            tinggi={tinggi}
            setTinggi={setTinggi}
            sistolik={sistolik}
            setSistolik={setSistolik}
            diastolik={diastolik}
            setDiastolik={setDiastolik}
            bmi={bmi}
            isClassifying={isClassifying}
            onClassify={handleClassify}
            onReset={handleReset}
            
            patientType={patientType}
            selectedPatientId={selectedPatientId}
            patientName={patientName}
            setPatientType={setPatientType}
            setSelectedPatientId={setSelectedPatientId}
            setPatientName={setPatientName}
            onSelectPatient={selectRegisteredPatient}
          />
        </div>

        {/* AI Result Card (Right 5 Columns) */}
        <div className="xl:col-span-5 flex flex-col h-full">
          <PredictionResult
            result={currentResult}
            confidence={currentConfidence}
            accuracyDT={accuracyDT}
            accuracyRF={accuracyRF}
            sistolik={sistolik}
            diastolik={diastolik}
            patientType={patientType}
            patientName={patientName}
            isSaved={isSaved}
            onSavePatient={handleSaveNewPatient}
            isSaving={isClassifying}
          />
        </div>
      </section>
    </div>
  );
}

