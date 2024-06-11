document.addEventListener('DOMContentLoaded', () => {
        var select = document.getElementById("dynamic-select");
 
        const accueilButton = document.getElementById('accueil');
        accueilButton.addEventListener('click', function() {
            window.location.href = 'http://localhost:3000/accueil.html';
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
 
        function getReplay(){
            fetch('http://localhost:3000/replaylist', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Inclut les cookies dans la requête
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Erreur de réseau ou du serveur');
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                // Ajouter des options à la liste déroulante
                for(var i = 0; i < 10; i++) {
                    var option = document.createElement("option");
                    option.text = data.joueurData[i].pseudo + " VS " + data.joueurData[i+1].pseudo + " / " + data.replayData[i].date_heure_debut + " / gagnant : " + data.joueurData[i].pseudo;
                    option.value = data.replayData[i].id_partie;
                    select.add(option);
                }
            })
            .catch(err => {
                console.error(err);
            });
        }
        
        getReplay().then(replayCase => {
            console.log('Replay list fetched');
            if (replayCase) {
                replayCase.forEach((data, index) => {
                    const square = document.getElementById(`case${index + 1}`);
                    if (square) {
                        square.textContent = data;
                        square.style.display = 'flex';
                        square.style.justifyContent = 'center';
                        square.style.alignItems = 'center';
                        square.style.fontSize = '3rem';
                 }
             });
         }
     });
});