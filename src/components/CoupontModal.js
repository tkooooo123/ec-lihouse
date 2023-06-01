import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { MessageContext, handleErrorMessage, handleSuccessMessage, handleUpdateMessage } from "../store/messageStore";
import { useForm, useWatch } from "react-hook-form";
import { Input, CheckboxRadio } from "./FormElements";


function CouponModal({ closeCouponModal, getCoupons, type, tempCoupon }) {

    const [, dispatch] = useContext(MessageContext);
    const [state, setState] = useState(false);
    const [isDisabled, setIsdisabled] = useState(true);
    const [isErrored, setIsErrored] = useState(false);
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        clearErrors,
        control,
        formState: { errors }
    } = useForm({
        mode: 'onTouched',
    });
    const errorArr = Object.entries(errors)
    const watchForm = useWatch({
        control,
        errors
    })
    useEffect(() => {
        setIsdisabled(true)
        const arr = Object.values(watchForm).map((item) => {
            return item?.typeof === String ? item.trim() : item
        })
        if (arr.length > 0 && !arr.includes('')) {
            setIsdisabled(false)
        }
        if (errorArr.length > 0) {
            setIsErrored(true)
        } else {
            setIsErrored(false)
        }
    }, [watchForm, errorArr])
   
    useEffect(() => {
        setState(true);
        if( type === 'create') {
            const data = getValues()
            for (let key in data) {
                setValue(key, '')
                if( key === 'is_enabled') {
                   setValue(key, false)
                }
            }
        } else if(type === 'edit') {
            setValue('title', tempCoupon.title)
            setValue('code', tempCoupon.code)
            setValue('percent', tempCoupon.percent)
            setValue('due_date', `${new Date(tempCoupon.due_date).getFullYear().toString()}-${(
                new Date(tempCoupon.due_date).getMonth() + 1
            )
                .toString()
                .padStart(2, 0)}-${new Date(tempCoupon.due_date)
                    .getDate()
                    .toString()
                    .padStart(2, 0)}`)
            setValue('is_enabled', tempCoupon.is_enabled)
        }
        clearErrors()
    }, [type, tempCoupon, state, clearErrors, getValues, setValue])

 

    const onSubmit = async (data) => {
        try {
            const { title, percent, due_date, code, is_enabled } = data
            const form = {
                data: {
                    title: title.trim(),
                    percent: Number(percent),
                    due_date: new Date(due_date).getTime(),
                    code,
                    is_enabled: Number(is_enabled === true)
                }
            }
            let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon`
            let method = 'post'
            if (type === 'edit') {
                api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${tempCoupon.id}`
                method = 'put'
            }
            const res = await axios[method](api, form
            )
            if (res.data.success === false) {
                handleUpdateMessage(dispatch, res);
            } else {
                handleSuccessMessage(dispatch, res);
                closeCouponModal();
                getCoupons();
            }
        } catch (error) {
            handleErrorMessage(dispatch, error);
        }

    }

    return (<div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                        {type === 'create' ? '建立新優惠券' : `編輯 ${tempCoupon.title}`}
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => {
                            closeCouponModal()
                            setState(false)
                        }}></button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='modal-body'>
                        <div className="mb-2">
                            <Input
                                id='title'
                                type='text'
                                errors={errors}
                                labelText='標題'
                                register={register}
                                placeholder='請輸入標題'
                                rules={{
                                    required: '標題為必填',
                                }}
                            >
                            </Input>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <div className="mb-2">
                                    <Input
                                        id='percent'
                                        type='number'
                                        errors={errors}
                                        labelText='折扣（%）'
                                        register={register}
                                        placeholder="請輸入折扣"
                                        rules={{
                                            required: '折扣為必填',
                                        }}
                                    >
                                    </Input>
                                </div>
                            </div>
                            <div className="col-md-6 mb-2">
                                <div className="mb-2">
                                    <Input
                                        id='due_date'
                                        type='date'
                                        errors={errors}
                                        labelText='到期日'
                                        register={register}
                                        rules={{
                                            required: '到期日為必填',
                                        }}
                                    >
                                    </Input>
                                </div>
                            </div>
                            <div className="col-md-6 mb-2">
                                <div className="mb-2">
                                    <Input
                                        id='code'
                                        type='text'
                                        errors={errors}
                                        labelText='優惠碼'
                                        register={register}
                                        placeholder="請輸入優惠碼"
                                        rules={{
                                            required: '優惠碼為必填',
                                        }}
                                    >
                                    </Input>
                                </div>
                            </div>
                            <div>
                                <CheckboxRadio
                                    id="is_enabled"
                                    type="checkbox"
                                    name="is_enabled"
                                    register={register}
                                    errors={errors}
                                    labelText="是否啟用"
                                >
                                </CheckboxRadio>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            closeCouponModal()
                            setState(false)
                        }}>Close</button>
                        <button type="submit" className={`form-submit-btn btn btn-primary ${(isDisabled || isErrored) ? 'disable' : ''}`}>儲存</button>
                    </div>
                </form>
            </div>
        </div>
    </div>)
}

export default CouponModal