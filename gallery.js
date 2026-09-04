const gallery = document.querySelector('.product-gallery');

if (gallery) {
  const mainImage = gallery.querySelector('[data-gallery-image]') || gallery.querySelector('.gallery-stage img');
  const thumbs = [...gallery.querySelectorAll('.gallery-thumb')];

  const select = (thumb) => {
    mainImage.src = thumb.dataset.gallerySrc;
    mainImage.alt = thumb.dataset.galleryAlt;
    mainImage.width = thumb.dataset.galleryWidth;
    mainImage.height = thumb.dataset.galleryHeight;
    thumbs.forEach((item) => {
      const selected = item === thumb;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
  };

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => select(thumb));
    thumb.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? thumbs.length - 1 : (index + direction + thumbs.length) % thumbs.length;
      thumbs[nextIndex].focus();
      select(thumbs[nextIndex]);
    });
  });
}
