import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {

  username!: string;
  password!: string;
  confirmPassword!: string;
  role!: string;

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    if (!this.username || !this.password || !this.confirmPassword || !this.role) {
      alert("Tous les champs sont obligatoires.");
      return;
    }
  
    if (this.password !== this.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
  
    if (this.password.length < 8) {
      alert("Le mot de passe doit posséder au moins 8 caractères.");
      return;
    }
  
    this.authService.getUser(this.username).subscribe(
      (user) => {
        if (user) {
          alert("Un compte avec ce nom d'utilisateur existe déjà.");
        } else {
          this.createAccount();
        }
      },
      (error) => {
        if (error.status === 404) {
          this.createAccount();
        } else {
          console.error("Erreur lors de la récupération de l'utilisateur :", error);
          alert("Il y a eu un problème lors de la vérification de votre nom d'utilisateur. Veuillez réessayer.");
        }
      }
    );
  }
  
  createAccount() {
    this.authService.register(this.username, this.password, this.role)
    .subscribe(
      (response) => {
        console.log("User créé avec succès. Connexion en cours...");
        this.loginAfterRegister();
      },
      (error) => {
        if (error.status === 201) {
          console.log("User créé avec succès. Connexion en cours...");
          this.loginAfterRegister();
        } else {
          console.error("Erreur lors de la création de l'utilisateur :", error);
          alert("Il y a eu un problème lors de la création de votre compte. Veuillez réessayer.");
        }
      }
    );
  
  }
  
  loginAfterRegister() {
    this.authService.getUser(this.username).subscribe(
      (response) => {
        const role = response.role;
        if(role){
          const user = this.authService.login(this.username, this.password, role);
          user.subscribe(
            (loginResponse) => {
              if (loginResponse.token) {
                sessionStorage.setItem('access_token', loginResponse.token);
                this.router.navigate(['/home']);
              }
            },
          );
        }
      },
    );
  }
  
  
}
