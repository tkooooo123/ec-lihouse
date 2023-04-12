import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

function ProductDetail() {
    const [product, setProduct] = useState({});
    const [cartQuantity, setCartQuantity] = useState(1);
    const[isLoading, setIsLoading] = useState(false)
    const { id } = useParams();
    const { getCart } = useOutletContext()

    const getProduct = async (id) => {
        const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/product/${id}`)
        console.log(productRes)
        setProduct(productRes.data.product)
    }

    const addToCart = async() => {
        try {
            const data = {
                data: {
                    product_id: product.id,
                    qty: cartQuantity,
                }
            }
            setIsLoading(true)
            const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`,
            data)
            console.log(res)
            getCart()
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
       
    }

    useEffect(() => {
        getProduct(id)

    }, [id])

    return (
        <div className="container product-container">
            <div
                className="product-img"
                style={{
                    minHeight: '300px',
                    backgroundImage: `url(${product.imageUrl})`,
                    backgroundPosition: 'center center'
                }}></div>
            <div className="row product-info">
                <div className="col-md-7">
                    <h2>{product.title}</h2>
                    <p>NT$ {product.price}</p>
                    <p>{product.content}</p>
                    <div className="product-quantity">

                        <label htmlFor="quantity">數量</label>
                        <div className="input-group border">
                            <div className="input-group-prepend">
                                <button type="button" className="btn btn-outline-dark rounded-0 border-0"
                                onClick={() => setCartQuantity((pre) => pre === 1 ? pre : pre - 1)}
                                ><i className="bi bi-dash-lg"></i></button>
                            </div>

                            <input type="number" className="form-control border-0 text-center" 
                            value={cartQuantity}
                            readOnly/>
                            <div className="input-group-append">
                                <button type="button" className="btn btn-outline-dark rounded-0 border-0"
                                onClick={() => {
                                    setCartQuantity((pre) => pre + 1)
                                }}
                                ><i className="bi bi-plus-lg"></i></button>
                            </div>

                        </div>

                    </div>
                    <button type="button" className="btn btn-dark w-100 rounded-0"
                    onClick={() => addToCart()}
                    disabled={isLoading}
                    >加入購物車</button>
                </div>

            </div>
        </div>
    )
};

export default ProductDetail;