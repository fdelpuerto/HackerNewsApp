import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading()">
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    </div>
  `,
  styleUrls: ['./loading-indicator.component.css']
})
export class LoadingIndicatorComponent {
  
  loading = this.loadingService.loading;

  constructor(private loadingService: LoadingService) { }
}
