const createSectionNav = (root) => {
    const nav = root.querySelector(".nav");
    const main = root.querySelector(".page");
    let currentActiveStep = nav.querySelector(".active");
  
    nav.addEventListener("click", ({ target }) => {
      const { section } = target.closest(".step").dataset;
      if (!section) return;
      main.querySelector(`[data-section='${section}']`).scrollIntoView({
        behavior: "smooth"
      });
    });
    main.querySelectorAll("section").forEach((s) => {
      new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            const { section } = s.dataset;
            if (!section) return;
            currentActiveStep.classList.remove("active");
            const newActiveStep = nav.querySelector(
              `[data-section='${section}']`
            );
            newActiveStep.classList.add("active");
            currentActiveStep = newActiveStep;
          }
        },
        {
          threshold: 0.3
        }
      ).observe(s);
    });
  };
  createSectionNav(document.querySelector("#page"));
  