import express from "express";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs"; // Utiliser fs classique pour existsSync
import path from "path";
import cors from "cors";

const app = express();
const PORT = 5000;
const DATA_FILE = "./data.json";

// Middleware Ce middleware permet de parser les données JSON envoyées dans une requête HTTP et les transforme
// en objet JavaScript afin que tu puisses y accéder facilement via req.body.
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

// Route pour récupérer la latitute/longitude/élévation de la prise de données
app.get("/api/meteo/localisation", async (req, res) => {
  try {
    const data = await readFile(DATA_FILE, "utf8");
    const jsonData = JSON.parse(data);
    //const loc = jsonData.latitude; // Latitude

    // Obtenir l'heure actuelle au format lisible
    const now = new Date(); // Date formatée UTC 0
    const utcPlus1 = new Date(now.getTime() + 3600000); // Ajoute 1 heure (3600000 ms) pour utc + 1 (heure française)
    const formattedTimestamp = utcPlus1
      .toISOString()
      .replace("T", " ")
      .split(".")[0]; // Format : YYYY-MM-DD HH:mm:ss permet de garder l'indice 0 et sup les mili
    const objet = {
      timestamp: formattedTimestamp,
      data: {
        latitude: jsonData.latitude,
        longitude: jsonData.longitude,
        elevation: jsonData.elevation,
      },
    };
    //console.log(jsonData);
    res.json(objet);
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier JSON:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
