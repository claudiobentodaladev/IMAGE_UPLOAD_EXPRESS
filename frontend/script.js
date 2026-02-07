const form = document.getElementById("uploadForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const res = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  msg.innerText = data.message || "Erro no upload";
});

async function loadImages() {
  const res = await fetch("http://localhost:3000/images");
  const images = await res.json();

  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  images.forEach(img => {
    const image = document.createElement("img");
    image.src = img.url;
    gallery.appendChild(image);
  });
}

loadImages();
