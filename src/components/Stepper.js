function Stepper({stepper}) {
return (
    <div className="stepper d-flex justify-content-center my-5">
                <div className={`step ${stepper === 1 ? 'active' : ''} ${stepper > 1 ? 'checked' : ''}`} >
                    <div className="circle"></div>
                    <div className="label mt-1">確認商品</div>
                </div>
                <div className={`step ${stepper === 2 ? 'active' : ''} ${stepper > 2 ? 'checked' : ''}`}>
                    <div className="circle"></div>
                    <span className="connect-line"></span>
                    <div className="label mt-1">填寫資料</div>
                </div>
                <div className={`step ${stepper === 3 ? 'active' : ''}`}>
                    <div className="circle"></div>
                    <span className="connect-line"></span>
                    <div className="label mt-1">完成訂單</div>
                </div>
            </div>
)
};

export default Stepper;