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
    let user = this.authService.login(this.username, this.password, "user"); 
    user.subscribe(response=>{
      if(response.token){
        let role = response.user.role;   
        localStorage.setItem('access_token', response.token);  
        
        if(role === 'admin'){
          this.router.navigate(['/home']);
        }else{
          this.router.navigate(['/home']);
        }
      }
    })
  }
}