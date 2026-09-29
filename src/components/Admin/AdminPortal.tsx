import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Settings,
  Car as CarIcon,
  Phone,
  RefreshCw,
  LogOut,
  Lock,
  Eye,
  Sliders,
  Sparkles,
  Save,
  Check
} from 'lucide-react';
import { useFleet, ExtendedCar } from '../../context/FleetContext';
import { useLanguage } from '../../context/LanguageContext';
import { LazyImage } from '../common/LazyImage';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const { cars, settings, addCar, updateCar, deleteCar, toggleCarAvailability, updateSettings, resetToDefaults } = useFleet();
  const { language } = useLanguage();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('la_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'fleet' | 'contact' | 'analytics'>('fleet');

  // Form State for Adding/Editing Car
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);

  // Car Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'Family MPV',
    price_start_from: 'Rp 500.000',
    capacity: '7 Penumpang',
    transmission: 'Automatic',
    engine: '1.5L Dual VVT-i',
    fuel: 'Bensin',
    luggage: '3 Koper',
    rates_self_drive: 'Rp 500.000 / 24 Jam',
    rates_with_driver: 'Rp 800.000 / 12 Jam (Inc. BBM & Supir)',
    badge: 'Unit Baru',
    image_url: '/images/car_toyota_veloz_1790686518687.jpg',
    gallery_urls: '',
    features_text: 'AC Dingin Double Blower\nKabin Bersih & Wangi\nAntar-Jemput Bandara Batam\nLepas Kunci / Driver',
    popular: false,
    isAvailable: true
  });

  // Contact Form Fields
  const [contactForm, setContactForm] = useState(settings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234 or admin pass
    if (pinInput.trim() === '1234' || pinInput.trim().toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('la_admin_auth', 'true');
      setAuthError('');
      setPinInput('');
    } else {
      setAuthError('PIN salah! Gunakan PIN default: 1234');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('la_admin_auth');
  };

  // Open Form to Add New Car
  const handleOpenAddForm = () => {
    setEditingCarId(null);
    setFormData({
      name: '',
      category: 'Family MPV',
      price_start_from: 'Rp 500.000',
      capacity: '7 Penumpang',
      transmission: 'Automatic',
      engine: '1.5L DOHC',
      fuel: 'Bensin',
      luggage: '3 Koper',
      rates_self_drive: 'Rp 500.000 / 24 Jam',
      rates_with_driver: 'Rp 800.000 / 12 Jam',
      badge: 'Armada Baru',
      image_url: '/images/car_toyota_veloz_1790686518687.jpg',
      gallery_urls: '',
      features_text: 'AC Dingin Double Blower\nKabin Bersih & Wangi\nAntar-Jemput Bandara Batam',
      popular: false,
      isAvailable: true
    });
    setIsFormOpen(true);
  };

  // Open Form to Edit Existing Car
  const handleOpenEditForm = (car: ExtendedCar) => {
    setEditingCarId(car.id);
    setFormData({
      name: car.name,
      category: car.category,
      price_start_from: car.price_start_from,
      capacity: car.capacity,
      transmission: car.transmission,
      engine: car.engine || '',
      fuel: car.fuel || 'Bensin',
      luggage: car.luggage || '',
      rates_self_drive: car.rates?.self_drive_24h || '',
      rates_with_driver: car.rates?.with_driver_12h || '',
      badge: car.badge || '',
      image_url: car.image_url,
      gallery_urls: car.gallery ? car.gallery.join('\n') : '',
      features_text: car.features.join('\n'),
      popular: car.popular ?? false,
      isAvailable: car.isAvailable ?? true
    });
    setIsFormOpen(true);
  };

  // Submit Car Form (Add / Edit)
  const handleSaveCar = (e: React.FormEvent) => {
    e.preventDefault();
    const featuresArray = formData.features_text
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const galleryArray = formData.gallery_urls
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const carPayload = {
      name: formData.name,
      category: formData.category,
      price_start_from: formData.price_start_from,
      price_unit: 'per hari',
      capacity: formData.capacity,
      transmission: formData.transmission,
      engine: formData.engine,
      fuel: formData.fuel,
      luggage: formData.luggage,
      badge: formData.badge,
      image_url: formData.image_url,
      gallery: galleryArray.length > 0 ? galleryArray : [formData.image_url],
      features: featuresArray,
      rates: {
        self_drive_24h: formData.rates_self_drive || `${formData.price_start_from} / 24 Jam`,
        with_driver_12h: formData.rates_with_driver || 'Hubungi Admin',
        airport_transfer: 'Free Antar-Jemput Bandara & Pelabuhan Batam'
      },
      popular: formData.popular,
      isAvailable: formData.isAvailable,
      wa_message: `Halo Admin L.A Transport Batam, saya tertarik sewa ${formData.name}. Mohon info syarat dan jadwal sewanya.`
    };

    if (editingCarId) {
      updateCar(editingCarId, carPayload);
    } else {
      addCar(carPayload);
    }

    setIsFormOpen(false);
  };

  // Submit Contact Settings Form
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(contactForm);
    setSaveSuccessMsg('Pengaturan kontak & nomor WhatsApp berhasil diperbarui!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Stats calculation
  const totalCars = cars.length;
  const availableCars = cars.filter((c) => c.isAvailable ?? true).length;
  const bookedCars = totalCars - availableCars;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#161616] border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center font-brand font-bold text-black text-sm shadow-md">
              CMS
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>L.A Transport Batam — Admin CMS Portal</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-mono font-bold">
                  v1.0
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Pusat Pengelolaan Armada, Harga Rental & Kontak WhatsApp Resmi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
                title="Keluar dari Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup CMS"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated: Login Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-[#B8860B] dark:text-[#D4AF37]" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Akses Admin Terproteksi
            </h3>
            <p className="text-xs text-slate-600 dark:text-neutral-400 mb-6 leading-relaxed">
              Masukkan PIN atau kata sandi admin untuk mengelola stok armada mobil, tarif rental, dan nomor WhatsApp.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Masukkan PIN (Default: 1234)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-slate-900 dark:text-white text-center font-mono text-lg tracking-widest focus:outline-none focus:border-[#D4AF37]"
                  autoFocus
                />
                {authError && (
                  <p className="text-xs text-rose-500 font-medium mt-2">{authError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] active:scale-95 text-black font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Masuk ke Dashboard CMS
              </button>
            </form>

            <div className="mt-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300">
              💡 Petunjuk demo: Gunakan PIN default <strong>1234</strong> atau <strong>admin</strong>.
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Nav Tabs Bar */}
            <div className="px-6 pt-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#121212] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('fleet')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-medium text-xs transition-colors cursor-pointer ${
                    activeTab === 'fleet'
                      ? 'border-[#D4AF37] text-[#B8860B] dark:text-[#D4AF37] font-bold'
                      : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <CarIcon className="w-4 h-4" />
                  <span>Kelola Armada ({totalCars})</span>
                </button>

                <button
                  onClick={() => setActiveTab('contact')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-medium text-xs transition-colors cursor-pointer ${
                    activeTab === 'contact'
                      ? 'border-[#D4AF37] text-[#B8860B] dark:text-[#D4AF37] font-bold'
                      : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Kontak & Nomor WA</span>
                </button>
              </div>

              <button
                onClick={resetToDefaults}
                className="text-[11px] text-neutral-500 hover:text-rose-500 flex items-center gap-1 transition-colors pb-2 cursor-pointer"
                title="Kembalikan armada ke konfigurasi awal"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset Default Data</span>
              </button>
            </div>

            {/* Scrollable Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-[#161616]">
              
              {/* TAB 1: FLEET MANAGEMENT */}
              {activeTab === 'fleet' && (
                <div className="space-y-6">
                  
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-xl bg-white dark:bg-[#1F1F1F] border border-slate-200 dark:border-neutral-800 shadow-xs">
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">Total Armada Mobil</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalCars}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#1F1F1F] border border-emerald-500/20 dark:border-emerald-500/20 shadow-xs">
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Siap Jalan (Ready)</p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{availableCars}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#1F1F1F] border border-amber-500/20 dark:border-amber-500/20 shadow-xs">
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Sedang Tersewa / Servis</p>
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{bookedCars}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#1F1F1F] border border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">Aksi Cepat</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">Tambah Unit</p>
                      </div>
                      <button
                        onClick={handleOpenAddForm}
                        className="w-9 h-9 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2b] active:scale-95 text-black flex items-center justify-center transition-all shadow-md cursor-pointer"
                        title="Tambah Mobil Baru"
                      >
                        <Plus className="w-5 h-5 font-bold" />
                      </button>
                    </div>
                  </div>

                  {/* Header Row & Action */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Daftar Armada L.A Transport Batam
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-neutral-400">
                        Perubahan di sini langsung tampil di halaman depan katalog secara realtime.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenAddForm}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] text-black text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Tambah Mobil</span>
                    </button>
                  </div>

                  {/* Cars Table / Card List */}
                  <div className="space-y-3">
                    {cars.map((car) => {
                      const isAvailable = car.isAvailable ?? true;
                      return (
                        <div
                          key={car.id}
                          className="p-4 rounded-xl bg-white dark:bg-[#1F1F1F] border border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#D4AF37]/50 transition-all shadow-xs"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-14 rounded-lg bg-neutral-900 overflow-hidden shrink-0 border border-neutral-700">
                              <LazyImage
                                src={car.image_url}
                                alt={car.name}
                                containerClassName="w-full h-full"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                  {car.name}
                                </h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700">
                                  {car.category}
                                </span>
                                {car.popular && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D4AF37] text-black font-bold">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                                {car.capacity} · {car.transmission} · {car.price_start_from} {car.price_unit}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-neutral-800">
                            {/* Availability Toggle Button */}
                            <button
                              onClick={() => toggleCarAvailability(car.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                isAvailable
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 border border-neutral-400 dark:border-neutral-700'
                              }`}
                              title="Klik untuk ubah status ketersediaan"
                            >
                              {isAvailable ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Tersedia</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Tersewa / Servis</span>
                                </>
                              )}
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEditForm(car)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer"
                              title="Edit Data Mobil"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => {
                                if (window.confirm(`Yakin ingin menghapus ${car.name} dari katalog?`)) {
                                  deleteCar(car.id);
                                }
                              }}
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
                              title="Hapus Mobil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* TAB 2: CONTACT & WHATSAPP SETTINGS */}
              {activeTab === 'contact' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Pengaturan Nomor WhatsApp & Lokasi Kantor
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      Seluruh tombol "Chat WhatsApp" di website akan otomatis mengarah ke nomor ini.
                    </p>
                  </div>

                  {saveSuccessMsg && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>{saveSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveContact} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                        Nomor WhatsApp Resmi Admin (Format: 628...)
                      </label>
                      <input
                        type="text"
                        value={contactForm.whatsappNumber}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                        required
                      />
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Contoh: 6281270008899 (Gunakan kode negara 62 tanpa spasi atau tanda plus).
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                        Alamat Kantor / Garasi di Batam
                      </label>
                      <textarea
                        rows={2}
                        value={contactForm.officeAddress}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, officeAddress: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                        Jam Layanan Operasional
                      </label>
                      <input
                        type="text"
                        value={contactForm.openingHours}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, openingHours: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                          Link Instagram Resmi
                        </label>
                        <input
                          type="url"
                          value={contactForm.instagramUrl}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, instagramUrl: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                          Link TikTok
                        </label>
                        <input
                          type="url"
                          value={contactForm.tiktokUrl}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, tiktokUrl: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                        Link Google Maps
                      </label>
                      <input
                        type="url"
                        value={contactForm.mapsUrl}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, mapsUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] active:scale-95 text-black font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Simpan Pengaturan Kontak</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>

            {/* Bottom Footer info */}
            <div className="p-4 bg-slate-100 dark:bg-neutral-900 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 shrink-0">
              <span>Admin Logged in · Data tersimpan lokal (Offline & Persistent)</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 hover:bg-slate-300 dark:hover:bg-neutral-700 font-semibold cursor-pointer"
              >
                Lihat Website
              </button>
            </div>

          </div>
        )}

        {/* SUB-MODAL: ADD / EDIT CAR FORM */}
        {isFormOpen && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 my-auto max-h-[88vh] overflow-y-auto">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-neutral-800 mb-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingCarId ? 'Edit Data Armada' : 'Tambah Mobil Baru ke Katalog'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCar} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                      Nama Mobil
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Toyota Fortuner GR Sport"
                      className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                      Kategori Mobil
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="VIP Luxury Van">VIP Luxury Van</option>
                      <option value="Premium MPV">Premium MPV</option>
                      <option value="Family MPV">Family MPV</option>
                      <option value="Minibus Group">Minibus Group</option>
                      <option value="Crossover MPV">Crossover MPV</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                      Tarif Mulai Dari
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.price_start_from}
                      onChange={(e) => setFormData({ ...formData, price_start_from: e.target.value })}
                      placeholder="Rp 600.000"
                      className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                      Kapasitas
                    </label>
                    <input
                      type="text"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      placeholder="7 Penumpang"
                      className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                      Transmisi
                    </label>
                    <input
                      type="text"
                      value={formData.transmission}
                      onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                      placeholder="Automatic / Manual"
                      className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                      Tipe Mesin
                    </label>
                    <input
                      type="text"
                      value={formData.engine}
                      onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                      placeholder="2.4L Diesel / 1.5L"
                      className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                      Bahan Bakar
                    </label>
                    <input
                      type="text"
                      value={formData.fuel}
                      onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                      placeholder="Bensin / Solar / Hybrid"
                      className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                      Lencana / Badge
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="Favorit Keluarga"
                      className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    URL Foto Utama
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="/src/assets/images/... atau URL gambar online"
                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    URL Galeri Foto Tambahan (1 baris per URL foto)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.gallery_urls}
                    onChange={(e) => setFormData({ ...formData, gallery_urls: e.target.value })}
                    placeholder="/src/assets/images/foto_interior.jpg&#10;/src/assets/images/foto_bagasi.jpg"
                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Daftar Keunggulan & Fasilitas (1 baris per poin)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.features_text}
                    onChange={(e) => setFormData({ ...formData, features_text: e.target.value })}
                    placeholder="AC Double Blower Dingin&#10;Kabin Bersih & Higienis&#10;Gratis Antar Bandara"
                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-neutral-300">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="rounded text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span>Tandai Mobil Populer</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-neutral-300">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>Unit Siap Jalan (Available)</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] text-black text-xs font-bold shadow-md cursor-pointer"
                  >
                    Simpan Unit Mobil
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
