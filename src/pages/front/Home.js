import { Link, useOutletContext } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { MessageContext, handleSuccessMessage, handleErrorMessage } from "../../store/messageStore";
import copy from "copy-to-clipboard";

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [, dispatch] = useContext(MessageContext);
  const { getCart } = useOutletContext();
  const copyRef = useRef(null);
  const getProducts = async () => {
    try {
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products`);
      const resProducts = res.data.products.slice(0, 4);

      setProducts([...resProducts]);
      console.log('123', resProducts, products)
    } catch (error) {
      console.log(error)
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
      handleSuccessMessage(dispatch, res)
      getCart()
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      handleErrorMessage(dispatch, error)
    }
  };

  

  useEffect(() => {
    getProducts();
  }, [])
  return (
    <>
      <div className="container">
        <div className="row flex-md-row-reverse flex-column">
          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1526038335545-4b96864eaee7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1867&q=80
          alt=" className="img-fluid" alt="..." />
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center mt-md-0 mt-3">
            <h2 className="fw-bold">Lorem ipsum dolor sit</h2>
            <h5 className="font-weight-normal text-muted mt-2">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor
            </h5>
            <div className="input-group mb-0 mt-4">
              <input type="text" className="form-control rounded-0" placeholder="" />
              <div className="input-group-append">
                <button className="btn btn-dark rounded-0" type="button" id="search">
                  Lorem ipsum
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row coupon">
          <div className="col-lg-6">
            <h2 className="fw-bold mt-5">歡慶開幕</h2>
            <hr />
            <div className="text-center text-lg-start">
            <p className="fs-5 fw-bold">開幕優惠，即日起輸入優惠碼
              <span className="fs-3">PET888</span>
              享全館商品打
              <span className="fs-3">88</span>
              折
            </p>
            <button type="button" className="btn btn-primary rounded-0 p-3"
            onClick={() => {
              copy(copyRef.current.innerText);
              setIsCopy(true);
              }}>
              <span>
                {isCopy ? <i className="bi bi-clipboard-check me-2"></i> : <i className="bi bi-clipboard me-2"></i>}
                {isCopy ? '複製成功！' : '複製優惠碼'}</span>
            </button>

            </div>
           
          </div>
          <div className="col-lg-6 d-flex justify-content-center align-items-center mt-5">
            <div className="ticket mt-3 text-center text-white bg-primary py-3 fs-5">
              <span className="ticket-text fs-4">優惠碼</span>
              <span className="ticket-dash  mx-2" ></span>
              <span className="ticket-code fs-4" ref={copyRef}>PET8888</span>

            </div>


          </div>
        </div>

        <div className="new ">
          <h2 className="fw-bold mt-5">最新商品
            <Link to="/products">
              <span className="fs-5 mx-3">more +</span>
            </Link>
          </h2>
          <div className="row mx-5">
            {products.map((product) => {
              return (
                <div className="col-md-6 col-xl-3 mt-5" key={product.id}>
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
                        <h4 className="text-dark" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.title}
                        </h4>
                        <span className="bg-secondary badge text-dark text-align py-1 "
                        ><i className="bi bi-tag-fill"></i> {product.category}</span>
                        <h6 className="text-primary align-center mt-2">NT$ {product.price}</h6>

                        <button type="button" className="btn btn-primary text-white"
                          style={{ position: 'absolute', bottom: '1rem', right: '1rem' }}
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product.id);

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
      </div>
      <div className="bg-light mt-7">
        <div className="container">
          <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="row justify-content-center py-7">
                  <div className="col-md-8 d-flex">
                    <img src="https://images.unsplash.com/photo-1490138139357-fc819d02e344?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80" alt="" className="rounded-circle me-5" style={{ width: '160px', height: '160px', objectFit: 'cover', }} />
                    <div className="d-flex flex-column">
                      <p className="h5">“Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.”</p>
                      <p className="mt-auto text-muted">Lorem ipsum dolor sit amet.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="row justify-content-center py-7">
                  <div className="col-md-8 d-flex">
                    <img src="https://images.unsplash.com/photo-1490138139357-fc819d02e344?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80" alt="" className="rounded-circle me-5" style={{ width: '160px', height: '160px', objectFit: 'cover', }} />
                    <div className="d-flex flex-column">
                      <p className="h5">“Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.”</p>
                      <p className="mt-auto text-muted">Lorem ipsum dolor sit amet.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="row justify-content-center py-7">
                  <div className="col-md-8 d-flex">
                    <img src="https://images.unsplash.com/photo-1490138139357-fc819d02e344?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80" alt="" className="rounded-circle me-5" style={{ width: '160px', height: '160px', objectFit: 'cover', }} />
                    <div className="d-flex flex-column">
                      <p className="h5">“Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.”</p>
                      <p className="mt-auto text-muted">Lorem ipsum dolor sit amet.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>

      <div className="bg-light py-7">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4 text-center">
              <h3>Lorem ipsum</h3>
              <p className="text-muted">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.</p>
              <button className="btn btn-dark mt-4 rounded-0">Lorem ipsum</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home;