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

  if (loading) return <div className="text-center py-20 text-[#BFD0C6]">Loading user registry...</div>;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
          PLATFORM ADMINISTRATION
        </div>
        <h1 className="font-serif text-3xl font-medium text-[#F6F1E4] mt-1">
          User Directory & <span className="italic text-[#E5CB86]">Verification</span>
        </h1>
        <p className="text-xs text-[#BFD0C6] mt-1">Review profiles, verify identity credentials, and enforce platform standards</p>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-[6px] bg-[#114A39] border border-[#7BC49A] text-[#7BC49A] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7BC49A]" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice('')} className="text-[#7BC49A] hover:text-[#F6F1E4]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-[#114A39] p-4 rounded-[12px] border border-[#1F5A46] flex items-center gap-3">
        <Search className="w-4 h-4 text-[#9DB5A8]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="w-full text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] bg-transparent focus:outline-none"
        />
      </div>

      <div className="bg-[#114A39] rounded-[12px] border border-[#1F5A46] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#072A20] text-[#9DB5A8] uppercase tracking-wider text-[10px] font-medium border-b border-[#1F5A46]">
            <tr>
              <th className="py-3 px-5">User</th>
              <th className="py-3 px-5">Role</th>
              <th className="py-3 px-5">Verification Status</th>
              <th className="py-3 px-5">Registered Date</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F5A46]">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-[#0B3D2E]/50 transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                      alt={u.name}
                      className="w-8 h-8 rounded-full border border-[#1F5A46] object-cover"
                    />
                    <div>
                      <div className="font-medium text-sm text-[#F6F1E4]">{u.name}</div>
                      <div className="text-[11px] text-[#9DB5A8]">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 capitalize font-medium text-[#BFD0C6]">
                  <span
                    className={`px-2.5 py-0.5 rounded-[4px] text-[10px] border ${
                      u.role === 'admin'
                        ? 'bg-[#072A20] border-[#E5CB86] text-[#E5CB86]'
                        : u.role === 'business'
                          ? 'bg-[#072A20] border-[#1F5A46] text-[#BFD0C6]'
                          : 'bg-[#072A20] border-[#7BC49A] text-[#7BC49A]'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-5">
                  {u.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7BC49A] bg-[#072A20] border border-[#7BC49A] px-2 py-0.5 rounded-[4px]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#9DB5A8] bg-[#072A20] border border-[#1F5A46] px-2 py-0.5 rounded-[4px]">
                      Unverified
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-5 text-[#9DB5A8]">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="py-3.5 px-5 text-right">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => handleToggleVerification(u.id)}
                      className={`px-3 py-1.5 rounded-[6px] font-medium text-[11px] transition-colors border ${
                        u.isVerified
                          ? 'bg-[#072A20] hover:bg-[#114A39] text-[#BFD0C6] border-[#1F5A46]'
                          : 'bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] border-transparent'
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
