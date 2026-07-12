import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CosmicCanvas from '../components/CosmicCanvas';
import { Navigate } from 'react-router-dom';

export default function AdminPanel() {
  const { user, role, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && role === 'admin') {
      fetchUsers();
    }
  }, [isAuthenticated, role]);

  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/approve`, {
        method: 'PUT',
        credentials: 'include'
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/reject`, {
        method: 'PUT',
        credentials: 'include'
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (id, newRole, newStatus) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole, status: newStatus })
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const pendingUsers = users.filter(u => u.status === 'pending_approval');
  const rosterUsers = users.filter(u => u.status !== 'pending_approval');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-body">
      <CosmicCanvas />
      <Navbar />

      <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl">Admin Portal</h1>
            <p className="text-slate-400 mt-2">Manage access requests and system roles.</p>
          </div>
          
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'requests' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              Requests {pendingUsers.length > 0 && <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingUsers.length}</span>}
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'roster' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              Users Roster
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">Loading users...</div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
            {activeTab === 'requests' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
                {pendingUsers.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">No pending access requests.</div>
                ) : (
                  <div className="relative border-l border-white/10 ml-4 space-y-8 pl-8">
                    {pendingUsers.map(u => (
                      <div key={u._id} className="relative group">
                        <div className="absolute -left-[41px] top-4 w-5 h-5 rounded-full bg-blue-500/20 border-2 border-blue-500 z-10 group-hover:scale-125 transition-transform" />
                        <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-lg">{u.username}</h3>
                            <p className="text-sm text-slate-400">{u.email}</p>
                            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                              Requested: {u.requestedRole?.replace('_', ' ')}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleReject(u._id)}
                              className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(u._id)}
                              className="px-6 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 transition-all font-bold"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'roster' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Users Roster</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-sm uppercase tracking-wider">
                        <th className="p-4 font-medium">User</th>
                        <th className="p-4 font-medium">Role</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {rosterUsers.map(u => (
                        <tr key={u._id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="font-bold">{u.username}</div>
                            <div className="text-xs text-slate-400">{u.email}</div>
                          </td>
                          <td className="p-4">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value, u.status)}
                              className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                              disabled={u.email === user.email} // Prevent self-demotion
                            >
                              <option value="unassigned">Unassigned</option>
                              <option value="production_staff">Production Staff</option>
                              <option value="warehouse_supervisor">Warehouse Supervisor</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <select
                              value={u.status}
                              onChange={(e) => handleRoleChange(u._id, u.role, e.target.value)}
                              className={`border rounded-lg px-3 py-1.5 text-sm focus:outline-none ${
                                u.status === 'active' ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400' :
                                u.status === 'suspended' ? 'bg-red-900/30 border-red-500/30 text-red-400' :
                                'bg-slate-900 border-white/10 text-slate-300'
                              }`}
                              disabled={u.email === user.email}
                            >
                              <option value="active">Active</option>
                              <option value="suspended">Suspended</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="p-4">
                            {u.email !== user.email && (
                              <button
                                onClick={() => handleRoleChange(u._id, 'unassigned', 'suspended')}
                                className="text-red-400 hover:text-red-300 text-sm font-medium"
                              >
                                Revoke Access
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
