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

  if (loading) return <div className="text-center py-20 text-[#BFD0C6]">Loading audit trail...</div>;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
          SECURITY LOGS
        </div>
        <h1 className="font-serif text-3xl font-medium text-[#F6F1E4] mt-1">
          Administrative <span className="italic text-[#E5CB86]">Audit Trail</span>
        </h1>
        <p className="text-xs text-[#BFD0C6] mt-1">Immutable security record of all sensitive moderation and administrative operations</p>
      </div>

      <div className="bg-[#114A39] rounded-[12px] border border-[#1F5A46] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#072A20] text-[#9DB5A8] uppercase tracking-wider text-[10px] font-medium border-b border-[#1F5A46]">
            <tr>
              <th className="py-3 px-5">Timestamp</th>
              <th className="py-3 px-5">Admin Email</th>
              <th className="py-3 px-5">Action Type</th>
              <th className="py-3 px-5">Target Entity</th>
              <th className="py-3 px-5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F5A46] font-mono text-[11px]">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-[#0B3D2E]/50 transition-colors">
                <td className="py-3 px-5 text-[#9DB5A8]">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="py-3 px-5 font-sans font-medium text-[#F6F1E4]">{l.adminEmail}</td>
                <td className="py-3 px-5 font-medium text-[#E5CB86]">{l.action}</td>
                <td className="py-3 px-5 text-[#9DB5A8]">{l.targetType} #{l.targetId.slice(-6)}</td>
                <td className="py-3 px-5 font-sans text-xs text-[#BFD0C6]">{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
