import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';
import { Stats } from '../../models/stats';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {
  stats: Stats = new Stats();
  driversCount: number = 0;
  packagesCount: number = 0;

  constructor(private statsService: StatsService) { }

  ngOnInit() {
    this.statsService.getStats().subscribe((data: Stats) => {
      this.stats = data;
    });

    this.statsService.getDriversCount().subscribe((count: number) => {
      this.driversCount = count;
    });

    this.statsService.getPackagesCount().subscribe((count: number) => {
      this.packagesCount = count;
    });
  }
}
