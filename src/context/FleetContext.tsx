import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultCarsData from '../data/cars.json';
import { Car, LA_TRANSPORT_WA_PHONE, LA_TRANSPORT_OFFICE_ADDRESS } from '../utils/whatsapp';

export interface ExtendedCar extends Car {
  isAvailable?: boolean; // Status ketersediaan: true (Ready) / false (Sedang Tersewa / Servis)
}

export interface CompanySettings {
  whatsappNumber: string;
  officeAddress: string;
  instagramUrl: string;
  tiktokUrl: string;
  mapsUrl: string;
  openingHours: string;
}

const DEFAULT_SETTINGS: CompanySettings = {
  whatsappNumber: LA_TRANSPORT_WA_PHONE,
  officeAddress: LA_TRANSPORT_OFFICE_ADDRESS,
  instagramUrl: 'https://instagram.com/latransportbatam',
  tiktokUrl: 'https://tiktok.com/@latransportbatam',
  mapsUrl: 'https://maps.google.com/?q=LA+Transport+Batam',
  openingHours: '24 Jam (Setiap Hari)'
};

interface FleetContextType {
  cars: ExtendedCar[];
  settings: CompanySettings;
  addCar: (car: Omit<ExtendedCar, 'id'>) => void;
  updateCar: (id: string, updatedCar: Partial<ExtendedCar>) => void;
  deleteCar: (id: string) => void;
  toggleCarAvailability: (id: string) => void;
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  resetToDefaults: () => void;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

const STORAGE_CARS_KEY = 'la_transport_fleet_v1';
const STORAGE_SETTINGS_KEY = 'la_transport_settings_v1';

export const FleetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<ExtendedCar[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CARS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return defaultCarsData.map((c) => ({ ...c, isAvailable: true }));
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
