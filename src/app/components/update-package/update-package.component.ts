import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../services/package.service';
import { Package } from '../../models/package';

@Component({
  selector: 'app-update-package',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-package.component.html',
  styleUrl: './update-package.component.css'
})
export class UpdatePackageComponent implements OnInit {
  package: Package = new Package();
  packageId: string = '';
  packages: Package[] = [];

  constructor(private packageService: PackageService, private router: Router) {}

  ngOnInit() {
    this.packageService.getPackages().subscribe((data: Package[]) => {
      this.packages = data;
    });
  }

  onUpdatePackage() {
    const debugData = {
      packageId: this.packageId,
      packageData: { package_destination: this.package.package_destination }
    };

    console.log('Updating package with ID:', this.packageId);
    console.log('Package data:', debugData.packageData);


    this.packageService.updatePackage(this.packageId, this.package ).subscribe({
      next: () => {
        this.router.navigate(['33934479/HongSze/list-packages']);
      },
      error: (err: any) => {
        console.error(err);
        this.router.navigate(['33934479/HongSze/invalid-data']);
      }
    });
  }
}