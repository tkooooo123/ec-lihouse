import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react"
import { MessageContext } from "../store/messageStore";
import { handleSuccessMessage, handleErrorMessage } from "../store/messageStore";

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
    

    const uploadImg = async () => {
        try {
            const file = fileRef.current.files[0]
            const formData = new FormData();
            formData.append('image', file)
            const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`,
                formData);
            setTempData({
                ...tempData,
                imageUrl: res.data.imageUrl
            });
        } catch (error) {
            console.log(error)
        }

    }
    const handleRemove = () => {
        fileRef.current.value = ''
    }
    const uploadImgs = async () => {
        try {
            const imgs = []
            const files = [...imagesRef.current.files]
             files.forEach(async (file) => {
                const formData = new FormData();
                formData.append('image', file)
                const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`,
                    formData);
                imgs.push(
                    res.data.imageUrl
                )
                setTempData({
                    ...tempData,
                    imagesUrl: [...tempData.imagesUrl, ...imgs]
                })
              
            })
            imagesRef.current.value = ''

        } catch (error) {
            console.log(error)
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

        } else if (type === 'edit') {
            setTempData(tempProduct)
          
        }
        console.log(type, tempProduct)

    }, [type, tempProduct])

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
            let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product`
            let method = 'post'
            if (type === 'edit') {
                api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${tempProduct.id}`
                method = 'put'
            }
            const res = await axios[method](api, {
                data: tempData
            })
            console.log(res)
            handleRemove();
            handleSuccessMessage(dispatch, res);
            closeProductModal()
            getProducts()


        } catch (error) {
            console.log(error)
            handleErrorMessage(dispatch, error);
        }
    }


    return (<div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                        {type === 'create' ? '建立新商品' : `編輯 ${tempProduct.title}`}
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={closeProductModal}></button>
                </div>
                <div className="modal-body">
                    <div className='modal-body'>
                        <div className='row'>
                            <div className='col-lg-4'>
                                <div className='form-group mb-2'>
                                    <div className="text-center bg-light mb-2" style={{ height: '250px', width: '250px' }}>
                                        <img src={tempData.imageUrl} alt="商品圖片" style={{ height: '250px', width: '250px', objectFit: 'cover' }} />
                                    </div>

                                    <label className='w-100' htmlFor='image'>
                                        輸入圖片網址
                                        <input
                                            type='text'
                                            name='imageUrl'
                                            id='image'
                                            placeholder='請輸入圖片連結'
                                            className='form-control'
                                            value={tempData.imageUrl}
                                            onChange={handleChange}
                                        />
                                    </label>
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
                                <img src='' alt='' className='img-fluid' />
                            </div>
                            <div className='col-lg-8'>
                                <div className='form-group mb-2'>
                                    <label className='w-100' htmlFor='title'>
                                        標題
                                        <input
                                            type='text'
                                            id='title'
                                            name='title'
                                            placeholder='請輸入標題'
                                            className='form-control'
                                            onChange={handleChange}
                                            value={tempData.title}
                                        />
                                    </label>
                                </div>
                                <div className='row'>
                                    <div className='form-group mb-2 col-md-6'>
                                        <label className='w-100' htmlFor='category'>
                                            分類
                                            <input
                                                type='text'
                                                id='category'
                                                name='category'
                                                placeholder='請輸入分類'
                                                className='form-control'
                                                onChange={handleChange}
                                                value={tempData.category}
                                            />
                                        </label>
                                    </div>
                                    <div className='form-group mb-2 col-md-6'>
                                        <label className='w-100' htmlFor='unit'>
                                            單位
                                            <input
                                                type='unit'
                                                id='unit'
                                                name='unit'
                                                placeholder='請輸入單位'
                                                className='form-control'
                                                onChange={handleChange}
                                                value={tempData.unit}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='form-group mb-2 col-md-6'>
                                        <label className='w-100' htmlFor='origin_price'>
                                            原價
                                            <input
                                                type='number'
                                                id='origin_price'
                                                name='origin_price'
                                                placeholder='請輸入原價'
                                                className='form-control'
                                                onChange={handleChange}
                                                value={tempData.origin_price}
                                            />
                                        </label>
                                    </div>
                                    <div className='form-group mb-2 col-md-6'>
                                        <label className='w-100' htmlFor='price'>
                                            售價
                                            <input
                                                type='number'
                                                id='price'
                                                name='price'
                                                placeholder='請輸入售價'
                                                className='form-control'
                                                onChange={handleChange}
                                                value={tempData.price}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <hr />
                                <div className='form-group mb-2'>
                                    <label className='w-100' htmlFor='description'>
                                        產品描述
                                        <textarea
                                            type='text'
                                            id='description'
                                            name='description'
                                            placeholder='請輸入產品描述'
                                            className='form-control'
                                            onChange={handleChange}
                                            value={tempData.description}
                                        />
                                    </label>
                                </div>
                                <div className='form-group mb-2'>
                                    <label className='w-100' htmlFor='content'>
                                        說明內容
                                        <textarea
                                            type='text'
                                            id='content'
                                            name='content'
                                            placeholder='請輸入產品說明內容'
                                            className='form-control'
                                            onChange={handleChange}
                                            value={tempData.content}
                                        />
                                    </label>
                                </div>
                                <div className='form-group mb-2'>
                                    <div className='form-check'>
                                        <label
                                            className='w-100 form-check-label'
                                            htmlFor='is_enabled'
                                        >
                                            是否啟用
                                            <input
                                                type='checkbox'
                                                id='is_enabled'
                                                name='is_enabled'
                                                placeholder='請輸入產品說明內容'
                                                className='form-check-input'
                                                onChange={handleChange}
                                                checked={!!tempData.is_enabled}
                                            />
                                        </label>
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
                                {tempData.imagesUrl?.map((item, i) => {
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
                    <button type="button" className="btn btn-outline-dark" onClick={closeProductModal}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={submit}>儲存</button>
                </div>
            </div>
        </div>
    </div>)
}

export default ProductModal




