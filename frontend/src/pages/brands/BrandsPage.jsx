import React, { useEffect, useState } from 'react';

function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', state: false });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBrands = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/brands', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch brands');
      setBrands(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let res;
      const payload = {
        name: form.name,
        state: form.state
      };
      if (editing) {
        res = await fetch(`/api/brands/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error('Failed to save brand');
      setForm({ id: '', name: '', state: false });
      setEditing(false);
      setSuccess('Saved!');
      fetchBrands();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = b => {
    setForm({
      id: b.id,
      name: b.name,
      state: b.state
    });
    setEditing(true);
  };

  const handleDelete = async id => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/brands/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete brand');
      setForm({ id: '', name: '', state: false });
      setEditing(false);
      setSuccess('Brand deleted successfully!');
      setTimeout(() => setSuccess(''), 2000);
      fetchBrands();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">🏷️</div>
          <div className="header-text">
            <h1>Brands</h1>
            <p>Manage brands</p>
          </div>
        </div>
      </div>
      {error && <div className="notification notification-error">{error}</div>}
      {success && <div className="notification notification-success">{success}</div>}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h2>{editing ? 'Edit Brand' : 'Add Brand'}</h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="form-input" style={{ minWidth: 120 }} />
            <label style={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
              <input
                name="state"
                type="checkbox"
                checked={!!form.state}
                onChange={handleChange}
                className="form-checkbox"
                style={{ marginRight: 8 }}
              />
              Active
            </label>
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setForm({ id: '', name: '', state: false }); }}>Cancel</button>}
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><h2>Brands List</h2></div>
        <div className="card-content">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.name}</td>
                  <td>{b.state ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(b)}>Edit</button>
                    <button className="btn btn-error btn-sm" onClick={() => handleDelete(b.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && <tr><td colSpan={8}>No brands found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BrandsPage;
