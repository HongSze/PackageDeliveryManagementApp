import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../services/package.service';
import { Package } from '../../models/package';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-generative',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generative.component.html',
  styleUrls: ['./generative.component.css']
})
export class GenerativeComponent implements OnInit, OnDestroy {
  packages: Package[] = [];
  calculatedDistance: string | null = null;
  private socket: Socket;

  constructor(private packageService: PackageService) {
    this.socket = io(); 
  }

  ngOnInit() {
    this.packageService.getPackages().subscribe((data: Package[]) => {
      this.packages = data;
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('distanceCalculated', (data: { packageId: string, distance: string }) => {
      const pkg = this.packages.find(p => p._id === data.packageId);
      if (pkg) {
        this.calculatedDistance = `The distance from ${pkg.package_destination} to Melbourne is ${data.distance} km.`;
      }
    });

    this.socket.on('distanceCalculationError', (data: { error: string }) => {
      console.error('Distance Calculation Error:', data.error);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  calculateDistance(packageId: string, destination: string) {
    this.calculatedDistance = null; // Reset the calculated distance
    this.socket.emit('calculateDistance', { packageId, destination });
  }
}