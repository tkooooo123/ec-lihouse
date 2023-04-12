import { NavLink } from "react-router-dom"
import { Collapse } from "bootstrap";

function Navbar({cartData}) {

  const closeCollapse = () => {
    let navCollapse = new Collapse('#navbarNav')
    navCollapse.hide()

  }

  return (
    <>
      <div className="bg-white sticky-top">
        <div className="container nav-container">
          <nav className="navbar px-0 navbar-expand-lg navbar-light bg-white">
            <NavLink className="navbar-brand position-absolute" to="/"
              style={{ left: '50%', transform: 'translate(-50%, -50%)', top: '2rem', }}>
              HEX SHOP
            </NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse collapse-horizontal navbar-collapse bg-white " id="navbarNav">
              <ul className="navbar-nav">
                <button className="btn close-btn" onClick={closeCollapse}><i className="bi bi-x-lg close-icon"></i></button>
                <li className="nav-item active">
                  <NavLink className="nav-link" to="/">首頁</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/products">本店商品</NavLink>
                </li>
              </ul>
              <div className="expand-bottom" onClick={closeCollapse}></div>
            </div>
            <div className="d-flex nav-icons">
              <NavLink className="nav-link" to="/login"><i className="bi bi-person-circle"></i></NavLink>
              <NavLink className="nav-link position-relative" to="/cart"><i className="bi bi-bag-fill"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartData?.carts?.length}
 
                </span>
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Navbar