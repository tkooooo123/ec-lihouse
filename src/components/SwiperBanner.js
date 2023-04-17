import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import   SwiperCore ,{Autoplay, Pagination, Navigation, Scrollbar } from "swiper";

import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

function SwiperBanner() {
    SwiperCore.use([Autoplay])
    return (
        <Swiper
            className='swiper'
            modules={[Pagination, Navigation, Scrollbar]}  // 引入module 
            spaceBetween={50} //Slide之間的距離 
            slidesPerView={1}  //一頁顯示幾個slide 
            //左右箭頭導航 
            navigation
            autoplay={{ delay: 3000,
                disableOnInteraction: false}} 
            
        >
            <SwiperSlide>
                <img src="https://cdn.hk01.com/di/media/images/dw/20220503/598221776203288576687042.jpeg/4-Da4DZToAxwkdfgnO9OG9P23Cdm5ealbUkTsG1JE7A?v=w1920r16_9" alt="..." />
                <div className='open-text d-flex align-items-center justify-content-center'>
                    <p className='fw-bold text-primary'>全新開幕</p>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <img src="https://article.murata.com/sites/default/files/styles/large/public/static/ja-jp/images/article/iot-changes-life-with-pets/iot-changes-life-with-pets-main.jpg?itok=fXIwQlD2" alt="..." />
                <div className='transport-text text-center text-primary'>
                    <img src="https://www.svgrepo.com/download/22694/delivery-truck.svg" style={{width:'50px', height: '50px'}} alt="..." />
                <h4 className='fw-bold'>滿額免運</h4>
                <p className='fw-bold'>商品滿NT$ 699免運</p>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                
                <img src="https://i.imgur.com/SV3Daha.jpeg" alt="..."  style={{objectFit: 'cover', objectPosition: 'left top'}}/>
                
                <div className='new-text d-flex align-items-center justify-content-center'>
                    <p className='fw-bold text-primary '>新品上市</p>
                </div>
            </SwiperSlide>
            



        </Swiper>
    )
};
export default SwiperBanner;