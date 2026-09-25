import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-100">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404</h1>
        <p className="text-lg font-bold text-slate-800 mt-2">Halaman Tidak Ditemukan</p>
        <p className="text-sm text-slate-500 mt-2">
          Maaf, halaman klinis yang Anda cari tidak dapat ditemukan atau telah dipindahkan ke direktori lain.
        </p>
        <Button
          onClick={() => navigate(-1)}
          variant="primary"
          className="w-full mt-6 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          <span>Kembali ke Halaman Sebelumnya</span>
        </Button>
      </div>
    </div>
  );
}
