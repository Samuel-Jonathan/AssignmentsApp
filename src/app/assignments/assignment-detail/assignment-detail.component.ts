import { Component, OnInit } from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent implements OnInit {
  assignementTransmis!: Assignment | null;

  constructor(private assignmentsService: AssignmentsService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.getAssignments();
  }

  getAssignments() {
    const id = +this.route.snapshot.params['id'];
    this.assignmentsService.getAssignment(id).subscribe(assignment => {
      if (assignment) {
        this.assignementTransmis = assignment;
      }
    });
  }

  onAssignmentRendu() {
    this.assignementTransmis?.rendu != true;

    if (this.assignementTransmis) {
      this.assignmentsService.updateAssignment(this.assignementTransmis).subscribe(
        message => {
          console.log(message);
          this.router.navigate(["/home"]);
        });
    }
  }

  onDelete() {
    if (this.assignementTransmis) {
      this.assignmentsService.deleteAssignment(this.assignementTransmis)
        .subscribe((message) => {
          console.log(message);
          this.router.navigate(["/home"]);
        })
    }
  }

  onClickEdit() {
    if (this.assignementTransmis) {
      this.router.navigate(["/assignment", this.assignementTransmis.id, 'edit'],
        { queryParams: { nom: this.assignementTransmis.nom }, fragment: 'edition' });
    }
  }

  isAdmin() {

    if (this.authService.user && this.authService.user.role === 'admin') {
      return true;
    }
    return false;
  }
}
