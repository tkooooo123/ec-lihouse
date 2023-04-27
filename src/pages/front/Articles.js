import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import { MessageContext, handleErrorMessage } from "../../store/messageStore";

function Articles() {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [, dispatch] = useContext(MessageContext);
    const getArticles = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/articles`);
            setArticles(res.data.articles);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            handleErrorMessage(dispatch,error);
        }
    }
    useEffect(() => {
        getArticles();
        console.log('123', articles)
    }, [])

    return (
        <div className="container">
            <Loading isLoading={isLoading}></Loading>
            <h4 className="fw-bold bg-light p-3 border-start border-primary border-5 mt-5">最新消息</h4>
            <div className="row p-4">
                {articles.map((article) => {
                    return (
                        <div className="col-md-6 col-xl-4">
                            <Link to={`/article/${article.id}`} style={{textDecoration: 'none'}}>
                                <div className="card mb-3" key={article.id} >
                                    <img src={article.image} className="card-img-top bg-light" alt="..."
                                        style={{ height: '15rem', objectFit: 'contain' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold text-primary">{article.title}</h5>
                                        <div>
                                            <span className="badge text-dark m-1" style={{ backgroundColor: '#cac7c7' }}><i className="bi bi-pencil"></i> {article.author}</span>
                                            <span className="badge text-dark m-1" style={{ backgroundColor: '#cac7c7' }}><i className="bi bi-calendar3"></i> {new Date(article.create_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="card-text fw-bold text-muted">{article.description}</p>
                                        {article.tag.map((tag) => {
                                            return (
                                                <span className="bg-secondary badge text-dark p-1 m-1 "><i className="bi bi-tag"></i>{tag}</span>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default Articles;