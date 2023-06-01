import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react"
import { handleSuccessMessage, handleErrorMessage, MessageContext } from "../store/messageStore";
import { useForm, useWatch } from "react-hook-form";
import { CheckboxRadio, Input, Textarea } from "./FormElements";
import Loading from "../../src/components/Loading"

function ProductModal({ closeProductModal, getProducts, type, tempProduct }) {
    const [tempData, setTempData] = useState({
        title: "",
        category: "",
        origin_price: 100,
        price: 300,
        unit: "",
        description: "",
        content: "",
        is_enabled: 1,
        imageUrl: "",
    });

    const [, dispatch] = useContext(MessageContext);
    const fileRef = useRef(null);
    const imagesRef = useRef(null);
    const [state, setState] = useState(true);
    const [isDisabled, setIsdisabled] = useState(true);
    const [isErrored, setIsErrored] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        clearErrors,
        control,
        formState: { errors }
    } = useForm({
        mode: 'all',
    });
    const errorArr = Object.entries(errors)
    const watchForm = useWatch({
        control,
        errors
    })

    useEffect(() => {
        setIsdisabled(true)
        const arr = Object.values(watchForm).map((item) => {
            return item.typeof === String ? item.trim() : item
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

    const uploadImg = async () => {
        try {
            setIsLoading(true);
            const file = fileRef.current.files[0]
            const formData = new FormData();
            formData.append('image', file)
            const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`,
                formData);
            setTempData({
                ...tempData,
                imageUrl: res.data.imageUrl
            });
            setValue('imageUrl', res.data.imageUrl)
            if (errors['imageUrl']) {
                clearErrors('imageUrl')
            }
            setTimeout(() => {
                setIsLoading(false)
            },500)
        } catch (error) {
            handleErrorMessage(dispatch, error)
        }

    }
    const handleRemove = () => {
        fileRef.current.value = ''
    }
    const uploadImgs = async () => {
        try {
            setIsLoading(true);
            const imgs = tempData?.imagesUrl ? [...tempData.imagesUrl] : []
            const files = [...imagesRef.current.files]
            let  index = 0
            for (let i = 0; i < files.length; i++) {
                index += 1
                const formData = new FormData();
                formData.append('image', files[i])
                const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`,
                    formData);
                imgs.push(
                    res.data.imageUrl
                )
            }
            if (index === files.length) {
                setTempData({
                    ...tempData,
                    imagesUrl: [...imgs]
                })
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
            }
            imagesRef.current.value = ''
        } catch (error) {
            handleErrorMessage(dispatch, error)
        }
    }
    const imageRemove = (i) => {
        const arr = tempData.imagesUrl
        arr.splice(i, 1)
        setTempData({
            ...tempData,
            imagesUrl: [...arr]
        })

    }

    useEffect(() => {
        setState(true);
        if (type === 'create') {
            setTempData({
                title: "",
                category: "",
                origin_price: 100,
                price: 300,
                unit: "",
                description: "",
                content: "",
                is_enabled: 1,
                imageUrl: "",
            })
            const data = getValues()
            for (let key in data) {
                setValue(key, '')
                if (key === 'is_enabled') {
                    setValue(key, false)
                }
            }
        } else if (type === 'edit') {
            setValue('title', tempProduct.title);
            setValue('category', tempProduct.category);
            setValue('unit', tempProduct.unit);
            setValue('origin_price', tempProduct.origin_price);
            setValue('price', tempProduct.price);
            setValue('description', tempProduct.description);
            setValue('content', tempProduct.content);
            setValue('is_enabled', Boolean(tempProduct.is_enabled));
            setValue('imageUrl', tempProduct.imageUrl);
            setTempData({ ...tempProduct });
        }
        clearErrors();

    }, [type, tempProduct, state])

    const onSubmit = async (data) => {
        try {
            const { title, category, unit, price, origin_price, description, content, imageUrl, is_enabled } = data

            const form = {
                data: {
                    title,
                    category,
                    unit,
                    price: Number(price),
                    origin_price: Number(origin_price),
                    description,
                    content,
                    imageUrl,
                    imagesUrl: tempData.imagesUrl,
                    is_enabled,
                }
            }
            let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product`
            let method = 'post'
            if (type === 'edit') {
                api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${tempProduct.id}`
                method = 'put'
            }
            const res = await axios[method](api, form)
            handleRemove();
            handleSuccessMessage(dispatch, res);
            closeProductModal();
            getProducts();
        } catch (error) {
            handleErrorMessage(dispatch, error)
        }
    }


    return (<div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <Loading isLoading={isLoading} />
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                        {type === 'create' ? '建立新商品' : `編輯 ${tempProduct.title}`}
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => {
                        closeProductModal();
                        handleRemove();
                        setState(false);
                    }}></button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="modal-body">
                        <div className='modal-body'>
                            <div className='row'>
                                <div className='col-lg-4'>
                                    <div className='form-group mb-2'>
                                        <div className="text-center bg-light mb-2" style={{ height: '250px', width: '230px' }}>
                                            {tempData.imageUrl !== '' && (
                                                <img src={tempData.imageUrl} alt="商品圖片" style={{ height: '250px', width: '100%', objectFit: 'cover' }} />
                                            )}
                                        </div>
                                        <Input
                                            id='imageUrl'
                                            type='text'
                                            errors={errors}
                                            labelText='圖片連結'
                                            register={register}
                                            placeholder='請輸入圖連結'
                                            rules={{
                                                required: '圖片連結為必填',
                                            }}
                                        >
                                        </Input>
                                    </div>
                                    <div className='form-group mb-2'>
                                        <label className='w-100' htmlFor='customFile'>
                                            或 上傳圖片
                                            <input
                                                type='file'
                                                id='customFile'
                                                className='form-control'
                                                ref={fileRef}
                                                onChange={uploadImg}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className='col-lg-8'>
                                    <div className='form-group mb-2'>
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
                                    <div className='row'>
                                        <div className='form-group mb-2 col-md-6'>
                                            <Input
                                                id='category'
                                                type='text'
                                                errors={errors}
                                                labelText='分類'
                                                register={register}
                                                placeholder='請輸入分類'
                                                rules={{
                                                    required: '分類為必填'
                                                }}
                                            >
                                            </Input>
                                        </div>
                                        <div className='form-group mb-2 col-md-6'>
                                            <Input
                                                id='unit'
                                                type='text'
                                                errors={errors}
                                                labelText='單位'
                                                register={register}
                                                placeholder='請輸入單位'
                                                rules={{
                                                    required: '單位為必填'
                                                }}
                                            >
                                            </Input>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='form-group mb-2 col-md-6'>
                                            <Input
                                                id='origin_price'
                                                type='number'
                                                errors={errors}
                                                labelText='原價'
                                                register={register}
                                                placeholder='請輸入原價'
                                                rules={{
                                                    required: '原價為必填'
                                                }}
                                            >
                                            </Input>
                                        </div>
                                        <div className='form-group mb-2 col-md-6'>
                                            <Input
                                                id='price'
                                                type='number'
                                                errors={errors}
                                                labelText='售價'
                                                register={register}
                                                placeholder='請輸入售價'
                                                rules={{
                                                    required: '售價為必填'
                                                }}
                                            >
                                            </Input>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='form-group mb-2'>
                                        <Textarea
                                            id='description'
                                            type='text'
                                            errors={errors}
                                            labelText='產品描述'
                                            register={register}
                                            placeholder='請輸入產品描述'
                                            rules={{
                                                required: '產品描述為必填',
                                            }}
                                        >
                                        </Textarea>
                                    </div>
                                    <div className='form-group mb-2'>
                                        <Textarea
                                            id='content'
                                            type='text'
                                            errors={errors}
                                            labelText='說明內容'
                                            register={register}
                                            rows="6"
                                            placeholder='請輸入產品說明內容'
                                            rules={{
                                                required: '說明內容為必填',
                                            }}
                                        >
                                        </Textarea>
                                    </div>
                                    <div className='form-group mb-2'>
                                        <div className='form-check'>
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
                            </div>
                            <hr />
                            <div>
                                <label className='w-100' htmlFor='customFile'>
                                    <button type="button" className="btn btn-outline-primary d-flex align-items-center"
                                        onClick={() => imagesRef.current.click()} ><i className="bi bi-cloud-arrow-up fs-4 me-1"></i>上傳其他圖片</button>
                                    <input
                                        type='file'
                                        id='customFile'
                                        className='form-control d-none'
                                        ref={imagesRef}
                                        onChange={uploadImgs}
                                        multiple
                                    />
                                </label>
                                <div className="d-flex" style={{ flexFlow: 'row wrap' }}>
                                    {tempData?.imagesUrl?.map((item, i) => {
                                        return (
                                            <div className="d-flex align-items-center mt-3 mx-1" key={i}>
                                                <div className="position-relative m-auto">
                                                    <img style={{ height: '135px', width: '135px', objectFit: 'cover' }} src={item} alt="商品圖片" />
                                                    <button type="button" className="btn btn-dark fw-bold rounded-circle position-absolute d-flex align-items-center justify-content-center" style={{ top: '0', right: '0', height: '2rem', width: '2rem' }}
                                                        onClick={() => imageRemove(i)}
                                                    ><i className="bi bi-x fs-4"></i></button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-dark"
                            onClick={() => {
                                closeProductModal();
                                handleRemove();
                                setState(false);
                            }}>Close</button>
                        <button type="submit" className={`form-submit-btn btn btn-primary ${(isDisabled || isErrored) ? 'disable' : ''}`}>儲存</button>
                    </div>
                </form>
            </div>
        </div>
    </div>)
}

export default ProductModal




