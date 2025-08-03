import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Products from './Products';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import Auth from './Auth';
import Product from './Product';
import Cart from './Cart';
import Liked from './Liked';
import Search from './Search';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Auth isLogin={true} />} />
        <Route path="/register" element={<Auth isLogin={false} />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Liked />} />
        <Route path="/search_products" element={<Search />} />
        <Route path="/categories" element={<MainPage />} />
        <Route path="/delivery" element={<MainPage />} />
        <Route path="/for_buyers" element={<MainPage />} />
        <Route path="/about" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}



function MainPage() {
  const navigate = useNavigate();
  return (
    <div>
      <Header сurrentPage="Главная"/>
      <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "10px"}}>
        <h1>Каталог</h1>
        <h3 className="headerLink" onClick={() => navigate("/categories")}>СМОТРЕТЬ ВСЕ</h3>
      </div>
      <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: "10px"}}>
        <div className="mainPageCategory" onClick={() => navigate({ pathname: "/products", search: "?category=Платья" })}>
          <img src="/img/платья.jpg" alt="Платья" style={{width: "100%"}}/>
          <h2 style={{width: "100%", textAlign: "center"}}>Платья</h2>
        </div>
        <div className="mainPageCategory" onClick={() => navigate({ pathname: "/products", search: "?category=брюки" })}>
          <img src="/img/брюки.jpg" alt="брюки" style={{width: "100%"}}/>
          <h2 style={{width: "100%", textAlign: "center"}}>Брюки</h2>
        </div>
        <div className="mainPageCategory" onClick={() => navigate({ pathname: "/products", search: "?category=джинсы" })}>
          <img src="/img/джинсы.jpg" alt="джинсы" style={{width: "100%"}}/>
          <h2 style={{width: "100%", textAlign: "center"}}>Джинсы</h2>
        </div>
      </div>

    </div>
  )
}

export async function RequestWithRefresh(requestFunction) {
  try {
    const response = await requestFunction();
    if (response?.status == 401) {
      const refreshResponse = await fetch(`http://localhost:8000/auth/refresh`, {
          method: 'POST',
          body: JSON.stringify({refresh_token: localStorage.getItem('refresh_token')})
      });
      const refreshData = await refreshResponse.json();
      if (refreshResponse.status === 200) {
          localStorage.setItem('access_token', refreshData.access_token);
          localStorage.setItem('refresh_token', refreshData.refresh_token);
          return await requestFunction();
        }
    }
    return response;
  } catch (err) {
    console.log(err);
  }
}