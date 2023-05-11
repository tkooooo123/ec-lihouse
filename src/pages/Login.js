import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Login() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        username: '',
        password: '',
    });
    const [loginState, setLoginState] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }
    const submit = async (e) => {
        try {
            const res = await axios.post('/v2/admin/signin', data);
            const { token, expired } = res.data;
            document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
            // 儲存 Token
            if (res.data.success) {
                navigate('/admin/products')
            }
        } catch (error) {
            setLoginState(error.response.data);
        }
    }

    return (<div className="container my-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="bg-light text-center">
                <i className="bi bi-person-circle" style={{fontSize:'150px'}}></i>
                </div>
                
                <h2 className="text-center text-primary fw-bold mt-3">後臺管理</h2>

                <div className={`alert alert-danger ${loginState.message ? 'd-block' : 'd-none'}`} role="alert">
                    錯誤訊息
                </div>
                <div className="mb-2">
                    <label htmlFor="email" className="form-label w-100">
                        Email
                        <input id="email" className="form-control" name="username" type="email" placeholder="請輸入Email" onChange={handleChange} />
                    </label>
                </div>
                <div className="mb-2">
                    <label htmlFor="password" className="form-label w-100">
                        密碼
                        <input type="password" className="form-control" name="password" id="password" placeholder="請輸入密碼" onChange={handleChange} />
                    </label>
                </div>
                <button type="button" className="btn btn-primary w-100 mt-3" onClick={submit}>登入</button>
            </div>
        </div>
    </div>)


}

export default Login