import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../services/package.service';
import { Package } from '../../models/package';

@Component({
  selector: 'app-delete-package',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './delete-package.component.html',
  styleUrl: './delete-package.component.css'
})
export class DeletePackageComponent implements OnInit {
  packages: Package[] = [];
  selectedPackageId: string = '';

  constructor(private packageService: PackageService, private router: Router) {}

  ngOnInit() {
    this.packageService.getPackages().subscribe((data: Package[]) => {
      this.packages = data;
    });
  }

  onDeletePackage() {
    this.packageService.deletePackage(this.selectedPackageId).subscribe({
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