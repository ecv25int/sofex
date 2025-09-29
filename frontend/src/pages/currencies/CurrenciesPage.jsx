import React, { useEffect, useState } from 'react';

function CurrenciesPage() {
  const [currencies, setCurrencies] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', dollarExchangeRate: '', euroExchangeRate: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCurrencies = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/currencies', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch currencies');
      setCurrencies(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCurrencies(); }, []);

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
        dollarExchangeRate: form.dollarExchangeRate,
        euroExchangeRate: form.euroExchangeRate
      };
      if (editing) {
        res = await fetch(`/api/currencies/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/currencies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error('Failed to save currency');
      setForm({ id: '', name: '', dollarExchangeRate: '', euroExchangeRate: '' });
      setEditing(false);
      setSuccess('Saved!');
      fetchCurrencies();
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
      dollarExchangeRate: c.dollarExchangeRate,
      euroExchangeRate: c.euroExchangeRate
    });
    setEditing(true);
  };

  const handleDelete = async id => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/currencies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete currency');
      setForm({ id: '', name: '', dollarExchangeRate: '', euroExchangeRate: '' });
      setEditing(false);
      setSuccess('Currency deleted successfully!');
      setTimeout(() => setSuccess(''), 2000);
      fetchCurrencies();
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
          <div className="header-icon">💱</div>
          <div className="header-text">
            <h1>Currencies</h1>
            <p>Manage currencies</p>
          </div>
        </div>
      </div>
      {error && <div className="notification notification-error">{error}</div>}
      {success && <div className="notification notification-success">{success}</div>}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h2>{editing ? 'Edit Currency' : 'Add Currency'}</h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="form-input" style={{ minWidth: 120 }} />
            <input name="dollarExchangeRate" value={form.dollarExchangeRate} onChange={handleChange} placeholder="Dollar Exchange Rate" type="number" step="0.0001" className="form-input" style={{ minWidth: 120 }} />
            <input name="euroExchangeRate" value={form.euroExchangeRate} onChange={handleChange} placeholder="Euro Exchange Rate" type="number" step="0.0001" className="form-input" style={{ minWidth: 120 }} />
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setForm({ id: '', name: '', dollarExchangeRate: '', euroExchangeRate: '' }); }}>Cancel</button>}
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><h2>Currencies List</h2></div>
        <div className="card-content">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Dollar Exchange Rate</th>
                <th>Euro Exchange Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currencies.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.dollarExchangeRate}</td>
                  <td>{c.euroExchangeRate}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(c)}>Edit</button>
                    <button className="btn btn-error btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {currencies.length === 0 && <tr><td colSpan={5}>No currencies found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CurrenciesPage;
