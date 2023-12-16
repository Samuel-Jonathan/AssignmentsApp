import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userRole: string | null = null;

  private apiUrl = 'http://localhost:8010/api';  

  constructor(private http: HttpClient) { }

  login(username: string, password: string, role: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password, role });
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
