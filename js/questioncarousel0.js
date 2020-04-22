$(document).ready(function () {
var parallaxSliderOptions = {
speed:1000,
effect:'coverflow',
autoplay:false,
parallax:true,
loop:true,
grabCursor: true,
centeredSlides: true,
coverflowEffect:
{
    rotate:35,
    depth:10,
    strech: 0,
    modifier: 1,
    slideShadows:true
},
navigation:{
    prevEl: '.image-slider .prev-ctrl',
    nextEl: '.image-slider .next-ctrl'
},
on:{

    init:function () {
        let swiper = this;
        for(let i=0;i<swiper.slides.length; i++)
        {
            $(swiper.slides[i]).find('img-container').attr({'data-swiper-parallax':0.75 * swiper.width});
        }
        let index = swiper.activeIndex;
        $(swiper.slides).removeClass('active');
        $(swiper.slides[index]).addClass('active');
    },
    transitionEnd:function () 
    {
        let swiper = this;
        let index = swiper.activeIndex;
        $(swiper.slides).removeClass('active');
        $(swiper.slides[index]).addClass('active');

    },
    resize: function () {
        this.update();
    }
}

};
var slider = new Swiper('.image-slider',parallaxSliderOptions);
});