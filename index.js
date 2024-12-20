import express from "express";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs"; // Utiliser fs classique pour existsSync
import path from "path";
import cors from "cors";
import { Chart } from "chart.js"; // Import de chart.js pour créer le graphique

const app = express();
const PORT = 5000;
const DATA_FILE = "./data.json";

// Middleware
app.use(express.json());
app.use(cors());

// Vérifie si le fichier data.json existe, sinon le crée avec un tableau vide
(async () => {
  if (!existsSync(DATA_FILE)) {
    await writeFile(DATA_FILE, "[]", "utf8");
  }
})();

// Route de test
app.get("/", (req, res) => {
  res.send("OK");
});

// Routes pour récupérer les données météo
app.get("/api/meteo", async (req, res) => {
  try {
    const data = await readFile(DATA_FILE, "utf8");
    res.json(JSON.parse(data)); // Retourne toutes les données météo
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier JSON:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route pour récupérer toutes les dates des données météo
app.get("/api/meteo/dates", async (req, res) => {
  try {
    const data = await readFile(DATA_FILE, "utf8");
    const jsonData = JSON.parse(data);
    const times = jsonData.hourly.time; // On récupère uniquement les dates
    res.json(times);
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier JSON:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route pour récupérer toutes les températures des données météo
app.get("/api/meteo/temperatures", async (req, res) => {
  try {
    const data = await readFile(DATA_FILE, "utf8");
    const jsonData = JSON.parse(data);
    const temperatures = jsonData.hourly.temperature_2m; // Température à 2m de hauteur
    res.json(temperatures);
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier JSON:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route pour récupérer toutes les vitesses de vent des données météo
app.get("/api/meteo/vent", async (req, res) => {
  try {
    const data = await readFile(DATA_FILE, "utf8");
    const jsonData = JSON.parse(data);
    const windSpeeds = jsonData.hourly.wind_speed_10m; // Vitesse du vent à 10m de hauteur
    res.json(windSpeeds);
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier JSON:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route pour générer un graphique avec température et vent
app.get("/api/meteo/graph", async (req, res) => {
  try {
    // Lire les données depuis le fichier JSON
    const data = await readFile(DATA_FILE, "utf8");
    const jsonData = JSON.parse(data);

    // Extraire les données nécessaires
    const dates = jsonData.hourly.time; // Les dates
    const temperatures = jsonData.hourly.temperature_2m; // Températures
    const windSpeeds = jsonData.hourly.wind_speed_10m; // Vitesses du vent

    // Créer un canvas avec le module 'canvas'
    const width = 800; // Largeur du graphique
    const height = 400; // Hauteur du graphique
    const canvas = createCanvas(width, height); // Créer un canvas
    const ctx = canvas.getContext("2d"); // Récupérer le contexte pour dessiner

    // Créer une nouvelle instance de Chart.js en utilisant le contexte du canvas
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates, // Les dates sur l'axe X
        datasets: [
          {
            label: "Température (°C)",
            data: temperatures,
            borderColor: "rgba(75, 192, 192, 1)", // Couleur de la ligne de température
            backgroundColor: "rgba(75, 192, 192, 0.2)", // Fond sous la courbe
            borderWidth: 2,
            fill: true, // Remplir sous la courbe
            yAxisID: 'y1', // Axe Y pour la température
          },
          {
            label: "Vitesse du vent (m/s)",
            data: windSpeeds,
            borderColor: "rgba(255, 99, 132, 1)", // Couleur de la ligne du vent
            backgroundColor: "rgba(255, 99, 132, 0.2)", // Fond sous la courbe du vent
            borderWidth: 2,
            fill: false, // Pas de remplissage sous la courbe du vent
            yAxisID: 'y2', // Axe Y secondaire pour la vitesse du vent
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "top", // Position de la légende
          },
          title: {
            display: true, // Affichage du titre
            text: "Température et Vitesse du Vent", // Titre du graphique
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Date", // Légende de l'axe X
            },
          },
          y: {
            title: {
              display: true,
              text: "Température (°C)", // Légende de l'axe Y pour la température
            },
            beginAtZero: false, // Ne pas forcer à commencer à zéro
          },
          y2: {
            title: {
              display: true,
              text: "Vitesse du Vent (m/s)", // Légende de l'axe Y pour la vitesse du vent
            },
            position: "right", // L'axe Y secondaire sera à droite
          },
        },
      },
    });

    // Convertir le graphique en image (buffer) au format PNG
    const imageBuffer = canvas.toBuffer("image/png");

    // Envoyer l'image PNG au client
    res.set("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (err) {
    console.error("Erreur lors de la génération du graphique :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});



// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
