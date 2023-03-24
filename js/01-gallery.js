import { galleryItems } from "./gallery-items.js";

const palette = document.querySelector(".gallery");
palette.insertAdjacentHTML("beforeend", createCardsMarkup(galleryItems));
palette.addEventListener("click", onGalleryClick);

function createCardsMarkup(items) {
  return items
    .map(
      ({ preview, original, description }) =>
        `<li class="gallery__item">
      <a class="gallery__link" href="${original}">
        <img class="gallery__image" src="${preview}" data-source="${original}" alt="${description}">
      </a>
    </li>`
    )
    .join("");
}

function onGalleryClick(event) {
  event.preventDefault();
  const { target } = event;
  if (target.nodeName !== "IMG") return;

  const instance = basicLightbox.create(
    `<img src="${target.dataset.source}" width="800" height="600">`
  );
  instance.show();
  document.body.style = "overflow: hidden; height: 100vh;";

  window.addEventListener("keydown", onEscKeyClick);

  function onEscKeyClick(event) {
    if (event.code === "Escape" && instance.visible()) {
      instance.close();
      document.body.style = "";
      window.removeEventListener("keydown", onEscKeyClick);
    }
  }
}
