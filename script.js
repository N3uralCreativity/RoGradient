const retrieveBtn = document.getElementById("retrieveBtn");
const output = document.getElementById("output");
const binIdInput = document.getElementById("binIdInput");

// We'll assume you're using a public bin, so no key needed for read.
// Using the "b" route as per your comment:
const JSONBIN_BASE_URL = "https://api.jsonbin.io/v3/b/";

retrieveBtn.addEventListener("click", async () => {
  // Clear & hide any old output
  output.classList.add("hidden");
  output.textContent = "";

  const binId = binIdInput.value.trim();
  if (!binId) {
    alert("Please enter a bin ID!");
    return;
  }

  // Show "Loading..."
  output.textContent = "Loading...";
  output.classList.remove("hidden");

  try {
    const url = `${JSONBIN_BASE_URL}${encodeURIComponent(binId)}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      output.textContent = "Error: bin not found or server error.";
      return;
    }
    const json = await resp.json();
    // For JSONbin v3, the stored data is typically under json.record
    output.textContent = "Retrieved Data:\n" + json.record.gradientData;

    // Animate a "pulse" highlight
    output.classList.remove("pulse");
    void output.offsetWidth; // reflow trick to restart animation
    output.classList.add("pulse");

  } catch (err) {
    output.textContent = "Network/Fetch error:\n" + err;
  }
});
