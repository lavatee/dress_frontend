import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export default function Auth({ isLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`http://localhost:8000/auth/${isLogin ? 'sign-in' : 'sign-up'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(isLogin ? {
                    email,
                    password
                } : {
                    email,
                    password,
                    name
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так');
            }

            if (isLogin) {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                navigate('/');
            } else {
                navigate('/login');
            }
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <>
            <Header currentPage={isLogin ? "Вход" : "Регистрация"} />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '120px',
                padding: '20px'
            }}>
                <h1>{isLogin ? 'Вход' : 'Регистрация'}</h1>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <form onSubmit={handleSubmit} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    width: '100%',
                    maxWidth: '400px'
                }}>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{
                                padding: '15px',
                                fontSize: '16px',
                                border: '2px solid #555555'
                            }}
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '15px',
                            fontSize: '16px',
                            border: '2px solid #555555'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: '15px',
                            fontSize: '16px',
                            border: '2px solid #555555'
                        }}
                    />
                    <button type="submit" style={{
                        padding: '15px',
                        fontSize: '16px',
                        backgroundColor: '#000',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>
                <p style={{marginTop: '20px'}}>
                    {isLogin ? (
                        <>
                            Нет аккаунта?{' '}
                            <span 
                                onClick={() => navigate('/register')}
                                style={{cursor: 'pointer', textDecoration: 'underline'}}
                            >
                                Зарегистрироваться
                            </span>
                        </>
                    ) : (
                        <>
                            Уже есть аккаунт?{' '}
                            <span 
                                onClick={() => navigate('/login')}
                                style={{cursor: 'pointer', textDecoration: 'underline'}}
                            >
                                Войти
                            </span>
                        </>
                    )}
                </p>
            </div>
        </>
    );
}