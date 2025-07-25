import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
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
