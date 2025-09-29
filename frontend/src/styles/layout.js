// Centralized layout and style resources for the app

export const mainContainer = {
  display: 'flex',
  flexDirection: 'row',
  width: '100vw',
  height: '100vh',
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
  background: '#f6f8fa',
};

export const sidebar = {
  width: 200,
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 56,
  background: '#222',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 16,
  minHeight: 0,
  zIndex: 100,
  boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
};

export const sidebarMenu = {
  marginBottom: 24,
  fontSize: 24,
  fontWeight: 'bold',
};

export const sidebarItem = {
  marginBottom: 16,
  cursor: 'pointer',
  borderRadius: 4,
  padding: '6px 12px',
  transition: 'background 0.2s',
};

export const mainContent = {
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  marginLeft: 200,
  marginTop: 56,
  height: 'calc(100vh - 56px)',
  overflowY: 'auto',
  overflowX: 'auto',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'border-box',
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
};

export const pageWrapper = {
  width: '100%',
  maxWidth: 1200,
  margin: '0 auto',
  boxSizing: 'border-box',
  padding: 24,
};

export const tableStyle = {
  borderCollapse: 'collapse',
  width: '100%',
  background: '#fafbfc',
  borderRadius: 8,
  overflow: 'hidden',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
};

export const thStyle = {
  background: '#f0f1f3',
  color: '#222',
  fontWeight: 600,
  padding: '12px 16px',
  borderBottom: '1px solid #e0e0e0',
};

export const tdStyle = {
  padding: '10px 16px',
  borderBottom: '1px solid #e0e0e0',
};

export const formStyle = {
  display: 'flex',
  gap: 12,
  marginBottom: 24,
  alignItems: 'center',
};

export const inputStyle = {
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: 4,
  fontSize: 16,
};

export const buttonStyle = {
  padding: '8px 16px',
  background: '#1976d2',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: 16,
  marginLeft: 8,
  transition: 'background 0.2s',
};

export const cancelButton = {
  ...buttonStyle,
  background: '#aaa',
  color: '#fff',
};
