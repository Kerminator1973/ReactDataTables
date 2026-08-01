import React from 'react';
import { useParams, Link } from 'react-router-dom';

export const ProductInfo: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Информация о товаре: {id}</h1>

            {/* Button/Link to Product Catalog */}
            <Link 
                to="/" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out mb-8"
            >
                &larr; Вернуться в Каталог
            </Link>

            {/* Placeholder for product details */}
            <div className="p-6 bg-white shadow rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Характеристики</h2>
                <p className="text-gray-600">Здесь будет полная информация о продукте с ID: {id}.</p>
            </div>
        </div>
    );
};

export default ProductInfo;
