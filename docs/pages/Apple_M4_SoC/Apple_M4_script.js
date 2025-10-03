const slides = document.querySelector('.slides');
const images = document.querySelectorAll('.slides img');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
let index = 0;

function showSlide(i) {
  if (i < 0) index = images.length - 1;
  else if (i >= images.length) index = 0;
  else index = i;

  slides.style.transform = `translateX(${-index * 600}px)`;
}

prev.addEventListener('click', () => showSlide(index - 1));
next.addEventListener('click', () => showSlide(index + 1));

setInterval(() => showSlide(index + 1), 3000);



document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll('.media-image-title');

  images.forEach(img => {
    img.style.transition = "transform 0.3s ease"; // on met la transition une seule fois

    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.1)';
    });

    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });
});