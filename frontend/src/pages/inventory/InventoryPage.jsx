import React, { useState, useEffect } from 'react';
import { getToken } from '../../App';
import { tableStyle, thStyle, tdStyle, buttonStyle, inputStyle, formStyle } from '../../styles/layout';

function InventoryPage() {
  const [inventories, setInventories] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState({ id: '', idProduct: '', date: '', quantity: '', price: '', warehouseId: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [productQuery, setProductQuery] = useState('');
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [warehouseQuery, setWarehouseQuery] = useState('');
  const [warehouseSuggestions, setWarehouseSuggestions] = useState([]);

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
    // eslint-disable-next-line
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Typeahead for products
  useEffect(() => {
    if (productQuery.trim() === '') {
      setProductSuggestions([]);
      return;
    }
    const q = productQuery.toLowerCase();
    setProductSuggestions(products.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) || (p.skuId && p.skuId.toLowerCase().includes(q))
    ));
  }, [productQuery, products]);

  // Typeahead for warehouses
  useEffect(() => {
    if (warehouseQuery.trim() === '') {
      setWarehouseSuggestions([]);
      return;
    }
    const q = warehouseQuery.toLowerCase();
    setWarehouseSuggestions(warehouses.filter(w =>
      (w.name && w.name.toLowerCase().includes(q))
    ));
  }, [warehouseQuery, warehouses]);

  // Helper functions to get names for display
  const getProductName = (idProduct) => {
    const product = products.find(p => p.id === idProduct);
    return product ? product.name : 'Unknown Product';
  };

  const getProductProvider = (idProduct) => {
    const product = products.find(p => p.id === idProduct);
    return product?.provider?.name || 'No Provider';
  };

  const getWarehouseName = (warehouseId) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : 'Unknown Warehouse';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      let res;
      const payload = {
        idProduct: Number(form.idProduct),
        date: form.date,
        quantity: Number(form.quantity),
        price: form.price === '' ? null : Number(form.price),
        warehouseId: Number(form.warehouseId)
      };
      if (editing) {
        res = await fetch(`/api/inventories/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/inventories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error('Failed to save inventory');
      // Clear all form fields and search queries
      setForm({ id: '', idProduct: '', date: '', quantity: '', price: '', warehouseId: '' });
      setProductQuery('');
      setWarehouseQuery('');
      setEditing(false);
      fetchInventories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = inventory => {
    setForm({
      id: inventory.id,
      idProduct: inventory.idProduct,
      date: inventory.date,
      quantity: inventory.quantity,
      price: inventory.price,
      warehouseId: inventory.warehouseId
    });
    
    // Populate the search query fields for better UX
    const product = products.find(p => p.id === inventory.idProduct);
    if (product) {
      setProductQuery(`${product.id} - ${product.name}${product.skuId ? ` (${product.skuId})` : ''}`);
    }
    
    const warehouse = warehouses.find(w => w.id === inventory.warehouseId);
    if (warehouse) {
      setWarehouseQuery(`${warehouse.id} - ${warehouse.name}`);
    }
    
    setEditing(true);
  };

  const handleDelete = async id => {
    setError('');
    try {
      const res = await fetch(`/api/inventories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Failed to delete inventory');
      if (form.id === id) {
        setForm({ id: '', idProduct: '', date: '', quantity: '', price: '', warehouseId: '' });
        setEditing(false);
      }
      fetchInventories();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="canton-page" style={{ width: '100%', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header Section */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div className="header-content">
          <div className="header-icon">📦</div>
          <div className="header-text">
            <h1>Inventory Management</h1>
            <p>Manage your inventory records, products, and warehouses</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stat">
            <span className="stat-number">{inventories.length}</span>
            <span className="stat-label">Total Records</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="notification error" style={{ marginBottom: '2rem' }}>
          <span className="notification-icon">❌</span>
          <span className="notification-message">{error}</span>
          <button className="notification-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Add/Edit Inventory Section */}
      <div className="add-section" style={{ marginBottom: '2rem' }}>
        <div className="section-header">
          <h2>{editing ? 'Edit Inventory' : 'Add to Inventory'}</h2>
          <p>{editing ? 'Update inventory record' : 'Add a new inventory record'}</p>
        </div>
        <form className="add-form" onSubmit={handleSubmit}>
          {/* Product Selection Section */}
          {/* ...existing code for product selection... */}
          {/* Product Section */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <h3 style={{ marginBottom: 0, color: '#495057', fontSize: '1.1rem' }}>Product</h3>
            </div>
            <div className="card-content">
              <div className="input-group-vertical">
                <div className="input-wrapper">
                  <label>Search Product:</label>
                  <input
                    className="form-input"
                    name="productTypeahead"
                    placeholder="Type product name or SKU..."
                    value={productQuery}
                    onChange={e => setProductQuery(e.target.value)}
                    autoComplete="off"
                  />
                  {productSuggestions.length > 0 && (
                    <div className="suggestion-list">
                      {productSuggestions.map(p => (
                        <div
                          key={p.id}
                          className="suggestion-item"
                          onClick={() => {
                            setForm({ ...form, idProduct: p.id });
                            setProductQuery(`${p.id} - ${p.name}${p.skuId ? ` (${p.skuId})` : ''}`);
                            setProductSuggestions([]);
                          }}
                        >
                          {p.id} - {p.name} {p.skuId ? `(${p.skuId})` : ''}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {form.idProduct && (
                  <div className="input-row">
                    <div className="input-wrapper">
                      <label>Product Name:</label>
                      <input
                        className="form-input"
                        value={products.find(p => p.id === form.idProduct)?.name || ''}
                        disabled
                      />
                    </div>
                    <div className="input-wrapper">
                      <label>SKU:</label>
                      <input
                        className="form-input"
                        value={products.find(p => p.id === form.idProduct)?.skuId || ''}
                        disabled
                      />
                    </div>
                    <div className="input-wrapper">
                      <label>Provider:</label>
                      <input
                        className="form-input"
                        value={products.find(p => p.id === form.idProduct)?.provider?.name || 'No Provider'}
                        disabled
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Warehouse Section */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <h3 style={{ marginBottom: 0, color: '#495057', fontSize: '1.1rem' }}>Warehouse</h3>
            </div>
            <div className="card-content">
              <div className="input-group-vertical">
                <div className="input-wrapper">
                  <label>Search Warehouse:</label>
                  <input
                    className="form-input"
                    name="warehouseTypeahead"
                    placeholder="Type warehouse name..."
                    value={warehouseQuery}
                    onChange={e => setWarehouseQuery(e.target.value)}
                    autoComplete="off"
                  />
                  {warehouseSuggestions.length > 0 && (
                    <div className="suggestion-list">
                      {warehouseSuggestions.map(w => (
                        <div
                          key={w.id}
                          className="suggestion-item"
                          onClick={() => {
                            setForm({ ...form, warehouseId: w.id });
                            setWarehouseQuery(`${w.id} - ${w.name}`);
                            setWarehouseSuggestions([]);
                          }}
                        >
                          {w.id} - {w.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {form.warehouseId && (
                  <div className="input-row">
                    <div className="input-wrapper">
                      <label>Warehouse Name:</label>
                      <input
                        className="form-input"
                        value={warehouses.find(w => w.id === form.warehouseId)?.name || ''}
                        disabled
                      />
                    </div>
                    <div className="input-wrapper">
                      <label>Contact:</label>
                      <input
                        className="form-input"
                        value={warehouses.find(w => w.id === form.warehouseId)?.telephone || ''}
                        disabled
                      />
                    </div>
                    <div className="input-wrapper">
                      <label>Email:</label>
                      <input
                        className="form-input"
                        value={warehouses.find(w => w.id === form.warehouseId)?.email || ''}
                        disabled
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Inventory Details Section */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ marginBottom: 0, color: '#495057', fontSize: '1.1rem' }}>Inventory Details</h3>
            </div>
            <div className="card-content">
              <div className="input-group-vertical">
                <div className="input-row">
                  <div className="input-wrapper">
                    <label>Date:</label>
                    <input
                      className="form-input"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-wrapper">
                    <label>Quantity:</label>
                    <input
                      className="form-input"
                      name="quantity"
                      type="number"
                      placeholder="Enter quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      required
                      min="0"
                    />
                  </div>
                  <div className="input-wrapper">
                    <label>Price ($):</label>
                    <input
                      className="form-input"
                      name="price"
                      type="number"
                      placeholder="Enter price"
                      value={form.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="input-row input-with-button" style={{ justifyContent: 'center' }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {editing ? 'Update Inventory' : 'Add to Inventory'}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setForm({ id: '', idProduct: '', date: '', quantity: '', price: '', warehouseId: '' });
                        setEditing(false);
                        setProductQuery('');
                        setWarehouseQuery('');
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Inventory List Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 style={{ marginBottom: 0 }}>Inventory List</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '1rem' }}>Manage existing inventory records</p>
        </div>
        <div className="card-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading inventory records...</p>
            </div>
          ) : (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <thead>
                  <tr style={{ background: '#f5f6fa' }}>
                    <th style={{ padding: '12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #e0e0e0' }}>ID</th>
                    <th style={{ padding: '12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #e0e0e0' }}>Product</th>
                    <th style={{ padding: '12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #e0e0e0' }}>Provider</th>
                    <th style={{ padding: '12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #e0e0e0' }}>Date</th>
                    <th style={{ padding: '12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #e0e0e0' }}>Warehouse</th>
                    <th style={{ padding: '12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #e0e0e0' }}>Quantity</th>
                    <th style={{ padding: '12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #e0e0e0' }}>Price</th>
                    <th style={{ padding: '12px', fontWeight: 600, color: '#333', borderBottom: '1px solid #e0e0e0' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventories.map(inventory => (
                    <tr key={inventory.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#555' }}>#{inventory.id}</td>
                      <td style={{ padding: '10px', color: '#222', fontWeight: 500 }}>{getProductName(inventory.idProduct)}</td>
                      <td style={{ padding: '10px', color: '#555' }}>{getProductProvider(inventory.idProduct)}</td>
                      <td style={{ padding: '10px', color: '#555' }}>{inventory.date}</td>
                      <td style={{ padding: '10px', color: '#555' }}>{getWarehouseName(inventory.warehouseId)}</td>
                      <td style={{ padding: '10px', color: '#555', textAlign: 'right' }}>{inventory.quantity}</td>
                      <td style={{ padding: '10px', color: '#555', textAlign: 'right' }}>{inventory.price !== undefined && inventory.price !== null ? `$${Number(inventory.price).toFixed(2)}` : '-'}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ marginRight: 6 }}
                        onClick={() => handleEdit(inventory)}
                        disabled={loading}
                        title="Edit inventory"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleDelete(inventory.id)}
                        disabled={loading}
                        title="Delete inventory"
                      >
                        🗑️ Delete
                      </button>
                      </td>
                    </tr>
                  ))}
                  {inventories.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                        <div className="empty-state">
                          <div className="empty-icon">📦</div>
                          <h3>No Inventory Records Found</h3>
                          <p>Start by adding your first inventory record above.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;
