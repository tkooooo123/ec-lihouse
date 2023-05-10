import { NavLink, Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { Collapse } from "bootstrap";
import { useEffect, useState, useCallback } from "react";


function Navbar({ cartData }) {
  const [keyword, setKeyword] = useState('');
  const searchCollapse = document.querySelector('.search-collapse');
  const path = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const closeCollapse = () => {
    let navCollapse = new Collapse('#navbarNav');
    navCollapse.hide();

  }
  const openSearchCollapse = () => {
    searchCollapse.style.opacity = 0.9;
    searchCollapse.style.display = 'block'
  }
  const closeSearchCollapse = useCallback(() => {
    searchCollapse.style.opacity = 0;
    searchCollapse.style.display = 'none'
  },[searchCollapse.style])

  //搜尋欄Enter功能
  const keyDownEnter = (e) => {
    if (e.key === 'Enter') {
      setSearchParams({ keyword: e.target.value })
      navigate(`/search?keyword=${e.target.value}`);
      closeSearchCollapse();
    }
  }
  const handleChange = (e) => {
    setKeyword(e.target.value);
  }
  //清空input欄位
  useEffect(() => {
    setKeyword('');
    if (searchCollapse) {
      closeSearchCollapse();
    }
  }, [closeSearchCollapse, path, searchCollapse])


  return (
    <>
      <div className="nav-container">
        <nav className="navbar px-0 navbar-expand-lg navbar-light bg-primary px-3 px-lg-5">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <NavLink className="navbar-brand pe-5" to="/"
          >
            <img src="https://i.imgur.com/PhQKwj3.jpeg" alt="logo" style={{ width: '120px' }} />
          </NavLink>
          <div className="collapse collapse-horizontal navbar-collapse  " id="navbarNav">
            <ul className="navbar-nav">
              <button className="btn close-btn" onClick={closeCollapse}><i className="bi bi-x-lg close-icon"></i></button>
              <li className="nav-item active">
                <NavLink className="nav-link" to="/"
                  onClick={() => closeCollapse()}
                >首頁</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products"
                  onClick={() => closeCollapse()}
                >本店商品</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/frequencely_asked_questions"
                  onClick={() => closeCollapse()}
                >常見問題</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/articles"
                  onClick={() => closeCollapse()}
                >最新消息</NavLink>
              </li>
            </ul>
            <div className="expand-bottom" onClick={closeCollapse}></div>
          </div>
          <div className="search-bar form-group d-none d-lg-flex mx-3">
            <input type="text" className="form-control rounded-0" value={keyword} placeholder="找產品..." onChange={handleChange}
              onKeyDown={keyDownEnter}
            />
            <Link className={`nav-link ${keyword ? '1' : 'disabled'}`} to={`/search?keyword=${keyword}`}>
              <button type="button" className="form-control btn btn-outline-light rounded-0 bg-dark text-white">搜尋</button>
            </Link>
          </div>
          <div className="search-collapse">
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="search-bar form-group d-flex  mx-3">
                <input type="text" className="form-control rounded-0" value={keyword} placeholder="找產品..." onChange={handleChange}
                  onKeyDown={keyDownEnter} />
                <Link className={`nav-link ${keyword ? '1' : 'disabled'}`} to={`/search?query=${keyword}`} onClick={closeSearchCollapse}>
                  <button type="button" className="btn btn-outline-light rounded-0 bg-dark text-white">搜尋</button>
                </Link>
              </div>
            </div>
            <button className="btn close-btn border-0" onClick={closeSearchCollapse}><i className="bi bi-x-lg close-icon"></i></button>
          </div>
          <div className="d-flex justify-content-between nav-icons">
            <button type="button" className="btn fs-4 border-0 d-lg-none p-0" onClick={openSearchCollapse}><i className="bi bi-search text-white"></i></button>
            <NavLink className="nav-link" to="/login"><i className="bi bi-gear-fill text-white"></i></NavLink>
            <NavLink className="nav-link" to="/user/orders"><i className="bi bi-person-circle text-white"></i></NavLink>
            <NavLink className="nav-link position-relative" to="/cart"><i className="bi bi-bag-fill text-white"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartData?.carts?.length}
              </span>
            </NavLink>
          </div>
        </nav>
      </div>
    </>
  )
}

export default Navbar