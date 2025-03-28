function openMenu(containerName) {
  let div = document.getElementsByClassName(containerName)[0];
  div.style.display = div.style.display === "none" ? "inline" : "none";
}

let bankroll = 2048;
function changeBankroll() {
  let input = document.getElementById("newBankroll").value;
  document.getElementById("bankroll").textContent = input;
  bankroll = input;
}

const redNumbers = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);
const blackNumbers = new Set([
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
]);

document.getElementById("betType").addEventListener("change", function () {
  document.getElementById("numberInput").style.display =
    this.value === "number" ? "block" : "none";
});

function spinRoulette() {
  return Math.floor(Math.random() * 37);
}

function isWinningBet(betType, betNumber, result) {
  if (betType === "number" && betNumber == result) return 35;
  if (betType === "even" && result !== 0 && result % 2 === 0) return 1;
  if (betType === "odd" && result % 2 === 1) return 1;
  if (betType === "red" && redNumbers.has(result)) return 1;
  if (betType === "black" && blackNumbers.has(result)) return 1;
  return -1;
}

function calculateMartingale() {
  const initialBet = parseFloat(document.getElementById("initialBet").value);
  if (isNaN(initialBet) || initialBet <= 0) {
    alert("Veuillez entrer une mise initiale valide.");
    return;
  }

  let sum = initialBet;
  let lose = initialBet;
  let previousLose = initialBet;
  const resultContainer = document.getElementById("resultats");

  // Effacer les anciens résultats
  while (resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild);
  }

  for (let i = 1; i <= 12; i++) {
    const resultText = `Perte ${i} : ${lose} euros ; Somme engagée : ${sum} euros`;

    // Créer un nouvel élément p pour chaque ligne
    const resultP = document.createElement("p");
    resultP.textContent = resultText; // Insérer le texte dans le paragraphe

    // Ajouter ce paragraphe dans le conteneur des résultats
    resultContainer.appendChild(resultP);

    lose = previousLose * 2;
    previousLose = lose;
    sum += lose;
  }
}

function playRoulette() {
  const betType = document.getElementById("betType").value;
  let resultDiv = document.getElementById("result");

  let betNumber =
    betType === "number"
      ? parseInt(document.getElementById("betNumber").value)
      : null;
  const betAmount = parseInt(document.getElementById("betAmount").value);

  if (isNaN(betAmount) || betAmount <= 0 || betAmount > bankroll) {
    alert("Montant de mise invalide");
    return;
  }

  const result = spinRoulette();
  const multiplier = isWinningBet(betType, betNumber, result);

  if (multiplier > 0) {
    const gain = betAmount * multiplier;
    bankroll += gain;
    resultDiv.style.color = "darkgreen";
    resultDiv.textContent = `Résultat: ${result} - Gagné! +${gain}€`;
  } else {
    bankroll -= betAmount;
    resultDiv.style.color = "darkred";
    resultDiv.textContent = `Résultat: ${result} - Perdu!`;
  }

  document.getElementById("bankroll").textContent = bankroll;

  if (bankroll <= 0) {
    alert("Vous avez perdu tout votre argent ! Fin de la partie.");
  }
}
