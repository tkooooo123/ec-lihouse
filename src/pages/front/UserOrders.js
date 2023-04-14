import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";

function UserOrders() {
    const [orderData, setOrderData] = useState([]);
    const [pagination, setPagination] = useState({})
    const getOrders = async (page = 1) => {
        try {
            const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/orders?page=${page}`);
            console.log(res)
            setOrderData(res.data.orders)
            setPagination(res.data.pagination)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getOrders()
    }, [])
    return (
        <div className="container">
            <div className="row mt-5">
                <div className="col-lg-3 mt-2">
                    <h4 className="d-none d-lg-block fw-bold bg-light p-lg-3 border-start border-dark border-5">會員中心</h4>
                    <ul className="mt-3">
                        <li className="fw-bold">
                            訂單紀錄
                        </li>
                    </ul>
                </div>
                <div className="col-lg-9 mt-2">

                    <table className="table">
                        <thead>
                            <tr className="text-center">
                                <th className="bg-light" scope="col">訂單編號</th>
                                <th className="bg-light" scope="col">總金額</th>
                                <th className="bg-light" scope="col">訂購日期</th>
                                <th className="bg-light" scope="col">付款</th>
                                <th className="bg-light" scope="col">明細</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderData.map((order => {
                                return (
                                    <tr className="text-center" key={order.id}>
                                        <td className="align-middle" style={{ wordBreak: 'break-all' }}>
                                            {order.id}
                                        </td>
                                        <td className="align-middle">
                                            NT$ {order.total}
                                        </td>
                                        <td className="align-middle" >{new Date(order.create_at * 1000).toLocaleDateString()}</td>
                                        <td className="align-middle">
                                            <p className={`${order.is_paid ? 'bg-success' : 'bg-danger'} rounded fw-bold text-white py-1 mt-3`}>{order.is_paid ? '已付款' : '未付款'}</p></td>
                                        <td className="align-middle">
                                            <button className="btn"><i className="fs-5 bi bi-file-earmark-plus"></i></button>
                                        </td>
                                    </tr>
                                )

                            }))}

                        </tbody>
                    </table>
                    <div className="d-flex justify-content-center">
                    <Pagination pagination={pagination} changePage={getOrders}/>

                    </div>
                    


                </div>
            </div>
        </div>
    )
}
export default UserOrders;