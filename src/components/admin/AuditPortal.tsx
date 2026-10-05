/**
 * MASMS - Immutable Event Audit Trail & Compliance Portal
 * Implements FR-AD-001, FR-AD-002, FR-AD-003 modules
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Clock,
  Laptop,
} from 'lucide-react';

export const AuditPortal: React.FC = () => {
  const { auditLogs } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.new_value && log.new_value.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || log.actor_role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-slate-400/30 flex items-center justify-center text-slate-800 font-bold text-xl">
            🔒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">System Audit Trail & Compliance Console</h2>
              <span className="text-xs bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded-full font-mono">
                Immutable WORM Log (FR-AD)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Complete tamper-proof digital log of registrations, GPS check-ins, approvals, payments, and policy changes (SOP Sec. 13).
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Exporting full audit trail log in CSV/JSON format for CAG/Department Audit.')}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Export Audit Trail
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Event Type, Entity ID, Actor Name, or Diff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Filter by Actor Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg text-xs font-semibold"
          >
            <option value="ALL">All Roles</option>
            <option value="FARMER">Farmer</option>
            <option value="VENDOR">Vendor</option>
            <option value="TALUK_AO">Taluk AO</option>
            <option value="DISTRICT_OFFICER">District Officer</option>
            <option value="FINANCE_OFFICER">Finance Officer</option>
            <option value="STATE_ADMIN">State Admin</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-900">
            Recorded System Events ({filteredLogs.length})
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Timestamp Source: NTP Synchronized State Cloud Clock
          </span>
        </div>

        <div className="divide-y divide-slate-100 font-mono text-xs">
          {filteredLogs.map((log) => (
            <div key={log.audit_id} className="py-3 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {log.audit_id}
                  </span>
                  <span className="font-bold text-emerald-800 text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                    {log.event_type}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {log.entity} · {log.entity_id}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{log.timestamp}</span>
                </div>
              </div>

              <div className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] flex flex-col gap-1">
                <div>
                  <span className="text-slate-400">Actor: </span>
                  <strong>{log.actor_name}</strong> ({log.actor_role})
                </div>
                {log.old_value && (
                  <div>
                    <span className="text-rose-600 font-semibold">Prev Value: </span>
                    <span className="text-slate-600">{log.old_value}</span>
                  </div>
                )}
                {log.new_value && (
                  <div>
                    <span className="text-emerald-700 font-semibold">New Value / Action: </span>
                    <span className="text-slate-800">{log.new_value}</span>
                  </div>
                )}
                <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-4 pt-1 border-t border-slate-200/60">
                  <span>GPS: {log.gps_coords}</span>
                  <span>IP: {log.ip_address}</span>
                  <span>Device: {log.device_info}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
