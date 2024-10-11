import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Package } from '../../models/package';
import { PackageService } from '../../services/package.service';
import { ConvertkgPipe } from '../../pipes/convertkg.pipe';

@Component({
  selector: 'app-list-packages',
  standalone: true,
  imports: [CommonModule, ConvertkgPipe],
  templateUrl: './list-packages.component.html',
  styleUrl: './list-packages.component.css'
})

export class ListPackagesComponent implements OnInit {
  packages: Package[] = [];

  constructor(private packageService: PackageService) { }

  ngOnInit() {
    this.packageService.getPackages().subscribe((data: Package[]) => {
      this.packages = data;
    });
  }

  trackByPackageId(index: number, packageItem: Package): string {
    return packageItem._id || '';
  }

  onDeletePackage(packageId: string) {
    if (!packageId) {
      console.error('Package ID is undefined');
      return;
    }

    this.packageService.deletePackage(packageId).subscribe({
      next: () => {
        this.packages = this.packages.filter(packageItem => packageItem._id !== packageId);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }
}
