import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Mail, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useFacilityStore } from '../stores/facilityStore';
import api from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const namaPuskesmas = useFacilityStore((s) => s.facility.namaPuskesmas);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('Semua field wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/register', {
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess('Registrasi berhasil! Mengalihkan ke halaman login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.errors) {
        const firstError = Object.values(data.errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setError(data?.message || err.message || 'Registrasi gagal. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans antialiased selection:bg-blue-600 selection:text-white relative">
      {/* Main card */}
      <div className="w-full max-w-[420px] relative z-10">
        {/* Solid authentic card */}
        <div className="bg-white rounded-2xl border border-slate-200 border-b-4 shadow-sm p-8 md:p-10">

          {/* Logo and header */}
          <div className="text-center mb-7">
            <div className="w-14 h-14 mx-auto mb-4 bg-white rounded-xl border border-slate-200 border-b-2 shadow-xs flex items-center justify-center overflow-hidden">
              <img src="/logo_banyumas.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Buat Akun Baru
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Daftarkan akun untuk akses sistem
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5" autoComplete="off">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium text-center"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-600 font-medium text-center"
              >
                {success}
              </motion.div>
            )}

            {/* Nama Lengkap */}
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="reg-name">Nama Lengkap</label>
              <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'name' ? 'ring-2 ring-indigo-400/40 ring-offset-1' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserPlus className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'name' ? 'text-indigo-500' : 'text-slate-400'}`} />
                </div>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all text-sm font-medium"
                />
              </div>
            </motion.div>

            {/* Username */}
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="reg-username">Username</label>
              <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'username' ? 'ring-2 ring-indigo-400/40 ring-offset-1' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'username' ? 'text-indigo-500' : 'text-slate-400'}`} />
                </div>
                <input
                  id="reg-username"
                  name="username"
                  type="text"
                  required
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all text-sm font-medium"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="reg-email">Email</label>
              <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-indigo-400/40 ring-offset-1' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'email' ? 'text-indigo-500' : 'text-slate-400'}`} />
                </div>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Masukkan email"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all text-sm font-medium"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="reg-password">Password</label>
              <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-indigo-400/40 ring-offset-1' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'password' ? 'text-indigo-500' : 'text-slate-400'}`} />
                </div>
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </motion.div>

            {/* Konfirmasi Password */}
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="reg-password-confirm">Konfirmasi Password</label>
              <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'passwordConfirm' ? 'ring-2 ring-indigo-400/40 ring-offset-1' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'passwordConfirm' ? 'text-indigo-500' : 'text-slate-400'}`} />
                </div>
                <input
                  id="reg-password-confirm"
                  name="password_confirmation"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  onFocus={() => setFocusedField('passwordConfirm')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Ulangi password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all text-sm font-medium"
                />
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="pt-2"
            >
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                {!isLoading && (
                  <>
                    <span>Daftar Akun</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
                {isLoading && <span>Mendaftarkan...</span>}
              </Button>
            </motion.div>
          </form>

          {/* Link to Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-slate-500 font-medium">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                Masuk di sini
              </Link>
            </p>
          </motion.div>

          {/* Footer badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-medium">{namaPuskesmas || 'Puskesmas 1 Kembaran'}</span>
          </motion.div>
        </div>

        {/* Bottom brand tag */}
        <p className="text-center text-[11px] text-slate-400 mt-5 font-medium select-none">
          Klasifikasi Hipertensi {namaPuskesmas || 'Puskesmas 1 Kembaran'} &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
