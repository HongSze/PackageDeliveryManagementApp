import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Driver } from '../../models/driver';
import { DriverService } from '../../services/driver.service';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-text-to-speech',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-to-speech.component.html',
  styleUrls: ['./text-to-speech.component.css']
})
export class TextToSpeechComponent implements OnInit, OnDestroy {
  drivers: Driver[] = [];
  audioUrl: string = '';
  private socket: Socket;

  constructor(private driverService: DriverService) {
    this.socket = io(); 
  }

  ngOnInit() {
    console.log('TextToSpeechComponent initialized');
    this.driverService.getDrivers().subscribe((data: Driver[]) => {
      this.drivers = data;
      console.log('Drivers loaded:', this.drivers);
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('audioReady', (data: { filePath: string }) => {
      console.log('Audio ready:', data.filePath);
      this.audioUrl = `${data.filePath}`;
      const audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;
      if (audioPlayer) {
        audioPlayer.load();
        audioPlayer.play();
      }
    });

    this.socket.on('audioError', (data: { error: string }) => {
      console.error('Audio Error:', data.error);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  convertToSpeech(driver: Driver) {
    console.log('Converting to speech:', driver.driver_licence);
    this.socket.emit('textToSpeech', { text: driver.driver_licence });
  }
}