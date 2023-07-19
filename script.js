document.addEventListener("DOMContentLoaded", function() {
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    const prevButton = section.querySelector(".prev-button");
    const nextButton = section.querySelector(".next-button");
    const imagesContainer = section.querySelector(".carousel .carousel-images");
    const images = section.querySelectorAll(".carousel .carousel-images img");

    const visibleImages = 3; // Number of visible images
    const totalImages = images.length;
    const imageWidth = 100 / visibleImages;
    let currentIndex = 0;
    let isTransitioning = false;
    let autoplayInterval;
    let isSectionVisible = false;

    function showNextImage() {
      if (isTransitioning) return;

      currentIndex = (currentIndex + 1) % totalImages;
      isTransitioning = true;
      updateCarousel();
    }

    function showPreviousImage() {
      if (isTransitioning) return;

      currentIndex = (currentIndex - 1 + totalImages) % totalImages;
      isTransitioning = true;
      updateCarousel();
    }

    function updateCarousel() {
      const translateXValue = -currentIndex * imageWidth;
      imagesContainer.style.transition = "transform 0.4s ease-in-out";
      imagesContainer.style.transform = `translateX(${translateXValue}%)`;

      imagesContainer.addEventListener("transitionend", handleTransitionEnd);
      updateButtonState();
    }

    function handleTransitionEnd() {
      imagesContainer.removeEventListener("transitionend", handleTransitionEnd);
      isTransitioning = false;
    }

    function updateButtonState() {
      if (currentIndex === 0) {
        prevButton.disabled = true;
      } else {
        prevButton.disabled = false;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(() => {
        if (isSectionVisible) {
          showNextImage();
        }
      }, 2500); // Autoplay interval of 5 seconds (5000 milliseconds)
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    prevButton.addEventListener("click", () => {
      stopAutoplay();
      showPreviousImage();
    });

    nextButton.addEventListener("click", () => {
      stopAutoplay();
      showNextImage();
    });

    section.addEventListener("mouseenter", () => {
      stopAutoplay();
    });

    section.addEventListener("mouseleave", () => {
      if (isSectionVisible) {
        startAutoplay();
      }
    });

    // Check if the section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === section) {
            isSectionVisible = entry.isIntersecting;
            if (isSectionVisible) {
              startAutoplay();
            } else {
              stopAutoplay();
            }
          }
        });
      },
      { threshold: 0.5 } // Adjust the threshold as needed
    );

    observer.observe(section);

    updateButtonState();
  });
});
