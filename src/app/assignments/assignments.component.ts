import { Component, OnInit, ViewChild } from '@angular/core';
import { Assignment } from './assignment.model';
import { AssignmentsService } from '../shared/assignments.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})

export class AssignmentsComponent implements OnInit {

  @ViewChild(MatSort) sort!: MatSort;


  titre: String = "Mon application Angular sur les assignments"
  ajoutActive = true;
  assignmentSelectionne: Assignment | null = null;
  formVisible = false;
  assignments!: MatTableDataSource<Assignment>;

  page: number = 1;
  limit: number = 10;
  totalDocs!: number;
  totalPages!: number;
  nextPage!: number;
  prevPage!: number;
  hasPrevPage!: boolean;
  hasNextPage!: boolean;

  constructor(private assignmentService: AssignmentsService) { }

  ngOnInit(): void {
    this.getAssignments();
    setTimeout(() => {
      this.ajoutActive = true;
    }, 2000)
  }

  getAssignments() {
    this.assignmentService.getAssignmentPagine(this.page, this.limit)
      .subscribe(
        data => {
          this.assignments = new MatTableDataSource(data.docs);
          this.totalDocs = data.totalDocs;
          this.totalPages = data.totalPages;
          this.nextPage = data.nextPage;
          this.prevPage = data.prevPage;
          this.hasPrevPage = data.hasPrevPage;
          this.hasNextPage = data.hasNextPage;
          this.assignments.sort = this.sort;
          this.sort.disableClear = true;
        }
      )
  }

  onLimitResult(event: PageEvent) {
    this.limit = event.pageSize;
    this.getAssignments();
  }

  onPageChange(event: PageEvent) {
    const newPageIndex = event.pageIndex + 1; 
    if (newPageIndex !== this.page) { 
      this.page = newPageIndex; 
      this.getAssignments(); 
    }
  }

 

  assignmentClique(assignment: Assignment) {
    this.assignmentSelectionne = assignment;
  }

  peuplerBD() {
    this.assignmentService.peuplerBDavecForkJoin()
      .subscribe(() => {
        console.log("LA BD A ETE PEUPLEE, TOUS LES ASSIGNMENTS AJOUTES");
        window.location.reload();
      })
  }
}