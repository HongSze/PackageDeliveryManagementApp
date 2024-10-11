import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Package } from '../models/package';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private apiUrl = '/api/v1/packages';

  constructor(private http: HttpClient) {}

  getPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(this.apiUrl);
  }

  createPackage(data: object) {
    return this.http.post(`${this.apiUrl}/add`, data, httpOptions);
  }

  updatePackage(id: string, data: object) {
    let url = `${this.apiUrl}/update`;
    return this.http.put(url, { id, ...data }, httpOptions);
  }

  deletePackage(id: string) {
    let url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete(url, httpOptions);
  }
}