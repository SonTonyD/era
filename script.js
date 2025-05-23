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
    bankroll = parseInt(bankroll) + gain;
    resultDiv.style.color = "darkgreen";
    resultDiv.textContent = `Résultat: ${result} - Gagné! +${gain}€`;
  } else {
    bankroll = parseInt(bankroll) - betAmount;
    resultDiv.style.color = "darkred";
    resultDiv.textContent = `Résultat: ${result} - Perdu!`;
  }

  document.getElementById("bankroll").textContent = bankroll;

  if (bankroll <= 0) {
    alert("Vous avez perdu tout votre argent ! Fin de la partie.");
  }
}

function simulateMartingale(initialBankroll, initialBet, targetGain) {
  let currentTurn = 0;
  let loseStreak = 0;

  let bankroll = initialBankroll;
  let maxLoseSteak = 1;

  let gain = 0;
  let result = 0;
  let multiplier = 0;

  let betAmount = 0;

  const betType = "red";

  while (bankroll > 0 && bankroll - initialBankroll < targetGain) {
    betAmount = initialBet * 2 ** loseStreak;
    result = spinRoulette();
    multiplier = isWinningBet(betType, null, result);

    if (multiplier > 0) {
      gain = betAmount * multiplier;
      bankroll = parseInt(bankroll) + gain;
      loseStreak = 0;
    } else {
      bankroll = parseInt(bankroll) - betAmount;
      loseStreak += 1;
      if (maxLoseSteak < loseStreak) {
        maxLoseSteak = loseStreak;
      }
    }
    currentTurn = parseInt(currentTurn) + 1;
  }
  return { bankroll: parseInt(bankroll), turns: parseInt(currentTurn) };
}

function runSimulation() {
  const simInitialBankroll = parseInt(
    document.getElementById("simInitialBankroll").value
  );
  const simInitialBet = parseInt(
    document.getElementById("simInitialBet").value
  );
  const simTargetGain = parseInt(
    document.getElementById("simTargetGain").value
  );
  const simNbSim = parseInt(document.getElementById("simNbSim").value);

  const { successRate, meanFinalTurn } = executeSim(
    simInitialBankroll,
    simInitialBet,
    simTargetGain,
    simNbSim
  );

  const simResultText = `Success Rate: ${(successRate * 100).toFixed(
    2
  )}% | Mean Final Turn: ${meanFinalTurn.toFixed(2)}`;

  let resultDiv = document.getElementById("simResults");
  resultDiv.textContent = simResultText;
}

function executeSim(
  simInitialBankroll,
  simInitialBet,
  simTargetGain,
  simNbSim
) {
  let currentSim = 0;
  let sumFinalTurn = 0;
  let sumSuccess = 0;

  let result = null;

  while (currentSim < simNbSim) {
    result = simulateMartingale(
      simInitialBankroll,
      simInitialBet,
      simTargetGain
    );

    if (result.bankroll > 0) {
      sumSuccess = parseInt(sumSuccess) + 1;
    }

    sumFinalTurn = parseInt(sumFinalTurn) + parseInt(result.turns);
    currentSim = parseInt(currentSim) + 1;
  }

  const successRate = sumSuccess / simNbSim;
  const meanFinalTurn = sumFinalTurn / simNbSim;

  return { successRate, meanFinalTurn };
}

function calculerMio() {
  const resultContainer = document.getElementById("mioResults");
  while (resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild);
  }

  const mioInitialBankroll = parseInt(
    document.getElementById("mioInitialBankroll").value
  );
  const mioInitialBetMin = parseInt(
    document.getElementById("mioInitialBetMin").value
  );
  const mioInitialBetMax = parseInt(
    document.getElementById("mioInitialBetMax").value
  );
  const mioInitialBetPas = parseInt(
    document.getElementById("mioInitialBetPas").value
  );
  const mioTargetGain = parseInt(
    document.getElementById("mioTargetGain").value
  );
  const mioNbSim = parseInt(document.getElementById("mioNbSim").value);

  const resultats = genererListe(
    mioInitialBetMin,
    mioInitialBetMax,
    mioInitialBetPas
  );

  // Étape 1 : exécuter les simulations et stocker les résultats
  const simulations = resultats.map((initialBet) => {
    const { successRate, meanFinalTurn } = executeSim(
      mioInitialBankroll,
      initialBet,
      mioTargetGain,
      mioNbSim
    );
    return {
      initialBet,
      successRate,
      meanFinalTurn,
    };
  });

  // Étape 2 : trier par successRate décroissant
  const top5 = [...simulations]
    .sort((a, b) => b.successRate - a.successRate)
    .slice(0, 5);

  // Étape 3 : afficher les résultats avec mise en forme
  simulations.forEach((sim) => {
    const resultP = document.createElement("p");
    resultP.textContent = `Initial Bet : ${sim.initialBet} | Success Rate: ${(
      sim.successRate * 100
    ).toFixed(2)}% | Mean Final Turn: ${sim.meanFinalTurn.toFixed(2)}`;

    // Mise en forme vert foncé si dans le top 5
    if (top5.some((top) => top.initialBet === sim.initialBet)) {
      resultP.style.color = "darkgreen";
      resultP.style.fontWeight = "bold";
    }

    resultContainer.appendChild(resultP);
  });
}

function genererListe(min, max, pas) {
  const liste = [];
  for (let i = min; i <= max; i += pas) {
    liste.push(i);
  }
  return liste;
}

function calculerEpargne() {
  console.log("coucou");
  const mois = [
    "janvier",
    "fevrier",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "aout",
    "septembre",
    "octobre",
    "novembre",
    "decembre",
  ];

  const argentActuel =
    parseInt(document.getElementById("argentActuel").value) || 0;
  const epargneMensuel =
    parseInt(document.getElementById("epargneMensuel").value) || 0;
  const moisDepart = document
    .getElementById("moisDepart")
    .value.trim()
    .toLowerCase();
  const anneeDepart =
    parseInt(document.getElementById("anneeDepart").value) || 0;

  const resultContainer = document.getElementById("epargneResults");

  // Effacer les anciens résultats
  while (resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild);
  }

  let currentYear = parseInt(anneeDepart);
  let currentMonth = moisDepart;

  let argent = argentActuel;

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < mois.length; j++) {
      if (
        parseInt(currentYear) === parseInt(anneeDepart) &&
        parseInt(j) < parseInt(mois.indexOf(moisDepart))
      ) {
      } else {
        argent = parseInt(argent) + epargneMensuel;
        const resultText = `Année ${currentYear} ${mois[j]} ->  ${argent} euros`;
        const resultP = document.createElement("p");
        resultP.textContent = resultText;

        resultContainer.appendChild(resultP);
      }
    }
    currentYear = parseInt(currentYear) + 1;
  }
}
