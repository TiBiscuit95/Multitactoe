document.addEventListener('DOMContentLoaded', function () {
   
  function getStats() {
      return fetch('http://localhost:3000/stats',{
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include',
      })
      .then(res => {
        if (res.ok && res.status === 201) {
          return res.json();
        }else if(response.status === 500){
          alert('Erreur du serveur');
        }
      })
      .then(data => {
          return [data.partie_jouee, data.partie_gagnee, data.match_nul, data.partie_perdue];
      })
      .catch(err => {
          console.error(err);
      });
  }
   
  // Ensuite, assurez-vous de l'utiliser correctement dans la suite du script :
  getStats().then(squareData => {
      if(squareData) {
          squareData.forEach((data, index) => {
            const square = document.getElementById(`square${index + 1}`);
            if (square) {
              square.textContent = data;
              square.textContent = data;
              square.style.display = 'flex';
              square.style.justifyContent = 'center';
              square.style.alignItems = 'center';
              square.style.fontSize = '3rem';
            }
          });
      }
  });
   
   
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
            // .then(res => {
            //   if (!res.ok) {
            //     throw new Error('Erreur de réseau ou du serveur');
            //   }
            //   return res.json();
            // })
            // .then(data => {
            //   if (data.redirect) {
            //     // Redirige le navigateur vers l'URL dans data.redirect
            //     window.location.href = data.redirect;
            //   }
            // })
            // .catch(err => {
            //   console.error(err);
            // });

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
   
    function UserInfo() {
        fetch('http://localhost:3000/userinfo', {
            method: 'GET',
            credentials: 'include' // Nécessaire pour les cookies de session
        })
        .then(res => res.json())
        .then(data => {
            // Met à jour le contenu de l'élément avec la classe 'pseudo' avec le pseudo de l'utilisateur
            document.querySelector('.pseudo').textContent = data.pseudo;
        })
        .catch(error => console.error('Error:', error));
    }
   
    // Appelez cette fonction pour mettre à jour le pseudo sur la page
    UserInfo();
   
    const jouerButton = document.getElementById('jouer');
    jouerButton.addEventListener('click', function() {
      fetch('http://localhost:3000/jouer', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Inclut les cookies dans la requête
      })
      .then(res => {
        if (res.ok && res.status === 201) {
          // Redirige le navigateur vers l'URL
          window.location.href = '/matchmaking.html';
          // gestion des erreurs améliorée
        }else if(res.status === 500){
          alert('Erreur du serveur');
        }else{
          alert('Erreur de connexion');
        }
      });
    }); 

    const replayButton = document.getElementById('replay');
    replayButton.addEventListener('click', function() {
      fetch('http://localhost:3000/replay', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Inclut les cookies dans la requête
      })
      .then(res => {
        if (res.ok && res.status === 201) {
          // Redirige le navigateur vers l'URL
          window.location.href = '/replay.html';
          // gestion des erreurs améliorée
        }else if(res.status === 500){
          alert('Erreur du serveur');
        }else{
          alert('Erreur de connexion');
        }
      });
   });
});
     
  // Path: WEBAPP/public/accueil.js