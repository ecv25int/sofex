import React, { useState, useEffect } from 'react';
import { getToken } from '../../App';
import { tableStyle, thStyle, tdStyle } from '../../styles/layout';
import ProductImageCell from './ProductImageCell';

function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch providers from backend
  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/providers', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Failed to fetch providers');
      setProviders(await res.json());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchProviders();
  }, []);

  const getProviderName = (providerId) => {
    const provider = providers.find(p => p.id === providerId);
    return provider ? provider.name : 'Unknown';
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Products List</h2>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      
      {loading && <div>Loading products...</div>}
      
      {!loading && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>SKU ID</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Provider</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td style={tdStyle}>
                  <ProductImageCell productId={product.id} />
                </td>
                <td style={tdStyle}>{product.name}</td>
                <td style={tdStyle}>{product.skuId}</td>
                <td style={tdStyle}>{product.type}</td>
                <td style={tdStyle}>{getProviderName(product.providerId)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {!loading && products.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
          No products found.
        </div>
      )}
    </div>
  );
}

export default ProductsListPage;
