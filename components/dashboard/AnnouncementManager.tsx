'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Announcement } from '@/types/announcement';
import { ENDPOINTS } from '@/config/api';

export default function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(ENDPOINTS.announcements);
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      toast.error('Failed to fetch announcements');
      console.error('Fetch error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingAnnouncement) {
        // Update
        const response = await fetch(`${ENDPOINTS.announcements}/${editingAnnouncement.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success('Announcement updated successfully');
          fetchAnnouncements();
          closeModal();
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to update announcement');
        }
      } else {
        // Create
        const response = await fetch(ENDPOINTS.announcements, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success('Announcement created successfully');
          fetchAnnouncements();
          closeModal();
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to create announcement');
        }
      }
    } catch (error) {
      toast.error('Failed to save announcement');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const response = await fetch(`${ENDPOINTS.announcements}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Announcement deleted successfully');
        fetchAnnouncements();
      } else {
        toast.error('Failed to delete announcement');
      }
    } catch (error) {
      toast.error('Failed to delete announcement');
      console.error('Delete error:', error);
    }
  };

  const handleToggleVisibility = async (announcement: Announcement) => {
    try {
      const response = await fetch(`${ENDPOINTS.announcements}/${announcement.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHidden: !announcement.isHidden }),
      });

      if (response.ok) {
        toast.success(announcement.isHidden ? 'Announcement shown' : 'Announcement hidden');
        fetchAnnouncements();
      } else {
        toast.error('Failed to update announcement');
      }
    } catch (error) {
      toast.error('Failed to update announcement');
      console.error('Toggle error:', error);
    }
  };

  const openModal = (announcement?: Announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({ title: announcement.title, body: announcement.body });
    } else {
      setEditingAnnouncement(null);
      setFormData({ title: '', body: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
    setFormData({ title: '', body: '' });
  };

  return (
    <div>
      {/* Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Announcements</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 gradient-button px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Table */}
      <div className="gradient-border bg-[#1a1a2e] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary/20">
              <th className="text-left py-4 px-6 text-gray-400 font-medium">Time</th>
              <th className="text-left py-4 px-6 text-gray-400 font-medium">ID</th>
              <th className="text-left py-4 px-6 text-gray-400 font-medium">Title</th>
              <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
              <th className="text-right py-4 px-6 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No announcements yet
                </td>
              </tr>
            ) : (
              announcements.map((announcement) => (
                <tr
                  key={announcement.id}
                  className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                >
                  <td className="py-4 px-6 text-gray-300 text-sm">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                    <br />
                    <span className="text-gray-500">
                      {new Date(announcement.createdAt).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-300 font-mono text-sm">
                    #{announcement.id}
                  </td>
                  <td className="py-4 px-6 text-white font-medium">
                    {announcement.title}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        announcement.isHidden
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {announcement.isHidden ? 'Hidden' : 'Visible'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleToggleVisibility(announcement)}
                        className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                        title={announcement.isHidden ? 'Show' : 'Hide'}
                      >
                        {announcement.isHidden ? (
                          <Eye className="w-4 h-4 text-gray-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => openModal(announcement)}
                        className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="gradient-border bg-[#1a1a2e] rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-2xl font-semibold text-white mb-6">
              {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-background border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Body</label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full bg-background border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary h-32"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gradient-button px-6 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingAnnouncement ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



