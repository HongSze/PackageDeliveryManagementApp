import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stats } from '../models/stats';
import { DriverService } from './driver.service';
import { PackageService } from './package.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = '/api/v1/stats';

  constructor(
    private http: HttpClient,
    private driverService: DriverService,
    private packageService: PackageService
  ) {}

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(this.apiUrl);
  }

  
  getDriversCount(): Observable<number> {
    return new Observable<number>((observer) => {
      this.driverService.getDrivers().subscribe((drivers) => {
        observer.next(drivers.length);
        observer.complete();
      });
    });
  }

  getPackagesCount(): Observable<number> {
    return new Observable<number>((observer) => {
      this.packageService.getPackages().subscribe((packages) => {
        observer.next(packages.length);
        observer.complete();
      });
    });
  }
}
