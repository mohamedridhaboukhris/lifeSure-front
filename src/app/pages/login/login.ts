

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private auth: Auth, private router: Router) {}

  login() {
    this.errorMessage = '';
    this.loading = true;

    const data = {
      email: this.email,
      password: this.password
    };

    this.auth.login(data).subscribe({
      next: (res: any) => {
        console.log("LOGIN SUCCESS:", res);

        // 🔐 Sauvegarder le token JWT
        this.auth.saveToken(res.token);

        this.loading = false;

        // ✅ Redirection vers le dashboard admin
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        console.log("LOGIN ERROR:", err);
        this.errorMessage = "Email ou mot de passe incorrect";
        this.loading = false;
      }
    });
  }
}