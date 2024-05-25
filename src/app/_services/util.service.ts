import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) { }

  resetDatabase(): Observable<any[]> {
    const url = "http://localhost:8080/codexconstruction/util/resetDatabase"

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken() // Ajoutez le token dans le header
    });

    return this.http.get<any[]>(url, { headers: headers });
  }
}
