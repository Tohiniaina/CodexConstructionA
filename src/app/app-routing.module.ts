import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsDevisComponent } from './Page/details-devis/details-devis.component';
import { DevisComponent } from './Page/devis/devis.component';
import { HomeComponent } from './Page/home/home.component';
import { LoginComponent } from './Page/login/login.component';
import { NewDevisComponent } from './Page/new-devis/new-devis.component';
import { PaiementComponent } from './Page/paiement/paiement.component';
import { WelcomeComponent } from './Page/welcome/welcome.component';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: "devis", component: DevisComponent},
  { path: "paiement", component: PaiementComponent},
  { path: 'detailsdevis/:idDevis', component: DetailsDevisComponent },
  { path: 'newdevis', component: NewDevisComponent }
  // {path: "**", component: HomeComponent, pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
