// Utility to fetch product images for a list of product IDs
export async function fetchProductImages(productIds, getToken) {
  const images = {};
  await Promise.all(productIds.map(async (pid) => {
    try {
      const res = await fetch(`/api/product-images/product/${pid}`, {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (res.ok) {
        const imgs = await res.json();
        images[pid] = imgs;
      }
    } catch {}
  }));
  return images;
}
