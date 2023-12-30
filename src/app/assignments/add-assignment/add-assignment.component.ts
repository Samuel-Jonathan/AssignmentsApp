import { Component, OnInit } from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent implements OnInit {
  nomDevoir!: string;
  dateRendu!: Date;
  constructor(private assignmentsService: AssignmentsService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const newAssignment = new Assignment();
    let assignments: Assignment[] = [];

    this.assignmentsService.getAssignments()
      .subscribe((assignmentsTab: Assignment[]) => {
        assignments = assignmentsTab;

        const newAssignmentId = Math.floor(Math.random()*1000);
        
        newAssignment.id = newAssignmentId;
        newAssignment.nom = this.nomDevoir;
        newAssignment.dateDeRendu = this.dateRendu;

        this.assignmentsService.addAssignment(newAssignment).subscribe(message => console.log(message));
      });
  };
}
