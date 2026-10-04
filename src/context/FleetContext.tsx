import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultCarsData from '../data/cars.json';
import { Car, LA_TRANSPORT_WA_PHONE, LA_TRANSPORT_OFFICE_ADDRESS } from '../utils/whatsapp';

export interface ExtendedCar extends Car {
  isAvailable?: boolean; // Status ketersediaan: true (Ready) / false (Sedang Tersewa / Servis)
}

export interface CompanySettings {
  whatsappNumber: string;
  secondaryPhone: string;
  email: string;
  officeAddress: string;
  openingHours: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;
  mapsUrl: string;
  promoBannerActive: boolean;
  promoBannerText: string;
  promoBannerTextEn: string;
  selfDriveTerms: string[];
  withDriverTerms: string[];
  defaultWaGreeting: string;
}

const DEFAULT_SETTINGS: CompanySettings = {
  whatsappNumber: LA_TRANSPORT_WA_PHONE,
  secondaryPhone: '6282170008899',
  email: 'info@latravelbatam.com',
  officeAddress: LA_TRANSPORT_OFFICE_ADDRESS,
  openingHours: '24 Jam (Setiap Hari)',
  instagramUrl: 'https://instagram.com/latravelbatam',
  tiktokUrl: 'https://tiktok.com/@latravelbatam',
  facebookUrl: 'https://facebook.com/latravelbatam',
  mapsUrl: 'https://maps.google.com/?q=LA+Travel+Batam',
  promoBannerActive: true,
  promoBannerText: '✨ Promo Spesial Batam: Gratis Antar-Jemput Bandara Hang Nadim & Pelabuhan Ferry untuk sewa minimal 2 hari!',
  promoBannerTextEn: '✨ Special Batam Offer: Free Airport & Ferry Terminal Delivery for rentals of 2 days or more!',
  selfDriveTerms: [
    'Foto KTP asli & SIM A yang masih aktif/berlaku',
    'Tiket pesawat / tiket ferry kedatangan & kepulangan Batam',
    'Bukti booking hotel atau voucher penginapan di Batam',
    'Deposit jaminan keamanan (100% refundable saat mobil kembali prima)',
    'Penyewa bersedia difoto bersama kendaraan saat serah terima kunci'
  ],
  withDriverTerms: [
    'Sudah termasuk supir profesional, ramah & paham rute Batam',
    'Paket sewa fleksibel 12 jam atau seharian penuh (full day)',
    'Termasuk BBM dalam kota Batam & bebas biaya antar mobil',
    'Supir siap memandu rekomendasi tempat wisata & seafood lezat khas Batam',
    'Layanan tepat waktu, mobil selalu hadir bersih dan wangi sebelum jam penjemputan'
  ],
  defaultWaGreeting: 'Halo Admin L.A Travel Batam, saya ingin konsultasi ketersediaan mobil dan booking rental.'
};

interface FleetContextType {
  cars: ExtendedCar[];
  settings: CompanySettings;
  selectedCarForDetail: ExtendedCar | null;
  setSelectedCarForDetail: (car: ExtendedCar | null) => void;
  addCar: (car: Omit<ExtendedCar, 'id'>) => void;
  updateCar: (id: string, updatedCar: Partial<ExtendedCar>) => void;
  deleteCar: (id: string) => void;
  toggleCarAvailability: (id: string) => void;
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  resetToDefaults: () => void;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

const STORAGE_CARS_KEY = 'la_travel_fleet_v2';
const STORAGE_SETTINGS_KEY = 'la_travel_settings_v2';

function sanitizeCarPaths(car: ExtendedCar): ExtendedCar {
  const cleanImageUrl = car.image_url
    ? car.image_url.replace('/src/assets/images/', '/images/')
    : '/images/hero_la_transport_1790686468335.jpg';

  const cleanGallery = car.gallery && car.gallery.length > 0
    ? car.gallery.map((g) => g.replace('/src/assets/images/', '/images/'))
    : [cleanImageUrl];

  return {
    ...car,
    image_url: cleanImageUrl,
    gallery: cleanGallery
  };
}

export const FleetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<ExtendedCar[]>(() => {
    try {
      // Clean legacy caches if exists
      localStorage.removeItem('la_transport_fleet_v1');
      localStorage.removeItem('la_transport_settings_v1');
      localStorage.removeItem('la_transport_settings_v2');

      const saved = localStorage.getItem(STORAGE_CARS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeCarPaths);
        }
      }
    } catch {
      // fallback
    }
    return defaultCarsData.map((c) => sanitizeCarPaths({ ...c, isAvailable: true }));
  });

  const [settings, setSettings] = useState<CompanySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [selectedCarForDetail, setSelectedCarForDetailState] = useState<ExtendedCar | null>(null);

  // Sync with URL hash (e.g. #detail-toyota-alphard-transformer)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#detail-')) {
        const carId = hash.replace('#detail-', '');
        const matched = cars.find((c) => c.id === carId);
        if (matched) {
          setSelectedCarForDetailState(matched);
        }
      } else if (!hash.startsWith('#detail-') && selectedCarForDetail) {
        setSelectedCarForDetailState(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [cars]);

  const setSelectedCarForDetail = (car: ExtendedCar | null) => {
    setSelectedCarForDetailState(car);
    if (car) {
      if (window.location.hash !== `#detail-${car.id}`) {
        window.location.hash = `#detail-${car.id}`;
      }
    } else {
      if (window.location.hash.startsWith('#detail-')) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  };

  // Persist cars on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CARS_KEY, JSON.stringify(cars));
    } catch (e) {
      console.error('Failed to save fleet to localStorage', e);
    }
  }, [cars]);

  // Persist settings on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  const addCar = (newCarData: Omit<ExtendedCar, 'id'>) => {
    const newId = `car-${Date.now()}`;
    const newCar: ExtendedCar = {
      ...newCarData,
      id: newId,
      isAvailable: newCarData.isAvailable ?? true,
      popular: newCarData.popular ?? false
    };
    setCars((prev) => [newCar, ...prev]);
  };

  const updateCar = (id: string, updatedFields: Partial<ExtendedCar>) => {
    setCars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCar = (id: string) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCarAvailability = (id: string) => {
    setCars((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isAvailable: !(c.isAvailable ?? true) } : c
      )
    );
  };

  const updateSettings = (newFields: Partial<CompanySettings>) => {
    setSettings((prev) => ({ ...prev, ...newFields }));
  };

  const resetToDefaults = () => {
    const initialCars = defaultCarsData.map((c) => ({ ...c, isAvailable: true }));
    setCars(initialCars);
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_CARS_KEY);
      localStorage.removeItem(STORAGE_SETTINGS_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <FleetContext.Provider
      value={{
        cars,
        settings,
        selectedCarForDetail,
        setSelectedCarForDetail,
        addCar,
        updateCar,
        deleteCar,
        toggleCarAvailability,
        updateSettings,
        resetToDefaults
      }}
    >
      {children}
    </FleetContext.Provider>
  );
};

export function useFleet() {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
}
