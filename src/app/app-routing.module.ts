import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './Page/dashboard/dashboard.component';
import { DetailsDevisComponent } from './Page/details-devis/details-devis.component';
import { DevisComponent } from './Page/devis/devis.component';
import { HomeComponent } from './Page/home/home.component';
import { ImportCsvMaisonTravauxDevisComponent } from './Page/import-csv-maison-travaux-devis/import-csv-maison-travaux-devis.component';
import { ImportCsvPaiementComponent } from './Page/import-csv-paiement/import-csv-paiement.component';
import { ImportCsvComponent } from './Page/import-csv/import-csv.component';
import { LoginComponent } from './Page/login/login.component';
import { ResetDatabaseComponent } from './Page/reset-database/reset-database.component';
import { TypeFinitionComponent } from './Page/type-finition/type-finition.component';
import { TypeTravauxComponent } from './Page/type-travaux/type-travaux.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: "devis", component: DevisComponent},
  { path: "typetravaux", component: TypeTravauxComponent},
  { path: "typefinition", component: TypeFinitionComponent},
  { path: "dashboard", component: DashboardComponent},
  { path: "importcsv", component: ImportCsvComponent},
  { path: "importcsvmaisontravauxdevis", component: ImportCsvMaisonTravauxDevisComponent},
  { path: "importcsvpaiement", component: ImportCsvPaiementComponent},
  { path: "resetdatabase", component: ResetDatabaseComponent},
  { path: 'detailsdevis/:idDevis', component: DetailsDevisComponent },
  // {path: "**", component: HomeComponent, pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
