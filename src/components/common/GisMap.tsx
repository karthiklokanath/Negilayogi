/**
 * MASMS Interactive GIS & Geofencing Map Component
 * Visualizes cadastral land boundaries, 100m geofence radius, GPS check-in marker, and photo geotag pins.
 */

import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { calculateDistanceMeters } from '../../context/AppContext';

interface GisMapProps {
  centerLat?: number;
  centerLng?: number;
  farmPolygon?: [number, number][];
  checkinPoint?: { lat: number; lng: number; status: 'PASS' | 'EXCEPTION_BREACH' };
  photoPins?: { lat: number; lng: number; label: string; phase: string }[];
  geofenceRadiusMeters?: number;
  interactiveCheckin?: boolean;
  onCheckinSelect?: (lat: number, lng: number, distance: number) => void;
  surveyNo?: string;
  villageName?: string;
  heightClass?: string;
}

export const GisMap: React.FC<GisMapProps> = ({
  centerLat = 12.6842,
  centerLng = 76.5714,
  farmPolygon = [
    [12.6842, 76.5714],
    [12.6855, 76.5728],
    [12.6838, 76.5735],
    [12.6829, 76.5721],
  ],
  checkinPoint,
  photoPins = [],
  geofenceRadiusMeters = 100,
  interactiveCheckin = false,
  onCheckinSelect,
  surveyNo = '142/2A',
  villageName = 'Chinya, Pandavapura',
  heightClass = 'h-64 sm:h-72',
}) => {
  const [mapLayer, setMapLayer] = useState<'cadastral' | 'satellite'>('cadastral');
  const [simulatedLat, setSimulatedLat] = useState<number>(checkinPoint?.lat || centerLat + 0.0002);
  const [simulatedLng, setSimulatedLng] = useState<number>(checkinPoint?.lng || centerLng + 0.0003);

  const currentDist = calculateDistanceMeters(simulatedLat, simulatedLng, centerLat, centerLng);
  const isInsideGeofence = currentDist <= geofenceRadiusMeters;

  const handleSimulateInside = () => {
    const newLat = centerLat + 0.0002;
    const newLng = centerLng + 0.0002;
    setSimulatedLat(newLat);
    setSimulatedLng(newLng);
    const d = calculateDistanceMeters(newLat, newLng, centerLat, centerLng);
    if (onCheckinSelect) onCheckinSelect(newLat, newLng, d);
  };

  const handleSimulateBreach = () => {
    const newLat = centerLat + 0.0014; // ~150 meters away
    const newLng = centerLng + 0.0012;
    setSimulatedLat(newLat);
    setSimulatedLng(newLng);
    const d = calculateDistanceMeters(newLat, newLng, centerLat, centerLng);
    if (onCheckinSelect) onCheckinSelect(newLat, newLng, d);
  };

  return (
    <div className={`relative w-full ${heightClass} bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-inner flex flex-col`}>
      {/* Top Map HUD Controls */}
      <div className="absolute top-2 left-2 right-2 z-20 flex flex-wrap items-center justify-between gap-1.5 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] sm:text-xs text-slate-200 flex items-center gap-1.5 shadow-sm max-w-full truncate">
          <Compass className="w-3 h-3 text-emerald-400 shrink-0 animate-spin" style={{ animationDuration: '12s' }} />
          <span className="font-semibold text-emerald-400 shrink-0">KSRSAC GIS</span>
          <span className="text-slate-500">|</span>
          <span className="truncate">Sy: <strong className="text-white">{surveyNo}</strong></span>
          <span className="text-slate-400 hidden xs:inline truncate">({villageName})</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-lg p-0.5 border border-slate-700 flex text-[10px] sm:text-[11px]">
            <button
              onClick={() => setMapLayer('cadastral')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                mapLayer === 'cadastral' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              RTC
            </button>
            <button
              onClick={() => setMapLayer('satellite')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                mapLayer === 'satellite' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sat
            </button>
          </div>
        </div>
      </div>

      {/* SVG GIS Layer Map Canvas */}
      <div className="relative flex-1 w-full h-full">
        <svg className="w-full h-full" viewBox="0 0 500 280" preserveAspectRatio="none">
          {/* Background Grid Pattern */}
          <defs>
            <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke={mapLayer === 'satellite' ? '#1e3a2b' : '#1e293b'} strokeWidth="0.8" />
            </pattern>
            <linearGradient id="farmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={mapLayer === 'satellite' ? '#10b981' : '#059669'} stopOpacity="0.45" />
              <stop offset="100%" stopColor={mapLayer === 'satellite' ? '#047857' : '#065f46'} stopOpacity="0.65" />
            </linearGradient>
            <radialGradient id="geofenceGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="85%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
            </radialGradient>
          </defs>

          {/* Map Base Canvas */}
          <rect
            width="100%"
            height="100%"
            fill={mapLayer === 'satellite' ? '#0c1f17' : '#0f172a'}
          />
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Surrounding Adjacent Land Parcels */}
          <polygon points="40,20 180,30 160,110 30,95" fill="#334155" fillOpacity="0.25" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
          <polygon points="320,30 460,40 470,130 330,120" fill="#334155" fillOpacity="0.25" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
          <polygon points="80,180 200,190 190,260 70,250" fill="#334155" fillOpacity="0.25" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
          <polygon points="310,190 450,180 440,260 300,250" fill="#334155" fillOpacity="0.25" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />

          {/* Road / Cart track line */}
          <path d="M 0,140 Q 250,130 500,145" fill="none" stroke="#64748b" strokeWidth="2.5" strokeDasharray="6 4" />
          <text x="380" y="135" fill="#94a3b8" fontSize="9" className="select-none font-mono">Village Cart Track</text>

          {/* 100m Geofence Buffer Zone Circle around Centroid (250, 130) */}
          <circle
            cx="250"
            cy="130"
            r="85"
            fill="url(#geofenceGrad)"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text x="250" y="224" textAnchor="middle" fill="#60a5fa" fontSize="9" className="select-none font-medium">
            100m Scheme Geofence Radius (VAL-WRK-01)
          </text>

          {/* Target Farm Parcel Polygon (Registered in FRUITS / KSRSAC) */}
          <polygon
            points="200,90 300,80 315,165 190,175"
            fill="url(#farmGrad)"
            stroke="#10b981"
            strokeWidth="2.5"
          />

          {/* Parcel Survey Label */}
          <text x="250" y="125" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" className="select-none">
            {surveyNo} (2.0 Ac)
          </text>
          <text x="250" y="140" textAnchor="middle" fill="#a7f3d0" fontSize="9" className="select-none">
            {villageName}
          </text>

          {/* Photo Pins */}
          {photoPins.map((p, idx) => (
            <g key={idx} transform={`translate(${230 + idx * 40}, ${105 + idx * 30})`}>
              <circle r="7" fill={p.phase === 'BEFORE_WORK' ? '#eab308' : '#10b981'} stroke="#ffffff" strokeWidth="1.5" />
              <text y="3" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="bold">{idx + 1}</text>
            </g>
          ))}

          {/* Current GPS Check-in Simulation Position */}
          {interactiveCheckin ? (
            <g transform={`translate(${isInsideGeofence ? 260 : 370}, ${isInsideGeofence ? 120 : 70})`}>
              <circle r="14" fill={isInsideGeofence ? '#10b981' : '#ef4444'} fillOpacity="0.3" className="animate-ping" />
              <circle r="8" fill={isInsideGeofence ? '#10b981' : '#ef4444'} stroke="#ffffff" strokeWidth="2" />
              <text y="-12" textAnchor="middle" fill={isInsideGeofence ? '#34d399' : '#f87171'} fontSize="10" fontWeight="bold">
                Tractor GPS ({currentDist}m)
              </text>
            </g>
          ) : checkinPoint ? (
            <g transform={`translate(${checkinPoint.status === 'PASS' ? 260 : 370}, ${checkinPoint.status === 'PASS' ? 120 : 70})`}>
              <circle r="8" fill={checkinPoint.status === 'PASS' ? '#10b981' : '#ef4444'} stroke="#ffffff" strokeWidth="2" />
              <text y="-12" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                Check-in Point
              </text>
            </g>
          ) : null}
        </svg>

        {/* Legend Overlay at Bottom */}
        <div className="absolute bottom-2 left-2 right-2 z-20 flex flex-wrap items-center justify-between gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] sm:text-[11px] text-slate-300">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block"></span>
              <span>Boundary</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full border border-blue-400 bg-blue-500/20 inline-block"></span>
              <span>100m Geofence</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              <span>Geotags</span>
            </span>
          </div>

          {interactiveCheckin && (
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-slate-400 hidden xs:inline">GPS:</span>
              <button
                type="button"
                onClick={handleSimulateInside}
                className="px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-[9px] sm:text-[10px] flex items-center gap-1"
              >
                <CheckCircle2 className="w-2.5 h-2.5" />
                Inside (32m)
              </button>
              <button
                type="button"
                onClick={handleSimulateBreach}
                className="px-2 py-0.5 rounded bg-rose-700 hover:bg-rose-600 text-white font-medium text-[9px] sm:text-[10px] flex items-center gap-1"
              >
                <AlertTriangle className="w-2.5 h-2.5" />
                Breach (155m)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
