import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username!: string;
  password!: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    // Obtenez le rôle de l'utilisateur
    this.authService.getUser(this.username).subscribe(
      (response) => {
        const role = response.role;
        console.log(role);
        
        // Utilisez le rôle pour effectuer la connexion
        const user = this.authService.login(this.username, this.password, role);
        user.subscribe(
          (loginResponse) => {
            if (loginResponse.token) {
              localStorage.setItem('access_token', loginResponse.token);
              this.router.navigate(['/home']);
            }
          },
        );
      },
    );
  }
  
}