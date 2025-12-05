import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ParkingService } from '../../services/parking.service';
import { Router } from '@angular/router';
import { EntryReceiptComponent } from '../entry-receipt/entry-receipt.component';

@Component({
  selector: 'app-entry-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="flex justify-center p-6">
      <mat-card class="entry-card">
        <mat-card-header class="card-header">
          <div class="header-icon">
            <mat-icon>directions_car</mat-icon>
          </div>
          <mat-card-title class="card-title">Registrar Entrada</mat-card-title>
          <mat-card-subtitle class="card-subtitle">Preencha os dados do veículo</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content class="p-6">
          <form (ngSubmit)="onSubmit()" #form="ngForm" class="flex flex-col gap-5">
            
            <!-- Placa -->
            <div class="field-wrapper">
              <label class="field-label">
                <mat-icon class="label-icon">badge</mat-icon>
                Placa do Veículo *
              </label>
              <div class="input-container" [class.focused]="placaFocused" [class.filled]="placa">
                <mat-icon class="input-icon">pin</mat-icon>
                <input 
                  [(ngModel)]="placa" 
                  name="placa" 
                  required 
                  placeholder="ABC-1234"
                  class="custom-input"
                  (focus)="placaFocused = true"
                  (blur)="placaFocused = false"
                  style="text-transform: uppercase;">
              </div>
            </div>

            <!-- Modelo -->
            <div class="field-wrapper">
              <label class="field-label">
                <mat-icon class="label-icon">directions_car</mat-icon>
                Modelo do Veículo *
              </label>
              <div class="input-container" [class.focused]="modeloFocused" [class.filled]="modelo">
                <mat-icon class="input-icon">drive_eta</mat-icon>
                <input 
                  [(ngModel)]="modelo" 
                  name="modelo" 
                  required 
                  placeholder="Ex: Toyota Corolla"
                  class="custom-input"
                  (focus)="modeloFocused = true"
                  (blur)="modeloFocused = false">
              </div>
            </div>

            <!-- Cor e Tipo em 2 colunas -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Cor -->
              <div class="field-wrapper">
                <label class="field-label">
                  <mat-icon class="label-icon">palette</mat-icon>
                  Cor
                </label>
                <div class="input-container" [class.focused]="corFocused" [class.filled]="cor">
                  <mat-icon class="input-icon">format_paint</mat-icon>
                  <select 
                    [(ngModel)]="cor" 
                    name="cor"
                    class="custom-input custom-select"
                    (focus)="corFocused = true"
                    (blur)="corFocused = false">
                    <option value="">Selecione...</option>
                    <option value="Branco">Branco</option>
                    <option value="Preto">Preto</option>
                    <option value="Prata">Prata</option>
                    <option value="Cinza">Cinza</option>
                    <option value="Vermelho">Vermelho</option>
                    <option value="Azul">Azul</option>
                    <option value="Verde">Verde</option>
                    <option value="Amarelo">Amarelo</option>
                    <option value="Marrom">Marrom</option>
                    <option value="Bege">Bege</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <!-- Tipo -->
              <div class="field-wrapper">
                <label class="field-label">
                  <mat-icon class="label-icon">category</mat-icon>
                  Tipo
                </label>
                <div class="input-container" [class.focused]="tipoFocused" [class.filled]="tipo">
                  <mat-icon class="input-icon">commute</mat-icon>
                  <select 
                    [(ngModel)]="tipo" 
                    name="tipo"
                    class="custom-input custom-select"
                    (focus)="tipoFocused = true"
                    (blur)="tipoFocused = false">
                    <option value="">Selecione...</option>
                    <option value="Carro">Carro</option>
                    <option value="Moto">Moto</option>
                    <option value="Caminhonete">Caminhonete</option>
                    <option value="Van">Van</option>
                    <option value="Caminhão">Caminhão</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              mat-raised-button 
              type="submit" 
              [disabled]="!form.valid || loading"
              class="submit-btn">
              <mat-icon *ngIf="!loading">login</mat-icon>
              <mat-icon *ngIf="loading" class="spin">sync</mat-icon>
              <span>{{ loading ? 'Registrando...' : 'Registrar Entrada' }}</span>
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .entry-card {
      width: 100%;
      max-width: 520px;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    }

    .card-header {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .header-icon {
      width: 72px;
      height: 72px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .header-icon mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: white;
    }

    .card-title {
      color: white !important;
      font-size: 24px !important;
      font-weight: 700 !important;
      margin: 0 !important;
    }

    .card-subtitle {
      color: rgba(255, 255, 255, 0.8) !important;
      margin-top: 8px !important;
    }

    .field-wrapper {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .field-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #475569;
      font-size: 14px;
    }

    .label-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #3b82f6;
    }

    .input-container {
      display: flex;
      align-items: center;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 16px;
      transition: all 0.2s ease;
      gap: 12px;
    }

    .input-container:hover {
      border-color: #93c5fd;
    }

    .input-container.focused {
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .input-container.filled {
      background: #f0f9ff;
    }

    .input-icon {
      color: #94a3b8;
      font-size: 22px;
      width: 22px;
      height: 22px;
      transition: color 0.2s ease;
    }

    .input-container.focused .input-icon {
      color: #3b82f6;
    }

    .custom-input {
      border: none;
      outline: none;
      font-size: 16px;
      color: #1e293b;
      flex: 1;
      background: transparent;
      font-weight: 500;
    }

    .custom-input::placeholder {
      color: #cbd5e1;
      font-weight: 400;
    }

    .custom-select {
      cursor: pointer;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
    }

    .submit-btn {
      height: 56px;
      border-radius: 14px;
      font-weight: 600;
      font-size: 16px;
      margin-top: 8px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
      transition: all 0.2s ease;
      color: white;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
    }

    .submit-btn:disabled {
      background: #cbd5e1;
      box-shadow: none;
    }

    .submit-btn mat-icon {
      margin-right: 8px;
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class EntryFormComponent {
  placa = '';
  modelo = '';
  cor = '';
  tipo = '';
  loading = false;
  placaFocused = false;
  modeloFocused = false;
  corFocused = false;
  tipoFocused = false;

  constructor(
    private parkingService: ParkingService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) { }

  onSubmit() {
    if (this.placa && this.modelo) {
      this.loading = true;
      this.parkingService.registrarEntrada(
        this.placa.toUpperCase(),
        this.modelo,
        this.cor,
        this.tipo
      ).subscribe({
        next: (res) => {
          this.loading = false;
          // Open receipt dialog
          this.dialog.open(EntryReceiptComponent, {
            data: res,
            width: '400px',
            disableClose: true
          }).afterClosed().subscribe(() => {
            this.router.navigate(['/dashboard']);
          });
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open('Erro ao registrar entrada', 'Fechar', { duration: 5000 });
        }
      });
    }
  }
}
