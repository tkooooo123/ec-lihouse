import { NavLink } from "react-router-dom"
import { Collapse } from "bootstrap";

function Navbar({cartData}) {

  const closeCollapse = () => {
    let navCollapse = new Collapse('#navbarNav')
    navCollapse.hide()

  }

  return (
    <>
   
        <div className="nav-container">
          <nav className="navbar px-0 navbar-expand-lg navbar-light bg-primary px-3 px-lg-5">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <NavLink className="navbar-brand pe-5" to="/"
              >
              <img src="https://i.imgur.com/PhQKwj3.jpeg" alt="logo" style={{width:'120px'}}/>
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
              </ul>
              <div className="expand-bottom" onClick={closeCollapse}></div>
            </div>
            <div className="d-flex justify-content-between nav-icons" style={{width: '110px'}}>
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