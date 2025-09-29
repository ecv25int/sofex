import React, { useEffect, useState } from 'react';
import { getToken } from '../../App';

function getFileName(url) {
  if (!url) return '';
  try {
    return url.split('/').pop().split('?')[0];
  } catch {
    return url;
  }
}



function ProductImageCell({ productId, onPreview }) {
  const [image, setImage] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/product-images/product/${productId}`, {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    })
      .then(res => res.ok ? res.json() : [])
      .then(imgs => setImage(imgs && imgs.length > 0 ? imgs[0] : null))
      .catch(() => setImage(null));
  }, [productId]);

  const [showModal, setShowModal] = useState(false);
  const [blobUrl, setBlobUrl] = useState('');

  if (!image) return <span style={{ color: '#888' }}>No image</span>;

  const handlePreview = async (e) => {
    e.stopPropagation();
    setShowModal(false);
    setBlobUrl('');
    // If it's a URL, just preview it
    if (/^https?:\/\//.test(image.imageUrl)) {
      if (onPreview) onPreview(image.imageUrl);
      return;
    }
    // Otherwise, fetch the image blob from the backend
    try {
      const res = await fetch(`/api/product-images/blob/${image.id}`, {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Image not found');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      setShowModal(true);
    } catch {
      setBlobUrl('');
      setShowModal(false);
    }
  };

  return (
    <>
      <span
        style={{ color: '#0074d9', textDecoration: 'underline', cursor: 'pointer' }}
        onClick={handlePreview}
        title={image.imageUrl}
      >
        {getFileName(image.imageUrl)}
      </span>
      {showModal && blobUrl && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowModal(false)}>
          <img src={blobUrl} alt="Preview" style={{ maxWidth: 400, maxHeight: 400, borderRadius: 8, background: '#fff', padding: 8 }} />
        </div>
      )}
    </>
  );
}

export default ProductImageCell;
