import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, ShieldAlert, CheckCircle2, UserCheck, X } from 'lucide-react';
import { api } from '../../services/api';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState('');

  const fetchUsers = async () => {
    const res = await api.getAdminUsers();
    if (res.success) setUsers(res.users);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleVerification = async (userId: string) => {
    const res = await api.toggleUserVerification(userId);
    if (res.success) {
      setActionNotice('User verification status updated and audit logged!');
      await fetchUsers();
      setTimeout(() => setActionNotice(''), 3000);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 text-slate-500">Loading user registry...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Directory & Verification</h1>
        <p className="text-xs text-slate-500 mt-1">Review profiles, verify identity credentials, and enforce platform standards</p>
      </div>

      {actionNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice('')} className="text-emerald-500 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="w-full text-xs text-slate-800 focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th className="py-3 px-5">User</th>
              <th className="py-3 px-5">Role</th>
              <th className="py-3 px-5">Verification Status</th>
              <th className="py-3 px-5">Registered Date</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                      alt={u.name}
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 capitalize font-semibold text-slate-700">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 font-bold'
                        : u.role === 'business'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-5">
                  {u.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Unverified
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-5 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="py-3.5 px-5 text-right">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => handleToggleVerification(u.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors ${
                        u.isVerified
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-brand-teal hover:bg-teal-400 text-slate-900'
                      }`}
                    >
                      {u.isVerified ? 'Revoke Badge' : 'Grant Verified Badge'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
