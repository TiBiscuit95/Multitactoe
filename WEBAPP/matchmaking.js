document.addEventListener('DOMContentLoaded', function () {
  var matchMakingButton = document.getElementById('matchmaking');
  var loadingElement = document.getElementById('loader');

  matchMakingButton.addEventListener('click', function () {
      // Afficher l'élément de chargement
      if (loadingElement) {
          loadingElement.style.display = 'block';
      }

      // Effectuer les opérations de matchmaking ici

      // Masquer l'élément de chargement une fois les opérations terminées
      if (loadingElement) {
          loadingElement.style.display = 'none';
      }
  });




  function getRanking() {
    fetch('http://localhost:3000/ranking', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
        updateTable(data.result); // Utilise les données pour mettre à jour le tableau
    })
    .catch(err => {
        console.error(err);
    });
}



function updateTable(data) {
    const tableBody = document.getElementById('classement').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Efface les anciennes lignes

    data.forEach((item, index) => {
        let row = tableBody.insertRow();
        let cellRank = row.insertCell(0);
        let cellPseudo = row.insertCell(1);
        let cellScore = row.insertCell(2);

        cellRank.innerHTML = index + 1;
        cellPseudo.innerHTML = item.pseudo;
        cellScore.innerHTML = item.partie_gagnee;
    });
}

getRanking();

  const signoutButton = document.getElementById('signout');
   
  signoutButton.addEventListener('click', signout);
 
  function signout() {

      fetch('http://localhost:3000/signout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Inclut les cookies dans la requête
        })
        .then(res => {
          if (res.ok && res.status === 201) {
            alert('Déconnexion réussie');
            // Redirige le navigateur vers l'URL
            window.location.href = '/index.html';
            // gestion des erreurs améliorée
          }else if(response.status === 500){
            alert('Erreur du serveur');
            window.location.href = '/index.html';
          }else{
            alert('Erreur de déconnexion');
            window.location.href = '/index.html';
          }
        });
  }


  const accueilButton = document.getElementById('accueil');
  accueilButton.addEventListener('click', function() {
    window.location.href = 'http://localhost:3000/accueil.html';
  });




});