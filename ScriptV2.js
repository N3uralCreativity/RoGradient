// Récup des éléments
const binIdInput = document.getElementById("binIdInput");
const retrieveBtn = document.getElementById("retrieveBtn");

const notificationBox = document.getElementById("notificationBox");
const notificationText = document.getElementById("notificationText");

const playerCheckContainer = document.getElementById("playerCheckContainer");
const playerNameSpan = document.getElementById("playerNameSpan");
const playerIdSpan = document.getElementById("playerIdSpan");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const gradientContainer = document.getElementById("gradientContainer");
const gradientOutput = document.getElementById("gradientOutput");

// Ecouteur du bouton "Récupérer"
retrieveBtn.addEventListener("click", () => {
  resetUI();
  
  const binId = binIdInput.value.trim();
  if (!binId) {
    showNotification("Veuillez entrer un ID de bin valide.", true);
    return;
  }

  // Affiche un message de chargement
  showNotification("Chargement en cours...");

  // Simule un fetch asynchrone
  fetchSimulation(binId).then((record) => {
    if (!record) {
      showNotification("Erreur : Bin introuvable ou vide.", true);
      return;
    }
    // record = { playerName, playerId, gradientData }
    showNotification("Données trouvées !", false);

    // Affiche la zone "Is this you ?"
    playerNameSpan.textContent = record.playerName;
    playerIdSpan.textContent = record.playerId;
    playerCheckContainer.classList.remove("hidden");

    // Si "Oui"
    yesBtn.onclick = () => {
      gradientOutput.textContent = record.gradientData;
      gradientContainer.classList.remove("hidden");
      playerCheckContainer.classList.add("hidden");
    };
    // Si "Non"
    noBtn.onclick = () => {
      showNotification("Vous avez indiqué que ce n'était pas vous. Fin.", true);
      playerCheckContainer.classList.add("hidden");
    };

  }).catch((err) => {
    showNotification("Erreur de fetch : " + err, true);
  });
});

/**
 * Montre une notification (msg) en retirant `.hidden`.
 * Si error = true, on peut styliser différemment (ou juste le texte).
 */
function showNotification(msg, error = false) {
  notificationBox.classList.remove("hidden");
  notificationText.textContent = msg;
  // Si on veut un style rouge en cas d'erreur, on peut changer le background
  if (error) {
    notificationBox.style.backgroundColor = "rgba(244, 67, 54, 0.4)"; // rouge
  } else {
    notificationBox.style.backgroundColor = "rgba(255,255,255,0.15)"; // normal
  }
}

/**
 * Réinitialise l'UI avant un nouveau fetch.
 */
function resetUI() {
  notificationBox.classList.add("hidden");
  playerCheckContainer.classList.add("hidden");
  gradientContainer.classList.add("hidden");
  notificationBox.style.backgroundColor = "rgba(255,255,255,0.15)";
  notificationText.textContent = "";
  gradientOutput.textContent = "";
}

/**
 * Simulation d'appel réseau. Au lieu de fetch JSONbin, on simule un record.
 * Tu pourras remplacer cette fonction par un vrai fetch(...) 
 * vers "https://api.jsonbin.io/v3/b/" + binId
 */
function fetchSimulation(binId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (binId === "erreur") {
        resolve(null); // simule une erreur
      } else {
        resolve({
          playerName: "MonJoueur",
          playerId: 123456,
          gradientData: "Ceci est un texte de gradient JSON simulé..."
        });
      }
    }, 1500); // 1,5 s de "chargement"
  });
}
