import React from 'react';
import { Link } from 'react-router-dom';

// Define TypeScript interface for product data
interface Product {
    id: string;
    name: string;
    imageSrc: string; // Placeholder URL or local asset path
}

interface ProductCardProps {
    product: Product;
}

// Note: Changed return type to allow JSX wrapping in a component that uses Link
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/devices/${product.id}`} className="block cursor-pointer"> {/* Wrap body and add styling for click area */}
      <div className="product-card">
        {/* Image container */}
        <div className="product-image">
          {/* Using a placeholder since no specific images are provided */}
          <img 
            src={product.imageSrc} 
            alt={`Image of ${product.name}`} 
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
          />
        </div>
        {/* Text content underneath image */}
        <div className="product-info">
          <h3 className="text-2xl font-bold text-center">{product.name}</h3>
        </div>
      </div>
    </Link> // Close the Link tag
  );
};

export default ProductCard;