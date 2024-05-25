import { Component } from '@angular/core';
import { DevisService } from 'src/app/_services/devis.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details-devis',
  templateUrl: './details-devis.component.html',
  styleUrls: ['./details-devis.component.css']
})
export class DetailsDevisComponent {
  idDevis: string = "";
  detailsDevisList: any[] = [];
  subTotal: number = 0;
  pourcentage: number = 0;
  numero: string = "";
  date: string = "";
  refDevis: string = "";

  constructor(private route: ActivatedRoute,
              private devisService: DevisService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idDevis = params['idDevis']; // Récupérez l'ID du devis depuis les paramètres de la route
      this.loadDetailsDevis(); // Chargez les détails du devis avec l'ID récupéré
    });
  }

  loadDetailsDevis() {
    this.devisService.getDetailsDevis(this.idDevis)
      .subscribe(
        data => {
          this.detailsDevisList = data;
          data.forEach(detailsDevis => {
            this.subTotal+=detailsDevis.pu*detailsDevis.qte
          });
          if (data.length > 0) {
            this.pourcentage = data[0].clientDevis.finition_pourcentage
            this.numero = data[0].clientDevis.numero
            this.date = data[0].clientDevis.datedevis
            this.refDevis = data[0].clientDevis.ref
          }
        },
        error => {
          console.error('Error fetching dashboard data:', error);
        }
      );
  }
}
