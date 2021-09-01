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