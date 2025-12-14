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
  searchSweets(filter : any): Observable<Sweet[]> {
    let params = new HttpParams();
  
    if(filter.name) {
      params = params.set('q',filter.name);
    }

    if(filter.category) {
      params = params.set('category', filter.category);
    }

    if (filter.minPrice) {
        params = params.set('minPrice', filter.minPrice);
    }
    if (filter.maxPrice) {
        params = params.set('maxPrice', filter.maxPrice);
    }

    return this.http.get<Sweet[]>(`${this.apiUrl}/search`, { params });
}

  // Purchase logic [cite: 26]
  purchaseSweet(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/purchase`, {});
  }


  createSweet(sweet: Sweet): Observable<Sweet> {
    return this.http.post<Sweet>(this.apiUrl, sweet);
  }

  updateSweet(id: string, sweet: Sweet): Observable<Sweet> {
    return this.http.put<Sweet>(`${this.apiUrl}/${id}`, sweet);
  }

  deleteSweet(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}