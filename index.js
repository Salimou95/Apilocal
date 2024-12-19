import express from "express";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs"; // Utiliser fs classique pour existsSync
import path from "path";
import cors from "cors";

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

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
