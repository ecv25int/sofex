import React, { useEffect, useState } from 'react';

function LicensesPage() {
  const [licenses, setLicenses] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', description: '', expirationDate: '', price: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchLicenses = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/licenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch licenses');
      setLicenses(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLicenses(); }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
        description: form.description,
        expirationDate: form.expirationDate,
        price: form.price
      };
      if (editing) {
        res = await fetch(`/api/licenses/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/licenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error('Failed to save license');
      setForm({ id: '', name: '', description: '', expirationDate: '', price: '' });
      setEditing(false);
      setSuccess('Saved!');
      fetchLicenses();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = l => {
    setForm({
      id: l.id,
      name: l.name,
      description: l.description,
      expirationDate: l.expirationDate,
      price: l.price
    });
    setEditing(true);
  };

  const handleDelete = async id => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/licenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete license');
      setForm({ id: '', name: '', description: '', expirationDate: '', price: '' });
      setEditing(false);
      setSuccess('License deleted successfully!');
      setTimeout(() => setSuccess(''), 2000);
      fetchLicenses();
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
          <div className="header-icon">🔑</div>
          <div className="header-text">
            <h1>Licenses</h1>
            <p>Manage licenses</p>
          </div>
        </div>
      </div>
      {error && <div className="notification notification-error">{error}</div>}
      {success && <div className="notification notification-success">{success}</div>}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h2>{editing ? 'Edit License' : 'Add License'}</h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="form-input" style={{ minWidth: 120 }} />
            <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="form-input" style={{ minWidth: 120 }} />
            <input name="expirationDate" value={form.expirationDate} onChange={handleChange} placeholder="Expiration Date (YYYY-MM-DD)" type="date" className="form-input" style={{ minWidth: 120 }} />
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" step="0.01" className="form-input" style={{ minWidth: 120 }} />
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setForm({ id: '', name: '', description: '', expirationDate: '', price: '' }); }}>Cancel</button>}
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><h2>Licenses List</h2></div>
        <div className="card-content">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Expiration Date</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map(l => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>{l.name}</td>
                  <td>{l.description}</td>
                  <td>{l.expirationDate}</td>
                  <td>{l.price}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(l)}>Edit</button>
                    <button className="btn btn-error btn-sm" onClick={() => handleDelete(l.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {licenses.length === 0 && <tr><td colSpan={6}>No licenses found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LicensesPage;
