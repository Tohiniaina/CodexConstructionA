import { Component } from '@angular/core';
import { DevisService } from '../../_services/devis.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-devis',
  templateUrl: './devis.component.html',
  styleUrls: ['./devis.component.css']
})
export class DevisComponent {
  devisList: any[] = [];
  loading: boolean = false;
  numberpage: number = 0;
  totalPages: number = 0;
  numbers: number[] = [];

  constructor(
    private devisService: DevisService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDevis();
    this.numbers = Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  navigateToDetailsDevis(idDevis: string) {
    this.loading = true;
    setTimeout(() => {
      this.router.navigate(['/detailsdevis', idDevis]);
    }, 500);
  }

  loadDevis() {
    this.devisService.getDevisClient().subscribe(
      data => {
        this.devisList = data.listDevis;
        this.totalPages = data.totalPages;
        this.numberpage = data.page;
      },
      error => {
        console.log('Une erreur s\'est produite lors de la récupération des devis : ', error);
      }
    );
  }

  loadDevisPerPage(pageDm : number) {
    this.devisService.getDevisPerPage(pageDm).subscribe(
      data => {
        this.devisList = data.listDevis;
        this.totalPages = data.totalPages;
        this.numberpage = data.page;
      },
      error => {
        console.log('Une erreur s\'est produite lors de la récupération des devis : ', error);
      }
    );
  }

  generatePDF(devis: string) {
    this.devisService.generatePDFDevis(devis).subscribe(
      response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'detailsdevis.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    );
  }
}
