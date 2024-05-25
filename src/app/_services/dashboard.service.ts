import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/codexconstruction/admin/dashboard'; // Assurez-vous que l'URL est correcte

  constructor(private http: HttpClient) { }

  getDashboardData(year: number): Observable<any> {
    const url = `${this.apiUrl}?year=${year}`;
    return this.http.get<any>(url);
  }
}
