import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteContent } from '../../content/siteContent';

interface Project {
  name: string;
  location: string;
  type: string;
  status: string;
  description: string;
  image: string;
}

export function ProjectManagement() {
  const [projects] = useState<Project[]>(siteContent.projects.items);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleEdit = (project: Project, index: number) => {
    setEditingProject({ ...project });
    setEditIndex(index);
  };

  const handleSave = () => {
    // In a real implementation, this would save to a database or API
    // For now, we show a message that this is for viewing only
    alert('Note: Project data is currently stored in static files. To update projects, modify src/content/siteContent.ts directly, or contact your developer to set up a database backend.');
    setEditingProject(null);
    setEditIndex(null);
  };

  const statusColors: Record<string, string> = {
    'Current': 'bg-blue-500/20 text-blue-400',
    'Completed': 'bg-green-500/20 text-green-400',
    'Planned': 'bg-yellow-500/20 text-yellow-400',
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Project Management</h2>
          <p className="text-sm text-white/60 mt-1">
            {projects.length} project{projects.length !== 1 ? 's' : ''} in portfolio
          </p>
        </div>
        <div className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 text-xs font-medium">
          View Only - Edit siteContent.ts
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border border-white/10 overflow-hidden group hover:border-white/20 transition-colors"
          >
            {/* Project Image */}
            <div className="aspect-video bg-white/5 relative overflow-hidden">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium ${statusColors[project.status] || 'bg-white/20 text-white/60'}`}>
                {project.status}
              </span>
            </div>

            {/* Project Info */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white mb-1">{project.name}</h3>
              <p className="text-xs text-white/60 mb-2">{project.location}</p>
              <p className="text-xs text-white/40 mb-3">{project.type}</p>
              <p className="text-xs text-white/60 line-clamp-2">{project.description}</p>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4">
              <button
                onClick={() => handleEdit(project, index)}
                className="w-full px-3 py-2 text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Card */}
      <div className="mt-8 p-4 border border-white/10 bg-white/5">
        <h3 className="text-sm font-medium text-white mb-2">How to Update Projects</h3>
        <p className="text-xs text-white/60 mb-3">
          Projects are currently stored in a static TypeScript file. To add, edit, or remove projects:
        </p>
        <ol className="text-xs text-white/60 space-y-1 list-decimal list-inside">
          <li>Open <code className="px-1 py-0.5 bg-white/10 text-white/80">src/content/siteContent.ts</code></li>
          <li>Find the <code className="px-1 py-0.5 bg-white/10 text-white/80">projects.items</code> array</li>
          <li>Add, edit, or remove project objects</li>
          <li>Save the file and redeploy</li>
        </ol>
        <p className="text-xs text-white/40 mt-3">
          Future: We can set up a database to allow editing projects directly from this panel.
        </p>
      </div>

      {/* Edit Modal (View Only for now) */}
      <AnimatePresence>
        {editingProject && editIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#2d382c] border border-white/20 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    disabled
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Location</label>
                    <input
                      type="text"
                      value={editingProject.location}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Type</label>
                    <input
                      type="text"
                      value={editingProject.type}
                      onChange={(e) => setEditingProject({ ...editingProject, type: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Status</label>
                  <select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    disabled
                  >
                    <option value="Current">Current</option>
                    <option value="Completed">Completed</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Description</label>
                  <textarea
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40 resize-none"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Image Path</label>
                  <input
                    type="text"
                    value={editingProject.image}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    disabled
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSave}
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
