import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";

function Products() {
    const [products, setProducts] = useState([])
    const [pagination, setPagination] = useState({})

    const getProducts = async (page = 1) => {
        const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products?page=${page}`)
        console.log(productRes)
        setProducts(productRes.data.products)
        setPagination(productRes.data.pagination)
    }

    useEffect(() => {
        getProducts()
    }, [])
    return (
        <>
            <div className="container products-container">
                <div className="row">
                    {products.map((product) => {
                        return (
                            <div className="col-md-3" key={product.id}>
                                <div className="card mb-3">
                                    <img src={product.imageUrl}
                                        className="card-img-top rounded-0"
                                        alt="..." />
                                        <div className="card-body">
                                            <h4 className="">
                                                {product.title}
                                            </h4>
                                            <p>NT$ {product.price}</p>
                                        </div>
                                </div>


                            </div>
                        )
                    })}

                </div>
                <Pagination pagination={pagination} changePage={getProducts} />
            </div>
        </>
    )

}

export default Products;