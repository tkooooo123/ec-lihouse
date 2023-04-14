import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { MessageContext, handleErrorMessage, handleSuccessMessage } from "../../store/messageStore";

function Success() {
    const { orderId } = useParams();
    const [orderData, setOrderData] = useState({});
    const [, dispatch] = useContext(MessageContext)
    const getOrder = async (orderId) => {
        console.log(orderId)
        const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/order/${orderId}`)
        console.log('orders', res);
        setOrderData(res.data.order);

    }
    const payOrder = async(orderId) => {
        try {
            const data = {
                order: orderData,
            }
            const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/pay/${orderId}`, data);
            console.log('pay', res);
            handleSuccessMessage(dispatch, res);
            getOrder(orderId);
            
        } catch (error) {
            console.log(error)
            handleErrorMessage(dispatch, error)
        }
    }
    useEffect(() => {
        getOrder(orderId);
    }, [orderId])
    return (
        <div className="container">
            <div className='d-flex justify-content-center align-items-center mt-3'>
                <p className='fs-1 mx-2'>
                    <i className="bi bi-check-circle-fill text-success"></i>
                </p>
                <div>
                    <h5 className="fw-bold mt-2">感謝您！您的訂單已建立完成</h5>
                    <p className="text-muted">訂單編號：{orderData.id}</p>
                </div>
            </div>
            <div className='row mt-4'>

                <div className="col-md-6">
                    <div className="mb-5">
                        <h5 className="fw-bold">訂單資訊</h5>
                        <ul className="mt-3">
                            <li className="d-flex">
                                <p className="w-25">訂購時間</p>
                                <p className="w-75 fw-bold">{orderData.create_at}</p>
                            </li>
                            <li className="d-flex">
                                <p className="w-25">處理狀態</p>
                                <p className="w-75 fw-bold">處理中</p>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="fw-bold">聯絡資訊</h5>

                        <ul className="mt-3">
                            <li className="d-flex">
                                <p className="w-25">姓名</p>
                                <p className="w-75 fw-bold">{orderData.user?.name}</p>
                            </li>
                            <li className="d-flex">
                                <p className="w-25">連絡信箱</p>
                                <p className="w-75 fw-bold">{orderData.user?.email}</p>
                            </li>
                            <li className="d-flex">
                                <p className="w-25">聯絡電話</p>
                                <p className="w-75 fw-bold">{orderData.user?.tel}</p>
                            </li>
                            <li className="d-flex">
                                <p className="w-25">運送地址</p>
                                <p className="w-75 fw-bold">{orderData.user?.address}</p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='col-md-6'>
                    <div className='card rounded-0 p-4 p-lg-5'>
                        <h3 className="fw-bold">購買項目</h3>
                        <div className='card-body px-1'>
                            {Object.values(orderData?.products || {}).map((item) => {
                                return (
                                    <li key={item.id}>
                                        <div className="d-flex justify-content-between border-bottom py-3">
                                            <div className="d-flex">
                                                <img className="" src={item.product.imageUrl} alt="..." style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                <p className="mt-2 px-3">{item.product.title} x {item.qty}</p>
                                            </div>
                                            <p className="mt-2">NT$ {item.final_total}</p>
                                        </div>
                                    </li>
                                )
                            })}
                        </div>
                        <li className="d-flex justify-content-between px-1">
                            <p className="h5 fw-bold">總計</p>
                            <p className="h5 fw-bold">NT$ {orderData.total}</p>
                        </li>
                    </div>
                    <div className="mt-4">
                    <h5 className="fw-bold">付款狀態</h5>
                    <ul className="mt-2 px-0 py-3 bg-light">
                        <li className="d-flex mt-2">
                            <p>付款方式 /</p>
                            <p className="mx-1">信用卡</p>
                        </li>
                        <li className="d-flex align-items-center mt-2">
                            <p>付款狀態 / </p>
                            <p className={`${orderData.is_paid ? 'bg-success' : 'bg-danger'} rounded fw-bold text-white p-1 mx-1`}>{orderData.is_paid ? '已付款' : '未付款'}</p>
                        </li>
                    </ul>

                    </div>
                    <div className="my-4 text-end">
                        <button type="button" className="btn btn-dark rounded-0 py-3 px-5" 
                        onClick={() => payOrder(orderId)}
                        >付款</button>
                    </div>
                </div>
            </div>


        </div>
    )

};
export default Success;