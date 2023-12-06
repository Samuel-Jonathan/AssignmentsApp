import { Component, OnInit } from '@angular/core';
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

  constructor(private assignmentsService: AssignmentsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getAssignment();
    console.log("Query Params : ");
    console.log(this.route.snapshot.queryParams);
    console.log("Fragment : ");
    console.log(this.route.snapshot.fragment);
  }

  getAssignment(){
    const id = +this.route.snapshot.params['id'];

    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      if(!assignment) return;
      this.assignment = assignment;
      this.nomAssignment = this.assignment?.nom;
      this.dateDeRendu = this.assignment?.dateDeRendu;
    });
  }

  onSaveAssignment(){
    if(!this.assignment) return;

    this.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;
    this.assignmentsService.updateAssignment(this.assignment).subscribe((message) => {
      console.log(message);
      this.router.navigate(['/home']);
    });
  }
}
