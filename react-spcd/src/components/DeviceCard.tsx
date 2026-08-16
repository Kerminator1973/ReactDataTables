import { Link } from 'react-router-dom';
import type { AnnotatedPicture } from '../types/AnnotatedPicture';

interface DeviceCardProps {
    device: AnnotatedPicture;   // Идентификатор конкретной модели - device.id. Уникальный, из базы данных
    productid: number;          // Идентификатор продукта
}

const DeviceCard = ({ device, productid }: DeviceCardProps) => {
    return (
        <Link to={`/info/${productid}`} className="block cursor-pointer">
            <div className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col items-center text-center">
                <p className="text-sm text-gray-600 mb-3">Device {device.id}</p>
                <img 
                    src={`/api/files/${device.image}`}
                    alt={`${device.name} device image`} 
                    className="w-full h-auto object-contain max-h-64 mb-3 border border-gray-200 rounded" 
                    onError={(e) => {
                        // Fallback-механизм на случай, если изображение не удаётся загрузить
                        e.currentTarget.onerror = null; 
                        e.currentTarget.alt = "Image failed to load";
                        e.currentTarget.className = "w-full h-auto object-contain max-h-64 mb-3 border border-red-300 bg-red-50 flex items-center justify-center text-red-500 text-sm";
                    }}
                />
                <p className="text-sm font-medium truncate max-w-full">
                    Name: {device.name || 'N/A'}
                </p>
            </div >
        </Link>
    );
};

export default DeviceCard;
