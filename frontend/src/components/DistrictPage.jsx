import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DistrictPage = ({ user }) => {
  const [districts, setDistricts] = useState([]);
  const [cantons, setCantons] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [newDistrict, setNewDistrict] = useState({ name: '', cantonId: '' });
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [editData, setEditData] = useState({ name: '', cantonId: '' });
  const [selectedProvince, setSelectedProvince] = useState('');
  const [filteredCantons, setFilteredCantons] = useState([]);
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

  useEffect(() => {
    // Filter cantons based on selected province
    if (selectedProvince) {
      const filtered = cantons.filter(canton => 
        canton.province && canton.province.id === parseInt(selectedProvince)
      );
      setFilteredCantons(filtered);
    } else {
      setFilteredCantons(cantons);
    }
  }, [selectedProvince, cantons]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [districtsResponse, cantonsResponse, provincesResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/districts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:8080/api/cantons', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:8080/api/provinces', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      setDistricts(districtsResponse.data);
      setCantons(cantonsResponse.data);
      setProvinces(provincesResponse.data);
    } catch (error) {
      setError('Error loading data');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newDistrict.name.trim() || !newDistrict.cantonId) return;
    
    try {
      setLoading(true);
      setError('');
      await axios.post('http://localhost:8080/api/districts', 
        newDistrict,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setNewDistrict({ name: '', cantonId: '' });
      setSelectedProvince('');
      setSuccess('District added successfully!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error adding district');
      console.error('Error adding district:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (district) => {
    setEditingDistrict(district.id);
    setEditData({ 
      name: district.name, 
      cantonId: district.canton ? district.canton.id : '' 
    });
    setError('');
    setSuccess('');
  };

  const handleUpdate = async () => {
    if (!editData.name.trim() || !editData.cantonId) return;
    
    try {
      setLoading(true);
      setError('');
      await axios.put(`http://localhost:8080/api/districts/${editingDistrict}`, 
        editData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setEditingDistrict(null);
      setEditData({ name: '', cantonId: '' });
      setSuccess('District updated successfully!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error updating district');
      console.error('Error updating district:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, districtName) => {
    if (!window.confirm(`Are you sure you want to delete "${districtName}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await axios.delete(`http://localhost:8080/api/districts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('District deleted successfully!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error deleting district');
      console.error('Error deleting district:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingDistrict(null);
    setEditData({ name: '', cantonId: '' });
    setError('');
  };

  const getCantonName = (cantonId) => {
    const canton = cantons.find(c => c.id === cantonId);
    return canton ? canton.name : 'Unknown';
  };

  const getProvinceName = (cantonId) => {
    const canton = cantons.find(c => c.id === cantonId);
    return canton && canton.province ? canton.province.name : 'Unknown';
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
          <div className="header-icon">🏘️</div>
          <div className="header-text">
            <h1>District Management</h1>
            <p>Manage Costa Rica's administrative districts</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stat">
            <span className="stat-number">{districts.length}</span>
            <span className="stat-label">Total Districts</span>
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

      {/* Add/Edit District Section */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card-header">
          <h2 className="card-title">{editingDistrict ? 'Edit District' : 'Add New District'}</h2>
          <p className="card-subtitle">{editingDistrict ? 'Update district information' : 'Create a new district'}</p>
        </div>
        <div className="card-content">
          <form onSubmit={e => { e.preventDefault(); editingDistrict ? handleUpdate() : handleAdd(); }}>
            <div className="form-group" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <select
                className="form-select"
                value={selectedProvince}
                onChange={e => setSelectedProvince(e.target.value)}
                disabled={loading || editingDistrict}
                style={{ minWidth: 160 }}
              >
                <option value="">Select Province</option>
                {provinces.map(province => (
                  <option key={province.id} value={province.id}>{province.name}</option>
                ))}
              </select>
              <select
                className="form-select"
                value={editingDistrict ? editData.cantonId : newDistrict.cantonId}
                onChange={e => editingDistrict ? setEditData({ ...editData, cantonId: e.target.value }) : setNewDistrict({ ...newDistrict, cantonId: e.target.value })}
                disabled={loading}
                style={{ minWidth: 160 }}
              >
                <option value="">Select Canton</option>
                {(editingDistrict ? cantons : filteredCantons).map(canton => (
                  <option key={canton.id} value={canton.id}>{canton.name}</option>
                ))}
              </select>
              <input
                type="text"
                className="form-input"
                placeholder="Enter district name..."
                value={editingDistrict ? editData.name : newDistrict.name}
                onChange={e => editingDistrict ? setEditData({ ...editData, name: e.target.value }) : setNewDistrict({ ...newDistrict, name: e.target.value })}
                disabled={loading}
                style={{ minWidth: 180 }}
              />
              <button
                type="submit"
                className={`btn btn-primary ${loading || !(editingDistrict ? editData.name.trim() && editData.cantonId : newDistrict.name.trim() && newDistrict.cantonId) ? 'disabled' : ''}`}
                disabled={loading || !(editingDistrict ? editData.name.trim() && editData.cantonId : newDistrict.name.trim() && newDistrict.cantonId)}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    {editingDistrict ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <span>{editingDistrict ? '💾' : '➕'}</span>
                    {editingDistrict ? 'Update District' : 'Add District'}
                  </>
                )}
              </button>
              {editingDistrict && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Districts List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Districts List</h2>
          <p className="card-subtitle">Manage existing districts</p>
        </div>
        <div className="card-content">
          {loading && districts.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading districts...</p>
            </div>
          ) : (
            <div className="item-list">
              {districts.map(district => (
                <div key={district.id} className="list-item">
                  <div className="item-content">
                    <span className="item-number">#{district.id}</span>
                    <div className="item-details">
                      <h3 className="item-title">{district.name}</h3>
                      <div className="item-meta">
                        <span>Canton: {district.canton ? district.canton.name : 'Unknown Canton'}</span>
                        <span>Province: {district.canton && district.canton.province ? district.canton.province.name : 'Unknown Province'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleEdit(district)}
                      disabled={loading}
                      title="Edit district"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDelete(district.id, district.name)}
                      disabled={loading}
                      title="Delete district"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
              {districts.length === 0 && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">🏘️</div>
                  <h3>No Districts Found</h3>
                  <p>Start by adding your first district above.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistrictPage;
