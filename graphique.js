async function fetchGraph() {
    try {
      // Appel à l'API pour récupérer le graphique
      const response = await fetch("http://localhost:5000/api/meteo/graph");
  
      // Vérifier si la réponse est valide
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du graphique');
      }
  
      // Récupérer l'image (au format PNG)
      const imageBlob = await response.blob();
  
      // Afficher l'image dans la balise img
      const graphImage = document.getElementById('meteo-graph');
      graphImage.src = URL.createObjectURL(imageBlob); // Utilise un objet URL pour afficher l'image
    } catch (error) {
      console.error('Erreur lors du fetch du graphique:', error);
    }
  }
  
  // Appeler la fonction pour récupérer et afficher le graphique
  fetchGraph();
  