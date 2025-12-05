import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ParkingService, FaturamentoResponse } from '../../services/parking.service';

@Component({
  selector: 'app-billing-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="p-6">
      <h2 class="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
        <mat-icon class="text-purple-600 scale-125">bar_chart</mat-icon>
        Relatório de Faturamento
      </h2>
      
      <!-- Filtros -->
      <mat-card class="mb-6 filter-card">
        <mat-card-content class="p-6">
          <div class="flex flex-wrap gap-6 items-center">
            <div class="date-field-wrapper">
              <label class="date-label">
                <mat-icon class="label-icon">event</mat-icon>
                Data Início
              </label>
              <div class="date-input-container">
                <input 
                  matInput 
                  [matDatepicker]="pickerInicio" 
                  [(ngModel)]="dataInicio"
                  class="date-input"
                  placeholder="Selecione a data">
                <mat-datepicker-toggle [for]="pickerInicio" class="date-toggle">
                  <mat-icon matDatepickerToggleIcon class="calendar-icon">calendar_today</mat-icon>
                </mat-datepicker-toggle>
                <mat-datepicker #pickerInicio></mat-datepicker>
              </div>
            </div>

            <div class="date-field-wrapper">
              <label class="date-label">
                <mat-icon class="label-icon">event</mat-icon>
                Data Fim
              </label>
              <div class="date-input-container">
                <input 
                  matInput 
                  [matDatepicker]="pickerFim" 
                  [(ngModel)]="dataFim"
                  class="date-input"
                  placeholder="Selecione a data">
                <mat-datepicker-toggle [for]="pickerFim" class="date-toggle">
                  <mat-icon matDatepickerToggleIcon class="calendar-icon">calendar_today</mat-icon>
                </mat-datepicker-toggle>
                <mat-datepicker #pickerFim></mat-datepicker>
              </div>
            </div>

            <button 
              mat-raised-button 
              color="primary" 
              (click)="buscar()" 
              [disabled]="loading"
              class="search-btn">
              <mat-icon>search</mat-icon>
              <span>Buscar</span>
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Loading -->
      <div *ngIf="loading" class="flex justify-center p-8">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Resultados -->
      <div *ngIf="!loading && resultado">
        <!-- Cards de Resumo -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <mat-card class="summary-card purple-gradient">
            <mat-card-content class="p-6 flex items-center justify-between">
              <div>
                <p class="text-lg opacity-80 mb-1">Total Faturado</p>
                <h2 class="text-4xl font-bold">{{ resultado.totalFaturado | currency:'BRL' }}</h2>
              </div>
              <mat-icon class="summary-icon">payments</mat-icon>
            </mat-card-content>
          </mat-card>

          <mat-card class="summary-card indigo-gradient">
            <mat-card-content class="p-6 flex items-center justify-between">
              <div>
                <p class="text-lg opacity-80 mb-1">Veículos Atendidos</p>
                <h2 class="text-4xl font-bold">{{ resultado.quantidadeVeiculos }}</h2>
              </div>
              <mat-icon class="summary-icon">directions_car</mat-icon>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Lista de Registros -->
        <mat-card class="records-card">
          <mat-card-header class="p-4 border-b bg-gray-50">
            <mat-card-title class="flex items-center gap-2 m-0">
              <mat-icon class="text-gray-600">receipt_long</mat-icon>
              Detalhamento
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="p-0">
            <div *ngIf="resultado.registros.length === 0" class="p-8 text-center text-gray-500">
              <mat-icon class="scale-[2] mb-4 text-gray-300">search_off</mat-icon>
              <p>Nenhum registro encontrado no período.</p>
            </div>
            
            <div *ngFor="let registro of resultado.registros" class="record-row">
              <div class="flex-1">
                <div class="font-bold text-gray-800 text-lg">{{ registro.veiculo?.placa }}</div>
                <div class="text-gray-600">{{ registro.veiculo?.modelo }}</div>
                <div class="text-sm text-gray-400 mt-1 flex items-center gap-1">
                  <mat-icon class="scale-75">schedule</mat-icon>
                  {{ registro.dataSaida | date:'dd/MM/yyyy HH:mm' }}
                </div>
              </div>
              <div class="value-badge">
                {{ registro.valorTotal | currency:'BRL' }}
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .filter-card {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }

    .date-field-wrapper {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .date-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      color: #475569;
      font-size: 14px;
    }

    .label-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #7c3aed;
    }

    .date-input-container {
      display: flex;
      align-items: center;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 8px 12px;
      transition: all 0.2s ease;
      min-width: 200px;
    }

    .date-input-container:hover {
      border-color: #a78bfa;
    }

    .date-input-container:focus-within {
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }

    .date-input {
      border: none;
      outline: none;
      font-size: 16px;
      color: #1e293b;
      flex: 1;
      background: transparent;
    }

    .date-toggle {
      color: #7c3aed;
    }

    .calendar-icon {
      color: #7c3aed;
    }

    .search-btn {
      height: 48px;
      padding: 0 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      margin-top: auto;
      background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);
      transition: all 0.2s ease;
    }

    .search-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.5);
    }

    .search-btn mat-icon {
      margin-right: 8px;
    }

    .summary-card {
      border-radius: 16px;
      overflow: hidden;
      color: white;
      transition: transform 0.2s ease;
    }

    .summary-card:hover {
      transform: translateY(-4px);
    }

    .purple-gradient {
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4);
    }

    .indigo-gradient {
      background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
      box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
    }

    .summary-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      opacity: 0.3;
    }

    .records-card {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .record-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.2s ease;
    }

    .record-row:hover {
      background: #f8fafc;
    }

    .value-badge {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  `]
})
export class BillingReportComponent implements OnInit {
  dataInicio: Date = new Date();
  dataFim: Date = new Date();
  loading = false;
  resultado: FaturamentoResponse | null = null;

  constructor(
    private parkingService: ParkingService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const hoje = new Date();
    this.dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    this.dataFim = hoje;
  }

  formatDate(date: Date, isEnd: boolean): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time = isEnd ? '23:59:59' : '00:00:00';
    return `${year}-${month}-${day}T${time}`;
  }

  buscar() {
    this.loading = true;
    this.resultado = null;

    const dataInicioStr = this.formatDate(this.dataInicio, false);
    const dataFimStr = this.formatDate(this.dataFim, true);

    console.log('Buscando faturamento:', dataInicioStr, 'até', dataFimStr);

    this.parkingService.getFaturamento(dataInicioStr, dataFimStr).subscribe({
      next: (data) => {
        console.log('Faturamento recebido:', data);
        this.resultado = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar faturamento:', err);
        this.snackBar.open('Erro ao buscar faturamento', 'Fechar', { duration: 3000 });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
