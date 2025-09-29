import React, { useState, useEffect } from 'react';
import { getToken } from '../../App';
import ProductImageCell from './ProductImageCell';
import '../../styles/design-system.css';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', skuId: '', type: '', providerId: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchProviders();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      setProducts(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      let res;
      const payload = {
        name: form.name,
        skuId: form.skuId,
        type: form.type,
        provider: form.providerId ? { id: Number(form.providerId) } : null
      };
      let productId = form.id;
      if (editing) {
        res = await fetch(`/api/products/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to save product');
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to save product');
        const prod = await res.json();
        productId = prod.id;
      }
      // Save image if provided
      if (imageFile && productId) {
        const formData = new FormData();
        formData.append('productId', productId);
        formData.append('file', imageFile);
        await fetch('/api/product-images/upload', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + getToken() },
          body: formData,
        });
      }
      setForm({ id: '', name: '', skuId: '', type: '', providerId: '' });
      setImageFile(null);
      setImageFileName('');
      setEditing(false);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = product => {
    setForm({
      id: product.id,
      name: product.name,
      skuId: product.skuId || '',
      type: product.type || '',
      providerId: product.provider ? product.provider.id : ''
    });
    setEditing(true);
  };

  const handleDelete = async id => {
    setError('');
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Failed to delete product');
      if (form.id === id) {
        setForm({ id: '', name: '', skuId: '', type: '', providerId: '' });
        setEditing(false);
      }
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">📦</div>
          <div className="header-text">
            <h1>Product Management</h1>
            <p>Manage your business products and inventory</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stat">
            <span className="stat-number">{products.length}</span>
            <span className="stat-label">Total Products</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="notification notification-error">
          <span>❌</span>
          <span>{error}</span>
          <button className="notification-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Add/Edit Product Section */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card-header">
          <h2 className="card-title">{editing ? 'Edit Product' : 'Add New Product'}</h2>
          <p className="card-subtitle">{editing ? 'Update product information' : 'Create a new product'}</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  className="form-input"
                  name="name"
                  placeholder="Enter product name..."
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">SKU ID</label>
                <input
                  className="form-input"
                  name="skuId"
                  placeholder="Enter SKU ID..."
                  value={form.skuId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <input
                  className="form-input"
                  name="type"
                  placeholder="Enter product type..."
                  value={form.type}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Provider</label>
                <select
                  className="form-select"
                  name="providerId"
                  value={form.providerId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Provider</option>
                  {providers.map(provider => (
                    <option key={provider.id} value={provider.id}>{provider.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Image</label>
                <input
                  className="form-input"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    setImageFile(e.target.files[0] || null);
                    setImageFileName(e.target.files[0]?.name || '');
                  }}
                  disabled={loading}
                />
                {imageFileName && <span className="file-name">{imageFileName}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'disabled' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    {editing ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <span>{editing ? '💾' : '➕'}</span>
                    {editing ? 'Update Product' : 'Add Product'}
                  </>
                )}
              </button>
              {editing && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => { 
                    setForm({ id: '', name: '', skuId: '', type: '', providerId: '' }); 
                    setEditing(false); 
                    setError('');
                  }}
                  disabled={loading}
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Products List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Products List</h2>
          <p className="card-subtitle">Manage existing products</p>
        </div>
        <div className="card-content">
          {loading && products.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="item-list">
              {products.map(product => (
                <div key={product.id} className="list-item">
                  <div className="item-content">
                    <span className="item-number">#{product.id}</span>
                    <div className="item-details">
                      <h3 className="item-title">{product.name}</h3>
                      <div className="item-meta-row">
                        <span>SKU: {product.skuId || '-'}</span> | <span>Type: {product.type || '-'}</span> | <span>Provider: {product.provider ? product.provider.name : '-'}</span>
                      </div>
                    </div>
                    <div style={{ marginLeft: 'auto', marginRight: 16 }}>
                      <ProductImageCell productId={product.id} onPreview={setPreviewUrl} />
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleEdit(product)}
                      disabled={loading}
                      title="Edit product"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDelete(product.id)}
                      disabled={loading}
                      title="Delete product"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>No Products Found</h3>
                  <p>Start by adding your first product above.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image preview modal */}
      {previewUrl && (
        <div className="modal-overlay" onClick={() => setPreviewUrl('')}>
          <div className="modal-content">
            <img src={previewUrl} alt="Preview" className="preview-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
