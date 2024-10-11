import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Driver } from '../../models/driver';
import { DriverService } from '../../services/driver.service';
import { UppercasePipe } from '../../pipes/uppercase.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-drivers',
  standalone: true,
  imports: [CommonModule, UppercasePipe],
  templateUrl: './list-drivers.component.html',
  styleUrl: './list-drivers.component.css'
})
export class ListDriversComponent {
  drivers: Driver[] = [];

  constructor(private driverService: DriverService, private router: Router) { }

  ngOnInit() {
    this.driverService.getDrivers().subscribe((data: Driver[]) => {
      this.drivers = data;
    });
  }

  trackByDriverId(index: number, driver: Driver): string {
    return driver.driver_id;
  }

  onDeleteDriver(driverId: string) {
    this.driverService.deleteDriver(driverId).subscribe({
      next: () => {
        this.drivers = this.drivers.filter(driver => driver._id !== driverId);
      },
      error: (err: any) => {
        console.error(err);
        this.router.navigate(['invalid-data']);
      }
    });
  }
}
