import React, { useState } from 'react';
import { MapPin, Phone, Mail, Award, Map, ExternalLink, Clock, HeartHandshake, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFacilityStore } from '../../../stores/facilityStore';

export default function PuskesmasCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const facility = useFacilityStore((state) => state.facility);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    (facility.namaPuskesmas || 'Puskesmas 1 Kembaran') + ' ' + (facility.alamat || 'Banyumas')
  )}`;

  return (
    <div className="px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
      {/* Card 1: Media (Gambar & Logo) - col-span-5 */}
      <div className="lg:col-span-5 flex flex-col h-full">
        <div className="p-5 flex flex-col justify-between h-full bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-colors">
          {/* Building Image */}
          <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-200 shadow-xs relative shrink-0">
            <img 
              src="/puskesmas_building.png" 
              alt={`Gedung ${facility.namaPuskesmas}`} 
              className="w-full h-full object-cover select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Logos Group */}
          <div className="flex items-center gap-3 shrink-0 bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/80 shadow-xs w-full justify-center mt-4">
            <img 
              src="/logo_banyumas.png" 
              alt="Logo Daerah" 
              className="h-10 w-auto object-contain select-none pointer-events-none"
            />
            <div className="h-7 w-[1px] bg-slate-200" />
            <img 
              src="/logo_dinkes.png" 
              alt="Logo Dinas Kesehatan" 
              className="h-10 w-auto object-contain select-none pointer-events-none"
            />
            <div className="h-7 w-[1px] bg-slate-200" />
            <img 
              src="/logo_puskesmas.png" 
              alt="Logo Puskesmas" 
              className="h-10 w-auto object-contain select-none pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Card 2: Informasi Puskesmas - col-span-7 */}
      <div className="lg:col-span-7 flex flex-col h-full">
        <div className="p-5 sm:p-6 flex flex-col justify-between h-full bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-colors text-left gap-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {facility.namaPuskesmas}
              </h2>
              {facility.akreditasi && (
                <span 
                  className="text-xs font-semibold text-slate-500 cursor-help select-none"
                  title={`${facility.namaPuskesmas} ${facility.akreditasi}`}
                >
                  ({facility.akreditasi})
                </span>
              )}
            </div>
            
            <p className="text-xs font-semibold text-slate-400 flex items-center gap-2 flex-wrap border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-700">Kode Puskesmas:</span> {facility.kodePuskesmas || '-'}
              <span className="text-slate-350">|</span>
              <span className="font-bold text-slate-600">Wilayah Kerja:</span> {facility.wilayahKerja || '-'}
            </p>

            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-800 shrink-0 mt-0.5" />
                <span>{facility.alamat}</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-800 shrink-0" />
                  <span>{facility.telepon}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-800 shrink-0" />
                  <span className="truncate">{facility.email}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Row: Lihat Selengkapnya (link) & Petunjuk Lokasi (button) */}
          <div className="flex items-center justify-between gap-4 pt-10 border-t border-slate-100 mt-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-slate-700 hover:text-slate-950 hover:underline underline-offset-4 cursor-pointer transition-colors"
            >
              Lihat Selengkapnya
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black active:bg-slate-800 text-white rounded-lg border border-slate-900 border-b-2 shadow-xs active:border-b active:translate-y-[1px] transition-all cursor-pointer text-xs font-semibold"
            >
              <Map className="w-4 h-4 text-white" />
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Modal Detail Informasi Puskesmas */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:max-w-2xl md:mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-50 text-left overflow-y-auto max-h-[85vh] select-none"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Profil {facility.namaPuskesmas}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    {facility.dinasKesehatan} &bull; {facility.pemerintahDaerah}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-sans">
                <div>
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                    Tentang Fasilitas Layanan
                  </h4>
                  <p className="font-medium">
                    {facility.namaPuskesmas} merupakan unit pelaksana teknis {facility.dinasKesehatan.toLowerCase()} yang menyelenggarakan pelayanan kesehatan tingkat pertama. Berkomitmen untuk menyediakan layanan kesehatan yang bermutu, merata, dan terjangkau bagi seluruh lapisan masyarakat di wilayah {facility.wilayahKerja}.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Kontak & Lokasi
                    </h4>
                    <ul className="space-y-1 font-semibold text-slate-600">
                      <li>&bull; Alamat: {facility.alamat}</li>
                      <li>&bull; Telepon: {facility.telepon}</li>
                      <li>&bull; Email: {facility.email}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Status & Akreditasi
                    </h4>
                    <ul className="space-y-1 font-semibold text-slate-600">
                      <li>&bull; Status: {facility.akreditasi || 'Terakreditasi Paripurna'}</li>
                      <li>&bull; Kode Registrasi: {facility.kodePuskesmas}</li>
                      <li>&bull; Wilayah: {facility.wilayahKerja}</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">Visi Pelayanan</h4>
                  <p className="font-medium italic bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center text-slate-700">
                    "Terwujudnya pelayanan kesehatan yang bermutu, merata, dan terjangkau menuju masyarakat {facility.wilayahKerja} yang sehat secara mandiri."
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-slate-100 mt-6 gap-3 select-none">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white border border-slate-200 border-b-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:translate-y-[1px]"
                >
                  <Map className="w-4 h-4 text-slate-700" />
                  <span>Petunjuk Arah</span>
                </a>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Tutup Profil
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
