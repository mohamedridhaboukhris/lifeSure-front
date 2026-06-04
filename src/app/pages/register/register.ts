//import { Component } from '@angular/core';
//import { FormsModule } from '@angular/forms';
//import { CommonModule } from '@angular/common';
//import { Auth } from '../../services/auth';
//import { Router } from '@angular/router';

//@Component({
  //selector: 'app-register',
 // standalone: true,
  //imports: [CommonModule, FormsModule], 
  //templateUrl: './register.html',
  //  styleUrls: ['./register.css'],

//})
//export class RegisterComponent {

  //user = {
    //nom: '',
    //prenom: '',
    //email: '',
    //password: '',
   // telephone: ''
  //};

  //constructor(private auth: Auth, private router: Router) {}
//onRegister() {

  //if (!this.user.telephone || this.user.telephone.length < 8) {
    //alert("Téléphone invalide");
    //return;
  //}

  ///this.auth.register(this.user).subscribe({
    //next: (res) => {
      //console.log("SUCCESS:", res);
     // alert("Compte créé !");
     // this.router.navigate(['/login']);
    //},
    //error: (err) => {
     // console.log("ERROR FULL:", err);
     // alert(err.error?.message || err.error || "Erreur register");
   // }
 // });
//}
//}














/*import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {

  user = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: ''
  };

  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private auth: Auth, private router: Router) {}

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    // Validations côté client
    if (!this.user.telephone || this.user.telephone.length < 8) {
      this.errorMessage = "Numéro de téléphone invalide (minimum 8 chiffres)";
      return;
    }

    if (this.user.password.length < 6) {
      this.errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
      return;
    }

    this.loading = true;

    this.auth.register(this.user).subscribe({
      next: (res) => {
        console.log("REGISTER SUCCESS:", res);
        this.loading = false;
        this.successMessage = "Compte créé avec succès ! Redirection...";

        // Redirection vers /login après 1,5s
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        console.log("REGISTER ERROR:", err);
        this.loading = false;
        this.errorMessage = err.error?.message || err.error || "Erreur lors de l'inscription";
      }
    });
  }
}*/











































































import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {

  user = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: ''
  };

  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private auth: Auth, private router: Router) {}

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    // 🆕 Validation EMAIL : doit finir par @gmail.com
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(this.user.email.trim())) {
      this.errorMessage = "L'email doit être valide et se terminer par @gmail.com";
      return;
    }

    // 🆕 Validation NOM (pas de chiffres)
if (!this.user.nom || this.user.nom.trim().length < 2) {
  this.errorMessage = "Le nom doit contenir au moins 2 caractères";
  return;
}
if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(this.user.nom.trim())) {
  this.errorMessage = "Le nom ne doit contenir que des lettres";
  return;
}

    // 🆕 Validation PRÉNOM (pas de chiffres)
if (!this.user.prenom || this.user.prenom.trim().length < 2) {
  this.errorMessage = "Le prénom doit contenir au moins 2 caractères";
  return;
}
if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(this.user.prenom.trim())) {
  this.errorMessage = "Le prénom ne doit contenir que des lettres";
  return;
}

    // Validation TÉLÉPHONE
    if (!this.user.telephone || !/^\d{8}$/.test(this.user.telephone.trim())) {
      this.errorMessage = "Le numéro de téléphone doit contenir exactement 8 chiffres";
      return;
    }

    // Validation MOT DE PASSE
    if (this.user.password.length < 6) {
      this.errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
      return;
    }

    this.loading = true;

    this.auth.register(this.user).subscribe({
      next: (res) => {
        console.log("REGISTER SUCCESS:", res);
        this.loading = false;
        this.successMessage = "Compte créé avec succès ! Redirection...";

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        console.log("REGISTER ERROR:", err);
        this.loading = false;
        this.errorMessage = err.error?.message || err.error || "Erreur lors de l'inscription";
      }
    });
  }
}