import ProductCard from '../components/ProductCard';
import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import type { AnnotatedPicture } from '../types/AnnotatedPicture';

// Собираем все файлы из папки assets на этапе сборки
const assetModules = import.meta.glob('../assets/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

// Ключи вида "../assets/ViewingDetector.jpg" приводим к имени файла
const Assets: Record<string, string> = Object.fromEntries(
  Object.entries(assetModules).map(([path, url]) => [path.split('/').pop()!, url])
);

const products: AnnotatedPicture[] = [
  { id: 1, name: 'Viewing Detector', image: Assets['ViewingDetector.jpg'] },
  { id: 2, name: 'Vacuum Packer', image: Assets['VacuumPacker.jpg'] },
  { id: 3, name: 'Deposit Machine', image: Assets['DepositMachine.jpg'] },
  { id: 4, name: 'Counter Sorter', image: Assets['CounterSorter.jpg'] },
  { id: 5, name: 'Counter', image: Assets['Counter.jpg'] },
  { id: 6, name: 'Automatic Detector', image: Assets['AutomaticDetector.jpg'] },
];

const ProductCatalog = () => {
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