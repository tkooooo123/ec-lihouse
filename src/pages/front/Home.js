import { Link, useOutletContext } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { MessageContext, handleSuccessMessage, handleErrorMessage, handleSubscribeMessage } from "../../store/messageStore";
import copy from "copy-to-clipboard";
import SwiperBanner from "../../components/SwiperBanner";
import Loading from "../../components/Loading";
import Aos from "aos";
import 'aos/dist/aos.css';
import { useForm } from "react-hook-form";
import { Input } from "../../components/FormElements";

function Home() {
  const [products, setProducts] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [, dispatch] = useContext(MessageContext);
  const { getCart } = useOutletContext();
  const copyRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onTouched',
  });


  const getProducts = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products`);
      const resProducts = res.data.products.slice(0, 4);
      setProducts([...resProducts]);
      setIsLoading(false)
    } catch (error) {
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

  const onSubmit = (data) => {
    const { email } = data

    handleSubscribeMessage(dispatch)
  }

  useEffect(() => {
    getProducts();
    getFeedback();
    Aos.init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="mt-5 pt-4">
      <Loading isLoading={isLoading} />
      <SwiperBanner></SwiperBanner>
      <div className="container mt-2">
      
        <div className="about-wrapper" data-aos="fade-top">
          <div className="d-md-flex justify-content-around  bg-light p-5">
            <div className="col-md-6  pt-3 pt-lg-0">
              <h2 className="fw-bold text-primary ms-lg-5">《關於我們》</h2>
              <div className="text-wrapper">
                <p className="about-text fw-bold fs-5 p-lg-5 p-3">Li House 成立於2023年4月，旨在提供高品質的寵物用品與食品，完善毛孩們的健康與生活環境，並致力於成立流浪動物之家，為浪浪們提供一個溫暖的家。</p>
              </div>
            </div>
            <div className="about-image col-md-6 text-center" >
              <img src="https://animal.coa.gov.tw/public/upload/PublicShelterImage/191204121214235943VUWRS.jpg" alt="動物之家"
              />
            </div>
          </div>
        </div>
        <div className="row coupon mt-5" data-aos="fade-right">
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
                  setTimeout(() => {
                    setIsCopy(false);
                  }, 2000)
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
              <span className="ticket-code fs-4" ref={copyRef}>PET888</span>
            </div>
          </div>
        </div>
        <div className="new py-4" data-aos="fade-up">
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
                          alt="商品圖片" />
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
                        <h6 className="text-primary align-center mt-3">NT$ {product.price}</h6>

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
        <div className="pb-5" data-aos="fade-up">
          <h2 className="fw-bold mt-5 border-start border-primary border-5 ps-3">購買心得</h2>
          <div>
            <div className="justify-content-between row">
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
      <div className="subscribe-wrapper py-7 mt-5 ">
        <div className="d-flex justify-content-center" style={{ backgroundImage: 'url("https://images.chinatimes.com/newsphoto/2021-06-18/656/20210618001436.jpg")', backgroundPosition: '50%', backgroundSize: 'cover' }}>
          <div className="text-center mt-3 position-relative d-flex" style={{flexFlow: 'column wrap'}}>
            <div className="subscribe-bottom"></div>
            <h3 className="mt-3 fw-bold">Subscribe</h3>
            <p className="text-primary fw-bold p-1 m-0">訂閱我們，隨時收到最新優惠通知！</p>
            <form className="p-1" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-5 position-relative w-75"
                style={{ height: '80px' }}
              >
                <Input
                  id='email'
                  type='email'
                  errors={errors}
                  labelText=''
                  register={register}
                  rules={{
                    required: 'Email 為必填',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Email 格式不正確'
                    },
                  }}
                >
                </Input>
                <button className="btn btn-primary rounded-0 position-absolute"
                  type="submit"
                  style={{ top: '24px', left: '100%', transform: '', width: '30%' }}
                >訂閱</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;