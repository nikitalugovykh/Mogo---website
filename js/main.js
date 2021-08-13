$(function() {

    var header = $('header'),
        introH = $('#intro').innerHeight(),
        scrollOffset = $(window).scrollTop();
        // При загрузке страницы мы храним в переменной высоту скрола страницы
        // передаем ее сразу же в переменную и вызываем функцию с таким аргументом

        // Fixed Header

        checkScroll(scrollOffset);
    // на окно виндов вешается событие скролл
    $(window).on('scroll', function () {
        // тут this это window
        scrollOffset = $(this).scrollTop();

        checkScroll(scrollOffset);

    });

    function checkScroll(scrollOffset) {

        if (scrollOffset >= introH) {
        header.addClass('fixed')  
        } else {
            header.removeClass('fixed')
        }
   } 

    //  Smoth Scroll  
   $('[data-scroll]').on('click', function(event) {
    // отмена стандартного поведения ссылки
        event.preventDefault();    
    
        // Хранится ID элемента 
        var $this = $(this),
        blockId = $this.data('scroll'),
        blockOffset = $(blockId).offset().top;
        
        $('#nav a').removeClass('active');
        $this.addClass('active');

        $('html, body').animate ({
            scrollTop: blockOffset,
        }, 1000)

    });

    // Menu nav toggle
     $('#nav-toggle').on('click', function(event) {
        event.preventDefault(); 
        
        $(this).toggleClass('active');
        $('#nav').toggleClass('active');
     })

    //  Collapse


    $("[data-collapse]").on('click', function(event){
        event.preventDefault(); 

        var $this = $(this),
        blockId = $this.data('collapse');

        $this.toggleClass('active');

        $(blockId).slideToggle();
    });


    // Slider

    $("[data-slider]").slick({
        infinite: true,
        fade:true,
        slidesToShow:1,
        slidesToScroll:1,
    });

});