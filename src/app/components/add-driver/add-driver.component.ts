import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Driver } from '../../models/driver';
import { DriverService } from '../../services/driver.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-driver.component.html',
  styleUrl: './add-driver.component.css'
})
export class AddDriverComponent {

  driver: Driver = new Driver();

  constructor(private db: DriverService, private router: Router) { }

  addDriver() {
  
    this.db.createDriver(this.driver).subscribe({
      next: (data: any) => {
        console.log(data);
        this.router.navigate(['33934479/HongSze/list-drivers']);
      },
      error: (err: any) => {
        console.error(err);
        this.router.navigate(['33934479/HongSze/invalid-data']);
      }
    });
  }
}
