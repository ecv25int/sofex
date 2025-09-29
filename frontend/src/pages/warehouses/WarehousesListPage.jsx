import React, { useState, useEffect } from 'react';
import { getToken } from '../../App';
import { tableStyle, thStyle, tdStyle } from '../../styles/layout';

function WarehousesListPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch warehouses from backend
  const fetchWarehouses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/warehouses', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Failed to fetch warehouses');
      const data = await res.json();
      setWarehouses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Warehouses List</h2>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      
      {loading && <div>Loading warehouses...</div>}
      
      {!loading && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Telephone</th>
              <th style={thStyle}>Email</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map(warehouse => (
              <tr key={warehouse.id}>
                <td style={tdStyle}>{warehouse.name}</td>
                <td style={tdStyle}>{warehouse.telephone}</td>
                <td style={tdStyle}>{warehouse.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {!loading && warehouses.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
          No warehouses found.
        </div>
      )}
    </div>
  );
}

export default WarehousesListPage;
