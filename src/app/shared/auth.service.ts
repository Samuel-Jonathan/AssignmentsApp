import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userRole: string | null = null;

  constructor() { }
  
  private users = [
    { username: 'user', password: 'userpass', role: 'user' },
    { username: 'admin', password: 'adminpass', role: 'admin' }
  ];


  logIn(username: string, password: string) {
   const user = this.users.find(u => u.username === username && u.password === password);
   return user ? user.role : null;
  }


  isAdmin(){
    const isUserAdmin = new Promise(
      (resolve, reject) =>{
        resolve(this.userRole)
      }
    );
    return isUserAdmin;
  }
}
