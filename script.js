const retrieveBtn = document.getElementById("retrieveBtn");
const output = document.getElementById("output");
const binIdInput = document.getElementById("binIdInput");

// We'll assume you're using a public bin, so no key needed for read:
const JSONBIN_BASE_URL = "https://api.jsonbin.io/v3/b";

retrieveBtn.addEventListener("click", async () => {
  // Clear & hide the output if it was visible
  output.classList.add("hidden");
  output.textContent = "";

  const binId = binIdInput.value.trim();
  if(!binId) {
    alert("Please enter a bin ID!");
    return;
  }

  // Show "Loading..."
  output.textContent = "Loading...";
  output.classList.remove("hidden");

  try {
    // GET request to JSONbin
    const url = `${JSONBIN_BASE_URL}${encodeURIComponent(binId)}`;
    const resp = await fetch(url);
    if(!resp.ok) {
      output.textContent = "Error: bin not found or server error.";
      return;
    }
    const json = await resp.json();

    // Display retrieved data 
    // (json.record.gradientData is what you stored in Roblox)
    output.textContent = "Retrieved Data:\n" + json.record.gradientData;

    // Animate a "pulse" highlight
    output.classList.remove("pulse"); 
    // Force reflow so we can restart the animation
    void output.offsetWidth; 
    output.classList.add("pulse");

  } catch(err) {
    output.textContent = "Network/Fetch error:\n" + err;
  }
});
