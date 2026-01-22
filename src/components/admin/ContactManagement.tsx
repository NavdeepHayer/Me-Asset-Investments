import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ui/Toast';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
  updated_at: string;
}

type StatusFilter = 'all' | 'unread' | 'read' | 'archived';

export function ContactManagement() {
  const { showToast } = useToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Mobile panel state
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const loadSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showToast('Failed to load messages', 'error');
    } else if (data) {
      setSubmissions(data as ContactSubmission[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  // Filter and search submissions
  const filteredSubmissions = useMemo(() => {
    let result = submissions;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(sub =>
        sub.email.toLowerCase().includes(query) ||
        sub.name.toLowerCase().includes(query) ||
        sub.subject.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(sub => sub.status === statusFilter);
    }

    return result;
  }, [submissions, searchQuery, statusFilter]);

  // Count unread
  const unreadCount = useMemo(() => {
    return submissions.filter(s => s.status === 'unread').length;
  }, [submissions]);

  const handleSelectSubmission = async (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setShowMobileDetail(true);

    // Mark as read if unread
    if (submission.status === 'unread') {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: 'read' })
        .eq('id', submission.id);

      if (!error) {
        setSubmissions(submissions.map(s =>
          s.id === submission.id ? { ...s, status: 'read' } : s
        ));
        setSelectedSubmission({ ...submission, status: 'read' });
      }
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'read' | 'archived') => {
    setActionLoading(`status-${id}`);
    const { error } = await supabase
      .from('contact_submissions')
      .update({ status: newStatus })
      .eq('id', id);

    setActionLoading(null);

    if (error) {
      showToast('Failed to update status', 'error');
    } else {
      showToast(`Message ${newStatus === 'archived' ? 'archived' : 'marked as read'}`, 'success');
      setSubmissions(submissions.map(s =>
        s.id === id ? { ...s, status: newStatus } : s
      ));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status: newStatus });
      }
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(`delete-${id}`);
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    setActionLoading(null);
    setShowDeleteConfirm(null);

    if (error) {
      showToast('Failed to delete message', 'error');
    } else {
      showToast('Message deleted', 'success');
      setSubmissions(submissions.filter(s => s.id !== id));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
        setShowMobileDetail(false);
      }
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    showToast('Email copied to clipboard', 'success');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white/60">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Messages</h2>
          <p className="text-sm text-white/60 mt-1">
            {filteredSubmissions.length} message{filteredSubmissions.length !== 1 ? 's' : ''}
            {unreadCount > 0 && (
              <span className="ml-2 text-yellow-400">({unreadCount} unread)</span>
            )}
          </p>
        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="flex-1 flex border border-white/10 overflow-hidden min-h-0">
        {/* Left Panel - Message List */}
        <div className={`w-full md:w-[420px] lg:w-[480px] flex-shrink-0 flex flex-col border-r border-white/10 bg-white/[0.02] ${showMobileDetail ? 'hidden md:flex' : 'flex'}`}>
          {/* Search and Filters */}
          <div className="p-3 border-b border-white/10 space-y-3">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
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
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="archived">Archived</option>
              </select>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 text-sm text-white/60 hover:text-white bg-white/5 border border-white/10 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto">
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-12 text-white/60 text-sm">
                {hasActiveFilters ? 'No messages match your filters' : 'No messages yet'}
              </div>
            ) : (
              filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => handleSelectSubmission(submission)}
                  className={`p-4 border-b border-white/10 cursor-pointer transition-colors ${
                    selectedSubmission?.id === submission.id
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                  } ${submission.status === 'unread' ? 'bg-white/[0.03]' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread Indicator */}
                    <div className="w-2 pt-2">
                      {submission.status === 'unread' && (
                        <span className="w-2 h-2 bg-blue-400 rounded-full block" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm truncate ${submission.status === 'unread' ? 'font-semibold text-white' : 'text-white/90'}`}>
                          {submission.name}
                        </span>
                        <span className="text-xs text-white/50 flex-shrink-0">
                          {formatDate(submission.created_at)}
                        </span>
                      </div>
                      <div className={`text-sm truncate mt-0.5 ${submission.status === 'unread' ? 'font-medium text-white/80' : 'text-white/60'}`}>
                        {submission.subject}
                      </div>
                      <div className="text-xs text-white/40 truncate mt-1">
                        {submission.message.slice(0, 80)}...
                      </div>
                      {submission.status === 'archived' && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-white/10 text-white/50">
                          Archived
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Message Detail */}
        <div className={`flex-1 flex flex-col bg-[#2d382c] ${showMobileDetail ? 'flex' : 'hidden md:flex'}`}>
          {selectedSubmission ? (
            <>
              {/* Detail Header */}
              <div className="p-4 border-b border-white/10">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setShowMobileDetail(false)}
                  className="md:hidden flex items-center gap-2 text-white/60 hover:text-white mb-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>

                {/* Subject */}
                <h3 className="text-xl font-semibold text-white mb-1">
                  {selectedSubmission.subject}
                </h3>
                <p className="text-sm text-white/50">
                  {formatFullDate(selectedSubmission.created_at)}
                </p>
              </div>

              {/* Sender Info */}
              <div className="p-4 border-b border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-medium text-white">
                    {selectedSubmission.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white">{selectedSubmission.name}</div>
                  <div className="text-sm text-white/60 truncate">{selectedSubmission.email}</div>
                </div>
                <button
                  onClick={() => handleCopyEmail(selectedSubmission.email)}
                  className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Copy Email</span>
                </button>
              </div>

              {/* Message Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
                  {selectedSubmission.message}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-white/10 flex flex-wrap gap-3">
                {selectedSubmission.status !== 'archived' ? (
                  <button
                    onClick={() => handleUpdateStatus(selectedSubmission.id, 'archived')}
                    disabled={actionLoading === `status-${selectedSubmission.id}`}
                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Archive
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(selectedSubmission.id, 'read')}
                    disabled={actionLoading === `status-${selectedSubmission.id}`}
                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Unarchive
                  </button>
                )}
                <button
                  onClick={() => setShowDeleteConfirm(selectedSubmission.id)}
                  className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center text-white/40">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p>Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>

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
              <h3 className="text-lg font-semibold text-white mb-4">Delete Message</h3>
              <p className="text-sm text-white/60 mb-4">
                Are you sure you want to delete this message? This action cannot be undone.
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
                  {actionLoading === `delete-${showDeleteConfirm}` ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
