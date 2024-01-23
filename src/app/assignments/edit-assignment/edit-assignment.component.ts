import { Component, OnInit, ViewChild } from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../student.model';
import { Subject } from '../subject.model';
import { SubjectsService } from 'src/app/shared/subjects.service';
import { StudentsService } from 'src/app/shared/students.service';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css']
})
export class EditAssignmentComponent implements OnInit {

  assignment!: Assignment | undefined;
  nomAssignment!: string;
  dateDeRendu!: Date;
  subjects: Subject[] = [];
  students: Student[] = [];
  selectedSubject!: string;
  selectedStudent!: string | undefined;
  subject!: number;
  student!: number;
  selectedNote!: number;
  comment!: string;
  notes: number[] = [];
  @ViewChild('stepper') stepper: any;

  constructor(private assignmentsService: AssignmentsService,
    private subjectsService: SubjectsService, private studentsService: StudentsService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getAssignment();
    this.getSubjects();
    this.getStudents();

    this.notes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  }

  getSubjects() {
    this.subjectsService.getSubjects().subscribe((subjectsTab: Subject[]) => {
      this.subjects = subjectsTab;
    });
  }

  getStudents() {
    this.studentsService.getStudents().subscribe((studentsTab: Student[]) => {
      this.students = studentsTab;
    });
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
      this.selectedSubject = this.assignment?.subjectName;
      this.selectedStudent = this.assignment?.studentName; 
      this.subject = this.assignment.subjectId;
      this.student != this.assignment.studentId;  
      this.selectedNote = this.assignment?.note;
      this.comment = this.assignment?.comment;
    });
  }

  onSaveAssignment() {
    if (!this.assignment) return;
    this.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;

    this.assignmentsService.updateAssignment(this.assignment).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
}
