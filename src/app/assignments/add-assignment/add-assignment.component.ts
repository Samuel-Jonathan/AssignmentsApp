import { Component, OnInit, ViewChild } from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { SubjectsService } from 'src/app/shared/subjects.service';
import { Subject } from '../subject.model';
import { StudentsService } from 'src/app/shared/students.service';
import { Student } from '../student.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent implements OnInit {
  nomDevoir!: string;
  dateRendu!: Date;
  subjects: Subject[] = [];
  students: Student[] = [];
  selectedSubjectId!: number;
  selectedStudentId!: number;
  selectedNote!: number;
  comment!: string;
  notes: number[] = [];
  @ViewChild('stepper') stepper: any;

  constructor(
    private assignmentsService: AssignmentsService,
    private subjectsService: SubjectsService,
    private studentsService: StudentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSubjects();
    this.getStudents();
    
    this.notes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  }

  nextStep(stepper: any) {
    stepper.next();
  }

  previousStep(stepper: any) {
    stepper.previous();
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

  onSubmit() {
    const newAssignment = new Assignment();

    newAssignment.nom = this.nomDevoir;
    newAssignment.dateDeRendu = this.dateRendu;
    newAssignment.subjectId = this.selectedSubjectId;
    newAssignment.studentId = this.selectedStudentId;
    newAssignment.note = this.selectedNote; 
    newAssignment.comment = this.comment; 

    this.assignmentsService.addAssignment(newAssignment).subscribe((message) => {
      console.log(message);
      this.router.navigate(['/home']);
    });
  }
}
