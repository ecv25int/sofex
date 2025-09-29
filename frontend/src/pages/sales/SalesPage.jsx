import React, { useState, useEffect } from 'react';
import { getToken } from '../../App';
import SalesListPage from './SalesListPage';
import SaleReadPage from './SaleReadPage';
import { fetchProductImages } from './ProductImageThumbs';

// --- ProductImagePreviewThumb: Modal preview logic copied from ProductImageCell ---
function ProductImagePreviewThumb({ product, image, onAddToCart }) {
  const [imgUrl, setImgUrl] = React.useState(null);
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    let revoked = false;
    setImgError(false);
    setImgUrl(null);
    if (image && (image.id || image.imageUrl)) {
      const fetchImg = async () => {
        try {
          const res = await fetch(`/api/product-images/blob/${product.id}`, {
            headers: { 'Authorization': 'Bearer ' + getToken() }
          });
          if (!res.ok) throw new Error('Image not found');
          const blob = await res.blob();
          if (revoked) return;
          const url = URL.createObjectURL(blob);
          setImgUrl(url);
        } catch {
          if (!revoked) setImgError(true);
        }
      };
      fetchImg();
      return () => {
        revoked = true;
        if (imgUrl) URL.revokeObjectURL(imgUrl);
      };
    }
  }, [image && image.id, image && image.imageUrl, product && product.id]);

  return (
    <div className="product-card" onClick={onAddToCart}>
      {imgUrl && !imgError ? (
        <img
          src={imgUrl}
          alt={product.name}
          className="product-image"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="product-image-placeholder">?</div>
      )}
      <div className="product-name">{product.name}</div>
    </div>
  );
}
function SalesPage() {
  // Save sale handler
  const handleSaveSale = async () => {
    setError('');
    try {
      // Only send productId, name, quantity, price for each cart item, using inventory price
      const itemsToSave = cart.map(({ productId, name, quantity }) => ({
        productId,
        name,
        quantity,
        price: getLatestInventoryPrice(productId)
      }));
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
        body: JSON.stringify({ items: itemsToSave, date: null, total: null }),
      });
      if (!res.ok) {
        let msg = 'Failed to save sale';
        try {
          const errJson = await res.json();
          if (errJson && errJson.message) msg = errJson.message;
        } catch {}
        throw new Error(msg);
      }
      // Only parse JSON if response is ok
      setCart([]);
      setView('list');
    } catch (err) {
      setError(err.message);
    }
  };
  const [products, setProducts] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [view, setView] = useState('main');
  const [selectedSaleId, setSelectedSaleId] = useState(null);

  // Always use inventory price for subtotal
  const subtotal = cart.reduce((sum, item) => sum + (item.quantity * (getLatestInventoryPrice(item.productId) || 0)), 0);

  // Handlers for navigation and cart
  const handleBackToList = () => {
    setSelectedSaleId(null);
    setView('main');
  };
  const handleSelectSuggestion = (product) => {
    addToCart(product);
    setQuery('');
    setSuggestions([]);
  };
  const updateQuantity = (productId, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.max(1, Number(qty)) } : item
      )
    );
  };
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };
// (Removed duplicate misplaced usage)
// Load products and inventories on mount
useEffect(() => {
  fetchProducts();
  fetchInventories();
}, []);

// Fetch top products only after products are loaded
useEffect(() => {
  if (products.length > 0) {
    fetchTopProducts();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [products]);

  const fetchProducts = async () => {
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
    }
  };

  const fetchInventories = async () => {
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
    }
  };

  // Fetch last 5 products added to inventory (by date)
  const fetchTopProducts = async () => {
    try {
      const res = await fetch('/api/inventories/last5', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) return;
      const lastInventories = await res.json();
      // Get unique product IDs in order of most recent
      const seen = new Set();
      const topIds = lastInventories
        .map(inv => Number(inv.idProduct))
        .filter(pid => {
          if (seen.has(pid)) return false;
          seen.add(pid);
          return true;
        });
      // Get product details
      const topProds = products.filter(p => topIds.includes(p.id));
      setTopProducts(topProds);
      // Fetch images for these products
      const imgs = await fetchProductImages(topIds, getToken);
      setProductImages(imgs);
    } catch {}
  };

  // Autocomplete logic
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    // Sum inventory quantities by productId
    const inventoryMap = {};
    inventories.forEach(inv => {
      // Ensure both keys are numbers for comparison
      const pid = Number(inv.idProduct);
      const qty = Number(inv.quantity) || 0;
      if (!inventoryMap[pid]) inventoryMap[pid] = 0;
      inventoryMap[pid] += qty;
    });
    setSuggestions(
      products.filter(p => {
        const pid = Number(p.id);
        const available = inventoryMap[pid] || 0;
        return p.name && p.name.toLowerCase().includes(q) && available > 1;
      })
    );
  }, [query, products, inventories]);

  // Helper to get the latest inventory price for a product
  function getLatestInventoryPrice(productId) {
    // Find the latest inventory (by date) for the product
    const invs = inventories.filter(inv => Number(inv.idProduct) === Number(productId) && inv.price != null);
    if (invs.length === 0) return 0;
    // Sort by date descending
    invs.sort((a, b) => new Date(b.date) - new Date(a.date));
    return Number(invs[0].price) || 0;
  }

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((item) => item.productId === product.id);
      const price = getLatestInventoryPrice(product.id);
      if (found) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1, price } : item
        );
      } else {
        // Always set productId for backend
        return [...prev, { ...product, productId: product.id, quantity: 1, price }];
      }
    });
  };

  if (view === 'read') {
    return <SaleReadPage saleId={selectedSaleId} onBack={handleBackToList} />;
  }
  if (view === 'list') {
    return <SalesListPage onSelectSale={id => { setSelectedSaleId(id); setView('read'); }} />;
  }

  // Get user roles from JWT for admin check
  let isAdmin = false;
  try {
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
    if (payload && payload.roles) {
      if (Array.isArray(payload.roles)) {
        isAdmin = payload.roles.map(r => r.toLowerCase()).includes('admin');
      } else if (typeof payload.roles === 'string') {
        isAdmin = payload.roles.toLowerCase() === 'admin';
      } else if (payload.authorities) {
        if (Array.isArray(payload.authorities)) {
          isAdmin = payload.authorities.map(r => r.toLowerCase()).includes('admin');
        } else if (typeof payload.authorities === 'string') {
          isAdmin = payload.authorities.toLowerCase() === 'admin';
        }
      }
    }
  } catch {}
  return (
    <div className="page-container">
      {/* Header Section with stats and subtitle */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div className="header-content">
          <div className="header-icon">🛒</div>
          <div className="header-text">
            <h1>Sales Management</h1>
            <p>Manage your sales and transactions</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stat">
            <span className="stat-number">{cart.length}</span>
            <span className="stat-label">In Cart</span>
          </div>
        </div>
        {/* Toolbar link for All Sales (admin only) */}
        {isAdmin && (
          <div style={{ position: 'absolute', right: 24, top: 24 }}>
            <a
              className="btn btn-outline btn-sm"
              href="#"
              onClick={e => { e.preventDefault(); setView('list'); }}
              style={{ textDecoration: 'none' }}
            >
              📋 All Sales
            </a>
          </div>
        )}
      </div>

      {/* Most Frequent Products Section (top 5 images) */}
      {topProducts.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 className="section-title">Recently Added to Inventory</h3>
          <div className="product-grid">
            {topProducts.map(prod => {
              const img = productImages[prod.id] && productImages[prod.id][0];
              return (
                <ProductImagePreviewThumb
                  key={prod.id}
                  product={prod}
                  image={img}
                  onAddToCart={() => addToCart(prod)}
                />
              );
            })}
          </div>
          <p className="help-text">Click an image to add to cart</p>
        </div>
      )}

      {/* Real Sales UI */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        {/* Removed View All Sales button from here */}
        {error && <div className="notification notification-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        <div className="form-group">
          <label className="form-label" htmlFor="product-autocomplete">Add Product:</label>
          <div className="autocomplete-container">
            <input
              id="product-autocomplete"
              type="text"
              placeholder="Type product name..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="form-input"
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <div className="autocomplete-suggestions">
                {suggestions.map(product => (
                  <div
                    key={product.id}
                    className="autocomplete-item"
                    onClick={() => handleSelectSuggestion(product)}
                  >
                    {product.id} - {product.name} {product.price ? `($${product.price.toFixed(2)})` : ''}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="section-title">Shopping Cart</h3>
        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>Cart is Empty</h3>
            <p>Add products to your cart to create a sale.</p>
          </div>
        ) : (
          <div className="item-list">
            {cart.map((item) => (
              <div key={item.productId} className="list-item">
                <div className="item-content">
                  <span className="item-number">#{item.productId}</span>
                  <div className="item-details">
                    <h3 className="item-title">{item.name}</h3>
                    <div className="item-meta">
                      <span>Price: {getLatestInventoryPrice(item.productId) ? `$${getLatestInventoryPrice(item.productId).toFixed(2)}` : 'N/A'}</span>
                      <span>Subtotal: {getLatestInventoryPrice(item.productId) ? `$${(getLatestInventoryPrice(item.productId) * item.quantity).toFixed(2)}` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="item-actions" style={{display:'flex',gap:'8px',alignItems:'center'}}>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, e.target.value)}
                    className="form-input form-input-sm"
                    style={{ width: '80px' }}
                  />
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => removeFromCart(item.productId)}
                    title="Remove from cart"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="total-section">
          <div className="total-amount">
            Total: ${subtotal.toFixed(2)}
          </div>
        </div>
        <div className="form-actions">
          <button 
            className="btn btn-primary btn-lg"
            onClick={handleSaveSale} 
            disabled={cart.length === 0}
          >
            Save Sale
          </button>
        </div>
      </div>
    </div>
  );
}

export default SalesPage;
