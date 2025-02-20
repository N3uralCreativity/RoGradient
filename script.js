const retrieveBtn = document.getElementById("retrieveBtn");
const binIdInput = document.getElementById("binIdInput");

const messageBox = document.getElementById("messageBox");
const output = document.getElementById("output");

const playerCheckContainer = document.getElementById("playerCheckContainer");
const playerInfoP = document.getElementById("playerInfoP");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const gradientContainer = document.getElementById("gradientContainer");
const gradientOutput = document.getElementById("gradientOutput");

// JSONbin v3 "b" route
const JSONBIN_BASE_URL = "https://api.jsonbin.io/v3/b/";

retrieveBtn.addEventListener("click", async () => {
  resetUI();

  const binId = binIdInput.value.trim();
  if (!binId) {
    showError("Please enter a Bin ID!");
    return;
  }

  showMessage("Loading data from JSONbin...");
  try {
    const url = `${JSONBIN_BASE_URL}${encodeURIComponent(binId)}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      showError(`Error: bin not found or server error. (Status ${resp.status})`);
      return;
    }

    const json = await resp.json();
    console.log("JSONbin response:", json);

    if (!json.record) {
      showError("
