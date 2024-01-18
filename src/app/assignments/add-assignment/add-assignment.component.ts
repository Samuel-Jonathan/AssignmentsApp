import { Component, OnInit } from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { SubjectsService } from 'src/app/shared/subjects.service';
import { Subject } from '../subject.model';
import { StudentsService } from 'src/app/shared/students.service';
import { Student } from '../student.model';

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
  selectedSubjectId: number | undefined;
  selectedStudentId: number | undefined;

  constructor(private assignmentsService: AssignmentsService, 
    private subjectsService: SubjectsService,
    private studentsService: StudentsService) { }

  ngOnInit(): void {
    this.getSubjects();
    this.getStudents();
  }

  getSubjects() {
    this.subjectsService.getSubjects()
      .subscribe((subjectsTab: Subject[]) => {
        this.subjects = subjectsTab;
      });
  }

  getStudents() {
    this.studentsService.getStudents()
      .subscribe((studentsTab: Student[]) => {
        this.students = studentsTab;
      });
  }

  onSubmit() {
    const newAssignment = new Assignment();
    let assignments: Assignment[] = [];

    if (this.selectedSubjectId !== undefined) {
      newAssignment.subjectId = this.selectedSubjectId;
    }

    this.assignmentsService.getAssignments()
      .subscribe((assignmentsTab: Assignment[]) => {
        assignments = assignmentsTab;

        const newAssignmentId = Math.floor(Math.random() * 1000);

        newAssignment.id = newAssignmentId;
        newAssignment.nom = this.nomDevoir;
        newAssignment.dateDeRendu = this.dateRendu;

        this.assignmentsService.addAssignment(newAssignment).subscribe(message => console.log(message));
      });
  };
}
