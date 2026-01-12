import { useState, useEffect, useMemo } from 'react';
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

type StatusFilter = 'all' | 'confirmed' | 'pending';
type RoleFilter = 'all' | 'admin' | 'user';

const USERS_PER_PAGE = 10;

export function UserManagement() {
  const { user: currentUser, adminListUsers, adminInviteUser, adminResetUserPassword, adminToggleAdmin, adminDeleteUser } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Mobile action menu state
  const [mobileActionUser, setMobileActionUser] = useState<string | null>(null);

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

  // Filter and search users
  const filteredUsers = useMemo(() => {
    let result = users;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user =>
        user.email.toLowerCase().includes(query) ||
        (user.full_name && user.full_name.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => {
        if (statusFilter === 'confirmed') return user.email_confirmed_at !== null;
        if (statusFilter === 'pending') return user.email_confirmed_at === null;
        return true;
      });
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => {
        if (roleFilter === 'admin') return user.is_admin;
        if (roleFilter === 'user') return !user.is_admin;
        return true;
      });
    }

    return result;
  }, [users, searchQuery, statusFilter, roleFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, roleFilter]);

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
    setMobileActionUser(null);
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
    setMobileActionUser(null);

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

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setRoleFilter('all');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || roleFilter !== 'all';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">User Management</h2>
          <p className="text-sm text-white/60 mt-1">
            {filteredUsers.length} of {users.length} user{users.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Invite User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3 py-2 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            className="px-3 py-2 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border border-white/10 overflow-hidden">
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
            {paginatedUsers.map((user) => (
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {paginatedUsers.map((user) => (
          <div key={user.id} className="bg-white/5 border border-white/10 p-4">
            {/* User Info Row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {user.full_name || 'No name'}
                </div>
                <div className="text-sm text-white/60 truncate">{user.email}</div>
              </div>

              {/* Mobile Action Menu Button */}
              <button
                onClick={() => setMobileActionUser(mobileActionUser === user.id ? null : user.id)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            {/* Status and Admin Row */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-3">
                {user.email_confirmed_at ? (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400">
                    Confirmed
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400">
                    Pending
                  </span>
                )}
                {user.is_admin && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400">
                    Admin
                  </span>
                )}
              </div>
              <div className="text-xs text-white/50">
                {formatDate(user.last_sign_in_at)}
              </div>
            </div>

            {/* Admin Toggle Row */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <span className="text-sm text-white/60">Admin Access</span>
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
            </div>

            {/* Mobile Action Menu */}
            <AnimatePresence>
              {mobileActionUser === user.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <button
                      onClick={() => handleResetPassword(user.email)}
                      disabled={actionLoading === `reset-${user.email}`}
                      className="w-full px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      {actionLoading === `reset-${user.email}` ? 'Sending...' : 'Reset Password'}
                    </button>
                    {user.id !== currentUser?.id && (
                      <button
                        onClick={() => {
                          setMobileActionUser(null);
                          setShowDeleteConfirm(user.id);
                        }}
                        disabled={actionLoading === `delete-${user.id}`}
                        className="w-full px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete User
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {paginatedUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/60">
            {hasActiveFilters ? 'No users match your filters' : 'No users found'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-2 text-sm text-white/40 hover:text-white/60 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-white/60">
            Showing {((currentPage - 1) * USERS_PER_PAGE) + 1} to {Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="px-3 py-1.5 text-sm text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Last
            </button>
          </div>
        </div>
      )}

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
