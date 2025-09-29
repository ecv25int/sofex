import React, { useState, useEffect } from 'react';
import { getToken } from '../../App';
import { tableStyle, thStyle, tdStyle } from '../../styles/layout';

function InventoryListPage() {
  const [inventories, setInventories] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInventories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/inventories', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Failed to fetch inventories');
      const data = await res.json();
      setInventories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await fetch('/api/warehouses', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Failed to fetch warehouses');
      const data = await res.json();
      setWarehouses(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchInventories();
    fetchProducts();
    fetchWarehouses();
  }, []);

  const getProductName = (idProduct) => {
    const product = products.find(p => p.id === idProduct);
    return product ? product.name : 'Unknown';
  };

  const getProductProvider = (idProduct) => {
    const product = products.find(p => p.id === idProduct);
    return product?.provider?.name || 'No Provider';
  };

  const getWarehouseName = (warehouseId) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : 'Unknown';
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Inventory List</h2>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      
      {loading && <div>Loading inventory...</div>}
      
      {!loading && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Provider</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Warehouse</th>
            </tr>
          </thead>
          <tbody>
            {inventories.map(inventory => (
              <tr key={inventory.id}>
                <td style={tdStyle}>{getProductName(inventory.idProduct)}</td>
                <td style={tdStyle}>{getProductProvider(inventory.idProduct)}</td>
                <td style={tdStyle}>{inventory.date}</td>
                <td style={tdStyle}>{inventory.quantity}</td>
                <td style={tdStyle}>${inventory.price}</td>
                <td style={tdStyle}>{getWarehouseName(inventory.warehouseId)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {!loading && inventories.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
          No inventory records found.
        </div>
      )}
    </div>
  );
}

export default InventoryListPage;
