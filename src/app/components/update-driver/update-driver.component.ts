import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DriverService } from '../../services/driver.service';
import { Driver } from '../../models/driver';

@Component({
  selector: 'app-update-driver',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-driver.component.html',
  styleUrl: './update-driver.component.css'
})
export class UpdateDriverComponent implements OnInit {
  driver: Driver = new Driver();
  driverId: string = '';
  drivers: Driver[] = [];
  departments: string[] = ['Food', 'Furniture', 'Electronic'];


  constructor(private driverService: DriverService, private router: Router) {}

  ngOnInit() {
    this.driverService.getDrivers().subscribe((data: Driver[]) => {
      this.drivers = data;
    });
  }

  onUpdateDriver() {
    this.driverService.updateDriver(this.driverId, this.driver).subscribe({
      next: () => {
        this.router.navigate(['33934479/HongSze/list-drivers']);
      },
      error: (err: any) => {
        console.error(err);
        this.router.navigate(['33934479/HongSze/invalid-data']);
      }
    });
  }
}