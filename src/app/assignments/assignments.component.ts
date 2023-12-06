import { Component, OnInit } from '@angular/core';
import { Assignment } from './assignment.model';
import { AssignmentsService } from '../shared/assignments.service';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {

  titre: String = "Mon application Angular sur les assignments"
  ajoutActive = true;
  assignmentSelectionne: Assignment | null = null;
  formVisible = false;
  assignments!: Assignment[];

  constructor(private assignmentService: AssignmentsService) { }

  ngOnInit(): void {
    this.getAssignments();
    setTimeout(() => {
      this.ajoutActive = true;
    }, 2000)
  }

  getAssignments() {
    this.assignmentService.getAssignments().subscribe(assignments => this.assignments = assignments);
  }

  assignmentClique(assignment: Assignment) {
    this.assignmentSelectionne = assignment;
  }
}