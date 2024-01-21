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

    if (this.password.length < 8) {
      alert("Le mot de passe doit posséder au moins 8 caractères");
      return;
    }

    // Vérifier d'abord si l'utilisateur existe
    this.authService.getUser(this.username).subscribe(
      () => {
        // Si cette ligne est exécutée, cela signifie que l'utilisateur existe déjà
        alert("Un compte avec ce nom d'utilisateur existe déjà.");
      },
      (error) => {
        // Si une erreur est retournée, dans ce cas un utilisateur non trouvé (404), tenter de créer un nouveau compte
        if (error.status === 404) {
          this.authService.register(this.username, this.password, this.role)
            .subscribe(
              () => {
                console.log("User créé avec succès.");
                this.router.navigate(['/home']);
              },
              (registerError) => {
                // Gérer l'erreur d'enregistrement ici
                console.error("Erreur lors de la création de l'utilisateur :", registerError);
                alert("Il y a eu un problème lors de la création de votre compte. Veuillez réessayer.");
              }
            );
        } else {
          // Gérer d'autres types d'erreurs ici (par exemple, erreur de serveur)
          console.error("Erreur lors de la récupération de l'utilisateur :", error);
          alert("Il y a eu un problème lors de la vérification de votre nom d'utilisateur. Veuillez réessayer.");
        }
      }
    );
  }

}
