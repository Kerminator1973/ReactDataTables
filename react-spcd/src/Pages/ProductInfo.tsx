import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export const ProductInfo: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    // documents теперь содержит только массив документов
    const [documents, setDocuments] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return; 
        setLoading(true);
        setError(null);

        // Обращаемся к Backend-у для получения списка документов        
        fetch(`https://localhost:7248/api/products/${id}`)
            .then((res) => res.json())
            // Ожидаем объект с полем 'documents' внутри
            .then((backendData: { documents: any[] }) => { 
                setDocuments(backendData.documents); // Извлекаем нужный массив
            })
            .catch((e) => {
                setError("Не удалось загрузить документы: " + e.message);
            })
            .finally(() => setLoading(false));
    }, [id]); 

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Информация о товаре: {id}</h1 >

            {/* Button/Link to Product Catalog */}
            <Link 
                to="/" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm teks-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out mb-8"
            >
                &larr; Вернуться в Каталог
            </Link>

            {/* Product details and documents */}
            <div className="p-6 bg-white shadow rounded-lg space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Характеристики</h2>
                    <p className="text-gray-600">Здесь будет полная информация о продукте с ID: {id}.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Документы прибора</h2>
                    {loading && <p className="text-blue-600">Загрузка документов...</p>}
                    {error && <p className="text-red-600">Ошибка: {error}</p>}
                    {!loading && !error && documents.length === 0 && (
                        <p className="text-gray-500">Документация для этого прибора не найдена.</p>
                    )}
                    {!loading && !error && documents.length > 0 && (
                       <ul className="list-disc pl-4 space-y-1">
                           {documents.map((doc: any, index: number) => (
                                <li key={index} className="text-gray-700">{doc.name || `Документ ${index + 1}`}</li>
                           ))}
                       </ul>
                    )}
                </div>
            </div>
        </div >
    );
};

export default ProductInfo;
