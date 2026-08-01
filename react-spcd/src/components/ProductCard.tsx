import React from 'react';

// Define TypeScript interface for product data
interface Product {
    id: string;
    name: string;
    description: string;
    imageSrc: string; // Placeholder URL or local asset path
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      {/* Image container */}
      <div className="product-image">
        {/* Using a placeholder since no specific images are provided */}
        <img 
          src={product.imageSrc} 
          alt={`Image of ${product.name}`} 
          style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
        />
      </div>
      {/* Text content underneath image */}
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductCard;