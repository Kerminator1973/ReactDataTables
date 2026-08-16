import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DeviceCard from '../components/DeviceCard';
import type { AnnotatedPicture } from '../types/AnnotatedPicture';

/**
 * Component to display a gallery of product devices.
 * Fetches device list details using the provided product ID.
 * @param {object} props - Contains potential props if needed later.
 */
const ProductDevices = () => {
  const { productId } = useParams<{ productId: string }>();
  const [devices, setDevices] = useState<AnnotatedPicture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("Product ID is required to display device list.");
      setLoading(false);
      return;
    }

    const fetchDevices = async () => {
      try {
        const apiUrl = `/api/products/${productId}/devices`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: AnnotatedPicture[] = await response.json();
        setDevices(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load devices. Please check the product ID and backend service.");
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [productId]);

  if (loading) {
    return <div className="p-4 text-center">Loading devices...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  if (!devices || devices.length === 0) {
    return <div className="p-4 text-center">No devices found for Product ID: {productId}.</div>;
  }

  const productIdAsNumber = productId ? parseInt(productId, 10) : 0;

  return (
    <div className="p-6">
      <Link 
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm teks-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out mb-8"
      >
          &larr; Вернуться в Каталог
      </Link>

      <h2 className="text-2xl font-bold mb-6">Device Gallery for Product ID: {productId}</h2>
      <div className="grid grid-cols-4 gap-6">
        {devices.map((device: AnnotatedPicture) => (
          <DeviceCard key={device.id} productid={productIdAsNumber} device={device} />
        ))}
      </div>
    </div>
  );
};

export default ProductDevices;
