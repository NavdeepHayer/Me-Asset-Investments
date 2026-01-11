import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteContent } from '../../content/siteContent';

type ContentSection = 'intro' | 'investmentFocus' | 'savePhilosophy' | 'approach' | 'mission' | 'team' | 'footer';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

export function ContentManagement() {
  const [activeSection, setActiveSection] = useState<ContentSection>('intro');
  const [editingMember, setEditingMember] = useState<{ member: TeamMember; index: number } | null>(null);

  const sections: { id: ContentSection; label: string; content: string | null }[] = [
    { id: 'intro', label: 'Introduction', content: siteContent.intro.text },
    { id: 'investmentFocus', label: 'Investment Focus', content: siteContent.investmentFocus.text },
    { id: 'savePhilosophy', label: 'SAVE Philosophy', content: siteContent.savePhilosophy.text },
    { id: 'approach', label: 'Approach', content: siteContent.approach.text },
    { id: 'mission', label: 'Mission', content: siteContent.mission.text },
    { id: 'team', label: 'Team', content: null },
    { id: 'footer', label: 'Footer', content: null },
  ];

  const handleSaveInfo = () => {
    alert('Note: Content is currently stored in static files. To update content, modify src/content/siteContent.ts directly, or contact your developer to set up a database backend.');
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
        <div className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 text-xs font-medium">
          View Only - Edit siteContent.ts
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              activeSection === section.id
                ? 'bg-white text-[#2d382c]'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Text Sections */}
          {activeSection !== 'team' && activeSection !== 'footer' && (
            <div className="border border-white/10 p-6">
              <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
                {sections.find(s => s.id === activeSection)?.label} Text
              </label>
              <textarea
                value={sections.find(s => s.id === activeSection)?.content || ''}
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40 resize-none"
                disabled
              />
              <button
                onClick={handleSaveInfo}
                className="mt-4 px-4 py-2 bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
              >
                How to Edit
              </button>
            </div>
          )}

          {/* Team Section */}
          {activeSection === 'team' && (
            <div className="space-y-4">
              {siteContent.team.members.map((member, index) => (
                <div
                  key={index}
                  className="border border-white/10 p-4 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                      <p className="text-xs text-white/60 mt-1">{member.role}</p>
                      <p className="text-xs text-white/50 mt-2 line-clamp-2">{member.bio}</p>
                    </div>
                    <button
                      onClick={() => setEditingMember({ member, index })}
                      className="px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Section */}
          {activeSection === 'footer' && (
            <div className="border border-white/10 p-6 space-y-6">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
                  Copyright
                </label>
                <input
                  type="text"
                  value={siteContent.footer.copyright}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
                    Contact Email
                  </label>
                  <input
                    type="text"
                    value={siteContent.footer.contact.email}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={siteContent.footer.contact.person}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
                  Social Links
                </label>
                <div className="space-y-2">
                  {siteContent.footer.socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <input
                        type="text"
                        value={link.name}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                        disabled
                      />
                      <input
                        type="text"
                        value={link.url}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                        disabled
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveInfo}
                className="px-4 py-2 bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
              >
                How to Edit
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Info Card */}
      <div className="mt-8 p-4 border border-white/10 bg-white/5">
        <h3 className="text-sm font-medium text-white mb-2">How to Update Content</h3>
        <p className="text-xs text-white/60 mb-3">
          All website content is stored in a single TypeScript file for easy management:
        </p>
        <ol className="text-xs text-white/60 space-y-1 list-decimal list-inside">
          <li>Open <code className="px-1 py-0.5 bg-white/10 text-white/80">src/content/siteContent.ts</code></li>
          <li>Find the section you want to edit (intro, team, footer, etc.)</li>
          <li>Update the text content</li>
          <li>Save the file and redeploy</li>
        </ol>
        <p className="text-xs text-white/40 mt-3">
          Future: We can set up a CMS or database to allow editing content directly from this panel.
        </p>
      </div>

      {/* Team Member Modal */}
      <AnimatePresence>
        {editingMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#2d382c] border border-white/20 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Team Member Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingMember.member.name}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Role</label>
                  <input
                    type="text"
                    value={editingMember.member.role}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Bio</label>
                  <textarea
                    value={editingMember.member.bio}
                    rows={6}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40 resize-none"
                    disabled
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveInfo}
                  className="px-4 py-2 bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  How to Edit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
