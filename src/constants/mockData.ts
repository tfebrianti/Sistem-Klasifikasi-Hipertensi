import { Patient, PredictionRecord, DoctorProfile, AIModelConfig } from '../types';

export const initialPatients: Patient[] = [
  {
    id: 'PT-2023-001',
    name: 'Ahmad Hidayat',
    age: 54,
    gender: 'L',
    phone: '0812-3456-7890',
    email: 'ahmad.hidayat@gmail.com',
    address: 'Jl. Sudirman No. 45, Jakarta Selatan',
    status: 'Tingkat 2',
    lastChecked: '2023-10-12',
    bpHistory: [
      { date: 'Jan', systolic: 135, diastolic: 85 },
      { date: 'Feb', systolic: 140, diastolic: 88 },
      { date: 'Mar', systolic: 138, diastolic: 86 },
      { date: 'Apr', systolic: 145, diastolic: 92 },
      { date: 'May', systolic: 148, diastolic: 94 },
      { date: 'Jun', systolic: 152, diastolic: 96 },
      { date: 'Jul', systolic: 162, diastolic: 102 }
    ]
  },
  {
    id: 'PT-2023-002',
    name: 'Siti Aminah',
    age: 42,
    gender: 'P',
    phone: '0857-9876-5432',
    email: 'siti.aminah@yahoo.com',
    address: 'Jl. Merdeka No. 12, Bandung',
    status: 'Tingkat 1',
    lastChecked: '2023-10-10',
    bpHistory: [
      { date: 'Jan', systolic: 122, diastolic: 78 },
      { date: 'Feb', systolic: 125, diastolic: 80 },
      { date: 'Mar', systolic: 124, diastolic: 79 },
      { date: 'Apr', systolic: 130, diastolic: 84 },
      { date: 'May', systolic: 134, diastolic: 86 },
      { date: 'Jun', systolic: 138, diastolic: 89 },
      { date: 'Jul', systolic: 142, diastolic: 91 }
    ]
  },
  {
    id: 'PT-2023-003',
    name: 'Budi Santoso',
    age: 35,
    gender: 'L',
    phone: '0821-4433-2211',
    email: 'budi.santoso@outlook.com',
    address: 'Jl. Diponegoro No. 89, Surabaya',
    status: 'Normal',
    lastChecked: '2023-10-05',
    bpHistory: [
      { date: 'Jan', systolic: 115, diastolic: 75 },
      { date: 'Feb', systolic: 118, diastolic: 76 },
      { date: 'Mar', systolic: 120, diastolic: 77 },
      { date: 'Apr', systolic: 117, diastolic: 75 },
      { date: 'May', systolic: 116, diastolic: 74 },
      { date: 'Jun', systolic: 118, diastolic: 76 },
      { date: 'Jul', systolic: 119, diastolic: 77 }
    ]
  },
  {
    id: 'PT-2023-004',
    name: 'Rina Wati',
    age: 61,
    gender: 'P',
    phone: '0813-8877-6655',
    email: 'rina.wati@prohealth.org',
    address: 'Komp. Hijau Permai C-12, Tangerang',
    status: 'Tingkat 2',
    lastChecked: '2023-10-01',
    bpHistory: [
      { date: 'Jan', systolic: 145, diastolic: 92 },
      { date: 'Feb', systolic: 150, diastolic: 95 },
      { date: 'Mar', systolic: 152, diastolic: 96 },
      { date: 'Apr', systolic: 160, diastolic: 100 },
      { date: 'May', systolic: 165, diastolic: 105 },
      { date: 'Jun', systolic: 172, diastolic: 110 },
      { date: 'Jul', systolic: 184, diastolic: 122 }
    ]
  },
  {
    id: 'PT-2023-005',
    name: 'Citra Lestari',
    age: 29,
    gender: 'P',
    phone: '0899-1111-2222',
    email: 'citra.lestari@gmail.com',
    address: 'Jl. Pemuda No. 104, Semarang',
    status: 'Pra Hipertensi',
    lastChecked: '2023-10-10',
    bpHistory: [
      { date: 'Jan', systolic: 118, diastolic: 76 },
      { date: 'Feb', systolic: 121, diastolic: 78 },
      { date: 'Mar', systolic: 120, diastolic: 77 },
      { date: 'Apr', systolic: 124, diastolic: 81 },
      { date: 'May', systolic: 123, diastolic: 80 },
      { date: 'Jun', systolic: 126, diastolic: 82 },
      { date: 'Jul', systolic: 125, diastolic: 83 }
    ]
  },
  {
    id: 'PT-2023-006',
    name: 'Dewi Sartika',
    age: 48,
    gender: 'P',
    phone: '0878-3344-5566',
    email: 'dewi.sartika@gmail.com',
    address: 'Jl. Ganesha No. 6, Bandung',
    status: 'Normal',
    lastChecked: '2023-10-09',
    bpHistory: [
      { date: 'Jan', systolic: 112, diastolic: 72 },
      { date: 'Feb', systolic: 115, diastolic: 74 },
      { date: 'Mar', systolic: 114, diastolic: 74 },
      { date: 'Apr', systolic: 116, diastolic: 75 },
      { date: 'May', systolic: 118, diastolic: 77 },
      { date: 'Jun', systolic: 115, diastolic: 74 },
      { date: 'Jul', systolic: 117, diastolic: 76 }
    ]
  },
  {
    id: 'PT-2023-007',
    name: 'Eko Prasetyo',
    age: 38,
    gender: 'L',
    phone: '0812-9988-7766',
    email: 'eko.prasetyo@outlook.com',
    address: 'Jl. Malioboro No. 23, Yogyakarta',
    status: 'Tingkat 1',
    lastChecked: '2023-10-08',
    bpHistory: [
      { date: 'Jan', systolic: 124, diastolic: 82 },
      { date: 'Feb', systolic: 128, diastolic: 84 },
      { date: 'Mar', systolic: 130, diastolic: 85 },
      { date: 'Apr', systolic: 135, diastolic: 88 },
      { date: 'May', systolic: 138, diastolic: 91 },
      { date: 'Jun', systolic: 141, diastolic: 92 },
      { date: 'Jul', systolic: 143, diastolic: 93 }
    ]
  }
];


export const initialRecords: PredictionRecord[] = [
  {
    id: 'PAS-001',
    patientId: 'PT-2023-001',
    patientName: 'Ahmad Hidayat',
    date: '12 Okt 2023, 09:41',
    modelUsed: 'Random Forest',
    confidenceScore: 94,
    systolic: 162,
    diastolic: 102,
    age: 54,
    gender: 'L',
    weight: 78,
    height: 168,
    bmi: 27.6,
    result: 'Tingkat 2'
  },
  {
    id: 'PAS-002',
    patientId: 'PT-2023-003',
    patientName: 'Budi Santoso',
    date: '11 Okt 2023, 14:20',
    modelUsed: 'Decision Tree',
    confidenceScore: 88,
    systolic: 142,
    diastolic: 91,
    age: 35,
    gender: 'L',
    weight: 70,
    height: 165,
    bmi: 25.7,
    result: 'Tingkat 1'
  },
  {
    id: 'PAS-003',
    patientId: 'PT-2023-005',
    patientName: 'Citra Lestari',
    date: '10 Okt 2023, 10:05',
    modelUsed: 'Random Forest',
    confidenceScore: 91,
    systolic: 125,
    diastolic: 83,
    age: 29,
    gender: 'P',
    weight: 56,
    height: 162,
    bmi: 21.3,
    result: 'Pra Hipertensi'
  },
  {
    id: 'PAS-004',
    patientId: 'PT-2023-006',
    patientName: 'Dewi Sartika',
    date: '09 Okt 2023, 08:30',
    modelUsed: 'Random Forest',
    confidenceScore: 97,
    systolic: 117,
    diastolic: 76,
    age: 48,
    gender: 'P',
    weight: 60,
    height: 158,
    bmi: 24.0,
    result: 'Normal'
  },
  {
    id: 'PAS-005',
    patientId: 'PT-2023-007',
    patientName: 'Eko Prasetyo',
    date: '08 Okt 2023, 16:45',
    modelUsed: 'Decision Tree',
    confidenceScore: 85,
    systolic: 143,
    diastolic: 93,
    age: 38,
    gender: 'L',
    weight: 72,
    height: 173,
    bmi: 24.1,
    result: 'Tingkat 1'
  },
  {
    id: 'PAS-006',
    patientId: 'PT-2023-002',
    patientName: 'Siti Aminah',
    date: '10 Okt 2023, 11:15',
    modelUsed: 'Random Forest',
    confidenceScore: 89,
    systolic: 142,
    diastolic: 91,
    age: 42,
    gender: 'P',
    weight: 58,
    height: 160,
    bmi: 22.7,
    result: 'Tingkat 1'
  },
  {
    id: 'PAS-007',
    patientId: 'PT-2023-004',
    patientName: 'Hendro Siswanto',
    date: '07 Okt 2023, 13:50',
    modelUsed: 'Random Forest',
    confidenceScore: 95,
    systolic: 184,
    diastolic: 122,
    age: 61,
    gender: 'L',
    weight: 82,
    height: 170,
    bmi: 28.4,
    result: 'Tingkat 2'
  }
];

export const defaultDoctor: DoctorProfile = {
  name: 'Admin',
  specialty: 'Puskesmas Kembaran 1',
  hospital: 'Heart & Vascular Center',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8_hal2uMpHdU0fXwbdxj_RouEx1tog0fjGfLNIW4jBu7E8jEcL6b10UtoPEsljh96omp-ChkPkRB-kPZ5FBxv2Zb2UQG6iy5iZ2Vm_twy7t5Fxq-WkFsoN0zpDYW12aKJEYpW7Juk42DAAEyahBD2PUUYYgsq2V-M1aKGEh1SM3oRTeqh3dImYwISeDlMcdnrDIwaAVvLyIYZWUuzukDC6xUg_DSRf75EMN9prQ-rWXAP4AhCWdkPKCP4_nCPoqt9boI5AqR7ADY'
};

export const defaultModelConfig: AIModelConfig = {
  activeModel: 'Decision Tree & Random Forest',
  rfTrees: 100,
  rfMaxDepth: 12,
  dtMinSamples: 4,
  lrIterations: 200,
  confidenceFactor: 0.98
};
