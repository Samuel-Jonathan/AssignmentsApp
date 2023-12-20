import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8010/api';

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {
  }

  login(username: string, password: string, role: string): Observable<any> {
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("role", role);
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  logout() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem('access_token');
  }

  getUser(username: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + "/users/" + username);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !this.jwtHelper.isTokenExpired(token || '');
  }

  isAdmin(): boolean {    
    return sessionStorage.getItem("role") === "admin";
  }
}
