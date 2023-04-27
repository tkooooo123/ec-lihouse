import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="contatiner d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="border-1">
                <h1 className="fw-bold">404 此頁面不存在</h1>
                <div className="d-flex justify-content-around mt-5">
                    <Link to="/">
                        <button type="button" className="btn btn-outline-primary">
                        <i className="bi bi-arrow-left"></i> 回到首頁
                        </button>
                    </Link>
                    <Link to="/products">
                        <button type="button" className="btn btn-primary">
                            前往購物 <i className="bi bi-arrow-right"></i>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
};

export default NotFound;