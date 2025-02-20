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
      showError("No 'record' field in returned JSON.");
      return;
    }

    // We expect record = { playerName, playerId, gradientData }
    const record = json.record;
    const playerName = record.playerName;
    const playerId = record.playerId;
    const gradientData = record.gradientData;

    if (playerName === undefined) {
      showError("No 'playerName' found in record. Can't identify player.");
      return;
    }
    if (playerId === undefined) {
      showError("No 'playerId' found in record. Can't identify player.");
      return;
    }
    if (gradientData === undefined) {
      showError("No 'gradientData' found in the record.");
      return;
    }

    // Show "Is this you?" 
    playerInfoP.textContent = `Name: ${playerName}\nID: ${playerId}`;
    playerCheckContainer.classList.remove("hidden");

    yesBtn.onclick = () => {
      gradientOutput.textContent = gradientData;
      gradientContainer.classList.remove("hidden");
      playerCheckContainer.classList.add("hidden");
    };

    noBtn.onclick = () => {
      showError("You indicated this is not your gradient. Exiting display.");
      playerCheckContainer.classList.add("hidden");
    };

  } catch (err) {
    showError("Network or fetch error:\n" + err);
    console.error(err);
  }
});

/** Clears old states */
function resetUI() {
  messageBox.classList.add("hidden");
  output.textContent = "";

  playerCheckContainer.classList.add("hidden");
  playerInfoP.textContent = "";

  gradientContainer.classList.add("hidden");
  gradientOutput.textContent = "";
}

/** Show a success/loading message in the box */
function showMessage(msg) {
  messageBox.classList.remove("hidden");
  messageBox.classList.remove("error");
  messageBox.classList.add("success");
  output.textContent = msg;
}

/** Show an error message in the box */
function showError(msg) {
  messageBox.classList.remove("hidden");
  messageBox.classList.remove("success");
  messageBox.classList.add("error");
  output.textContent = msg;
}
