import express from "express";
import cors from "cors";
import {
  getAllDonnees,
  getDonneeById,
  addDonnee,
  deleteDonneeById,
} from "./routes.js";
// import { existsSync, writeFile } from "fs/promises";

const app = express();
const PORT = 5000;
const DATA_FILE = "./data.json";

// Middleware
app.use(express.json());
app.use(cors());

// Vérifie si le fichier data.json existe, sinon le crée avec un tableau vide
// if (!existsSync(DATA_FILE)) {
//   await writeFile(DATA_FILE, "[]", "utf8");
// }

// Routes
app.get("/", () => {
  "OK";
});
app.get("/api/donnees", getAllDonnees);
app.get("/api/donnees/:id", getDonneeById);
app.post("/api/donnees", addDonnee);
app.delete("/api/donnees/:id", deleteDonneeById);

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Vérifie si le fichier data.json existe, sinon le crée avec un tableau vide
// if (!existsSync(DATA_FILE)) {
//   await writeFile(DATA_FILE, "[]", "utf8");
// }

// Endpoint pour récupérer toutes les données
app.get("/api/donnees", async (req, res) => {
  try {
    const data = await readFile(DATA_FILE, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier JSON:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Endpoint pour récupérer un élément spécifique par ID
app.get("/api/donnees/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const data = await readFile(DATA_FILE, "utf8");
    const donnees = JSON.parse(data);
    const element = donnees.find((item) => item.id === id);

    if (element) {
      res.json(element);
    } else {
      res.status(404).json({ message: "Élément non trouvé" });
    }
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier JSON:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Endpoint pour ajouter un nouvel élément
app.post("/api/donnees", async (req, res) => {
  const nouveauElement = req.body;

  // Validation des champs nécessaires
  if (!nouveauElement.id || !nouveauElement.nom) {
    return res
      .status(400)
      .json({ message: "Les champs id et nom sont obligatoires" });
  }

  try {
    const data = await readFile(DATA_FILE, "utf8");
    const donnees = JSON.parse(data);

    // Vérification de l'unicité de l'ID
    if (donnees.find((item) => item.id === nouveauElement.id)) {
      return res
        .status(400)
        .json({ message: "Un élément avec cet ID existe déjà" });
    }

    donnees.push(nouveauElement);
    await writeFile(DATA_FILE, JSON.stringify(donnees, null, 2), "utf8");
    res
      .status(201)
      .json({ message: "Élément ajouté avec succès", element: nouveauElement });
  } catch (err) {
    console.error("Erreur lors de l'écriture dans le fichier JSON:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Endpoint pour supprimer un élément par ID
app.delete("/api/donnees/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const data = await readFile(DATA_FILE, "utf8");
    const donnees = JSON.parse(data);

    const index = donnees.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Élément non trouvé" });
    }

    donnees.splice(index, 1);
    await writeFile(DATA_FILE, JSON.stringify(donnees, null, 2), "utf8");

    res.json({ message: "Élément supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de l'écriture dans le fichier JSON:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
