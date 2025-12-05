import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Registro } from '../../services/parking.service';

@Component({
    selector: 'app-payment-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title class="text-2xl font-bold">Confirmar Pagamento</h2>
    <mat-dialog-content class="mat-typography">
      <div class="flex flex-col gap-2 text-lg">
        <p><strong>Placa:</strong> {{ data.veiculo.placa }}</p>
        <p><strong>Entrada:</strong> {{ data.dataEntrada | date:'dd/MM/yyyy HH:mm' }}</p>
        <p><strong>Saída:</strong> {{ data.dataSaida | date:'dd/MM/yyyy HH:mm' }}</p>
        <div class="mt-4 p-4 bg-green-100 rounded-lg text-green-800 text-center">
          <p class="text-sm uppercase font-bold">Valor a Pagar</p>
          <p class="text-4xl font-bold">{{ data.valorTotal | currency:'BRL' }}</p>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="gap-2">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true" cdkFocusInitial>Confirmar Pagamento</button>
    </mat-dialog-actions>
  `
})
export class PaymentDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<PaymentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Registro
    ) { }
}
