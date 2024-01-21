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
    if (this.password !== this.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    
    if(this.password.length < 8){
      alert("Le mot de passe doit possèder au moins 8 caractères");
      return;
    }

    this.authService.register(this.username, this.password, this.role)
    .subscribe(
      (response) => {
        if (response.status === 201) {
          console.log("User créé avec succès.");
          this.router.navigate(['/home']);
        } else {
          // Gérer les autres codes de statut de succès ici si nécessaire.
          console.log("Réponse inattendue du serveur:", response);
        }
      },
      (error) => {
        if (error.status === 201) {
          // Le serveur a renvoyé 201, donc c'est un succès
          console.log("User créé avec succès.");
          this.router.navigate(['/home']);
        } else {
          // Vraie erreur
          console.error("Erreur lors de la création de l'utilisateur :", error);
          // Traitez l'erreur ici, par exemple en affichant un message d'erreur à l'utilisateur.
        }
      }
    );
  
  }
}
