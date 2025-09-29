
import React, { useRef, useState } from 'react';
import { inputStyle, buttonStyle } from '../../styles/layout';

// This component allows file selection and uploads the file to the backend.
// Only the filename is saved in the DB, and the backend should return a URL for preview.

export default function ProductImageUploadFile({ value, onChange, productId }) {
  const fileInput = useRef();
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) {
      setFileName('');
      setPreviewUrl('');
      if (onChange) onChange('');
      return;
    }
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    // Send file to backend as multipart/form-data
    if (!productId) {
      setError('Please select a product first.');
      return;
    }
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('file', file);
    try {
      const res = await fetch('/api/product-images/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + (window.getToken ? window.getToken() : (typeof getToken !== 'undefined' ? getToken() : '')) },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const img = await res.json();
      if (onChange) onChange(img.imageUrl);
    } catch (err) {
      setError('Upload failed');
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        style={inputStyle}
        onChange={handleFileChange}
      />
      {fileName && (
        <>
          <span style={{ color: '#0074d9', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setShowModal(true)}
            title={fileName}
          >
            {fileName}
          </span>
          {previewUrl && (
            <img src={previewUrl} alt="Preview" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }} />
          )}
        </>
      )}
      {showModal && previewUrl && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowModal(false)}>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: 400, maxHeight: 400, borderRadius: 8, background: '#fff', padding: 8 }} />
        </div>
      )}
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  );
}
