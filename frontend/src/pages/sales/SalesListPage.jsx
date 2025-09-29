import React, { useEffect, useState } from 'react';
import { getToken } from '../../App';
import { tableStyle, thStyle, tdStyle, buttonStyle } from '../../styles/layout';

function SalesListPage({ onSelectSale }) {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setError('');
    try {
      const res = await fetch('/api/sales', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Failed to fetch sales');
      const data = await res.json();
      setSales(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 900 }}>
      <h2>All Sales</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {sales.length === 0 ? (
        <div>No sales found.</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td style={tdStyle}>{sale.id}</td>
                <td style={tdStyle}>{sale.date ? new Date(sale.date).toLocaleString() : '-'}</td>
                <td style={tdStyle}>${sale.total ? sale.total.toFixed(2) : '-'}</td>
                <td style={tdStyle}>
                  <button style={buttonStyle} onClick={() => onSelectSale(sale.id)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SalesListPage;
