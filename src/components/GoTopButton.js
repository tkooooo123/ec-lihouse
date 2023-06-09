import { Link } from "react-router-dom";
import $ from "jquery";
import { useEffect } from "react";

function GoTopButton() {
    const height = $(window).height();
    const goToTop = () => {
        $('html, body').animate({
            scrollTop: 0,
        }, 200)
    }
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = $(window).scrollTop();
            if (scrollTop > height / 3) {
                $('.go-top').css('opacity', '0.9');
            } else {
                $('.go-top').css('opacity', '0');
            }  
        }
        $(window).on('scroll', handleScroll);
     
      return () => {
        $(window).off('scroll', handleScroll)
      }

    }, [])


    return (
        <div className="fs-1">
            <Link className="go-top text-primary d-flex justify-content-center align-items-center"><i className="bi bi-arrow-up-short fw-bolder" onClick={() => {
                              goToTop();
            }}></i>

            </Link>

        </div>

    )
};

export default GoTopButton;