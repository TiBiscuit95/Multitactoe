// Initiation de la connexion avec le serveur
document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.container');
  const signInButton = document.getElementById('signIn');
  const signUpButton = document.getElementById('signUp');
  const signUpForm = document.getElementById('signup-form');
  const signInForm = document.getElementById('signin-form');
 
  // ajoute un écouteur d'événement sur le bouton de connexion
  signInButton.addEventListener('click', () => container.classList.remove('panel-active'));
  signUpButton.addEventListener('click', () => container.classList.add('panel-active'));
 
// Fonction pour afficher les messages d'erreur
  function setError(elem, message){
    const formControl = elem.parentElement;
    const small = formControl.querySelector('small');
 
    small.innerText = message;
 
    formControl.className = "form-control error";
  }
 
// Fonction pour afficher les messages de succès
  function setSuccess(element) {
    const formControl = element.parentElement;
    const small = formControl.querySelector('small');
    // Assurez-vous que le message d'erreur est caché
    small.style.display = 'none';
    // Optionnel : Ajouter une classe de succès pour appliquer un style visuel de validation réussie
    formControl.classList.remove('error'); // Supprime la classe d'erreur si elle est présente
    formControl.classList.add('success'); // Ajoute une classe de succès pour styles CSS spécifiques
  }
 
// Fonction pour vérifier les champs du formulaire
  function form_verify(isSignUp = true) {
    let hasErrors = false;
    const pseudo = document.getElementById(isSignUp ? 'pseudo' : 'pseudo-signin');
    const password = document.getElementById(isSignUp ? 'password' : 'password-signin');
    const e_mail = isSignUp ? document.getElementById('e_mail') : null; // Cette ligne est ajoutée
  // Vérifie si le pseudo est vide ou ne contient pas au moins 3 caractères
    if (!pseudo.value.trim() || !pseudo.value.match(/^[a-zA-Z0-9]{3,}$/)) {
      setError(pseudo, "Le pseudo doit contenir au moins 3 caractères.");
      hasErrors = true; // Définit hasErrors sur true si le champ est vide ou ne contient pas au moins 3 caractères
    } else {
      setSuccess(pseudo);// Appelle la fonction setSuccess pour afficher un message de succès
    }
  // Vérifie si l'e-mail est vide ou ne contient pas un e-mail valide
    if (isSignUp) { // Vérification de l'e-mail seulement pour l'inscription
      if(!e_mail.value.trim()){
        setError(e_mail, "L'adresse e-mail ne peut pas être vide");
        hasErrors = true;
      } else {
        setSuccess(e_mail);
      }
    }
  // Vérifie si le mot de passe est vide ou ne contient pas au moins 6 caractères
    if (!password.value.trim() || !password.value.match(/^[a-zA-Z0-9]{6,}$/)) {
      setError(password, "Le mot de passe doit contenir au moins 6 caractères.");
      hasErrors = true;
    } else {
      setSuccess(password);
    }
   
    return hasErrors;
  }
 
// Fonction pour envoyer les données du formulaire d'inscription
function sign_InForm() {
  // ajoute un écouteur d'événement sur le formulaire de connexion
  signInForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Prévenir le comportement par défaut
      // fonction de vérification du formulaire
      const hasErrors = form_verify(false);
      if (hasErrors) {
        // arrête l'exécution si le formulaire a des erreurs
      }
   
      // récupère les valeurs des champs du formulaire
      const pseudo = document.getElementById('pseudo-signin').value;
      const password = document.getElementById('password-signin').value;
 
 
      const formData = {
        pseudo: pseudo,
        password: password
      }
 
 
      fetch('http://localhost:3000/signin', {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',// définit le type de contenu de la requête
        },
        body: JSON.stringify(formData),// envoie les valeurs des champs du formulaire
      })
      // anciennement.then(res => res.json())
      .then(res => {
        if (res.ok && res.status === 200) {
          // Redirige le navigateur vers l'URL
          window.location.href = '/accueil.html';
          // gestion des erreurs améliorée
        }else if(response.status === 401){
          alert('Utilisateur introuvable');
        }else if(response.status === 500){
          alert('Erreur du serveur');
        }else{
          alert('Erreur de connexion');
        }
      });
  });
}
// Fonction pour envoyer les données du formulaire d'inscription
function sign_UpForm() {
 
 
  // ajoute un écouteur d'événement sur le formulaire d'inscription
  signUpForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prévenir le comportement par défaut
 
    // fonction de vérification du formulaire
    const hasErrors = form_verify(true)
    if (hasErrors) {
      return hasErrors; // arrête l'exécution si le formulaire a des erreurs
    }
 
    // récupère les valeurs des champs du formulaire
    const pseudo = document.getElementById('pseudo').value;
    const e_mail = document.getElementById('e_mail').value;
    const password = document.getElementById('password').value;
 
    const formData = {
      pseudo: pseudo,
      e_mail: e_mail,
      password: password
    }
 
    fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',// définit le type de contenu de la requête
      },
      body: JSON.stringify(formData),// envoie les valeurs des champs du formulaire
    }).then(res => {
      if (res.status === 201) {
        alert('Utilisateur créé');
      } else if (res.status === 409) {
        alert('Utilisateur existe déjà');
      }else if(res.status === 500){
        alert('Erreur du serveur');
      } else {
        alert('Erreur de connexion');
      }
    });
  });
}
// Appel des fonctions
  sign_InForm();
  sign_UpForm();
 
});
// Path: WEBAPP/public/meca.js