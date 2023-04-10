import axios from "axios";
import { useEffect, useState } from "react"

function CouponModal({ closeCouponModal, getCoupons, type, tempCoupon }) {
    const [tempData, setTempData] = useState({
        title: "",
        is_enabled: 1,
        percent: 80,
        due_date: 1555459200,
        code: "testcode",

    });

    useEffect(() => {
        if (type === 'create') {
            setTempData({
                title: "",
                is_enabled: 1,
                percent: 80,
                due_date: 1555459200,
                code: "testcode",
            })

        } else if (type === 'edit') {
            setTempData(tempCoupon)

        }
        console.log(type, tempCoupon)

    }, [type, tempCoupon])

    const handleChange = (e) => {
        console.log(e)
        const { name, value } = e.target

        if (['price', 'origin_price'].includes(name)) {
            setTempData({
                ...tempData,
                [name]: Number(value),
            })

        } else if (name === 'is_enabled') {
            setTempData({
                ...tempData,
                [name]: +e.target.checked,
            })

        } else {
            setTempData({
                ...tempData,
                [name]: value,
            })
        }
    }
    const submit = async () => {
        try {
            let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon`
            let method = 'post'
            if(type === 'edit') {
                api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${tempCoupon.id}`
                method = 'put' 
            }
      
            const res = await axios[method](api, {
                data: tempData
            })
            console.log(res)
            closeCouponModal()
            getCoupons()


        } catch (error) {
            console.log(error)
        }
    }


    return (<div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                        {type === 'create' ? '建立新優惠券' : `編輯 ${tempCoupon.title}`}
                        </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={closeCouponModal}></button>
                </div>
                <div className='modal-body'>
            <div className='mb-2'>
              <label className='w-100' htmlFor='title'>
                標題
                <input
                  type='text'
                  id='title'
                  placeholder='請輸入標題'
                  name='title'
                  className='form-control mt-1'
                  value={tempData.title}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className='row'>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='percent'>
                  折扣（%）
                  <input
                    type='text'
                    name='percent'
                    id='percent'
                    placeholder='請輸入折扣（%）'
                    className='form-control mt-1'
                    value={tempData.percent}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='due_date'>
                  到期日
                  <input
                    type='date'
                    id='due_date'
                    name='due_date'
                    placeholder='請輸入到期日'
                    className='form-control mt-1'
                  />
                </label>
              </div>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='code'>
                  優惠碼
                  <input
                    type='text'
                    id='code'
                    name='code'
                    placeholder='請輸入優惠碼'
                    className='form-control mt-1'
                    value={tempData.code}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>
            <label className='form-check-label' htmlFor='is_enabled'>
              <input
                className='form-check-input me-2'
                type='checkbox'
                id='is_enabled'
                name='is_enabled'
                value={tempData.is_enabled}
                onChange={handleChange}
              />
              是否啟用
            </label>
          </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeCouponModal}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={submit}>儲存</button>
                </div>
            </div>
        </div>
    </div>)
}

export default CouponModal