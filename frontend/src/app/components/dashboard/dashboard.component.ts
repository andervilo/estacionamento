import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ParkingService, DashboardData } from '../../services/parking.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <!-- Card Vagas Ocupadas -->
      <mat-card class="bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg rounded-xl overflow-hidden">
        <mat-card-content class="p-6 flex items-center justify-between">
          <div>
            <p class="text-lg opacity-80">Veículos Estacionados</p>
            <h2 class="text-5xl font-bold mt-2">{{ ocupadas }}</h2>
          </div>
          <mat-icon class="scale-[3] opacity-20">directions_car</mat-icon>
        </mat-card-content>
      </mat-card>

      <!-- Card Vagas Disponíveis -->
      <mat-card class="bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg rounded-xl overflow-hidden">
        <mat-card-content class="p-6 flex items-center justify-between">
          <div>
            <p class="text-lg opacity-80">Vagas Disponíveis</p>
            <h2 class="text-5xl font-bold mt-2">{{ disponiveis }}</h2>
          </div>
          <mat-icon class="scale-[3] opacity-20">local_parking</mat-icon>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    mat-card {
      transition: transform 0.2s;
    }
    mat-card:hover {
      transform: translateY(-5px);
    }
  `]
})
export class DashboardComponent implements OnInit {
  ocupadas = 0;
  disponiveis = 0;

  constructor(
    private parkingService: ParkingService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    console.log('DashboardComponent ngOnInit');
    this.loadData();
  }

  loadData() {
    console.log('Loading dashboard data...');
    this.parkingService.getDashboard().subscribe({
      next: (data) => {
        console.log('Dashboard data received:', data);
        this.ocupadas = data.ocupadas;
        this.disponiveis = data.disponiveis;
        this.cdr.detectChanges();
        console.log('Updated values - ocupadas:', this.ocupadas, 'disponiveis:', this.disponiveis);
      },
      error: (err) => {
        console.error('Dashboard error:', err);
      }
    });
  }
}
