import axios from "axios";
import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";


function Cart() {
    const { cartData, getCart } = useOutletContext();
    const [loadingItems, setLoadingItem] = useState([])
    console.log(cartData)
    const removeCartItem = async (id) => {
        try {
            const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${id}`,);
            console.log(res)
            getCart();
        } catch (error) {
            console.log(error)
        }
    }
    const updateCartItem = async (item, quantity) => {
        try {
            const data = {
                data: {
                    product_id: item.product_id,
                    qty: quantity
                }
            }
            setLoadingItem([...loadingItems, item.id])
            const res = await axios.put(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${item.id}`,
                data);
            console.log(res)
            setLoadingItem(
                loadingItems.filter((loadingObject) => loadingObject !== item.id),
            );
            getCart();
        } catch (error) {
            console.log(error)
        }
    }

    return (

        <div className="container">
            <div className="bg-light p-2">
                <h2 className="text-center">購物車</h2>
            </div>
            <div className="row cart-wrapper p-3 mt-3">
                <div className="d-flex justify-content-end mt-2">
                    <button type="button" className="btn btn-outline-dark remove-all">刪除全部</button>
                </div>

                <table className="table mt-3">
                    <thead>
                        <tr>
                            <th scope="col" className="py-3 border-0 bg-light">名稱</th>
                            <th scope="col" className="py-3 border-0 bg-light">數量</th>
                            <th scope="col" className="py-3 border-0 bg-light">金額</th>
                            <th scope="col" className="py-3 border-0 bg-light">刪除</th>

                        </tr>
                    </thead>
                    <tbody>
                        {cartData.carts?.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <td className="py-2">
                                        <img src={item.product.imageUrl} alt="..." style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                        <div className="d-inline-block  align-middle">
                                            <h5 className="fw-bold" >{item.product.title}</h5>
                                            <p className="fs-8 text-muted">{item.product.category}</p>
                                        </div>
                                    </td>
                                    <td className="align-middle">
                                        <div className="item-quantity mt-3 ">
                                            <div className="input-group align-items-center" style={{ width: '80px' }}>
                                                <select name="" className="form-select" id=""
                                                    value={item.qty}
                                                    disabled={loadingItems.includes(item.id)}
                                                    onChange={
                                                        (e) => {
                                                            updateCartItem(item, e.target.value * 1)
                                                        }
                                                    }
                                                >
                                                    {
                                                        [...(new Array(20))].map((i, num) => {
                                                            return (
                                                                <option value={num + 1} key={num}>{num + 1}</option>

                                                            )

                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div></td>
                                    <td className="align-middle">
                                        <strong>NT$ {item.total}</strong>

                                    </td>
                                    <td className="align-middle">
                                        <button type="button" className="btn btn-outline-dark"><i className="bi bi-trash fs-4"></i></button></td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
                <div className="d-flex mt-2">
                    <input type="text" />
                    <div>
                        <button type="button" className="btn btn-primary mx-3"><i className="bi bi-gift"></i> 優惠碼</button>
                    </div>
                </div>
            </div>
            <div className="text-end border-bottom mt-4">
                <div className="mb-4">
                    小計： NT$  {cartData.total}
                </div>
                <div className="mb-4">
                    折扣： NT$  0
                </div>
                <div className="mb-4 fw-bold">
                    總計： NT$ {cartData.final_total}
                </div>
            </div>
            <div className="d-flex justify-content-between my-3">
                <Link to="/products">
                    <button type="button" className="btn btn-outline-dark mb-2">繼續購物</button>
                </Link>
                <Link to="/checkout">
                    <button type="button" className="btn btn-dark mb-2">確認結帳</button>
                </Link>

            </div>





        </div>
    )
};

export default Cart;