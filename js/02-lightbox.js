import { galleryItems } from "./gallery-items.js";

const palette = document.querySelector(".gallery");
const cardsMarkup = createCardsMarkup(galleryItems);
palette.insertAdjacentHTML("beforeend", cardsMarkup);

palette.addEventListener("click", (event) =>
  onGalleryClick(event, galleryItems)
);

function createCardsMarkup(items) {
  return items
    .map(({ preview, original, description }) => {
      return `<li class="gallery__item">
        <a class="gallery__link" href="${original}" data-caption="${description}">
        <img class="gallery__image" src="${preview}" data-source="${original}" alt="${description}">
        </a>
        </li>`;
    })
    .join("");
}

function onGalleryClick(event, items) {
  event.preventDefault();
  if (event.target.nodeName !== "IMG") {
    return;
  }

  const gallery = new SimpleLightbox(".gallery a", {
    captionSelector: "self",
    captionType: "attr",
    captionsData: "data-caption",
    captionDelay: 250,
    closeOnEscape: true,
  });

  const clickedImageIndex = items.findIndex(
    (item) => item.original === event.target.dataset.source
  );
  gallery.open(clickedImageIndex);
}

console.log(galleryItems);
