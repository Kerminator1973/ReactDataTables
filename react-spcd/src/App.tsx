import { Routes, Route } from 'react-router-dom';
import ProductCatalog from './Pages/ProductCatalog';
import ProductDevices from './Pages/ProductDevices';
import ProductInfo from './Pages/ProductInfo';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ProductCatalog />} />
        <Route path="/devices/:productId" element={<ProductDevices />} />
        <Route path="/info/:id" element={<ProductInfo />} />
      </Routes>
    </div>
  );
}

export default App;