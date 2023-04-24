import { useEffect, useState } from "react";
import $ from "jquery";

function FrequencelyAskedQuestions() {
    const [isSelected, setIsSelected] = useState('購物常見問題')
    const [tempData, setTempData] = useState({})
    

    const data = [
        {
            id: 1,
            title: '購物常見問題',
            questions: [
                {
                    id: 1,
                    title: '購物流程說明'
                },
                {
                    id: 2,
                    title: '如何查詢目前訂單的處理情況?'
                },
                {
                    id: 3,
                    title: '如何修改、加訂或合併訂單'
                },
            ]
        },
        {
            id: 2,
            title: '配送取貨問題',
            questions: [
                {
                    id: 1,
                    title: '可選擇的配送方式有那些?'
                },
                {
                    id: 2,
                    title: '請問運費如何計算?'
                },
                {
                    id: 3,
                    title: '台灣外島地區可以寄送嗎?'
                }
            ]
        },
        {
            id: 3,
            title: '退換貨及退款',
            questions: [
                {
                    id: 1,
                    title: '如何辦理退換貨?'
                },
                {
                    id: 2,
                    title: '退款方式及退款時間'
                },
                {
                    id: 3,
                    title: '什麼情況無法辦理退貨?'
                },
            ]
        },
        {
            id: 4,
            title: '發票常見問題',
            questions: [
                {
                    id: 1,
                    title: '什麼是「電子發票」？商品收到了，發票怎麼沒一起附上？'
                },
                {
                    id: 2,
                    title: '發票可以指定日期或開立其它品名嗎?'
                },
                {
                    id: 3,
                    title: '購物發票，是否可開立為多張發票?'
                }
            ]
        }
    ]

    const handleClick = (e) => {
        setIsSelected(e.target.innerHTML);

    }
    const handleChange = (e) => {
        setIsSelected(e.target.value)
    }
    
    const GotoQuestion = (id) => {
        const height = $(`#question-${id}`).offset()?.top
        $('html, body').animate({
            scrollTop: height,
        }, 200)
    }
    

    useEffect(() => {
        const selectData = data.filter(item => item.title === isSelected)[0];
        setTempData(preState => ({ ...preState, selectData }));
    }, [isSelected])
     

    return (
        <>
            <div className="container">
                <div className="row mt-5">
                    <div className="col-lg-3">
                        <h4 className="bg-light p-3 border-start border-primary border-5">常見問題</h4>
                        <ul className="mt-3 px-2 d-none d-lg-block">
                            {data.map((item, i) => {
                                return (
                                    <li className={`fw-bold mb-3  p-2 ${isSelected === item.title ? 'text-white bg-primary' : ''}`} key={item.id}
                                        onClick={handleClick}
                                    >{item.title}</li>
                                )
                            })}
                        </ul>
                        <div className="d-block d-lg-none bg-primary p-2 mt-3">
                            <select className="fw-bold bg-primary text-white border-0" value={isSelected} onChange={handleChange}>
                            {data.map((item, i) => {
                                return (
                                    <option value={item.title} key={item.id}>{item.title}
                                    </option>
                                )
                            })}
                            
                        </select>

                        </div>
                        
                    </div>
                    <div className="col-lg-9">
                        <img src="https://doggiepet.com/wp-content/uploads/2016/05/FAQ-r1.png" alt="" style={{ width: '100%', objectFit: 'contain' }} />
                        <ul>
                            {tempData?.selectData?.questions.map((question, i) => {
                                return (
                                    <li className="text-primary mt-2" key={question.id}
                                    onClick={() => GotoQuestion(question.id)}
                                    >Q{i + 1}.{question.title}</li>
                                )
                            })}
                        </ul>
                        <hr />
                        {isSelected ==='購物常見問題' && (
                            <div className="p-3">
                            <div>
                                <h6 className="fw-bold" id="question-1">Q1.購物流程說明 </h6>
                                <p>選擇商品＞＞加入購物車＞＞前往結帳＞＞填寫收件資訊＞＞完成購物</p>
                                <p></p>
                                <p className="text-danger">※ 提醒您，商品加入購物車但未結帳前，並無保留商品庫存功能，商品庫存分配將以結帳順序為依據。</p>


                            </div>
                            <hr />
                            <div>
                                <h6 className="fw-bold" id="question-2">Q2.如何查詢目前訂單的處理情況?</h6>
                                <p>請您先「會員中心」後至「訂單紀錄」，即可查詢該訂單的處理狀態。</p>
                                <p></p>

                            </div>
                            <hr />
                            <div>
                                <h6 className="fw-bold" id="question-3">Q3.如何修改、加訂或合併訂單？</h6>
                                <p>為避免影響商品庫存及避免帳務錯誤，請恕我們無法為您再將訂單『修改』或『加購』或『合併』訂單商品。</p>
                                <p></p>
                                <p className="text-danger">※提醒您，如遇訂單狀態已完成出貨無法攔截時，請恕無法協助取消訂單。</p>
                            </div>
                        </div>
                        )}
                        {isSelected ==='配送取貨問題' && (
                            <div className="p-3">
                            <div>
                                <h6 className="fw-bold" id="question-1">Q1.可選擇的配送方式有那些？ </h6>
                                <p>全店商品將以『黑貓宅急便』宅配方式寄出，宅配範圍目前限於台灣本島地區；外島地區將以郵局配送。</p>
                                <p></p>
                                <p className="text-danger">※ 其他提醒：當商品出貨後，若未於通知期限內完成取貨或拒收，將會產生未取件記錄，如達3次以上(含)，未來將無法再使用該付款方式下單。</p>


                            </div>
                            <hr />
                            <div>
                                <h6 className="fw-bold" id="question-2">Q2.請問運費如何計算?</h6>
                                <p>以下為常態免運費標準，實際請依官網行銷活動公告為依據。</p>
                                <p>1.單筆購物滿1200元；未達免運條件，將酌收60元物流費。</p>

                            </div>
                            <hr />
                            <div>
                                <h6 className="fw-bold" id="question-3">Q3.台灣外島地區可以寄送嗎?</h6>
                                <p>外島地區將以郵局海運配送，預計3-7日內配達，而送達時間會因天氣狀況、船隻班次而有變動的可能性。</p>
                                
                            </div>
                        </div>
                        )}
                        {isSelected ==='退換貨及退款' && (
                            <div className="p-3">
                            <div>
                                <h6 className="fw-bold" id="question-1">Q1.如何辦理退換貨?</h6>
                                <p>根據財政部令「電子發票實施作業要點」，於消費開立之「二聯電子發票」、「三聯電子發票」，不主動寄送，本網亦會將發票號碼上傳至政府平台。</p>
                                <p>不論單件或組合價商品，保留商品仍享優惠，未達免運門檻運費不倒扣。</p>
                                <p>若仍有需要的商品，請您重新下單訂購，以節省貨物因來回寄送所秏費的時間。</p>
                                <p>每張訂單僅提供乙次免費退貨服務，若於7日內需加退商品，請自行負擔寄送運費；為避免爭議發生，請確實驗收商品後再進行退貨。</p>
                                


                            </div>
                            <hr />
                            <div>
                                <h6 className="fw-bold" id="question-2">Q2.退款方式及退款時間</h6>
                                <p>退貨作業時間： 退貨包裏完成寄送後，約7-8個工作天完成退款作業。</p>
                                <p>退款方式： 退刷至原信用卡帳戶中。由於完成退刷後，銀行間的作業處理約需7~14天，也因個人信用卡的結帳週期不同而影響退刷款項完成時間（負項可能會列在下期的帳單上）。關於「店家已刷退後的作業時間」，可洽詢您的信用卡發卡行。</p>

                            </div>
                            <hr />
                            <div>
                                <h6 className="fw-bold" id="question-3">Q3.什麼情況無法辦理退貨?</h6>
                                <p>1. 超過7天退貨期限。</p>
                                <p>2. 商品已有使用痕跡、味道或人為造成髒污等，恕不接受退貨。</p>
                                <p>3. 商品已修改尺寸、其他加工，商品或配件丟失或損毀。</p>
                                <p>4. 活動贈品未退回。</p>
                                
                                
                            </div>
                        </div>
                        )}
                        {isSelected ==='發票常見問題' && (
                            <div className="p-3">
                            <div>
                                <h6 className="fw-bold" id="question-1">Q1.什麼是「電子發票」？商品收到了，發票怎麼沒一起附上？</h6>
                                <p>根據財政部令「電子發票實施作業要點」，於消費開立之「二聯電子發票」、「三聯電子發票」，不主動寄送，本網亦會將發票號碼上傳至政府平台。</p>
                                <p>目前本網消費開立之「三聯電子發票」為會員載具，尚未開放共通性載具選項。</p>
                                


                            </div>
                            <hr />
                            <div>
                                <h6 className="fw-bold" id="question-2">Q2.發票可以指定日期或開立其它品名嗎?</h6>
                                <p>因發票採用系統化自動開立，因此發票上的品名將依實際訂購的商品名稱開立，請恕無法指定開立其它品名或指定開立日期。</p>

                            </div>
                            <hr />
                            <div>
                                <h6 className="fw-bold" id="question-3">Q3.購物發票，是否可開立為多張發票?</h6>
                                <p>因發票採用系統化自動開立，故一筆訂單對應一張發票，請恕無法分別開立多張。如有分別開立需求，請將商品分別下單。</p>
                                
                            </div>
                        </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </>
    )
};

export default FrequencelyAskedQuestions;
