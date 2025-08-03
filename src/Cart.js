import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export default function Cart() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const [isAgreedToPersonalData, setIsAgreedToPersonalData] = useState(false);
    const [isAgreedToConfidential, setIsAgreedToConfidential] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getCartProducts();
    }, []);

    useEffect(() => {
        calculateTotal();
    }, [products]);

    async function getCartProducts() {
        try {
            const response = await fetch('http://localhost:8000/api/products/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при загрузке корзины');
            }
            setProducts(data.products_in_cart);
        } catch (err) {
            setError(err.message);
        }
    }

    async function removeFromCart(productId) {
        try {
            const response = await fetch(`http://localhost:8000/api/products/${productId}/cart`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Ошибка при удалении из корзины');
            }
            setProducts(products.filter(p => p.id !== productId));
        } catch (err) {
            setError(err.message);
        }
    }

    function calculateTotal() {
        if (products?.length > 0) {
            const subtotal = products.reduce((sum, product) => sum + product.price, 0);
            const delivery = products.length > 0 ? 500 : 0;
            setTotal(subtotal + delivery);
        } else {
            setTotal(0);
        }
    }

    function handleCheckout() {
        if (!isAgreedToPersonalData || !isAgreedToConfidential) {
            setError('Необходимо согласиться с условиями');
            return;
        }
        // Здесь будет логика оформления заказа
    }

    return (
        <>
            <Header currentPage="Корзина" />
            <div style={{
                padding: '120px 50px 50px 50px',
                display: 'flex',
                gap: '50px'
            }}>
                <div style={{ flex: 1 }}>
                    <h1>Корзина</h1>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        marginTop: '30px'
                    }}>
                        {products?.length > 0 ? products.map(product => (
                            <div
                                key={product.id}
                                style={{
                                    display: 'flex',
                                    gap: '20px',
                                    padding: '20px',
                                    border: '1px solid #eee',
                                    borderRadius: '8px'
                                }}
                            >
                                <img
                                    src={product.main_photo_url}
                                    alt={product.name}
                                    style={{
                                        width: '150px',
                                        height: '200px',
                                        objectFit: 'cover',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                />
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    flex: 1
                                }}>
                                    <div>
                                        <h3>{product.name}</h3>
                                        <p>Размер: {product.size}</p>
                                        <p>{product.price} ₽</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(product.id)}
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: '#000',
                                            border: '1px solid #000',
                                            alignSelf: 'flex-start'
                                        }}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <p>Корзина пуста</p>
                        )}
                    </div>
                </div>
                {products?.length > 0 && (
                    <div style={{
                        width: '400px',
                        padding: '30px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        height: 'fit-content'
                    }}>
                        <h2>Общая сумма:</h2>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '20px'
                        }}>
                            <p>Всего</p>
                            <p>{products ? products.reduce((sum, p) => sum + p.price, 0) : 0} ₽</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '10px'
                        }}>
                            <p>Доставка</p>
                            <p>500 ₽</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '20px',
                            paddingTop: '20px',
                            borderTop: '1px solid #eee',
                            fontWeight: 'bold'
                        }}>
                            <p>ИТОГО</p>
                            <p>{total} ₽</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            marginTop: '20px'
                        }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={isAgreedToPersonalData}
                                    onChange={(e) => setIsAgreedToPersonalData(e.target.checked)}
                                />
                                <span>Я согласен с обработкой персональных данных</span>
                            </label>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={isAgreedToConfidential}
                                    onChange={(e) => setIsAgreedToConfidential(e.target.checked)}
                                />
                                <span>Я согласен с политикой конфиденциальности и офертой</span>
                            </label>
                        </div>
                        <button
                            onClick={handleCheckout}
                            style={{
                                width: '100%',
                                marginTop: '20px'
                            }}
                        >
                            ОПЛАТИТЬ
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}