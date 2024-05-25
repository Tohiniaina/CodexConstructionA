import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DevisService } from 'src/app/_services/devis.service';
declare var bootstrap: any;

@Component({
  selector: 'app-new-devis',
  templateUrl: './new-devis.component.html',
  styleUrls: ['./new-devis.component.css']
})
export class NewDevisComponent {
  loading: boolean = false;
  showModal: boolean = false;
  message: string = '';
  resultat: boolean | null = null;
  typeMaisons: any[] = [];
  finitionList: any[] = [];
  bg: string[] = [];

  lieu: string = '';
  selectedMaisonId: string = '';
  selectedFinitionId: string = '';
  dateDebut: Date = new Date();


  constructor(
    private devisService: DevisService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bg = ["l-bg-orange-dark", "l-bg-blue-dark", "l-bg-green-dark", "l-bg-cherry"];
    this.loadUtilDevis();
  }

  loadUtilDevis() {
    this.devisService.getUtilNewDevis().subscribe(
      data => {
        this.typeMaisons = data.typeMaisons;
        this.finitionList = data.finitionList;
      },
      error => {
        console.error("error", error)
      }
    );
  }

  onMaisonChange(event: any) {
      this.selectedMaisonId = event.target.value;
  }

  onFinitionChange(event: any) {
      this.selectedFinitionId = event.target.value;
  }

  insertNewDevis() {
    this.devisService.insertNewDevis(this.lieu, this.selectedMaisonId, this.selectedFinitionId, this.dateDebut).subscribe(
      response => {
        console.log(response)
        if(response.etat =="succes") {
          console.log('Paiement réussie :', response);
          this.resultat = true;
          this.message = 'Demande de devis reussi';
          this.showModal = true;
          this.loading = false;
          this.showBootstrapModal();
        } else {
          console.error('Une erreur s est produit lors du creation du nouveau devis');
          this.resultat = false;
          this.message = 'Demande de devis echoué';
          this.showModal = true;
          this.loading = false;
          this.showBootstrapModal();
        }
      },
      error => {
        console.error('Une erreur s est produit lors du creation du nouveau devis', error);
        this.resultat = false;
        this.message = 'Demande de devis echoué';
        this.showModal = true;
        this.loading = false;
        this.showBootstrapModal();
      }
    );
  }

  showBootstrapModal() {
    var myModal = new bootstrap.Modal(document.getElementById('resultModal'));
    myModal.show();
  }

  closeModalReussi() {
    this.showModal = false;
    this.router.navigate(['/devis']);
  }

  closeModalEchec() {
    this.showModal = false;
  }
}
