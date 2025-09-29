import React, { useEffect, useState } from 'react';

function CountriesPage() {
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', currencyId: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCountries = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/countries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch countries');
      setCountries(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/currencies', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch currencies');
      setCurrencies(await res.json());
    } catch {}
  };

  useEffect(() => { fetchCountries(); fetchCurrencies(); }, []);

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
        currency: { id: form.currencyId }
      };
      if (editing) {
        res = await fetch(`/api/countries/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/countries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error('Failed to save country');
      setForm({ id: '', name: '', currencyId: '' });
      setEditing(false);
      setSuccess('Saved!');
      fetchCountries();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = c => {
    setForm({
      id: c.id,
      name: c.name,
      currencyId: c.currency?.id || ''
    });
    setEditing(true);
  };

  const handleDelete = async id => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/countries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete country');
      setForm({ id: '', name: '', currencyId: '' });
      setEditing(false);
      setSuccess('Country deleted successfully!');
      setTimeout(() => setSuccess(''), 2000);
      fetchCountries();
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
          <div className="header-icon">🌍</div>
          <div className="header-text">
            <h1>Countries</h1>
            <p>Manage countries</p>
          </div>
        </div>
      </div>
      {error && <div className="notification notification-error">{error}</div>}
      {success && <div className="notification notification-success">{success}</div>}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h2>{editing ? 'Edit Country' : 'Add Country'}</h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="form-input" style={{ minWidth: 120 }} />
            <select name="currencyId" value={form.currencyId} onChange={handleChange} required className="form-input" style={{ minWidth: 120 }}>
              <option value="">Select Currency</option>
              {currencies.map(cur => (
                <option key={cur.id} value={cur.id}>{cur.name}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setForm({ id: '', name: '', currencyId: '' }); }}>Cancel</button>}
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><h2>Countries List</h2></div>
        <div className="card-content">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Currency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {countries.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.currency?.name}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(c)}>Edit</button>
                    <button className="btn btn-error btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {countries.length === 0 && <tr><td colSpan={4}>No countries found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CountriesPage;
