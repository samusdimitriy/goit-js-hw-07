import { galleryItems } from "./gallery-items.js";

const supportsLazyLoading = "loading" in HTMLImageElement.prototype;
loadLazySizesIfNeeded();

const palette = document.querySelector(".gallery");
const cardsMarkup = createCardsMarkup(galleryItems);
palette.insertAdjacentHTML("beforeend", cardsMarkup);

palette.addEventListener("click", (event) =>
  onGalleryClick(event, galleryItems)
);

function loadLazySizesIfNeeded() {
  if (!supportsLazyLoading) {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js";
    const lazysizesPlaceholder = document.getElementById(
      "lazysizes-placeholder"
    );
    lazysizesPlaceholder.parentNode.insertBefore(script, lazysizesPlaceholder);
  }
}

function createCardsMarkup(items) {
  const isMobileScreen = window.innerWidth <= 768;

  return items
    .map(({ preview, original, description }) => {
      const imgClass =
        isMobileScreen && !supportsLazyLoading
          ? "gallery__image lazyload"
          : "gallery__image";
      const imgSrc = isMobileScreen
        ? supportsLazyLoading
          ? `loading="lazy" src="${preview}"`
          : `data-src="${preview}"`
        : `src="${preview}"`;

      return `<li class="gallery__item">
        <a class="gallery__link" href="${original}" data-caption="${description}">
        <img class="${imgClass}" src="${preview}" data-source="${original}" alt="${description}"></img>
        </a>
        </li>`;
    })
    .join("");
}

function onGalleryClick(event, items) {
  event.preventDefault();
  if (!event.target.classList.contains("gallery__image")) {
    return;
  }

  const gallery = new SimpleLightbox(".gallery a", {
    captionSelector: "self",
    captionType: "attr",
    captionsData: "title",
    captionsData: "data-caption",
    captionDelay: 250,
  });

  const clickedImageIndex = items.findIndex(
    (item) => item.original === event.target.dataset.source
  );
  gallery.open(clickedImageIndex);

  window.addEventListener("keydown", onEscKeyClick, { once: true });

  function onEscKeyClick(event) {
    if (event.code === "Escape" && gallery && gallery.isOpen()) {
      gallery.close();
    }
  }
}

console.log(galleryItems);
