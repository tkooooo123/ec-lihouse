import { Link, useOutletContext } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { MessageContext, handleSuccessMessage, handleErrorMessage } from "../../store/messageStore";
import copy from "copy-to-clipboard";
import SwiperBanner from "../../components/SwiperBanner";
import Loading from "../../components/Loading";

function Home() {
  const [products, setProducts] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [, dispatch] = useContext(MessageContext);
  const { getCart } = useOutletContext();
  const copyRef = useRef(null);
  const getProducts = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products`);
      const resProducts = res.data.products.slice(0, 4);
      setProducts([...resProducts]);
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      handleErrorMessage(dispatch, error)
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
      handleSuccessMessage(dispatch, res)
      getCart()
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      handleErrorMessage(dispatch, error)
    }
  };
  const getFeedback = () => {
    setIsLoading(true)
    const dummyData = [
      {
        id: 1,
        avatar: 'https://w7.pngwing.com/pngs/754/2/png-transparent-samsung-galaxy-a8-a8-user-login-telephone-avatar-pawn-blue-angle-sphere-thumbnail.png',
        name: '林先生',
        product: '花漫四季-寵尚天綜合花草墊料',
        feedback: '發貨速度快，包裝完整、乾淨，貨物齊全且完好無缺'
      },
      {
        id: 2,
        avatar: 'https://w7.pngwing.com/pngs/754/2/png-transparent-samsung-galaxy-a8-a8-user-login-telephone-avatar-pawn-blue-angle-sphere-thumbnail.png',
        name: '蔡小姐',
        product: '倉鼠飛盤跑輪',
        feedback: '家中的小倉鼠很喜歡，每天勤奮的跑'
      },
      {
        id: 3,
        avatar: 'https://w7.pngwing.com/pngs/754/2/png-transparent-samsung-galaxy-a8-a8-user-login-telephone-avatar-pawn-blue-angle-sphere-thumbnail.png',
        name: '李小姐',
        product: '夢遊仙境-寵尚天綜合花草墊料',
        feedback: '味道好聞 能吃也能當裝飾品'
      }
    ]
    setFeedback([...dummyData]);
    setIsLoading(false)
  }
  useEffect(() => {
    getProducts();
    getFeedback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <div className="container mt-3">
        
        <Loading isLoading={isLoading}/>
        
        <SwiperBanner></SwiperBanner>
        <div className="row coupon">
          <div className="col-lg-6">
            <h2 className="fw-bold mt-5 border-start border-primary border-5 ps-3">歡慶開幕</h2>
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
          <h2 className="fw-bold mt-5 border-start border-primary border-5 ps-3">最新商品
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
        <div className=" mt-5">
          <h2 className="fw-bold mt-5 border-start border-primary border-5 ps-3">購買心得</h2>
          <div className="">
            <div className="d-flex justify-content-between row">
              {feedback.map((content) => {
                return (
                  <div className="col-lg-4" key={content.id}>
                    <div className="bg-light m-2 p-2">
                      <h4 className="fw-bold mt-3 text-primary">{content.product}</h4>
                      <div className="d-flex align-items-center">
                        <img src={content.avatar} alt="avatar" style={{ width: '60px', height: '60px' }} />
                        <div className="ms-2 mt-3">
                          <p className="fw-bold fs-5">{content.name}</p>
                          <p className="fw-bold fs-5 text-muted">{content.feedback}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>
        </div>
      </div>
      <div className=" py-7 mt-5 ">  
          <div className="d-flex justify-content-center" style={{ backgroundImage: 'url("https://images.chinatimes.com/newsphoto/2021-06-18/656/20210618001436.jpg")', backgroundPosition: '50%', backgroundSize: 'cover' }}>
            <div className="text-center mt-3">
              <h3>Subscribe</h3>
              <p className="text-muted fw-bold">訂閱我們，隨時收到最新優惠通知！</p>
              <div className="input-group mb-5">
                <input className="form-control" type="email" placeholder="請輸入 Email..." />
                <div className="input-group-append">
                  <button className="btn btn-primary rounded-0">訂閱</button>
                </div>
              </div>
            </div>
          </div>
      </div>
    
      
    </>
  )
}

export default Home;