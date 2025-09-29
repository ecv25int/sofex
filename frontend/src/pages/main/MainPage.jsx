              <div
                className={`btn ${selectedPage === 'siteguids' ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  marginBottom: 'var(--spacing-2)',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedPage('siteguids')}
              >
                {sidebarCollapsed ? '🛡️' : <>🛡️ Siteguids</>}
              </div>

import React, { useState } from 'react';
import { parseJwt } from '../../utils/jwt';
import ProductsPage from '../../pages/products/ProductsPage';
import ProductsListPage from '../../pages/products/ProductsListPage';
import ProvidersPage from '../../pages/providers/ProvidersPage';
import ProvidersListPage from '../../pages/providers/ProvidersListPage';
import SalesPage from '../../pages/sales/SalesPage';
import SalesListPage from '../../pages/sales/SalesListPage';
import SaleReadPage from '../../pages/sales/SaleReadPage';
import WarehousesPage from '../../pages/warehouses/WarehousesPage';
import WarehousesListPage from '../../pages/warehouses/WarehousesListPage';
import InventoryPage from '../../pages/inventory/InventoryPage';
import InventoryListPage from '../../pages/inventory/InventoryListPage';
import RoleManagementPage from '../roles/RoleManagementPage';
import UserManagementPage from '../users/UserManagementPage';
import ReportsPage from '../reports/ReportsPage';
import ProvincePage from '../../components/ProvincePage';
import CantonPage from '../../components/CantonPage';
import DistrictPage from '../../components/DistrictPage';
import ProviderTypePage from '../../pages/providertypes/ProviderTypePage';
import BrandsPage from '../../pages/brands/BrandsPage';
import CurrenciesPage from '../../pages/currencies/CurrenciesPage';
import LicensesPage from '../../pages/licenses/LicensesPage';
import SiteguidsPage from '../../pages/siteguids/SiteguidsPage';
import CountriesPage from '../../pages/countries/CountriesPage';
import {
  mainContainer,
  sidebar,
  sidebarMenu,
  sidebarItem,
  mainContent,
  pageWrapper
} from '../../styles/layout';



function MainPage({ onLogout }) {
  const [selectedPage, setSelectedPage] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // For All Sales detail view
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  // Get user roles from JWT
  let roles = [];
  try {
    const token = localStorage.getItem('token');
    const payload = parseJwt(token);
    if (payload && payload.roles) {
      if (Array.isArray(payload.roles)) {
        roles = payload.roles.map(r => r.toLowerCase());
      } else if (typeof payload.roles === 'string') {
        roles = [payload.roles.toLowerCase()];
      } else if (payload.authorities) {
        // fallback for authorities
        if (Array.isArray(payload.authorities)) {
          roles = payload.authorities.map(r => r.toLowerCase());
        } else if (typeof payload.authorities === 'string') {
          roles = [payload.authorities.toLowerCase()];
        }
      }
    }
  } catch {}
  const isAdmin = roles.includes('admin');
  const isSales = roles.includes('sales');
  const isReport = roles.includes('report');

  // Create user object for child components
  const user = {
    roles: roles.map(role => role.toUpperCase()) // Convert to uppercase for consistency with backend
  };

  let content;
  // Responsive: let content fill available space, but keep maxWidth for readability
  const contentWrapperStyle = {
    ...pageWrapper,
    width: '100%',
    maxWidth: 900,
    minWidth: 0,
    flex: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    alignSelf: 'center',
  };
  // Role-based page access
  if (selectedPage === 'products') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><ProductsPage /></div>;
    } else if (isReport) {
      content = <div style={contentWrapperStyle}><ProductsListPage /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'providers') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><ProvidersPage /></div>;
    } else if (isReport) {
      content = <div style={contentWrapperStyle}><ProvidersListPage /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'sales') {
    if (isAdmin || isSales) {
      content = <div style={contentWrapperStyle}><SalesPage /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'allsales') {
    if (isReport) {
      if (selectedSaleId) {
        content = <div style={contentWrapperStyle}><SaleReadPage saleId={selectedSaleId} onBack={() => setSelectedSaleId(null)} /></div>;
      } else {
        content = <div style={contentWrapperStyle}><SalesListPage onSelectSale={id => setSelectedSaleId(id)} /></div>;
      }
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'warehouses') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><WarehousesPage /></div>;
    } else if (isReport) {
      content = <div style={contentWrapperStyle}><WarehousesListPage /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'inventory') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><InventoryPage /></div>;
    } else if (isReport) {
      content = <div style={contentWrapperStyle}><InventoryListPage /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'users') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><UserManagementPage /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'reports') {
    if (isAdmin || isReport) {
      content = <div style={contentWrapperStyle}><ReportsPage /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'roles') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><RoleManagementPage /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'provinces') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><ProvincePage user={user} /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'cantons') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><CantonPage user={user} /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'districts') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><DistrictPage user={user} /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'providertypes') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><ProviderTypePage /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'brands') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><BrandsPage /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'currencies') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><CurrenciesPage /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'licenses') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><LicensesPage /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'siteguids') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><SiteguidsPage /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else if (selectedPage === 'countries') {
    if (isAdmin) {
      content = <div style={contentWrapperStyle}><CountriesPage /></div>;
    } else {
      content = <div style={contentWrapperStyle}><h2>Access Denied</h2></div>;
    }
  } else {
    content = (
      <div style={contentWrapperStyle}>
        <h1>Welcome to the Main Page!</h1>
        <p>This is the protected area after login.</p>
      </div>
    );
  }
              <div
                className={`btn ${selectedPage === 'countries' ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  marginBottom: 'var(--spacing-2)',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedPage('countries')}
              >
                {sidebarCollapsed ? '🌍' : <>🌍 Countries</>}
              </div>
              {/* Siteguids sidebar button moved inside the admin fragment below */}
              <div
                className={`btn ${selectedPage === 'licenses' ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  marginBottom: 'var(--spacing-2)',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedPage('licenses')}
              >
                {sidebarCollapsed ? '🔑' : <>🔑 Licenses</>}
              </div>

  return (
    <div
      style={{
        ...mainContainer,
        flexDirection: 'column',
        height: '100dvh', // Use dynamic viewport height for mobile
        width: '100vw',
        minHeight: 0,
        minWidth: 0,
        background: 'var(--color-gray-50)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        maxWidth: '100vw',
        maxHeight: '100dvh',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      {/* Top Toolbar */}
      <div style={{ 
        width: '100vw', 
        background: 'var(--color-white)', 
        color: 'var(--color-gray-900)', 
        padding: 'var(--spacing-3) var(--spacing-6)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        zIndex: 'var(--z-fixed)', 
        boxSizing: 'border-box',
        boxShadow: 'var(--shadow-md)',
        borderBottom: '1px solid var(--color-gray-200)'
      }}>
        <div style={{ 
          fontWeight: 'var(--font-weight-bold)', 
          fontSize: 'var(--font-size-xl)', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          color: 'var(--color-primary)'
        }}>
          SOFEX
        </div>
        <button 
          className="btn btn-outline btn-sm"
          onClick={onLogout}
          style={{ whiteSpace: 'nowrap', minWidth: 80 }}
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          width: '100vw',
          height: 'calc(100dvh - 56px)',
          marginTop: 56,
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden',
          maxWidth: '100vw',
          maxHeight: 'calc(100dvh - 56px)',
        }}
      >
        {/* Collapsible Sidebar */}
        <div
          style={{
            width: sidebarCollapsed ? 56 : 200,
            height: 'calc(100vh - 56px)',
            position: 'fixed',
            left: 0,
            top: 56,
            background: 'var(--color-white)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: sidebarCollapsed ? 'center' : 'flex-start',
            padding: sidebarCollapsed ? 'var(--spacing-2)' : 'var(--spacing-4)',
            transition: 'width var(--transition-normal)',
            minHeight: 0,
            zIndex: 'var(--z-sticky)',
            boxShadow: 'var(--shadow-md)',
            borderRight: '1px solid var(--color-gray-200)',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
        <div style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: sidebarCollapsed ? 'center' : 'flex-start', 
          height: sidebarCollapsed ? 56 : 'auto', 
          marginBottom: sidebarCollapsed ? 0 : 'var(--spacing-6)' 
        }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSidebarCollapsed(v => !v)}
            title={sidebarCollapsed ? 'Expand menu' : 'Collapse menu'}
            style={{
              width: sidebarCollapsed ? 40 : '100%',
              height: sidebarCollapsed ? 40 : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {sidebarCollapsed ? '☰' : '⮜'}
          </button>
        </div>
          {!sidebarCollapsed && (
            <div style={{ 
              marginBottom: 'var(--spacing-6)', 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-gray-700)'
            }}>
              Menu
            </div>
          )}
          <div 
            className={`btn ${selectedPage === 'home' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              marginBottom: 'var(--spacing-2)', 
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              width: '100%',
              cursor: 'pointer'
            }} 
            onClick={() => setSelectedPage('home')}
          >
            {sidebarCollapsed ? '🏠' : <>🏠 Home</>}
          </div>
          {isAdmin && (
            <>
              <div 
                className={`btn ${selectedPage === 'products' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('products')}
              >
                {sidebarCollapsed ? '📦' : <>📦 Products</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'providers' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('providers')}
              >
                {sidebarCollapsed ? '🏢' : <>🏢 Providers</>}
              </div>
              <div
                className={`btn ${selectedPage === 'providertypes' ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  marginBottom: 'var(--spacing-2)',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedPage('providertypes')}
              >
                {sidebarCollapsed ? '🏷️' : <>🏷️ Provider Types</>}
              </div>
              <div
                className={`btn ${selectedPage === 'brands' ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  marginBottom: 'var(--spacing-2)',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedPage('brands')}
              >
                {sidebarCollapsed ? '🏷️' : <>🏷️ Brands</>}
              </div>
              <div
                className={`btn ${selectedPage === 'currencies' ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  marginBottom: 'var(--spacing-2)',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedPage('currencies')}
              >
                {sidebarCollapsed ? '💱' : <>💱 Currencies</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'sales' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('sales')}
              >
                {sidebarCollapsed ? '💰' : <>💰 Sales</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'warehouses' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('warehouses')}
              >
                {sidebarCollapsed ? '🏬' : <>🏬 Warehouses</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('inventory')}
              >
                {sidebarCollapsed ? '📊' : <>📊 Inventory</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'users' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('users')}
              >
                {sidebarCollapsed ? '👤' : <>👤 Users</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'roles' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('roles')}
              >
                {sidebarCollapsed ? '🔑' : <>🔑 Roles</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'provinces' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('provinces')}
              >
                {sidebarCollapsed ? '🗺️' : <>🗺️ Provinces</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'cantons' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('cantons')}
              >
                {sidebarCollapsed ? '🏘️' : <>🏘️ Cantons</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'districts' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('districts')}
              >
                {sidebarCollapsed ? '🏛️' : <>🏛️ Districts</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('reports')}
              >
                {sidebarCollapsed ? '📈' : <>📈 Reports</>}
              </div>
            </>
          )}
          {isSales && !isAdmin && (
            <div 
              className={`btn ${selectedPage === 'sales' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                marginBottom: 'var(--spacing-2)', 
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                width: '100%',
                cursor: 'pointer'
              }} 
              onClick={() => setSelectedPage('sales')}
            >
              {sidebarCollapsed ? '💰' : <>💰 Sales</>}
            </div>
          )}
          {isReport && !isAdmin && (
            <>
              <div 
                className={`btn ${selectedPage === 'products' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('products')}
              >
                {sidebarCollapsed ? '📦' : <>📦 Products</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'providers' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('providers')}
              >
                {sidebarCollapsed ? '🏢' : <>🏢 Providers</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'allsales' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('allsales')}
              >
                {sidebarCollapsed ? '📋' : <>📋 Sales</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'warehouses' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('warehouses')}
              >
                {sidebarCollapsed ? '🏬' : <>🏬 Warehouses</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('reports')}
              >
                {sidebarCollapsed ? '📈' : <>📈 Reports</>}
              </div>
              <div 
                className={`btn ${selectedPage === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  marginBottom: 'var(--spacing-2)', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  cursor: 'pointer'
                }} 
                onClick={() => setSelectedPage('inventory')}
              >
                {sidebarCollapsed ? '📊' : <>📊 Inventory</>}
              </div>
            </>
          )}
        </div>
        {/* Main Content */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            marginLeft: sidebarCollapsed ? 56 : 200,
            overflowY: 'auto',
            overflowX: 'hidden',
            transition: 'margin-left var(--transition-normal)',
            height: '100%',
            background: 'var(--color-gray-50)',
            padding: 'var(--spacing-6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box',
            maxWidth: '100vw',
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
export default MainPage;
