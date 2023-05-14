import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { MessageContext, handleErrorMessage, handleSuccessMessage } from "../../store/messageStore";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import FsLightbox from "fslightbox-react";

function ProductDetail() {
    const [product, setProduct] = useState({});
    const [randomProducts, setRandomProducts] = useState([])
    const [cartQuantity, setCartQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false)
    const { id } = useParams();
    const { getCart } = useOutletContext()
    const [, dispatch] = useContext(MessageContext);
    const [mainImage, setMainImage] = useState();
    const [tempImages, setTempImages] =useState([]);
    const [toggler, setToggler] = useState(false);

    const getProduct = async (id) => {
        try {
            setIsLoading(true);
            const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/product/${id}`);
            setProduct(productRes.data.product);
            setMainImage(productRes.data.product.imageUrl);
            setTempImages([productRes.data.product.imageUrl])
            if(productRes.data.product.imagesUrl) {
                setTempImages([
                    productRes.data.product.imageUrl,
                    ...productRes.data.product.imagesUrl
                ])

            }
            
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            handleErrorMessage(dispatch, error);
        }

    }

    const getRandomProducts = async (id) => {
        try {
            setIsLoading(true);
            const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
            //其他產品
            const products = res.data.products.filter(item => item.id !== id);
            const randomArray = [];
            const productsArray = [];
            for (let i = 0; randomArray.length < 4; i++) {
                const index = Math.floor(Math.random() * products.length)
                if (!randomArray.includes(index)) {
                    randomArray.push(index);
                    productsArray.push(products[index]);
                }
            }
            setRandomProducts(productsArray);
            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            handleErrorMessage(dispatch, error);
        }
    }

    const addToCart = async () => {
        try {
            const data = {
                data: {
                    product_id: product.id,
                    qty: cartQuantity,
                }
            }
            setIsLoading(true);
            const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`,
                data);

            await getCart();
            setIsLoading(false);
            handleSuccessMessage(dispatch, res);
        } catch (error) {
            setIsLoading(false);
            handleErrorMessage(dispatch, error);
        }
    }

    const changeMainImage = (image) => {
        setMainImage(image);     
    }

    useEffect(() => {
        getProduct(id);
        getRandomProducts(id);

    }, [id])

    return (
        <div className="container product-container mt-3 w-100">
            <Loading isLoading={isLoading} />
            <div>
			<FsLightbox
				toggler={toggler}
				sources={[
					...tempImages
				]}
                types={[
                    ...new Array(tempImages.length).fill('image')
                ]}
			/></div>
            <div className="row justify-content-center px-3">
                <div >
                    <div className="row">
                        <div className="product-detail col-lg-5 text-center ">
                            <div style={{height: '400px'}}
                            onClick={() => setToggler(!toggler)}> 
                                <img className="bg-light px-4 w-100 h-100  " src={mainImage} alt="商品圖片" style={{ height: '550px', objectFit: 'cover' }} />
                            </div>
                            <div className="d-flex text-nowrap overflow-scroll mt-3">
                                {tempImages?.map((img, i) => {
                                    return (
                                        <div className="bg-warning m-1 " key={i} >
                                            <img src={img} alt="產品其他圖片"
                                                style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                                                onClick={() => changeMainImage(img)}
                                            />
                                        </div>

                                    )
                                })}

                            </div>
                        </div>
                        <div className="col-lg-7 px-4 px-lg-5 mt-4 mt-lg-0">
                            <h1 className="fw-bolder">{product.title}</h1>
                            <p className="bg-secondary badge text-dark text-align fs-5 mt-3 py-1"><i className="bi bi-tag-fill"></i> {product.category}</p>
                            <p className="fw-bold fs-4 mt-3">{product.description}</p>
                            <p className="fw-bold fs-3 text-danger mt-lg-3"> NT$ {product.price}</p>
                            <div className="product-quantity">
                                <label className="fw-bold fs-4 mt-lg-3" htmlFor="quantity">數量</label>
                                <div className="input-group border w-50 mt-2">
                                    <div className="input-group-prepend">
                                        <button type="button" className="btn btn-outline-dark rounded-0 border-0 fs-5"
                                            onClick={() => setCartQuantity((pre) => pre === 1 ? pre : pre - 1)}
                                        ><i className="bi bi-dash-lg"></i></button>
                                    </div>
                                    <input type="number" className="form-control border-0 text-center fs-5"
                                        value={cartQuantity}
                                        readOnly />
                                    <div className="input-group-append">
                                        <button type="button" className="btn btn-outline-dark rounded-0 border-0 fs-5"
                                            onClick={() => {
                                                setCartQuantity((pre) => pre + 1)
                                            }}
                                        ><i className="bi bi-plus-lg"></i></button>
                                    </div>
                                </div>
                            </div>
                            <div className="w-50">
                                <button type="button" className="btn btn-primary w-100 rounded-0 mt-3 fs-5 fw-bold"
                                    onClick={() => addToCart()}
                                    disabled={isLoading}
                                >加入購物車</button>
                            </div>
                            <hr/>
                            <div>
                                <p className="text-danger fs-5 fw-bold"><i className="bi bi-exclamation-circle"></i> 購物須知</p>
                                <p className="m-0 fw-bold">1.單筆滿$699免運費 (限台灣本島、離島)</p>
                                <p className="mt-1 fw-bold">2.收件後如發現有破損情形，請立即拍照，並立即聯絡我們，會盡速處理</p>
                            </div>

                        </div>
                    </div>
                    <div className="d-flex justify-content-center ">
                        <div className="row bg-light mt-5 w-100">
                            <div className="col-lg-12 text-center mt-3 mx-lg-5">
                                <h2 className="fw-bold text-primary">商品描述</h2>
                                <p className="text-start fw-bold fs-5" style={{ whiteSpace: 'pre-line', }} >{product.content}</p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mx-2">
                <h2 className="fw-bold text-start text-primary mt-5 bs-light">其他產品</h2>
                {randomProducts.map((item) => {
                    return (
                        <div className="col-md-6 col-xl-3 my-3" key={item.id}>
                            <Link to={`/product/${item.id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="card mb-3">
                                    <div className="img-wrapper">
                                        <img src={item.imageUrl}
                                            className="card-img-top rounded-0"
                                            alt="商品圖片" />
                                        <div className="deatil-icon fs-5 fw-bold text-primary">
                                            <i className="bi bi-search"></i> 查看更多
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h4 className="text-dark" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.title}
                                        </h4>
                                        <span className="bg-secondary badge text-dark text-align py-1 "
                                        ><i className="bi bi-tag-fill"></i> {item.category}</span>
                                        <h6 className="text-primary align-center mt-2">NT$ {item.price}</h6>
                                        <button type="button" className="btn btn-primary text-white"
                                            style={{ position: 'absolute', bottom: '1rem', right: '1rem' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addToCart(item.id)
                                            }}
                                        >加入購物車</button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default ProductDetail;