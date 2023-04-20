import { useState } from "react";
import OrderModal from "../../components/OrderModal";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import axios from "axios";
import { MessageContext, handleErrorMessage } from "../../store/messageStore";
import { Modal } from "bootstrap";
import { useContext, useRef, useEffect } from "react";


function AdminOrders() {
    const [orderData, setOrderData] = useState([]);
    const [pagination, setPagination] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [tempOrder, setTempOrder] = useState({})
    const [, dispatch] = useContext(MessageContext);
    const [isAdmin, setIsAdmin] = useState(true);

    const orderModal = useRef(null);

    const getOrders = async (page = 1) => {
        try {
            setIsLoading(true);
            const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/orders?page=${page}`);
            setOrderData(res.data.orders);
            setPagination(res.data.pagination);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            handleErrorMessage(dispatch, error);
        }
    }

    const openOrderModal = (order) => {
        setTempOrder(order);
        orderModal.current.show()
    }
    const closeOrderModal = () => {
        orderModal.current.hide()
    }

    useEffect(() => {
        orderModal.current = new Modal('#orderModal', {
            backdrop: 'static'
        });
        getOrders();
    }, []);



    return (
        <div className="container">
            <Loading isLoading={isLoading} />
            <div className='p-3'>
                <Loading isLoading={isLoading} />
                <OrderModal closeOrderModal={closeOrderModal} getOrders={getOrders}
                    tempOrder={tempOrder} isAdmin={isAdmin}
                />
                <h3>產品列表</h3>
                <hr />
                <table className='table'>
                    <thead>
                        <tr className="text-center">
                            <th scope='col'>訂單編號</th>
                            <th scope='col'>總金額</th>
                            <th scope='col'>訂購日期</th>
                            <th scope='col'>付款狀態</th>
                            <th scope='col'>明細</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderData.map((order) => {
                            return (
                                <tr className="text-center" key={order.id}>
                                    <td className="align-middle">{order.id}</td>
                                    <td className="align-middle">
                                        NT$ {order.total}
                                    </td>
                                    <td className="align-middle">{new Date(order.create_at * 1000).toLocaleDateString()}</td>
                                    <td className="align-middle">
                                        <p className={`${order.is_paid ? 'bg-success' : 'bg-danger'} rounded fw-bold text-white py-1 mt-3`}>{order.is_paid ? '已付款' : '未付款'}</p>
                                    </td>
                                    <td className="align-middle">
                                        <button className="btn"
                                            onClick={() => openOrderModal(order)}
                                        ><i className="fs-5 bi bi-file-earmark-plus"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="d-flex justify-content-center">
                    <Pagination pagination={pagination} changePage={getOrders} />
                </div>
            </div>
        </div>
    )
};


export default AdminOrders;