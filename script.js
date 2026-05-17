const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector("#main-menu");

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    }
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

function getImageNumber(img) {
  const src = img.getAttribute("src") || "";
  const match = src.match(/-(\d+)\.jpg$/i);
  return match ? Number(match[1]) : 9999;
}

function applyGalleryOrder(categoryId, preferredOrder, newText) {
  const block = document.getElementById(categoryId);
  if (!block) return;

  const gallery = block.querySelector(".category-gallery");
  if (!gallery) return;

  if (newText) {
    const paragraph = block.querySelector(".category-head p");
    if (paragraph) paragraph.textContent = newText;
  }

  const images = Array.from(gallery.querySelectorAll("img"));
  const orderIndex = new Map(preferredOrder.map((number, index) => [number, index]));

  images
    .sort((a, b) => {
      const aNumber = getImageNumber(a);
      const bNumber = getImageNumber(b);
      const aIndex = orderIndex.has(aNumber) ? orderIndex.get(aNumber) : 999 + aNumber;
      const bIndex = orderIndex.has(bNumber) ? orderIndex.get(bNumber) : 999 + bNumber;
      return aIndex - bIndex;
    })
    .forEach((img) => gallery.appendChild(img));
}

applyGalleryOrder(
  "moto-mecanique",
  [
    1, 9, 10, 11, 12, 13, 15, 16, 17, 18,
    2, 6, 7, 8, 4, 5, 14, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28
  ],
  "Motos en action, portraits de motards, détails mécaniques puis voitures de caractère."
);

applyGalleryOrder(
  "evenementiel",
  [
    24, 5, 7, 12, 13, 14, 15, 16,
    6, 8, 10, 11, 17, 18, 19, 20, 21, 22, 23,
    2, 3, 4, 1
  ],
  "Concerts et scènes vivantes, puis reconstitution, festivals, nocturnes et ambiances fortes."
);

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const messageBox = document.createElement("p");
  messageBox.className = "form-status";
  messageBox.setAttribute("aria-live", "polite");
  contactForm.appendChild(messageBox);

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector(".form-submit");
    const originalText = submitButton ? submitButton.textContent : "";
    const formData = new FormData(contactForm);

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Envoi en cours...";
    }

    messageBox.textContent = "";
    messageBox.classList.remove("ok", "error");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Service de formulaire indisponible");
      }

      contactForm.reset();
      messageBox.textContent = "Message envoyé. Merci, je reviendrai vers vous dès que possible.";
      messageBox.classList.add("ok");
    } catch (error) {
      messageBox.innerHTML = "Le service d'envoi du formulaire semble indisponible pour le moment. Vous pouvez réessayer plus tard ou me contacter via <a href=\"https://www.instagram.com/instant.gh\" target=\"_blank\" rel=\"noreferrer\">Instagram</a>.";
      messageBox.classList.add("error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  });
}
