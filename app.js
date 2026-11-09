const prompt = document.querySelector("#prompt");
const promptCounter = document.querySelector("#promptCounter");
const detailRange = document.querySelector("#detailRange");
const detailValue = document.querySelector("#detailValue");
const resultImage = document.querySelector("#resultImage");
const canvas = document.querySelector("#canvas");
const renderState = document.querySelector("#renderState");
const captionText = document.querySelector("#captionText");
const generateButton = document.querySelector("#generateButton");
const randomButton = document.querySelector("#randomButton");
const downloadButton = document.querySelector("#downloadButton");
const themeButton = document.querySelector("#themeButton");

const ideas = [
  "An abandoned lunar greenhouse growing roses under a violet eclipse, cinematic still",
  "A glass cathedral submerged in a calm midnight ocean, bioluminescent, ultra detailed",
  "A lone archivist walking through an infinite library carved into a red desert",
  "A retro-futurist train crossing a frozen salt lake at blue hour, editorial photography",
];

function updateCounter() {
  promptCounter.textContent = `${prompt.value.length} / 500`;
}

function selectGroup(selector, activeClass, onSelect) {
  document.querySelectorAll(selector).forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(selector).forEach((item) => item.classList.remove(activeClass));
      button.classList.add(activeClass);
      onSelect(button);
    });
  });
}

selectGroup(".chip", "active", (button) => {
  document.querySelector("#moodValue").textContent = button.dataset.mood;
});

selectGroup(".ratio", "active", (button) => {
  document.querySelector("#ratioValue").textContent = button.dataset.ratio;
});

detailRange.addEventListener("input", () => {
  detailValue.textContent = `${detailRange.value}%`;
});

prompt.addEventListener("input", updateCounter);

function getRatio() {
  const ratio = document.querySelector(".ratio.active").dataset.ratio;
  const [width, height] = ratio.split(":").map((value) => Number(value.trim()));
  return { width, height };
}

function generate() {
  const query = prompt.value.trim();
  if (!query) {
    prompt.focus();
    return;
  }

  const mood = document.querySelector(".chip.active").dataset.mood.toLowerCase();
  const { width, height } = getRatio();
  const encoded = encodeURIComponent(`${query}, ${mood} atmosphere, high detail`);
  const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=${width * 64}&height=${height * 64}&model=flux&enhance=true&nologo=true&seed=${Math.floor(Math.random() * 999999)}`;

  generateButton.disabled = true;
  generateButton.querySelector("span:nth-child(2)").textContent = "Rendering vision...";
  renderState.textContent = "RENDERING...";
  canvas.classList.remove("is-rendered");
  resultImage.onload = () => {
    canvas.classList.add("is-rendered");
    renderState.textContent = "VISION READY";
    captionText.textContent = query.split(",")[0].slice(0, 42);
    generateButton.disabled = false;
    generateButton.querySelector("span:nth-child(2)").textContent = "Generate vision";
  };
  resultImage.onerror = () => {
    renderState.textContent = "RENDER FAILED — TRY AGAIN";
    generateButton.disabled = false;
    generateButton.querySelector("span:nth-child(2)").textContent = "Generate vision";
  };
  resultImage.src = imageUrl;
}

generateButton.addEventListener("click", generate);
prompt.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") generate();
});

randomButton.addEventListener("click", () => {
  prompt.value = ideas[Math.floor(Math.random() * ideas.length)];
  updateCounter();
  generate();
});

downloadButton.addEventListener("click", () => {
  if (!resultImage.src || !canvas.classList.contains("is-rendered")) return;
  const link = document.createElement("a");
  link.href = resultImage.src;
  link.download = "nocturne-vision.jpg";
  link.target = "_blank";
  link.click();
});

themeButton.addEventListener("click", () => {
  document.documentElement.style.setProperty("--accent", getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() === "#c9f16a" ? "#b9a2ff" : "#c9f16a");
});

updateCounter();
