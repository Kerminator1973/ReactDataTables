import React from 'react';
import { useParams } from 'react-router-dom';

export const ProductInfo: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    return (
        <h1>Информация о товаре: {id}</h1>
    );
};

export default ProductInfo;
