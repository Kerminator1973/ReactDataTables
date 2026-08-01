import ProductCard from './components/ProductCard';

function App() {

  // Fix 2: Correctly define products as an Array of objects
    const products = [
      { id: '1', name: 'Viewing Detector', imageSrc: './src/assets/ViewingDetector.jpg', description: 'Advanced viewing detection system.' },
      { id: '2', name: 'Vacuum Packer', imageSrc: './src/assets/VacuumPacker.jpg', description: 'Industrial vacuum packaging machinery.' },
      { id: '3', name: 'Deposit Machine', imageSrc: './src/assets/DepositMachine.jpg', description: 'Automated deposit processing and counting equipment.' },
      { id: '4', name: 'Counter Sorter', imageSrc: './src/assets/CounterSorter.jpg', description: 'High-speed item counting and sorting solution.' },
      { id: '5', name: 'Counter', imageSrc: './src/assets/Counter.jpg', description: 'Versatile product counter for various goods.' },
      { id: '6', name: 'Automatic Detector', imageSrc: './src/assets/AutomaticDetector.jpg', description: 'Precision detection of foreign or required objects.' },
    ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className='text-center py-16 mb-8'>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Vibe Product Catalog</h1>
        <p className="text-lg text-gray-600">Explore our range of industrial equipment.</p>
      </header>

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

      <footer className='py-8 mt-12 border-t bg-gray-100 text-center'>
          © {new Date().getFullYear()} Vibe Corporation. All rights reserved.
      </footer>
    </div >
  );
}

export default App;