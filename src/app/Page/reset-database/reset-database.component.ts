import { Component } from '@angular/core';
import { UtilService } from 'src/app/_services/util.service';
import { Router } from '@angular/router';

declare var bootstrap: any; // Assurez-vous que Bootstrap est disponible globalement

@Component({
  selector: 'app-reset-database',
  templateUrl: './reset-database.component.html',
  styleUrls: ['./reset-database.component.css']
})
export class ResetDatabaseComponent {
  resultat: any;
  isLoading: boolean = false;
  message: string = '';

  constructor(
    private utilService: UtilService,
    private router: Router
  ) { }

  resetDatabase() {
    this.isLoading = true;
    this.message = '';
    console.log("Reset base");

    this.utilService.resetDatabase().subscribe(
      data => {
        this.isLoading = false;
        this.resultat = data;
        this.message = 'La base de données a été réinitialisée avec succès.';
        this.showModal();
      },
      error => {
        this.isLoading = false;
        this.resultat = null;
        this.message = 'Une erreur s\'est produite lors de la réinitialisation de la base de données : ' + error;
        console.log('Une erreur s\'est produite lors de la réinitialisation de la base de données : ', error);
        this.showModal();
      }
    );
  }

  showModal() {
    var myModal = new bootstrap.Modal(document.getElementById('resultModal'));
    myModal.show();
  }

  closeModal() {
    this.router.navigate(['/home']);
  }
}
