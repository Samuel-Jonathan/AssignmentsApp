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
  formVisible = false;
  assignments!: MatTableDataSource<Assignment>;
  searchQuery: string = '';
  filteredAssignments: MatTableDataSource<Assignment> | null = null;
  renduFilter: boolean = false;

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
    this.assignments = new MatTableDataSource<Assignment>([]);
    this.searchAssignments();
    setTimeout(() => {
      this.ajoutActive = true;
    }, 2000)
  }

  getDataSource() {
    return this.filteredAssignments || this.assignments;
  }

  applyRenduFilter() {
    if (this.renduFilter) {
      const currentSort = this.getDataSource().sort;
      const filteredData = this.getDataSource().data.filter((assignment) => assignment.rendu);
      this.filteredAssignments = new MatTableDataSource<Assignment>(filteredData);
      this.filteredAssignments.sort = currentSort;
    } else {
      this.filteredAssignments = null;
    }
  }

  getAssignments() {
    if (!this.filteredAssignments) {
      this.assignmentService.getAssignmentPagine(this.page, this.limit, this.searchQuery)
        .subscribe(
          data => {
            this.assignments.data = data.docs;
            this.totalDocs = data.totalDocs;
            this.totalPages = Math.ceil(this.totalDocs / this.limit); // Calcul du nombre total de pages en fonction du nombre total de résultats et du nombre de résultats par page
            this.nextPage = data.nextPage;
            this.prevPage = data.prevPage;
            this.hasPrevPage = data.hasPrevPage;
            this.hasNextPage = data.hasNextPage;
            this.assignments.sort = this.sort;
            this.sort.disableClear = true;
          }
        );
    } else {
      this.assignments.data = this.filteredAssignments.data;
      this.totalDocs = this.filteredAssignments.data.length;
      this.totalPages = Math.ceil(this.totalDocs / this.limit); // Calcul du nombre total de pages en fonction du nombre total de résultats et du nombre de résultats par page
      this.nextPage = 1;
      this.prevPage = 1;
      this.hasPrevPage = false;
      this.hasNextPage = false;
      this.assignments.sort = this.sort;
      this.sort.disableClear = true;
    }
  }

  searchAssignments() {
    const search = this.searchQuery.trim();
    if (search === '') {
      this.page = 1;
      this.getAssignments();
    } else {
      this.assignmentService.getAssignmentPagine(this.page, this.limit, search)
        .subscribe(
          data => {
            const newDataSource = new MatTableDataSource<Assignment>(data.docs);
            this.assignments.data = newDataSource.data;
            this.totalDocs = data.totalDocs;
            this.totalPages = Math.ceil(this.totalDocs / this.limit);
            this.assignments.sort = this.sort;
            this.sort.disableClear = true;
          }
        );
    }
    // Pas besoin d'appeler getAssignments ici, puisque getAssignmentPagine est déjà appelé ci-dessus.
  }


  onLimitResult(event: PageEvent) {
    this.limit = event.pageSize;
    this.getAssignments();
  }

  onPageChange(event: PageEvent) {
    const newPageIndex = event.pageIndex + 1;
    if (newPageIndex !== this.page) {
      this.page = newPageIndex;
      // Assurez-vous d'inclure le terme de recherche actuel ici.
      this.searchAssignments();
    }
  }

  peuplerBD() {
    this.assignmentService.peuplerBDavecForkJoin()
      .subscribe(() => {
        console.log("LA BD A ETE PEUPLEE, TOUS LES ASSIGNMENTS AJOUTES");
        window.location.reload();
      })
  }
}