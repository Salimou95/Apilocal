import { readFile, writeFile } from "fs/promises";

// Chemin du fichier JSON
const DATA_FILE = "./data.json";

// Vérifie si un ID est valide
const isValidId = (id) => !isNaN(parseInt(id, 10));

// Récupère toutes les données
export const getAllDonnees = async (req, res) => {
  try {
    const data = await readFile(DATA_FILE, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier JSON:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupère un élément spécifique par ID
export const getDonneeById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (!isValidId(id)) {
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
};

// Ajoute un nouvel élément
export const addDonnee = async (req, res) => {
  const nouveauElement = req.body;

  if (!nouveauElement.id || !nouveauElement.nom) {
    return res
      .status(400)
      .json({ message: "Les champs id et nom sont obligatoires" });
  }

  try {
    const data = await readFile(DATA_FILE, "utf8");
    const donnees = JSON.parse(data);

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
};

// Supprime un élément par ID
export const deleteDonneeById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (!isValidId(id)) {
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
};
