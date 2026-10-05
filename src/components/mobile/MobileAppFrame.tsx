/**
 * MASMS - Mobile Application Simulator Frame
 * Simulates Android/iOS field app experience for Farmers & Service Providers (Tractor Owners).
 * Adapts fluidly to real mobile screens as well as simulated smartphone shells on desktop.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { FarmerPortal } from '../farmer/FarmerPortal';
import { VendorPortal } from '../vendor/VendorPortal';
import {
  Wifi,
  Battery,
  Signal,
  Home,
  Tractor,
} from 'lucide-react';

export const MobileAppFrame: React.FC = () => {
  const { role, setRole } = useApp();

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[80vh] px-0 sm:px-4 py-2 sm:py-6">
      <div className="text-center mb-3 hidden sm:block">
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          📱 Mobile Application Simulator (Android / iOS)
        </span>
        <p className="text-xs text-slate-500 mt-1">
          Simulates the field mobile client for Farmers & Mechanization Service Providers with offline auto-sync.
        </p>
      </div>

      {/* Realistic Smartphone Shell on sm+ screens, and edge-to-edge container on mobile */}
      <div className="w-full sm:max-w-[430px] sm:h-[820px] bg-slate-950 sm:rounded-[44px] sm:p-2.5 sm:shadow-2xl sm:border-4 sm:border-slate-800 relative flex flex-col sm:ring-6 sm:ring-slate-900/20 rounded-xl overflow-hidden">
        {/* Dynamic Island / Speaker Notch (Desktop simulator only) */}
        <div className="hidden sm:flex absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-50 items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900/80 mr-4"></div>
          <div className="w-2 h-2 rounded-full bg-blue-950/80"></div>
        </div>

        {/* Screen Bezel */}
        <div className="w-full h-full bg-slate-50 sm:rounded-[36px] overflow-hidden flex flex-col relative min-h-[75vh] sm:min-h-0">
          {/* Mobile Top Status Bar */}
          <div className="bg-emerald-900 text-white px-4 sm:px-6 pt-2 sm:pt-3 pb-2 text-[11px] flex items-center justify-between font-mono select-none shrink-0">
            <span className="font-bold">09:41</span>
            <div className="flex items-center gap-2">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* App Content Scrollable Viewport */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
            {role === 'FARMER' && <FarmerPortal />}
            {role === 'VENDOR' && <VendorPortal />}
            {role !== 'FARMER' && role !== 'VENDOR' && (
              <div className="p-4 text-center space-y-3 my-auto">
                <div className="text-sm font-bold text-slate-800">
                  Mobile view is designed for Farmers & Service Providers.
                </div>
                <p className="text-xs text-slate-500">
                  Switch to Farmer or Vendor role to test the mobile touch interface.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => setRole('FARMER')}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Farmer App
                  </button>
                  <button
                    onClick={() => setRole('VENDOR')}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Vendor App
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Mobile Navigation Bar */}
          <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around text-[10px] text-slate-500 select-none shrink-0">
            <button
              onClick={() => setRole('FARMER')}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-md transition-colors ${
                role === 'FARMER' ? 'text-emerald-700 font-bold' : 'hover:text-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Farmer</span>
            </button>
            <button
              onClick={() => setRole('VENDOR')}
              className={`flex flex-col items-center gap-0.5 p-1 rounded-md transition-colors ${
                role === 'VENDOR' ? 'text-amber-700 font-bold' : 'hover:text-slate-800'
              }`}
            >
              <Tractor className="w-4 h-4" />
              <span>Vendor</span>
            </button>
          </div>

          {/* Home Indicator Bar */}
          <div className="w-28 h-1 bg-slate-400 rounded-full mx-auto my-1.5 shrink-0"></div>
        </div>
      </div>
    </div>
  );
};
