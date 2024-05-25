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
import { DetailsDevisComponent } from './Page/details-devis/details-devis.component';
import { LoginComponent } from './Page/login/login.component';
import { HomeComponent } from './Page/home/home.component';
import { WelcomeComponent } from './Page/welcome/welcome.component';
import { PaiementComponent } from './Page/paiement/paiement.component';
import { NewDevisComponent } from './Page/new-devis/new-devis.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DevisComponent,
    DetailsDevisComponent,
    LoginComponent,
    HomeComponent,
    WelcomeComponent,
    PaiementComponent,
    NewDevisComponent
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
