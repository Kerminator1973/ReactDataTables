import React from 'react';
import ProductCard from '../components/ProductCard';
import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';

interface Product {
  id: string;
  name: string;
  imageSrc: string;
}

const products: Product[] = [
  { id: '1', name: 'Viewing Detector', imageSrc: './src/assets/ViewingDetector.jpg' },
  { id: '2', name: 'Vacuum Packer', imageSrc: './src/assets/VacuumPacker.jpg' },
  { id: '3', name: 'Deposit Machine', imageSrc: './src/assets/DepositMachine.jpg' },
  { id: '4', name: 'Counter Sorter', imageSrc: './src/assets/CounterSorter.jpg' },
  { id: '5', name: 'Counter', imageSrc: './src/assets/Counter.jpg' },
  { id: '6', name: 'Automatic Detector', imageSrc: './src/assets/AutomaticDetector.jpg' },
];

const ProductCatalog: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PageHeader />
    
      <main className='container mx-auto'>
        <h2 className="text-3xl font-bold mb-8 border-b pb-2">Product Lineup</h2>
        
        {/* Grid layout for 6 products (approximately 3 wide x 2 high) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'flex-start', alignContent: 'stretch' }}>
          {products.map((product, index) => (
            // Calculate width to ensure three items fit well on wider screens minus gaps
            <div key={index} className="w-full sm:w-[calc(33%-16px)]"> 
              <ProductCard product={product} />
            </div>
          ))}
        </div >
      </main>

      <PageFooter />
    </div>
  );
}

export default ProductCatalog;