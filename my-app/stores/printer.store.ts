import { create } from 'zustand';
import type { PrinterDevice, PrinterSettings } from '@/types';
import { DEFAULT_PRINTER_SETTINGS } from '@/constants/quick-notes';

interface PrinterState {
  device: PrinterDevice | null;
  settings: PrinterSettings;
  isConnecting: boolean;
  isScanning: boolean;
  availableDevices: PrinterDevice[];
  lastError: string | null;
  
  // Actions
  setDevice: (device: PrinterDevice | null) => void;
  setSettings: (settings: Partial<PrinterSettings>) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  setIsScanning: (isScanning: boolean) => void;
  setAvailableDevices: (devices: PrinterDevice[]) => void;
  setLastError: (error: string | null) => void;
  disconnect: () => void;
}

export const usePrinterStore = create<PrinterState>((set) => ({
  device: null,
  settings: DEFAULT_PRINTER_SETTINGS,
  isConnecting: false,
  isScanning: false,
  availableDevices: [],
  lastError: null,

  setDevice: (device) => {
    set({ device, lastError: null });
  },

  setSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },

  setIsConnecting: (isConnecting) => {
    set({ isConnecting });
  },

  setIsScanning: (isScanning) => {
    set({ isScanning });
  },

  setAvailableDevices: (availableDevices) => {
    set({ availableDevices });
  },

  setLastError: (lastError) => {
    set({ lastError });
  },

  disconnect: () => {
    set({ device: null });
  },
}));
