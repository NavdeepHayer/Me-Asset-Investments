import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ui/Toast';

interface Project {
  id: string;
  name: string;
  location: string;
  type: string;
  status: string;
  description: string;
  image: string;
  display_order: number;
  visible: boolean;
}

const emptyProject: Omit<Project, 'id'> = {
  name: '',
  location: '',
  type: '',
  status: 'Current',
  description: '',
  image: '',
  display_order: 0,
  visible: true,
};

export function ProjectManagement() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      showToast('Failed to load projects', 'error');
      console.error(error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSave = async (project: Omit<Project, 'id'> & { id?: string }) => {
    setSaving(true);

    if (project.id) {
      // Update existing
      const { error } = await supabase
        .from('projects')
        .update({
          name: project.name,
          location: project.location,
          type: project.type,
          status: project.status,
          description: project.description,
          image: project.image,
          display_order: project.display_order,
          visible: project.visible,
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id);

      if (error) {
        showToast('Failed to update project', 'error');
        console.error(error);
      } else {
        showToast('Project updated', 'success');
        loadProjects();
      }
    } else {
      // Create new
      const { error } = await supabase
        .from('projects')
        .insert({
          name: project.name,
          location: project.location,
          type: project.type,
          status: project.status,
          description: project.description,
          image: project.image,
          display_order: project.display_order,
          visible: project.visible,
        });

      if (error) {
        showToast('Failed to create project', 'error');
        console.error(error);
      } else {
        showToast('Project created', 'success');
        loadProjects();
      }
    }

    setSaving(false);
    setEditingProject(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      showToast('Failed to delete project', 'error');
      console.error(error);
    } else {
      showToast('Project deleted', 'success');
      loadProjects();
    }
    setDeleteConfirm(null);
  };

  const handleToggleVisibility = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ visible: !project.visible })
      .eq('id', project.id);

    if (error) {
      showToast('Failed to update visibility', 'error');
    } else {
      setProjects(projects.map(p =>
        p.id === project.id ? { ...p, visible: !p.visible } : p
      ));
    }
  };

  const statusColors: Record<string, string> = {
    'Current': 'bg-blue-500/20 text-blue-400',
    'Completed': 'bg-green-500/20 text-green-400',
    'Planned': 'bg-yellow-500/20 text-yellow-400',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white/60">Loading projects...</div>
      </div>
    );
  }

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
        <button
          onClick={() => {
            setEditingProject(emptyProject as Project);
            setIsCreating(true);
          }}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`border border-white/10 overflow-hidden group hover:border-white/20 transition-colors ${
              !project.visible ? 'opacity-50' : ''
            }`}
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
              <div className="absolute top-2 right-2 flex gap-2">
                <span className={`px-2 py-1 text-xs font-medium ${statusColors[project.status] || 'bg-white/20 text-white/60'}`}>
                  {project.status}
                </span>
                {!project.visible && (
                  <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400">
                    Hidden
                  </span>
                )}
              </div>
            </div>

            {/* Project Info */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white mb-1">{project.name}</h3>
              <p className="text-xs text-white/60 mb-2">{project.location}</p>
              <p className="text-xs text-white/40 mb-3">{project.type}</p>
              <p className="text-xs text-white/60 line-clamp-2">{project.description}</p>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => setEditingProject(project)}
                className="flex-1 px-3 py-2 text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleToggleVisibility(project)}
                className="px-3 py-2 text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                title={project.visible ? 'Hide project' : 'Show project'}
              >
                {project.visible ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setDeleteConfirm(project.id)}
                className="px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 bg-white/5 hover:bg-red-500/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setEditingProject(null);
              setIsCreating(false);
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
                {isCreating ? 'Add New Project' : 'Edit Project'}
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(editingProject);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Name *</label>
                  <input
                    type="text"
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    required
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
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Type</label>
                    <input
                      type="text"
                      value={editingProject.type}
                      onChange={(e) => setEditingProject({ ...editingProject, type: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Status</label>
                    <select
                      value={editingProject.status}
                      onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    >
                      <option value="Current">Current</option>
                      <option value="Completed">Completed</option>
                      <option value="Planned">Planned</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={editingProject.display_order}
                      onChange={(e) => setEditingProject({ ...editingProject, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Description</label>
                  <textarea
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Image Path</label>
                  <input
                    type="text"
                    value={editingProject.image}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                    placeholder="/images/projects/filename.jpeg"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="visible"
                    checked={editingProject.visible}
                    onChange={(e) => setEditingProject({ ...editingProject, visible: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="visible" className="text-sm text-white/70">
                    Visible on website
                  </label>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setIsCreating(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-white text-[#2d382c] text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : isCreating ? 'Create Project' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#2d382c] border border-white/20 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Delete Project</h3>
              <p className="text-sm text-white/60 mb-4">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Delete Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
