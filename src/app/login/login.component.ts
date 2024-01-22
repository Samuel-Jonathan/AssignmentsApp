import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username!: string;
  password!: string;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  login() {
    // Vérifier si les champs username et password sont remplis
    if (!this.username || !this.password) {
      this.toastr.error("Tous les champs sont obligatoires !");
      return;
    }
  
    this.authService.getUser(this.username).pipe(
      catchError((error) => {
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("role");
        this.toastr.error("Une erreur s'est produite lors de la récupération de l'utilisateur.");
        return throwError(error);
      })
    ).subscribe(
      (response) => {
        const role = response.role;
        if (role) {
          const user = this.authService.login(this.username, this.password, role).pipe(
            catchError((loginError) => {
              this.toastr.error("Connexion refusée ! Vérifier votre nom d'utilisateur et votre mot de passe.");
              return throwError(loginError);
            })
          );
          user.subscribe(
            (loginResponse) => {
              if (loginResponse.token) {
                sessionStorage.setItem('access_token', loginResponse.token);
                this.toastr.success('Connexion réussie !');
                this.router.navigate(['/home']);
              }
            },
          );
        }
      },
    );
  }
  
  
}