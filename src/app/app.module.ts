import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './Template/header/header.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { DevisComponent } from './Page/devis/devis.component';
import { TypeTravauxComponent } from './Page/type-travaux/type-travaux.component';
import { TypeFinitionComponent } from './Page/type-finition/type-finition.component';
import { ImportCsvComponent } from './Page/import-csv/import-csv.component';
import { ImportCsvMaisonTravauxDevisComponent } from './Page/import-csv-maison-travaux-devis/import-csv-maison-travaux-devis.component';
import { ImportCsvPaiementComponent } from './Page/import-csv-paiement/import-csv-paiement.component';
import { ResetDatabaseComponent } from './Page/reset-database/reset-database.component';
import { DashboardComponent } from './Page/dashboard/dashboard.component';
import { DetailsDevisComponent } from './Page/details-devis/details-devis.component';
import { ModifComponent } from './Page/type-finition/modif/modif.component';
import { ModifTravauxComponent } from './Page/type-travaux/modiftravaux/modiftravaux.component';
import { LoginComponent } from './Page/login/login.component';
import { HomeComponent } from './Page/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DevisComponent,
    TypeTravauxComponent,
    TypeFinitionComponent,
    ImportCsvComponent,
    ImportCsvMaisonTravauxDevisComponent,
    ImportCsvPaiementComponent,
    ResetDatabaseComponent,
    DashboardComponent,
    DetailsDevisComponent,
    ModifComponent,
    ModifComponent,
    ModifTravauxComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgChartsModule,
    FormsModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    CarouselModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
