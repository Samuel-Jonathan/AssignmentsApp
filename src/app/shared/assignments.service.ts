import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { bdInitialAssignments } from '../shared/data';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {

  constructor(private http:HttpClient) { }

    url="http://localhost:8010/api/assignments";

    getAssignments():Observable<Assignment[]>{
      return this.http.get<Assignment[]>(this.url);
    }

    getToken(){
      return localStorage.getItem('access_token');
    }

    getHttpOptions(){
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`  
        }),
        withCredentials: true
      };
    }

    getAssignment(id: number): Observable<Assignment | undefined> {
      return this.http.get<Assignment>(this.url + "/" + id, this.getHttpOptions());
    }

    addAssignment(assignment: Assignment): Observable<any>{
      return this.http.post<Assignment>(this.url, assignment, this.getHttpOptions());
    }

    updateAssignment(assignment:Assignment):Observable<any>{
      return this.http.put<Assignment>(this.url, assignment, this.getHttpOptions());
    }

    deleteAssignment(assignment:Assignment):Observable<any>{
      let deleteURI = this.url + '/' + assignment._id;
      return this.http.delete(deleteURI, this.getHttpOptions());
    }

    peuplerBDavecForkJoin(){
      let appelsVersAddAssignments:Observable<any>[] = [];

      bdInitialAssignments.forEach(a=>{
        let nouvelAssignment = new Assignment();
        nouvelAssignment.nom = a.nom;
        nouvelAssignment.id = a.id;
        nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
        nouvelAssignment.rendu = a.rendu;

        appelsVersAddAssignments.push(this.addAssignment(nouvelAssignment))
      });
      return forkJoin(appelsVersAddAssignments);
    }

    getAssignmentPagine(page:number, limit:number) : Observable<any>{
      const token = localStorage.getItem('access_token');
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Utilisez les backticks pour inclure la variable dans la chaîne
        }),
        withCredentials: true
      };
      return this.http.get<any>(this.url + '?page=' + page + '&limit=' + limit, httpOptions);
    }
}
