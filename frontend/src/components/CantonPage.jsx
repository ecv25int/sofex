import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CantonPage = ({ user }) => {
  const [cantons, setCantons] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [newCanton, setNewCanton] = useState({ name: '', provinceId: '' });
  const [editingCanton, setEditingCanton] = useState(null);
  const [editData, setEditData] = useState({ name: '', provinceId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is admin
  const isAdmin = user && user.roles && user.roles.includes('ADMIN');

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cantonsResponse, provincesResponse] = await Promise.all([
      axios.get('/api/cantons', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
      axios.get('/api/provinces', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      // Sort cantons by province ID first, then by canton ID
      const sortedCantons = cantonsResponse.data.sort((a, b) => {
        const provinceIdA = a.province ? a.province.id : 0;
        const provinceIdB = b.province ? b.province.id : 0;
        
        if (provinceIdA !== provinceIdB) {
          return provinceIdA - provinceIdB;
        }
        return a.id - b.id;
      });
      
      // Sort provinces by ID for consistent dropdown order
      const sortedProvinces = provincesResponse.data.sort((a, b) => a.id - b.id);
      
      setCantons(sortedCantons);
      setProvinces(sortedProvinces);
    } catch (error) {
      setError('Error loading data');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newCanton.name.trim() || !newCanton.provinceId) return;
    
    try {
      setLoading(true);
      setError('');
  await axios.post('/api/cantons', 
        newCanton,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setNewCanton({ name: '', provinceId: '' });
      setSuccess('Canton added successfully!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error adding canton');
      console.error('Error adding canton:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (canton) => {
    setEditingCanton(canton.id);
    setEditData({ 
      name: canton.name, 
      provinceId: canton.province ? canton.province.id : '' 
    });
    setError('');
    setSuccess('');
  };

  const handleUpdate = async () => {
    if (!editData.name.trim() || !editData.provinceId) return;
    
    try {
      setLoading(true);
      setError('');
  await axios.put(`/api/cantons/${editingCanton}`, 
        editData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setEditingCanton(null);
      setEditData({ name: '', provinceId: '' });
      setSuccess('Canton updated successfully!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error updating canton');
      console.error('Error updating canton:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, cantonName) => {
    if (!window.confirm(`Are you sure you want to delete "${cantonName}"? This will also delete all associated districts.`)) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
  await axios.delete(`/api/cantons/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Canton deleted successfully!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error deleting canton');
      console.error('Error deleting canton:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCanton(null);
    setEditData({ name: '', provinceId: '' });
    setError('');
  };

  const getProvinceName = (provinceId) => {
    const province = provinces.find(p => p.id === provinceId);
    return province ? province.name : 'Unknown';
  };

  if (!isAdmin) {
    return (
      <div className="page-container">
        <div className="access-denied">
          <div className="access-denied-icon">🚫</div>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page. Admin role is required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">🏙️</div>
          <div className="header-text">
            <h1>Canton Management</h1>
            <p>Manage Costa Rica's administrative cantons</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stat">
            <span className="stat-number">{cantons.length}</span>
            <span className="stat-label">Total Cantons</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="notification notification-error">
          <span>❌</span>
          <span>{error}</span>
          <button className="notification-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="notification notification-success">
          <span>✅</span>
          <span>{success}</span>
          <button className="notification-close" onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      {/* Add New Canton Section */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card-header">
          <h2 className="card-title">Add New Canton</h2>
          <p className="card-subtitle">Create a new administrative canton</p>
        </div>
        <div className="card-content">
          <div className="form-group">
            <label className="form-label">Province</label>
            <select
              className="form-select"
              value={newCanton.provinceId}
              onChange={(e) => setNewCanton({...newCanton, provinceId: e.target.value})}
              disabled={loading}
            >
              <option value="">Select Province</option>
              {provinces.map(province => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Canton Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter canton name..."
              value={newCanton.name}
              onChange={(e) => setNewCanton({...newCanton, name: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && !loading && newCanton.name.trim() && newCanton.provinceId && handleAdd()}
              disabled={loading}
            />
          </div>
          <button 
            className={`btn btn-primary ${loading || !newCanton.name.trim() || !newCanton.provinceId ? 'disabled' : ''}`}
            onClick={handleAdd}
            disabled={loading || !newCanton.name.trim() || !newCanton.provinceId}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Adding...
              </>
            ) : (
              <>
                <span>➕</span>
                Add Canton
              </>
            )}
          </button>
        </div>
      </div>

      {/* Cantons List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Cantons List</h2>
          <p className="card-subtitle">Manage existing cantons</p>
        </div>
        <div className="card-content">
          {loading && cantons.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading cantons...</p>
            </div>
          ) : (
            <div className="item-list">
              {cantons.map(canton => (
                <div key={canton.id} className="list-item">
                  <div className="item-content">
                    {editingCanton === canton.id ? (
                      <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1 }}>
                        <div className="form-group" style={{ margin: 0, flex: 1 }}>
                          <select
                            className="form-select"
                            value={editData.provinceId}
                            onChange={(e) => setEditData({...editData, provinceId: e.target.value})}
                            disabled={loading}
                          >
                            <option value="">Select Province</option>
                            {provinces.map(province => (
                              <option key={province.id} value={province.id}>
                                {province.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group" style={{ margin: 0, flex: 1 }}>
                          <input
                            type="text"
                            className="form-input"
                            value={editData.name}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                            onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
                            disabled={loading}
                            autoFocus
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="item-number">#{canton.id}</span>
                        <div className="item-details">
                          <h3 className="item-title">{canton.name}</h3>
                          <p className="item-subtitle">{canton.province ? canton.province.name : 'Unknown Province'}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="item-actions">
                    {editingCanton === canton.id ? (
                      <>
                        <button
                          className={`btn btn-success btn-sm ${loading || !editData.name.trim() || !editData.provinceId ? 'disabled' : ''}`}
                          onClick={handleUpdate}
                          disabled={loading || !editData.name.trim() || !editData.provinceId}
                        >
                          {loading ? <span className="loading-spinner"></span> : '💾'} Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleCancelEdit}
                          disabled={loading}
                        >
                          ❌ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleEdit(canton)}
                          disabled={loading}
                          title="Edit canton"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleDelete(canton.id, canton.name)}
                          disabled={loading}
                          title="Delete canton"
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              
              {cantons.length === 0 && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">🏙️</div>
                  <h3>No Cantons Found</h3>
                  <p>Start by adding your first canton above.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CantonPage;
