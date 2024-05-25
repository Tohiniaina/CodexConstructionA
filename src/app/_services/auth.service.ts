import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/codexconstruction/auth'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) { }

  // signinAdmin(email: string, password: string): Observable<any> {
  //   let params = new HttpParams()
  //     .set('username', email)
  //     .set('password', password);
  //   return this.http.post<any>(`${this.apiUrl}/authenticateadmin`, null, {params: params});
  // }

  signinAdmin(email: string, password: string): Observable<any> {
    const body = { username: email, password: password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${this.apiUrl}/authenticateadmin`, body, { headers: headers });
  }

  saveTokenAndUser(token: string): void {
    this.tokenStorageService.saveToken(token);
  }

  getToken(): string | null {
    return this.tokenStorageService.getToken();
  }

  logout() {
    this.tokenStorageService.removeToken()
  }
}
