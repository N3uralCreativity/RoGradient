const serverUrl = "https://api.jsonbin.io/v3/bins"; 
// We only need the base, we'll append `/<binId>`.

const retrieveBtn = document.getElementById("retrieveBtn");
const output = document.getElementById("output");

retrieveBtn.addEventListener("click", async () => {
  const binId = document.getElementById("binIdInput").value.trim();
  if (!binId) {
    output.textContent = "No ID entered";
    return;
  }

  try {
    output.textContent = "Loading...";
    // For a public bin, no need for X-ACCESS-KEY
    const url = `${serverUrl}/${encodeURIComponent(binId)}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      output.textContent = `Error fetching bin: ${resp.status}`;
      return;
    }
    const json = await resp.json();
    // 'json.record.gradientData' is what you stored
    output.textContent = `Gradient Data:\n${json.record.gradientData}`;
  } catch (err) {
    output.textContent = `Error: ${err}`;
  }
});
