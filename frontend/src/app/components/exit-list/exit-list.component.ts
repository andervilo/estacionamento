import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ParkingService, Registro } from '../../services/parking.service';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { PaymentReceiptComponent } from '../payment-receipt/payment-receipt.component';

@Component({
  selector: 'app-exit-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Veículos Estacionados ({{ registros.length }})</h2>
      
      <div *ngIf="loading" class="flex justify-center p-8">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="error" class="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
        {{ error }}
      </div>
      
      <div *ngIf="!loading && registros.length === 0" class="p-8 text-center text-gray-500 bg-white rounded-xl shadow">
        Nenhum veículo estacionado no momento.
      </div>

      <div *ngIf="!loading && registros.length > 0" class="grid gap-4">
        <mat-card *ngFor="let registro of registros" class="shadow-lg">
          <mat-card-content class="flex items-center justify-between p-4">
            <div class="flex-1">
              <div class="text-xl font-bold text-gray-800">{{ registro.veiculo?.placa }}</div>
              <div class="text-gray-600">{{ registro.veiculo?.modelo }}</div>
              <div class="text-sm text-gray-400 mt-1">
                Entrada: {{ registro.dataEntrada | date:'dd/MM/yyyy HH:mm' }}
              </div>
            </div>
            <button mat-raised-button color="warn" (click)="onExit(registro)">
              <mat-icon>exit_to_app</mat-icon>
              Dar Saída
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `
})
export class ExitListComponent implements OnInit {
  registros: Registro[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private parkingService: ParkingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadRegistros();
  }

  loadRegistros() {
    this.loading = true;
    this.error = null;

    this.parkingService.listarAbertos().subscribe({
      next: (data) => {
        this.registros = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Erro ao carregar veículos: ' + (err.message || JSON.stringify(err));
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onExit(registro: Registro) {
    this.parkingService.calcularSaida(registro.id).subscribe({
      next: (calculado) => {
        const dialogRef = this.dialog.open(PaymentDialogComponent, {
          width: '400px',
          data: calculado
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.confirmPayment(registro.id);
          }
        });
      },
      error: (err) => {
        this.snackBar.open('Erro ao calcular saída.', 'Fechar', { duration: 3000 });
      }
    });
  }

  confirmPayment(id: number) {
    this.parkingService.confirmarPagamento(id).subscribe({
      next: (paidRegistro) => {
        // Open payment receipt dialog
        this.dialog.open(PaymentReceiptComponent, {
          width: '400px',
          data: paidRegistro,
          disableClose: true
        }).afterClosed().subscribe(() => {
          this.loadRegistros();
        });
      },
      error: (err) => {
        this.snackBar.open('Erro ao confirmar pagamento.', 'Fechar', { duration: 3000 });
      }
    });
  }
}
