import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Driver } from '../../models/driver';
import { DriverService } from '../../services/driver.service';
import { UppercasePipe } from '../../pipes/uppercase.pipe';
import { Router } from '@angular/router';
import { Package } from '../../models/package';
import { PackageService } from '../../services/package.service';
import { ConvertkgPipe } from '../../pipes/convertkg.pipe';

@Component({
  selector: 'app-list-drivers',
  standalone: true,
  imports: [CommonModule, UppercasePipe, ConvertkgPipe],
  templateUrl: './list-drivers.component.html',
  styleUrl: './list-drivers.component.css'
})
export class ListDriversComponent {
  drivers: Driver[] = [];
  packages: Package[] = [];
  selectedDriverId: string | null = null;
  selectedDriverPackages: Package[] | null = null;

  constructor(private driverService: DriverService, private packageService: PackageService, private router: Router) { }

  ngOnInit() {
    this.driverService.getDrivers().subscribe((data: Driver[]) => {
      this.drivers = data;
    });

    this.packageService.getPackages().subscribe((data: Package[]) => {
      this.packages = data;
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
        this.router.navigate(['33934479/HongSze/invalid-data']);
      }
    });
  }
  
  showPackages(driverId: string) {
    const driver = this.drivers.find(d => d.driver_id === driverId);
    
    if (driver) {
      this.selectedDriverId = driverId;
      const assignedPackageIds = driver.assigned_packages.map(pkg => pkg._id); 
      this.selectedDriverPackages = this.packages.filter(pkg => {
        const isAssigned = pkg._id && assignedPackageIds.includes(pkg._id);
        return isAssigned;
      });
    } else {
      this.selectedDriverPackages = [];
    }
  }
}
