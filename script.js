const retrieveBtn = document.getElementById("retrieveBtn");
const binIdInput = document.getElementById("binIdInput");

const messageBox = document.getElementById("messageBox");
const output = document.getElementById("output");

// "Is this you?" section
const playerCheckContainer = document.getElementById("playerCheckContainer");
const playerAvatar = document.getElementById("playerAvatar");
const playerName = document.getElementById("playerName");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

// Final gradient container
const gradientContainer = document.getElementById("gradientContainer");
const gradientOutput = document.getElementById("gradientOutput");

// JSONbin v3 "b" route for reading
const JSONBIN_BASE_URL = "https://api.jsonbin.io/v3/b/";

// Roblox user + thumbnail endpoints
// e.g. https://users.roblox.com/v1/users/<userId>
// e.g. https://thumbnails.roblox.com/v1/users/avatar?userIds=<id>&size=150x150&format=Png
const ROBLOX_USER_API = "https://users.roblox.com/v1/users/";
const ROBLOX_THUMBNAIL_API = "https://thumbnails.roblox.com/v1/users/avatar?userIds=";

retrieveBtn.addEventListener("click", async () => {
  // Reset all UI states
  messageBox.classList.add("hidden");
  output.textContent = "";

  playerCheckContainer.classList.add("hidden");
  playerAvatar.src = "";
  playerName.textContent = "";

  gradientContainer.classList.add("hidden");
  gradientOutput.textContent = "";

  // Grab bin ID
  const binId = binIdInput.value.trim();
  if (!binId) {
    showError("Please enter a Bin ID!");
    return;
  }

  // Start retrieval
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

    // Check if record exists
    if (!json.record) {
      showError("No 'record' field in returned JSON.");
      return;
    }

    // We expect something like { "playerId": 123456, "gradientData": "..." }
    const playerId = json.record.playerId;
    const gradientData = json.record.gradientData;

    if (playerId === undefined) {
      showError("No 'playerId' found in the record. Can't verify identity.");
      return;
    }
    if (gradientData === undefined) {
      showError("No 'gradientData' found in the record.");
      return;
    }

    // Fetch Roblox user info + avatar
    const userInfo = await fetchRobloxUser(playerId);
    if (!userInfo) {
      showError("Could not fetch user info from Roblox. Check console.");
      return;
    }

    const avatarUrl = await fetchRobloxAvatar(playerId);
    if (!avatarUrl) {
      showError("Could not fetch user avatar from Roblox. Check console.");
      return;
    }

    // Display "Is this you?" UI
    playerAvatar.src = avatarUrl;
    playerName.textContent = userInfo.displayName + " (@" + userInfo.name + ")";
    playerCheckContainer.classList.remove("hidden");

    // If user says Yes => show gradient
    yesBtn.onclick = () => {
      gradientOutput.textContent = gradientData;
      gradientContainer.classList.remove("hidden");

      // Hide the "Is this you?" prompt
      playerCheckContainer.classList.add("hidden");
    };

    // If user says No => maybe show error or just do nothing
    noBtn.onclick = () => {
      showError("You indicated it's not your gradient. Exiting display.");
      playerCheckContainer.classList.add("hidden");
    };

  } catch (err) {
    showError("Network or fetch error:\n" + err);
    console.error(err);
  }
});

/** Helper: show a success message in the messageBox. */
function showMessage(msg) {
  messageBox.classList.remove("hidden");
  messageBox.classList.remove("error");
  messageBox.classList.add("success"); // if you want greenish
  output.textContent = msg;
}

/** Helper: show an error message. */
function showError(msg) {
  messageBox.classList.remove("hidden");
  messageBox.classList.remove("success");
  messageBox.classList.add("error");
  output.textContent = msg;
}

/** Fetch basic user info: name, displayName, etc. */
async function fetchRobloxUser(userId) {
  try {
    const resp = await fetch(ROBLOX_USER_API + userId);
    if (!resp.ok) {
      console.warn("Roblox user API error. Status:", resp.status);
      return null;
    }
    const data = await resp.json();
    console.log("Roblox user data:", data);
    return data; // { name, displayName, etc. }
  } catch (e) {
    console.error("fetchRobloxUser error:", e);
    return null;
  }
}

/** Fetch the user thumbnail from Roblox */
async function fetchRobloxAvatar(userId) {
  try {
    const url = `${ROBLOX_THUMBNAIL_API}${userId}&size=150x150&format=Png&isCircular=false`;
    const resp = await fetch(url);
    if (!resp.ok) {
      console.warn("Roblox avatar API error. Status:", resp.status);
      return null;
    }
    const data = await resp.json();
    console.log("Roblox avatar data:", data);

    // data looks like:
    // {
    //   "data": [
    //     {
    //       "targetId": 123456,
    //       "state": "Completed",
    //       "imageUrl": "https://tr.rbxcdn.com/..."
    //     }
    //   ]
    // }
    if (!data.data || data.data.length === 0) {
      return null;
    }
    const info = data.data[0];
    if (info.state !== "Completed" || !info.imageUrl) {
      return null;
    }
    return info.imageUrl;
  } catch (e) {
    console.error("fetchRobloxAvatar error:", e);
    return null;
  }
}
