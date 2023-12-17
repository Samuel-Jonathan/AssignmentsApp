import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../login/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  user!: User;
  userRole: string | null = null;

  private apiUrl = 'http://localhost:8010/api';  

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { 
    this.user = new User();
  }

  login(username: string, password: string, role: string): Observable<any> {
    this.user.username = username;
    this.user.password = password;
    this.user.role = role;
    localStorage.removeItem('access_token');
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password, role });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !this.jwtHelper.isTokenExpired(token || '');
  }

  isAdmin(){
    const isUserAdmin = new Promise(
      (resolve) =>{
        resolve(this.userRole)
      }
    );
    return isUserAdmin;
  }
}
