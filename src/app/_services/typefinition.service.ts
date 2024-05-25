import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class TypefinitionService {
  private apiUrl = 'http://localhost:8080/codexconstruction/admin/typefinition'; // Assurez-vous que l'URL est correcte

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) { }

  getTypeFinition(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken() // Ajoutez le token dans le header
    });

    return this.http.get<any[]>(this.apiUrl, { headers: headers });
  }

  saveFinition(idFinition: string, nomFinition: string, pourcentage: string): Observable<any> {
    // URL de votre endpoint Spring
    const url = 'http://localhost:8080/codexconstruction/admin/savefinition';

    let params = new HttpParams()
      .set('idFinition', idFinition)
      .set('nomFinition', nomFinition)
      .set('pourcentage', pourcentage);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken() // Ajoutez le token dans le header
    });

    // Envoi de la requête HTTP POST vers votre endpoint Spring
    return this.http.post<any>(url, null, { params: params, headers: headers });
  }

}
