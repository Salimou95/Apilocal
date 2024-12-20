# API Météo

Une API simple pour gérer et afficher des données météorologiques stockées dans un fichier JSON.

## Fonctionnalités

### 1. Initialisation

- Vérifie si le fichier `data.json` existe.

### 2. Routes disponibles

#### **Route de test**

- **GET `/`**
  - Vérifie que le serveur est en ligne.
  - Réponse : `OK`.

#### **Récupérer toutes les données météo**

- **GET `/api/meteo`**
  - Retourne toutes les données météo stockées dans le fichier JSON.

#### **Récupérer toutes les dates des données météo**

- **GET `/api/meteo/dates`**
  - Retourne toutes les dates disponibles dans les données météo.
  - Exemple de réponse :
    ```json
    ["2024-12-19T12:00:00Z", "2024-12-19T13:00:00Z", ...]
    ```

#### **Récupérer toutes les températures**

- **GET `/api/meteo/temperatures`**
  - Retourne la liste des températures (à 2 mètres de hauteur).
  - Exemple de réponse :
    ```json
    [15.3, 16.7, 14.8, ...]
    ```

#### **Récupérer toutes les vitesses de vent**

- **GET `/api/meteo/vent`**
  - Retourne la liste des vitesses du vent (à 10 mètres de hauteur).
  - Exemple de réponse :
    ```json
    [5.4, 6.1, 4.8, ...]
    ```

#### **Récupérer la localisation et les coordonnées**

- **GET `/api/meteo/localisation`**
  - Retourne les informations sur la latitude, la longitude et l'élévation de la prise de données, ainsi qu'un timestamp formaté.
  - Exemple de réponse :
    ```json
    {
      "timestamp": "2024-12-19 14:30:45",
      "data": {
        "latitude": 48.8566,
        "longitude": 2.3522,
        "elevation": 35
      }
    }
    ```

### 3. Page HTML

Une page HTML est incluse dans le projet et permet de récupérer et d'afficher les données de l'API dans un tableau dynamique.

#### Fonctionnalités de la page :

- Récupère les données des trois routes suivantes :
  - `/api/meteo/dates` : les dates.
  - `/api/meteo/temperatures` : les températures.
  - `/api/meteo/vent` : les vitesses du vent.
- Affiche ces données dans un tableau.
