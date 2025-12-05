import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Registro } from '../../services/parking.service';

@Component({
    selector: 'app-payment-receipt',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
    <div class="receipt-container" id="printableReceipt">
      <!-- Header -->
      <div class="receipt-header">
        <div class="logo">
          <mat-icon class="logo-icon">local_parking</mat-icon>
          <span class="logo-text">ParkFlow</span>
        </div>
        <h2 class="receipt-title">COMPROVANTE DE PAGAMENTO</h2>
        <div class="paid-badge">
          <mat-icon>check_circle</mat-icon>
          PAGO
        </div>
      </div>

      <!-- Divider -->
      <div class="divider dashed"></div>

      <!-- Ticket Number -->
      <div class="ticket-number">
        <span class="ticket-label">Nº do Ticket</span>
        <span class="ticket-value">#{{ data.id.toString().padStart(6, '0') }}</span>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Vehicle Info -->
      <div class="info-section">
        <div class="info-row highlight">
          <mat-icon>badge</mat-icon>
          <div class="info-content">
            <span class="info-label">PLACA</span>
            <span class="info-value plate">{{ data.veiculo?.placa }}</span>
          </div>
        </div>

        <div class="info-row">
          <mat-icon>directions_car</mat-icon>
          <div class="info-content">
            <span class="info-label">Veículo</span>
            <span class="info-value">{{ data.veiculo?.modelo }}</span>
          </div>
        </div>

        <div class="info-row" *ngIf="data.veiculo?.cor">
          <mat-icon>palette</mat-icon>
          <div class="info-content">
            <span class="info-label">Cor</span>
            <span class="info-value">{{ data.veiculo?.cor }}</span>
          </div>
        </div>

        <div class="info-row" *ngIf="data.veiculo?.tipo">
          <mat-icon>category</mat-icon>
          <div class="info-content">
            <span class="info-label">Tipo</span>
            <span class="info-value">{{ data.veiculo?.tipo }}</span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Time Info -->
      <div class="time-grid">
        <div class="time-box entry">
          <mat-icon>login</mat-icon>
          <div class="time-content">
            <span class="time-label">Entrada</span>
            <span class="time-date">{{ data.dataEntrada | date:'dd/MM/yyyy' }}</span>
            <span class="time-hour">{{ data.dataEntrada | date:'HH:mm' }}</span>
          </div>
        </div>
        <div class="time-box exit">
          <mat-icon>logout</mat-icon>
          <div class="time-content">
            <span class="time-label">Saída</span>
            <span class="time-date">{{ data.dataSaida | date:'dd/MM/yyyy' }}</span>
            <span class="time-hour">{{ data.dataSaida | date:'HH:mm' }}</span>
          </div>
        </div>
      </div>

      <!-- Duration -->
      <div class="duration-section">
        <mat-icon>schedule</mat-icon>
        <span>Permanência: <strong>{{ calcularPermanencia() }}</strong></span>
      </div>

      <!-- Divider -->
      <div class="divider dashed"></div>

      <!-- Payment Info -->
      <div class="payment-section">
        <div class="payment-label">VALOR PAGO</div>
        <div class="payment-value">{{ data.valorTotal | currency:'BRL' }}</div>
        <div class="payment-status">
          <mat-icon>verified</mat-icon>
          Pagamento Confirmado
        </div>
      </div>

      <!-- Divider -->
      <div class="divider dashed"></div>

      <!-- Footer -->
      <div class="receipt-footer">
        <p class="footer-date">{{ now | date:'dd/MM/yyyy HH:mm:ss' }}</p>
        <p class="footer-thanks">Obrigado pela preferência!</p>
        <p class="footer-note">Volte sempre</p>
      </div>
    </div>

    <!-- Action Buttons (não aparece na impressão) -->
    <div class="action-buttons no-print">
      <button mat-stroked-button (click)="close()">
        <mat-icon>close</mat-icon>
        Fechar
      </button>
      <button mat-raised-button color="primary" (click)="print()">
        <mat-icon>print</mat-icon>
        Imprimir
      </button>
    </div>
  `,
    styles: [`
    .receipt-container {
      width: 320px;
      background: white;
      padding: 24px;
      font-family: 'Courier New', monospace;
    }

    .receipt-header {
      text-align: center;
      margin-bottom: 16px;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #3b82f6;
    }

    .logo-text {
      font-size: 24px;
      font-weight: bold;
      color: #1e293b;
    }

    .receipt-title {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 12px 0;
      letter-spacing: 1px;
    }

    .paid-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 14px;
    }

    .paid-badge mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .divider {
      border-bottom: 1px solid #e2e8f0;
      margin: 16px 0;
    }

    .divider.dashed {
      border-bottom-style: dashed;
    }

    .ticket-number {
      text-align: center;
      padding: 12px;
      background: #f0f9ff;
      border-radius: 8px;
    }

    .ticket-label {
      display: block;
      font-size: 11px;
      color: #64748b;
      margin-bottom: 4px;
    }

    .ticket-value {
      font-size: 28px;
      font-weight: bold;
      color: #3b82f6;
      letter-spacing: 2px;
    }

    .info-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .info-row mat-icon {
      color: #94a3b8;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .info-row.highlight {
      background: #fef3c7;
      padding: 12px;
      border-radius: 8px;
      margin: 0 -12px;
    }

    .info-row.highlight mat-icon {
      color: #d97706;
    }

    .info-content {
      display: flex;
      flex-direction: column;
    }

    .info-label {
      font-size: 10px;
      color: #94a3b8;
      text-transform: uppercase;
    }

    .info-value {
      font-size: 14px;
      color: #1e293b;
      font-weight: 500;
    }

    .info-value.plate {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 2px;
    }

    .time-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .time-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border-radius: 8px;
    }

    .time-box.entry {
      background: #f0f9ff;
    }

    .time-box.entry mat-icon {
      color: #3b82f6;
    }

    .time-box.exit {
      background: #fef3c7;
    }

    .time-box.exit mat-icon {
      color: #d97706;
    }

    .time-content {
      display: flex;
      flex-direction: column;
    }

    .time-label {
      font-size: 10px;
      color: #64748b;
      text-transform: uppercase;
    }

    .time-date {
      font-size: 11px;
      color: #475569;
    }

    .time-hour {
      font-size: 16px;
      font-weight: bold;
      color: #1e293b;
    }

    .duration-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      background: #f1f5f9;
      border-radius: 8px;
      margin-top: 12px;
      font-size: 14px;
      color: #475569;
    }

    .duration-section mat-icon {
      color: #64748b;
    }

    .payment-section {
      text-align: center;
      padding: 16px;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-radius: 12px;
      border: 2px solid #22c55e;
    }

    .payment-label {
      font-size: 11px;
      color: #16a34a;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .payment-value {
      font-size: 36px;
      font-weight: bold;
      color: #15803d;
      margin-bottom: 8px;
    }

    .payment-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 12px;
      color: #22c55e;
      font-weight: 500;
    }

    .payment-status mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .receipt-footer {
      text-align: center;
    }

    .footer-date {
      font-size: 11px;
      color: #94a3b8;
      margin: 0 0 8px 0;
    }

    .footer-thanks {
      font-size: 14px;
      color: #64748b;
      font-weight: bold;
      margin: 0 0 4px 0;
    }

    .footer-note {
      font-size: 12px;
      color: #94a3b8;
      margin: 0;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .action-buttons button mat-icon {
      margin-right: 8px;
    }

    @media print {
      .no-print {
        display: none !important;
      }

      .receipt-container {
        width: 80mm;
        padding: 8mm;
      }
    }
  `]
})
export class PaymentReceiptComponent {
    now = new Date();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Registro,
        private dialogRef: MatDialogRef<PaymentReceiptComponent>
    ) { }

    calcularPermanencia(): string {
        const entrada = new Date(this.data.dataEntrada);
        const saida = new Date(this.data.dataSaida!);
        const diffMs = saida.getTime() - entrada.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;

        if (hours > 0) {
            return `${hours}h ${mins}min`;
        }
        return `${mins}min`;
    }

    print() {
        window.print();
    }

    close() {
        this.dialogRef.close();
    }
}
