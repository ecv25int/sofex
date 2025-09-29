import React, { useEffect, useState } from 'react';
import { getToken } from '../../App';
import { tableStyle, thStyle, tdStyle } from '../../styles/layout';

function SaleReadPage({ saleId, onBack }) {
  const [sale, setSale] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (saleId) fetchSale();
    // eslint-disable-next-line
  }, [saleId]);

  const fetchSale = async () => {
    setError('');
    try {
      const res = await fetch(`/api/sales/${saleId}`, {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Failed to fetch sale');
      const data = await res.json();
      setSale(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!sale) return <div>Loading...</div>;

  return (
    <div style={{ width: '100%', maxWidth: 900 }}>
      <button onClick={onBack} style={{ marginBottom: 16 }}>Back</button>
      <h2>Sale #{sale.id}</h2>
      <div>Date: {sale.date ? new Date(sale.date).toLocaleString() : '-'}</div>
      <div>Total: ${sale.total ? sale.total.toFixed(2) : '-'}</div>
      <h3>Items</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Product</th>
            <th style={thStyle}>Quantity</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {sale.items && sale.items.map((item, idx) => (
            <tr key={idx}>
              <td style={tdStyle}>{item.name}</td>
              <td style={tdStyle}>{item.quantity}</td>
              <td style={tdStyle}>{item.price ? `$${item.price.toFixed(2)}` : '-'}</td>
              <td style={tdStyle}>{item.price ? `$${(item.price * item.quantity).toFixed(2)}` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SaleReadPage;
