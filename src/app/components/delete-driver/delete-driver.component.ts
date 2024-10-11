import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DriverService } from '../../services/driver.service';
import { Driver } from '../../models/driver';

@Component({
  selector: 'app-delete-driver',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './delete-driver.component.html',
  styleUrl: './delete-driver.component.css'
})
export class DeleteDriverComponent implements OnInit {
  drivers: Driver[] = [];
  selectedDriverId: string = '';

  constructor(private driverService: DriverService, private router: Router) {}

  ngOnInit() {
    this.driverService.getDrivers().subscribe((data: Driver[]) => {
      this.drivers = data;
    });
  }

  onDeleteDriver() {
    this.driverService.deleteDriver(this.selectedDriverId).subscribe({
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