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
        $(window).on('scroll', () => {

            const scrollTop = $(window).scrollTop();
            if (scrollTop > height / 2) {
                $('.go-top').css('opacity', '1');
            } else {
                $('.go-top').css('opacity', '0');
            }
            console.log('123', scrollTop)
            console.log(height, scrollTop)
        });

    }, [])


    return (
        <h1>
            <Link className="go-top text-primary text-center"><i className="bi bi-arrow-up-short fw-bolder" onClick={() => {
                              goToTop();
            }}></i>

            </Link>

        </h1>

    )
};

export default GoTopButton;