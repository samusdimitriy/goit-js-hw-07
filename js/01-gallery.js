import { galleryItems } from "./gallery-items.js";

const supportsLazyLoading = "loading" in HTMLImageElement.prototype;

if (!supportsLazyLoading) {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js";
  const lazysizesPlaceholder = document.getElementById("lazysizes-placeholder");
  lazysizesPlaceholder.parentNode.insertBefore(script, lazysizesPlaceholder);
}

const palette = document.querySelector(".gallery");
const cardsMarkup = createCardsMarkup(galleryItems);
palette.insertAdjacentHTML("beforeend", cardsMarkup);
palette.addEventListener("click", onGalleryClick);

function createCardsMarkup(galleryItems) {
  // Избегайте отложенной загрузки изображений, которые находятся в первой видимой области просмотра - написано в документации, поэтому я буду использовать lazysizes только в том случае, если пользователь открыл сайт на мобильном.
  const isMobileScreen = window.innerWidth <= 768;

  return galleryItems
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
        <a class="gallery__link" href="${original}">
        <img class="${imgClass}" ${imgSrc} data-source="${original}" alt="${description}"></img>
        </a>
        </li>`;
    })
    .join("");
}

function onGalleryClick(event) {
  event.preventDefault();
  if (!event.target.classList.contains("gallery__image")) {
    return;
  }

  document.body.style.overflow = "hidden";
  document.body.style.height = "100vh";

  const instance = basicLightbox.create(`
    <img src="${event.target.dataset.source}" width="800" height="600">
    `);
  instance.show();

  window.addEventListener("keydown", onEscKeyClick, { once: true });

  function onEscKeyClick(event) {
    if (event.code === "Escape" && instance && instance.visible()) {
      instance.close();
      document.body.style.overflow = "";
      document.body.style.height = "";
    }
  }
}
