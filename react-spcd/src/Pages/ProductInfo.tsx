import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';


// Описание DTO - структуры объекта, который Backend возвращает на запрос клиента
interface DocumentDTO {
    id: number;
    name: string;       // Название документа
}

export const ProductInfo: React.FC = () => {
    // Извлекаем параметр id из URL навигационной системы
    const { id } = useParams<{ id: string }>();
    // Backend передаёт массив документов типа DocumentDTO
    const [documents, setDocuments] = useState<DocumentDTO[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		setError(null);

		fetch(`/api/products/${id}/documents`)
			.then((res) => res.json())
			.then((backendData: DocumentDTO[]) => {
				setDocuments(backendData);
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
						{documents.map((doc: DocumentDTO) => (
							<li key={doc.id} className="text-gray-700">
								{doc.name || `Документ ${doc.id}`}
							</li>
						))}					   
                       </ul>
                    )}
                </div>
            </div>
        </div >
    );
};

export default ProductInfo;
