import React, { useEffect, useState } from 'react';

function SiteguidsPage() {
  const [siteguids, setSiteguids] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', permissions: '', reports: '', sflag: false });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSiteguids = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/siteguids', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch siteguids');
      setSiteguids(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSiteguids(); }, []);

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
        permissions: form.permissions,
        reports: form.reports,
        sflag: form.sflag
      };
      if (editing) {
        res = await fetch(`/api/siteguids/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/siteguids', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error('Failed to save siteguid');
      setForm({ id: '', name: '', permissions: '', reports: '', sflag: false });
      setEditing(false);
      setSuccess('Saved!');
      fetchSiteguids();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = s => {
    setForm({
      id: s.id,
      name: s.name,
      permissions: s.permissions,
      reports: s.reports,
      sflag: s.sflag
    });
    setEditing(true);
  };

  const handleDelete = async id => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/siteguids/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete siteguid');
      setForm({ id: '', name: '', permissions: '', reports: '', sflag: false });
      setEditing(false);
      setSuccess('Siteguid deleted successfully!');
      setTimeout(() => setSuccess(''), 2000);
      fetchSiteguids();
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
          <div className="header-icon">🛡️</div>
          <div className="header-text">
            <h1>Siteguids</h1>
            <p>Manage siteguids</p>
          </div>
        </div>
      </div>
      {error && <div className="notification notification-error">{error}</div>}
      {success && <div className="notification notification-success">{success}</div>}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h2>{editing ? 'Edit Siteguid' : 'Add Siteguid'}</h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="form-input" style={{ minWidth: 120 }} />
            <input name="permissions" value={form.permissions} onChange={handleChange} placeholder="Permissions" className="form-input" style={{ minWidth: 120 }} />
            <input name="reports" value={form.reports} onChange={handleChange} placeholder="Reports" className="form-input" style={{ minWidth: 120 }} />
            <label style={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
              <input
                name="sflag"
                type="checkbox"
                checked={!!form.sflag}
                onChange={handleChange}
                className="form-checkbox"
                style={{ marginRight: 8 }}
              />
              Sflag
            </label>
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setForm({ id: '', name: '', permissions: '', reports: '', sflag: false }); }}>Cancel</button>}
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><h2>Siteguids List</h2></div>
        <div className="card-content">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Permissions</th>
                <th>Reports</th>
                <th>Sflag</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {siteguids.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.permissions}</td>
                  <td>{s.reports}</td>
                  <td>{s.sflag ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(s)}>Edit</button>
                    <button className="btn btn-error btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {siteguids.length === 0 && <tr><td colSpan={6}>No siteguids found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SiteguidsPage;
