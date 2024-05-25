import { Component } from '@angular/core';
import { ImportDataService } from 'src/app/_services/import-data.service';
import { Router } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-import-csv-maison-travaux-devis',
  templateUrl: './import-csv-maison-travaux-devis.component.html',
  styleUrls: ['./import-csv-maison-travaux-devis.component.css']
})
export class ImportCsvMaisonTravauxDevisComponent {
  csvmaisontravaux: File | null = null;
  csvdevis: File | null = null;
  showModal: boolean = false;
  loading: boolean = false;
  resultat: boolean | null = null;
  message: string = '';
  isError: boolean = false;

  constructor(private importDataService: ImportDataService, private router: Router) { }

  onFileChange(event: any, fileType: string) {
    if (fileType === 'csvmaisontravaux') {
      this.csvmaisontravaux = event.target.files[0];
    } else if (fileType === 'csvdevis') {
      this.csvdevis = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.csvmaisontravaux && this.csvdevis) {
      this.loading = true;
      setTimeout(() => {
        this.importDataService.importCsvFilesMaisonTravauxDevis(this.csvmaisontravaux!, this.csvdevis!).subscribe(
          response => {
            this.isError = false;
            console.log('Importation réussie :', response);
            this.resultat = true;
            this.message = 'Importation réussie';
            this.showModal = true;
            this.loading = false;
            this.showBootstrapModal();
          },
          error => {
            this.isError = true;
            console.error('Erreur lors de l\'importation :', error.error);
            this.resultat = false;
            this.message = error.error.error;
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
