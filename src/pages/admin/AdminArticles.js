import { useContext, useEffect, useRef, useState } from "react";
import Loading from "../../components/Loading";
import ArticleModal from "../../components/ArticleModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";
import axios from "axios";
import { MessageContext, handleErrorMessage, handleSuccessMessage } from "../../store/messageStore";


function AdminArticles() {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({});
    const [type, setType] = useState('create');
    const [tempArticle, setTempArticle] = useState({});
    const [, dispatch] = useContext(MessageContext);
    const articleModal = useRef(null);
    const deleteModal = useRef(null);


    const getArticles = async() => {
        try {
            setIsLoading(true);
            const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/articles`);
            setArticles(res.data.articles);
            setIsLoading(false);

        } catch (error) {
            handleErrorMessage(dispatch, error);
        }
    }

    const getArticle = async(id) => {
        try {
            const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/article/${id}`);
            setTempArticle(res.data.article);
        } catch (error) {
            handleErrorMessage(dispatch, error);   
        }
    }

    useEffect(() => {
        articleModal.current = new Modal('#articleModal', {
          backdrop: 'static'
        });
        deleteModal.current = new Modal('#deleteModal', {
            backdrop: 'static'
        });
        getArticles();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteArticle = async(id) => {
        try {
            const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/article/${id}`);
            if (res.data.success) {
                getArticles();
                deleteModal.current.hide();
            }
            handleSuccessMessage(dispatch, res);
        } catch (error) {
            handleErrorMessage(dispatch, error);
        }
    }

    const openArticleModal = async(type, article) => {
        if (type === 'edit') {
            setIsLoading(true)
            await getArticle(article.id);
            setIsLoading(false)
        }
        setType(type);
        articleModal.current.show();
    }
    const closeArticleModal = () => {
        articleModal.current.hide();
    }

    const openDeleteModal = (article) => {
        setTempArticle(article);
        deleteModal.current.show();
    }
    const closeDeleteModal = () => {
        deleteModal.current.hide();
    }

    return (
        <div className='p-3'>
        <Loading isLoading={isLoading} />
        <ArticleModal closeArticleModal={closeArticleModal} getArticles={getArticles}
            tempArticle={tempArticle}
            type={type}
        />
        <DeleteModal close={closeDeleteModal} text={tempArticle.title}
            handleDelete={deleteArticle}
            id={tempArticle.id}
        />
        <h3>文章列表</h3>
        <hr />
        <div className='text-end'>
            <button type='button' className='btn btn-primary btn-sm'
                onClick={() => openArticleModal('create', {})}>
                建立新文章
            </button>
        </div>
        <table className='table'>
            <thead>
                <tr>
                    <th scope='col'>日期</th>
                    <th scope='col'>標題</th>
                    <th scope='col'>作者</th>
                    <th scope='col'>描述</th>
                    <th scope='col'>公開狀態</th>
                    <th scope='col'>編輯/刪除</th>
                </tr>
            </thead>
            <tbody>
                {articles.map((article) => {
                    return (
                        <tr key={article.id}>
                            <td>{new Date(article.create_at ).toLocaleDateString()}</td>
                            <td>
                                {article.title}
                            </td>
                            <td>{article.author}</td>
                            <td>{article.description}</td>
                            <td>{article.isPublic ? '啟用' : '未啟用'}</td>
                            <td>
                                <button type='button' className='btn btn-primary btn-sm'
                                    onClick={() => openArticleModal('edit', article)}
                                >
                                    編輯
                                </button>
                                <button
                                    type='button'
                                    className='btn btn-outline-danger btn-sm ms-2'
                                    onClick={() => openDeleteModal(article)}
                                >
                                    刪除
                                </button>
                            </td>
                        </tr>
                    )
                })}

            </tbody>
        </table>
        <div className="d-flex justify-content-center">
        <Pagination
            pagination={pagination}
            changePage={getArticles}
        /> 
        </div>
    </div>
    )

};
export default AdminArticles;