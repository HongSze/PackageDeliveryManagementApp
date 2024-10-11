import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Package } from '../../models/package';
import { Driver } from '../../models/driver';
import { PackageService } from '../../services/package.service';
import { DriverService } from '../../services/driver.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-package',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-package.component.html',
  styleUrl: './add-package.component.css'
})
export class AddPackageComponent implements OnInit {
  package: Package = new Package();
  drivers: Driver[] = [];

  constructor(
    private packageService: PackageService,
    private driverService: DriverService,
    private router: Router
  ) { }

  addPackage() {
   
    this.packageService.createPackage(this.package).subscribe({
      next: (data: any) => {
        console.log(data);
        this.router.navigate(['33934479/HongSze/list-packages']);
      },
      error: (err: any) => {
        console.error(err);
        this.router.navigate(['33934479/HongSze/invalid-data']);
      }
    });
  }

  ngOnInit() {
    this.driverService.getDrivers().subscribe((data: Driver[]) => {
      this.drivers = data;
    });
  }
}
