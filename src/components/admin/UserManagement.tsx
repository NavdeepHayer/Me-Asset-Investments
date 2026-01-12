import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/Toast';

interface User {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

export function UserManagement() {
  const { user: currentUser, adminListUsers, adminInviteUser, adminResetUserPassword, adminToggleAdmin, adminDeleteUser } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    const { users: data, error } = await adminListUsers();
    if (error) {
      showToast(error, 'error');
    } else if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setActionLoading('invite');
    const { error } = await adminInviteUser(inviteEmail);
    setActionLoading(null);

    if (error) {
      showToast(error, 'error');
    } else {
      showToast(`Invitation sent to ${inviteEmail}`, 'success');
      setInviteEmail('');
      setShowInviteModal(false);
      loadUsers();
    }
  };

  const handleResetPassword = async (email: string) => {
    setActionLoading(`reset-${email}`);
    const { error } = await adminResetUserPassword(email);
    setActionLoading(null);

    if (error) {
      showToast(error, 'error');
    } else {
      showToast(`Password reset email sent to ${email}`, 'success');
    }
  };

  const handleToggleAdmin = async (userId: string) => {
    setActionLoading(`toggle-${userId}`);
    const { is_admin, error } = await adminToggleAdmin(userId);
    setActionLoading(null);

    if (error) {
      showToast(error, 'error');
    } else {
      showToast(is_admin ? 'User is now an admin' : 'Admin access removed', 'success');
      setUsers(users.map(u => u.id === userId ? { ...u, is_admin: is_admin! } : u));
    }
  };

  const handleDelete = async (userId: string) => {
    setActionLoading(`delete-${userId}`);
    const { error } = await adminDeleteUser(userId);
    setActionLoading(null);
    setShowDeleteConfirm(null);

    if (error) {
      showToast(error, 'error');
    } else {
      showToast('User deleted', 'success');
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white/60">Loading users...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">User Management</h2>
          <p className="text-sm text-white/60 mt-1">
            {users.length} user{users.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Invite User
        </button>
      </div>

      {/* Users Table */}
      <div className="border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Last Sign In
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5">
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {user.full_name || 'No name'}
                    </div>
                    <div className="text-sm text-white/60">{user.email}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {user.email_confirmed_at ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400">
                      Confirmed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-white/60">
                  {formatDate(user.last_sign_in_at)}
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleToggleAdmin(user.id)}
                    disabled={user.id === currentUser?.id || actionLoading === `toggle-${user.id}`}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      user.is_admin ? 'bg-green-500' : 'bg-white/20'
                    } ${user.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        user.is_admin ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleResetPassword(user.email)}
                      disabled={actionLoading === `reset-${user.email}`}
                      className="px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                      title="Send password reset email"
                    >
                      {actionLoading === `reset-${user.email}` ? 'Sending...' : 'Reset Password'}
                    </button>
                    {user.id !== currentUser?.id && (
                      <button
                        onClick={() => setShowDeleteConfirm(user.id)}
                        disabled={actionLoading === `delete-${user.id}`}
                        className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        title="Delete user"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#2d382c] border border-white/20 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Invite User</h3>
              <p className="text-sm text-white/60 mb-4">
                Send an invitation email. The user will be able to set their password without needing to sign up.
              </p>
              <form onSubmit={handleInvite}>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 mb-4"
                  required
                />
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'invite'}
                    className="px-4 py-2 bg-white text-[#2d382c] text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === 'invite' ? 'Sending...' : 'Send Invitation'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#2d382c] border border-white/20 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Delete User</h3>
              <p className="text-sm text-white/60 mb-4">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={actionLoading === `delete-${showDeleteConfirm}`}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {actionLoading === `delete-${showDeleteConfirm}` ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
