import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCoupons from "./pages/admin/AdminCoupons";
import FrontLayout from "./pages/front/FrontLayout";
import Home from "./pages/front/Home";
import Products from "./pages/front/Products";


function App() {
 

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<FrontLayout/>}>
          <Route path='' element={<Home/>}></Route>
          <Route path="products" element={<Products/>}></Route>
        </Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/admin" element={<Dashboard/>}>
          <Route path='products' element={<AdminProducts/>}></Route>
          
          <Route path='coupons' element={<AdminCoupons/>}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
