import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private apiUrl = 'http://localhost:8080/codexconstruction/admin/'; // Assurez-vous que l'URL est correcte

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) { }

  getDevis(): Observable<any> {
    const url = `${this.apiUrl}devis`;

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken() // Ajoutez le token dans le header
    });

    return this.http.get<any>(url, { headers: headers });
  }

  getDevisPerPage(page: number): Observable<any> {
    const url = `${this.apiUrl}devis?page=${page}`;

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken() // Ajoutez le token dans le header
    });

    return this.http.get<any>(url, { headers: headers });
  }

  getDetailsDevis(idDevis: string): Observable<any[]> {
    const url = `${this.apiUrl}detailsdevis?devis=${idDevis}`;

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken() // Ajoutez le token dans le header
    });

    return this.http.get<any[]>(url, { headers: headers });
  }
}
