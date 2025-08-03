import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { FaSearch } from 'react-icons/fa';

export default function Search() {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSearch() {
        if (!query.trim()) return;

        try {
            const response = await fetch(`http://localhost:8000/api/products/search?query=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при поиске');
            }
            setProducts(data.products);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <>
            <Header currentPage="Поиск" />
            <div style={{
                padding: '120px 50px 50px 50px'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Поиск..."
                        style={{
                            padding: '15px',
                            fontSize: '16px',
                            border: '2px solid #555555',
                            flex: 1,
                            maxWidth: '600px'
                        }}
                    />
                    <FaSearch
                        size={24}
                        onClick={handleSearch}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '20px'
                }}>
                    {products?.length > 0 ? products.map(product => (
                        <div
                            key={product.id}
                            onClick={() => navigate(`/product/${product.id}`)}
                            style={{
                                border: '1px solid #eee',
                                padding: '15px',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            <img
                                src={product.main_photo_url}
                                alt={product.name}
                                style={{
                                    width: '100%',
                                    height: '300px',
                                    objectFit: 'cover',
                                    marginBottom: '10px'
                                }}
                            />
                            <h3 style={{ marginBottom: '10px' }}>{product.name}</h3>
                            <p>{product.price} ₽</p>
                        </div>
                    )) : <p>По вашему запросу ничего не найдено</p>}
                </div>
            </div>
        </>
    );
}