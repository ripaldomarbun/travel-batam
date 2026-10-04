import React, { useState, useEffect } from 'react';
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
  EyeOff,
  Sliders,
  Sparkles,
  Save,
  Check,
  Megaphone,
  FileText,
  Key,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCheck,
  MailCheck,
  Mail,
  MapPin,
  Upload,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { useFleet, ExtendedCar, CompanySettings } from '../../context/FleetContext';
import { useLanguage } from '../../context/LanguageContext';
import { LazyImage } from '../common/LazyImage';
import { processUploadedImage, processMultipleImages } from '../../utils/imageUpload';
import {
  verifyPin,
  storeNewPin,
  checkLockoutStatus,
  recordFailedAttempt,
  resetFailedAttempts,
  sanitizeExternalUrl,
  generateResetToken,
  verifyResetToken,
  clearResetToken
} from '../../utils/security';
import { dispatchResetPasswordEmail } from '../../utils/emailService';

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
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [showPin, setShowPin] = useState<boolean>(false);

  // Auth Sub-views: 'login' | 'forgot' | 'sent' | 'reset'
  const [authView, setAuthView] = useState<'login' | 'forgot' | 'sent' | 'reset'>('login');

  // Forgot Password / Email Delivery State
  const [recoveryEmail, setRecoveryEmail] = useState<string>('');
  const [forgotMsg, setForgotMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isSendingReset, setIsSendingReset] = useState<boolean>(false);

  // Reset PIN Form State (via Token)
  const [resetTokenParam, setResetTokenParam] = useState<string>('');
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [resetNewPin, setResetNewPin] = useState<string>('');
  const [resetConfirmPin, setResetConfirmPin] = useState<string>('');
  const [showResetPin, setShowResetPin] = useState<boolean>(false);
  const [resetError, setResetError] = useState<string>('');
  const [resetSuccess, setResetSuccess] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'fleet' | 'contact' | 'announcement' | 'terms' | 'security'>('fleet');

  // Form State for Adding/Editing Car
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [isUploadingMain, setIsUploadingMain] = useState<boolean>(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState<boolean>(false);
  const [imageUploadError, setImageUploadError] = useState<string>('');
  const [showManualUrl, setShowManualUrl] = useState<boolean>(false);

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
  const [contactForm, setContactForm] = useState<CompanySettings>(settings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Terms Form Fields (multi-line textareas)
  const [selfDriveText, setSelfDriveText] = useState<string>('');
  const [withDriverText, setWithDriverText] = useState<string>('');

  // Security Form (Change PIN)
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [pinMsg, setPinMsg] = useState<string>('');

  // Check brute-force lockout status on open
  useEffect(() => {
    const status = checkLockoutStatus();
    if (status.isLocked) {
      setIsLocked(true);
      setLockoutSeconds(status.remainingSeconds);
    }
  }, [isOpen]);

  // Check for reset_token query param in URL on open
  useEffect(() => {
    if (!isOpen) return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('reset_token');
    if (token) {
      setResetTokenParam(token);
      const valid = verifyResetToken(token);
      setIsTokenValid(valid);
      setAuthView('reset');
    }
  }, [isOpen]);

  // Countdown timer for brute-force lockout
  useEffect(() => {
    if (!isLocked || lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          setAuthError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLocked, lockoutSeconds]);

  // Keep form in sync when settings change or modal opens
  useEffect(() => {
    if (settings) {
      setContactForm(settings);
      setSelfDriveText((settings.selfDriveTerms || []).join('\n'));
      setWithDriverText((settings.withDriverTerms || []).join('\n'));
    }
  }, [settings, isOpen]);

  if (!isOpen) return null;

  // Handle Login with SHA-256 Hash Verification & Rate Limiting
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      setAuthError(`Akses terkunci sementara karena proteksi brute-force. Silakan tunggu ${lockoutSeconds} detik.`);
      return;
    }

    if (!pinInput.trim()) {
      setAuthError('Silakan masukkan PIN Admin.');
      return;
    }

    setIsVerifying(true);
    try {
      const isValid = await verifyPin(pinInput);
      if (isValid) {
        setIsAuthenticated(true);
        sessionStorage.setItem('la_admin_auth', 'true');
        resetFailedAttempts();
        setAuthError('');
        setPinInput('');
      } else {
        const attemptResult = recordFailedAttempt();
        if (attemptResult.isLocked) {
          setIsLocked(true);
          setLockoutSeconds(attemptResult.remainingSeconds);
          setAuthError(`PIN salah! Anda telah mencoba ${attemptResult.attemptsCount} kali. Akses portal dikunci sementara selama ${attemptResult.remainingSeconds} detik demi keamanan.`);
        } else {
          const remainingAttempts = 5 - attemptResult.attemptsCount;
          setAuthError(`PIN salah! Sisa percobaan sebelum akun dikunci sementara: ${remainingAttempts} kali.`);
        }
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('la_admin_auth');
    setPinInput('');
    setAuthError('');
  };

  const handleClose = () => {
    if (
      window.location.hash.toLowerCase() === '#admin' ||
      window.location.hash.toLowerCase() === '#cms' ||
      window.location.search.includes('reset_token')
    ) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setAuthView('login');
    setAuthError('');
    setForgotMsg(null);
    setResetError('');
    onClose();
  };

  // Kirim tautan pemulihan PIN langsung ke email pengguna secara otomatis di latar belakang
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);
    const targetEmail = recoveryEmail.trim() || settings.email || 'info@latravelbatam.com';

    if (!targetEmail || !targetEmail.includes('@') || !targetEmail.includes('.')) {
      setForgotMsg({ type: 'error', text: 'Format email tidak valid. Masukkan alamat email yang benar.' });
      return;
    }

    setIsSendingReset(true);
    try {
      const { resetUrl } = generateResetToken();

      // Kirim email langsung ke inbox penerima via API otomatis (bukan mailto)
      const result = await dispatchResetPasswordEmail({
        recipientEmail: targetEmail,
        resetUrl
      });

      setAuthView('sent');
      setForgotMsg({
        type: 'success',
        text: result.message
      });
    } catch {
      setForgotMsg({ type: 'error', text: 'Gagal mengirim email reset. Silakan coba kembali.' });
    } finally {
      setIsSendingReset(false);
    }
  };

  // Simpan PIN Baru dari token reset
  const handleCompletePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (resetNewPin.trim().length < 4) {
      setResetError('PIN baru minimal harus 4 karakter/digit!');
      return;
    }

    if (resetNewPin !== resetConfirmPin) {
      setResetError('Konfirmasi PIN baru tidak cocok!');
      return;
    }

    try {
      await storeNewPin(resetNewPin.trim());
      clearResetToken();
      resetFailedAttempts();

      // Bersihkan query param reset_token dari URL bar
      window.history.replaceState(null, '', window.location.pathname + '#admin');

      // Login otomatis
      setIsAuthenticated(true);
      sessionStorage.setItem('la_admin_auth', 'true');
      setResetSuccess('PIN baru berhasil disimpan! Anda telah otomatis masuk ke portal Admin.');
      setResetNewPin('');
      setResetConfirmPin('');
    } catch {
      setResetError('Terjadi kesalahan saat menyimpan PIN. Silakan coba lagi.');
    }
  };

  const handleResetLockout = () => {
    resetFailedAttempts();
    setIsLocked(false);
    setLockoutSeconds(0);
    setAuthError('');
  };

  // Open Form to Add New Car
  const handleOpenAddForm = () => {
    setEditingCarId(null);
    setImageUploadError('');
    setIsUploadingMain(false);
    setIsUploadingGallery(false);
    setShowManualUrl(false);
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
    setImageUploadError('');
    setIsUploadingMain(false);
    setIsUploadingGallery(false);
    setShowManualUrl(false);
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

  // Upload Foto Utama Mobil
  const handleMainImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMain(true);
    setImageUploadError('');
    try {
      const dataUrl = await processUploadedImage(file, { maxWidth: 1280, maxHeight: 960, quality: 0.82 });
      setFormData((prev) => ({ ...prev, image_url: dataUrl }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses file foto.';
      setImageUploadError(msg);
    } finally {
      setIsUploadingMain(false);
      e.target.value = '';
    }
  };

  // Upload Foto Galeri Tambahan (Multiple)
  const handleGalleryFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    setImageUploadError('');
    try {
      const dataUrls = await processMultipleImages(files, { maxWidth: 1280, maxHeight: 960, quality: 0.82 });
      if (dataUrls.length > 0) {
        setFormData((prev) => {
          const currentList = prev.gallery_urls
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);
          const updated = [...currentList, ...dataUrls].join('\n');
          return { ...prev, gallery_urls: updated };
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses file foto galeri.';
      setImageUploadError(msg);
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  // Hapus 1 Foto Galeri Berdasarkan Index
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    const currentList = formData.gallery_urls
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const updated = currentList.filter((_, idx) => idx !== indexToRemove).join('\n');
    setFormData((prev) => ({ ...prev, gallery_urls: updated }));
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
      wa_message: `Halo Admin L.A Travel Batam, saya tertarik sewa ${formData.name}. Mohon info syarat dan jadwal sewanya.`
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
    const sanitizedContact: CompanySettings = {
      ...contactForm,
      instagramUrl: sanitizeExternalUrl(contactForm.instagramUrl),
      tiktokUrl: sanitizeExternalUrl(contactForm.tiktokUrl),
      facebookUrl: sanitizeExternalUrl(contactForm.facebookUrl),
      mapsUrl: sanitizeExternalUrl(contactForm.mapsUrl)
    };
    updateSettings(sanitizedContact);
    setContactForm(sanitizedContact);
    setSaveSuccessMsg('Pengaturan kontak & nomor WhatsApp berhasil diverifikasi dan disimpan!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Submit Announcement Bar Settings
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      promoBannerActive: contactForm.promoBannerActive,
      promoBannerText: contactForm.promoBannerText,
      promoBannerTextEn: contactForm.promoBannerTextEn
    });
    setSaveSuccessMsg('Banner pengumuman promo berhasil diperbarui!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Submit Rental Terms
  const handleSaveTerms = (e: React.FormEvent) => {
    e.preventDefault();
    const selfDriveList = selfDriveText.split('\n').map((s) => s.trim()).filter(Boolean);
    const withDriverList = withDriverText.split('\n').map((s) => s.trim()).filter(Boolean);

    updateSettings({
      selfDriveTerms: selfDriveList,
      withDriverTerms: withDriverList,
      defaultWaGreeting: contactForm.defaultWaGreeting
    });
    setSaveSuccessMsg('Syarat & ketentuan rental berhasil disimpan!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Handle Save New PIN (Web Crypto SHA-256 Hash)
  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      setPinMsg('PIN minimal 4 karakter/digit!');
      return;
    }
    if (newPin !== confirmPin) {
      setPinMsg('Konfirmasi PIN tidak cocok!');
      return;
    }
    try {
      await storeNewPin(newPin.trim());
      setPinMsg('PIN Admin berhasil diperbarui dengan hashing SHA-256 (Web Crypto)!');
      setNewPin('');
      setConfirmPin('');
    } catch {
      setPinMsg('Gagal menyimpan PIN baru. Coba lagi.');
    }
    setTimeout(() => setPinMsg(''), 3000);
  };

  // Stats calculation
  const totalCars = cars.length;
  const availableCars = cars.filter((c) => c.isAvailable ?? true).length;
  const bookedCars = totalCars - availableCars;

  // Dedicated Login Modal View (When Not Authenticated)
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 dark:bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
        <div className="relative w-full max-w-md apple-glass-card rounded-3xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10 p-6 sm:p-8 my-auto animate-in zoom-in-95 duration-200">
          
          {/* Top Bar with Brand Badge & Close */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37] flex items-center justify-center font-bold text-black text-xs shadow-md">
                LA
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#1D1D1F] dark:text-[#F5F5F7]">
                  L.A Travel Batam
                </span>
                <span className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono">
                  Admin CMS Portal v2.0
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="apple-pressable w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-600 dark:text-neutral-300 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* View 1: Standard Login Form */}
          {authView === 'login' && (
            <>
              {/* Icon & Title */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 dark:bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center mb-3.5 shadow-sm text-[#B8860B] dark:text-[#D4AF37]">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-1.5">
                  Akses Admin Terproteksi
                </h3>
                <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed max-w-xs">
                  Masukkan PIN Admin untuk mengatur nomor WhatsApp, katalog unit armada, tarif sewa, dan banner promo.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-left">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                      PIN Keamanan
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthView('forgot');
                        setForgotMsg(null);
                        setRecoveryEmail(settings.email || '');
                      }}
                      className="text-[11px] text-[#B8860B] dark:text-[#D4AF37] hover:underline cursor-pointer font-medium"
                    >
                      Lupa PIN?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 dark:text-neutral-500 pointer-events-none">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPin ? 'text' : 'password'}
                      value={pinInput}
                      disabled={isLocked || isVerifying}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        setAuthError('');
                      }}
                      placeholder={isLocked ? `Terkunci (${lockoutSeconds}s)` : 'Ketik PIN Admin...'}
                      className="w-full pl-10 pr-11 py-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/15 text-[#1D1D1F] dark:text-white font-mono text-base tracking-widest placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      autoFocus={!isLocked}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      disabled={isLocked}
                      className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                      title={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Error Message */}
                  {authError && (
                    <div className="mt-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2 leading-snug">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* Locked State Notice */}
                  {isLocked && (
                    <div className="mt-2.5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-300 flex flex-col gap-2">
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                        <span>Proteksi anti brute-force sedang aktif</span>
                      </div>
                      <p className="text-[11px] text-rose-600/90 dark:text-rose-300/80">
                        Akses dikunci sementara selama <strong>{lockoutSeconds} detik</strong>. Silakan tunggu sebelum mencoba kembali.
                      </p>
                      <button
                        type="button"
                        onClick={handleResetLockout}
                        className="self-start text-[11px] underline font-medium text-rose-700 dark:text-rose-200 hover:text-rose-900 cursor-pointer pt-0.5"
                      >
                        Buka kunci sekarang (Reset Uji Coba)
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isLocked || isVerifying}
                    className="apple-pressable w-full py-3.5 px-5 rounded-full bg-[#D4AF37] hover:bg-[#C59B27] disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 dark:disabled:text-neutral-600 text-black font-bold text-sm shadow-md transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Memverifikasi...</span>
                      </>
                    ) : isLocked ? (
                      <span>Terkunci ({lockoutSeconds}s)</span>
                    ) : (
                      <>
                        <span>Buka Admin Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="apple-pressable w-full py-2.5 px-4 rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-neutral-400 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Kembali ke Beranda
                  </button>
                </div>
              </form>
            </>
          )}

          {/* View 2: Lupa PIN Form (Input Email) */}
          {authView === 'forgot' && (
            <>
              {/* Icon & Title */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 dark:bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center mb-3.5 shadow-sm text-[#B8860B] dark:text-[#D4AF37]">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-1.5">
                  Lupa PIN / Password
                </h3>
                <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed max-w-xs">
                  Masukkan email terdaftar pengelola. Sistem akan menyiapkan tautan reset PIN resmi ke email Anda.
                </p>
              </div>

              {/* Forgot Form */}
              <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                <div className="text-left">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Email Pengelola Terdaftar
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 dark:text-neutral-500 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={recoveryEmail || settings.email || ''}
                      onChange={(e) => {
                        setRecoveryEmail(e.target.value);
                        setForgotMsg(null);
                      }}
                      placeholder="contoh: info@latravelbatam.com"
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/15 text-[#1D1D1F] dark:text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                      required
                      autoFocus
                    />
                  </div>

                  {forgotMsg && forgotMsg.type === 'error' && (
                    <div className="mt-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2 leading-snug">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                      <span>{forgotMsg.text}</span>
                    </div>
                  )}

                  <p className="mt-2 text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
                    💡 Tautan reset berlaku 15 menit dan dilengkapi token kriptografis sekali pakai.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSendingReset}
                    className="apple-pressable w-full py-3.5 px-5 rounded-full bg-[#D4AF37] hover:bg-[#C59B27] disabled:opacity-50 text-black font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{isSendingReset ? 'Menyiapkan Email...' : 'Kirim Tautan Reset ke Email'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthView('login');
                      setForgotMsg(null);
                    }}
                    className="apple-pressable w-full py-2.5 px-4 rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-neutral-400 text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Halaman Login</span>
                  </button>
                </div>
              </form>
            </>
          )}

          {/* View 3: Tautan Reset Berhasil Dikirim ke Email */}
          {authView === 'sent' && (
            <>
              {/* Icon & Title */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-3.5 shadow-sm text-emerald-600 dark:text-emerald-400">
                  <MailCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-1.5">
                  Email Berhasil Dikirim!
                </h3>
                <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed max-w-xs">
                  Pesan pemulihan telah otomatis terkirim langsung ke kotak masuk <strong className="text-[#1D1D1F] dark:text-white font-mono">{recoveryEmail.trim() || settings.email}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-2.5 mb-5 text-left text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400">
                  <span>Masa Berlaku Tautan:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">15 Menit</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-neutral-400 leading-relaxed">
                  Demi keamanan akun pengelola, tautan pemulihan PIN hanya dapat diakses melalui pesan di dalam kotak masuk (Inbox) atau folder Spam email Anda.
                </p>
                <p className="text-[10px] text-slate-500 dark:text-neutral-500 italic">
                  Silakan buka email Anda pada tab atau aplikasi email untuk mengeklik tautan verifikasi reset PIN.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthView('login');
                    setForgotMsg(null);
                  }}
                  className="apple-pressable w-full py-3 px-4 rounded-full bg-[#D4AF37] hover:bg-[#C59B27] text-black font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Halaman Login</span>
                </button>
              </div>
            </>
          )}

          {/* View 4: Reset Password (Setel PIN Baru) */}
          {authView === 'reset' && (
            <>
              {/* Icon & Title */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 dark:bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center mb-3.5 shadow-sm text-[#B8860B] dark:text-[#D4AF37]">
                  <KeyRound className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-1.5">
                  Buat PIN Admin Baru
                </h3>
                <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed max-w-xs">
                  {isTokenValid
                    ? 'Tautan pemulihan valid. Masukkan PIN baru untuk mengamankan akses portal Admin Anda.'
                    : 'Tautan pemulihan tidak valid atau sudah kadaluarsa.'}
                </p>
              </div>

              {!isTokenValid ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 leading-relaxed text-left flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                    <div>
                      <p className="font-bold text-rose-700 dark:text-rose-300">Tautan Tidak Valid atau Kadaluarsa</p>
                      <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
                        Token keamanan telah melewati batas waktu 15 menit atau sudah pernah digunakan sebelumnya.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthView('forgot')}
                      className="apple-pressable w-full py-3.5 px-4 rounded-full bg-[#D4AF37] hover:bg-[#C59B27] text-black font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Minta Tautan Reset Baru</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthView('login')}
                      className="apple-pressable w-full py-2.5 px-4 rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-neutral-400 text-xs font-medium cursor-pointer"
                    >
                      Kembali ke Login
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCompletePasswordReset} className="space-y-4">
                  <div className="text-left space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                        PIN Baru (Minimal 4 Angka/Karakter)
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 text-slate-400 dark:text-neutral-500 pointer-events-none">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showResetPin ? 'text' : 'password'}
                          value={resetNewPin}
                          onChange={(e) => {
                            setResetNewPin(e.target.value);
                            setResetError('');
                          }}
                          placeholder="Ketik PIN Baru..."
                          className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/15 text-[#1D1D1F] dark:text-white font-mono text-base tracking-widest focus:outline-none focus:border-[#D4AF37] transition-all"
                          autoFocus
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowResetPin(!showResetPin)}
                          className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-white cursor-pointer"
                        >
                          {showResetPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                        Konfirmasi PIN Baru
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 text-slate-400 dark:text-neutral-500 pointer-events-none">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showResetPin ? 'text' : 'password'}
                          value={resetConfirmPin}
                          onChange={(e) => {
                            setResetConfirmPin(e.target.value);
                            setResetError('');
                          }}
                          placeholder="Ulangi PIN Baru..."
                          className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/15 text-[#1D1D1F] dark:text-white font-mono text-base tracking-widest focus:outline-none focus:border-[#D4AF37] transition-all"
                          required
                        />
                      </div>
                    </div>

                    {resetError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2 leading-snug">
                        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                        <span>{resetError}</span>
                      </div>
                    )}

                    {resetSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-start gap-2 leading-snug">
                        <CheckCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                        <span>{resetSuccess}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="submit"
                      className="apple-pressable w-full py-3.5 px-5 rounded-full bg-[#D4AF37] hover:bg-[#C59B27] text-black font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan PIN Baru & Masuk Admin</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthView('login')}
                      className="apple-pressable w-full py-2.5 px-4 rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-neutral-400 text-xs font-medium cursor-pointer"
                    >
                      Batal & Kembali
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Discreet Security Indicator */}
          <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 dark:text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Terenkripsi Web Crypto SHA-256</span>
          </div>

        </div>
      </div>
    );
  }

  // Authenticated Management Dashboard View
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl apple-glass-card rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-900/90 text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center font-bold text-black text-sm shadow-md">
              CMS
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>L.A Travel Batam — Admin CMS Portal</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-mono font-bold">
                  v2.0
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Pusat Pengelolaan Armada, Kontak WhatsApp, Promo Banner & Syarat Rental
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="apple-pressable hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
              title="Keluar dari Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
            <button
              onClick={handleClose}
              className="apple-pressable w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup CMS"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Authenticated Dashboard View */}
        <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Nav Tabs Bar */}
            <div className="px-6 pt-3 apple-glass-nav flex items-center justify-between shrink-0 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setActiveTab('fleet')}
                  className={`apple-pressable flex items-center gap-1.5 px-3 sm:px-4 py-2.5 border-b-2 font-medium text-xs whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'fleet'
                      ? 'border-[#D4AF37] text-[#B8860B] dark:text-[#D4AF37] font-bold'
                      : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <CarIcon className="w-4 h-4" />
                  <span>Armada ({totalCars})</span>
                </button>

                <button
                  onClick={() => setActiveTab('contact')}
                  className={`apple-pressable flex items-center gap-1.5 px-3 sm:px-4 py-2.5 border-b-2 font-medium text-xs whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'contact'
                      ? 'border-[#D4AF37] text-[#B8860B] dark:text-[#D4AF37] font-bold'
                      : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Kontak & WA</span>
                </button>

                <button
                  onClick={() => setActiveTab('announcement')}
                  className={`apple-pressable flex items-center gap-1.5 px-3 sm:px-4 py-2.5 border-b-2 font-medium text-xs whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'announcement'
                      ? 'border-[#D4AF37] text-[#B8860B] dark:text-[#D4AF37] font-bold'
                      : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Banner Promo</span>
                </button>

                <button
                  onClick={() => setActiveTab('terms')}
                  className={`apple-pressable flex items-center gap-1.5 px-3 sm:px-4 py-2.5 border-b-2 font-medium text-xs whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'terms'
                      ? 'border-[#D4AF37] text-[#B8860B] dark:text-[#D4AF37] font-bold'
                      : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Syarat Rental</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`apple-pressable flex items-center gap-1.5 px-3 sm:px-4 py-2.5 border-b-2 font-medium text-xs whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'security'
                      ? 'border-[#D4AF37] text-[#B8860B] dark:text-[#D4AF37] font-bold'
                      : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Key className="w-4 h-4" />
                  <span>PIN & Reset</span>
                </button>
              </div>

              <button
                onClick={resetToDefaults}
                className="apple-pressable text-[11px] text-neutral-500 hover:text-rose-500 flex items-center gap-1 transition-colors pb-2 cursor-pointer ml-4 whitespace-nowrap shrink-0"
                title="Kembalikan armada ke konfigurasi awal"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden md:inline">Reset Default</span>
              </button>
            </div>

            {/* Scrollable Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F5F5F7] dark:bg-[#000000]">
              
              {/* Global Save Alert */}
              {saveSuccessMsg && (
                <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* TAB 1: FLEET MANAGEMENT */}
              {activeTab === 'fleet' && (
                <div className="space-y-6">
                  
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl apple-glass-card">
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">Total Armada Mobil</p>
                      <p className="text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">{totalCars}</p>
                    </div>

                    <div className="p-4 rounded-2xl apple-glass-card border-emerald-500/20">
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Siap Jalan (Ready)</p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{availableCars}</p>
                    </div>

                    <div className="p-4 rounded-2xl apple-glass-card border-amber-500/20">
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Sedang Tersewa</p>
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{bookedCars}</p>
                    </div>

                    <div className="p-4 rounded-2xl apple-glass-card border-[#D4AF37]/30 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-[#B8860B] dark:text-[#D4AF37] font-medium">Tambah Unit</p>
                        <button
                          onClick={handleOpenAddForm}
                          className="apple-pressable mt-1.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D4AF37] hover:bg-[#C59B27] text-black font-bold text-xs cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Mobil Baru</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* List of Cars */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                        Daftar Kendaraan Aktif
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                        Klik toggle "Ready" untuk mengubah status unit secara langsung di website.
                      </p>
                    </div>

                    {cars.map((car) => {
                      const isReady = car.isAvailable ?? true;
                      return (
                        <div
                          key={car.id}
                          className="p-3.5 sm:p-4 rounded-2xl apple-glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#D4AF37]/40 transition-colors shadow-xs"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-14 h-14 rounded-xl bg-neutral-900 overflow-hidden shrink-0 border border-neutral-700/50">
                              <img
                                src={car.image_url}
                                alt={car.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">{car.name}</h4>
                                {car.popular && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-semibold">
                                    Populer
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                                {car.category} · <span className="text-[#D4AF37] font-semibold">{car.price_start_from}</span> / hari
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5 dark:border-white/10">
                            {/* Toggle Availability */}
                            <button
                              onClick={() => toggleCarAvailability(car.id)}
                              className={`apple-pressable px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                isReady
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              }`}
                              title={isReady ? 'Unit Siap Disewa' : 'Unit Sedang Disewa / Servis'}
                            >
                              {isReady ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Ready</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Booked</span>
                                </>
                              )}
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEditForm(car)}
                              className="apple-pressable p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer"
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
                              className="apple-pressable p-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
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
                    <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      Pengaturan Kontak, WhatsApp Resmi & Lokasi Kantor
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      Seluruh tombol "Chat WhatsApp", inquiry mobil, dan info kontak di website akan otomatis mengarah ke pengaturan ini.
                    </p>
                  </div>

                  <form onSubmit={handleSaveContact} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                          Nomor WhatsApp Utama (Wajib, format 628...)
                        </label>
                        <input
                          type="text"
                          value={contactForm.whatsappNumber}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs font-mono text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                          required
                        />
                        <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-1">
                          Contoh: 6281270008899 (tanpa spasi/tanda plus).
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                          Nomor WhatsApp / Telepon Cadangan
                        </label>
                        <input
                          type="text"
                          value={contactForm.secondaryPhone || ''}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, secondaryPhone: e.target.value.replace(/[^0-9]/g, '') })
                          }
                          placeholder="62821..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs font-mono text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                        />
                        <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-1">
                          Ditampilkan di footer sebagai kontak alternatif.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                        Email Resmi Bisnis
                      </label>
                      <input
                        type="email"
                        value={contactForm.email || ''}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, email: e.target.value })
                        }
                        placeholder="info@latravelbatam.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                        Alamat Lengkap Kantor & Garasi Batam
                      </label>
                      <textarea
                        rows={2}
                        value={contactForm.officeAddress}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, officeAddress: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                          Instagram URL
                        </label>
                        <input
                          type="url"
                          value={contactForm.instagramUrl}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, instagramUrl: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                          TikTok URL
                        </label>
                        <input
                          type="url"
                          value={contactForm.tiktokUrl}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, tiktokUrl: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                          Facebook URL
                        </label>
                        <input
                          type="url"
                          value={contactForm.facebookUrl || ''}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, facebookUrl: e.target.value })
                          }
                          placeholder="https://facebook.com/..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                        Link Google Maps Lokasi
                      </label>
                      <input
                        type="url"
                        value={contactForm.mapsUrl}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, mapsUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="apple-pressable inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#c49f2b] text-black font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Simpan Pengaturan Kontak</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: ANNOUNCEMENT & PROMO BANNER */}
              {activeTab === 'announcement' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      Banner Pengumuman & Promo (Header Top Bar)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      Tampilkan promo diskon, kabar gembira, atau info gratis antar-jemput bandara tepat di bagian paling atas halaman website.
                    </p>
                  </div>

                  <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                    <div className="p-4 rounded-2xl apple-glass-card flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">Status Banner Promo</p>
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400">Aktifkan untuk menampilkan banner di atas navigasi.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={contactForm.promoBannerActive}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, promoBannerActive: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                        Teks Promo (Bahasa Indonesia)
                      </label>
                      <input
                        type="text"
                        value={contactForm.promoBannerText || ''}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, promoBannerText: e.target.value })
                        }
                        placeholder="Contoh: ✨ Promo Spesial Batam: Gratis Antar-Jemput Bandara Hang Nadim!"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                        Teks Promo (English Translation)
                      </label>
                      <input
                        type="text"
                        value={contactForm.promoBannerTextEn || ''}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, promoBannerTextEn: e.target.value })
                        }
                        placeholder="Special Offer: Free Airport & Ferry Terminal Delivery..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="apple-pressable inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#c49f2b] text-black font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Simpan Pengaturan Banner Promo</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: RENTAL TERMS & POLICY */}
              {activeTab === 'terms' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      Syarat & Ketentuan Rental Mobil
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      Ubah syarat sewa lepas kunci dan layanan dengan supir (tiap baris mewakili 1 butir syarat).
                    </p>
                  </div>

                  <form onSubmit={handleSaveTerms} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                        Persyaratan Sewa Lepas Kunci (1 baris per poin)
                      </label>
                      <textarea
                        rows={5}
                        value={selfDriveText}
                        onChange={(e) => setSelfDriveText(e.target.value)}
                        placeholder="Foto KTP asli & SIM A..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                      />
                      <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-1">
                        Akan langsung tampil di section Syarat & Ketentuan pada halaman depan.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                        Ketentuan Layanan Dengan Supir (1 baris per poin)
                      </label>
                      <textarea
                        rows={5}
                        value={withDriverText}
                        onChange={(e) => setWithDriverText(e.target.value)}
                        placeholder="Sudah termasuk supir ramah & berpengalaman..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                        Template Salam Pembuka WhatsApp Default
                      </label>
                      <input
                        type="text"
                        value={contactForm.defaultWaGreeting || ''}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, defaultWaGreeting: e.target.value })
                        }
                        placeholder="Halo Admin L.A Travel Batam, saya ingin booking rental mobil..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="apple-pressable inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#c49f2b] text-black font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Simpan Syarat Rental</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 5: SECURITY & PIN */}
              {activeTab === 'security' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      Keamanan & Ganti PIN Admin
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      Ganti PIN bawaan (1234) dengan PIN rahasia Anda sendiri agar portal aman dari pihak lain.
                    </p>
                  </div>

                  {pinMsg && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{pinMsg}</span>
                    </div>
                  )}

                  {/* Email Pemulihan Terdaftar */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
                    <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300 mb-1">
                      <Mail className="w-4 h-4 text-[#D4AF37]" />
                      <span>Email Pemulihan PIN Terdaftar</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-neutral-400">
                      Tautan lupa/reset password akan dikirimkan ke: <strong className="text-[#1D1D1F] dark:text-white font-mono">{settings.email || 'info@latravelbatam.com'}</strong>. Anda dapat memperbarui email ini kapan saja di tab <strong>Kontak & WA</strong>.
                    </p>
                  </div>

                  <form onSubmit={handleSavePin} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                          PIN Baru (Minimal 4 Angka/Huruf)
                        </label>
                        <input
                          type="password"
                          required
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          placeholder="Masukkan PIN Baru"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs font-mono text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                          Konfirmasi PIN Baru
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value)}
                          placeholder="Ulangi PIN Baru"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs font-mono text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="apple-pressable inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#c49f2b] text-black font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        <Key className="w-4 h-4" />
                        <span>Simpan PIN Baru</span>
                      </button>
                    </div>
                  </form>

                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-neutral-800">
                    <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">
                      Zona Reset (Factory Reset)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
                      Jika Anda ingin menghapus seluruh perubahan lokal dan mengembalikan data armada & kontak ke setelan pabrik awal.
                    </p>
                    <button
                      onClick={() => {
                        if (window.confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke pengaturan pabrik?')) {
                          resetToDefaults();
                          setSaveSuccessMsg('Semua data berhasil direset ke pengaturan awal!');
                          setTimeout(() => setSaveSuccessMsg(''), 3000);
                        }
                      }}
                      className="apple-pressable px-4 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Kembalikan ke Setelan Awal</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Footer info */}
            <div className="p-4 apple-glass-nav border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 shrink-0">
              <span>Admin Logged in · Data tersimpan lokal (Offline & Persistent)</span>
              <button
                onClick={onClose}
                className="apple-pressable px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-slate-800 dark:text-neutral-200 hover:bg-black/10 dark:hover:bg-white/15 font-semibold cursor-pointer"
              >
                Kembali ke Website
              </button>
            </div>

          </div>

        {/* SUB-MODAL: ADD / EDIT CAR FORM */}
        {isFormOpen && (
          <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="relative w-full max-w-2xl apple-glass-card rounded-2xl sm:rounded-3xl shadow-2xl p-6 my-auto max-h-[88vh] overflow-y-auto">
              
              <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-5">
                <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {editingCarId ? 'Edit Data Armada' : 'Tambah Mobil Baru ke Katalog'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="apple-pressable p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 text-slate-400 hover:text-white cursor-pointer"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                      Kategori Mobil
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                      Tarif Lepas Kunci
                    </label>
                    <input
                      type="text"
                      value={formData.rates_self_drive}
                      onChange={(e) => setFormData({ ...formData, rates_self_drive: e.target.value })}
                      placeholder="Rp 600.000 / 24 Jam"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                      Tarif Dengan Supir
                    </label>
                    <input
                      type="text"
                      value={formData.rates_with_driver}
                      onChange={(e) => setFormData({ ...formData, rates_with_driver: e.target.value })}
                      placeholder="Rp 900.000 / 12 Jam (Inc. BBM)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Bagian Foto Utama Unit Mobil */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300">
                      Foto Utama Unit Mobil <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowManualUrl(!showManualUrl)}
                      className="text-[11px] text-[#B8860B] dark:text-[#D4AF37] hover:underline cursor-pointer"
                    >
                      {showManualUrl ? 'Sembunyikan URL Manual' : 'Gunakan URL Manual'}
                    </button>
                  </div>

                  {/* Area Upload & Preview Foto Utama */}
                  <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-3">
                    {formData.image_url ? (
                      <div className="space-y-3">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/10 dark:bg-black/40 border border-black/10 dark:border-white/10 group">
                          <img
                            src={formData.image_url}
                            alt="Preview Foto Utama Mobil"
                            className="w-full h-full object-cover object-center"
                          />
                          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            Foto Terpasang
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="apple-pressable flex-1 py-2 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#c59b27] text-black text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                            {isUploadingMain ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload className="w-3.5 h-3.5" />
                            )}
                            <span>{isUploadingMain ? 'Mengompres...' : 'Ganti Foto dari Perangkat'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingMain}
                              onChange={handleMainImageFileChange}
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image_url: '' })}
                            className="apple-pressable py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="apple-pressable flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-[#D4AF37]/50 hover:border-[#D4AF37] bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 transition-colors cursor-pointer text-center group">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-2.5 text-[#B8860B] dark:text-[#D4AF37]">
                          {isUploadingMain ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                          ) : (
                            <Upload className="w-5 h-5" />
                          )}
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-neutral-100">
                          {isUploadingMain ? 'Sedang Memproses Foto...' : 'Klik untuk Upload Foto dari HP / Laptop'}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                          Format JPG, PNG, atau WebP (otomatis dikompres optimal & jernih)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingMain}
                          onChange={handleMainImageFileChange}
                          className="hidden"
                        />
                      </label>
                    )}

                    {/* Input URL Manual (opsional / fallback) */}
                    {showManualUrl && (
                      <div className="pt-2 border-t border-black/5 dark:border-white/10">
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                          Path / URL Eksternal Gambar:
                        </label>
                        <input
                          type="text"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          placeholder="/images/car_toyota_veloz_1790686518687.jpg atau https://..."
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black/30 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] font-mono focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Bagian Foto Galeri Tambahan */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300">
                      Foto Galeri Tambahan (Interior, Bagasi, Samping)
                    </label>
                    <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                      {formData.gallery_urls.split('\n').filter(Boolean).length} Foto
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-3">
                    {/* Tombol Upload Multi-File Galeri */}
                    <label className="apple-pressable w-full py-2.5 px-4 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 hover:border-[#D4AF37] text-slate-800 dark:text-neutral-100 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors">
                      {isUploadingGallery ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                          <span>Mengompres Foto Galeri...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>+ Upload Foto Galeri dari Perangkat (Bisa Banyak Sekaligus)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={isUploadingGallery}
                        onChange={handleGalleryFilesChange}
                        className="hidden"
                      />
                    </label>

                    {/* Preview Thumbnail Grid */}
                    {(() => {
                      const galleryList = formData.gallery_urls
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean);
                      if (galleryList.length === 0) return null;

                      return (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                          {galleryList.map((url, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-video rounded-lg overflow-hidden bg-black/10 dark:bg-black/40 border border-black/10 dark:border-white/10 group"
                            >
                              <img
                                src={url}
                                alt={`Galeri ${idx + 1}`}
                                className="w-full h-full object-cover object-center"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(idx)}
                                className="absolute top-1 right-1 p-1 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md cursor-pointer transition-transform transform active:scale-90"
                                title="Hapus foto ini"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    {/* Textarea URL manual galeri */}
                    <div>
                      <details className="text-[11px] text-slate-500 dark:text-neutral-400 cursor-pointer">
                        <summary className="hover:text-black dark:hover:text-white transition-colors">
                          Lihat / Edit Daftar URL Galeri Manual (1 per baris)
                        </summary>
                        <textarea
                          rows={2}
                          value={formData.gallery_urls}
                          onChange={(e) => setFormData({ ...formData, gallery_urls: e.target.value })}
                          placeholder="/images/car_interior_zenix_1790687674985.jpg"
                          className="w-full mt-1.5 px-3 py-2 rounded-xl bg-white dark:bg-black/30 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] font-mono focus:outline-none focus:border-[#D4AF37]"
                        />
                      </details>
                    </div>
                  </div>
                </div>

                {imageUploadError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>{imageUploadError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                    Fitur Unggulan (1 per baris)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.features_text}
                    onChange={(e) => setFormData({ ...formData, features_text: e.target.value })}
                    placeholder="AC Double Blower&#10;Kabin Bersih & Wangi&#10;Antar-Jemput Bandara"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="rounded text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
                      Tandai sebagai Unit Rekomendasi / Populer
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Status Unit Siap Jalan (Ready)
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="apple-pressable px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/10 text-slate-700 dark:text-neutral-300 text-xs font-semibold hover:bg-black/10 dark:hover:bg-white/15 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="apple-pressable px-6 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#c49f2b] text-black font-bold text-xs shadow-md cursor-pointer"
                  >
                    {editingCarId ? 'Simpan Perubahan' : 'Tambahkan ke Katalog'}
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
