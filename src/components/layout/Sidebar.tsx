import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, Users, Settings, LogOut, X, BrainCircuit, BarChart3 } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { useFacilityStore } from '../../stores/facilityStore';
import { showConfirm } from '../../stores/dialogStore';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpenMobile, setIsOpenMobile } = useUIStore();
  const logout = useAuthStore((state) => state.logout);
  const namaPuskesmas = useFacilityStore((state) => state.facility.namaPuskesmas);

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Tren BP & statistik klinis'
    },
    {
      path: '/sistem-klasifikasi',
      label: 'Sistem Klasifikasi',
      icon: BrainCircuit,
      description: 'Form input klinis pasien'
    },
    {
      path: '/history',
      label: 'Riwayat Pasien',
      icon: History,
      description: 'Laporan klinis terekam'
    },
    {
      path: '/patients',
      label: 'Data Pasien',
      icon: Users,
      description: 'Daftar pasien & detail medis'
    },
    {
      path: '/evaluasi',
      label: 'Hasil Evaluasi',
      icon: BarChart3,
      description: 'Perbandingan performa model AI'
    }
  ];

  const handleLogoutClick = async () => {
    const confirmed = await showConfirm({
      title: 'Konfirmasi Keluar',
      message: 'Apakah Anda yakin ingin keluar dari sistem?',
      confirmText: 'Ya, Keluar',
      cancelText: 'Batal',
      variant: 'danger',
    });
    if (confirmed) {
      await logout();
      navigate('/login');
    }
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col py-5 px-3 bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 mb-6 select-none">
        <img src="/logo_banyumas.png" alt="Logo Puskesmas" className="w-8 h-8 object-contain shrink-0" />
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-slate-900 leading-tight truncate">{namaPuskesmas || 'Puskesmas 1 Kembaran'}</h1>
          <p className="text-[11px] text-slate-500 font-medium truncate">Sistem Hipertensi AI</p>
        </div>
        {isOpenMobile && (
          <button 
            type="button" 
            onClick={() => setIsOpenMobile(false)}
            className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors md:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation List - Simple, flat, authentic items */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpenMobile(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors decoration-none ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-700'}`} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Navigation (Settings & Logout) - Simple & Flat */}
      <div className="pt-3 mt-auto border-t border-slate-200 space-y-1">
        <NavLink
          to="/settings"
          onClick={() => setIsOpenMobile(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors decoration-none ${
              isActive 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`
          }
        >
          <Settings className="w-4.5 h-4.5 shrink-0 text-slate-700" />
          <span className="truncate">Pengaturan</span>
        </NavLink>

        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0 text-slate-500 hover:text-red-600" />
          <span className="truncate">Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Layout */}
      <aside className="hidden md:flex flex-col h-screen w-64 shrink-0 sticky left-0 top-0 overflow-y-auto z-10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Slider Drawers */}
      <AnimatePresence>
        {isOpenMobile && (
          <>
            {/* Backdrop overlays */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenMobile(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px] z-40 md:hidden"
            />
            {/* Drawer Drawer Body */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] z-50 md:hidden pb-safe"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
