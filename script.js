const retrieveBtn = document.getElementById("retrieveBtn");
const binIdInput = document.getElementById("binIdInput");

const messageBox = document.getElementById("messageBox");
const output = document.getElementById("output");

const playerCheckContainer = document.getElementById("playerCheckContainer");
const playerAvatar = document.getElementById("playerAvatar");
const playerName = document.getElementById("playerName");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const gradientContainer = document.getElementById("gradientContainer");
const gradientOutput = document.getElementById("gradientOutput");

// JSONbin v3 "b" route
const JSONBIN_BASE_URL = "https://api.jsonbin.io/v3/b/";

// Roblox user info (to get displayName, etc.)
const ROBLOX_USER_API = "https://users.roblox.com/v1/users/";

// Instead of the official Roblox endpoint, we use roproxy with a HEADSHOT
// size=720x720, isCircular=false
// e.g. GET https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=1234&size=720x720&format=Png&isCircular=false
function buildHeadshotUrl(userId) {
  return `https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${userId}&size=720x720&format=Png&isCircular=false`;
}

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

    const record = json.record;
    const playerId = record.playerId;
    const gradientData = record.gradientData;

    if (playerId === undefined) {
      showError("No 'playerId' found in the record. Can't verify identity.");
      return;
    }
    if (gradientData === undefined) {
      showError("No 'gradientData' found in the record.");
      return;
    }

    // Fetch Roblox user info: displayName, name, etc.
    const userInfo = await fetchRobloxUser(playerId);
    if (!userInfo) {
      showError("Could not fetch user info from Roblox. Check console.");
      return;
    }

    // Next, fetch the HEADSHOT image from roproxy
    const avatarUrl = await fetchHeadshot(playerId);
    if (!avatarUrl) {
      showError("Could not fetch user headshot. Check console.");
      return;
    }

    // Show "Is this you?" container
    playerAvatar.src = avatarUrl;
    playerName.textContent = `${userInfo.displayName} (@${userInfo.name})`;
    playerCheckContainer.classList.remove("hidden");

    // If user says "Yes," show the gradient
    yesBtn.onclick = () => {
      gradientOutput.textContent = gradientData;
      gradientContainer.classList.remove("hidden");
      playerCheckContainer.classList.add("hidden");
    };

    // If user says "No," show an error or hide data
    noBtn.onclick = () => {
      showError("You indicated it's not your gradient. Exiting display.");
      playerCheckContainer.classList.add("hidden");
    };

  } catch (err) {
    showError("Network or fetch error:\n" + err);
    console.error(err);
  }
});

// Resets the UI states so old data doesn't remain
function resetUI() {
  messageBox.classList.add("hidden");
  output.textContent = "";

  playerCheckContainer.classList.add("hidden");
  playerAvatar.src = "";
  playerName.textContent = "";

  gradientContainer.classList.add("hidden");
  gradientOutput.textContent = "";
}

/** Show a success message (green box) */
function showMessage(msg) {
  messageBox.classList.remove("hidden");
  messageBox.classList.remove("error");
  messageBox.classList.add("success");
  output.textContent = msg;
}

/** Show an error message (red box) */
function showError(msg) {
  messageBox.classList.remove("hidden");
  messageBox.classList.remove("success");
  messageBox.classList.add("error");
  output.textContent = msg;
}

/** Fetch basic user info from Roblox (displayName, etc.) */
async function fetchRobloxUser(userId) {
  try {
    const resp = await fetch(ROBLOX_USER_API + userId);
    if (!resp.ok) {
      console.warn("Roblox user API error. Status:", resp.status);
      return null;
    }
    const data = await resp.json();
    console.log("Roblox user data:", data);
    return data; // { displayName, name, etc. }
  } catch (e) {
    console.error("fetchRobloxUser error:", e);
    return null;
  }
}

/** Use roproxy to get a HEADSHOT: 720x720 PNG */
async function fetchHeadshot(userId) {
  try {
    const url = buildHeadshotUrl(userId);
    const resp = await fetch(url);
    if (!resp.ok) {
      console.warn("roproxy headshot error. Status:", resp.status);
      return null;
    }
    const data = await resp.json();
    console.log("roproxy headshot data:", data);

    // The structure is typically { data: [ { imageUrl, ... } ] }
    if (!data.data || data.data.length === 0) {
      return null;
    }
    const info = data.data[0];
    if (info.state !== "Completed" || !info.imageUrl) {
      return null;
    }
    return info.imageUrl; 
  } catch (e) {
    console.error("fetchHeadshot error:", e);
    return null;
  }
}
