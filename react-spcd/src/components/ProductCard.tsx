import { Link } from 'react-router-dom';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        imageSrc: string;
    };
}    

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/devices/${product.id}`} className="block cursor-pointer">
      <div className="product-card">
        <div className="product-image">
          <img 
            src={product.imageSrc} 
            alt={`Image of ${product.name}`} 
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
          />
        </div>
        <div className="product-info">
          <h3 className="text-2xl font-bold text-center">{product.name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;