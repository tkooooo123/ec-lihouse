import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCoupons from "./pages/admin/AdminCoupons";
import FrontLayout from "./pages/front/FrontLayout";
import Home from "./pages/front/Home";
import Products from "./pages/front/Products";
import ProductDetail from "./pages/front/ProductDetail";
import Cart from "./pages/front/Cart";
import Checkout from "./pages/front/Checkout";
import Success from "./pages/front/Success";
import UserOrders from "./pages/front/UserOrders";
import AutoScrollToTop from "./components/AutoScrollToTop";

function App() {


  return (
    <div className="App">
      <AutoScrollToTop>
        <Routes>
          <Route path="/" element={<FrontLayout />}>
            <Route path='' element={<Home />}></Route>
            <Route path="products" element={<Products />}></Route>
            <Route path="product/:id" element={<ProductDetail />}></Route>
            <Route path="cart" element={<Cart />}></Route>
            <Route path="checkout" element={<Checkout />}></Route>
            <Route path="success/:orderId" element={<Success />}></Route>
            <Route path="user/orders" element={<UserOrders />}></Route>
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/admin" element={<Dashboard />}>
            <Route path='products' element={<AdminProducts />}></Route>

            <Route path='coupons' element={<AdminCoupons />}></Route>
          </Route>
        </Routes>

      </AutoScrollToTop>

    </div>
  );
}

export default App;
