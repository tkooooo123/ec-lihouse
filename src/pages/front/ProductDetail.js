import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetail() {
    const [product, setProduct] = useState({});
    const { id } = useParams();
    console.log(id)

    const getProduct = async (id) => {
        const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/product/${id}`)
        console.log(productRes)
        setProduct(productRes.data.product)
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
                </div>
            </div>
        </div>
    )
};

export default ProductDetail;