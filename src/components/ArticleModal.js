import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { MessageContext, handleErrorMessage, handleSuccessMessage } from "../store/messageStore";

function ArticleModal({ getArticles, closeArticleModal, tempArticle, type }) {
    const [tempData, setTempData] = useState({
        title: '',
        author: '',
        image: '',
        tag: [],
        description: '',
        isPublic: false,
        content: '',
        create_at: ''
    });
    const [tempTag, setTempTag] = useState('');
    const [, dispatch] = useContext(MessageContext);

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'tag') {
            setTempTag(value);
        } else if (name === 'isPublic') {
            setTempData({
                ...tempData,
                [name]: +e.target.checked === 1,
            })

        } else {
            setTempData({
                ...tempData,
                [name]: value,
            });

        }

    }
    const addClick = () => {
        tempData.tag.push(tempTag);
    }
    const submit = async () => {
        try {
        
            let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/article`;
            let method = 'post';
            if (type === 'edit') {
                api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/article/${tempArticle.id}`
                method = 'put';
            } else {
                tempData.create_at = Date.now();
            }

            const res = await axios[method](api, {
                data: tempData
            });
            closeArticleModal();
            getArticles();
            handleSuccessMessage(dispatch, res)
            
        } catch (error) {
            console.log(error);
            handleErrorMessage(dispatch, error)
        }
    }

    useEffect(() => {
        if(type === 'create') {
            setTempData({
                title: '',
                author: '',
                image: '',
                tag: [],
                description: '',
                isPublic: false,
                content: '',
                create_at: ''
            });
        } else if( type === 'edit') {
            setTempData(tempArticle)  
        }
    }, [type, tempArticle]);

    return (
        <div className="modal fade" id="articleModal" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">
                            {type === 'create' ? '建立' : '編輯'}新文章</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className='row'>
                            <div className='col-lg-4'>
                                <div className='form-group mb-2'>
                                    <div className="text-center bg-light mb-2" style={{ height: '250px' }}>
                                        {tempData.image && (
                                            <img src={tempData.image} alt="" style={{ height: '250px', width: '250px', objectFit: 'contain' }} />
                                        )}
                                        
                                    </div>
                                    <label className='w-100' htmlFor='image'>
                                        輸入圖片網址
                                        <input
                                            type='text'
                                            name='image'
                                            id='image'
                                            placeholder='請輸入圖片連結'
                                            className='form-control'
                                            value={tempData.image}
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
                                        <label className='w-100' htmlFor='author'>
                                            作者
                                            <input
                                                type='text'
                                                id='author'
                                                name='author'
                                                placeholder='請輸入作者'
                                                className='form-control'
                                                onChange={handleChange}
                                                value={tempData.author}
                                            />
                                        </label>
                                    </div>
                                    <div className='form-group mb-2 col-md-6'>
                                        <label className='w-100' htmlFor='unit'>
                                            標籤
                                            <input
                                                type='text'
                                                id='tag'
                                                name='tag'
                                                placeholder='請輸入標籤'
                                                className='form-control'
                                                onChange={handleChange}
                                                value={tempTag}
                                            />
                                        </label>
                                        <button type="button" className="btn"
                                            onClick={addClick}
                                        >新增標籤</button>
                                    </div>
                                </div>

                                <hr />
                                <div className='form-group mb-2'>
                                    <label className='w-100' htmlFor='description'>
                                        文章描述
                                        <textarea
                                            type='text'
                                            id='description'
                                            name='description'
                                            placeholder='請輸入文章描述'
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
                                            placeholder='請輸入文章內容'
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
                                            htmlFor='isPublic'
                                        >
                                            是否公開
                                            <input
                                                type='checkbox'
                                                id='isPublic'
                                                name='isPublic'
                                                placeholder='請輸入產品說明內容'
                                                className='form-check-input'
                                                onChange={handleChange}
                                                checked={!!tempData.isPublic}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={submit}>儲存</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ArticleModal;