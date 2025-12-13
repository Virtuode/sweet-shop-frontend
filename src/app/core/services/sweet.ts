import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sweet } from '../models/sweet.model';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class SweetService {
  private apiUrl = `${environment.apiUrl}/sweets`;

  constructor(private http: HttpClient) {}

  getAllSweets(): Observable<Sweet[]> {
    return this.http.get<Sweet[]>(this.apiUrl);
  }

  // Search logic [cite: 21]
  searchSweets(query: string): Observable<Sweet[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Sweet[]>(`${this.apiUrl}/search`, { params });
  }

  // Purchase logic [cite: 26]
  purchaseSweet(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/purchase`, {});
  }

  // Admin: Create [cite: 19]
  createSweet(sweet: Sweet): Observable<Sweet> {
    return this.http.post<Sweet>(this.apiUrl, sweet);
  }

  // Admin: Update [cite: 23]
  updateSweet(id: string, sweet: Sweet): Observable<Sweet> {
    return this.http.put<Sweet>(`${this.apiUrl}/${id}`, sweet);
  }

  // Admin: Delete [cite: 24]
  deleteSweet(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}