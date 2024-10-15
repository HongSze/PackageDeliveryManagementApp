import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Package } from '../../models/package';
import { PackageService } from '../../services/package.service';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-translate-description',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './translate-description.component.html',
  styleUrls: ['./translate-description.component.css']
})
export class TranslateDescriptionComponent implements OnInit, OnDestroy {
  packages: Package[] = [];
  selectedLanguage: string = 'zh'; // Default to Chinese
  translatedDescription: string = '';
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

    this.socket.on('translationReady', (data: { translatedText: string }) => {
      console.log('Translation ready:', data.translatedText);
      this.translatedDescription = data.translatedText;
    });

    this.socket.on('translationError', (data: { error: string }) => {
      console.error('Translation Error:', data.error);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  translateDescription(packageDescription: string) {
    if (packageDescription.trim() === '') {
      console.error('Package description is empty.');
      return;
    }
    console.log('Emitting translateText event:', { text: packageDescription, targetLanguage: this.selectedLanguage });
    this.socket.emit('translateText', { text: packageDescription, targetLanguage: this.selectedLanguage });
  }
}