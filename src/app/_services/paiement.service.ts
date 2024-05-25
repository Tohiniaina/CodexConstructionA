import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = 'http://localhost:8080/codexconstruction/client';

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) { }

  payerDevis(idDevis: string, date: Date, montant: number): Observable<any> {
    const url = `${this.apiUrl}/payer`;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
    let params = new HttpParams()
      .set('devis', idDevis)
      .set('date', date.toString())
      .set('montant', montant);

    return this.http.post<any>(url, null, { params: params, headers: headers });
  }
}
