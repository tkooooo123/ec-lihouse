import axios from "axios";
import { useContext, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { MessageContext, handleErrorMessage, handleSuccessMessage } from "../../store/messageStore";
import Loading from "../../components/Loading";
import { useEffect } from "react";
import Stepper from "../../components/Stepper";
import DeleteModal from "../../components/DeleteModal"
import { Modal } from "bootstrap";

function Cart() {
    const { cartData, getCart } = useOutletContext();
    const [loadingItems, setLoadingItem] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [, dispatch] = useContext(MessageContext);
    const [stepper] = useState(1);
    const deleteModal = useRef(null);
 

    const removeCartItem = async (id) => {
        try {
            setIsLoading(true);
            const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${id}`,);
            console.log(res)
            await getCart();
            setIsLoading(false);
        } catch (error) {
            handleErrorMessage(dispatch, error);
            console.log(error)
        }
    }
    const removeCart = async (id) => {
        try {
            setIsLoading(true);
            const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/carts`,);
            console.log(res)
            await getCart();
            closeDeleteModal()
            setIsLoading(false);
        } catch (error) {
            handleErrorMessage(dispatch, error);
            setIsLoading(false);
            console.log(error);
        }
    }
    const updateCartItem = async (item, quantity) => {
        try {
            setIsLoading(true)
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
            await getCart();
            setIsLoading(false);
        } catch (error) {
            handleErrorMessage(dispatch, error);
            setIsLoading(false);
            console.log(error);
        }
    }
    const applyCoupon = async (e) => {
        try {
            setIsLoading(true);
            const data = {
                data: {
                    code: couponCode,
                }
            }
            const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/coupon`,
                data);
            handleSuccessMessage(dispatch, res);
            await getCart();
            setIsLoading(false);
        } catch (error) {
            handleErrorMessage(dispatch, error);
            setIsLoading(false);
            console.log(error);
        }
    }

    const openDeleteModal = () => {
        deleteModal.current.show();
    }
    const closeDeleteModal = () => {
        deleteModal.current.hide();
    }

    useEffect(() => {
        (async function refreshView() {
            await getCart();
            setIsLoading(false);
        }())
        deleteModal.current = new Modal('#deleteModal', {
            backdrop: 'static'
        });
    }, [])

    return (
        <div className="container">
            <Loading isLoading={isLoading} />
            <DeleteModal close={closeDeleteModal} handleDelete={removeCart} text={'購物車中所有商品'}/>
            <Stepper stepper={stepper} />
            {!cartData?.carts?.length && (
                <div className="cart-alert text-center pt-5 mt-5" style={{ flexGrow: '1' }}>
                    <div className="mt-5" style={{ fontSize: '7rem' }}><i className="bi bi-cart-x-fill"></i></div>
                    <h2 className="fw-bold mt-3 text-primary">您的購物車沒有商品！</h2>
                    <Link to="/products" className="fw-bold btn btn-outline-dark my-3 px-3 py-2">
                        前往購物
                    </Link>
                </div>
            )}
            {!!cartData?.carts?.length && (

                <>
                    <div className="row cart-wrapper p-3 mt-3">
                        <div className="d-flex justify-content-end mt-2">
                            <button type="button" className="btn btn-outline-dark remove-all"
                                onClick={() => openDeleteModal()}
                            >刪除全部</button>
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
                                                <img src={item.product.imageUrl} alt="商品圖片" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                                <div className="d-inline-block  align-middle">
                                                    <h5 className="fw-bold" >{item.product.title}</h5>
                                                    <p className="fs-8 text-muted">{item.product.category}</p>
                                                </div>
                                            </td>
                                            <td className="align-middle">
                                                <div className="item-quantity mt-3 ">
                                                    <div className="input-group align-items-center" style={{ width: '80px' }}>
                                                        <select className="form-select" id=""
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
                                                <button type="button" className="btn btn-outline-dark"
                                                    onClick={() => removeCartItem(item.id)}
                                                ><i className="bi bi-trash fs-4"></i></button></td>
                                        </tr>
                                    )
                                })}

                            </tbody>
                        </table>
                        <div className="d-flex mt-2">
                            <label htmlFor=""></label>
                            <input type="text" value={couponCode} onChange={(e) => {
                                setCouponCode(e.target.value)
                            }} />
                            <div>
                                <button type="button" className={`btn btn-primary mx-3 ${couponCode ? '' : 'disabled' }`}
                                    onClick={() => applyCoupon()}
                                ><i className="bi bi-gift"></i> 優惠碼</button>
                            </div>
                        </div>
                    </div>
                    <div className="text-end border-bottom mt-4">
                        <div className="mb-4">
                            套用中優惠碼：{cartData.carts[0].coupon?.code}
                        </div>
                        <div className="mb-4">
                            小計： NT$  {cartData.total}
                        </div>
                        <div className="mb-4">
                            折扣： NT$  {cartData.total - Math.ceil(cartData.final_total)}
                        </div>
                        <div className="mb-4 fw-bold">
                            總計： NT$ {Math.ceil(cartData.final_total)}
                        </div>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                        <Link to="/products" className="btn btn-outline-dark mb-2">
                            繼續購物
                        </Link>
                        <Link to="/checkout" className="btn btn-primary mb-2">
                            確認結帳
                        </Link>

                    </div>
                </>

            )}

        </div>
    )
};

export default Cart;