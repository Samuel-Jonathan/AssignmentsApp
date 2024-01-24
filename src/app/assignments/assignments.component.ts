import { Component, OnInit, ViewChild } from '@angular/core';
import { Assignment } from './assignment.model';
import { AssignmentsService } from '../shared/assignments.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})

export class AssignmentsComponent implements OnInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  titre: String = "Mon application Angular sur les assignments";
  textcolor="white";
  ajoutActive = true;
  formVisible = false;
  assignments!: MatTableDataSource<Assignment>;
  searchQuery: string = '';
  private previousSearch: string = '';
  private pageBeforeSearch: number | null = null;

  isLoading: boolean = false;
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

  logAssignment(assignment: Assignment) {
    console.log("Assignment clicked:", assignment);
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
            this.isLoading = false;
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
    this.isLoading = true;
    const search = this.searchQuery.trim();

    if (search) {
      // Si on commence une nouvelle recherche, on sauvegarde la page actuelle
      if (this.pageBeforeSearch === null) {
        this.pageBeforeSearch = this.paginator.pageIndex;
      }
      this.page = 1;
      this.paginator.pageIndex = 0; // Réinitialisation de l'index du pagineur
    } else {
      // Si la barre de recherche est vidée, on revient à la page sauvegardée
      if (this.pageBeforeSearch !== null) {
        this.page = this.pageBeforeSearch + 1; // +1 car paginator.pageIndex est à base 0
        this.paginator.pageIndex = this.pageBeforeSearch; // On met à jour l'index du pagineur
        this.pageBeforeSearch = null;
      }
    }
    this.previousSearch = search;
    this.assignmentService.getAssignmentPagine(this.page, this.limit, search)
      .subscribe(
        data => {
          this.isLoading = false;
          const newDataSource = new MatTableDataSource<Assignment>(data.docs);
          this.assignments.data = newDataSource.data;
          this.totalDocs = data.totalDocs;
          this.totalPages = Math.ceil(this.totalDocs / this.limit);
          this.assignments.sort = this.sort;
          this.sort.disableClear = true;
          if (search) {
            // If in a search, reset paginator to the first page
            this.paginator.pageIndex = 0;
          } else if (this.pageBeforeSearch !== null) {
            // If search was cleared, set paginator to the saved page
            this.paginator.pageIndex = this.page - 1;
          }
          // If a new search term is entered, update the paginator's pageIndex to 0
          if (this.page === 1) {
            this.paginator.pageIndex = 0;
          }
        }
      );
  }


  onLimitResult(event: PageEvent) {
    this.limit = event.pageSize;
    this.getAssignments();
  }

  onPageChange(event: PageEvent) {
    // L'utilisateur change la page via le pagineur
    const newPageIndex = event.pageIndex;
    this.pageBeforeSearch = null; // On oublie la page de recherche sauvegardée
    this.page = newPageIndex + 1; // +1 car paginator.pageIndex est à base 0
    this.searchAssignments();
  }


  peuplerBD() {
    this.assignmentService.peuplerBDavecForkJoin()
      .subscribe(() => {
        console.log("LA BD A ETE PEUPLEE, TOUS LES ASSIGNMENTS AJOUTES");
        window.location.reload();
      })
  }
}