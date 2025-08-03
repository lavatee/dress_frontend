import { useNavigate } from 'react-router-dom';
import { FaSearch, FaRegHeart, FaShoppingCart } from "react-icons/fa";

export default function Header(props) {
  const navigate = useNavigate();
  return (
    <div className="header" style={{position: "fixed", top: "0", left: "0", right: "0", zIndex: "1000"}}>
      <img src="/img/logo.png" alt="logo" style={{width: "100px"}}/>
      <h3 className={props.сurrentPage === "Каталог" ? "currentHeaderLink" : "headerLink"} onClick={() => navigate("/categories")}>КАТАЛОГ</h3>
      <h3 className={props.сurrentPage === "Доставка" ? "currentHeaderLink" : "headerLink"} onClick={() => navigate("/delivery")}>ДОСТАВКА</h3>
      <h3 className={props.сurrentPage === "Покупателям" ? "currentHeaderLink" : "headerLink"} onClick={() => navigate("/for_buyers")}>ПОКУПАТЕЛЯМ</h3>
      <h3 className={props.сurrentPage === "О нас" ? "currentHeaderLink" : "headerLink"} onClick={() => navigate("/about")}>О НАС</h3>
      <FaSearch className="headerIcon" onClick={() => navigate("/search_products")}/>
      <FaRegHeart className="headerIcon" onClick={() => navigate("/favorites")}/>
      <FaShoppingCart className="headerIcon" onClick={() => navigate("/cart")}/>
      <button className="headerButton" onClick={() => navigate("/login")}>Войти</button>
    </div>
  )
}