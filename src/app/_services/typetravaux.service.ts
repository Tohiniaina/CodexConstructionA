import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class TypetravauxService {
  private apiUrl = 'http://localhost:8080/codexconstruction/admin/typetravaux'; // Assurez-vous que l'URL est correcte

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) { }

  getTypeTravaux(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken() // Ajoutez le token dans le header
    });

    return this.http.get<any[]>(this.apiUrl, { headers: headers });
  }

  saveTravaux(idTravaux: string, pu: string): Observable<any> {
    // URL de votre endpoint Spring
    const url = 'http://localhost:8080/codexconstruction/admin/savetravaux';

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken() // Ajoutez le token dans le header
    });

    let params = new HttpParams()
      .set('idTravaux', idTravaux)
      .set('pu', pu);

    // Envoi de la requête HTTP POST vers votre endpoint Spring
    return this.http.post<any>(url, null, { params: params, headers: headers });
  }
}
