import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ui/Toast';

interface SiteContent {
  id: string;
  content: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  display_order: number;
  visible: boolean;
}

type ContentSection = 'text' | 'team';

const contentLabels: Record<string, string> = {
  intro: 'Introduction',
  investmentFocus: 'Investment Focus',
  savePhilosophy: 'SAVE Philosophy',
  approach: 'Approach',
  mission: 'Mission',
  footer_copyright: 'Footer Copyright',
  footer_contact_email: 'Contact Email',
  footer_contact_person: 'Contact Person',
};

const emptyTeamMember: Omit<TeamMember, 'id'> = {
  name: '',
  role: '',
  bio: '',
  image: '',
  display_order: 0,
  visible: true,
};

export function ContentManagement() {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<ContentSection>('text');

  // Site content state
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [savingContent, setSavingContent] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});

  // Team members state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isCreatingMember, setIsCreatingMember] = useState(false);
  const [savingMember, setSavingMember] = useState(false);
  const [deleteMemberConfirm, setDeleteMemberConfirm] = useState<string | null>(null);

  // Load site content
  const loadSiteContent = async () => {
    setContentLoading(true);
    const { data, error } = await supabase
      .from('site_content')
      .select('*');

    if (error) {
      showToast('Failed to load content', 'error');
      console.error(error);
    } else {
      setSiteContent(data || []);
      // Initialize edited content
      const initial: Record<string, string> = {};
      data?.forEach(item => {
        initial[item.id] = item.content;
      });
      setEditedContent(initial);
    }
    setContentLoading(false);
  };

  // Load team members
  const loadTeamMembers = async () => {
    setTeamLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      showToast('Failed to load team members', 'error');
      console.error(error);
    } else {
      setTeamMembers(data || []);
    }
    setTeamLoading(false);
  };

  useEffect(() => {
    loadSiteContent();
    loadTeamMembers();
  }, []);

  // Save content item
  const handleSaveContent = async (id: string) => {
    setSavingContent(id);

    const { error } = await supabase
      .from('site_content')
      .update({
        content: editedContent[id],
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      showToast('Failed to save content', 'error');
      console.error(error);
    } else {
      showToast('Content saved', 'success');
      // Update local state
      setSiteContent(siteContent.map(item =>
        item.id === id ? { ...item, content: editedContent[id] } : item
      ));
    }
    setSavingContent(null);
  };

  // Check if content has changed
  const hasContentChanged = (id: string) => {
    const original = siteContent.find(item => item.id === id);
    return original?.content !== editedContent[id];
  };

  // Save team member
  const handleSaveMember = async (member: Omit<TeamMember, 'id'> & { id?: string }) => {
    setSavingMember(true);

    if (member.id) {
      // Update existing
      const { error } = await supabase
        .from('team_members')
        .update({
          name: member.name,
          role: member.role,
          bio: member.bio,
          image: member.image,
          display_order: member.display_order,
          visible: member.visible,
        })
        .eq('id', member.id);

      if (error) {
        showToast('Failed to update team member', 'error');
        console.error(error);
      } else {
        showToast('Team member updated', 'success');
        loadTeamMembers();
      }
    } else {
      // Create new
      const { error } = await supabase
        .from('team_members')
        .insert({
          name: member.name,
          role: member.role,
          bio: member.bio,
          image: member.image,
          display_order: member.display_order,
          visible: member.visible,
        });

      if (error) {
        showToast('Failed to create team member', 'error');
        console.error(error);
      } else {
        showToast('Team member added', 'success');
        loadTeamMembers();
      }
    }

    setSavingMember(false);
    setEditingMember(null);
    setIsCreatingMember(false);
  };

  // Delete team member
  const handleDeleteMember = async (id: string) => {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) {
      showToast('Failed to delete team member', 'error');
      console.error(error);
    } else {
      showToast('Team member deleted', 'success');
      loadTeamMembers();
    }
    setDeleteMemberConfirm(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Content Management</h2>
          <p className="text-sm text-white/60 mt-1">
            Edit website text content and team information
          </p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveSection('text')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeSection === 'text'
              ? 'bg-white text-[#2d382c]'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          }`}
        >
          Text Content
        </button>
        <button
          onClick={() => setActiveSection('team')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeSection === 'team'
              ? 'bg-white text-[#2d382c]'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          }`}
        >
          Team Members
        </button>
      </div>

      {/* Text Content Section */}
      {activeSection === 'text' && (
        <div className="space-y-6">
          {contentLoading ? (
            <div className="text-white/60">Loading content...</div>
          ) : (
            siteContent.map((item) => (
              <div key={item.id} className="border border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-white">
                    {contentLabels[item.id] || item.id}
                  </label>
                  {hasContentChanged(item.id) && (
                    <span className="text-xs text-yellow-400">Unsaved changes</span>
                  )}
                </div>
                <textarea
                  value={editedContent[item.id] || ''}
                  onChange={(e) => setEditedContent({ ...editedContent, [item.id]: e.target.value })}
                  rows={item.id.startsWith('footer_') ? 1 : 4}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40 resize-none mb-3"
                />
                <button
                  onClick={() => handleSaveContent(item.id)}
                  disabled={!hasContentChanged(item.id) || savingContent === item.id}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingContent === item.id ? 'Saving...' : 'Save'}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Team Members Section */}
      {activeSection === 'team' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditingMember(emptyTeamMember as TeamMember);
                setIsCreatingMember(true);
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Team Member
            </button>
          </div>

          {teamLoading ? (
            <div className="text-white/60">Loading team members...</div>
          ) : (
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className={`border border-white/10 p-4 hover:border-white/20 transition-colors ${
                    !member.visible ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                        {!member.visible && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60 mt-1">{member.role}</p>
                      <p className="text-xs text-white/50 mt-2 line-clamp-2">{member.bio}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingMember(member)}
                        className="px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteMemberConfirm(member.id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit/Create Team Member Modal */}
      <AnimatePresence>
        {editingMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setEditingMember(null);
              setIsCreatingMember(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#2d382c] border border-white/20 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                {isCreatingMember ? 'Add Team Member' : 'Edit Team Member'}
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveMember(editingMember);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Name *</label>
                  <input
                    type="text"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Role</label>
                  <input
                    type="text"
                    value={editingMember.role}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Bio</label>
                  <textarea
                    value={editingMember.bio}
                    onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={editingMember.image}
                    onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })}
                    placeholder="/images/team/name.jpeg"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingMember.display_order}
                    onChange={(e) => setEditingMember({ ...editingMember, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="memberVisible"
                    checked={editingMember.visible}
                    onChange={(e) => setEditingMember({ ...editingMember, visible: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="memberVisible" className="text-sm text-white/70">
                    Visible on website
                  </label>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMember(null);
                      setIsCreatingMember(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingMember}
                    className="px-4 py-2 bg-white text-[#2d382c] text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {savingMember ? 'Saving...' : isCreatingMember ? 'Add Member' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Team Member Confirmation */}
      <AnimatePresence>
        {deleteMemberConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteMemberConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#2d382c] border border-white/20 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Delete Team Member</h3>
              <p className="text-sm text-white/60 mb-4">
                Are you sure you want to delete this team member? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteMemberConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMember(deleteMemberConfirm)}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Delete Member
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
