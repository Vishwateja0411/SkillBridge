import React, { useState, useEffect } from 'react';
import { History, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { AuditLog } from '@skillbridge/shared';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminAuditLogs().then((res) => {
      if (res.success) setLogs(res.logs);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-500">Loading audit trail...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Administrative Audit Trail</h1>
        <p className="text-xs text-slate-500 mt-1">Immutable security record of all sensitive moderation and administrative operations</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th className="py-3 px-5">Timestamp</th>
              <th className="py-3 px-5">Admin Email</th>
              <th className="py-3 px-5">Action Type</th>
              <th className="py-3 px-5">Target Entity</th>
              <th className="py-3 px-5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="py-3 px-5 text-slate-400">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="py-3 px-5 font-bold text-slate-700">{l.adminEmail}</td>
                <td className="py-3 px-5 font-semibold text-purple-700">{l.action}</td>
                <td className="py-3 px-5 text-slate-500">{l.targetType} #{l.targetId.slice(-6)}</td>
                <td className="py-3 px-5 font-sans text-xs text-slate-600">{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
