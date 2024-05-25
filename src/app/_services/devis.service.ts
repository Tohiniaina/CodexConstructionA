import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private apiUrl = 'http://localhost:8080/codexconstruction/client'; // Assurez-vous que l'URL est correcte

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) { }

  getDevisClient(): Observable<any> {
    const url = `${this.apiUrl}/devis`;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken() // Ajoutez le token dans le header
    });

    return this.http.get<any>(url, {headers : headers});
  }

  getDevisPerPage(page: number): Observable<any> {
    const url = `${this.apiUrl}/devis?page=${page}`;

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken() // Ajoutez le token dans le header
    });

    return this.http.get<any>(url, { headers: headers });
  }


  getDetailsDevis(idDevis: string): Observable<any[]> {
    const url = `${this.apiUrl}/detailsdevis?devis=${idDevis}`;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken() // Ajoutez le token dans le header
    });
    return this.http.get<any[]>(url, {headers : headers});
  }

  getUtilNewDevis(): Observable<any> {
    const url = `${this.apiUrl}/newdevis`;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get<any>(url, {headers : headers});
  }

  insertNewDevis(lieu: string, typeMaison: string, typeFinition: string, datedebut: Date): Observable<any> {
    const url = `${this.apiUrl}/insertdevis`;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    let params = new HttpParams()
      .set('lieu', lieu)
      .set('typeMaison', typeMaison)
      .set('typeFinition', typeFinition)
      .set('datedebut', datedebut.toString());

    return this.http.post<any>(url, null, { params: params, headers: headers });
  }

  generatePDFDevis(devis: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    return this.http.get(`${this.apiUrl}/detailsdevis?devis=${devis}`, { headers, responseType: 'blob' });
  }
}
