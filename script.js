const retrieveBtn = document.getElementById("retrieveBtn");
const binIdInput = document.getElementById("binIdInput");
const messageBox = document.getElementById("messageBox");
const output = document.getElementById("output");

// For v3 "b" route:
const JSONBIN_BASE_URL = "https://api.jsonbin.io/v3/b/";

// On click, fetch from JSONbin
retrieveBtn.addEventListener("click", async () => {
  // Hide old message, reset classes
  messageBox.className = "message-box hidden"; 
  output.classList.remove("pulse");
  output.textContent = "";

  const binId = binIdInput.value.trim();
  if (!binId) {
    // Show an error if binId is empty
    messageBox.classList.remove("hidden");
    messageBox.classList.add("error");
    output.textContent = "Please enter a Bin ID!";
    return;
  }

  // Show a "Loading..." in success style or error style?
  // We'll do success style for now, so user sees a green box:
  messageBox.classList.remove("hidden");
  messageBox.classList.add("success");
  output.textContent = "Loading...";

  try {
    const url = `${JSONBIN_BASE_URL}${encodeURIComponent(binId)}`;
    console.log("Fetching from:", url);

    const resp = await fetch(url);
    if (!resp.ok) {
      // If 404 or other error, show in .error style
      messageBox.classList.remove("success");
      messageBox.classList.add("error");

      output.textContent = `Error: bin not found or server error. (Status ${resp.status})`;
      return;
    }

    const json = await resp.json();
    console.log("JSONbin response:", json);

    // Typically in v3, data is at json.record
    if (!json.record) {
      // Possibly a malformed response
      messageBox.classList.remove("success");
      messageBox.classList.add("error");
      output.textContent = "No 'record' field in returned JSON.";
      return;
    }

    // If you stored { gradientData = "...some data..." }
    const dataStr = json.record.gradientData;
    if (dataStr === undefined) {
      messageBox.classList.remove("success");
      messageBox.classList.add("error");
      output.textContent = "No 'gradientData' property found in record.";
      return;
    }

    // If success, show final data
    messageBox.classList.remove("error");
    messageBox.classList.add("success");
    output.textContent = `Retrieved Data:\n${dataStr}`;

    // Animate pulse
    output.classList.remove("pulse");
    void output.offsetWidth; // reflow
    output.classList.add("pulse");

  } catch (err) {
    // network error or fetch error
    messageBox.classList.remove("success");
    messageBox.classList.add("error");
    output.textContent = `Network or fetch error:\n${err}`;
    console.error(err);
  }
});
