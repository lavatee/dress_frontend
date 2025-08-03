import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { RequestWithRefresh } from './App';

export default function Product() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [media, setMedia] = useState([]);

    useEffect(() => {
        RequestWithRefresh(getProduct);
    }, [id]);

    async function getProduct() {
        try {
            const response = await fetch(`http://localhost:8000/api/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при загрузке товара');
            }
            setProduct(data.product);
            setMedia(data.product.media);
            setIsLiked(data.product.is_liked);
            if (data.media && data.media.length > 0) {
                setSelectedImage(0);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    async function getMedia() {
        try {
            const response = await fetch(`http://localhost:8000/api/products-media/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при загрузке изображений');
            }
            setMedia(data.media);
            if (data.media && data.media.length > 0) {
                setSelectedImage(0);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    async function checkIfLiked() {
        try {
            const response = await fetch('http://localhost:8000/api/products/liked', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            setIsLiked(data.liked_products.some(p => p.id === parseInt(id)));
        } catch (err) {
            console.error(err);
        }
    }

    async function toggleLike() {
        if (!localStorage.getItem('access_token')) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/products/${id}/${isLiked ? 'liked' : 'liked'}`, {
                method: isLiked ? 'DELETE' : 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Ошибка при добавлении в избранное');
            }
            setIsLiked(!isLiked);
        } catch (err) {
            setError(err.message);
        }
    }

    async function addToCart() {
        if (!localStorage.getItem('access_token')) {
            navigate('/login');
            return;
        }

        if (!selectedSize) {
            setError('Выберите размер');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/products/${id}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({
                    size: selectedSize,
                    amount: 1
                })
            });
            
            if (!response.ok) {
                throw new Error('Ошибка при добавлении в корзину');
            }
            
            navigate('/cart');
        } catch (err) {
            setError(err.message);
        }
    }

    if (!product) {
        return <div>Загрузка...</div>;
    }

    return (
        <>
            <Header сurrentPage="Товар" />
            <div style={{
                display: 'flex',
                padding: '120px 50px 50px 50px',
                gap: '50px'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '20px'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        {media?.length > 0 ? media.map((image, index) => (
                            <img
                                key={image.id}
                                src={image.url}
                                alt={product.name}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    cursor: 'pointer',
                                    border: selectedImage === index ? '2px solid black' : 'none'
                                }}
                                onClick={() => setSelectedImage(index)}
                            />
                        )) : <p>Изображений нет</p>}
                    </div>
                                         <img
                        src={selectedImage !== null && media[selectedImage] ? media[selectedImage].url : product?.main_photo_url}
                        alt={product?.name || 'Изображение товара'}
                        style={{
                            width: '500px',
                            height: '600px',
                            objectFit: 'cover'
                        }}
                    />
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    flex: 1
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h1>{product.name}</h1>
                        {isLiked ? (
                            <FaHeart
                                size={24}
                                onClick={toggleLike}
                                style={{ cursor: 'pointer' }}
                            />
                        ) : (
                            <FaRegHeart
                                size={24}
                                onClick={toggleLike}
                                style={{ cursor: 'pointer' }}
                            />
                        )}
                    </div>
                    <p style={{ fontSize: '24px' }}>{product.price} ₽</p>
                    <p>{product.description}</p>
                    <div>
                        <p style={{ marginBottom: '10px' }}>Размер</p>
                        <div style={{
                            display: 'flex',
                            gap: '10px'
                        }}>
                            {product?.sizes?.length > 0 ? product.sizes.map(size => (
                                <div
                                    key={size.id}
                                    onClick={() => setSelectedSize(size.name)}
                                    style={{
                                        padding: '10px 20px',
                                        border: '2px solid #555555',
                                        cursor: 'pointer',
                                        backgroundColor: selectedSize === size.name ? '#555555' : 'transparent',
                                        color: selectedSize === size.name ? 'white' : 'black'
                                    }}
                                >
                                    {size.name}
                                </div>
                            )) : <p>Размеров нет</p>}
                        </div>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button
                        onClick={addToCart}
                        style={{
                            padding: '15px',
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            marginTop: '20px'
                        }}
                    >
                        Добавить в корзину
                    </button>
                </div>
            </div>
        </>
    );
}