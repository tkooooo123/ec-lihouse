import axios from "axios"
import { MessageContext, handleErrorMessage, handleSuccessMessage } from "../store/messageStore"
import { useContext, useEffect, useState } from "react"
import Loading from "./Loading";

function OrderModal({ tempOrder, closeOrderModal, getOrders, isAdmin }) {
    const [, dispatch] = useContext(MessageContext);
    const [isLoading, setIsLoading] = useState(false);
    const [tempData , setTempData] = useState({
        is_paid: '',
        status: 0
    });
    const dummyData = [
        '未確認',
        '已確認',
        '處理中',
        '已送達'
    ]

    const payOrder = async () => {
        try {
            const data = {
                order: tempOrder,
            }
            const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/pay/${tempOrder.id}`, data)
            console.log(res)
            closeOrderModal()
            getOrders()
        } catch (error) {
            handleErrorMessage(dispatch, error)
            console.log(error)
        }
    }
    
    const handleChange = (e)=> {
        if(e.target.name === 'payment_status') {
            setTempData(preState =>({
                ...preState,
                is_paid: e.target.value === 'true'
            }));
        } else {
            setTempData(preState =>({
                ...preState,
                status: e.target.value
            }));
        }
    }

    const editOrder = async() => {
        try {
            setIsLoading(true);
            const res = await axios.put(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/order/${tempOrder.id}`, {
                data: {
                    ...tempOrder,
                    is_paid: tempData.is_paid,
                    status: Number(tempData.status)
                }
            })
            closeOrderModal();
            await getOrders();
            setIsLoading(false);
            handleSuccessMessage(dispatch, res);        
           
        } catch (error) {
            console.log(error);
            handleErrorMessage(dispatch, error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setTempData({
            is_paid: tempOrder.is_paid,
            status: tempOrder.status || 0,
          });

    }, [tempOrder])


    return (<div className="modal fade" id="orderModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                        訂單明細
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" ></button>
                </div>
                <div className='modal-body'>
                    <div className='row mb-2'>
                        <div className="col-lg-6">
                            <div className="mb-5">
                                <h5 className="fw-bold">訂單資訊</h5>
                                <ul className="mt-3">
                                    <li className="d-flex">
                                        <p className="w-25">訂購時間</p>
                                        <p className="w-75 fw-bold">{new Date(tempOrder.create_at * 1000).toLocaleDateString()}</p>
                                    </li>
                                    <li className="d-flex">
                                        <p className="w-25">處理狀態</p>
                                        {!tempOrder.status && (
                                            <p className="w-75 fw-bold">未確認</p>
                                        )}
                                        {!!(tempOrder.status === 0) && (
                                            <p className="w-75 fw-bold">未確認</p>
                                        )}
                                        {!!(tempOrder.status === 1) && (
                                            <p className="w-75 fw-bold">已確認</p>
                                        )}
                                        {!!(tempOrder.status === 2) && (
                                            <p className="w-75 fw-bold">處理中</p>
                                        )}
                                        {!!(tempOrder.status === 3) && (
                                            <p className="w-75 fw-bold">已送達</p>
                                        )}
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="fw-bold">聯絡資訊</h5>

                                <ul className="mt-3">
                                    <li className="d-flex">
                                        <p className="w-25">姓名</p>
                                        <p className="w-75 fw-bold">{tempOrder.user?.name}</p>
                                    </li>
                                    <li className="d-flex">
                                        <p className="w-25">連絡信箱</p>
                                        <p className="w-75 fw-bold">{tempOrder.user?.email}</p>
                                    </li>
                                    <li className="d-flex">
                                        <p className="w-25">聯絡電話</p>
                                        <p className="w-75 fw-bold">{tempOrder.user?.tel}</p>
                                    </li>
                                    <li className="d-flex">
                                        <p className="w-25">運送地址</p>
                                        <p className="w-75 fw-bold">{tempOrder.user?.address}</p>
                                    </li>
                                    <li className="d-flex">
                                        <p className="w-25">留言</p>
                                        <p className="w-75 fw-bold">{tempOrder.message}</p>
                                    </li>
                                </ul>
                            </div>

                        </div>
                        <div className="col-lg-6">

                            <h5 className="fw-bold">購買項目</h5>
                            <div className='card-body px-1'>
                                {Object.values(tempOrder?.products || {}).map((item) => {
                                    return (
                                        <li key={item.id}>
                                            <div className="d-flex justify-content-between border-bottom py-3">
                                                <div className="d-flex">
                                                    <img src={item.product.imageUrl} alt="..." style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                    <p className="mt-2 px-3">{item.product.title} x {item.qty}</p>
                                                </div>
                                                <p className="mt-2">NT$ {item.final_total}</p>
                                            </div>
                                        </li>
                                    )
                                })}
                            </div>
                            <li className="d-flex justify-content-between px-1 mt-2">
                                <p className="h5 fw-bold">總計</p>
                                <p className="h5 fw-bold">NT$ {tempOrder.total}</p>
                            </li>

                            <div className="mt-4">
                                <h5 className="fw-bold">付款狀態</h5>
                                <ul className="mt-2 px-0 py-3 bg-light">
                                    <li className="d-flex mt-2">
                                        <p>付款方式 /</p>
                                        <p className="mx-1">信用卡</p>
                                    </li>
                                    <li className="d-flex align-items-center mt-2">
                                        <p>付款狀態 / </p>
                                        <p className={`${tempOrder.is_paid ? 'bg-success' : 'bg-danger'} rounded fw-bold text-white p-1 mx-1`}>{tempOrder.is_paid ? '已付款' : '未付款'}</p>
                                    </li>
                                </ul>
                            </div>
                            {isAdmin && (
                                    <div className="mt-4">
                                    <h5 className="fw-bold">修改訂單狀態</h5>
                                    <div className="bg-light py-3">
                                        <div>
                                            <p>付款狀態 <select name="payment_status" id="" value={tempData.is_paid}
                                            onChange={handleChange}>
                                                <option value={false}>未付款</option>
                                                <option value={true}>已付款</option>
                                            </select></p>

                                        </div>
                                        <div>
                                            <p>處理狀態 <select  id="" value={tempData.status} style={{ width: '80px' }}
                                            onChange={handleChange}>
                                                 {dummyData.map((item, i) => {
                                        return  (
                                            <option key={i} value={i}>{item}</option>
                                        )
                                    })}
                                            </select>

                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    {!isAdmin && (
                        <button type="button" className={`btn btn-outline-dark rounded-0 px-5 ${tempOrder.is_paid ? 'disabled' : ''}`}
                            onClick={() => payOrder(tempOrder.id)}
                        >付款</button>
                    )}
                    <button type="button" className="btn btn-outline-danger" onClick={() => closeOrderModal()}>Close</button>
                    {!!isAdmin && (
                        <button type="button" className="btn btn-outline-primary"
                        onClick={() => editOrder()}
                        >儲存</button>
                    )}
                </div>
            </div>
        </div>
    </div>)
};

export default OrderModal;