import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Mail, Plus, User, Phone, Calendar, Crown, Shield, Star, X, Save, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    membership: 'Basic',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    avatar: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch('http://localhost:3000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please try again later.');
    } finally {
      setFetchLoading(false);
    }
  };

  // Add User Function
  const addUser = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userToAdd = {
        ...newUser,
        avatar: newUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.username)}&background=random`
      };

      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToAdd),
      });

      const data = await response.json();
      setUsers(prev => [...prev, data]);
      setShowForm(false);
      resetForm();
      toast.success('🎉 User added successfully!');
    } catch (err) {
      console.error("Error adding user:", err);
      toast.error('❌ Error adding user');
    } finally {
      setLoading(false);
    }
  };

  // Edit User Function
  const editUser = (user) => {
    setEditingUser(user);
    setNewUser({
      username: user.username || user.name || '',
      email: user.email || '',
      password: '', // Don't show password when editing
      phone: user.phone || '',
      membership: user.membership || 'Basic',
      status: user.status || 'active',
      joinDate: user.joinDate || new Date().toISOString().split('T')[0],
      avatar: user.avatar || ''
    });
    setShowForm(true);
  };

  // Update User Function
  const updateUser = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const updatedUser = {
        ...newUser,
        avatar: newUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.username)}&background=random`
      };

      const response = await fetch(`http://localhost:3000/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();
      setUsers(prev => prev.map(u => u.id === editingUser.id ? data : u));
      setShowForm(false);
      setEditingUser(null);
      resetForm();
      toast.success('✨ User updated successfully!');
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error('❌ Error updating user');
    } finally {
      setLoading(false);
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Close Delete Modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
    setDeleting(false);
  };

  // Delete User Function
  const deleteUser = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`http://localhost:3000/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        toast.success('🗑️ User deleted successfully!');
        closeDeleteModal();
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error('❌ Error deleting user');
    } finally {
      setDeleting(false);
    }
  };

  // Email User Function
  const emailUser = (user) => {
    toast.success(`📧 Email sent to ${user.email}`);
    // In a real application, you would integrate with an email service
  };

  // Validation function
  const validateForm = () => {
    if (!newUser.username.trim()) {
      toast.error('Username is required');
      return false;
    }
    if (!newUser.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      toast.error('Email is invalid');
      return false;
    }
    // Only validate password for new users, not when editing
    if (!editingUser && !newUser.password.trim()) {
      toast.error('Password is required');
      return false;
    }
    return true;
  };

  // Reset Form
  const resetForm = () => {
    setNewUser({
      username: '',
      email: '',
      password: '',
      phone: '',
      membership: 'Basic',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: ''
    });
  };

  // Handle form close
  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
    resetForm();
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Delete Confirmation Modal Component
  const DeleteConfirmationModal = () => {
    if (!showDeleteModal || !userToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md border border-red-500/30">
          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Delete User</h3>
              <p className="text-gray-400 text-sm">This action cannot be undone</p>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-300 text-sm">
              <strong>Warning:</strong> You are about to permanently delete the user 
              <span className="font-bold text-white"> {userToDelete.username || userToDelete.name}</span>. 
              This will remove all their data including orders, reviews, and preferences.
            </p>
          </div>

          {/* User Details */}
          <div className="bg-gray-700/50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <img
                className="h-10 w-10 rounded-full object-cover border-2 border-gray-600"
                src={userToDelete.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userToDelete.username || userToDelete.name)}&background=random`}
                alt={userToDelete.username || userToDelete.name}
              />
              <div>
                <h4 className="font-semibold text-white">{userToDelete.username || userToDelete.name}</h4>
                <p className="text-gray-400 text-sm">{userToDelete.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-400">Membership:</span>
                <span className={`ml-2 font-medium ${
                  userToDelete.membership === 'Premium' ? 'text-purple-400' : 
                  userToDelete.membership === 'VIP' ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  {userToDelete.membership}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className={`ml-2 font-medium ${
                  userToDelete.status === 'active' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {userToDelete.status?.charAt(0).toUpperCase() + userToDelete.status?.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Type <span className="font-mono text-red-400">DELETE</span> to confirm
            </label>
            <input
              type="text"
              id="deleteConfirmation"
              placeholder="Type DELETE here"
              className="w-full bg-gray-700 border border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-white placeholder-gray-400"
              onChange={(e) => {
                // Enable delete button only when user types "DELETE"
                const deleteBtn = document.getElementById('deleteBtn');
                if (deleteBtn) {
                  deleteBtn.disabled = e.target.value !== 'DELETE';
                }
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={closeDeleteModal}
              disabled={deleting}
              className="flex-1 px-4 py-3 border border-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              id="deleteBtn"
              onClick={deleteUser}
              disabled={deleting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete User
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading Skeleton Component
  const UserCardSkeleton = () => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-12 w-12 rounded-full bg-gray-700"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="h-3 bg-gray-700 rounded w-16"></div>
          <div className="h-3 bg-gray-700 rounded w-20"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-700 rounded w-20"></div>
          <div className="h-3 bg-gray-700 rounded w-16"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-700 rounded w-12"></div>
          <div className="h-3 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <div className="flex-1 h-10 bg-gray-700 rounded-xl"></div>
        <div className="flex-1 h-10 bg-gray-700 rounded-xl"></div>
        <div className="flex-1 h-10 bg-gray-700 rounded-xl"></div>
      </div>
    </div>
  );

  // Enhanced User Card Component
  const UserCard = ({ user }) => (
    <div className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 hover:translate-y-[-8px] relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      
      {/* User Header */}
      <div className="flex items-center space-x-4 mb-4 relative z-10">
        <div className="relative">
          <img
            className="h-14 w-14 rounded-full object-cover border-2 border-gray-600 group-hover:border-blue-500 transition-colors duration-300"
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name)}&background=random`}
            alt={user.username || user.name}
          />
          {/* Online Status Indicator */}
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
            user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-lg truncate group-hover:text-blue-300 transition-colors">
            {user.username || user.name}
          </h3>
          <p className="text-gray-400 text-sm truncate flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {user.email}
          </p>
        </div>
      </div>
      
      {/* User Details */}
      <div className="space-y-3 text-sm relative z-10">
        {/* Phone */}
        <div className="flex justify-between items-center group/item hover:bg-gray-700/50 rounded-lg px-2 py-1 transition-colors">
          <span className="text-gray-400 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            Phone:
          </span>
          <span className="font-medium text-white">{user.phone || 'N/A'}</span>
        </div>

        {/* Membership */}
        <div className="flex justify-between items-center group/item hover:bg-gray-700/50 rounded-lg px-2 py-1 transition-colors">
          <span className="text-gray-400 flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Membership:
          </span>
          <span className={`font-medium px-2 py-1 rounded-full text-xs ${
            user.membership === 'Premium' 
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
              : user.membership === 'VIP'
              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
          }`}>
            {user.membership}
          </span>
        </div>

        {/* Status */}
        <div className="flex justify-between items-center group/item hover:bg-gray-700/50 rounded-lg px-2 py-1 transition-colors">
          <span className="text-gray-400 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Status:
          </span>
          <span className={`font-medium px-2 py-1 rounded-full text-xs ${
            user.status === 'active' 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
          </span>
        </div>

        {/* Join Date */}
        <div className="flex justify-between items-center group/item hover:bg-gray-700/50 rounded-lg px-2 py-1 transition-colors">
          <span className="text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Joined:
          </span>
          <span className="font-medium text-white text-xs">{user.joinDate}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6 relative z-10">
        <button 
          onClick={() => editUser(user)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 group/btn"
        >
          <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          <span className="text-sm font-medium">Edit</span>
        </button>
        <button 
          onClick={() => emailUser(user)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2 group/btn"
        >
          <Mail className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          <span className="text-sm font-medium">Email</span>
        </button>
        <button 
          onClick={() => openDeleteModal(user)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2 group/btn"
        >
          <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          <span className="text-sm font-medium">Delete</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text">
            User Management
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your users and their permissions
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 flex items-center gap-3 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm group hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-blue-600/20 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 group-hover:scale-110 transition-all duration-300">
              <User className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
                {users.length}
              </div>
              <div className="text-blue-300 text-sm group-hover:text-blue-200 transition-colors">Total Users</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm group hover:bg-gradient-to-br hover:from-green-500/20 hover:to-green-600/20 hover:border-green-400/40 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300">
              <Shield className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white group-hover:text-green-200 transition-colors">
                {users.filter(u => u.status === 'active').length}
              </div>
              <div className="text-green-500 text-sm group-hover:text-green-300 transition-colors">Active Users</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-sm group hover:bg-gradient-to-br hover:from-yellow-500/20 hover:to-yellow-600/20 hover:border-yellow-400/40 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-yellow-500/20 rounded-xl group-hover:bg-yellow-500/30 group-hover:scale-110 transition-all duration-300">
              <Crown className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white group-hover:text-yellow-200 transition-colors">
                {users.filter(u => u.membership === 'Premium').length}
              </div>
              <div className="text-yellow-300 text-sm group-hover:text-yellow-200 transition-colors">Premium Users</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm group hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-purple-600/20 hover:border-purple-400/40 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 group-hover:scale-110 transition-all duration-300">
              <Star className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">
                {users.filter(u => u.membership === 'VIP').length}
              </div>
              <div className="text-purple-300 text-sm group-hover:text-purple-200 transition-colors">VIP Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button 
                onClick={handleFormClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={editingUser ? updateUser : addUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Username */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">Username *</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  required
                  value={newUser.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-400"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter user's email"
                  required
                  value={newUser.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-400"
                />
              </div>

              {/* Password - Only show for new users, not when editing */}
              {!editingUser && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2">Password *</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    required
                    value={newUser.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-400"
                  />
                </div>
              )}

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newUser.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-400"
                />
              </div>

              {/* Membership */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Membership</label>
                <select
                  value={newUser.membership}
                  onChange={(e) => handleInputChange('membership', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white"
                >
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Status</label>
                <select
                  value={newUser.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Join Date</label>
                <input
                  type="date"
                  value={newUser.joinDate}
                  onChange={(e) => handleInputChange('joinDate', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white"
                />
              </div>

              {/* Avatar URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">Avatar URL (Optional)</label>
                <input
                  type="url"
                  placeholder="Enter avatar image URL"
                  value={newUser.avatar}
                  onChange={(e) => handleInputChange('avatar', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-400"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={handleFormClose}
                  className="px-6 py-3 border border-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 font-medium"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : (editingUser ? 'Update User' : 'Add User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />

      {/* Users Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            All Users ({users.length})
          </h3>
        </div>

        {fetchLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <UserCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}

        {/* No Users Message */}
        {!fetchLoading && users.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No users yet
            </h3>
            <p className="text-gray-400 mb-6">
              Get started by adding your first user to the system.
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-semibold"
            >
              Add Your First User
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;