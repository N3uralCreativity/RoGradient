// Grab elements from the DOM
const retrieveBtn = document.getElementById("retrieveBtn");
const output = document.getElementById("output");
const binIdInput = document.getElementById("binIdInput");

// If your public bins are on JSONbin's v3 "b" route:
const JSONBIN_BASE_URL = "https://api.jsonbin.io/v3/b/";

retrieveBtn.addEventListener("click", async () => {
  // Hide old output
  output.classList.add("hidden");
  output.textContent = "";

  // Get the user-input bin ID
  const binId = binIdInput.value.trim();
  if (!binId) {
    alert("Please enter a bin ID!");
    return;
  }

  // Show "Loading..."
  output.textContent = "Loading...";
  output.classList.remove("hidden");

  try {
    // Build the GET url
    const url = `${JSONBIN_BASE_URL}${encodeURIComponent(binId)}`;
    console.log("Fetching from URL:", url);

    const resp = await fetch(url);
    if (!resp.ok) {
      output.textContent = `Error: bin not found or server error (Status ${resp.status}).`;
      console.error("Fetch response not OK:", resp);
      return;
    }

    // Parse JSON
    const json = await resp.json();
    console.log("Raw JSONbin response:", json);

    // The data is typically in json.record if you're using v3
    // For example, if you stored { gradientData = "...some data..." }
    // in Roblox, you retrieve that from json.record.gradientData
    if (!json.record) {
      output.textContent = "No 'record' field found in returned JSON.";
      console.warn("No record field in JSON:", json);
      return;
    }

    // Let's assume the property is "gradientData":
    const dataStr = json.record.gradientData;
    console.log("gradientData value:", dataStr);

    if (dataStr === undefined) {
      output.textContent = "No 'gradientData' found in json.record.";
      return;
    }

    // Display the final result
    output.textContent = "Retrieved Data:\n" + dataStr;

    // "Pulse" highlight animation
    output.classList.remove("pulse");
    void output.offsetWidth; // reflow trick to restart animation
    output.classList.add("pulse");

  } catch (err) {
    // If network or some other error
    output.textContent = "Network/Fetch error:\n" + err;
    console.error("Error in fetch try/catch:", err);
  }
});
