const page = document.querySelector('.page');
const asideNavbar = document.querySelector(".fidex-navigation");
const mainNavbar = document.querySelector(".nav");

//  Navigation 

const createSectionNav = (root, nav) => {
    let currentActiveStep = nav.querySelector(".nav-active");
  
    nav.addEventListener("click", ev => {
      ev.preventDefault()
      let section 
      if (nav.dataset.nav === 'aside') {
        section = ev.target.closest(".step").dataset.section;
      } 
      if (nav.dataset.nav === 'main') {
        section = ev.target.dataset.section;  
      }
      if (!section) return;
      console.log(section);
      root.querySelectorAll(`[data-section='${section}']`)[1].scrollIntoView({
        behavior: "smooth"
      });
    });

    if (nav.dataset.nav === 'aside') {
        root.querySelectorAll("section").forEach((item) => {
        new IntersectionObserver(
            (entries) => {
            if (entries[0].isIntersecting) {
                const { section } = item.dataset;
                if (!section) return;
                currentActiveStep.classList.remove("nav-active");
                const newActiveStep = nav.querySelector(`[data-section='${section}']`);
                newActiveStep.classList.add("nav-active");
                currentActiveStep = newActiveStep;
            }
            },
            {
            threshold: 0.3
            }
        ).observe(item);
        });
    }
};

createSectionNav(page, asideNavbar);
createSectionNav(page, mainNavbar);

// ...............................

// For hide aside navigation

const intro = document.querySelector('.intro');
const nav = document.querySelector('.fidex-navigation');
function showAsideNavbar() {
    if(pageYOffset >= intro.offsetHeight) {
        nav.style.zIndex = 10;
    } else {
        nav.style.zIndex = 0;
    }
}

document.addEventListener('scroll', showAsideNavbar)
  
// ..............................


// For showing text in accordion

const accordion = document.querySelector('.accordion');

accordion.addEventListener('click', ({ target }) => {
  if (!target.closest('.accordion__item')) return
  const item = target.closest('.accordion__item');
  item.classList.toggle('active');
})

// ...............................

// Burger

const burgerBtn = document.querySelector('#nav-toggle');

burgerBtn.addEventListener('click', showMenu);

function showMenu() {
  burgerBtn.classList.toggle('active');
  mainNavbar.classList.toggle('active');
}
window.addEventListener('resize', () => {

  if (burgerBtn.classList.contains('active')) {
    burgerBtn.classList.remove('active');
    mainNavbar.classList.remove('active');
  }
})

// Touch Slider

let slider = document.querySelector('.slider'),
  sliderList = slider.querySelector('.slider__wrapper'),
  sliderTrack = slider.querySelector('.slider-track'),
  slides = slider.querySelectorAll('.slider__item'),
  arrows = document.querySelectorAll('.slider__control'),
  prev = document.querySelector('.slider__control.icon-arrow-left'),
  next = document.querySelector('.slider__control.icon-arrow-right'),
  paginationCircles = document.querySelectorAll('.slider__circle'),
  slideWidth = slides[0].offsetWidth,
  slideIndex = 0,
  posInit = 0,
  posX1 = 0,
  posX2 = 0,
  posY1 = 0,
  posY2 = 0,
  posFinal = 0,
  isSwipe = false,
  isScroll = false,
  allowSwipe = true,
  transition = true,
  nextTrf = 0,
  prevTrf = 0,
  lastTrf = --slides.length * slideWidth,
  posThreshold = slides[0].offsetWidth * 0.15,
  trfRegExp = /([-0-9.]+(?=px))/,
  swipeStartTime,
  swipeEndTime;

function getEvent (event) {
  return (event.type.search('touch') !== -1) ? event.touches[0] : event;
};
function slide () {
  if (transition) {
    sliderTrack.style.transition = 'transform .5s';
  }
  sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;
  prev.classList.toggle('disabled', slideIndex === 0);
  next.classList.toggle('disabled', slideIndex === slides.length-1);
  paginationCircles.forEach((item, index) => {
    item.classList.remove('slider__circle--active');
    if (index === slideIndex) {
      item.classList.add('slider__circle--active');
    }
  })
};
function swipeStart (ev) {
  let evt = getEvent(ev);

  if (allowSwipe) {

    swipeStartTime = Date.now();
    
    transition = true;

    nextTrf = (slideIndex + 1) * -slideWidth;
    prevTrf = (slideIndex - 1) * -slideWidth;

    posInit = posX1 = evt.clientX;
    posY1 = evt.clientY;

    sliderTrack.style.transition = '';

    document.addEventListener('touchmove', swipeAction);
    document.addEventListener('mousemove', swipeAction);
    document.addEventListener('touchend', swipeEnd);
    document.addEventListener('mouseup', swipeEnd);

    sliderList.classList.remove('grab');
    sliderList.classList.add('grabbing');
  }
};
function swipeAction (ev) {

  let evt = getEvent(ev),
    style = sliderTrack.style.transform,
    transform = +style.match(trfRegExp)[0];

  posX2 = posX1 - evt.clientX;
  posX1 = evt.clientX;

  posY2 = posY1 - evt.clientY;
  posY1 = evt.clientY;

  if (!isSwipe && !isScroll) {
    let posY = Math.abs(posY2);
    if (posY > 7 || posX2 === 0) {
      isScroll = true;
      allowSwipe = false;
    } else if (posY < 7) {
      isSwipe = true;
    }
  }

  if (isSwipe) {
    if (slideIndex === 0) {
      if (posInit < posX1) {
        setTransform(transform, 0);
        return;
      } else {
        allowSwipe = true;
      }
    }

    // запрет ухода вправо на последнем слайде
    if (slideIndex === --slides.length) {
      if (posInit > posX1) {
        setTransform(transform, lastTrf);
        return;
      } else {
        allowSwipe = true;
      }
    }

    if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
      reachEdge();
      return;
    }

    sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
  }

};
function swipeEnd () {
  posFinal = posInit - posX1;

  isScroll = false;
  isSwipe = false;

  document.removeEventListener('touchmove', swipeAction);
  document.removeEventListener('mousemove', swipeAction);
  document.removeEventListener('touchend', swipeEnd);
  document.removeEventListener('mouseup', swipeEnd);

  sliderList.classList.add('grab');
  sliderList.classList.remove('grabbing');

  if (allowSwipe) {
    swipeEndTime = Date.now();
    if (Math.abs(posFinal) > posThreshold || swipeEndTime - swipeStartTime < 300) {
      if (posInit < posX1) {
        slideIndex--;
      } else if (posInit > posX1) {
        slideIndex++;
      }
    }

    if (posInit !== posX1) {
      allowSwipe = false;
      slide();
    } else {
      allowSwipe = true;
    }

  } else {
    allowSwipe = true;
  }

};

function setTransform (transform, comapreTransform) {
  if (transform >= comapreTransform) {
    if (transform > comapreTransform) {
      sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
    }
  }
  allowSwipe = false;
};

function reachEdge() {
  transition = false;
  swipeEnd();
  allowSwipe = true;
};

sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
sliderList.classList.add('grab');

sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
slider.addEventListener('touchstart', swipeStart, {passive:true});
slider.addEventListener('mousedown', swipeStart, {passive:true});

paginationCircles.forEach((item, index) => {
  item.addEventListener('click', (event) => {
    if(event.target === item) {
        slideIndex = index;
        slide();
    }
  })
})
arrows.forEach(item => {
  item.addEventListener('click', function(event) {
    let target = event.target;
  
    if (target.classList.contains('icon-arrow-right')) {
      slideIndex++;
    } else if (target.classList.contains('icon-arrow-left')) {
      slideIndex--;
    } else {
      return;
    }
  
    slide();
  });
})

window.addEventListener('resize', () => {
  slideWidth = slides[0].offsetWidth;
  slide()
})



// .................

// Slider2 

const reviews = document.querySelector('.reviews');


// ................