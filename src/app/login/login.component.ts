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

  constructor(private authService:AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    let role = this.authService.logIn(this.username, this.password); 

    if(!this.authService.userRole && role === 'admin'){
      this.authService.userRole = 'admin';
    }else{
      this.router.navigate(['/home']);
    }
  }
}
