import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class ImportDataService {

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) { }

  importCsvFilesMaisonTravauxDevis(csvmaisontravaux: File, csvdevis: File): Observable<any> {
    const apiUrl = 'http://localhost:8080/codexconstruction/util/importercsvmaisontravauxetdevis';
    const formData: FormData = new FormData();
    formData.append('csvmaisontravaux', csvmaisontravaux);
    formData.append('csvdevis', csvdevis);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken() // Ajoutez le token dans le header
    });

    return this.http.post(apiUrl, formData, { headers: headers });
  }

  importCsvFilesPaiement(csvpaiement: File): Observable<any> {
    const apiUrl = 'http://localhost:8080/codexconstruction/util/importercsvpaiement';
    const formData: FormData = new FormData();
    formData.append('csvpaiement', csvpaiement);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken() // Ajoutez le token dans le header
    });

    return this.http.post(apiUrl, formData, { headers: headers });
  }
}
