// Fonction pour récupérer les données de l'API et les afficher dans le tableau
async function fetchMeteoData() {
  try {
    // Récupérer les trois ensembles de données de l'API
    const datesResponse = await fetch("http://localhost:5000/api/meteo/dates");
    const temperaturesResponse = await fetch(
      "http://localhost:5000/api/meteo/temperatures"
    );
    const ventResponse = await fetch("http://localhost:5000/api/meteo/vent");

    const dates = await datesResponse.json();
    const temperatures = await temperaturesResponse.json();
    const vent = await ventResponse.json();

    // Afficher les données dans le tableau
    const tableBody = document.getElementById("meteo-table");
    tableBody.innerHTML = ""; // Vider le tableau avant d'ajouter les nouvelles données

    for (let i = 0; i < dates.length; i++) {
      const row = document.createElement("tr");

      const dateCell = document.createElement("td");
      dateCell.textContent = dates[i];
      row.appendChild(dateCell);

      const temperatureCell = document.createElement("td");
      temperatureCell.textContent = temperatures[i];
      row.appendChild(temperatureCell);

      const ventCell = document.createElement("td");
      ventCell.textContent = vent[i];
      row.appendChild(ventCell);

      tableBody.appendChild(row);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
}

// Appeler la fonction pour récupérer et afficher les données
fetchMeteoData();
