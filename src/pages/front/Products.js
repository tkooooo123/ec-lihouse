import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { MessageContext, handleErrorMessage, handleSuccessMessage } from "../../store/messageStore";
import Loading from "../../components/Loading";

function Products() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [categories, setCategories] = useState([])
    const [currentCategory, setCurrentCategory] = useState('所有商品')
    const [isLoading, setIsLoading] = useState(false)
    const [, dispatch] = useContext(MessageContext)
    const { getCart } = useOutletContext();


    const getCategories = async () => {
        setIsLoading(true);
        const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
        const productsAll = res.data.products;
        let categoryList = ['所有商品'];
        productsAll.map((item) => {
            if (!categoryList.includes(item.category)) {
                categoryList.push(item.category)
                setCategories(categoryList)
            }
        });
        setIsLoading(false);
    }
    const getProductsAll = async (page = 1) => {
        try {
            setIsLoading(true);
            if (currentCategory !== '所有商品') {
                const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
                const filterProducts = res.data.products.filter(item => item.category === currentCategory);
                //分頁功能
                const pageItem = 10;
                const totalPage = Math.ceil(filterProducts.length / pageItem);
                const start = (page - 1) * pageItem;
                const end = page * pageItem;
                setProducts(filterProducts.slice(start, end));
                setPagination({
                    category: '',
                    current_page: page,
                    has_pre: page !== 1,
                    has_next: page < totalPage,
                    total_pages: totalPage
                });
            } else {
                const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products?page=${page}`)
                setProducts(productRes.data.products)
                setPagination(productRes.data.pagination)
            }
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            handleErrorMessage(dispatch, error);
        }
    }

    const addToCart = async (id) => {
        try {
            const data = {
                data: {
                    product_id: id,
                    qty: 1,
                }
            }
            setIsLoading(true)
            const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`,
                data)
            console.log(res)
            await getCart()
            setIsLoading(false)
            handleSuccessMessage(dispatch, res)
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            handleErrorMessage(dispatch, error)
        }
    }
    useEffect(() => {
        getCategories();

    }, []);
    useEffect(() => {
        getProductsAll();
    }, [currentCategory]);

    return (
        <>
            <div className="container products-container mt-3">
                <Loading isLoading={isLoading}/>
                <div className="row mt-3">

                    <div className="col-lg-3">
                        <h4 className="d-none d-lg-block fw-bold bg-light p-lg-3 border-start border-primary border-5">產品類型</h4>
                        <ul className="mt-3 px-2 d-flex d-lg-block justify-content-around">
                            {categories.map((category, i) => {
                                return (
                                    <li className={`fw-bold mb-3 p-2 ${currentCategory === category ? 'text-white bg-primary' : ''}`} key={i} onClick={() => setCurrentCategory(category)}
                                    >
                                        {category}
                                    </li>
                                )
                            })}

                        </ul>
                    </div>
                    <div className="col-lg-9 px-4">
                        <div className="row">
                            {products.map((product) => {
                                return (
                                    <div className="col-md-6 col-xl-4" key={product.id}>
                                        <Link to={`/product/${product.id}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div className="card mb-3">
                                                <div className="img-wrapper">
                                                    <img src={product.imageUrl}
                                                        className="card-img-top rounded-0"
                                                        alt="..." />
                                                    <div className="deatil-icon fs-5 fw-bold text-primary">
                                                        <i className="bi bi-search"></i> 查看更多
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <h4 className="text-dark" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace:'nowrap'}}>
                                                        {product.title}
                                                    </h4>
                                                    <span className="bg-secondary badge text-dark text-align py-1 " 
                                                    ><i className="bi bi-tag-fill"></i> {product.category}</span>
                                                    <h6 className="text-primary align-center mt-2">NT$ {product.price}</h6>
                                                    
                                                    <button type="button" className="btn btn-primary text-white"
                                                        style={{ position: 'absolute', bottom: '1rem', right: '1rem' }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            addToCart(product.id)
                                                        }}
                                                    >加入購物車</button>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <Pagination pagination={pagination} changePage={getProductsAll} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Products;