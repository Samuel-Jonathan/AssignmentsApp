import { Component, OnInit, ViewChild } from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css']
})
export class EditAssignmentComponent implements OnInit {

  assignment!: Assignment | undefined;
  nomAssignment!: string;
  dateDeRendu!: Date;
  @ViewChild('stepper') stepper: any;

  constructor(private assignmentsService: AssignmentsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getAssignment();
  }

  nextStep(stepper: any, form: any) {
    if (form.valid) {
      stepper.next();
    }
  }

  previousStep(stepper: any) {
    stepper.previous();
  }

  getAssignment() {
    const id = +this.route.snapshot.params['id'];

    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      if (!assignment) return;
      this.assignment = assignment;
      this.nomAssignment = this.assignment?.nom;
      this.dateDeRendu = this.assignment?.dateDeRendu;
    });
  }

  onSaveAssignment() {
    if (!this.assignment) return;
    this.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;
    this.assignmentsService.updateAssignment(this.assignment).subscribe((message) => {
      this.router.navigate(['/home']);
    });
  }
}
