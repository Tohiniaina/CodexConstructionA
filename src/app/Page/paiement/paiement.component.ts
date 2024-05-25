import { Component, Input } from '@angular/core';
import { DevisService } from 'src/app/_services/devis.service';
import { PaiementService } from 'src/app/_services/paiement.service';
declare var bootstrap: any;

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.css']
})
export class PaiementComponent {
  devisList: any[] = [];
  loading: boolean = false;
  showModal: boolean = false;
  message: string = '';
  resultat: boolean | null = null;

  @Input() idDevis: string = "";
  @Input() date: Date = new Date();
  @Input() montant: number = 0;

  constructor(
    private devisService: DevisService,
    private paiementService: PaiementService
  ) { }

  ngOnInit(): void {
    this.loadDevis();
  }

  loadDevis() {
    this.devisService.getDevisClient().subscribe(
      data => {
        this.devisList = data.listDevis;
      },
      error => {
        console.log('Une erreur s\'est produite lors de la récupération des devis : ', error);
      }
    );
  }

  payerDevis() {
    console.log("Payement en cours")
    this.paiementService.payerDevis(this.idDevis, this.date, this.montant).subscribe(
      response => {
        console.log(response)
        if(response.etat =="succes") {
          console.log('Paiement réussie :', response);
          this.resultat = true;
          this.message = 'Paiement réussie';
          this.showModal = true;
          this.loading = false;
          this.showBootstrapModal();
        } else {
          console.error('Erreur de paiement, vous ne pouvez pas payer plus que vous doit payer');
          this.resultat = false;
          this.message = 'Vous ne pouvez pas payer plus que vous doit payer';
          this.showModal = true;
          this.loading = false;
          this.showBootstrapModal();
        }
      },
      error => {
        console.error('Erreur de paiement, vous ne pouvez pas payer plus que vous doit payer', error);
        this.resultat = false;
        this.message = 'Vous ne pouvez pas payer plus que vous doit payer';
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

  closeModal() {
    this.showModal = false;
  }
}
