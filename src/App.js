import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <BrouserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/search_products" element={<SearchProductsPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/for_buyers" element={<ForBuyersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrouserRouter>
  );
}

export async function RequestToApi(fetchFunc, saveFunc) { 
  try { 
      const response = await fetchFunc()

      if (response.status === 401) { 
          const refreshResponse = await fetch(`${backend}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({refresh_token: localStorage.getItem("refresh_token")})
        })

          if (refreshResponse.status === 401) { 
              alert(`Вы не авторизованы, перейдите на главную страницу: ${mainPage}`); 
          } else { 
              const refreshData = await refreshResponse.json();
              localStorage.setItem("access_token", refreshData.access)
              localStorage.setItem("refresh_token", refreshData.refresh)
              const response = await fetchFunc()
              if (response.status === 401) { 
                alert(`Вы не авторизованы, перейдите на главную страницу: ${mainPage}`); 
              } else {
                const data = await response.json();
                saveFunc(data, response.status)
              }
          }
      } else { 
          const data = await response.json();
          saveFunc(data, response.status)
      } 
  } catch (err) { 
      console.error(err); 
  } 
}

export default App;
