// Component to display a product card

/**
 * Component to display a product card.
 * @param {object} props 
 * @param {string} props.src - The image source URL.
 * @param {string} props.title - The name of the product.
 */
const ProductCard = ({ src, title }: { src: string; title: string }) => (
  <div className="border p-4 rounded shadow-md max-w-[250px] transition duration-300 hover:shadow-xl bg-white flex flex-col items-center">
    <img src={src} alt={title} className="w-full h-48 object-cover mb-3" />
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
  </div >
);

function App() {

  // Fix 2: Correctly define products as an Array of objects
  const products = [
    { src: './src/assets/ViewingDetector.jpg', title: 'Viewing Detector' },
    { src: './src/assets/VacuumPacker.jpg', title: 'Vacuum Packer' },
    { src: './src/assets/DepositMachine.jpg', title: 'Deposit Machine' },
    { src: './src/assets/CounterSorter.jpg', title: 'Counter Sorter' },
    { src: './src/assets/Counter.jpg', title: 'Counter' },
    { src: './src/assets/AutomaticDetector.jpg', title: 'Automatic Detector' },
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'space-around' }}>
          {products.map((product, index) => (
            // Calculate width to ensure three items fit well on wider screens minus gaps
            <div key={index} className="w-full sm:w-[calc(33%-16px)]"> 
              <ProductCard src={product.src} title={product.title} />
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