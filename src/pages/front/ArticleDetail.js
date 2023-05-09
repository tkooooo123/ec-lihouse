import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Loading from "../../components/Loading";
import { MessageContext, handleErrorMessage } from "../../store/messageStore";

function ArticleDetail() {
    const [article, setArticle] = useState({});
    const { id } = useParams();
    const [prevArticle, setPrevArticle] = useState({});
    const [nextArticle, setNextArticle] = useState({});
    const path = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [, dispatch] = useContext(MessageContext);

    const getArticle = async (id) => {
        try {
            setIsLoading(true);
            const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/article/${id}`);
            setArticle(res.data.article);
            await getArticles();
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            handleErrorMessage(dispatch, error);
        }
    }
    //取得前後篇文章
    const getArticles = async () => {
        try {
            const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/articles`);
            const { articles } = res.data
            articles.forEach((item, i) => {
                if (item.id === id) {
                    setPrevArticle(articles[i - 1]);
                    setNextArticle(articles[i + 1]);
                }
            })
        } catch (error) {
            console.log(error);
            handleErrorMessage(dispatch, error);
        }
    }

    useEffect(() => {
        getArticle(id);
    }, [path])

    return (
        <div className="container">
            <Loading isLoading={isLoading} />
            <div className="row justify-content-center">
                <div className="col-md-9 mt-5">
                    <h1 className="article-title">《{article.title}》</h1>
                    <div>
                        <span className="badge text-dark m-1" style={{ backgroundColor: '#cac7c7' }}><i className="bi bi-pencil"></i> {article.author}</span>
                        <span className="badge text-dark m-1" style={{ backgroundColor: '#cac7c7' }}><i className="bi bi-calendar3"></i> {new Date(article.create_at).toLocaleDateString()}</span>
                    </div>
                    {article.tag?.map((tag, i) => {
                        return (
                            <span className="bg-secondary badge text-dark p-1 m-1 " key={i}><i className="bi bi-tag"></i>{tag}</span>
                        )
                    })}
                    <img src={article.image} className="card-img-top mt-3 bg-light" alt="..."
                        style={{ height: '25rem', objectFit: 'contain' }}
                    />
                    <p className="card-text fw-bold text-muted mt-3">{article.description}</p>
                    <p className="card-text fw-bold mt-3">{article.content}</p>
                    <div className="row my-5">
                        {!!prevArticle && (
                            <Link className="col-6" to={`/article/${prevArticle.id}`} style={{ textDecoration: 'none' }}>
                                <div className="border-bottom border-primary border-4 ps-3">
                                    <i className="bi bi-arrow-left"></i> 前一篇 <br />
                                    <span className="fw-bold">{prevArticle.title}</span>
                                </div>
                            </Link>
                        )}
                        {!!nextArticle && (
                            <Link className="col-6" to={`/article/${nextArticle.id}`} style={{ textDecoration: 'none' }}>
                                <div className="bg-light border-bottom border-primary border-4 pe-3">
                                    後一篇 <i className="bi bi-arrow-right"></i> <br />
                                    <span className="fw-bold">{nextArticle.title}</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ArticleDetail;