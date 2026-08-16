import React from 'react';
import { Link } from 'react-router-dom';

interface DeviceDTO {   // TODO: как-будто бы это лишний элемент и от него нужно ищбавиться
    id: number;
    name: string;
    image: string
}

interface DeviceCardProps {
    device: DeviceDTO;
    index: number;      // Идентификатор конкретной модели в списке
    productid: number;  // Идентифкатор продукта
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, index, productid }) => {
    return (
        <Link to={`/info/${productid}`} className="block cursor-pointer"> {/* Wrap body and add styling for click area */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col items-center text-center">
                <p className="text-sm text-gray-600 mb-3">Device {index + 1}</p>
                {/* 
                The backend requires ImageName to load the image. 
                We assume the image names are directly accessible or need a specific path prefix. 
                The backend must serve these images statically or via a proxy endpoint.
                */}
                <img 
                    src={`/api/files/${device.image}`} // Assuming an API endpoint for image serving
                    alt={`${device.name} device image`} 
                    className="w-full h-auto object-contain max-h-64 mb-3 border border-gray-200 rounded" 
                    onError={(e) => {
                        // Fallback mechanism if image loading fails
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