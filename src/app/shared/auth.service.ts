import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../login/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  user!: User ;

  private apiUrl = 'http://localhost:8010/api';  

  constructor(private http: HttpClient) { 
    this.user = new User();
  }

  login(username: string, password: string, role: string): Observable<any> {
    this.user.username = username;
    this.user.password = password;
    this.user.role = role;
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password, role });
  }

  logout(){
    this.user.username = ""; 
    this.user.password = "";
    this.user.role = ""; 
  }

  isAdmin(){
    const isUserAdmin = new Promise(
      (resolve) =>{
        resolve(this.user)
      }
    );
    return isUserAdmin;
  }
}
