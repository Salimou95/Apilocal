import express from "express";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs"; // Utiliser fs classique pour existsSync
import path from "path";
import cors from "cors";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

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

// Route pour générer un graphique
// Route pour générer un graphique avec température et vent
app.get("/api/meteo/graph", async (req, res) => {
  try {
    const data = await readFile(DATA_FILE, "utf8");
    const jsonData = JSON.parse(data);

    const dates = jsonData.hourly.time; // Les dates
    const temperatures = jsonData.hourly.temperature_2m; // Températures
    const windSpeeds = jsonData.hourly.wind_speed_10m; // Vitesses du vent

    // Créer un graphique avec ChartJSNodeCanvas
    const width = 800; // Largeur du graphique
    const height = 400; // Hauteur du graphique
    const chartCallback = (ChartJS) => {
      ChartJS.defaults.font.size = 16; // Optionnel, pour configurer Chart.js globalement
    };
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

    const configuration = {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Température (°C)",
            data: temperatures,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            fill: true,
            yAxisID: 'y1', // L'axe Y pour la température
          },
          {
            label: "Vitesse du vent (m/s)",
            data: windSpeeds,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 2,
            fill: false,
            yAxisID: 'y2', // L'axe Y secondaire pour le vent
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Température et Vitesse du Vent",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "Température (°C)",
            },
            beginAtZero: false,
          },
          y2: { // Axe Y secondaire pour la vitesse du vent
            title: {
              display: true,
              text: "Vitesse du Vent (m/s)",
            },
            position: "right", // Placer cet axe à droite
          },
        },
      },
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
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
