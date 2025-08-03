import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { FaHeart } from 'react-icons/fa';

export default function Liked() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getLikedProducts();
    }, []);

    async function getLikedProducts() {
        try {
            const response = await fetch('http://localhost:8000/api/products/liked', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при загрузке избранного');
            }
            setProducts(data.liked_products);
        } catch (err) {
            setError(err.message);
        }
    }

    async function removeFromLiked(productId) {
        try {
            const response = await fetch(`http://localhost:8000/api/products/${productId}/liked`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Ошибка при удалении из избранного');
            }
            setProducts(products.filter(p => p.id !== productId));
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <>
            <Header currentPage="Избранное" />
            <div style={{
                padding: '120px 50px 50px 50px'
            }}>
                <h1>Избранное</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '20px',
                    marginTop: '30px'
                }}>
                    {products?.length > 0 ? products.map(product => (
                        <div
                            key={product.id}
                            style={{
                                border: '1px solid #eee',
                                padding: '15px',
                                borderRadius: '8px',
                                position: 'relative'
                            }}
                        >
                            <FaHeart
                                size={24}
                                onClick={() => removeFromLiked(product.id)}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    cursor: 'pointer'
                                }}
                            />
                            <img
                                src={product.main_photo_url}
                                alt={product.name}
                                style={{
                                    width: '100%',
                                    height: '300px',
                                    objectFit: 'cover',
                                    marginBottom: '10px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(`/product/${product.id}`)}
                            />
                            <h3 style={{ marginBottom: '10px' }}>{product.name}</h3>
                            <p>{product.price} ₽</p>
                        </div>
                    )) : (
                        <p>В избранном пока ничего нет</p>
                    )}
                </div>
            </div>
        </>
    );
}