import React, { useState, useEffect } from 'react';
import DeviceCard from '../components/DeviceCard';
import { useParams } from 'react-router-dom';

interface DeviceDTO {
    id: number;
    name: string;
    image: string
}

/**
 * Component to display a gallery of product devices.
 * Fetches device list details using the provided product ID.
 * @param {object} props - Contains potential props if needed later.
 */
const ProductDevices: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();

  const [devices, setDevices] = useState<DeviceDTO[]>([]);
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
        // Simulate API call to get devices list by product ID
        // Replace /api/devices/ endpoint with the actual backend endpoint
        const apiUrl = `/api/products/${productId}/devices`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: DeviceDTO[] = await response.json();
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
      <h2 className="text-2xl font-bold mb-6">Device Gallery for Product ID: {productId}</h2>
      <div className="grid grid-cols-4 gap-6">
        {devices.map((device: DeviceDTO, index: number) => (
          <DeviceCard key={device.id || index} 
            index={index} productid={productIdAsNumber} name={device.name} image={device.image} />
        ))}
      </div>
    </div>
  );
};

export default ProductDevices;
