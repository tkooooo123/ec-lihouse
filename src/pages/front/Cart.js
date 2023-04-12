import axios from "axios";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";


function Cart() {
    const { cartData, getCart } = useOutletContext();
    const[loadingItems, setLoadingItem] = useState([])
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
            <h2>購物車</h2>
            <div className="row " style={{ width: '40%' }}>
                {cartData.carts?.map((item) => {
                    return (
                        <div className="mb-2 d-flex align-items-center position-relative" key={item.id}

                        >
                            <img
                                style={{ width: '150px' }}
                                src={item.product.imageUrl}
                                alt="..."
                            />
                            <div className="item-info m-3">
                                <div className="item-title">{item.product.title}</div>
                                <div className="item-quantity mt-3 ">
                                    <div className="input-group align-items-center" style={{ width: '150px' }}>
                                       <select name="" className="form-select" id=""
                                       value={item.qty}
                                       disabled={loadingItems.includes(item.id)}
                                       onChange={
                                        (e) => {
                                            updateCartItem(item, e.target.value*1)
                                        }
                                       }
                                       >
                                        {
                                            [...(new Array(20))].map((i, num) => {
                                                return(
                                                    <option value={num + 1} key={num}>{num + 1}</option>

                                                )

                                            })
                                        }
                                        
                                       </select>

                                    </div>

                                </div>
                                <div className="item-price position-absolute" style={{ right: '30px', bottom: '10px' }}>NT$ {item.total}</div>
                            </div>
                            <button className="btn remove-btn position-absolute" style={{ top: '5px', right: '5px' }}
                                onClick={() => removeCartItem(item.id)}
                            >X</button>
                        </div>
                    )

                })}
                <div className="total-price d-flex aligm-items-center justify-content-between mt-3" ><h4>總金額</h4>
                    <div>NT$ {cartData.final_total}</div></div>
                <button type="button" className="btn btn-dark mb-2">確認</button>

            </div>


        </div>
    )
};

export default Cart;