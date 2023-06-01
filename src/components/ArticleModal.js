import axios from "axios";
import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { MessageContext, handleErrorMessage, handleSuccessMessage } from "../store/messageStore";
import Loading from "./Loading";
import { useForm, useWatch } from "react-hook-form";
import { CheckboxRadio, Input, Textarea } from "./FormElements";

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
    const [state, setState] = useState(false)
    const [, dispatch] = useContext(MessageContext);
    const fileRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsdisabled] = useState(true);
    const [isErrored, setIsErrored] = useState(false);
    const {
        register,
        unregister,
        handleSubmit,
        control,
        setValue,
        getValues,
        clearErrors,
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
        const tagIndex = Object.keys(watchForm).indexOf('addTag')
        const arr = Object.values(watchForm).map((item) => {
            return item?.typeof === String ? item.trim() : item
        })
        arr.splice(tagIndex, 1)
        if (arr.length > 0 && !arr.includes('')) {
            setIsdisabled(false)
        }
        if (errorArr.length > 0) {
            setIsErrored(true)
        } else {
            setIsErrored(false)
        }
    }, [watchForm, errorArr])

    const uploadImg = async (e) => {
        try {
            setIsLoading(true);
            const file = fileRef.current.files[0];
            const formData = new FormData();
            formData.append('image', file);
            const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`,
                formData)
            setValue('image', res.data.imageUrl);
            setTempData({
                ...tempData,
                image: res.data.imageUrl
            });

            if(errors['image']) {
                clearErrors('image')    
            }
           setTimeout(() => {
            setIsLoading(false);
           }, 500)

        } catch (error) {
            setIsLoading(false);
            handleErrorMessage(dispatch, error);
        }
    }

    //寫入新增標籤欄位的值
    useEffect(() => {
        const tagValue = getValues('addTag')
        setTempTag(tagValue)
    }, [getValues, watchForm]);


    //新增Tag標籤
    const addClick = () => {
        const arr = tempData.tag || []
        arr.push(tempTag.trim());
        setTempData({
            ...tempData,
            tag: arr,
        });
        setValue('addTag', '')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getTagValue = useCallback(() => {
        //載入標籤內容
        for (let i = 0; i < tempData.tag?.length; i++) {
            setValue(`tag${i + 1}`, tempData.tag[i])
        }
    })

    const removeTag = (i) => {
        //將資料從陣列中移除
        tempData.tag?.splice(i, 1)
        //取消註冊表單欄位
        unregister(`tag${i + 1}`)

    }

    const onSubmit = async (data) => {
        try {
            const { title, author, description, content, image, is_public } = data
            const tagArr = tempData.tag
            if (tagArr) {
                for (let i = 0; i < tagArr.length; i++) {
                    //更新標籤內容並去除頭尾空格
                    const value = getValues(`tag${i + 1}`).trim()
                    tagArr.splice(i, 1, value)

                }
            }
            const form = {
                data: {
                    ...tempData,
                    title: title.trim(),
                    author: author.trim(),
                    description: description.trim(),
                    content,
                    image,
                    isPublic: is_public,
                    tag: tagArr,
                    create_at: tempData.create_at
                }
            }
            let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/article`;
            let method = 'post';
            if (type === 'edit') {
                api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/article/${tempArticle.id}`
                method = 'put';
            }

            const res = await axios[method](api, form);
            handleRemove();
            closeArticleModal();
            getArticles();
            handleSuccessMessage(dispatch, res);

        } catch (error) {
            handleErrorMessage(dispatch, error);
         
        }
    }

    const handleRemove = () => {
        //關閉Modal時清除顯示資料
        fileRef.current.value = ''
    }

    useEffect(() => {
        setState(true)
        if (type === 'create') {
            setTempData({
                title: '',
                author: '',
                image: '',
                tag: [],
                description: '',
                isPublic: false,
                content: '',
                create_at: Date.now()
            })
            const data = getValues()
            for (let key in data) {
                setValue(key, '')
                if( key ==='is_public') {
                    setValue(key, false)
                }
            }
        }
        if (type === 'edit') {
            setValue('title', tempArticle.title);
            setValue('author', tempArticle.author);
            setValue('tag', tempArticle.tag);
            setValue('description', tempArticle.description);
            setValue('content', tempArticle.content);
            setValue('is_public', tempArticle.isPublic);
            setValue('image', tempArticle.image);
            setTempData({ ...tempArticle });

            getTagValue();
        }
        clearErrors();

    }, [type, tempArticle, state, clearErrors, getValues, setValue, getTagValue]);

    useEffect(() => {
        getTagValue();
    }, [getTagValue, tempData]);




    return (
        <div className="modal fade" id="articleModal" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <Loading isLoading={isLoading} />
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">
                            {type === 'create' ? '建立' : '編輯'}新文章</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        onClick={() => {
                            closeArticleModal();
                            handleRemove();
                            setState(false);
                        }}></button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className='row'>
                                <div className='col-lg-4'>
                                    <div className='form-group mb-2'>
                                        <div className="text-center bg-light mb-2" style={{ height: '250px', width: '250px' }}>
                                            {tempData.image && (
                                                <img src={tempData.image} alt="文章圖片" style={{ height: '250px', width: '250px', objectFit: 'contain' }} />
                                            )}
                                        </div>
                                        <Input
                                            id='image'
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
                                    <div className='form-group mb-2' >
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
                                    <div className='row'>
                                        <div className='form-group mb-2 col-md-6'>
                                            <Input
                                                id='author'
                                                type='text'
                                                errors={errors}
                                                labelText='作者'
                                                register={register}
                                                placeholder='請輸入作者'
                                                rules={{
                                                    required: '作者為必填'
                                                }}
                                            >
                                            </Input>
                                        </div>
                                        <div className='form-group mb-2 col-md-6 d-flex align-items-end'>
                                            <div className="w-75">
                                                <Input
                                                    id='addTag'
                                                    type='text'
                                                    errors={''}
                                                    labelText='標籤'
                                                    register={register}
                                                    placeholder='請輸入標籤'
                                                >
                                                </Input>
                                            </div>
                                            <button type="button" className={`btn btn-outline-dark w-25  ${tempTag.trim().length < 1 ? 'disabled' : ''}`}
                                                onClick={addClick}
                                            >新增</button>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        {tempData?.tag?.map((item, i) => {
                                            return (
                                                <div className="form-group w-50 position-relative" key={i}>
                                                    <Input
                                                        id={`tag${i + 1}`}
                                                        type='text'
                                                        errors={errors}
                                                        labelText={`標籤#${i + 1}`}
                                                        register={register}
                                                        placeholder='請輸入標籤'
                                                        rules={{
                                                            required: '標籤為必填',
                                                        }}
                                                    >
                                                    </Input>
                                                    <button type="button" className="btn position-absolute border-0 p-0"
                                                        style={{ top: '0.9rem', right: '0rem' }}
                                                        onClick={() => removeTag(i)}
                                                    ><i className="bi bi-x-circle fs-5 text-muted"></i></button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <hr />
                                    <div className='form-group mb-2'>
                                        <Textarea
                                            id='description'
                                            type='text'
                                            errors={errors}
                                            labelText='文章描述'
                                            register={register}
                                            placeholder='請輸入文章描述'
                                            rules={{
                                                required: '文章描述為必填',
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
                                            placeholder='請輸入文章內容'
                                            rows="5"
                                            rules={{
                                                required: '文章內容為必填',
                                            }}
                                        >
                                        </Textarea>
                                    </div>
                                    <div className='form-group mb-2'>
                                        <div className='form-check'>
                                            <CheckboxRadio
                                                id="is_public"
                                                type="checkbox"
                                                name="is_public"
                                                register={register}
                                                errors={errors}
                                                labelText="是否公開"
                                            >
                                            </CheckboxRadio>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                            onClick={() => {
                                closeArticleModal();
                                handleRemove();
                                setState(false);
                            }}
                            >Close</button>
                            <button type="submit" className={`form-submit-btn btn btn-primary ${(isDisabled || isErrored) ? 'disable' : ''}`} >儲存</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default ArticleModal;