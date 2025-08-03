import './App.css';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import { FaChevronDown } from "react-icons/fa";
import { RequestWithRefresh } from './App';

export default function Products() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [category, setCategory] = useState(searchParams.get('category'));
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100000);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [collections, setCollections] = useState([]);
    const [isColorFilterOpen, setIsColorFilterOpen] = useState(false);
    const [selectedCollectionId, setSelectedCollectionId] = useState(0);
    useEffect(() => {
        const newCategory = searchParams.get('category');
        if (newCategory !== category) {
            setCategory(newCategory);
        }
    }, [searchParams, category]);

    useEffect(() => {
        if (category) {
            RequestWithRefresh(() => getProducts(getQuery())).then(data => setProducts(data.products));
        }
    }, [category, page]);

    useEffect(() => {
        RequestWithRefresh(() => getCollections()).then(data => setCollections(data.collections));
    }, []);
    function sizeClick(selectedSize) {
        if (sizes.includes(selectedSize)) {
            setSizes(sizes.filter(size => size !== selectedSize));
        } else {
            setSizes([...sizes, selectedSize]);
        }
    }
    function colorClick(selectedColor) {
        if (colors.includes(selectedColor)) {
            setColors(colors.filter(color => color !== selectedColor));
        } else {
            setColors([...colors, selectedColor]);
        }
    }
    function getQuery() {
        let query = `page=${page}`;
        if (category) {
            query += `&category=${category}`;
        }
        if (minPrice) {
            query += `&min_price=${minPrice}`;
        }
        if (maxPrice) {
            query += `&max_price=${maxPrice}`;
        }
        if (sizes.length > 0) {
            query += `&sizes=${sizes.join(",")}`;
        }
        if (colors.length > 0) {
            query += `&colors=${colors.join(",")}`;
        }
        if (selectedCollectionId) {
            query += `&collection_id=${selectedCollectionId}`;
        }
        return query;
    }
    return (
        <>
        <Header сurrentPage="Каталог"/>
                 <div style={{display: "flex", flexDirection: "row", marginTop: "100px", height: "calc(100vh - 100px)"}}>
              
              <div className="filters" style={{overflowY: "auto", height: "100%", position: "relative"}}>
                  <h3>Фильтры</h3>
                <div className="filter">
                    <p>Минимальная цена</p>
                    <input type="number" min={0} max={100000} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                    <p>Максимальная цена</p>
                    <input type="number" min={0} max={100000} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </div>
                <div className="filter">
                    <p>Размеры</p>
                    <div className="size">
                        <p className={sizes.includes("XS") ? "selectedSize" : ""} onClick={() => sizeClick("XS")}>XS</p>
                        <p className={sizes.includes("S") ? "selectedSize" : ""} onClick={() => sizeClick("S")}>S</p>
                        <p className={sizes.includes("M") ? "selectedSize" : ""} onClick={() => sizeClick("M")}>M</p>
                        <p className={sizes.includes("L") ? "selectedSize" : ""} onClick={() => sizeClick("L")}>L</p>
                        <p className={sizes.includes("XL") ? "selectedSize" : ""} onClick={() => sizeClick("XL")}>XL</p>
                        <p className={sizes.includes("2X") ? "selectedSize" : ""} onClick={() => sizeClick("2X")}>2X</p>
                    </div>
                </div>
                <div className="filter">
                    <p onClick={() => setIsColorFilterOpen(!isColorFilterOpen)} style={{cursor: "pointer"}}>Выбрать цвет <FaChevronDown style={{marginLeft: "10px", transition: "0.3s", transform: isColorFilterOpen ? "rotate(180deg)" : "rotate(0deg)"}}/></p>
                    {isColorFilterOpen && (
                        <div className="color" style={{backgroundColor: "lightgray", padding: "10px", borderRadius: "8px"}}>
                            <div className="color" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <input type="checkbox" name="color" value="white" placeholder='Белый' onChange={(e) => colorClick(e.target.value)}/>
                                <p>Белый</p>
                            </div>
                            <div className="color" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <input type="checkbox" name="color" value="black" placeholder='Чёрный' onChange={(e) => colorClick(e.target.value)}/>
                                <p>Чёрный</p>
                            </div>
                            <div className="color" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <input type="checkbox" name="color" value="red" placeholder='Красный' onChange={(e) => colorClick(e.target.value)}/>
                                <p>Красный</p>
                            </div>
                            <div className="color" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <input type="checkbox" name="color" value="green" placeholder='Зелёный' onChange={(e) => colorClick(e.target.value)}/>
                                <p>Зелёный</p>
                            </div>
                            <div className="color" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <input type="checkbox" name="color" value="yellow" placeholder='Жёлтый' onChange={(e) => colorClick(e.target.value)}/>
                                <p>Жёлтый</p>
                            </div>
                            <div className="color" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <input type="checkbox" name="color" value="purple" placeholder='Фиолетовый' onChange={(e) => colorClick(e.target.value)}/>
                                <p>Фиолетовый</p>
                            </div>
                            <div className="color" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <input type="checkbox" name="color" value="brown" placeholder='Коричневый' onChange={(e) => colorClick(e.target.value)}/>
                                <p>Коричневый</p>
                            </div>
                            <div className="color" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <input type="checkbox" name="color" value="gray" placeholder='Серый' onChange={(e) => colorClick(e.target.value)}/>
                                <p>Серый</p>
                            </div>
                            <div className="color" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <input type="checkbox" name="color" value="orange" placeholder='Оранжевый' onChange={(e) => colorClick(e.target.value)}/>
                                <p>Оранжевый</p>
                            </div>
                            <div className="color" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <input type="checkbox" name="color" value="khaki" placeholder='Хаки' onChange={(e) => colorClick(e.target.value)}/>
                                <p>Хаки</p>
                            </div>
                            <div className="color" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <input type="checkbox" name="color" value="beige" placeholder='Бежевый' onChange={(e) => colorClick(e.target.value)}/>
                                <p>Бежевый</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="filter">
                    <p>Коллекции</p>
                    <div className="collections">
                        {collections ? collections.map((collection) => (
                            <div key={collection.id} style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <input type="radio" name="collection" value={collection.id} placeholder={collection.name} onChange={(e) => setSelectedCollectionId(collection.id)}/>
                                <p>{collection.name}</p>
                            </div>
                        )) : <p>Коллекций нет</p>}
                    </div>
                </div>
                <button style={{position: "fixed", bottom: "10px", width: "28vw"}} onClick={() => {getProducts(getQuery()).then(setProducts)}}>Применить</button>
            </div>
            <div className="productsContainer" style={{
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    width: "70%",
                    height: "100%",
                    overflowY: "auto",
                    padding: "0 20px"
            }}>
                  <h1>{category}</h1>
                  <div className="products">
                    {products ? products.map((product) => (
                        <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} style={{cursor: "pointer"}}>
                            <img src={product.main_photo_url} />
                            <p>{product.name}</p>
                            <p>{product.price} ₽</p>
                        </div>
                    )) : <p>Товары не найдены</p>}
                </div>
                {products?.length >= page * 18 ? <button onClick={() => setPage(page + 1)}>Далее</button> : <p></p>}
            </div>
           
        </div>
        </>
    )
}



async function getProducts(query) {
    const response = await fetch(`http://localhost:8000/api/products/?${query}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    const data = await response.json();
    return {status: response.status, products: data?.products};
}

async function getCollections() {
    const response = await fetch(`http://localhost:8000/api/products/collections`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    const data = await response.json();
    return {status: response.status, collections: data?.collections};
}