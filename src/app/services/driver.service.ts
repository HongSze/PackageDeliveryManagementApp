import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models/driver';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private apiUrl = '/api/v1/drivers';

  constructor(private http: HttpClient) {}

  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl);
  }

  createDriver(data: object) {
    return this.http.post(`${this.apiUrl}/add`, data, httpOptions);
  }

  updateDriver(id: string, data: object) {
    let url = `${this.apiUrl}/update`;
    return this.http.put(url, { id, ...data }, httpOptions);
  }

  deleteDriver(id: string) {
    let url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<void>(url);
  }
}