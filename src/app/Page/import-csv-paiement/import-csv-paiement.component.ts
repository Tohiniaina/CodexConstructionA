import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ImportDataService } from 'src/app/_services/import-data.service';
declare var bootstrap: any;

@Component({
  selector: 'app-import-csv-paiement',
  templateUrl: './import-csv-paiement.component.html',
  styleUrls: ['./import-csv-paiement.component.css']
})
export class ImportCsvPaiementComponent {
  csvpaiement: File | null = null;
  showModal: boolean = false;
  loading: boolean = false;
  resultat: boolean | null = null;
  message: string = '';
  isError: boolean = false;

  constructor(private importDataService: ImportDataService, private router: Router) { }

  onFileChange(event: any, fileType: string) {
    if (fileType === 'csvpaiement') {
      this.csvpaiement = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.csvpaiement) {
      this.loading = true;
      setTimeout(() => {
        this.importDataService.importCsvFilesPaiement(this.csvpaiement!).subscribe(
          response => {
            console.log('Importation réussie :', response);
            this.resultat = true;
            this.message = 'Importation réussie';
            this.showModal = true;
            this.loading = false;
            this.showBootstrapModal();
          },
          error => {
            console.error('Erreur lors de l\'importation :', error);
            this.resultat = false;
            this.message = 'Erreur lors de l\'importation : ' + error.message;
            this.showModal = true;
            this.loading = false;
            this.showBootstrapModal();
          }
        );
      }, 3000);
    } else {
      console.error('Les fichiers CSV sont requis.');
    }
  }

  showBootstrapModal() {
    var myModal = new bootstrap.Modal(document.getElementById('resultModal'));
    myModal.show();
  }

  closeModal() {
    this.showModal = false;
    if (this.isError == true) {
      this.router.navigate(['/importcsv']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
