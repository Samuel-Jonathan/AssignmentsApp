import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { Observable, of } from 'rxjs';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {

  constructor(private loggingService:LoggingService, private http:HttpClient) { }

  assignments: Assignment[] = [
    {
      id: 1,
      nom: "Vive les maths",
      dateDeRendu: new Date('2021-03-01'),
      rendu: true
    },
    {
      id: 2,
      nom: "Vive la physique",
      dateDeRendu: new Date('2023-03-05'),
      rendu: false
    },
    {
      id: 3,
      nom: "Angular c'est encore mieux",
      dateDeRendu: new Date('2021-03-10'),
      rendu: false
    }];

      url="http://localhost:8010/api/assignments";

    getAssignments():Observable<Assignment[]>{
      return this.http.get<Assignment[]>(this.url);
    }

    getAssignment(id:number):Observable<Assignment|undefined>{
      console.log(this.url + "/" + id);
  
      
      return this.http.get<Assignment>(this.url + "/" + id);
    }

    addAssignment(assignment: Assignment): Observable<string>{
      this.assignments.push(assignment);
      this.loggingService.log(assignment.nom, "ajouté");
      return of('Assignment ajouté');
    }

    updateAssignment(assignment:Assignment):Observable<string>{
      return of("Assignment service: assignments modifié !");
    }

    deleteAssignment(assignment:Assignment):Observable<string>{
      let pos = this.assignments.indexOf(assignment);
      this.assignments.splice(pos, 1);

      return of("Assignment service: assignment supprimé !");
    }
}
