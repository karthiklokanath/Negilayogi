/**
 * MASMS - State Administrator Portal Component
 * Implements FR-SM-001, FR-SRM-001, FR-SYS-001 (Scheme Configuration & Master Data)
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FormLabel } from '../common/FormLabel';
import { SchemeConfig } from '../../types/masms';
import {
  ShieldCheck,
  Settings2,
  Sliders,
  CheckCircle2,
  Layers,
  Database,
  Save,
  RotateCcw,
  Plus,
} from 'lucide-react';

export const StateAdminPortal: React.FC = () => {
  const { schemeConfig, updateSchemeConfig } = useApp();

  const [formData, setFormData] = useState<SchemeConfig>(schemeConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchemeConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-rose-100 border-2 border-rose-500/30 flex items-center justify-center text-rose-800 font-bold text-xl">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">State Scheme & Policy Administration</h2>
              <span className="text-xs bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
                Department of Agriculture (Headquarters)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Configure scheme parameters, operations master, rate ceilings, geofencing rules & matching weights (BR-029).
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Scheme Parameters Updated & Audited
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Scheme Incentive Rules (FR-SM-001) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-600" />
            <span>Scheme Ceiling & Financial Rules (BR-001, BR-002, BR-003)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
            <div>
              <FormLabel label="Financial Year" required />
              <input
                type="text"
                value={formData.financial_year}
                onChange={(e) => setFormData({ ...formData, financial_year: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <FormLabel label="Subsidy Rate (₹ per Acre / Operation)" required />
              <input
                type="number"
                value={formData.subsidy_rate_per_acre}
                onChange={(e) =>
                  setFormData({ ...formData, subsidy_rate_per_acre: Number(e.target.value) })
                }
                className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-emerald-800"
              />
            </div>
            <div>
              <FormLabel label="Max Land Subsidy Ceiling (Acres)" required />
              <input
                type="number"
                step="0.1"
                value={formData.max_eligible_acres_per_farmer}
                onChange={(e) =>
                  setFormData({ ...formData, max_eligible_acres_per_farmer: Number(e.target.value) })
                }
                className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <FormLabel label="Max Operations / Year / Farmer" required />
              <input
                type="number"
                value={formData.max_operations_per_year}
                onChange={(e) =>
                  setFormData({ ...formData, max_operations_per_year: Number(e.target.value) })
                }
                className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* GIS & Geofencing Parameters */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-blue-600" />
            <span>GIS Geofence & Provider Matching Algorithm Weights (BR-020, BR-027)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <FormLabel label="Geofence Radius (Meters)" required />
              <input
                type="number"
                value={formData.geofence_radius_meters}
                onChange={(e) =>
                  setFormData({ ...formData, geofence_radius_meters: Number(e.target.value) })
                }
                className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Default: 100m</span>
            </div>
            <div>
              <FormLabel label="Distance Weight (%)" required />
              <input
                type="number"
                value={formData.matching_weights.distance}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    matching_weights: { ...formData.matching_weights, distance: Number(e.target.value) },
                  })
                }
                className="w-full p-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <FormLabel label="Availability Weight (%)" required />
              <input
                type="number"
                value={formData.matching_weights.availability}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    matching_weights: { ...formData.matching_weights, availability: Number(e.target.value) },
                  })
                }
                className="w-full p-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <FormLabel label="Equipment Match Weight (%)" required />
              <input
                type="number"
                value={formData.matching_weights.equipment_match}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    matching_weights: { ...formData.matching_weights, equipment_match: Number(e.target.value) },
                  })
                }
                className="w-full p-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <FormLabel label="Rating Weight (%)" required />
              <input
                type="number"
                value={formData.matching_weights.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    matching_weights: { ...formData.matching_weights, rating: Number(e.target.value) },
                  })
                }
                className="w-full p-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        {/* Operations Master & Department Rate Ceilings (FR-SRM-001) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Mechanized Operations Master & Maximum Rate Ceilings (FR-SRM-002)</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {formData.rate_ceilings.map((op, idx) => (
              <div key={op.operation_code} className="py-2.5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{op.operation_name}</span>
                  <span className="text-[11px] text-slate-500">{op.operation_name_kn}</span>
                </div>
                <div className="font-mono text-slate-500">
                  Code: <strong className="text-slate-800">{op.operation_code}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Max Ceiling / Ac:</span>
                  <input
                    type="number"
                    value={op.max_rate_per_acre}
                    onChange={(e) => {
                      const updated = [...formData.rate_ceilings];
                      updated[idx].max_rate_per_acre = Number(e.target.value);
                      setFormData({ ...formData, rate_ceilings: updated });
                    }}
                    className="w-24 p-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Max Ceiling / Hr:</span>
                  <input
                    type="number"
                    value={op.max_rate_per_hour}
                    onChange={(e) => {
                      const updated = [...formData.rate_ceilings];
                      updated[idx].max_rate_per_hour = Number(e.target.value);
                      setFormData({ ...formData, rate_ceilings: updated });
                    }}
                    className="w-24 p-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save & Publish Scheme Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
